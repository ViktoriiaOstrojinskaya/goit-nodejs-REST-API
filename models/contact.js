const { Schema, SchemaTypes, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

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
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    }
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

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

const favoriteContactSchema = Joi.object({
  favorite: Joi.bool(),
});

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  newContactSchema,
  updateContactSchema,
  favoriteContactSchema,
};
