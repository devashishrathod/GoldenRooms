const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllUsers } = require("../../services/users");
const { validateGetAllUsersQueries } = require("../../validator/users");

exports.getAllUsers = asyncWrapper(async (req, res, next) => {
  const { error, value } = validateGetAllUsersQueries(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllUsers(value);
  return sendSuccess(res, 200, "Users fetched successfully", result);
});
