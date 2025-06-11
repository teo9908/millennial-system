document.addEventListener("DOMContentLoaded", () => {
  const cargarProductos = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const searchTerm = params.get("search");

      const endpoint = searchTerm
        ? `/api/products?search=${encodeURIComponent(searchTerm)}`
        : `/api/products`;


      const respuesta = await fetch(endpoint);
      if (!respuesta.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const productos = await respuesta.json();
      console.log("Productos cargados:", productos);

      const contenedorProductos = document.getElementById("contenedor-productos");
      contenedorProductos.innerHTML = ""; // Limpiar el contenedor

      if (!productos || productos.length === 0) {
        console.log("🔴 No se encontraron productos para la búsqueda.");
        const mensajeError = document.createElement("p");
        mensajeError.classList.add("mensaje-error");
        mensajeError.textContent = "No se encontraron productos para la búsqueda.";
        contenedorProductos.appendChild(mensajeError);
        return;
      }

      productos.forEach(producto => {
        // Creamos el contenedor individual del producto
        const divProducto = document.createElement("div");
        divProducto.classList.add("producto");

        // Creamos el elemento para la imagen
        const img = document.createElement("img");
        let imagenPath = "/assets/products/placeholder.png";
        if (Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
          imagenPath = producto.imagenes[0];
          if (typeof imagenPath === "string" && imagenPath.endsWith(".jpg")) {
            imagenPath = imagenPath.replace(".jpg", ".png");
          }
        }
        img.src = imagenPath;
        img.alt = producto.nombre || "Imagen del producto";

        // Creamos el título del producto
        const titulo = document.createElement("h3");
        titulo.textContent = producto.nombre || "Sin nombre";

        // Agregamos la imagen y el título al contenedor del producto
        divProducto.appendChild(img);
        divProducto.appendChild(titulo);

        // Envolvemos el contenedor del producto en un enlace que apunta
        // a la vista de detalle, pasando el id del producto en la URL.
        const link = document.createElement("a");
        link.href = `/views/productDetail.html?id=${producto._id}`;
        link.appendChild(divProducto);

        // Agregamos el enlace al contenedor principal de productos
        contenedorProductos.appendChild(link);
      });
    } catch (error) {
      console.error("❌ Error al cargar productos:", error);
      const mensajeError = document.createElement("p");
      mensajeError.classList.add("mensaje-error");
      mensajeError.textContent = "Error al cargar productos. Inténtalo más tarde.";
      document.getElementById("contenedor-productos").appendChild(mensajeError);
    }
  };

  cargarProductos();
});
