/**
 * Utility functions for formatting F1 related data
 */
class DataFormatter {
    /**
     * Format lap time to a readable string
     * @param {number} timeInMilliseconds 
     * @returns {string} Formatted lap time
     */
    static formatLapTime(timeInMilliseconds) {
      if (!timeInMilliseconds) return 'N/A'
      
      const minutes = Math.floor(timeInMilliseconds / 60000)
      const seconds = ((timeInMilliseconds % 60000) / 1000).toFixed(3)
      
      return `${minutes}:${seconds.padStart(6, '0')}`
    }
  
    /**
     * Format driver name (Last, First)
     * @param {string} firstName 
     * @param {string} lastName 
     * @returns {string} Formatted name
     */
    static formatDriverName(firstName, lastName) {
      return `${lastName}, ${firstName}`
    }
  
    /**
     * Convert kilometers per hour to miles per hour
     * @param {number} kph 
     * @returns {number} Speed in mph
     */
    static kphToMph(kph) {
      return Number((kph * 0.621371).toFixed(2))
    }
  
    /**
     * Format large numbers with commas
     * @param {number} number 
     * @returns {string} Formatted number
     */
    static formatLargeNumber(number) {
      return number.toLocaleString('en-US')
    }
  
    /**
     * Calculate points difference between two values
     * @param {number} value1 
     * @param {number} value2 
     * @returns {string} Formatted difference
     */
    static calculatePointsDifference(value1, value2) {
      const diff = Math.abs(value1 - value2)
      return diff > 0 ? `+${diff}` : '0'
    }
  }
  
  export default DataFormatter