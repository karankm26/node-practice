const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const tokenHeader = req.header("Authorization");

  if (!tokenHeader || !tokenHeader.startswith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Unauthorized: Missing or invalid token" });
  }
  const token = tokenHeader.split(" ")[1];
  jwt.verify(token, process.env.SECRET_STRING, (err, user) => {
    if (err) {
      return res.status(403).send("Forbidden: Invalid token");
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
