document.addEventListener("DOMContentLoaded", () => {


  //Bloque 1: Autenticación y navegación de secciones

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

  const btnCerrar = document.getElementById("cerrar-sesion");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      localStorage.removeItem("userToken");
      window.location.href = "/views/login.html";
    });
  }


  // Bloque 2: Categorías y funciones comunes
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

    document.querySelectorAll(".admin-sidebar a").forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === vista);
    });
  };

  document.querySelectorAll(".admin-sidebar a").forEach(enlace => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault();
      const vista = enlace.getAttribute("href");
      mostrarVista(vista);
      if (vista === "listado") cargarListado();
    });
  });


  const categoriasMap = {
    "Teclados": "TecladosID",
    "Ratones": "RatonesID",
    "Diademas": "DiademasID",
    "Chasis": "ChasisID",
    "Monitores": "MonitoresID"
  };

  const cargarCategoriasEstaticas = (selectId) => {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = `<option value="">Seleccione una categoría</option>`;
    Object.entries(categoriasMap).forEach(([nombre, codigo]) => {
      const option = document.createElement("option");
      option.value = codigo;
      option.textContent = nombre;
      select.appendChild(option);
    });
  };

  cargarCategoriasEstaticas("categoria-select-agregar");
  cargarCategoriasEstaticas("categoria-select-actualizar");

  const activarCheckboxSinImagen = (formId) => {
    const formulario = document.getElementById(formId);
    if (!formulario) return;

    const grupos = formulario.querySelectorAll(".campo-imagen");
    grupos.forEach(grupo => {
      const input = grupo.querySelector('input[type="text"]');
      const checkbox = grupo.querySelector('input[type="checkbox"].sin-imagen-checkbox');
      checkbox.addEventListener("change", () => {
        input.disabled = checkbox.checked;
        if (checkbox.checked) input.value = "";
      });
    });
  };

  activarCheckboxSinImagen("form-agregar");
  activarCheckboxSinImagen("form-actualizar");


  // Bloque 3: Formulario Agregar Producto

  const formularioAgregar = document.getElementById("form-agregar");
  if (formularioAgregar) {
    formularioAgregar.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(formularioAgregar);
      const producto = Object.fromEntries(formData.entries());
      producto.precio = parseFloat(producto.precio);
      producto.stock = parseInt(producto.stock);

      const imagenInputs = formularioAgregar.querySelectorAll('input[name="imagenes"]');
      producto.imagenes = Array.from(imagenInputs)
        .filter(input => !input.disabled && input.value.trim() !== "")
        .map(input => input.value.trim());

      if (!producto.categoria_codigo) {
        alert("⚠️ Seleccione una categoría válida antes de continuar.");
        return;
      }

      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(producto)
        });
        await res.json();
        alert("✅ Producto agregado correctamente");
        formularioAgregar.reset();
        activarCheckboxSinImagen("form-agregar");
      } catch (error) {
        console.error("❌ Error al agregar producto:", error);
        alert("Error al agregar producto");
      }
    });
  }


  // Bloque 4: Cargar listado y editar/eliminar productos

  const cargarListado = async () => {
    try {
      const res = await fetch("/api/products");
      const productos = await res.json();
      const tbody = document.querySelector("#tabla-productos tbody");
      tbody.innerHTML = "";

      productos.forEach(p => {
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

  const activarBotones = () => {
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;
        try {
          await fetch(`/api/products/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
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

          cargarCategoriasEstaticas("categoria-select-actualizar");

          const formEditar = document.getElementById("form-actualizar");
          formEditar["_id"].value = producto._id;
          formEditar["nombre"].value = producto.nombre;
          formEditar["descripcion"].value = producto.descripcion;
          formEditar["precio"].value = producto.precio;
          formEditar["stock"].value = producto.stock;
          formEditar["categoria_codigo"].value = producto.categoria_codigo;

          const contenedor = document.getElementById("contenedor-imagenes-actualizar");
          contenedor.innerHTML = "";

          const total = 3;
          for (let i = 0; i < total; i++) {
            const ruta = producto.imagenes?.[i] || "";
            const wrapper = document.createElement("div");
            wrapper.className = "campo-imagen";

            const input = document.createElement("input");
            input.type = "text";
            input.name = "imagenes";
            input.placeholder = `Ruta imagen ${i + 1}`;
            input.value = ruta;

            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "sin-imagen-checkbox";

            if (!ruta) {
              checkbox.checked = true;
              input.disabled = true;
            }

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" Sin imagen"));

            wrapper.appendChild(input);
            wrapper.appendChild(label);
            contenedor.appendChild(wrapper);
          }

          activarCheckboxSinImagen("form-actualizar");
        } catch (err) {
          console.error("❌ Error al cargar producto:", err);
        }
      });
    });
  };

  //Bloque 5: Formulario Actualizar Producto

  const formularioActualizar = document.getElementById("form-actualizar");
  if (formularioActualizar) {
    formularioActualizar.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = formularioActualizar["_id"].value;
      const formData = new FormData(formularioActualizar);
      const datos = Object.fromEntries(formData.entries());
      datos.precio = parseFloat(datos.precio);
      datos.stock = parseInt(datos.stock);

      const imagenInputs = formularioActualizar.querySelectorAll('input[name="imagenes"]');
      datos.imagenes = Array.from(imagenInputs)
        .filter(input => !input.disabled && input.value.trim() !== "")
        .map(input => input.value.trim());

      if (!datos.categoria_codigo) {
        alert("⚠️ Seleccione una categoría válida antes de continuar.");
        return;
      }

      try {
        await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(datos)
        });
        alert("✅ Producto actualizado");
        mostrarVista("listado");
        cargarListado();
      } catch (err) {
        console.error("❌ Error al actualizar producto:", err);
        alert("Error al actualizar producto");
      }
    });
  }
});
