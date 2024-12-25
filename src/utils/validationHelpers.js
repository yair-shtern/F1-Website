/**
 * Utility class for form and data validation
 */
class ValidationHelpers {
    /**
     * Validate email address
     * @param {string} email 
     * @returns {boolean}
     */
    static validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
  
    /**
     * Validate password strength
     * @param {string} password 
     * @returns {object} Validation result
     */
    static validatePassword(password) {
      const validations = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      }
  
      return {
        isValid: Object.values(validations).every(Boolean),
        details: validations
      }
    }
  
    /**
     * Sanitize input to prevent XSS
     * @param {string} input 
     * @returns {string}
     */
    static sanitizeInput(input) {
      const div = document.createElement('div')
      div.textContent = input
      return div.innerHTML
    }
  
    /**
     * Validate F1 driver number
     * @param {number} number 
     * @returns {boolean}
     */
    static validateDriverNumber(number) {
      return number > 0 && number <= 99
    }
  
    /**
     * Validate race date
     * @param {string} dateString 
     * @returns {boolean}
     */
    static validateRaceDate(dateString) {
      const date = new Date(dateString)
      return date instanceof Date && !isNaN(date)
    }
  }
  
  export default ValidationHelpers