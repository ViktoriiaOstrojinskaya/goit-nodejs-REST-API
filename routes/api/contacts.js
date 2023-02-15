const express = require("express");
const router = express.Router();

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

router.get("/", async (req, res, next) => {
  try {
    const data = await listContacts();
    res.status(200).json({ contacts: data });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const data = await getContactById(contactId);
    if (!data) {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ contact: data });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = await addContact(req.body);
    if (!data) {
      res.status(400).json({ message: "missing required name field" });
    }
    res.status(201).json({ contact: data });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const data = await removeContact(contactId);
    if (!data) {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", updateContact);

module.exports = router;
