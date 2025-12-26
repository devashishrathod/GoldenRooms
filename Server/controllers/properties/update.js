const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { validateUpdateProperty } = require("../../validator/properties");
const { updateProperty } = require("../../services/properties");

exports.update = asyncWrapper(async (req, res) => {
  const propertyId = req.params?.id;
  const { error, value } = validateUpdateProperty(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await updateProperty(
    req.userId,
    propertyId,
    value,
    req.files?.images
  );
  return sendSuccess(res, 200, "Property updated successfully", result);
});
