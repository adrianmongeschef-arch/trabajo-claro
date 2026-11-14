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
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(100),
        rol VARCHAR(20) DEFAULT 'candidato',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS empleos (
        id SERIAL PRIMARY KEY,
        empresa_id INT,
        empresa VARCHAR(100),
        puesto VARCHAR(100),
        sueldo VARCHAR(100),
        plan VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Forzar rol de admin y contraseña admin123 para tu correo
    await pool.query(
      `INSERT INTO usuarios (nombre, email, password, rol) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) 
       DO UPDATE SET rol = 'admin', password = $3`,
      ['Adrian Monges', 'adrianmongeschef@gmail.com', 'admin123', 'admin']
    );
    console.log("Administrador sincronizado correctamente.");

  } catch (err) {
    console.error("Error al inicializar la base de datos:", err);
  }
}
initDB();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API: Registro
app.post('/api/registro', async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  
  let rolAsignado = rol || 'candidato';
  if (email === 'adrianmongeschef@gmail.com') {
    rolAsignado = 'admin';
  } else if (email.includes('empresa')) {
    rolAsignado = 'empresa';
  }

  try {
    const nuevo = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [nombre, email, password, rolAsignado]
    );
    res.json({ success: true, user: nuevo.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'El correo ya está registrado.' });
  }
});

// API: Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const resultado = await pool.query(
      'SELECT id, nombre, email, rol FROM usuarios WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (resultado.rows.length > 0) {
      res.json({ success: true, user: resultado.rows[0] });
    } else {
      res.status(401).json({ success: false, error: 'Correo o contraseña incorrectos.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error en el servidor.' });
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
    res.status(500).json({ success: false, error: 'Error al publicar el empleo.' });
  }
});

// API: Obtener Empleos
app.get('/api/empleos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM empleos ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (err) {
    res.json([]);
  }
});

// API: Admin - Ver usuarios
app.get('/api/admin/usuarios', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json([]);
  }
});

// API: Admin - Ver empleos
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
