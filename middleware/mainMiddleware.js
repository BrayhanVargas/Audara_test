const apiSwitch = require("./apiSwitch");
const jwt = require("jsonwebtoken");
// const successCode = "1001";
const errorCode = "1004";
const serverError = {
  code: errorCode,
  msg: {
    error: "serverError",
  },
};
const apiCodeError = {
  code: errorCode,
  msg: {
    error: "apiCodeError",
  },
};

const mainMiddleware = async (req, res) => {
  try {
    try {
      jwt.verify(req.token, "secretkey");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
    // Gets apiCode
    const apiCode = req.query["apiCode"];
    if (!apiCode) return res.status(200).json(apiCodeError);
    // Call to API switch
    return await apiSwitch(apiCode, req, res);
  } catch (error) {
    return res.status(500).json(serverError);
  }
};

module.exports = mainMiddleware;
