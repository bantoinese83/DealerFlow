import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePhone,
  validateVIN,
  validateSSN,
  validatePassword,
  validateURL,
  validateDate,
  validateDateRange,
  validateAge,
  validateCreditCard,
  validateZipCode,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateMin,
  validateMax,
  validateRange,
  validatePattern,
  validateOneOf,
  validateAllOf,
  validateUnique,
  validateFileSize,
  validateFileType,
} from '@/common/utils/validation'

describe('validation utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('test+tag@example.org')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhone('1234567890')).toBe(true)
      expect(validatePhone('(123) 456-7890')).toBe(true)
      expect(validatePhone('123-456-7890')).toBe(true)
      expect(validatePhone('+1234567890')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false)
      expect(validatePhone('123456789')).toBe(false)
      expect(validatePhone('abc-def-ghij')).toBe(false)
      expect(validatePhone('')).toBe(false)
    })
  })

  describe('validateVIN', () => {
    it('should validate correct VINs', () => {
      expect(validateVIN('1HGBH41JXMN109186')).toBe(true)
      expect(validateVIN('1HGBH41JXMN109186'.toLowerCase())).toBe(true)
    })

    it('should reject invalid VINs', () => {
      expect(validateVIN('1HGBH41JXMN10918')).toBe(false) // Too short
      expect(validateVIN('1HGBH41JXMN1091867')).toBe(false) // Too long
      expect(validateVIN('1HGBH41JXMN10918I')).toBe(false) // Contains I
      expect(validateVIN('')).toBe(false)
    })
  })

  describe('validateSSN', () => {
    it('should validate correct SSNs', () => {
      expect(validateSSN('123-45-6789')).toBe(true)
      expect(validateSSN('123456789')).toBe(true)
    })

    it('should reject invalid SSNs', () => {
      expect(validateSSN('123-45-678')).toBe(false) // Too short
      expect(validateSSN('123-45-67890')).toBe(false) // Too long
      expect(validateSSN('abc-def-ghij')).toBe(false) // Non-numeric
      expect(validateSSN('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongPass123!')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject weak passwords', () => {
      const result = validatePassword('weak')
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should check for required character types', () => {
      const result1 = validatePassword('nouppercase123!')
      expect(result1.errors).toContain('Password must contain at least one uppercase letter')

      const result2 = validatePassword('NOLOWERCASE123!')
      expect(result2.errors).toContain('Password must contain at least one lowercase letter')

      const result3 = validatePassword('NoNumbers!')
      expect(result3.errors).toContain('Password must contain at least one number')

      const result4 = validatePassword('NoSpecial123')
      expect(result4.errors).toContain('Password must contain at least one special character')
    })
  })

  describe('validateURL', () => {
    it('should validate correct URLs', () => {
      expect(validateURL('https://example.com')).toBe(true)
      expect(validateURL('http://example.com')).toBe(true)
      expect(validateURL('https://subdomain.example.com/path')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(validateURL('not-a-url')).toBe(false)
      expect(validateURL('ftp://example.com')).toBe(false)
      expect(validateURL('')).toBe(false)
    })
  })

  describe('validateDate', () => {
    it('should validate correct dates', () => {
      expect(validateDate('2023-12-25')).toBe(true)
      expect(validateDate('2023-12-25T14:30:00Z')).toBe(true)
      expect(validateDate(new Date().toISOString())).toBe(true)
    })

    it('should reject invalid dates', () => {
      expect(validateDate('invalid-date')).toBe(false)
      expect(validateDate('2023-13-25')).toBe(false)
      expect(validateDate('')).toBe(false)
    })
  })

  describe('validateDateRange', () => {
    it('should validate correct date ranges', () => {
      expect(validateDateRange('2023-01-01', '2023-12-31')).toBe(true)
      expect(validateDateRange('2023-12-25', '2023-12-25')).toBe(true)
    })

    it('should reject invalid date ranges', () => {
      expect(validateDateRange('2023-12-31', '2023-01-01')).toBe(false)
      expect(validateDateRange('invalid', '2023-12-31')).toBe(false)
    })
  })

  describe('validateAge', () => {
    it('should validate age correctly', () => {
      const today = new Date()
      const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
      const seventeenYearsAgo = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate())

      expect(validateAge(eighteenYearsAgo.toISOString())).toBe(true)
      expect(validateAge(seventeenYearsAgo.toISOString())).toBe(false)
    })
  })

  describe('validateCreditCard', () => {
    it('should validate credit card numbers', () => {
      const result = validateCreditCard('4111111111111111')
      expect(result.isValid).toBe(true)
      expect(result.type).toBe('Visa')
    })

    it('should reject invalid credit card numbers', () => {
      const result = validateCreditCard('1234567890123456')
      expect(result.isValid).toBe(false)
    })
  })

  describe('validateZipCode', () => {
    it('should validate US zip codes', () => {
      expect(validateZipCode('12345')).toBe(true)
      expect(validateZipCode('12345-6789')).toBe(true)
    })

    it('should validate Canadian postal codes', () => {
      expect(validateZipCode('K1A 0A6', 'CA')).toBe(true)
    })
  })

  describe('validateRequired', () => {
    it('should validate required values', () => {
      expect(validateRequired('test')).toBe(true)
      expect(validateRequired(123)).toBe(true)
      expect(validateRequired(['item'])).toBe(true)
    })

    it('should reject empty values', () => {
      expect(validateRequired('')).toBe(false)
      expect(validateRequired(null)).toBe(false)
      expect(validateRequired(undefined)).toBe(false)
      expect(validateRequired([])).toBe(false)
    })
  })

  describe('validateMinLength', () => {
    it('should validate minimum length', () => {
      expect(validateMinLength('test', 3)).toBe(true)
      expect(validateMinLength('test', 4)).toBe(true)
      expect(validateMinLength('test', 5)).toBe(false)
    })
  })

  describe('validateMaxLength', () => {
    it('should validate maximum length', () => {
      expect(validateMaxLength('test', 5)).toBe(true)
      expect(validateMaxLength('test', 4)).toBe(true)
      expect(validateMaxLength('test', 3)).toBe(false)
    })
  })

  describe('validateMin', () => {
    it('should validate minimum value', () => {
      expect(validateMin(5, 3)).toBe(true)
      expect(validateMin(3, 3)).toBe(true)
      expect(validateMin(2, 3)).toBe(false)
    })
  })

  describe('validateMax', () => {
    it('should validate maximum value', () => {
      expect(validateMax(3, 5)).toBe(true)
      expect(validateMax(5, 5)).toBe(true)
      expect(validateMax(6, 5)).toBe(false)
    })
  })

  describe('validateRange', () => {
    it('should validate value in range', () => {
      expect(validateRange(3, 1, 5)).toBe(true)
      expect(validateRange(1, 1, 5)).toBe(true)
      expect(validateRange(5, 1, 5)).toBe(true)
      expect(validateRange(0, 1, 5)).toBe(false)
      expect(validateRange(6, 1, 5)).toBe(false)
    })
  })

  describe('validatePattern', () => {
    it('should validate against regex pattern', () => {
      expect(validatePattern('test', /^[a-z]+$/)).toBe(true)
      expect(validatePattern('Test', /^[a-z]+$/)).toBe(false)
    })
  })

  describe('validateOneOf', () => {
    it('should validate value is one of options', () => {
      expect(validateOneOf('a', ['a', 'b', 'c'])).toBe(true)
      expect(validateOneOf('d', ['a', 'b', 'c'])).toBe(false)
    })
  })

  describe('validateAllOf', () => {
    it('should validate all values are in options', () => {
      expect(validateAllOf(['a', 'b'], ['a', 'b', 'c'])).toBe(true)
      expect(validateAllOf(['a', 'd'], ['a', 'b', 'c'])).toBe(false)
    })
  })

  describe('validateUnique', () => {
    it('should validate array has unique values', () => {
      expect(validateUnique([1, 2, 3])).toBe(true)
      expect(validateUnique([1, 2, 2])).toBe(false)
    })

    it('should validate array has unique values by key', () => {
      const items = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 3, name: 'c' }
      ]
      expect(validateUnique(items, 'id')).toBe(true)
      expect(validateUnique(items, 'name')).toBe(true)
    })
  })

  describe('validateFileSize', () => {
    it('should validate file size', () => {
      const file: any = { size: 1024 * 1024 } // 1MB
      expect(validateFileSize(file, 2)).toBe(true)
      expect(validateFileSize(file, 0.5)).toBe(false)
    })
  })

  describe('validateFileType', () => {
    it('should validate file type', () => {
      const file: any = { type: 'text/plain' }
      expect(validateFileType(file, ['text/plain', 'text/html'])).toBe(true)
      expect(validateFileType(file, ['image/jpeg', 'image/png'])).toBe(false)
    })
  })
})
