const { ROLES } = require("../../constants");
const Property = require("../../models/Property");
const User = require("../../models/User");
const Category = require("../../models/Category");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage } = require("../uploads");

const validateLatLng = (lat, lng) => {
  const isLatProvided = lat !== undefined && lat !== null;
  const isLngProvided = lng !== undefined && lng !== null;
  if (isLatProvided !== isLngProvided) {
    throwError(400, "Both latitude and longitude are required together");
  }
};

exports.createProperty = async (userId, payload, images) => {
  const user = await User.findById(userId);
  if (!user || user.isDeleted) throwError(404, "User not found");
  let {
    ownerId,
    // type,
    categoryId,
    ownerName,
    mobile,
    fullAddress,
    area,
    city,
    state,
    country,
    zipcode,
    lat,
    lng,
    rentAmount,
    amountCurrencyCode,
    houseType,
    warehouseType,
    areaValue,
    areaUnit,
  } = payload;
  validateLatLng(lat, lng);
  if (user?.role !== ROLES.ADMIN) {
    ownerId = userId;
    ownerName = user?.name;
  }
  const imageUrls = [];
  if (images) {
    const imagesArr = Array.isArray(images) ? images : [images];
    for (let image of imagesArr) {
      const imageUrl = await uploadImage(image.tempFilePath);
      imageUrls.push(imageUrl);
    }
  }
  validateObjectId(categoryId, "category Id");
  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });
  if (!category) throwError(404, "Category not found");
  const propertyData = {
    ownerId,
    // type,
    categoryId,
    ownerName,
    mobile,
    address: {
      fullAddress:
        fullAddress || `${area}, ${city}, ${zipcode}, ${state}, ${country}`,
      area,
      city,
      state,
      country: country || "india",
      zipcode,
      location: { coordinates: [lat, lng] },
    },
    rentAmount,
    amountCurrencyCode,
    houseType,
    warehouseType,
    area: {
      value: areaValue,
      unit: areaUnit,
    },
    images: imageUrls,
  };
  return await Property.create(propertyData);
};
