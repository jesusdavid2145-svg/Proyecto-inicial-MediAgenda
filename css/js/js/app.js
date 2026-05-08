const registroForm = document.getElementById("registroForm");

if (registroForm) {
    registroForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const documento = document.getElementById("documento").value.trim();
        const nombres = document.getElementById("nombres").value.trim();
        const apellidos = document.getElementById("apellidos").value.trim();
        const correo = document.getElementById("correoRegistro").value.trim();
        const clave = document.getElementById("clave").value.trim();
        const confirmarClave = document.getElementById("confirmarClave").value.trim();
        const terminos = document.getElementById("terminos").checked;

        if (documento === "" || nombres === "" || apellidos === "" || correo === "" || clave === "") {
            alert("Campos vacíos. Todos los campos obligatorios deben ser completados.");
            return;
        }

        if (clave !== confirmarClave) {
            alert("Contraseñas diferentes. Las contraseñas ingresadas no coinciden.");
            return;
        }

        if (!terminos) {
            alert("Términos no aceptados. Debes aceptar los términos y condiciones para crear la cuenta.");
            return;
        }

        alert("Registro exitoso. Tu cuenta ha sido creada correctamente.");
        window.location.href = "index.html";
    });
}

const citaForm = document.getElementById("citaForm");

if (citaForm) {
    citaForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const especialidad = document.getElementById("especialidad").value;
        const medico = document.getElementById("medico").value;
        const sede = document.getElementById("sede").value;
        const modalidad = document.getElementById("modalidad").value;
        const fecha = document.getElementById("fecha").value;
        const hora = document.getElementById("hora").value;

        if (especialidad === "" || medico === "" || sede === "" || modalidad === "" || fecha === "" || hora === "") {
            alert("Campos vacíos. Todos los campos obligatorios deben ser completados.");
            return;
        }

        alert("Cita agendada. La cita fue agendada correctamente.");
        window.location.href = "gestion-citas.html";
    });
}

function confirmarCancelacion() {
    const respuesta = confirm("¿Deseas cancelar esta cita médica?");

    if (respuesta) {
        alert("Cita cancelada. La cita fue cancelada correctamente.");
    }
}

function mostrarMensaje() {
    alert("Has finalizado el tutorial. Ahora puedes continuar usando MediAgenda.");
}