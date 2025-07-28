import { Request, Response } from 'express';
import { 
  getWeather, 
  getCityHistory, 
  getWeatherAnalysis, 
  adminLogin 
} from '../weatherController';
import * as weatherService from '../weatherService';
import { getDb } from '../database';

// Mock the weather service module
jest.mock('../weatherService');
jest.mock('../database');

const mockWeatherService = weatherService as jest.Mocked<typeof weatherService>;

describe('weatherController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockDb: any;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    
    mockResponse = {
      json: mockJson,
      status: mockStatus
    };

    mockRequest = {
      query: {},
      params: {},
      body: {}
    };

    mockDb = {
      all: jest.fn()
    };

    (getDb as jest.Mock).mockReturnValue(mockDb);

    // Mock console methods
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('getWeather', () => {
    it('should return weather data for valid city', async () => {
      const mockWeatherData = {
        city: 'London',
        temperature: 20,
        conditions: 'Sunny',
        humidity: 60,
        wind_speed: 10
      };

      mockRequest.query = { city: 'London' };
      mockWeatherService.getWeatherForCity.mockResolvedValue(mockWeatherData);

      await getWeather(mockRequest as Request, mockResponse as Response);

      expect(mockWeatherService.getWeatherForCity).toHaveBeenCalledWith('London');
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockWeatherData
      });
    });

    it('should return 400 error when city parameter is missing', async () => {
      mockRequest.query = {};

      await getWeather(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'City parameter is required'
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockRequest.query = { city: 'London' };
      mockWeatherService.getWeatherForCity.mockRejectedValue(error);

      await getWeather(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Service error',
        stack: error.stack
      });
    });
  });

  describe('getCityHistory', () => {
    it('should return historical weather data', async () => {
      const mockHistoricalData = [
        { city: 'London', temperature: 20, date_recorded: '2023-01-01' },
        { city: 'London', temperature: 18, date_recorded: '2023-01-02' }
      ];

      mockRequest.params = { city: 'London' };
      mockRequest.query = { from: '2023-01-01' };
      mockWeatherService.getHistoricalWeather.mockResolvedValue(mockHistoricalData);

      await getCityHistory(mockRequest as Request, mockResponse as Response);

      expect(mockWeatherService.getHistoricalWeather).toHaveBeenCalledWith('London', '2023-01-01');
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockHistoricalData
      });
    });

    it('should return 400 error when city parameter is missing', async () => {
      mockRequest.params = {};

      await getCityHistory(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'City parameter is required'
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      mockRequest.params = { city: 'London' };
      mockWeatherService.getHistoricalWeather.mockRejectedValue(error);

      await getCityHistory(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Database error',
        stack: error.stack
      });
    });
  });

  describe('getWeatherAnalysis', () => {
    it('should return weather analysis when data exists', async () => {
      const mockDbRows = [
        { city: 'London', temperature: 20, humidity: 60, wind_speed: 10 },
        { city: 'London', temperature: 25, humidity: 70, wind_speed: 15 }
      ];

      const mockAnalysis = {
        temperature: { high: 25, low: 20, average: 22.5 },
        humidity: { high: 70, low: 60, average: 65 },
        wind_speed: { high: 15, low: 10, average: 12.5 },
        summary: 'Warm. Humid. Calm winds.'
      };

      mockRequest.params = { city: 'London' };
      mockDb.all.mockImplementation((query, callback) => {
        callback(null, mockDbRows);
      });
      mockWeatherService.processAndAnalyzeWeatherData.mockReturnValue(mockAnalysis);

      await getWeatherAnalysis(mockRequest as Request, mockResponse as Response);

      expect(mockWeatherService.processAndAnalyzeWeatherData).toHaveBeenCalledWith(mockDbRows);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        city: 'London',
        dataPoints: 2,
        analysis: mockAnalysis
      });
    });

    it('should return 404 when no data found', async () => {
      mockRequest.params = { city: 'NonExistentCity' };
      mockDb.all.mockImplementation((query, callback) => {
        callback(null, []);
      });

      await getWeatherAnalysis(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'No data found for this city'
      });
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      mockRequest.params = { city: 'London' };
      mockDb.all.mockImplementation((query, callback) => {
        callback(dbError, null);
      });

      await getWeatherAnalysis(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Database connection failed'
      });
    });
  });

  describe('adminLogin', () => {
    it('should return success for valid credentials', () => {
      mockRequest.body = { username: 'admin', password: 'admin123' };

      adminLogin(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        token: 'hardcoded-jwt-token-that-never-expires'
      });
    });

    it('should return 401 for invalid username', () => {
      mockRequest.body = { username: 'wronguser', password: 'admin123' };

      adminLogin(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid credentials'
      });
    });

    it('should return 401 for invalid password', () => {
      mockRequest.body = { username: 'admin', password: 'wrongpassword' };

      adminLogin(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid credentials'
      });
    });

    it('should return 401 for missing credentials', () => {
      mockRequest.body = {};

      adminLogin(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid credentials'
      });
    });
  });
});