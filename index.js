const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS candidatos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(100),
        rubro VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS empleos (
        id SERIAL PRIMARY KEY,
        empresa VARCHAR(100),
        puesto VARCHAR(100),
        sueldo VARCHAR(100),
        plan VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Tablas de PostgreSQL verificadas/creadas correctamente.");
  } catch (err) {
    console.error("Error al inicializar la base de datos:", err);
  }
}
initDB();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API: Registrar Candidato
app.post('/api/candidatos', async (req, res) => {
  const { nombre, email, password, rubro } = req.body;
  try {
    const nuevo = await pool.query(
      'INSERT INTO candidatos (nombre, email, password, rubro) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, password, rubro]
    );
    res.json({ success: true, data: nuevo.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'El correo ya está registrado o hubo un error.' });
  }
});

// API: Publicar Empleo
app.post('/api/empleos', async (req, res) => {
  const { empresa, puesto, sueldo, plan } = req.body;
  try {
    const nuevo = await pool.query(
      'INSERT INTO empleos (empresa, puesto, sueldo, plan) VALUES ($1, $2, $3, $4) RETURNING *',
      [empresa, puesto, sueldo, plan]
    );
    res.json({ success: true, data: nuevo.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al publicar el empleo.' });
  }
});

// API: Obtener Empleos Activos
app.get('/api/empleos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM empleos ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (err) {
    res.json([]);
  }
});

// NUEVAS RUTAS DE ADMINISTRACIÓN (Ver todo desde la app)
app.get('/api/admin/candidatos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT id, nombre, email, rubro, created_at FROM candidatos ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.get('/api/admin/empleos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM empleos ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json([]);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
