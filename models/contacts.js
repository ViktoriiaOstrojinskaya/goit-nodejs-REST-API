const fs = require("fs/promises");
const path = require("path");
const uuid = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const data = await listContacts();
  const result = data.find((item) => item.id === contactId);
  return result || null;
};

const removeContact = async (contactId) => {
  const data = await listContacts();
  const index = data.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  const [removedContact] = data.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  return removedContact;
};

const addContact = async (body) => {
  const data = await listContacts();
  const newContact = {
    id: uuid.v4(),
    ...body,
  };
  data.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  const data = await listContacts();
  const [updatedContact] = data.filter((item) => item.id === contactId);
  updatedContact.name = name;
  updatedContact.email = email;
  updatedContact.phone = phone;
  const newContact = [...data];
  await fs.writeFile(contactsPath, JSON.stringify(newContact));
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
