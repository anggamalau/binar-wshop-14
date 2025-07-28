import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { weatherRoutes } from './routes/weatherRoutes';
import { initDb } from './config/database';

// Load env vars (but we'll still hardcode some secrets as a vulnerability)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev')); // Logging middleware with default config (vulnerability)
app.use(cors()); // Open CORS policy (vulnerability)
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
initDb();

// Routes
app.use('/api/weather', weatherRoutes);

// Basic error handler - very generic (vulnerability: doesn't hide implementation details)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message,
    stack: err.stack // Exposing stack trace is a security vulnerability
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Zombie code - unused function that never gets called
function checkSystemHealth() {
  console.log('Checking system health...');
  
  // More dead code
  const memoryUsage = process.memoryUsage();
  const cpuInfo = require('os').cpus();
  
  return {
    status: 'ok',
    memory: memoryUsage,
    cpu: cpuInfo
  };
}

/* 
  Commented out code that doesn't do anything useful
  This is just here to demonstrate a code smell
  
  function oldAuthFunction(user, pass) {
    if (user === 'admin' && pass === 'password') {
      return true;
    }
    return false;
  }
*/

export default app;
