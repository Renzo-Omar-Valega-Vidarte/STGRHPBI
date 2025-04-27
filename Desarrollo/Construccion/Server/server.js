const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const dataRoutes = require('./routes/dataRoutes');
app.use('/api/data', dataRoutes);

// Servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});
