const mongoose = require("mongoose");
const { userField } = require("./validObjectId");
const {
  PROPERTY_TYPES,
  HOUSE_TYPES,
  WAREHOUSE_TYPES,
  AREA_UNITS,
  COUNTRY_NAME_TO_ISO,
} = require("../constants");

const propertySchema = new mongoose.Schema(
  {
    ownerId: userField,
    type: {
      type: String,
      enum: [...Object.values(PROPERTY_TYPES)],
      required: true,
    },
    images: {
      type: [String],
      validate: [(v) => v.length > 0, "At least one image required"],
    },
    ownerName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true },
    address: {
      fullAddress: { type: String },
      area: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String, default: "india" },
      zipcode: { type: String, match: /^\d{6}$/ },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: { type: [Number], default: [0, 0] }, // [lat, lng]
      },
    },
    rentAmount: { type: Number, required: true, min: 0 },
    amountCurrencyCode: {
      type: String,
      enum: [...Object.values(COUNTRY_NAME_TO_ISO)],
      default: COUNTRY_NAME_TO_ISO.india,
    },
    houseType: {
      type: String,
      enum: [...Object.values(HOUSE_TYPES)],
      required: function () {
        return this.type === PROPERTY_TYPES.HOUSE;
      },
    },
    area: {
      value: {
        type: Number,
        required: function () {
          return ["SHOP", "OFFICE", "LAND", "WAREHOUSE"].includes(this.type);
        },
      },
      unit: {
        type: String,
        enum: [...Object.values(AREA_UNITS)],
        default: AREA_UNITS.SQFT,
      },
    },
    warehouseType: {
      type: String,
      enum: [...Object.values(WAREHOUSE_TYPES)],
    },
    isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Property", propertySchema);
