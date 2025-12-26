const Property = require("../../models/Property");
const User = require("../../models/User");
const { ROLES } = require("../../constants");
const { throwError, validateObjectId } = require("../../utils");
const { deleteImage } = require("../uploads");

exports.deleteProperty = async (userId, id) => {
  validateObjectId(userId, "User Id");
  validateObjectId(id, "Property Id");
  const user = await User.findById(userId);
  if (!user || user.isDeleted) throwError(404, "User not found");
  const result = await Property.findById(id);
  if (!result || result.isDeleted) throwError(404, "Property not found");
  if (
    user.role !== ROLES.ADMIN &&
    result?.ownerId?.toString() !== userId?.toString()
  ) {
    throwError(401, "You are not authorized to action this performance");
  }
  if (result?.images && result?.images.length) {
    for (const image of result?.images) {
      await deleteImage(image);
    }
  }
  await Property.findByIdAndUpdate(id, {
    images: null,
    isDeleted: true,
    isAvailable: false,
    isVerified: false,
  });
  return;
};
