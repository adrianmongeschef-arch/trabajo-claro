const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '¡Trabajo Claro está funcionando al 100%!', 
    plataforma: 'MVP Activo' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
