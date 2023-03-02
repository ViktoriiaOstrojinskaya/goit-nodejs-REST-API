const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const {
  validateBody,
  isValidId,
  authMiddleware,
} = require("../../middlewares");
const {
  newContactSchema,
  updateContactSchema,
  favoriteContactSchema,
} = require("../../models/contact");

router.get("/", authMiddleware, ctrl.getAll);

router.get("/:contactId", isValidId, ctrl.getById);

router.post(
  "/",
  authMiddleware,
  validateBody(newContactSchema),
  ctrl.postContact
);

router.delete("/:contactId", isValidId, ctrl.deleteById);

router.put(
  "/:contactId",
  isValidId,
  validateBody(updateContactSchema),
  ctrl.updateById
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(favoriteContactSchema),
  ctrl.updateStatusContact
);

module.exports = router;
