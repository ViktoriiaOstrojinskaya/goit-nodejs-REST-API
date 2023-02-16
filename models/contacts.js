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

const addContact = async (name, email, phone) => {
  const newContact = {
    id: uuid.v4(),
    name,
    email,
    phone,
  };
  const data = await listContacts();
  data.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return newContact;
};

const updateContact = async (contactId, name, email, phone) => {
  const data = await listContacts();
  const contactIndex = data.findIndex((contact) => contact.id === contactId);
  if (contactIndex !== -1) {
    data[contactIndex].name = name;
    data[contactIndex].email = email;
    data[contactIndex].phone = phone;
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return data[contactIndex];
  } else {
    return null;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
