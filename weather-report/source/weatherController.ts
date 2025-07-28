import { Request, Response } from 'express';
import { getWeatherForCity, getHistoricalWeather, processAndAnalyzeWeatherData } from '../services/weatherService';
import { getDb } from '../config/database';

// Controller with poorly named variables and code smells
export async function getWeather(req: Request, res: Response): Promise<void> {
  try {
    // No input validation (vulnerability)
    const c = req.query.city as string;
    
    if (!c) {
      res.status(400).json({ error: 'City parameter is required' });
      return;
    }
    
    const data = await getWeatherForCity(c);
    res.json({
      success: true,
      data: data
    });
  } catch (e: any) {
    console.error('Controller error:', e);
    res.status(500).json({ 
      success: false, 
      error: e.message,
      stack: e.stack // Exposing error details (vulnerability)
    });
  }
}

// Function with duplicate code (code smell)
export async function getCityHistory(req: Request, res: Response): Promise<void> {
  try {
    // No input validation (vulnerability)
    const c = req.params.city as string;
    const d = req.query.from as string;
    
    if (!c) {
      res.status(400).json({ error: 'City parameter is required' });
      return;
    }
    
    const data = await getHistoricalWeather(c, d);
    res.json({
      success: true,
      data: data
    });
  } catch (e: any) {
    console.error('Controller error:', e);
    res.status(500).json({ 
      success: false, 
      error: e.message,
      stack: e.stack // Exposing error details (vulnerability)
    });
  }
}

// Very long function with multiple responsibilities (code smell)
export async function getWeatherAnalysis(req: Request, res: Response): Promise<void> {
  try {
    // SQL Injection vulnerability
    const city = req.params.city;
    const db = getDb();
    
    // Direct user input in SQL query (vulnerability)
    db.all(`SELECT * FROM weather_data WHERE city = '${city}'`, async (err: any, rows: any) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (rows.length === 0) {
        res.status(404).json({ error: 'No data found for this city' });
        return;
      }
      
      // Process the data
      const analysis = processAndAnalyzeWeatherData(rows);
      
      // Return the result
      res.json({
        success: true,
        city: city,
        dataPoints: rows.length,
        analysis: analysis
      });
    });
  } catch (e: any) {
    console.error('Analysis error:', e);
    res.status(500).json({ 
      success: false, 
      error: e.message 
    });
  }
}

// Zombie function - never used
export async function exportWeatherData(req: Request, res: Response): Promise<void> {
  // This function is never used in the routes
  const format = req.query.format || 'json';
  const city = req.query.city as string;
  
  if (!city) {
    res.status(400).json({ error: 'City parameter is required' });
    return;
  }
  
  try {
    const data = await getHistoricalWeather(city);
    
    if (format === 'csv') {
      // Code to convert to CSV
      let csv = 'id,city,temperature,conditions,humidity,wind_speed,date_recorded\n';
      data.forEach(item => {
        csv += `${item.id},${item.city},${item.temperature},${item.conditions},${item.humidity},${item.wind_speed},${item.date_recorded}\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="weather_${city}.csv"`);
      res.send(csv);
    } else {
      res.json(data);
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

// Function with hardcoded credentials (vulnerability)
export function adminLogin(req: Request, res: Response): void {
  const { username, password } = req.body;
  
  // Hardcoded credentials (serious vulnerability)
  if (username === 'admin' && password === 'admin123') {
    res.json({
      success: true,
      token: 'hardcoded-jwt-token-that-never-expires'
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
}
