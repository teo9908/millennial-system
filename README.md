# 🌐 Millennial System

**Sistema web con autenticación, panel de administración y gestión dinámica de productos.**  
Un sistema fullstack para administrar catálogos de forma segura y escalable, ideal como proyecto académico o base para soluciones empresariales personalizadas.

---

## 🚀 Funcionalidades clave

- Registro e inicio de sesión con autenticación JWT
- Control de acceso por roles (usuario y administrador)
- SPA administrativa con operaciones CRUD sobre productos
- Alertas visuales para validación y estados de respuesta
- Separación clara entre frontend y backend para escalabilidad

---

## 🛠️ Tecnologías

- **Frontend:** HTML, CSS modular, JavaScript Vanilla
- **Backend:** Node.js, Express.js, MongoDB Atlas
- **Seguridad:** JSON Web Tokens, bcrypt
- **Herramientas:** Git, MongoDB Compass, Render o Railway

---

## 📁 Estructura del proyecto

Millennial System/
├── backend/         # API, controladores y conexión con MongoDB
├── frontend/        # Páginas HTML, estilos, controladores del cliente
├── .gitignore
├── README.md


---

## 📦 Instalación local

1. Clona el repositorio
   en la terminal de gitbash
   git clone https://github.com/teo9908/millennial-system.git

2. Clona el repositorio
    cd backend
    npm install

3. Crea un archivo .env en la raíz dela carpeta backend   
   MONGO_URI=<tu URI de conexión de MongoDB Atlas>
   PORT=5000
   JWT_SECRET=<una clave secreta segura para firmar tokens>



4. Inicia el servidor
    node server.js

5. Abrir manualmente el frontend
    Abrir en el navegador la ruta http://localhost:5000
