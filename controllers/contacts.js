const contactSchema = require("../models/shemas/contact");
const { ctrlWrapper } = require("../helpers");

// const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const data = await contactSchema.find();
  res.status(200).json({ contacts: data });
};

// const getById = async (req, res) => {
//   const { contactId } = req.params;
//   const data = await contacts.getContactById(contactId);
//   if (!data) {
//     throw HttpError(404, "Not found");
//   }
//   res.status(200).json(data);
// };

// const postContact = async (req, res) => {
//   const data = await contacts.addContact(req.body);
//   res.status(201).json(data);
// };

// const deleteById = async (req, res) => {
//   const { contactId } = req.params;
//   const data = await contacts.removeContact(contactId);
//   if (!data) {
//     throw HttpError(404, "Not found");
//   }
//   res.status(200).json({ message: "Contact deleted" });
// };

// const updateById = async (req, res) => {
//   const { contactId } = req.params;
//   if (Object.keys(req.body).length === 0) {
//     throw HttpError(404, "Missing fields");
//   }
//   const data = await contacts.updateContact(contactId, req.body);
//   if (!data) {
//     throw HttpError(404, "Not found");
//   }
//   res.status(200).json(data);
// };

module.exports = {
  getAll: ctrlWrapper(getAll),
  // getById: ctrlWrapper(getById),
  // postContact: ctrlWrapper(postContact),
  // deleteById: ctrlWrapper(deleteById),
  // updateById: ctrlWrapper(updateById),
};
