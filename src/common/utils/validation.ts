/**
 * Validation utility functions
 */

import { z } from 'zod'

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
export const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/
export const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/

export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  return phoneRegex.test(cleaned) && cleaned.length >= 10
}

export const validateVIN = (vin: string): boolean => {
  return vinRegex.test(vin.toUpperCase())
}

export const validateSSN = (ssn: string): boolean => {
  return ssnRegex.test(ssn)
}

export const validatePassword = (password: string): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateURL = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

export const validateDateRange = (startDate: string, endDate: string): boolean => {
  if (!validateDate(startDate) || !validateDate(endDate)) {
    return false
  }
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return start <= end
}

export const validateAge = (birthDate: string, minAge = 18): boolean => {
  if (!validateDate(birthDate)) {
    return false
  }
  
  const birth = new Date(birthDate)
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minAge
  }
  
  return age >= minAge
}

export const validateCreditCard = (cardNumber: string): {
  isValid: boolean
  type?: string
} => {
  const cleaned = cardNumber.replace(/\D/g, '')
  
  // Luhn algorithm
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i))
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  const isValid = sum % 10 === 0
  
  // Determine card type
  let type: string | undefined
  
  if (cleaned.startsWith('4')) {
    type = 'Visa'
  } else if (cleaned.startsWith('5') || cleaned.startsWith('2')) {
    type = 'Mastercard'
  } else if (cleaned.startsWith('3')) {
    type = 'American Express'
  } else if (cleaned.startsWith('6')) {
    type = 'Discover'
  }
  
  return { isValid, type }
}

export const validateZipCode = (zipCode: string, country = 'US'): boolean => {
  if (country === 'CA') {
    // Canadian postal code format: A1A 1A1 or A1A1A1
    return /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(zipCode.trim())
  }
  const cleaned = zipCode.replace(/\D/g, '')
  switch (country) {
    case 'US':
      return cleaned.length === 5 || cleaned.length === 9
    default:
      return cleaned.length >= 3 && cleaned.length <= 10
  }
}

export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) {
    return false
  }
  
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  
  if (Array.isArray(value)) {
    return value.length > 0
  }
  
  return true
}

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength
}

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength
}

export const validateMin = (value: number, min: number): boolean => {
  return value >= min
}

export const validateMax = (value: number, max: number): boolean => {
  return value <= max
}

export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

export const validatePattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value)
}

export const validateOneOf = (value: any, options: any[]): boolean => {
  return options.includes(value)
}

export const validateAllOf = (value: any[], options: any[]): boolean => {
  return value.every(v => options.includes(v))
}

export const validateUnique = (value: any[], key?: string): boolean => {
  if (key) {
    const values = value.map(item => item[key])
    return values.length === new Set(values).size
  }
  return value.length === new Set(value).size
}

export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
}

export const validateImageDimensions = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve(img.width <= maxWidth && img.height <= maxHeight)
    }
    img.onerror = () => resolve(false)
    img.src = URL.createObjectURL(file)
  })
}

// Zod validation helpers
export const createValidationSchema = <T extends z.ZodTypeAny>(
  schema: T,
  customErrorMap?: z.ZodErrorMap
) => {
  if (customErrorMap) {
    z.setErrorMap(customErrorMap)
  }
  return schema
}

export const validateWithZod = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

export const safeParseWithZod = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}
