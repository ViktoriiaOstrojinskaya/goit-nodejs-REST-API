const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/users");
const { validateBody, authMiddleware } = require("../../middlewares");
const { userJoiSchema } = require("../../models/user");

router.post("/register", validateBody(userJoiSchema), ctrl.register);
router.post("/login", validateBody(userJoiSchema), ctrl.login);
router.get("/logout", authMiddleware, ctrl.logout);
router.post("/current", authMiddleware, ctrl.current);

module.exports = router;
