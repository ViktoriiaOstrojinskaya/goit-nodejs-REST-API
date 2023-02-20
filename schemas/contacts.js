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

module.exports = {
  newContactSchema,
  updateContactSchema,
};
