🚀 Visualization Dashboard
This is a full-stack data visualization dashboard built using the MERN stack (MongoDB, Express, React, Node.js). The project reads and analyzes data from a MongoDB database, allowing users to interactively explore insights through dynamic Chart.js visualizations. Key features include dynamic filtering (by Year, Topic, Country, etc.) and a global search functionality, all presented in a clean, responsive UI styled with Bootstrap.

🛠️ Quick Start Guide
Follow these steps to get the project running on your local machine.

1. Prerequisites
Ensure you have Node.js (v14+) and npm installed.

2. Clone the Repository
Clone the project from your repository (replace the placeholder URL):

Bash

git clone [YOUR_REPO_URL]
cd [YOUR_PROJECT_FOLDER]
3. Setup Environment Variables
Create a file named .env in the root of the dashboard-backend folder with your MongoDB connection details:

Code snippet

MONGO_URI=mongodb+srv://<YourUsername>:<YourPassword>@<YourClusterName>.nes95z6.mongodb.net/DataVisualizationDashBoard?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=YOUR_VERY_STRONG_SECRET_KEY_HERE
Note: Make sure you have imported your jsondata.json into the datas collection in your MongoDB Atlas cluster.

📦 Installation and Running
You need to run the backend and frontend servers separately.

A. Backend Setup (dashboard-backend)
Navigate to the backend directory:

Bash

cd dashboard-backend
Install dependencies:

Bash

npm install
Start the API Server:

Bash

node server.js
# (API runs on http://localhost:5000)
B. Frontend Setup (dashboard-frontend)
Navigate to the frontend directory:

Bash

cd ../dashboard-frontend
Install dependencies:

Bash1

npm install
Start the Client:

Bash2

npm run dev
# (Client runs on http://localhost:5173)
