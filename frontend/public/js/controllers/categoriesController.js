document.addEventListener("DOMContentLoaded", () => {
  /* ============================================================
     1. Manejo del menú desplegable de categorías
  ============================================================ */
  const btnToggle = document.getElementById("btn-toggle-categorias");
  const menuCategorias = document.getElementById("menu-categorias");

  btnToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    // Alterna la visibilidad del menú
    if (menuCategorias.style.display === "block") {
      menuCategorias.style.display = "none";
    } else {
      menuCategorias.style.display = "block";
    }
  });

  // Oculta el menú si se hace clic fuera
  document.addEventListener("click", (event) => {
    if (
      !menuCategorias.contains(event.target) &&
      !btnToggle.contains(event.target)
    ) {
      menuCategorias.style.display = "none";
    }
  });

  /* ============================================================
     2. Obtención y filtrado de productos según la categoría
  ============================================================ */
  // Obtener la categoría desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const nombreCategoria = urlParams.get("categoria");

  if (nombreCategoria) {
    document.getElementById("titulo-categoria").textContent = `Categoría: ${nombreCategoria}`;
    const categoriaCodigo = obtenerCodigoCategoria(nombreCategoria);
    obtenerProductosPorCategoria(categoriaCodigo);
  } else {
    console.warn("No se encontró una categoría en la URL.");
    mostrarMensajeError("No se ha seleccionado ninguna categoría.");
  }

  // Función que mapea el nombre a su código correspondiente
  function obtenerCodigoCategoria(nombreCategoria) {
    const categoriasMap = {
      "Teclados": "TecladosID",
      "Ratones": "RatonesID",
      "Diademas": "DiademasID",
      "Chasis": "ChasisID",
      "Monitores": "MonitoresID"
    };
    return categoriasMap[nombreCategoria] || null;
  }

  // Función para obtener productos de la API y filtrarlos
  async function obtenerProductosPorCategoria(categoriaCodigo) {
    if (!categoriaCodigo) {
      mostrarMensajeError("Categoría no válida.");
      return;
    }

    try {
      // Se consulta el endpoint para obtener todos los productos
      const respuesta = await fetch(`/api/products?category=${encodeURIComponent(categoriaCodigo)}`);
      if (!respuesta.ok) {
        throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`);
      }
      const datos = await respuesta.json();
      // Si la respuesta viene envuelta en "productos", se usa; de lo contrario, se asume es un array
      const productos = datos.productos ? datos.productos : datos;

      if (!Array.isArray(productos)) {
        throw new Error("Formato de datos incorrecto recibido desde la API.");
      }

      // Filtrar localmente productos según el campo 'categoria_codigo'
      const productosFiltrados = productos.filter(
        producto => producto.categoria_codigo === categoriaCodigo
      );

      console.log("Productos filtrados:", productosFiltrados);
      renderizarProductos(productosFiltrados);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      mostrarMensajeError("No se pudieron cargar los productos. Intenta más tarde.");
    }
  }

  // Función para construir la URL correcta de la imagen del producto
  function obtenerImagenProducto(producto) {
    let imagen = "";
    if (producto.imagen && producto.imagen.trim() !== "") {
      imagen = producto.imagen.trim();
    } else if (Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
      imagen = producto.imagenes[0].trim();
    } else {
      return "/assets/products/placeholder.png";
    }

    if (!imagen.startsWith("/")) {
      imagen = `/assets/products/${imagen}`;
    }

    // Si la ruta termina en '.jpg', se reemplaza por '.png'
    if (imagen.endsWith(".jpg")) {
      imagen = imagen.replace(".jpg", ".png");
    }
    return imagen;
  }

  // Función para renderizar los productos en la interfaz
  function renderizarProductos(productos) {
    const contenedorProductos = document.getElementById("productos-contenedor");
    contenedorProductos.innerHTML = "";

    if (productos.length === 0) {
      mostrarMensajeError("No hay productos disponibles en esta categoría.");
      return;
    }

    productos.forEach(producto => {
      const productoElemento = document.createElement("div");
      productoElemento.classList.add("producto");

      const imagenProducto = obtenerImagenProducto(producto);

      productoElemento.innerHTML = `
        <img src="${imagenProducto}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.precio ? `$${producto.precio}` : "Precio no disponible"}</p>
      `;
      contenedorProductos.appendChild(productoElemento);
    });
  }

  // Función para mostrar mensajes de error en la interfaz
  function mostrarMensajeError(mensaje) {
    const contenedorProductos = document.getElementById("productos-contenedor");
    contenedorProductos.innerHTML = `<p class="mensaje-error">${mensaje}</p>`;
  }
});
