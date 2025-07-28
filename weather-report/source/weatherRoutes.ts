import express from 'express';
import { 
  getWeather, 
  getCityHistory, 
  getWeatherAnalysis, 
  adminLogin 
} from '../controllers/weatherController';

export const weatherRoutes = express.Router();

// Basic routes without proper authentication or rate limiting (vulnerability)
weatherRoutes.get('/current', getWeather);
weatherRoutes.get('/history/:city', getCityHistory);
weatherRoutes.get('/analysis/:city', getWeatherAnalysis);
weatherRoutes.post('/admin/login', adminLogin);

// No authentication middleware for admin routes (vulnerability)

// Commented out code - zombie code
/*
weatherRoutes.get('/forecast', async (req, res) => {
  // This route was removed but the code was left behind
  try {
    const city = req.query.city;
    const days = req.query.days || 3;
    
    // Forecast logic here
    
    res.json({ message: 'Forecast feature coming soon' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/

// No input validation on this route (vulnerability)
weatherRoutes.get('/search', (req: any, res: any) => {
  const query = req.query.q;
  
  // This should validate the query parameter but doesn't
  res.json({
    message: `Searching for ${query}`,
    results: [] // Empty results for now
  });
});
