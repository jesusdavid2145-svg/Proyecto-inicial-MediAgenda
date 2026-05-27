const API = "http://localhost:3000/api";

function togglePass(inputId, iconId) {
  const inp = document.getElementById(inputId);
  const ico = document.getElementById(iconId);
  if (inp.type === 'password') {
    inp.type = 'text';
    ico.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>`;
  } else {
    inp.type = 'password';
    ico.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  }
}

function mostrarAlerta(tipo, titulo, mensaje) {
  const alerta = document.getElementById('alerta');
  const iconos = {
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>`,
    purple:  `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  };
  alerta.className = `alerta alerta-${tipo}`;
  alerta.innerHTML = `<div class="alerta-icono">${iconos[tipo] || iconos.error}</div><div class="alerta-texto"><strong>${titulo}</strong><span>${mensaje}</span></div>`;
  alerta.style.display = 'flex';
  alerta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function ocultarAlerta() { document.getElementById('alerta').style.display = 'none'; }

function marcarError(wrapId, mensaje, errorId) {
  document.getElementById(wrapId).classList.add('error');
  if (errorId && document.getElementById(errorId)) document.getElementById(errorId).textContent = mensaje;
}

function limpiarErrores() {
  document.querySelectorAll('.input-wrap').forEach(w => w.classList.remove('error'));
  document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
  const wt = document.getElementById('wrap-terminos');
  if (wt) wt.classList.remove('error-check');
  ocultarAlerta();
}

async function validarFormulario() {
  limpiarErrores();
  const nombres   = document.getElementById('nombres').value.trim();
  const apellidos = document.getElementById('apellidos').value.trim();
  const tipodoc   = document.getElementById('tipodoc').value;
  const numdoc    = document.getElementById('numdoc').value.trim();
  const correo    = document.getElementById('correo').value.trim();
  const telefono  = document.getElementById('telefono').value.trim();
  const pass1     = document.getElementById('pass1').value;
  const pass2     = document.getElementById('pass2').value;
  const terminos  = document.getElementById('terminos').checked;

  let hayVacios = false;
  if (!nombres)   { marcarError('wrap-nombres', '', null);   hayVacios = true; }
  if (!apellidos) { marcarError('wrap-apellidos', '', null); hayVacios = true; }
  if (!tipodoc)   { marcarError('wrap-tipodoc', '', null);   hayVacios = true; }
  if (!numdoc)    { marcarError('wrap-numdoc', '', null);    hayVacios = true; }
  if (!correo)    { marcarError('wrap-correo', '', null);    hayVacios = true; }
  if (!telefono)  { marcarError('wrap-telefono', '', null);  hayVacios = true; }
  if (!pass1)     { marcarError('wrap-pass1', '', null);     hayVacios = true; }
  if (!pass2)     { marcarError('wrap-pass2', '', null);     hayVacios = true; }

  if (hayVacios) { mostrarAlerta('warning', 'Campos vacíos', 'Todos los campos obligatorios deben ser completados.'); return; }
  if (pass1 !== pass2) { marcarError('wrap-pass2', 'Las contraseñas no coinciden.', 'error-pass'); mostrarAlerta('error', 'Las contraseñas no coinciden', 'Las contraseñas ingresadas no coinciden.'); return; }
  if (pass1.length < 6) { mostrarAlerta('error', 'Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.'); return; }
  if (!terminos) {
    const wt = document.getElementById('wrap-terminos');
    if (wt) wt.classList.add('error-check');
    mostrarAlerta('error', 'Términos no aceptados', 'Debes aceptar los términos y condiciones.');
    return;
  }

  try {
    const res = await fetch(`${API}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombres, apellido: apellidos, correo, contrasena: pass1, telefono, tipo_documento: tipodoc, num_documento: numdoc })
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.error && data.error.includes('correo')) {
        marcarError('wrap-correo', 'Este correo ya está registrado.', 'error-correo');
        mostrarAlerta('purple', 'Correo ya registrado', 'Este correo ya se encuentra registrado en MediAgenda.');
      } else {
        mostrarAlerta('error', 'Error al registrar', data.error || 'Ocurrió un error. Intenta de nuevo.');
      }
      return;
    }
    mostrarExito();
  } catch (err) {
    mostrarAlerta('error', 'Error de conexión', 'No se pudo conectar con el servidor.');
  }
}

function mostrarExito() {
  const f = document.getElementById('form-registro');
  const p = document.getElementById('pantalla-exito');
  const a = document.getElementById('alerta');
  if (f) f.style.display = 'none';
  if (a) a.style.display = 'none';
  if (p) p.style.display = 'block';
}

function abrirModal(e) { e.preventDefault(); document.getElementById('modal-terminos').classList.add('active'); }
function aceptarTerminos() {
  document.getElementById('terminos').checked = true;
  document.getElementById('modal-terminos').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-terminos');
  if (modal) modal.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); });
});