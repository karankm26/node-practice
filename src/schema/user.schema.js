const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  // password: Joi.string().required(),
  password: Joi.string()
    .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$?]).{8,}$/)
    .required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
});

//   password: Joi.string()
//     .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$?]).{8,}$/)
//     .required(),
module.exports = { createUserSchema, updateUserSchema };
