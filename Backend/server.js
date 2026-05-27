const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/citas',   require('./routes/citas'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/notificaciones', require('./routes/notificaciones'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '✅ MediAgenda API corriendo correctamente' });
});

// Arrancar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});