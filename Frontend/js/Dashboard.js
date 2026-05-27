const API = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem('token');
}

function getUsuario() {
  const u = localStorage.getItem('usuario');
  return u ? JSON.parse(u) : null;
}

// =====================
// AL CARGAR LA PÁGINA
// =====================
document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) {
    window.location.href = 'Loginindex.html';
    return;
  }

  const usuario = getUsuario();
  if (usuario) {
    // Mostrar nombre del usuario
    const nombreEls = document.querySelectorAll('.usuario-nombre, .aside-nombre, .profile-nombre');
    nombreEls.forEach(el => el.textContent = `${usuario.nombre} ${usuario.apellido || ''}`);

    // Mostrar iniciales en avatar
    const iniciales = `${usuario.nombre?.[0] || ''}${usuario.apellido?.[0] || ''}`.toUpperCase();
    const avatarEls = document.querySelectorAll('.avatar, .profile-avatar, .aside-avatar');
    avatarEls.forEach(el => el.textContent = iniciales);

    // Mostrar correo
    const correoEls = document.querySelectorAll('.usuario-correo, .aside-correo');
    correoEls.forEach(el => el.textContent = usuario.correo);

    // Mostrar rol
    const rolEls = document.querySelectorAll('.usuario-rol, .aside-rol');
    rolEls.forEach(el => el.textContent = usuario.rol === 'paciente' ? 'Paciente' : 'Administrador');
  }

  cargarCitasDashboard();
});

// =====================
// CARGAR CITAS EN EL DASHBOARD
// =====================
async function cargarCitasDashboard() {
  try {
    const res   = await fetch(`${API}/citas`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const citas = await res.json();

    if (!res.ok) return;

    // Próximas citas (pendientes o confirmadas)
    const proximas = citas.filter(c => c.estado === 'pendiente' || c.estado === 'confirmada');
    const tbody    = document.querySelector('tbody');

    if (tbody) {
      tbody.innerHTML = '';

      if (proximas.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align:center; padding:2rem; color:#9ca3af;">
              No tienes citas próximas.
            </td>
          </tr>`;
      } else {
        proximas.slice(0, 5).forEach(c => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${c.fecha}</td>
            <td>${c.hora}</td>
            <td>${c.medico_nombre} ${c.medico_apellido}</td>
            <td>${c.especialidad}</td>
            <td>${c.modalidad === 'virtual' ? '🖥 Virtual' : '🏥 Presencial'}</td>
            <td><span class="estado-badge">${c.estado}</span></td>
          `;
          tbody.appendChild(tr);
        });
      }
    }

    // Actualizar contadores si existen
    const totalEl = document.querySelector('.total-citas');
    if (totalEl) totalEl.textContent = citas.length;

    const proximasEl = document.querySelector('.proximas-citas');
    if (proximasEl) proximasEl.textContent = proximas.length;

  } catch (err) {
    console.error('Error cargando citas del dashboard:', err);
  }
}

// =====================
// CERRAR SESIÓN
// =====================
function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'Loginindex.html';
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
  const sidebarBadge = document.querySelector('.nav-item .badge');
  if (sidebarBadge) sidebarBadge.style.display = 'none';
}

document.addEventListener('click', function(e) {
  const notifWrap = document.querySelector('.notif-wrap');
  const notifDrop = document.getElementById('notif-dropdown');
  if (notifWrap && notifDrop && !notifWrap.contains(e.target)) {
    notifDrop.classList.remove('active');
  }
});

// =====================
// BÚSQUEDA
// =====================
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.header-search input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      const filas = document.querySelectorAll('tbody tr');
      filas.forEach(fila => {
        fila.style.display = fila.textContent.toLowerCase().includes(query) ? '' : 'none';
      });
    });
  }

  // Marcar ítem activo en sidebar
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
      if (this.classList.contains('cerrar-sesion')) {
        cerrarSesion();
        return;
      }
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
});