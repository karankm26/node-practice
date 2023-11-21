const bcrypt = require("bcrypt");
const { createUserSchema, updateUserSchema } = require("../schema/user.schema");
const User = require("../models/user.modal");

const createUser = async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User already exists for this email" });
    }
    const hashedPassword = await bcrypt.hash(value.password, 10);
    const user = new User({ ...value, password: hashedPassword });
    await user.save();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const existingUser = await User.findOne({
      email: value.email,
      _id: { $ne: req.params.id },
    });

    if (existingUser) {
      return res.status(400).send("Email is already registered");
    }
    if (value.password) {
      value.password = await bcrypt.hash(value.password, 10);
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      value,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).send({ message: "success", data: updatedUser });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    return res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
module.exports = { createUser, updateUser, getUserById, getUsers };
