const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/users");
const { validateBody, authMiddleware, upload } = require("../../middlewares");
const { userJoiSchema, subscriptionUserSchema } = require("../../models/user");

router.post("/register", validateBody(userJoiSchema), ctrl.register);
router.get("/login", validateBody(userJoiSchema), ctrl.login);
router.post("/logout", authMiddleware, ctrl.logout);
router.get("/current", authMiddleware, ctrl.current);
router.patch(
  "/",
  authMiddleware,
  validateBody(subscriptionUserSchema),
  ctrl.updateSubscriptionUser
);
router.patch(
  "/users/avatars",
  authMiddleware,
  upload.single("avatar"),
  ctrl.updateAvatarUser
);

module.exports = router;
