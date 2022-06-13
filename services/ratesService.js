const successCode = "2501";
const {
  callRatesValidations,
} = require("../controllers/callRates/callRatesValidations");
const ratesRepository = require("../repositories/ratesRepository");
const rateRepository = require("../repositories/ratesRepository");
const validateForm = require("../validations/validator");
const errorCode = "2504";

module.exports = {
  showCallRate: async (req, res) => {
    try {
      const rateId = parseInt(req.query.id) || "";
      // If id is empty
      if (rateId === "") {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: "id is empty",
          },
        });
      }
      // Gets rate data
      const result = await rateRepository.showCallRate(rateId);
      delete result["meta"];
      // Not found
      if (!result) {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: "notFoundError",
          },
        });
      }
      return res.status(200).json({
        code: successCode,
        msg: {
          data: result,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  getCallRates: async (req, res) => {
    try {
      const filters = req.body.filters || {};
      const perpage = Number(req.body.perpage || 10);
      const page = Number(req.body.page || 1);
      const orderField = String(req.body.orderField || "name");
      const order = String(req.body.order || "asc");
      const name = String(filters.name || "");
      const bodyData = {
        name,
        order,
        orderField,
        page,
        perpage,
        filters,
      };
      const formErrors = validateForm(bodyData, callRatesValidations);
      if (formErrors) {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: formErrors,
          },
        });
      }
      // Order must be "asc" or "desc"
      if (!["asc", "desc"].includes(order.toLowerCase())) {
        return res.status(200).json({
          code: errorCode,
          msg: {
            error: "order must be asc or desc",
          },
        });
      }
      // Orderfield must be one of the following fields
      const orderFields = ["name", "status", "prefix"];

      if (!orderFields.includes(orderField.toLowerCase())) {
        return res.status(200).json({
          code: errorCode,
          msg: {
            error: "Invalid orderField",
          },
        });
      }
      // WHERE query
      const whereQuery =
        name.length > 0 ? `WHERE r.name LIKE CONCAT(?, '%')` : "";
      // WHERE parameters
      const whereParam = [...(name.length > 0 ? [name] : [])];
      const data = {
        whereQuery,
        whereParam,
        perpage,
        page,
        orderField,
        order,
      };
      const result = await rateRepository.getCallRatesList(data);
      return res.status(200).json({
        code: successCode,
        msg: {
          data: result,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  createCallRate: async (req, res) => {
    try {
      const {
        name,
        prefix,
        number_of_digits,
        min_rate,
        sec_rate,
        currency_id,
        status,
      } = req.body;
      // Gets rate data
      const data = {
        name,
        prefix,
        number_of_digits,
        min_rate,
        sec_rate,
        currency_id,
        status,
      };
      // Validates form
      const formErrors = validateForm(data, callRatesValidations);

      if (formErrors) {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: formErrors,
          },
        });
      }
      const result = await rateRepository.createCallRate(data);
      delete result["meta"];
      // Not found
      if (!result) {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: "notFoundError",
          },
        });
      }
      return res.status(200).json({
        code: successCode,
        msg: {
          data: result,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  updateCallRate: async (req, res) => {
    try {
      const rateId = parseInt(req.query.id) || "";
      // If id is empty
      if (rateId === "") {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: "id is empty",
          },
        });
      }
      const {
        name,
        prefix,
        number_of_digits,
        min_rate,
        sec_rate,
        currency_id,
        status,
      } = req.body;
      // Gets rate data
      const data = {
        name,
        prefix,
        number_of_digits,
        min_rate,
        sec_rate,
        currency_id,
        status,
        rateId,
      };
      const formErrors = validateForm(data, callRatesValidations);
      if (formErrors) {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: formErrors,
          },
        });
      }

      const result = await rateRepository.updateCallRate(data);
      return res.status(200).json({
        code: successCode,
        msg: {
          data: result,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  deleteCallRate: async (req, res) => {
    try {
      const rateId = parseInt(req.query.id) || "";
      // If id is empty
      if (rateId === "") {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: "id is empty",
          },
        });
      }
      const result = await rateRepository.deleteCallRate(rateId);
      return res.status(200).json({
        code: successCode,
        msg: {
          data: result,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  updateStatusCallRateToActive: async (req, res) => {
    try {
      const rateId = parseInt(req.query.id) || "";
      // If id is empty
      if (rateId === "") {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: "id is empty",
          },
        });
      }
      // Checks if rateId exists
      const existResult = await ratesRepository.showCallRate(rateId);
      delete existResult["meta"];

      // Not found
      if (!existResult || existResult.length < 1) {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: "notFoundError",
          },
        });
      }
      const resultUpdate = await ratesRepository.updateStatusCallRateToActive(
        rateId
      );
      // If status was not updated
      if (resultUpdate["affectedRows"] === 0) {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: "Status not updated!",
          },
        });
      }
      // If everything is OK, return success response
      return res.status(200).json({
        code: successCode,
        msg: {
          data: {
            active: true,
          },
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  updateStatusCallRateToInactive: async (req, res) => {
    try {
      const rateId = parseInt(req.query.id) || "";
      // If id is empty
      if (rateId === "") {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: "id is empty",
          },
        });
      }
      // Checks if rateId exists
      const existResult = await ratesRepository.showCallRate(rateId);
      delete existResult["meta"];

      // Not found
      if (!existResult || existResult.length < 1) {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: "notFoundError",
          },
        });
      }
      const resultUpdate = await ratesRepository.updateStatusCallRateToInactive(
        rateId
      );
      // If status was not updated
      if (resultUpdate["affectedRows"] === 0) {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: "Status not updated!",
          },
        });
      }
      // If everything is OK, return success response
      return res.status(200).json({
        code: successCode,
        msg: {
          data: {
            inactive: true,
          },
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  getCurrencyBasicList: async (req, res) => {
    try {
      // Gets rate data
      const result = await rateRepository.getCurrencyBasicList();
      delete result["meta"];
      // Not found
      if (!result) {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: "notFoundError",
          },
        });
      }
      return res.status(200).json({
        code: successCode,
        msg: {
          data: result,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  getRatesBasicList: async (req, res) => {
    try {
      // Gets rate data
      const result = await rateRepository.getRatesBasicList();
      delete result["meta"];
      // Not found
      if (!result) {
        return res.status(400).json({
          code: errorCode,
          msg: {
            error: "notFoundError",
          },
        });
      }
      return res.status(200).json({
        code: successCode,
        msg: {
          data: result,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
};
