# MiMapa

**MiMapa** is a full-stack project for storing and visualizing user maps. Users can add markers to indicate the cities they have visited, creating a personalized travel map.

## Key Features
- **Backend:** Built with FastAPI, providing a robust API for managing user maps and markers.
- **Frontend:** Developed using Node.js, React, and Vite for a modern, responsive user interface.
- **Database:** MongoDB for efficient and scalable data storage.
- **Maps:** OpenStreetMap integration for interactive map creation and visualization.
- **Authentication:** Firebase (OAuth) for secure Google authentication.

## Repository Structure
- `server/`: Contains the FastAPI backend.
- `client/`: Contains the Node.js + React + Vite frontend.

## Running Locally
To run the application locally, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/macorisd/mi-mapa.git
   cd mi-mapa
   ```

2. **Install Frontend Modules**
   - Run the batch file `install_node_modules.bat` to install all necessary Node.js modules for the frontend.

3. **Install Backend Dependencies**
   - Navigate to the `server` directory:
     ```bash
     cd server
     ```
   - Install the required Python packages using `requirements.txt`:
     ```bash
     pip install -r requirements.txt
     ```

4. **Start the Application**
   - Run the batch file `start_app.bat`.
   - This will open two terminal windows: one for the FastAPI backend and another for the React frontend.

## Deployment
The application is deployed on Vercel and can be accessed at: [MiMapa on Vercel](https://mi-mapa-client.vercel.app/).

## Requirements
- Python (latest version recommended)
- Node.js (latest stable version)