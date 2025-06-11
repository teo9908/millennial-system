document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!nombre || !correo || !password || !confirmPassword) {
      mostrarAlerta("Por favor, completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      mostrarAlerta("Las contraseñas no coinciden.");
      return;
    }

    try {
      const respuesta = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, password })
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        mostrarAlerta("Registro exitoso. Redirigiendo...", "exito");
        setTimeout(() => {
          window.location.href = "/views/login.html";
        }, 1500);
      } else {
        mostrarAlerta(resultado.mensaje || "Hubo un problema al registrarte");
      }
    } catch (error) {
      console.error("❌ Error en registro:", error);
      mostrarAlerta("No se pudo conectar con el servidor");
    }
  });
});

// 🔔 Sistema de alerta visual
function mostrarAlerta(mensaje, tipo = "error") {
  const alerta = document.getElementById("alerta");
  if (!alerta) return;

  alerta.textContent = mensaje;
  alerta.className = `alerta ${tipo}`;
  alerta.style.display = "block";

  setTimeout(() => {
    alerta.style.display = "none";
  }, 4000);
}
