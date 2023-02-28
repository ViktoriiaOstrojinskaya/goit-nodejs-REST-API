const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/users");
const { validateBody } = require("../../middlewares");
const {userJoiSchema}=require("../../models/user");



router.post("/register", validateBody(userJoiSchema), ctrl.register);
router.post("/login", validateBody(userJoiSchema), ctrl.login);
router.post("/logout", ctrl.logout);
router.post("/current", ctrl.current);

module.exports = router;