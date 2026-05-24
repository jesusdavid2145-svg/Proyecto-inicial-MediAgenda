// =====================
// SEDES CON COORDENADAS
// =====================
const sedes = {
  'norte': {
    nombre: 'Clínica MediAgenda - Sede Norte',
    consultorio: 'Consultorio 203',
    direccion: 'Calle 127 # 15-40, Bogotá',
    lat: 4.7110,
    lng: -74.0721,
    mapsUrl: 'https://www.google.com/maps?q=4.7110,-74.0721',
    wazeUrl: 'https://waze.com/ul?ll=4.7110,-74.0721&navigate=yes',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976!2d-74.0721!3d4.7110!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDInMzkuNiJOIDc0wrAwNCczNS42Ilc!5e0!3m2!1ses!2sco!4v1620000000000'
  },
  'sur': {
    nombre: 'Clínica MediAgenda - Sede Sur',
    consultorio: 'Consultorio 105',
    direccion: 'Carrera 30 # 3-50, Bogotá',
    lat: 4.5981,
    lng: -74.1006,
    mapsUrl: 'https://www.google.com/maps?q=4.5981,-74.1006',
    wazeUrl: 'https://waze.com/ul?ll=4.5981,-74.1006&navigate=yes',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976!2d-74.1006!3d4.5981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzUnNTMuMiJOIDc0wrAwNicwMi4yIlc!5e0!3m2!1ses!2sco!4v1620000000000'
  },
  'centro': {
    nombre: 'Clínica MediAgenda - Sede Centro',
    consultorio: 'Consultorio 301',
    direccion: 'Carrera 7 # 32-16, Bogotá',
    lat: 4.6486,
    lng: -74.0577,
    mapsUrl: 'https://www.google.com/maps?q=4.6486,-74.0577',
    wazeUrl: 'https://waze.com/ul?ll=4.6486,-74.0577&navigate=yes',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976!2d-74.0577!3d4.6486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzgnNTQuOSJOIDc0wrAwMyczNy43Ilc!5e0!3m2!1ses!2sco!4v1620000000000'
  },
  'occidente': {
    nombre: 'Clínica MediAgenda - Sede Occidente',
    consultorio: 'Consultorio 210',
    direccion: 'Avenida 68 # 12-30, Bogotá',
    lat: 4.6350,
    lng: -74.1150,
    mapsUrl: 'https://www.google.com/maps?q=4.6350,-74.1150',
    wazeUrl: 'https://waze.com/ul?ll=4.6350,-74.1150&navigate=yes',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976!2d-74.1150!3d4.6350!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzgnMDYuMCJOIDc0wrAwNic1NC4wIlc!5e0!3m2!1ses!2sco!4v1620000000000'
  }
};

// =====================
// TOGGLE SEDE SEGÚN MODALIDAD
// =====================
function toggleSede() {
  const modalidad   = document.getElementById('modalidad').value;
  const campoSede   = document.getElementById('campo-sede');
  const mapaCard    = document.getElementById('mapa-card');

  if (modalidad === 'virtual' || modalidad === 'domiciliaria') {
    campoSede.style.display = 'none';
    mapaCard.style.display  = 'none';
  } else {
    campoSede.style.display = 'flex';
  }
  actualizarResumen();
}

// =====================
// TOGGLE MAPA
// =====================
let mapaVisible = false;

function toggleMapa() {
  const sede = document.getElementById('sede').value;
  if (!sede) {
    alert('Por favor selecciona una sede primero.');
    return;
  }

  mapaVisible = !mapaVisible;
  const mapaCard = document.getElementById('mapa-card');
  mapaCard.style.display = mapaVisible ? 'block' : 'none';

  if (mapaVisible) actualizarMapa();
}

function actualizarMapa() {
  const sedeVal = document.getElementById('sede').value;
  if (!sedeVal || !sedes[sedeVal]) return;

  const info = sedes[sedeVal];
  document.getElementById('mapa-iframe').src = info.embedUrl;
  document.getElementById('mapa-info').innerHTML = `
    <strong>${info.nombre}</strong><br>
    📍 ${info.direccion} · ${info.consultorio}
  `;
  document.getElementById('btn-google').href = info.mapsUrl;
  document.getElementById('btn-waze').href   = info.wazeUrl;

  actualizarResumen();
}

// =====================
// CALENDARIO
// =====================
const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const diasDisponibles = [5, 6, 8, 12, 13, 15, 19, 20, 22, 27, 28, 29];
const diasOcupados   = [3, 7, 10, 14, 21, 25];

let fechaActual     = new Date(2025, 4, 1);
let diaSeleccionado = 27;

function renderCalendario() {
  const titulo = document.getElementById('cal-titulo');
  const grid   = document.getElementById('cal-dias');

  titulo.textContent = `${meses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`;
  grid.innerHTML = '';

  const primerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay();
  const diasEnMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();
  const offset    = primerDia === 0 ? 6 : primerDia - 1;

  for (let i = 0; i < offset; i++) {
    const vacio = document.createElement('div');
    vacio.classList.add('cal-dia', 'vacio');
    grid.appendChild(vacio);
  }

  for (let d = 1; d <= diasEnMes; d++) {
    const dia = document.createElement('div');
    dia.classList.add('cal-dia');
    dia.textContent = d;

    if (diasOcupados.includes(d)) {
      dia.classList.add('no-disponible');
    } else if (diasDisponibles.includes(d)) {
      dia.classList.add('disponible');
    }

    if (d === diaSeleccionado) dia.classList.add('seleccionado');

    dia.addEventListener('click', () => {
      if (diasOcupados.includes(d) || !diasDisponibles.includes(d)) return;
      diaSeleccionado = d;
      renderCalendario();
      actualizarResumen();
    });

    grid.appendChild(dia);
  }
}

function mesAnterior() {
  fechaActual.setMonth(fechaActual.getMonth() - 1);
  renderCalendario();
}

function mesSiguiente() {
  fechaActual.setMonth(fechaActual.getMonth() + 1);
  renderCalendario();
}

// =====================
// HORARIOS
// =====================
const horariosOcupados = ['09:00 AM', '11:00 AM', '02:00 PM'];
const horariosTodos = [
  '08:00 AM', '08:30 AM', '09:00 AM',
  '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM',
  '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM'
];

let horarioSeleccionado = '10:30 AM';

function renderHorarios() {
  const grid = document.getElementById('horarios-grid');
  grid.innerHTML = '';

  horariosTodos.forEach(h => {
    const btn = document.createElement('button');
    btn.classList.add('horario-btn');
    btn.textContent = h;

    if (horariosOcupados.includes(h)) {
      btn.classList.add('ocupado');
      btn.title    = 'Horario no disponible';
      btn.disabled = true;
    } else {
      if (h === horarioSeleccionado) btn.classList.add('active');
      btn.addEventListener('click', () => {
        horarioSeleccionado = h;
        document.getElementById('hora').value = h;
        renderHorarios();
        actualizarResumen();
      });
    }

    grid.appendChild(btn);
  });
}

// =====================
// CONTADOR CARACTERES
// =====================
function contarCaracteres() {
  const len = document.getElementById('motivo').value.length;
  document.getElementById('char-count').textContent = `${len}/200`;
}

// =====================
// RECOMENDACIONES
// =====================
const recomendaciones = {
  'medicina-general': [
    'Preséntese 20 minutos antes de su cita.',
    'Traiga su documento de identidad.',
    'Lleve su carnet de salud o seguro médico.',
    'Si toma medicamentos, traiga la lista o los envases.',
    'Informe al médico sobre alergias conocidas.'
  ],
  'cardiologia': [
    'Preséntese 20 minutos antes de su cita.',
    'Traiga su documento de identidad.',
    'Lleve resultados de electrocardiogramas anteriores.',
    'Traiga exámenes de sangre recientes (colesterol, triglicéridos).',
    'Informe sobre medicamentos cardiovasculares que toma.',
    'Evite el café y el cigarrillo al menos 2 horas antes.'
  ],
  'dermatologia': [
    'Preséntese 20 minutos antes de su cita.',
    'Traiga su documento de identidad.',
    'No aplique cremas ni maquillaje en la zona afectada.',
    'Lleve fotos del historial de la afección si las tiene.',
    'Informe sobre productos cosméticos que usa frecuentemente.'
  ],
  'pediatria': [
    'Preséntese 20 minutos antes de su cita.',
    'Traiga el documento de identidad del menor y del acudiente.',
    'Lleve el carnet de vacunación del niño.',
    'Traiga el registro civil o tarjeta de identidad del menor.',
    'Informe sobre alergias o medicamentos que el niño esté tomando.'
  ],
  'ginecologia': [
    'Preséntese 20 minutos antes de su cita.',
    'Traiga su documento de identidad.',
    'Si es control de embarazo, lleve su carnet prenatal.',
    'Traiga resultados de citologías anteriores si las tiene.',
    'Evite relaciones sexuales 48 horas antes si es para citología.',
    'Informe sobre el último período menstrual.'
  ],
  'ortopedia': [
    'Preséntese 20 minutos antes de su cita.',
    'Traiga su documento de identidad.',
    'Lleve radiografías o resonancias anteriores de la zona afectada.',
    'Use ropa cómoda que permita acceso a la zona lesionada.',
    'Traiga el historial de tratamientos previos para la misma lesión.'
  ],
  'neurologia': [
    'Preséntese 20 minutos antes de su cita.',
    'Traiga su documento de identidad.',
    'Lleve resonancias magnéticas o tomografías previas.',
    'Traiga lista de medicamentos actuales con dosis.',
    'Si tiene episodios de crisis, lleve un registro de frecuencia y duración.',
    'Un familiar o acompañante puede ser de gran ayuda en la consulta.'
  ]
};

function actualizarRecomendaciones() {
  const especialidad = document.getElementById('especialidad').value;
  const recDiv   = document.getElementById('recomendaciones');
  const recLista = document.getElementById('rec-lista');

  if (!especialidad || !recomendaciones[especialidad]) {
    recDiv.style.display = 'none';
    return;
  }

  recLista.innerHTML = '';
  recomendaciones[especialidad].forEach(rec => {
    const li = document.createElement('li');
    li.textContent = rec;
    recLista.appendChild(li);
  });

  recDiv.style.display = 'block';
}

// =====================
// ACTUALIZAR RESUMEN
// =====================
const medicosInfo = {
  'laura-gomez':  { nombre: 'Dra. Laura Gómez',  esp: 'Médico general' },
  'andres-gomez': { nombre: 'Dr. Andrés Gómez',  esp: 'Cardiólogo'     },
  'maria-solano': { nombre: 'Dra. María Solano', esp: 'Dermatóloga'    },
  'felipe-ruiz':  { nombre: 'Dr. Felipe Ruiz',   esp: 'Ortopedista'    },
  'ana-torres':   { nombre: 'Dra. Ana Torres',   esp: 'Ginecóloga'     }
};

const especialidadesNombres = {
  'medicina-general': 'Medicina general',
  'cardiologia':      'Cardiología',
  'dermatologia':     'Dermatología',
  'pediatria':        'Pediatría',
  'ginecologia':      'Ginecología',
  'ortopedia':        'Ortopedia',
  'neurologia':       'Neurología'
};

const modalidadesNombres = {
  'presencial':   'Presencial',
  'virtual':      'Virtual',
  'domiciliaria': 'Domiciliaria'
};

function actualizarResumen() {
  const especialidad = document.getElementById('especialidad').value;
  const medico       = document.getElementById('medico').value;
  const fechaSelect  = document.getElementById('fecha');
  const fecha        = fechaSelect.options[fechaSelect.selectedIndex]?.text || '— Selecciona';
  const modalidad    = document.getElementById('modalidad').value;
  const sedeVal      = document.getElementById('sede')?.value;

  document.getElementById('resumen-especialidad').textContent = especialidadesNombres[especialidad] || '— Selecciona';
  document.getElementById('resumen-medico').textContent       = medicosInfo[medico]?.nombre || '— Selecciona';
  document.getElementById('resumen-medico-esp').textContent   = medicosInfo[medico]?.esp || '';
  document.getElementById('resumen-fecha').textContent        = fecha === 'Selecciona una fecha' ? '— Selecciona' : fecha;
  document.getElementById('resumen-hora').textContent         = horarioSeleccionado || '— Selecciona';
  document.getElementById('resumen-modalidad').textContent    = modalidadesNombres[modalidad] || '— Selecciona';

  if (sedeVal && sedes[sedeVal]) {
    document.getElementById('resumen-sede').textContent        = sedes[sedeVal].nombre;
    document.getElementById('resumen-consultorio').textContent = sedes[sedeVal].consultorio;
  } else {
    document.getElementById('resumen-sede').textContent        = modalidad === 'virtual' ? 'Videollamada' : modalidad === 'domiciliaria' ? 'Tu domicilio' : '— Selecciona';
    document.getElementById('resumen-consultorio').textContent = '';
  }
}

// =====================
// VALIDAR Y AGENDAR
// =====================
function mostrarAlerta(titulo, mensaje) {
  const alerta = document.getElementById('alerta');
  alerta.className = 'alerta alerta-warning';
  alerta.innerHTML = `
    <div class="alerta-icono" style="background:#fb923c;">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </div>
    <div class="alerta-texto">
      <strong>${titulo}</strong>
      <span>${mensaje}</span>
    </div>
  `;
  alerta.style.display = 'flex';
  alerta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function limpiarAlerta() {
  document.getElementById('alerta').style.display = 'none';
  document.querySelectorAll('.input-wrap.error').forEach(w => w.classList.remove('error'));
}

function agendarCita() {
  limpiarAlerta();

  const especialidad = document.getElementById('especialidad').value;
  const medico       = document.getElementById('medico').value;
  const fecha        = document.getElementById('fecha').value;
  const modalidad    = document.getElementById('modalidad').value;
  const sede         = document.getElementById('sede')?.value;

  let hayVacios = false;

  if (!especialidad) { document.getElementById('wrap-especialidad').classList.add('error'); hay