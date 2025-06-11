document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------
  // 1️⃣ Cargar y Renderizar Categorías
  // ------------------------------
  async function cargarCategorias() {
    try {
      const respuesta = await fetch('/api/categories');
      const categoriasDesdeAPI = await respuesta.json();
      console.log("Categorías recibidas:", categoriasDesdeAPI);

      const listaCategorias = document.getElementById('lista-categorias-horizontal');
      const categoriasMap = new Map();

      categoriasDesdeAPI.forEach(categoria => {
        if (!categoria.nombre || !Array.isArray(categoria.imagenes) || !categoria.imagenes[0]) {
          console.warn("Categoría ignorada por datos inválidos:", categoria);
          return;
        }
        if (!categoriasMap.has(categoria.nombre)) {
          categoriasMap.set(categoria.nombre, categoria.imagenes[0]);
        }
      });

      const categoriasArray = Array.from(categoriasMap.entries());
      const grupo1 = categoriasArray.slice(0, 5); // Mostramos solo 5 categorías

      renderizarCategorias(grupo1);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  }

  // ------------------------------
  // 2️⃣ Renderizar Categorías en la UI
  // ------------------------------
  function renderizarCategorias(grupo) {
    const listaCategorias = document.getElementById('lista-categorias-horizontal');
    listaCategorias.innerHTML = '';

    grupo.forEach(([nombre, imagen]) => {
      const li = document.createElement('li');
      li.dataset.nombre = nombre; // Asignamos el nombre de la categoría

      const img = document.createElement('img');
      img.src = imagen;
      img.alt = `Categoría: ${nombre}`;

      const spanTexto = document.createElement('span');
      spanTexto.textContent = nombre;

      li.appendChild(img);
      li.appendChild(spanTexto);
      listaCategorias.appendChild(li);
    });
  }

  // ------------------------------
  // 3️⃣ Manejo de Clic en Categorías (Redirigir a categories.html)
  // ------------------------------
  document.getElementById('lista-categorias-horizontal').addEventListener("click", (event) => {
    const categoriaSeleccionada = event.target.closest("li");

    if (categoriaSeleccionada) {
      const categoriaNombre = categoriaSeleccionada.dataset.nombre;
      console.log(`Redirigiendo a categories.html con filtro: ${categoriaNombre}`);

      // Redirigir a la página de categorías con el parámetro en la URL
      window.location.href = `/views/categories.html?categoria=${encodeURIComponent(categoriaNombre)}`;
    }
  });

  // ------------------------------
  // 4️⃣ Configuración del Carrusel
  // ------------------------------
  async function configurarCarrusel() {
    try {
      const respuesta = await fetch('/api/categories');
      const categoriasDesdeAPI = await respuesta.json();

      const allImages = [];
      categoriasDesdeAPI.forEach(categoria => {
        if (Array.isArray(categoria.imagenes)) {
          categoria.imagenes.forEach(img => {
            allImages.push(img);
          });
        }
      });

      const carouselImg = document.getElementById('carousel-img');
      if (carouselImg && allImages.length > 0) {
        function getRandomImage() {
          return allImages[Math.floor(Math.random() * allImages.length)];
        }
        carouselImg.src = getRandomImage();
        setInterval(() => {
          carouselImg.src = getRandomImage();
        }, 3000);
      }
      
    } catch (error) {
      console.error("Error al configurar el carrusel:", error);
    }
  }

  // ------------------------------
  // 🔄 Inicialización de la Página
  // ------------------------------
  cargarCategorias();
  configurarCarrusel();
  console.log("✅ homeController.js cargado correctamente");
});
