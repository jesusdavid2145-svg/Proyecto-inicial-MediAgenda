// =====================
// DROPDOWN NOTIFICACIONES
// =====================
function toggleNotif() {
  const notif = document.getElementById('notif-dropdown');
  notif.classList.toggle('active');
}

function marcarTodasLeidas() {
  document.querySelectorAll('.notif-item.unread').forEach(item => {
    item.classList.remove('unread');
  });

  const badge = document.getElementById('notif-badge');
  badge.style.display = 'none';

  const sidebarBadge = document.querySelector('.nav-item .badge');
  if (sidebarBadge) sidebarBadge.style.display = 'none';
}

// =====================
// CERRAR NOTIFICACIONES AL CLIC FUERA
// =====================
document.addEventListener('click', function (e) {
  const notifWrap = document.querySelector('.notif-wrap');
  const notifDrop = document.getElementById('notif-dropdown');

  if (!notifWrap.contains(e.target)) {
    notifDrop.classList.remove('active');
  }
});

// =====================
// MARCAR ÍTEM ACTIVO EN SIDEBAR
// =====================
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function () {
    if (this.classList.contains('cerrar-sesion')) return;
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});

// =====================
// BÚSQUEDA EN TIEMPO REAL
// =====================
document.querySelector('.header-search input').addEventListener('input', function () {
  const query = this.value.toLowerCase().trim();
  const filas = document.querySelectorAll('tbody tr');

  filas.forEach(fila => {
    const texto = fila.textContent.toLowerCase();
    fila.style.display = texto.includes(query) ? '' : 'none';
  });
});