const express = require("express");
const router = express.Router();
const { loginUser, registerUser } = require("../controllers/userController");

router.post("/login", loginUser);
router.post("/register", registerUser); // puedes omitir esta línea si registras desde Compass




module.exports = router;
