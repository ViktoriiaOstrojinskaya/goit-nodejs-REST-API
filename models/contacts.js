const fs = require("fs/promises");
const path = require("path");
const uuid = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const result = JSON.parse(data);
  return result;
};

const getContactById = async (contactId) => {
  const data = await listContacts();
  const result = data.find((item) => item.id === contactId);
  return result;
};

const removeContact = async (contactId) => {
  const data = await listContacts();
  const index = data.findIndex((item) => item.id === contactId);
  const removedContact = data[index];
  if (index !== -1) {
    data.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(data));
  }
  return removedContact;
};

const addContact = async (body) => {
  const newContact = {
    id: uuid.v4(),
    // name,
    // emai,
    // phone,
  };
  const data = await listContacts();
  data.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return newContact;
};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
