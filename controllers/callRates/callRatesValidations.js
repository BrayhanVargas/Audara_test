// Call rate validations
exports.callRatesValidations = {
  name: "required|min:2|max:32|type:alphaNumericDash",
  prefix: "max:100|type:numeric",
  number_of_digits: "max:100|type:numeric",
  min_rate: "max:100|type:numeric",
  sec_rate: "max:100|type:numeric",
  currency_id: "required|max:100|type:numeric",
  status: "required|min:6|max:8|type:alphaNumericDash",
  order: "required",
  orderField: "required",
  page: "required|min:1",
  perpage: "required|min:1",
  filters: "required",
};
