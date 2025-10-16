"use client"

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { Card } from '@/components/ui/Card'

type ConversationRow = Database['public']['Tables']['conversations']['Row']

export default function ConversationsPage() {
  const supabase = createClientComponentClient()
  const [messages, setMessages] = useState<ConversationRow[]>([])

  useEffect(() => {
    let ignore = false
    const load = async () => {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50)
      if (!ignore) setMessages(data ?? [])
    }
    load()

    const channel = supabase
      .channel('conversations-list')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'conversations' }, load)
      .subscribe()

    return () => {
      ignore = true
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Conversations</h1>
        <p className="text-gray-300 mt-2">Latest AI and lead messages</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {messages.map(m => (
          <Card key={m.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">{new Date(m.timestamp).toLocaleString()}</div>
              <div className="text-xs px-2 py-1 rounded cosmic-border text-white capitalize">{m.participant}</div>
            </div>
            <div className="mt-2 text-white whitespace-pre-wrap">{m.message}</div>
          </Card>
        ))}
        {messages.length === 0 && (
          <Card className="p-6 text-gray-300">No messages yet.</Card>
        )}
      </div>
    </div>
  )
}


