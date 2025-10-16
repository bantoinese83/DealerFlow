import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatPhoneNumber,
  formatMileage,
  formatFileSize,
  formatDuration,
  formatAddress,
  formatName,
  formatInitials,
  formatStatus,
  formatCamelCase,
  formatSnakeCase,
  formatKebabCase,
} from '@/common/utils/format'

describe('format utilities', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,235')
      expect(formatCurrency(0)).toBe('$0')
      expect(formatCurrency(999999)).toBe('$999,999')
    })

    it('should handle different currencies', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,235')
      expect(formatCurrency(1234.56, 'GBP')).toBe('£1,235')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1234)).toBe('1,234')
      expect(formatNumber(1234567)).toBe('1,234,567')
      expect(formatNumber(0)).toBe('0')
    })
  })

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(0.1234)).toBe('12.3%')
      expect(formatPercentage(0.5)).toBe('50.0%')
      expect(formatPercentage(1)).toBe('100.0%')
    })

    it('should handle custom decimal places', () => {
      expect(formatPercentage(0.1234, 2)).toBe('12.34%')
      expect(formatPercentage(0.1234, 0)).toBe('12%')
    })
  })

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2023-12-25T12:00:00Z')
      // Accept either 24th or 25th depending on timezone, but ensure month/year
      const out = formatDate(date)
      expect(out.endsWith(', 2023')).toBe(true)
      expect(out.startsWith('Dec ')).toBe(true)
    })

    it('should handle string dates', () => {
      const out = formatDate('2023-12-25T12:00:00Z')
      expect(out.includes('2023')).toBe(true)
      expect(out.startsWith('Dec ')).toBe(true)
    })

    it('should handle custom options', () => {
      const date = new Date('2023-12-25T12:00:00Z')
      expect(formatDate(date, { year: 'numeric' })).toBe('2023')
    })
  })

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2023-12-25T14:30:00')
      expect(formatDateTime(date)).toBe('Dec 25, 2023, 02:30 PM')
    })
  })

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2023-12-25T14:30:00')
      expect(formatTime(date)).toBe('02:30 PM')
    })
  })

  describe('formatRelativeTime', () => {
    it('should format relative time correctly', () => {
      const now = new Date()
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000)
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      expect(formatRelativeTime(oneMinuteAgo)).toBe('1m ago')
      expect(formatRelativeTime(oneHourAgo)).toBe('1h ago')
      expect(formatRelativeTime(oneDayAgo)).toBe('1d ago')
    })

    it('should handle just now', () => {
      const now = new Date()
      expect(formatRelativeTime(now)).toBe('Just now')
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format US phone numbers correctly', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890')
      expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890')
      expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890')
    })

    it('should handle non-standard numbers', () => {
      expect(formatPhoneNumber('123')).toBe('123')
      expect(formatPhoneNumber('+1234567890')).toBe('(123) 456-7890')
    })
  })

  describe('formatMileage', () => {
    it('should format mileage correctly', () => {
      expect(formatMileage(12345)).toBe('12,345 mi')
      expect(formatMileage(0)).toBe('0 mi')
    })
  })

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })
  })

  describe('formatDuration', () => {
    it('should format duration correctly', () => {
      expect(formatDuration(3661)).toBe('1h 1m 1s')
      expect(formatDuration(61)).toBe('1m 1s')
      expect(formatDuration(30)).toBe('30s')
    })
  })

  describe('formatAddress', () => {
    it('should format address correctly', () => {
      const address = {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'USA'
      }
      expect(formatAddress(address)).toBe('123 Main St, Anytown, CA, 12345, USA')
    })

    it('should handle partial addresses', () => {
      const address = {
        city: 'Anytown',
        state: 'CA'
      }
      expect(formatAddress(address)).toBe('Anytown, CA')
    })
  })

  describe('formatName', () => {
    it('should format full names correctly', () => {
      expect(formatName('John', 'Doe')).toBe('John Doe')
      expect(formatName('John')).toBe('John')
    })
  })

  describe('formatInitials', () => {
    it('should format initials correctly', () => {
      expect(formatInitials('John', 'Doe')).toBe('JD')
      expect(formatInitials('John')).toBe('J')
    })
  })

  describe('formatStatus', () => {
    it('should format status correctly', () => {
      expect(formatStatus('new_lead')).toBe('New Lead')
      expect(formatStatus('in_progress')).toBe('In Progress')
    })
  })

  describe('formatCamelCase', () => {
    it('should format camelCase correctly', () => {
      expect(formatCamelCase('camelCase')).toBe('Camel Case')
      expect(formatCamelCase('firstName')).toBe('First Name')
    })
  })

  describe('formatSnakeCase', () => {
    it('should format snake_case correctly', () => {
      expect(formatSnakeCase('camelCase')).toBe('camel_case')
      expect(formatSnakeCase('firstName')).toBe('first_name')
    })
  })

  describe('formatKebabCase', () => {
    it('should format kebab-case correctly', () => {
      expect(formatKebabCase('camelCase')).toBe('camel-case')
      expect(formatKebabCase('firstName')).toBe('first-name')
    })
  })
})
