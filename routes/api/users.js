const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/users");
const { validateBody, currentUser } = require("../../middlewares");
const { userJoiSchema } = require("../../models/user");

router.post("/register", validateBody(userJoiSchema), ctrl.register);
router.post("/login", validateBody(userJoiSchema), ctrl.login);
router.get("/logout", currentUser, ctrl.logout);
router.post("/current", currentUser, ctrl.current);

module.exports = router;
