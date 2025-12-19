const Joi = require("joi");
const {
  PROPERTY_TYPES,
  HOUSE_TYPES,
  WAREHOUSE_TYPES,
  AREA_UNITS,
  COUNTRY_NAME_TO_ISO,
} = require("../constants");

exports.validateCreateProperty = (data) => {
  const createSchema = Joi.object({
    ownerId: Joi.string().optional(),
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
