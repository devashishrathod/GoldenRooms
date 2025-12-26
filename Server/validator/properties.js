const Joi = require("joi");
const objectId = require("./validJoiObjectId");
const {
  PROPERTY_TYPES,
  HOUSE_TYPES,
  WAREHOUSE_TYPES,
  AREA_UNITS,
  COUNTRY_NAME_TO_ISO,
} = require("../constants");

exports.validateCreateProperty = (data) => {
  const createSchema = Joi.object({
    ownerId: objectId().optional(),
    type: Joi.string()
      .valid(...Object.values(PROPERTY_TYPES))
      .required(),
    ownerName: Joi.string().trim().optional(),
    mobile: Joi.string().length(10).required(),
    fullAddress: Joi.string().optional(),
    area: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().default("india"),
    zipcode: Joi.string()
      .pattern(/^\d{6}$/)
      .required(),
    lat: Joi.number().default(0).optional(),
    lng: Joi.number().default(0).optional(),
    rentAmount: Joi.number().min(0).required(),
    amountCurrencyCode: Joi.string()
      .valid(...Object.values(COUNTRY_NAME_TO_ISO))
      .optional(),
    houseType: Joi.when("type", {
      is: PROPERTY_TYPES.HOUSE,
      then: Joi.string()
        .valid(...Object.values(HOUSE_TYPES))
        .required(),
      otherwise: Joi.forbidden(),
    }),
    warehouseType: Joi.when("type", {
      is: PROPERTY_TYPES.WAREHOUSE,
      then: Joi.string()
        .valid(...Object.values(WAREHOUSE_TYPES))
        .optional()
        .default(WAREHOUSE_TYPES.COMMERCIAL),
      otherwise: Joi.forbidden(),
    }),
    areaValue: Joi.when("type", {
      is: Joi.valid(
        PROPERTY_TYPES.SHOP,
        PROPERTY_TYPES.OFFICE,
        PROPERTY_TYPES.LAND,
        PROPERTY_TYPES.WAREHOUSE
      ),
      then: Joi.number().required(),
    }),
    areaUnit: Joi.when("type", {
      is: Joi.valid(
        PROPERTY_TYPES.SHOP,
        PROPERTY_TYPES.OFFICE,
        PROPERTY_TYPES.LAND,
        PROPERTY_TYPES.WAREHOUSE
      ),
      then: Joi.string()
        .valid(...Object.values(AREA_UNITS))
        .default(AREA_UNITS.SQFT),
      otherwise: Joi.forbidden(),
    }),
  }).and("lat", "lng");
  return createSchema.validate(data, { abortEarly: false });
};

exports.validateUpdateProperty = (data) => {
  const updateSchema = Joi.object({
    ownerId: objectId().optional(),
    type: Joi.string()
      .valid(...Object.values(PROPERTY_TYPES))
      .optional(),
    ownerName: Joi.string().trim().optional(),
    mobile: Joi.string().length(10).optional(),
    fullAddress: Joi.string().optional(),
    area: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().default("india"),
    zipcode: Joi.string()
      .pattern(/^\d{6}$/)
      .optional(),
    lat: Joi.number().optional(),
    lng: Joi.number().optional(),
    rentAmount: Joi.number().min(0).optional(),
    amountCurrencyCode: Joi.string()
      .valid(...Object.values(COUNTRY_NAME_TO_ISO))
      .optional(),
    houseType: Joi.when("type", {
      is: PROPERTY_TYPES.HOUSE,
      then: Joi.string()
        .valid(...Object.values(HOUSE_TYPES))
        .required(),
      otherwise: Joi.forbidden(),
    }),
    warehouseType: Joi.when("type", {
      is: PROPERTY_TYPES.WAREHOUSE,
      then: Joi.string()
        .valid(...Object.values(WAREHOUSE_TYPES))
        .optional(),
      otherwise: Joi.forbidden(),
    }),
    areaValue: Joi.when("type", {
      is: Joi.valid(
        PROPERTY_TYPES.SHOP,
        PROPERTY_TYPES.OFFICE,
        PROPERTY_TYPES.LAND,
        PROPERTY_TYPES.WAREHOUSE
      ),
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),
    areaUnit: Joi.when("type", {
      is: Joi.valid(
        PROPERTY_TYPES.SHOP,
        PROPERTY_TYPES.OFFICE,
        PROPERTY_TYPES.LAND,
        PROPERTY_TYPES.WAREHOUSE
      ),
      then: Joi.string()
        .valid(...Object.values(AREA_UNITS))
        .default(AREA_UNITS.SQFT),
      otherwise: Joi.forbidden(),
    }),
    removeImages: Joi.array().items(Joi.string().uri()).optional(),
    isReplaceImages: Joi.boolean().optional(),
    isAvailable: Joi.boolean().optional(),
    isVerified: Joi.boolean().optional(),
  })
    .and("lat", "lng")
    .unknown(false);
  return updateSchema.validate(data, { abortEarly: false });
};

exports.validateGetAllPropertiesQuery = (data) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().trim().min(1).max(100),
    ownerId: objectId().optional(),
    ownerName: Joi.string().trim().min(1).max(100),
    mobile: Joi.string().trim().min(5).max(15),
    city: Joi.string().trim().min(1).max(100),
    state: Joi.string().trim().min(1).max(100),
    country: Joi.string().trim().min(1).max(100),
    zipcode: Joi.string().pattern(/^\d{6}$/),
    type: Joi.string()
      .valid(...Object.values(PROPERTY_TYPES))
      .uppercase(),
    houseType: Joi.string()
      .valid(...Object.values(HOUSE_TYPES))
      .uppercase(),
    warehouseType: Joi.string()
      .valid(...Object.values(WAREHOUSE_TYPES))
      .uppercase(),
    areaUnit: Joi.string()
      .valid(...Object.values(AREA_UNITS))
      .uppercase(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    minArea: Joi.number().min(0),
    maxArea: Joi.number().min(0),
    isAvailable: Joi.boolean(),
    isVerified: Joi.boolean(),
    fromDate: Joi.date().iso(),
    toDate: Joi.date().iso(),
    sortBy: Joi.string().valid("createdAt", "updatedAt", "rentAmount"),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
  })
    .custom((value, helpers) => {
      if (value.minPrice && value.maxPrice && value.minPrice > value.maxPrice) {
        return helpers.error("any.invalid", {
          message: "minPrice cannot be greater than maxPrice",
        });
      }
      if (value.minArea && value.maxArea && value.minArea > value.maxArea) {
        return helpers.error("any.invalid", {
          message: "minArea cannot be greater than maxArea",
        });
      }
      if (value.fromDate && value.toDate) {
        const from = new Date(value.fromDate);
        const to = new Date(value.toDate);
        if (from > to) {
          return helpers.error("any.invalid", {
            message: "fromDate cannot be greater than toDate",
          });
        }
      }
      return value;
    })
    .unknown(false);
  return schema.validate(data, { abortEarly: false });
};
