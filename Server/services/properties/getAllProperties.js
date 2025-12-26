const mongoose = require("mongoose");
const Property = require("../../models/Property");
const { pagination } = require("../../utils");

exports.getAllProperties = async (query) => {
  let {
    page = 1,
    limit = 10,
    search,
    ownerName,
    mobile,
    ownerId,
    city,
    state,
    country,
    zipcode,
    type,
    houseType,
    warehouseType,
    areaUnit,
    minArea,
    maxArea,
    minPrice,
    maxPrice,
    isAvailable,
    isVerified,
    fromDate,
    toDate,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;
  page = Number(page);
  limit = Number(limit);
  const match = { isDeleted: false };
  if (isAvailable !== undefined) {
    match.isAvailable = isAvailable === "true" || isAvailable === true;
  }
  if (isVerified !== undefined) {
    match.isVerified = isVerified === "true" || isVerified === true;
  }
  if (type) match.type = type.toUpperCase();
  if (houseType) match.houseType = houseType.toUpperCase();
  if (warehouseType) match.warehouseType = warehouseType.toUpperCase();
  if (areaUnit) match["area.unit"] = areaUnit.toUpperCase();
  if (ownerId) match.ownerId = new mongoose.Types.ObjectId(ownerId);
  if (ownerName) match.ownerName = { $regex: ownerName, $options: "i" };
  if (mobile) match.mobile = mobile;
  if (city) match["address.city"] = { $regex: city, $options: "i" };
  if (state) match["address.state"] = { $regex: state, $options: "i" };
  if (country) match["address.country"] = { $regex: country, $options: "i" };
  if (zipcode) match["address.zipcode"] = zipcode;
  if (minPrice || maxPrice) {
    match.rentAmount = {};
    if (minPrice) match.rentAmount.$gte = Number(minPrice);
    if (maxPrice) match.rentAmount.$lte = Number(maxPrice);
  }
  if (minArea || maxArea) {
    match["area.value"] = {};
    if (minArea) match["area.value"].$gte = Number(minArea);
    if (maxArea) match["area.value"].$lte = Number(maxArea);
  }
  if (fromDate || toDate) {
    match.createdAt = {};
    if (fromDate) match.createdAt.$gte = new Date(fromDate);
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      match.createdAt.$lte = end;
    }
  }
  if (search) {
    const regex = new RegExp(search, "i");
    match.$or = [
      { ownerName: regex },
      { mobile: regex },
      { "address.city": regex },
      { "address.state": regex },
      { "address.country": regex },
      { type: regex },
      { houseType: regex },
      { warehouseType: regex },
    ];
  }
  const pipeline = [
    { $match: match },
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
        ownerName: 1,
        mobile: 1,
        images: 1,
        address: 1,
        type: 1,
        houseType: 1,
        warehouseType: 1,
        area: 1,
        rentAmount: 1,
        amountCurrencyCode: 1,
        isAvailable: 1,
        isVerified: 1,
        createdAt: 1,
        ownerDetails: {
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email",
          mobile: "$user.mobile",
          image: "$user.image",
          isActive: "$user.isActive",
        },
      },
    },
  ];
  const allowedSort = ["createdAt", "rentAmount", "updatedAt"];
  if (!allowedSort.includes(sortBy)) sortBy = "createdAt";
  pipeline.push({
    $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 },
  });
  return pagination(Property, pipeline, page, limit);
};
