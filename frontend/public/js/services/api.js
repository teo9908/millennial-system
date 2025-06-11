const API_URL = "http://localhost:5000/api"; // ✅ URL de la API local

// 🔹 Obtener todos los productos
export const obtenerProductos = async () => {
    try {
        const respuesta = await fetch(`${API_URL}/productos`);
        if (!respuesta.ok) throw new Error(`Error en la solicitud: ${respuesta.status}`);
        return await respuesta.json();
    } catch (error) {
        console.error("❌ Error al obtener productos:", error);
        throw error;
    }
};

// 🔹 Obtener productos por categoría
export const obtenerProductosPorCategoria = async (categoria) => {
    try {
        const respuesta = await fetch(`${API_URL}/productos?categoria=${categoria}`);
        if (!respuesta.ok) throw new Error(`Error en la solicitud: ${respuesta.status}`);
        return await respuesta.json();
    } catch (error) {
        console.error("❌ Error al obtener productos por categoría:", error);
        throw error;
    }
};

// 🔹 Agregar un nuevo producto
export const agregarProducto = async (producto) => {
    try {
        const respuesta = await fetch(`${API_URL}/productos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });
        if (!respuesta.ok) throw new Error(`Error al agregar producto: ${respuesta.status}`);
        return await respuesta.json();
    } catch (error) {
        console.error("❌ Error al agregar producto:", error);
        throw error;
    }
};

// 🔹 Actualizar un producto existente
export const actualizarProducto = async (id, producto) => {
    try {
        const respuesta = await fetch(`${API_URL}/productos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });
        if (!respuesta.ok) throw new Error(`Error al actualizar producto: ${respuesta.status}`);
        return await respuesta.json();
    } catch (error) {
        console.error("❌ Error al actualizar producto:", error);
        throw error;
    }
};

// 🔹 Eliminar un producto
export const eliminarProducto = async (id) => {
    try {
        const respuesta = await fetch(`${API_URL}/productos/${id}`, { method: "DELETE" });
        if (!respuesta.ok) throw new Error(`Error al eliminar producto: ${respuesta.status}`);
        console.log("✅ Producto eliminado correctamente");
    } catch (error) {
        console.error("❌ Error al eliminar producto:", error);
        throw error;
    }
};
