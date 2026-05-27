const API = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem('token');
}

function getUsuario() {
  const u = localStorage.getItem('usuario');
  return u ? JSON.parse(u) : null;
}

// Verificar sesión
document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) {
    window.location.href = 'Loginindex.html';
    return;
  }
  cargarCitas();
});

// =====================
// CARGAR CITAS DESDE EL BACKEND
// =====================
async function cargarCitas() {
  try {
    const res = await fetch(`${API}/citas`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    const citas = await res.json();

    if (!res.ok) {
      console.error('Error:', citas.error);
      return;
    }

    renderCitas(citas);

  } catch (err) {
    console.error('Error de conexión:', err);
  }
}

// =====================
// RENDERIZAR CITAS EN LA TABLA
// =====================
function renderCitas(citas) {
  const tbody = document.querySelector('tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (citas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:2rem; color:#9ca3af;">
          No tienes citas registradas.
        </td>
      </tr>`;
    return;
  }

  citas.forEach(c => {
    const estadoClase = {
      'pendiente':   'estado-pendiente',
      'confirmada':  'estado-confirmada',
      'cancelada':   'estado-cancelada',
      'completada':  'estado-completada',
      'no_asistio':  'estado-cancelada'
    };

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.fecha}</td>
      <td>${c.hora}</td>
      <td>${c.medico_nombre} ${c.medico_apellido}</td>
      <td>${c.especialidad}</td>
      <td>${c.modalidad === 'virtual' ? '🖥 Virtual' : '🏥 Presencial'}</td>
      <td><span class="estado-badge ${estadoClase[c.estado] || ''}">${c.estado}</span></td>
      <td>
        ${c.estado === 'pendiente' || c.estado === 'confirmada'
          ? `<button class="btn-cancelar" onclick="cancelarCita(${c.id})">Cancelar</button>`
          : '—'
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// =====================
// CANCELAR CITA
// =====================
async function cancelarCita(id) {
  const confirmar = confirm('¿Estás seguro de que deseas cancelar esta cita?');
  if (!confirmar) return;

  try {
    const res = await fetch(`${API}/citas/cancelar/${id}`, {
      method:  'PUT',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ motivo_cancel: 'Cancelada por el paciente' })
    });

    const data = await res.json();

    if (!res.ok) {
      alert('Error: ' + data.error);
      return;
    }

    alert('✅ Cita cancelada correctamente.');
    cargarCitas();

  } catch (err) {
    alert('Error de conexión.');
  }
}

// =====================
// NOTIFICACIONES
// =====================
function toggleNotif() {
  const notif = document.getElementById('notif-dropdown');
  if (notif) notif.classList.toggle('active');
}

function marcarTodasLeidas() {
  document.querySelectorAll('.notif-item.unread').forEach(item => item.classList.remove('unread'));
  const badge = document.getElementById('notif-badge');
  if (badge) badge.style.display = 'none';
}

document.addEventListener('click', function(e) {
  const notifWrap = document.querySelector('.notif-wrap');
  const notifDrop = document.getElementById('notif-dropdown');
  if (notifWrap && notifDrop && !notifWrap.contains(e.target)) {
    notifDrop.classList.remove('active');
  }
});
function filtrarCitas() {
  cargarCitas();
}