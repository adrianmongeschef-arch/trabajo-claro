const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Trabajo Claro</title>
      <style>
        body { background: #0f172a; color: #f8fafc; font-family: sans-serif; padding: 20px; text-align: center; }
        h1 { color: #38bdf8; margin-bottom: 10px; }
        .card { background: #1e293b; border: 1px solid #334155; padding: 20px; border-radius: 12px; margin-top: 20px; text-align: left; max-width: 500px; margin-left: auto; margin-right: auto; }
        .sueldo { color: #34d399; font-weight: bold; margin: 8px 0; }
      </style>
    </head>
    <body>
      <h1>Trabajo Claro</h1>
      <p>Empleos con sueldos y condiciones transparentes.</p>
      
      <div class="card">
        <h3>Sushiman / Cocinero Nikkei</h3>
        <p>Restaurante Paladar · Palermo, CABA</p>
        <div class="sueldo">$950.000 netos + propinas</div>
        <p>🕒 Mar a Dom · 17:00 a 01:00</p>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor activo');
});
