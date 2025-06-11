const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "No autorizado: token no encontrado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.rol !== "admin") {
      return res.status(403).json({ mensaje: "Acceso denegado: no eres administrador" });
    }

    req.user = payload; // útil si luego necesitas uid o rol
    next();
  } catch (error) {
    console.error("Token inválido:", error);
    return res.status(403).json({ mensaje: "Token inválido" });
  }
};

module.exports = verifyAdmin;
