const { ROLES } = require("../../constants");
const Property = require("../../models/Property");
const User = require("../../models/User");
const { throwError } = require("../../utils");
const { uploadImage, uploadVideo } = require("../uploads");

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
    type,
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
    console.log(imagesArr, "done");
    for (let image of imagesArr) {
      const imageUrl = await uploadImage(image.tempFilePath);
      imageUrls.push(imageUrl);
    }
  }
  console.log(imageUrls, "arr");
  const propertyData = {
    ownerId,
    type,
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
