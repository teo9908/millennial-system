// navbarController.js

const menu = document.getElementById("menu");
const hamburger = document.getElementById("hamburger");

// 🔐 Asegura que el menú esté oculto desde el arranque
if (menu && hamburger) {
  menu.classList.remove("active");
  hamburger.classList.remove("active");
  menu.style.visibility = "hidden"; // evita render inesperado
}

document.addEventListener("DOMContentLoaded", () => {
  if (menu && hamburger) {
    // Muestra el menú al activarlo
    hamburger.addEventListener("click", () => {
      const isActive = menu.classList.toggle("active");
      hamburger.classList.toggle("active");
      menu.style.visibility = isActive ? "visible" : "hidden";
    });

    // Cierra el menú al hacer clic en cualquier enlace
    document.querySelectorAll("#menu a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("active");
        hamburger.classList.remove("active");
        menu.style.visibility = "hidden";
      });
    });

    // Cierra el menú al hacer clic fuera de él
    document.addEventListener("click", (e) => {
      const clickedInsideMenu = menu.contains(e.target);
      const clickedHamburger = hamburger.contains(e.target);
      if (!clickedInsideMenu && !clickedHamburger) {
        menu.classList.remove("active");
        hamburger.classList.remove("active");
        menu.style.visibility = "hidden";
      }
    });
  }

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

  // Utilidad para obtener imagen de producto
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

    if (imagen.endsWith(".jpg")) {
      imagen = imagen.replace(".jpg", ".png");
    }

    return imagen;
  }
});
