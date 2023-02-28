const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = new Schema({
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: String
  }, { versionKey: false, timestamps: true })

const User = model("user", userSchema);

const userJoiSchema = Joi.object({
    password: Joi.string().min(6).alphanum().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: {
          allow: ["com", "net"],
        },
      })
      .required(),
      subscription: Joi.string(),
    token: Joi.string(),
  });

module.exports = {
  User,
  userJoiSchema
};




