document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login form");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evitar envío tradicional

    const correo = document.querySelector("#correo").value.trim();
    const password = document.querySelector("#password").value;

    if (!correo || !password) {
      mostrarAlerta("Por favor, completa todos los campos.");
      return;
    }

    try {
      const respuesta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password })
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        localStorage.setItem("userToken", resultado.token);
        mostrarAlerta("Inicio de sesión exitoso", "exito");
        setTimeout(() => {
          window.location.href = "/views/home.html";
        }, 1000);
      } else {
        mostrarAlerta(resultado.mensaje || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("❌ Error en la autenticación:", error);
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

