// Utility file with various code smells and zombie code

// Poor function naming (code smell)
export function doStuff(data: any): any {
  return JSON.parse(JSON.stringify(data));
}

// Function with security vulnerability - eval is dangerous
export function dynamicEval(expression: string): any {
  // Dangerous use of eval (security vulnerability)
  return eval(expression);
}

// Inconsistent error handling (code smell)
export function formatDate(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  } catch (e) {
    // Inconsistent error handling
    console.log('Error formatting date');
    return '';
  }
}

// Duplicate code - similar to formatDate (code smell)
export function dateFormat(dateInput: Date | string): string {
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}

// Zombie code - unused functions below
export function calculateAverageTemperature(temperatures: number[]): number {
  if (temperatures.length === 0) return 0;
  const sum = temperatures.reduce((acc, curr) => acc + curr, 0);
  return sum / temperatures.length;
}

export function calculateMedianTemperature(temperatures: number[]): number {
  if (temperatures.length === 0) return 0;
  
  // Sort temperatures
  const sorted = [...temperatures].sort((a, b) => a - b);
  
  // Calculate median
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
}

// Function with hardcoded credentials (vulnerability)
export function getApiCredentials(): { key: string, secret: string } {
  // Hardcoded API credentials (vulnerability)
  return {
    key: 'api-key-1234567890',
    secret: 'api-secret-abcdefghijk'
  };
}

// Commented out but still present (zombie code)
/*
export function calculateWindChillIndex(temperature: number, windSpeed: number): number {
  if (temperature > 10) return temperature; // Wind chill only applies when temp <= 10°C
  
  // Formula: 13.12 + 0.6215*T - 11.37*V^0.16 + 0.3965*T*V^0.16
  // where T = air temperature (°C), V = wind speed (km/h)
  return 13.12 + 
         0.6215 * temperature - 
         11.37 * Math.pow(windSpeed, 0.16) + 
         0.3965 * temperature * Math.pow(windSpeed, 0.16);
}

export function calculateHeatIndex(temperature: number, humidity: number): number {
  if (temperature < 27) return temperature; // Heat index only applies when temp >= 27°C
  
  // Simplified formula
  return 0.5 * (temperature + 61.0 + ((temperature - 68.0) * 1.2) + (humidity * 0.094));
}
*/
