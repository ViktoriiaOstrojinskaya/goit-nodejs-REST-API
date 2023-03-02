const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/users");
const { validateBody, authMiddleware } = require("../../middlewares");
const { userJoiSchema } = require("../../models/user");

router.post("/register", validateBody(userJoiSchema), ctrl.register);
router.get("/login", validateBody(userJoiSchema), ctrl.login);
router.post("/logout", authMiddleware, ctrl.logout);
router.get("/current", authMiddleware, ctrl.current);

module.exports = router;
