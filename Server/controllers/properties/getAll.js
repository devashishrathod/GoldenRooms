const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllProperties } = require("../../services/properties");
const { validateGetAllPropertiesQuery } = require("../../validator/properties");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllPropertiesQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllProperties(value);
  return sendSuccess(res, 200, "Properties fetched", result);
});
