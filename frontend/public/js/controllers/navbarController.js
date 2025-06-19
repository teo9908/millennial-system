// navbarController.js
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  // Cierra el menú si venís de otra vista con él abierto
  if (menu && menu.classList.contains("active")) {
    menu.classList.remove("active");
  }

  // Toggle del menú hamburguesa
  if (hamburger && menu) {
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }

  // Cierra el menú al hacer clic en cualquier enlace
  document.querySelectorAll("#menu a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });

  // Cierra el menú al hacer clic fuera de él
  document.addEventListener("click", (e) => {
    const clickedInsideMenu = menu.contains(e.target);
    const clickedHamburger = hamburger.contains(e.target);
    if (!clickedInsideMenu && !clickedHamburger) {
      menu.classList.remove("active");
      hamburger.classList.remove("active");
    }
  });

  // Búsqueda de productos
  const searchInput = document.getElementById("product-search");
  const searchBtn = document.getElementById("search-btn");

  if (searchInput && searchBtn) {
    searchBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        window.location.href = `/views/catalog.html?search=${encodeURIComponent(searchTerm)}`;
      }
    });
  }

  // Utilidad para obtener una imagen del producto
  function obtenerImagenProducto(producto) {
    let imagen = "";

    if (producto.imagen && typeof producto.imagen === "string" && producto.imagen.trim() !== "") {
      imagen = producto.imagen.trim();
    } else if (Array.isArray(producto.imagenes) && producto.imagenes.length > 0 && typeof producto.imagenes[0] === "string") {
      imagen = producto.imagenes[0].trim();
    } else {
      return "/assets/products/placeholder.png";
    }

    if (!imagen.startsWith("/")) {
      imagen = `/assets/products/${imagen}`;
    }

    if (typeof imagen === "string" && imagen.endsWith(".jpg")) {
      imagen = imagen.replace(".jpg", ".png");
    }

    return imagen;
  }
});
