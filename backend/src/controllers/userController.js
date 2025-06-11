const Usuario = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login
const loginUser = async (req, res) => {
    console.log("🎯 POST /login recibido:", req.body);

    const { correo, password } = req.body;

    try {
        const user = await Usuario.findOne({ correo });
        if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

        const token = jwt.sign(
            { uid: user._id, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: "4h" }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// Registro (opcional)
const registerUser = async (req, res) => {
    const { nombre, correo, password } = req.body;

    try {
        const existe = await Usuario.findOne({ correo });
        if (existe) return res.status(409).json({ mensaje: "Correo ya registrado" });

        const hashed = await bcrypt.hash(password, 10);
        const nuevoUsuario = new Usuario({ nombre, correo, password: hashed });
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: "Usuario creado exitosamente" });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ mensaje: "Error al registrar usuario" });
    }
};

module.exports = { loginUser, registerUser };
