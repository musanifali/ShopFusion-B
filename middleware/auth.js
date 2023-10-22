const JWT = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("token is not found");
  try {
    const decoded = JWT.verify(token, config.get("jwtprivatekey"));
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).send({ msg: "Token is invalid" });
  }
}
module.exports = auth;
