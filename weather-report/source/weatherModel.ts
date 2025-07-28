export interface WeatherData {
  id?: number;
  city: string;
  temperature?: number;
  conditions?: string;
  humidity?: number;
  wind_speed?: number;
  date_recorded?: string;
}

// Poorly defined interface with inconsistent naming (code smell)
export interface UsrPrefs {
  usrId: number;
  favoriteCity: string;
  tempratureUnit: string; // Intentional typo as a code smell
  notificationsEnabled: boolean;
}

// Duplicate code - similar to UsrPrefs (code smell)
export interface UserSettings {
  userId: number;
  defaultCity: string;
  tempUnit: string;
  notifications: boolean;
}

// Zombie interface - not used anywhere
export interface OldWeatherFormat {
  cityName: string;
  temp: number;
  sky_condition: string;
  humidity_percentage: number;
  wind: {
    speed: number;
    direction: string;
  };
  recorded: Date;
}
