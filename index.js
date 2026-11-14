const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Servir la interfaz moderna de Trabajo Claro
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta API de estado opcional
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', plataforma: 'Trabajo Claro Activo' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
