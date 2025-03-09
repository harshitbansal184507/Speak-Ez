# Speak-Ez

Speak-Ez is a chatbot-based application designed to enhance user interaction using AI-powered conversational services. This repository contains both the backend and frontend components, along with Docker support for containerized deployment.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Using Docker](#using-docker)
- [Deployment](#deployment)

## Prerequisites
Make sure you have the following installed before proceeding:
- Python (>=3.8)
- Node.js (>=16.0)
- Docker & Docker Compose
- Git

## Installation
### Clone the Repository
```sh
git clone https://github.com/harshitbansal184507/Speak-Ez.git
cd Speak-Ez
```

### Backend Setup
1. Navigate to the backend directory:
    ```sh
    cd Backend/chatbot-service
    ```
2. Create and activate a virtual environment:
    ```sh
    python -m venv venv
    source venv/bin/activate   # On Windows: venv\Scripts\activate
    ```
3. Install dependencies:
    ```sh
    pip install -r requirements.txt
    ```
4. Run the backend service:
    ```sh
    python app.py 
    ```

### Frontend Setup
1. Navigate to the frontend directory:
    ```sh
    cd Frontend/speakez
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the frontend server:
    ```sh
    npm run dev  # Or `npm start` depending on the setup
    ```

## Running Locally
After setting up both frontend and backend, your application should be accessible at:
```
Frontend: http://localhost:3000
Backend: http://localhost:5000 (or configured port)
```

## Using Docker
To run the project using Docker, follow these steps:
1. Ensure Docker is installed and running.
2. Navigate to the project root directory.
3. Run the following command to build and start services:
    ```sh
    docker-compose up --build
    ```
4. The application should now be accessible at `http://localhost:3000`.

## Deployment
For deployment, you can use services like AWS, Heroku, or DigitalOcean. Ensure environment variables and configurations are properly set in production.

---
This README provides a quick start for running Speak-Ez. Feel free to contribute or open issues for improvements! 🚀

