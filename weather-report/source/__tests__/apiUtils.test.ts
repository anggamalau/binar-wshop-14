import { 
  doStuff, 
  formatDate, 
  dateFormat, 
  calculateAverageTemperature, 
  calculateMedianTemperature 
} from '../apiUtils';

describe('apiUtils', () => {
  describe('doStuff', () => {
    it('should deep clone simple objects', () => {
      const input = { name: 'test', value: 42 };
      const result = doStuff(input);
      
      expect(result).toEqual(input);
      expect(result).not.toBe(input);
    });

    it('should handle arrays', () => {
      const input = [1, 2, 3];
      const result = doStuff(input);
      
      expect(result).toEqual(input);
      expect(result).not.toBe(input);
    });

    it('should handle null', () => {
      expect(doStuff(null)).toBeNull();
    });

    it('should handle strings and numbers', () => {
      expect(doStuff('test')).toBe('test');
      expect(doStuff(42)).toBe(42);
    });
  });

  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2023-12-25');
      const result = formatDate(date);
      expect(result).toBe('2023-12-25');
    });

    it('should format string date correctly', () => {
      const result = formatDate('2023-12-25');
      expect(result).toBe('2023-12-25');
    });

    it('should return NaN values for invalid date', () => {
      const result = formatDate('invalid-date');
      expect(result).toContain('NaN');
    });

    it('should pad single digit months and days', () => {
      const date = new Date('2023-01-05');
      const result = formatDate(date);
      expect(result).toBe('2023-01-05');
    });
  });

  describe('dateFormat', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2023-12-25');
      const result = dateFormat(date);
      expect(result).toBe('2023-12-25');
    });

    it('should format string date correctly', () => {
      const result = dateFormat('2023-12-25');
      expect(result).toBe('2023-12-25');
    });

    it('should return NaN values for invalid date', () => {
      const result = dateFormat('invalid-date');
      expect(result).toContain('NaN');
    });

    it('should pad single digit months and days', () => {
      const date = new Date('2023-01-05');
      const result = dateFormat(date);
      expect(result).toBe('2023-01-05');
    });
  });

  describe('calculateAverageTemperature', () => {
    it('should calculate average of positive numbers', () => {
      const temperatures = [20, 25, 30];
      const result = calculateAverageTemperature(temperatures);
      expect(result).toBe(25);
    });

    it('should handle negative temperatures', () => {
      const temperatures = [-10, 0, 10];
      const result = calculateAverageTemperature(temperatures);
      expect(result).toBe(0);
    });

    it('should return 0 for empty array', () => {
      const result = calculateAverageTemperature([]);
      expect(result).toBe(0);
    });

    it('should handle single temperature', () => {
      const result = calculateAverageTemperature([15]);
      expect(result).toBe(15);
    });

    it('should handle decimal temperatures', () => {
      const temperatures = [20.5, 25.5];
      const result = calculateAverageTemperature(temperatures);
      expect(result).toBe(23);
    });
  });

  describe('calculateMedianTemperature', () => {
    it('should calculate median for odd number of elements', () => {
      const temperatures = [10, 20, 30];
      const result = calculateMedianTemperature(temperatures);
      expect(result).toBe(20);
    });

    it('should calculate median for even number of elements', () => {
      const temperatures = [10, 20, 30, 40];
      const result = calculateMedianTemperature(temperatures);
      expect(result).toBe(25);
    });

    it('should return 0 for empty array', () => {
      const result = calculateMedianTemperature([]);
      expect(result).toBe(0);
    });

    it('should handle single temperature', () => {
      const result = calculateMedianTemperature([15]);
      expect(result).toBe(15);
    });

    it('should handle unsorted array', () => {
      const temperatures = [30, 10, 20];
      const result = calculateMedianTemperature(temperatures);
      expect(result).toBe(20);
    });

    it('should handle negative temperatures', () => {
      const temperatures = [-10, 0, 10];
      const result = calculateMedianTemperature(temperatures);
      expect(result).toBe(0);
    });

    it('should not modify original array', () => {
      const temperatures = [30, 10, 20];
      const originalOrder = [...temperatures];
      calculateMedianTemperature(temperatures);
      expect(temperatures).toEqual(originalOrder);
    });
  });
});