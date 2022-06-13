const rateService = require("../../services/ratesService");

const errorCode = "2504";
const serverError = {
  code: errorCode,
  msg: {
    error: "serverError",
  },
};

exports.handleCode = async (apiCode, req, res) => {
  try {
    switch (apiCode) {
      case "2500":
        return await rateService.showCallRate(req, res);
      case "2510":
        return await rateService.createCallRate(req, res);
      case "2511":
        return await rateService.getCallRates(req, res);
      case "2512":
        return await rateService.updateCallRate(req, res);
      case "2513":
        return await rateService.deleteCallRate(req, res);
      case "2514":
        return await rateService.updateStatusCallRateToActive(req, res);
      case "2515":
        return await rateService.updateStatusCallRateToInactive(req, res);
      case "2518":
        return await rateService.getCurrencyBasicList(req, res);
      case "2519":
        return await rateService.getRatesBasicList(req, res);
      default:
        return res.status(500).json(serverError);
    }
  } catch (error) {
    return res.status(500).json(serverError);
  }
};
