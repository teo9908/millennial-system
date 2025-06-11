import { obtenerProductos, obtenerProductosPorCategoria } from "./services/api.js";

// 🏗️ Renderizar los productos en la vista
const renderizarProductos = async (categoria = null) => {
    try {
        const productos = categoria 
            ? await obtenerProductosPorCategoria(categoria) 
            : await obtenerProductos();

        console.log("🔹 Productos obtenidos:", productos); // Depuración en consola

        const contenedor = document.getElementById("contenedor-productos");
        contenedor.innerHTML = productos.map(producto => `
            <div class="product-card">
                <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p><strong>Precio:</strong> ${producto.precio} ${producto.moneda}</p>
                <button class="btn-comprar" data-id="${producto._id}">Comprar</button>
            </div>
        `).join("");

        agregarEventosCompra(); // ✅ Agrega eventos a los botones "Comprar"

    } catch (error) {
        console.error("❌ Error al cargar productos:", error);
    }
};

// 🔎 Manejar filtros por categoría
const manejarFiltro = () => {
    const filtroCategoria = document.getElementById("filtro-categoria");
    filtroCategoria.addEventListener("change", (event) => {
        const categoriaSeleccionada = event.target.value;
        renderizarProductos(categoriaSeleccionada);
    });
};

// 🛒 Evento para comprar productos
const agregarEventosCompra = () => {
    document.querySelectorAll(".btn-comprar").forEach(boton => {
        boton.addEventListener("click", () => {
            const idProducto = boton.getAttribute("data-id");
            console.log(`🛒 Producto seleccionado: ${idProducto}`);
            alert("Producto agregado al carrito");
        });
    });
};

// 🔥 Iniciar la lógica en el frontend
document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos(); // ✅ Cargar productos al inicio
    manejarFiltro(); // ✅ Activar filtro por categoría
});
