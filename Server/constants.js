module.exports = {
  ROLES: Object.freeze({
    ADMIN: "admin",
    AGENT: "agent",
    CUSTOMER: "customer",
    USER: "user",
  }),

  LOGIN_TYPES: Object.freeze({
    EMAIL: "email",
    MOBILE: "mobile",
    GOOGLE: "google",
    PASSWORD: "password",
    OTHER: "other",
  }),

  PLATFORMS: Object.freeze({
    WEB: "web",
    ANDROID: "android",
    IOS: "ios",
  }),

  SUBSCRIPTION_TYPES: Object.freeze({
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    QUATERLY: "quarterly",
    HALF_YEARLY: "half_yearly",
    YEARLY: "yearly",
  }),

  DURATION_MAP: Object.freeze({
    weekly: 7,
    monthly: 30,
    quarterly: 90,
    half_yearly: 180,
    yearly: 365,
  }),

  SUBSCRIPTION_PLANS: Object.freeze({
    FREE: "free",
    BASIC: "basic",
    PREMIUM: "premium",
    Family: "family",
  }),

  PRODUCT_TYPES: Object.freeze({
    GROCERY: "grocery",
    ELECTRONICS: "electronics",
    CLOTHING: "clothing",
  }),

  ZIP_CODE_REGEX_MAP: Object.freeze({
    IN: /^[1-9][0-9]{5}$/, // India (6 digits)
    US: /^\d{5}(-\d{4})?$/, // USA (ZIP or ZIP+4)
    CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, // Canada (A1A 1A1)
    UK: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i, // United Kingdom (SW1A 1AA)
    AU: /^\d{4}$/, // Australia (4 digits)
    DE: /^\d{5}$/, // Germany
    FR: /^\d{5}$/, // France
    IT: /^\d{5}$/, // Italy
    ES: /^\d{5}$/, // Spain
    BR: /^\d{5}-?\d{3}$/, // Brazil (12345-678 or 12345678)
    RU: /^\d{6}$/, // Russia
  }),

  COUNTRY_NAME_TO_ISO: Object.freeze({
    india: "IN",
    unitedstates: "US",
    usa: "US",
    canada: "CA",
    uk: "UK",
    unitedkingdom: "UK",
    australia: "AU",
    germany: "DE",
    france: "FR",
    italy: "IT",
    spain: "ES",
    brazil: "BR",
    russia: "RU",
  }),

  PROPERTY_TYPES: Object.freeze({
    HOUSE: "HOUSE",
    SHOP: "SHOP",
    OFFICE: "OFFICE",
    LAND: "LAND",
    WAREHOUSE: "WAREHOUSE",
  }),

  HOUSE_TYPES: Object.freeze({
    ONE_ROOM: "1R",
    ONE_RK: "1RK",
    ONE_BHK: "1BHK",
    TWO_BHK: "2BHK",
    THREE_BHK: "3BHK",
    FOUR_BHK: "4BHK",
    ROW_HOUSE: "ROW_HOUSE",
  }),

  WAREHOUSE_TYPES: Object.freeze({
    COLD_STORAGE: "COLD_STORAGE",
    INDUSTRIAL: "INDUSTRIAL",
    COMMERCIAL: "COMMERCIAL",
  }),

  AREA_UNITS: Object.freeze({ SQFT: "SQFT", SQM: "SQM", ACRE: "ACRE" }),

  DEFAULT_IMAGES: Object.freeze({
    PRENATAL_CARE:
      "https://res.cloudinary.com/drvdnqydw/image/upload/f_auto,q_auto/v1/Images/hrhc8iwbjl2qnnqu9kaq?_a=BAMAK+Jw0",
    CATEGORY:
      "https://res.cloudinary.com/drvdnqydw/image/upload/f_auto,q_auto/v1/Images/hrhc8iwbjl2qnnqu9kaq?_a=BAMAK+Jw0",
    SUBCATEGORY:
      "https://res.cloudinary.com/drvdnqydw/image/upload/f_auto,q_auto/v1/Images/zsbowllown6ddeb4jnw0?_a=BAMAK+Jw0",
    PRODUCT:
      "https://res.cloudinary.com/drvdnqydw/image/upload/f_auto,q_auto/v1/Images/zsbowllown6ddeb4jnw0?_a=BAMAK+Jw0",
    BANNER:
      "https://res.cloudinary.com/drvdnqydw/image/upload/f_auto,q_auto/v1/Images/zsbowllown6ddeb4jnw0?_a=BAMAK+Jw0",
  }),
};
