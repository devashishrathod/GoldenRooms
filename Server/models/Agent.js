const mongoose = require("mongoose");
const validator = require("validator");
const { isValidPhoneNumber } = require("../validator/common");
const { userField, categoryField } = require("./validObjectId");

const agentSchema = new mongoose.Schema(
  {
    userId: userField,
    // location: locationField,
    name: { type: String },
    city: { type: String },
    jobTitle: { type: String },
    speciality: { type: [categoryField], required: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    mobile: {
      type: String,
      validate: {
        validator: isValidPhoneNumber,
        message: (props) => `${props.value} is not a valid mobile number`,
      },
    },
    noOfYearsOfExperience: { type: Number, min: 0 },
    noOfPropertiesSold: { type: Number, min: 0 },
    noOfDealsClosed: { type: Number, min: 0 },
    languagesKnown: { type: [String] },
    // images: { type: [String] },
    // uniqueId: { type: String, unique: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("Agent", agentSchema);
