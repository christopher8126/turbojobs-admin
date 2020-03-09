const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ msg: "Authorization Denied" });

  // verify token
  try {
    const decoded = jwt.verify(token, "turbojobs");
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Invalid Token" });
  }
}

module.exports = auth;
