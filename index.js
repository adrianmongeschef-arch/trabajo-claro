const express = require('express');
const app = express();

app.use(express.json());

// Datos de prueba iniciales (Ofertas transparentes)
const ofertas = [
  {
    id: 1,
    puesto: 'Sushiman / Cocinero Nikkei',
    empresa: 'Restaurante Paladar',
    zona: 'Palermo, CABA',
    sueldo: '$950.000 netos + propinas',
    horario: 'Mar a Dom · 17:00 a 01:00',
    modalidad: 'Blanco 100% · Comida incluida',
    rubro: 'Gastronomía'
  },
  {
    id: 2,
    puesto: 'Administrativo/a Contable',
    empresa: 'Estudio Sur',
    zona: 'Lomas de Zamora, GBA',
    sueldo: '$780.000 netos',
    horario: 'Lun a Vie · 09:00 a 17:00',
    modalidad: 'Relación de dependencia · Prepaga',
    rubro: 'Administración'
  },
  {
    id: 3,
    puesto: 'Chofer de Reparto (Cat. Profesional)',
    empresa: 'Logística Rápida',
    zona: 'Monte Grande, GBA',
    sueldo: '$890.000 netos + viáticos',
    horario: 'Lun a Sáb · 07:00 a 15:00',
    modalidad: 'Convenio Camioneros · Blanco',
    rubro: 'Logística'
  }
];

// Ruta API para obtener ofertas en JSON
app.get('/api/ofertas', (req, res) => {
  res.json(ofertas);
});

// Ruta principal con la Interfaz Visual (Frontend)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Trabajo Claro | Empleos con condiciones reales</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #0f172a; color: #f8fafc; padding: 16px; max-width: 680px; margin: 0 auto; }
        header { padding: 20px 0; border-bottom: 1px solid #1e293b; margin-bottom: 20px; }
        .badge-top { display: inline-block; background: #10b98122; color: #34d399; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 99px; margin-bottom: 8px; border: 1px solid #10b98144; }
        h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
        h1 span { color: #38bdf8; }
        .subtitle { color: #94a3b8; font-size: 14px; margin-top: 6px; line-height: 1.4; }
        .search-box { margin-bottom: 16px; }
        input { width: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid #334155; background: #1e293b; color: #fff; font-size: 15px; outline: none; }
        input:focus { border-color: #38bdf8; }
        .filters { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; }
        .filter-btn { background: #1e293b; color: #cbd5e1; border: 1px solid #334155; padding: 8px 14px; border-radius: 99px; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .filter-btn.active { background: #38bdf8; color: #0f172a; border-color: #38bdf8; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 18px; margin-bottom: 14px; }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
        .job-title { font-size: 18px; font-weight: 700; color: #f8fafc; }
        .company { font-size: 13px; color: #94a3b8; margin-top: 2px; }
        .salary { background: #10b981; color: #022c22; font-weight: 800; font-size: 13px; padding: 6px 10px; border-radius: 8px; white-space: nowrap; }
        .details { display: grid; gap: 6px; font-size: 13px; color: #cbd5e1; margin: 12px 0; background: #0f172a88; padding: 12px; border-radius: 10px; }
        .btn-apply { width: 100%; background: #38bdf8; color: #0f172a; border: none; padding: 12px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 4px; }
        .btn-apply:active { opacity: 0.85; }
      </style>
    </head>
    <body>
      <header>
        <div class="badge-top">✓ 100% Sueldo y horarios publicados</div>
        <h1>Trabajo <span>Claro</span></h1>
        <p class="subtitle">Sin "sueldo a convenir" ni vueltas. Postulate sabiendo exactamente cuánto vas a ganar y en qué condiciones.</p>
      </header>

      <div class="search-box">
        <input type="text" id="buscador" placeholder="Buscar por puesto, zona o sueldo..." onkeyup="filtrar()" />
      </div>

      <div class="filters">
        <button class="filter-btn active" onclick="setRubro('Todos', this)">Todos</button>
        <button class="filter-btn" onclick="setRubro('Gastronomía', this)">Gastronomía</button>
        <button class="filter-btn" onclick="setRubro('Logística', this)">Logística</button>
        <button class="filter-btn" onclick="setRubro('Administración', this)">Administración</button>
      </div>

      <div id="lista-ofertas"></div>

      <script>
        const data = ${JSON.stringify(ofertas)};
        let rubroActual = 'Todos';

        function render(lista) {
          const contenedor = document.getElementById('lista-ofertas');
          if (lista.length === 0) {
            contenedor.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:30px 0;">No encontramos ofertas con ese filtro.</p>';
            return;
          }
          contenedor.innerHTML = lista.map(o => \`
            <div class="card">
              <div class="card-header">
                <div>
                  <div class="job-title">\${o.puesto}</div>
                  <div class="company">\${o.empresa} · \${o.zona}</div>
                </div>
                <div class="salary">\${o.sueldo}</div>
              </div>
              <div class="details">
                <div>🕒 <strong>Horario:</strong> \${o.horario}</div>
                <div>📋 <strong>Condiciones:</strong> \${o.modalidad}</div>
              </div>
              <button class="btn-apply" onclick="alert('¡Postulación enviada a ' + '\${o.empresa}' + '! Pronto habilitaremos tu perfil.')">Postularme ahora</button>
            </div>
          \`).join('');
        }

        function setRubro(rubro, btn) {
          rubroActual = rubro;
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          filtrar();
        }

        function filtrar() {
          const texto = document.getElementById('buscador').value.toLowerCase();
          const filtradas = data.filter(o => {
            const coincideRubro = rubroActual === 'Todos' || o.rubro === rubroActual;
            const coincideTexto = o.puesto.toLowerCase().includes(texto) || o.zona.toLowerCase().includes(texto) || o.empresa.toLowerCase().includes(texto);
            return coincideRubro && coincideTexto;
          });
          render(filtradas);
        }

        render(data);
      </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Servidor corriendo en el puerto \${PORT}\`);
});
