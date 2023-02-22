const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/shemas/contact");

router.get("/", ctrl.getAll);

router.get("/:contactId", ctrl.getById);

router.post("/", validateBody(schemas.newContactSchema), ctrl.postContact);

router.delete("/:contactId", ctrl.deleteById);

router.put(
  "/:contactId",
  validateBody(schemas.updateContactSchema),
  ctrl.updateById
);

module.exports = router;
