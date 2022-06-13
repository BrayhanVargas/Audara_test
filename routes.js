const express = require("express");
const jwt = require("jsonwebtoken");
const mainMiddleware = require("./middleware/mainMiddleware");
const router = express.Router();

router.post("/login", (req, res) => {
  const { name, email } = req.body;
  const user = { name, email };
  if (!name || !email) return res.status(401).end();
  const token = jwt.sign({ user }, "secretkey");
  res.send(token);
  res.end();
});
router.get("/", verifyToken, mainMiddleware);
router.put("/", verifyToken, mainMiddleware);
router.post("/", verifyToken, mainMiddleware);

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.status(403).json({ error: "Need to be authenticated" });
  }
  const bearerToken = bearerHeader.split(" ")[1];
  req.token = bearerToken;
  if (!req.token) return res.status(400).json({ error: "Missed token" });
  next();
}
module.exports = router;
