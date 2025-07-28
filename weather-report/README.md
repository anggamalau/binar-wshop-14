# Weather Checker App Backend

A simple weather checker application backend with TypeScript, Express, and SQLite.

## Warning

This project is **intentionally insecure** and contains:
- Code smells
- Hardcoded secrets
- SQL injection vulnerabilities
- Zombie code (unused code)

It is meant for educational purposes only to demonstrate common security and code quality issues.

## Project Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start

# Run in development mode
npm run dev
```

## API Endpoints

- `GET /api/weather/current?city={city}` - Get current weather for a city
- `GET /api/weather/history/{city}?from={date}` - Get weather history for a city
- `GET /api/weather/analysis/{city}` - Get weather analysis for a city
- `POST /api/weather/admin/login` - Admin login (username: admin, password: admin123)

## Security Issues (Intentional)

This application intentionally contains the following security issues:

1. **Hardcoded Secrets**: API keys and database credentials are hardcoded in the source code
2. **SQL Injection**: User input is directly concatenated into SQL queries
3. **Exposed Error Details**: Stack traces are returned to the client
4. **No Input Validation**: User input is used without proper validation
5. **Insecure Dependencies**: Using outdated packages with known vulnerabilities
6. **Dangerous Use of eval()**: Dynamic evaluation of code

## Code Quality Issues (Intentional)

1. **Zombie Code**: Unused functions and commented code fragments
2. **Code Smells**: Functions with multiple responsibilities, poor naming conventions
3. **Duplicate Code**: Similar functions repeated with slight variations
4. **Inconsistent Error Handling**: Different approaches to error handling throughout the codebase
