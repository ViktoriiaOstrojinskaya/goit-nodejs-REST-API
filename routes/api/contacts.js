const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const { validateBody } = require("../../middlewares");
const {
  newContactSchema,
  updateContactSchema,
  favoriteContactSchema,
} = require("../../models/contact");

router.get("/", ctrl.getAll);

router.get("/:contactId", ctrl.getById);

router.post("/", validateBody(newContactSchema), ctrl.postContact);

router.delete("/:contactId", ctrl.deleteById);

router.put("/:contactId", validateBody(updateContactSchema), ctrl.updateById);

router.patch(
  "/:contactId/favorite",
  validateBody(favoriteContactSchema),
  ctrl.updateFavorite
);

module.exports = router;
