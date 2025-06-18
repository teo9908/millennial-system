document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  const imagenesContainer = document.getElementById("imagen-container");
  const sliderImagen = document.getElementById("slider-imagen");
  const nombreEl = document.getElementById("producto-nombre");
  const descripcionEl = document.getElementById("producto-descripcion");
  const precioEl = document.getElementById("producto-precio");
  const stockEl = document.getElementById("producto-stock");
  const btnAgregar = document.getElementById("agregar-carrito");
  const detalleContainer = document.getElementById("producto-detalle");

  let imageSources = [];
  let currentImageIndex = 0;

  const updateSliderImage = () => {
    sliderImagen.src = imageSources[currentImageIndex];
  };

  document.getElementById("prev-btn").addEventListener("click", () => {
    currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
    updateSliderImage();
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % imageSources.length;
    updateSliderImage();
  });

  const renderProduct = (product) => {
    let baseName = "default";
    if (product.imagenes && Array.isArray(product.imagenes) && product.imagenes.length > 0) {
      const fileName = product.imagenes[0].split("/").pop();
      baseName = fileName.replace(/-\d+\.(png|jpg|jpeg|webp)$/, "");
    }

    imageSources = [1, 2, 3].map(i => `/assets/products/${baseName}-0${i}.png`);
    currentImageIndex = 0;
    updateSliderImage();

    nombreEl.textContent = product.nombre || "Producto sin nombre";
    descripcionEl.textContent = product.descripcion || "Sin descripción disponible.";
    precioEl.textContent = product.precio
      ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(product.precio)
      : "N/D";
    stockEl.textContent = product.stock ?? "N/D";

    if (product.stock === 0) {
      btnAgregar.disabled = true;
      btnAgregar.textContent = "Agotado";
    }
  };

  btnAgregar.addEventListener("click", () => {
    alert("Producto agregado al carrito");
  });

  if (productId) {
    detalleContainer.insertAdjacentHTML("beforeend", "<p>Cargando producto...</p>");
    fetch(`/api/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(product => {
        detalleContainer.querySelector("p:last-child")?.remove();
        renderProduct(product);
      })
      .catch(err => {
        console.error("Error:", err);
        detalleContainer.innerHTML += "<p class='mensaje-error'>No se pudo cargar el producto.</p>";
      });
  } else {
    detalleContainer.innerHTML += "<p class='mensaje-error'>Producto no especificado.</p>";
  }
});
