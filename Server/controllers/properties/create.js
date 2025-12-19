const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { validateCreateProperty } = require("../../validator/properties");
const { createProperty } = require("../../services/properties");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateProperty(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const userId = req.userId;
  const images = req.files?.images;
  const result = await createProperty(userId, value, images);
  return sendSuccess(res, 201, "Property added successfully", result);
});
