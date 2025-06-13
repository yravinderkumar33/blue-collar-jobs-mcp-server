# Blue Collar Careers Frontend (Company A)

This is the frontend for the Blue Collar Careers platform, specifically for Company A. It is fully integrated with the backend service (`backend-company-a`) and fetches all job and application data from the backend API. No mock data is used—everything is live from the backend database.

## Features
- Browse and search for jobs
- View detailed job descriptions
- Apply for jobs with a user-friendly form
- View and manage job applications
- Responsive and accessible UI

## Setup & Usage

### Prerequisites
- Node.js (v18 or higher)
- The backend service (`backend-company-a`) must be running and accessible (default: http://localhost:3000)

### Local Development
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
   The app will be available at http://localhost:8080 (or the port specified in your Docker setup).

### Docker Compose
- This frontend is included in the main `docker-compose.yaml` and will run on port 8080.
- The environment variable `VITE_API_URL` is set to point to the backend API (e.g., `http://localhost:3000/api`).

## Backend Integration
- All job and application data is fetched from the backend via REST API calls.
- No mock data or static job lists are used.
- Ensure the backend is seeded with job data for the best experience.

## Project Structure
- `src/` — Main source code (components, pages, services)
- `public/` — Static assets
- `Dockerfile` — For containerized builds

## Notes
- If you encounter any issues with data loading, ensure the backend is running and accessible at the configured API URL.
- For development, you can change the API URL by setting `VITE_API_URL` in a `.env` file or via Docker Compose.

---

For more details, see the backend README or contact the project maintainer.
