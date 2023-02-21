const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const { handleSchemaValidationError } = require("../../helpers");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSchemaValidationError);

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
  favorite: Joi.bool(),
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
  favorite: Joi.bool(),
});

const schemas = {
  newContactSchema,
  updateContactSchema,
};

const Contact = mongoose.model("contact", contactSchema);

module.exports = {
  Contact,
  schemas,
};
