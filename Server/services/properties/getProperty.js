const mongoose = require("mongoose");
const Property = require("../../models/Property");
const { throwError, validateObjectId } = require("../../utils");

exports.getProperty = async (propertyId) => {
  validateObjectId(propertyId, "Property Id");
  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(propertyId),
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        ownerName: 1,
        mobile: 1,
        address: 1,
        images: 1,
        type: 1,
        houseType: 1,
        area: 1,
        warehouseType: 1,
        isAvailable: 1,
        isVerified: 1,
        rentAmount: 1,
        amountCurrencyCode: 1,
        createdAt: 1,
        updatedAt: 1,
        ownerDetails: {
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email",
          mobile: "$user.mobile",
          address: "$user.address",
          image: "$user.image",
          isActive: "$user.isActive",
        },
      },
    },
  ];
  const [property] = await Property.aggregate(pipeline);
  const result = property || null;
  if (!result) throwError(404, "Property not found");
  return result;
};
