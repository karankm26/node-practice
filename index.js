const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
app.use(express.json());
app.use(morgan());
mongoose.connect("mongodb://127.0.0.1:27017/test");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, unique: true },
});

const User = mongoose.model("User", userSchema);

const userUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
});

const userCreateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

app.post("/add-users", async (req, res) => {
  try {
    const { error, value } = userCreateSchema.validate(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res.status(200).send({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(value.password, 10);

    const user = new User({ ...value, password: hashedPassword });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { error, value } = userUpdateSchema.validate(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      value,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.send(updatedUser);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send({ data: users });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
// login

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    console.log("login", req.body, user);
    if (!user) {
      return res
        .status(401)
        .send({ message: "Invalid email or password 3333" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res
        .status(401)
        .send({ message: "Invalid email or password 3333" });
    }
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
