const contacts = require("../models/contacts");
const { HttpError, ctrlWrapper } = require("../helpers");
const Joi = require("joi");

const newContactSchema = Joi.object({
  name: Joi.string().alphanum().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ["com", "net"],
      },
    })
    .required(),
  phone: Joi.number().integer().required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().alphanum(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: {
      allow: ["com", "net"],
    },
  }),
  phone: Joi.number().integer(),
});

const getAll = async (req, res, next) => {
  const data = await contacts.listContacts();
  res.status(200).json({ contacts: data });
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const data = await contacts.getContactById(contactId);
  if (!data) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(data);
};

const postContact = async (req, res, next) => {
  const { error } = newContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const data = await contacts.addContact(req.body);
  res.status(201).json(data);
};

const deleteById = async (req, res, next) => {
  const { contactId } = req.params;
  const data = await contacts.removeContact(contactId);
  if (!data) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "Contact deleted" });
};

const updateById = async (req, res, next) => {
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { contactId } = req.params;
  const data = await contacts.updateContact(contactId, req.body);
  if (!data) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(data);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  postContact: ctrlWrapper(postContact),
  deleteById: ctrlWrapper(deleteById),
  updateById: ctrlWrapper(updateById),
};
