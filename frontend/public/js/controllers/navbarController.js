// navbarController.js
document.addEventListener("DOMContentLoaded", () => {
  // Manejo del menú hamburguesa
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  if (hamburger && menu) {
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("active");
    });
  }

  // Manejo de la búsqueda, solo en páginas donde aparezca el buscador
  const searchInput = document.getElementById("product-search");
  const searchBtn = document.getElementById("search-btn");

  if (searchInput && searchBtn) {
    searchBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        // Redirige a catalog.html con el término de búsqueda como parámetro en la URL
        window.location.href = `/views/catalog.html?search=${encodeURIComponent(searchTerm)}`;
      }
    });
  }
  function obtenerImagenProducto(producto) {
  let imagen = "";

  // Verificamos si existe la propiedad 'imagen' y es una cadena no vacía
  if (producto.imagen && typeof producto.imagen === 'string' && producto.imagen.trim() !== "") {
    imagen = producto.imagen.trim();
  } 
  // O, si existe el arreglo 'imagenes' y contiene al menos un elemento que sea cadena
  else if (Array.isArray(producto.imagenes) && producto.imagenes.length > 0 && typeof producto.imagenes[0] === 'string') {
    imagen = producto.imagenes[0].trim();
  } else {
    // En caso de que no se encuentre ninguna imagen, retornar un placeholder
    return "/assets/products/placeholder.png";
  }

  // Asegurarse de que la imagen tenga el formato correcto, por ejemplo:
  if (!imagen.startsWith("/")) {
    imagen = `/assets/products/${imagen}`;
  }

  // Solo llamar a endsWith si 'imagen' es una cadena
  if (typeof imagen === 'string' && imagen.endsWith(".jpg")) {
    imagen = imagen.replace(".jpg", ".png");
  }

  return imagen;
}


});
