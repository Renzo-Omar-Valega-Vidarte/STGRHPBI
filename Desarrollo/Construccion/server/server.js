const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const dataRoutes = require('./routes/dataRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Rutas
app.use('/api', dataRoutes);

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT} 🚀`);
});
