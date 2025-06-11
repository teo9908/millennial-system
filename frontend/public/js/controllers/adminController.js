// adminController.js


// 🔐 Protección de acceso: verificar token y rol antes de cargar el panel
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("userToken");

  if (!token) {
    window.location.href = "/views/login.html";
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (payload.rol !== "admin") {
      alert("Acceso denegado: no eres administrador");
      window.location.href = "/views/home.html";
      return;
    }

  } catch (error) {
    console.error("❌ Token inválido:", error);
    window.location.href = "/views/login.html";
  }

  // 🔓 Si el usuario pasa la verificación, sigue lógica del panel...

  // Cierre de sesión
  const btnCerrar = document.getElementById("cerrar-sesion");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      localStorage.removeItem("userToken");
      window.location.href = "/views/login.html";
    });
  }

// Controlador de administración de productos

const secciones = {
  inicio: document.getElementById("vista-inicial"),
  agregar: document.getElementById("vista-agregar"),
  actualizar: document.getElementById("vista-actualizar"),
  eliminar: document.getElementById("vista-eliminar"),
  listado: document.getElementById("vista-listado")
};

const mostrarVista = (vista) => {
  Object.values(secciones).forEach(sec => sec.style.display = "none");
  secciones[vista].style.display = "block";

  // Cambiar clase activa en el menú lateral
  document.querySelectorAll(".admin-sidebar a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === vista);
  });
};

// Activar navegación entre secciones
document.querySelectorAll(".admin-sidebar a").forEach(enlace => {
  enlace.addEventListener("click", (e) => {
    e.preventDefault();
    const vista = enlace.getAttribute("href");
    mostrarVista(vista);
    if (vista === "listado") cargarListado();
  });
});

// Agregar producto
const formularioAgregar = document.getElementById("form-agregar");
if (formularioAgregar) {
  formularioAgregar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(formularioAgregar);
    const producto = Object.fromEntries(formData.entries());
    producto.precio = parseFloat(producto.precio);
    producto.stock = parseInt(producto.stock);
    producto.imagenes = producto.imagenes ? [producto.imagenes] : [];

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
      });
      const data = await res.json();
      alert("✅ Producto agregado correctamente");
      formularioAgregar.reset();
    } catch (error) {
      console.error("❌ Error al agregar producto:", error);
      alert("Error al agregar producto");
    }
  });
}

// Listado de productos
const cargarListado = async () => {
  try {
    const res = await fetch("/api/products");
    const productos = await res.json();
    const tbody = document.querySelector("#tabla-productos tbody");
    tbody.innerHTML = "";

    productos.forEach((p) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${p._id}</td>
        <td>${p.nombre}</td>
        <td>$${p.precio}</td>
        <td>
          <button class="btn-editar" data-id="${p._id}">Editar</button>
          <button class="btn-eliminar" data-id="${p._id}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);
    });

    activarBotones();
  } catch (err) {
    console.error("❌ Error cargando productos:", err);
  }
};

// Acciones desde tabla
const activarBotones = () => {
  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (!confirm("¿Estás seguro de eliminar este producto?")) return;
      try {
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        alert("✅ Producto eliminado");
        cargarListado();
      } catch (err) {
        console.error("❌ Error al eliminar:", err);
      }
    });
  });

  document.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      try {
        const res = await fetch(`/api/products/${id}`);
        const producto = await res.json();
        mostrarVista("actualizar");

        const formEditar = document.getElementById("form-actualizar");
        formEditar["_id"].value = producto._id;
        formEditar["nombre"].value = producto.nombre;
        formEditar["descripcion"].value = producto.descripcion;
        formEditar["precio"].value = producto.precio;
        formEditar["stock"].value = producto.stock;
        formEditar["categoria_codigo"].value = producto.categoria_codigo;
        formEditar["imagenes"].value = producto.imagenes?.[0] || "";

      } catch (err) {
        console.error("❌ Error al cargar producto:", err);
      }
    });
  });
};

// Actualizar producto
const formularioActualizar = document.getElementById("form-actualizar");
if (formularioActualizar) {
  formularioActualizar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = formularioActualizar["_id"].value;
    const formData = new FormData(formularioActualizar);
    const datos = Object.fromEntries(formData.entries());
    datos.precio = parseFloat(datos.precio);
    datos.stock = parseInt(datos.stock);
    datos.imagenes = datos.imagenes ? [datos.imagenes] : [];

    try {
      await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
      alert("✅ Producto actualizado");
      mostrarVista("listado");
      cargarListado();
    } catch (err) {
      console.error("❌ Error al actualizar:", err);
    }
  });
}

});