const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app  = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const dataRoutes = require('./routes/dataRoutes');
app.use('/api', dataRoutes);

// Server
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
