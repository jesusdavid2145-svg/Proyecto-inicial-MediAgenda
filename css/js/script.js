const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const correo = document.getElementById("correo").value.trim();
        const contrasena = document.getElementById("contrasena").value.trim();

        if (correo === "" || contrasena === "") {
            alert("Campos vacíos. Todos los campos obligatorios deben ser completados.");
            return;
        }

        alert("Inicio de sesión validado correctamente.");
        window.location.href = "panel.html";
    });
}