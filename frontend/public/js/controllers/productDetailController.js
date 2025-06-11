document.addEventListener("DOMContentLoaded", () => {
  // Extraer el parámetro "id" de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  console.log("Product ID obtenido:", productId);

  // Obtener referencias a los elementos del DOM
  const imagenEl = document.getElementById("producto-imagen");
  const nombreEl = document.getElementById("producto-nombre");
  const descripcionEl = document.getElementById("producto-descripcion");
  const precioEl = document.getElementById("producto-precio");
  const stockEl = document.getElementById("producto-stock");
  const btnAgregar = document.getElementById("agregar-carrito");
  const detalleContainer = document.getElementById("producto-detalle");

  // Función para renderizar la información del producto
  const renderProduct = (product) => {
    let imagenSrc = "/assets/products/default.jpg"; // valor por defecto
    if (product.imagenes && Array.isArray(product.imagenes) && product.imagenes.length > 0) {
      imagenSrc = product.imagenes[0];
    }
    imagenEl.src = imagenSrc;
    imagenEl.alt = product.nombre || "Imagen del producto";
    nombreEl.textContent = product.nombre || "Producto sin nombre";
    descripcionEl.textContent = product.descripcion || "Sin descripción disponible.";
    precioEl.textContent = product.precio ? `$${product.precio}` : "N/D";
    stockEl.textContent = (product.stock !== undefined ? product.stock : "N/D");
  };

  // Función para manejar la acción de "Agregar al carrito"
  btnAgregar.addEventListener("click", () => {
    alert("Producto agregado al carrito");
  });

  // Realizar el fetch del producto por ID
  if (productId) {
    fetch(`/api/products/${productId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(product => {
        console.log("Producto recibido:", product);
        renderProduct(product);
      })
      .catch(error => {
        console.error("Error al obtener el producto:", error);
        detalleContainer.innerHTML = "<p class='mensaje-error'>No se pudo cargar el producto. Intente nuevamente.</p>";
      });
  } else {
    console.warn("No se proporcionó un ID de producto en la URL.");
    detalleContainer.innerHTML = "<p class='mensaje-error'>Producto no especificado.</p>";
  }
});
