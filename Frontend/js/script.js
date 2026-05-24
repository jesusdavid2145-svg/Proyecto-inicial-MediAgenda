// =====================
// SELECTOR TIPO DE ACCESO
// =====================
function setType(type, btn) {
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const input = document.getElementById('main-input');
  const icon  = document.getElementById('input-icon');
  const hint  = document.getElementById('input-hint');

  if (type === 'email') {
    input.placeholder = 'ejemplo@correo.com';
    input.type = 'email';
    hint.textContent = 'Ingresa tu correo electrónico registrado';
    icon.innerHTML = `
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    `;
  } else if (type === 'doc') {
    input.placeholder = 'Número de documento de identidad';
    input.type = 'text';
    hint.textContent = 'Cédula de ciudadanía, extranjería o pasaporte';
    icon.innerHTML = `
      <rect x="2" y="3" width="20" height="18" rx="2"/>
      <line x1="7" y1="8" x2="17" y2="8"/>
      <line x1="7" y1="12" x2="17" y2="12"/>
      <line x1="7" y1="16" x2="13" y2="16"/>
    `;
  } else if (type === 'phone') {
    input.placeholder = '+57 300 000 0000';
    input.type = 'tel';
    hint.textContent = 'Ingresa tu número de teléfono con indicativo';
    icon.innerHTML = `
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.42 2 2 0 0 1 3.06 1.25h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6.29 6.29l1.32-1.22a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    `;
  }
}

// =====================
// MOSTRAR / OCULTAR CONTRASEÑA
// =====================
function togglePass() {
  const inp = document.getElementById('pass-input');
  const ico = document.getElementById('eye-icon');

  if (inp.type === 'password') {
    inp.type = 'text';
    ico.innerHTML = `
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    `;
  } else {
    inp.type = 'password';
    ico.innerHTML = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    `;
  }
}

// =====================
// MOSTRAR ALERTA
// =====================
function mostrarAlerta(tipo, titulo, mensaje) {
  const alerta = document.getElementById('alerta');

  const iconos = {
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  };

  alerta.className = `alerta alerta-${tipo}`;
  alerta.innerHTML = `
    <div class="alerta-icono">${iconos[tipo]}</div>
    <div class="alerta-texto">
      <strong>${titulo}</strong>
      <span>${mensaje}</span>
    </div>
  `;
  alerta.style.display = 'flex';
}

function limpiarAlerta() {
  document.getElementById('alerta').style.display = 'none';
  document.getElementById('wrap-usuario').classList.remove('error');
  document.getElementById('wrap-pass').classList.remove('error');
}

// =====================
// VALIDAR LOGIN
// =====================
function validarLogin() {
  limpiarAlerta();

  const usuario = document.getElementById('main-input').value.trim();
  const pass    = document.getElementById('pass-input').value;

  // Campos vacíos
  if (!usuario || !pass) {
    if (!usuario) document.getElementById('wrap-usuario').classList.add('error');
    if (!pass)    document.getElementById('wrap-pass').classList.add('error');
    mostrarAlerta('error', 'Credenciales incorrectas', 'Correo o contraseña incorrectos. Verifica la información e intenta nuevamente.');
    return;
  }

  // Cuenta no verificada (demo)
  const noVerificados = ['noverificado@correo.com'];
  if (noVerificados.includes(usuario.toLowerCase())) {
    document.getElementById('wrap-usuario').classList.add('error');
    mostrarAlerta('warning', 'Cuenta no verificada', 'Tu cuenta aún no ha sido verificada. Revisa tu correo electrónico.');
    return;
  }

  // Credenciales válidas demo: test@correo.com / 123456
  const usuarioValido = 'test@correo.com';
  const passValida    = '123456';

  if (usuario !== usuarioValido || pass !== passValida) {
    document.getElementById('wrap-usuario').classList.add('error');
    document.getElementById('wrap-pass').classList.add('error');
    mostrarAlerta('error', 'Credenciales incorrectas', 'Correo o contraseña incorrectos. Verifica la información e intenta nuevamente.');
    return;
  }

  // Login exitoso
  window.location.href = 'dashboard.html';
}

// =====================
// MODAL TÉRMINOS
// =====================
function abrirModal(e) {
  e.preventDefault();
  document.getElementById('modal-terminos').classList.add('active');
}

function cerrarModal(e) {
  e.preventDefault();
  document.getElementById('modal-terminos').classList.remove('active');
}

// Cerrar al hacer clic fuera
document.getElementById('modal-terminos').addEventListener('click', function (e) {
  if (e.target === this) {
    this.classList.remove('active');
  }
});