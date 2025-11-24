// dashboard-backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const dataRoutes = require('./routes/dataRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(express.json()); 
app.use(cors()); 

app.use('/api/data', dataRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));