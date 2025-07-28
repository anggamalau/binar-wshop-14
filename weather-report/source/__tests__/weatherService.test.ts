import {
  getWeatherForCity,
  getHistoricalWeather,
  processAndAnalyzeWeatherData,
} from '../weatherService';
import { getDb } from '../database';

// Mock the database module
jest.mock('../database', () => ({
  getDb: jest.fn(),
}));

const mockDb = {
  run: jest.fn(),
  all: jest.fn(),
};

describe('weatherService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getDb as jest.Mock).mockReturnValue(mockDb);

    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getWeatherForCity', () => {
    it('should return weather data for a city', async () => {
      mockDb.run.mockImplementation((query, callback) => {
        callback(null);
      });

      const result = await getWeatherForCity('London');

      expect(result).toHaveProperty('city', 'London');
      expect(result).toHaveProperty('temperature');
      expect(result).toHaveProperty('conditions');
      expect(result).toHaveProperty('humidity');
      expect(result).toHaveProperty('wind_speed');
      expect(result).toHaveProperty('date_recorded');
      expect(typeof result.temperature).toBe('number');
      expect(result.temperature).toBeGreaterThanOrEqual(5);
      expect(result.temperature).toBeLessThanOrEqual(40);
    });

    it('should handle database save errors gracefully', async () => {
      mockDb.run.mockImplementation((query, callback) => {
        callback(new Error('Database error'));
      });

      const result = await getWeatherForCity('London');

      // Should still return weather data even if save fails
      expect(result).toHaveProperty('city', 'London');
    });

    it('should generate random weather conditions', async () => {
      mockDb.run.mockImplementation((query, callback) => {
        callback(null);
      });

      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(await getWeatherForCity('TestCity'));
      }

      // Check that we get various conditions
      const conditions = results.map((r) => r.conditions);
      const uniqueConditions = [...new Set(conditions)];

      // Should have some variety in conditions (not all the same)
      expect(uniqueConditions.length).toBeGreaterThan(0);
      expect(conditions.every((c) => ['Sunny', 'Cloudy', 'Rainy', 'Stormy'].includes(c!))).toBe(
        true
      );
    });
  });

  describe('getHistoricalWeather', () => {
    it('should return historical weather data for a city', async () => {
      const mockData = [
        { city: 'London', temperature: 20, conditions: 'Sunny', date_recorded: '2023-01-01' },
        { city: 'London', temperature: 18, conditions: 'Cloudy', date_recorded: '2023-01-02' },
      ];

      mockDb.all.mockImplementation((query, callback) => {
        callback(null, mockData);
      });

      const result = await getHistoricalWeather('London');

      expect(result).toEqual(mockData);
      expect(mockDb.all).toHaveBeenCalledWith(
        "SELECT * FROM weather_data WHERE city = 'London'",
        expect.any(Function)
      );
    });

    it('should include date filter when provided', async () => {
      mockDb.all.mockImplementation((query, callback) => {
        callback(null, []);
      });

      await getHistoricalWeather('London', '2023-01-01');

      expect(mockDb.all).toHaveBeenCalledWith(
        "SELECT * FROM weather_data WHERE city = 'London' AND date_recorded >= '2023-01-01'",
        expect.any(Function)
      );
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      mockDb.all.mockImplementation((query, callback) => {
        callback(dbError, null);
      });

      await expect(getHistoricalWeather('London')).rejects.toThrow('Database connection failed');
    });
  });

  describe('processAndAnalyzeWeatherData', () => {
    const mockWeatherData = [
      { city: 'London', temperature: 20, humidity: 60, wind_speed: 10 },
      { city: 'London', temperature: 25, humidity: 70, wind_speed: 15 },
      { city: 'London', temperature: 15, humidity: 50, wind_speed: 5 },
    ];

    it('should calculate temperature statistics correctly', () => {
      const result = processAndAnalyzeWeatherData(mockWeatherData);

      expect(result.temperature.high).toBe(25);
      expect(result.temperature.low).toBe(15);
      expect(result.temperature.average).toBe(20);
    });

    it('should calculate humidity statistics correctly', () => {
      const result = processAndAnalyzeWeatherData(mockWeatherData);

      expect(result.humidity.high).toBe(70);
      expect(result.humidity.low).toBe(50);
      expect(result.humidity.average).toBe(60);
    });

    it('should calculate wind speed statistics correctly', () => {
      const result = processAndAnalyzeWeatherData(mockWeatherData);

      expect(result.wind_speed.high).toBe(15);
      expect(result.wind_speed.low).toBe(5);
      expect(result.wind_speed.average).toBe(10);
    });

    it('should generate weather summary', () => {
      const result = processAndAnalyzeWeatherData(mockWeatherData);

      expect(result.summary).toBeDefined();
      expect(typeof result.summary).toBe('string');
      expect(result.summary.length).toBeGreaterThan(0);
    });

    it('should handle single data point', () => {
      const singleData = [{ city: 'London', temperature: 20, humidity: 60, wind_speed: 10 }];
      const result = processAndAnalyzeWeatherData(singleData);

      expect(result.temperature.high).toBe(20);
      expect(result.temperature.low).toBe(20);
      expect(result.temperature.average).toBe(20);
    });

    it('should handle extreme values', () => {
      const extremeData = [
        { city: 'Test', temperature: -10, humidity: 0, wind_speed: 0 },
        { city: 'Test', temperature: 50, humidity: 100, wind_speed: 100 },
      ];

      const result = processAndAnalyzeWeatherData(extremeData);

      expect(result.temperature.high).toBe(50);
      expect(result.temperature.low).toBe(-10);
      expect(result.temperature.average).toBe(20);
      expect(result.humidity.high).toBe(100);
      expect(result.humidity.low).toBe(0);
      expect(result.wind_speed.high).toBe(100);
      expect(result.wind_speed.low).toBe(0);
    });
  });
});
