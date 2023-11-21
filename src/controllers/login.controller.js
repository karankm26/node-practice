const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.modal");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .send({ message: "Invalid email or password 3333" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_STRING, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
module.exports = { login };
