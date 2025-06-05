# Backend Server Installation & Run Instructions

## Prerequisites
- **Node.js** v18 or higher ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node.js)
- (Optional) **Docker** if you want to run the server in a container

## Installation Steps

1. **Clone the repository and navigate to the backend directory:**
   ```sh
   cd company/backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - If required, create a `.env` file in this directory and add necessary environment variables (e.g., MongoDB connection string). Check with your team or codebase for required variables.

4. **Run the server:**
   ```sh
   npm start
   ```
   - The server will start on port 3000 by default.

5. **(Optional) Build the project:**
   ```sh
   npm run build
   ```
   - This compiles TypeScript to JavaScript.

6. **(Optional) Run with Docker:**
   - Build the Docker image:
     ```sh
     docker build -t backend-server .
     ```
   - Run the Docker container:
     ```sh
     docker run -p 3000:3000 backend-server
     ```

---

Feel free to update this file with additional details as your project evolves.
