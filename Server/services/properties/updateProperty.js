const Property = require("../../models/Property");
const User = require("../../models/User");
const { ROLES } = require("../../constants");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage, deleteImage } = require("../uploads");

const validateLatLng = (lat, lng) => {
  const isLatProvided = lat !== undefined && lat !== null;
  const isLngProvided = lng !== undefined && lng !== null;
  if (isLatProvided !== isLngProvided) {
    throwError(400, "Both latitude and longitude are required together");
  }
};

exports.updateProperty = async (userId, propertyId, payload, images) => {
  validateObjectId(userId, "User Id");
  validateObjectId(propertyId, "Property Id");
  const user = await User.findById(userId);
  if (!user || user.isDeleted) throwError(404, "User not found");
  const property = await Property.findById(propertyId);
  if (!property || property.isDeleted) throwError(404, "Property not found");
  if (
    user.role !== ROLES.ADMIN &&
    property.ownerId.toString() !== userId.toString()
  ) {
    throwError(403, "You are not authorized to update this property");
  }
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
    removeImages = [],
    isReplaceImages = false,
  } = payload;
  validateLatLng(lat, lng);
  if (user.role !== ROLES.ADMIN) {
    ownerId = property.ownerId;
    ownerName = property.ownerName;
  }
  const updateData = {};
  let finalImages = [...property.images];
  if (removeImages.length) {
    const invalidImages = removeImages.filter(
      (img) => !finalImages.includes(img)
    );
    if (invalidImages.length) {
      throwError(
        400,
        "One or more images you are trying to remove do not exist"
      );
    }
    for (const img of removeImages) {
      await deleteImage(img);
    }
    finalImages = finalImages.filter((img) => !removeImages.includes(img));
  }
  if (images) {
    const uploadedImages = [];
    const imagesArr = Array.isArray(images) ? images : [images];
    for (const img of imagesArr) {
      const url = await uploadImage(img.tempFilePath);
      uploadedImages.push(url);
    }
    finalImages = isReplaceImages
      ? uploadedImages
      : [...finalImages, ...uploadedImages];
  }
  if (!finalImages.length) throwError(400, "At least one image is required");
  updateData.images = finalImages;
  if (ownerId) updateData.ownerId = ownerId;
  if (type) updateData.type = type;
  if (ownerName) updateData.ownerName = ownerName;
  if (mobile) updateData.mobile = mobile;
  if (rentAmount !== undefined) updateData.rentAmount = rentAmount;
  if (amountCurrencyCode) updateData.amountCurrencyCode = amountCurrencyCode;
  if (houseType) updateData.houseType = houseType;
  if (warehouseType) updateData.warehouseType = warehouseType;
  if (
    fullAddress ||
    area ||
    city ||
    state ||
    country ||
    zipcode ||
    lat !== undefined
  ) {
    updateData.address = {
      ...property.address,
      fullAddress:
        fullAddress ||
        `${area || property.address.area}, ${city || property.address.city}, ${
          zipcode || property.address.zipcode
        }, ${state || property.address.state}, ${
          country || property.address.country
        }`,
      area: area || property.address.area,
      city: city || property.address.city,
      state: state || property.address.state,
      country: country || property.address.country,
      zipcode: zipcode || property.address.zipcode,
      location:
        lat !== undefined
          ? { coordinates: [lat, lng] }
          : property.address.location,
    };
  }
  if (areaValue || areaUnit) {
    updateData.area = {
      value: areaValue ?? property.area.value,
      unit: areaUnit ?? property.area.unit,
    };
  }
  return await Property.findByIdAndUpdate(
    propertyId,
    { $set: updateData },
    { new: true }
  );
};
