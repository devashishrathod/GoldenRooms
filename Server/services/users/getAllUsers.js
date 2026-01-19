const mongoose = require("mongoose");
const User = require("../../models/User");
const { pagination } = require("../../utils/pagination");

exports.getAllUsers = async (query) => {
  let { page, limit, role, isActive, search, categoryId } = query;
  const matchStage = {};
  if (role) matchStage.role = role;
  if (isActive !== undefined) matchStage.isActive = isActive;
  else matchStage.isDeleted = false;
  if (search) {
    const regex = new RegExp(search, "i");
    matchStage.$or = [
      { name: regex },
      { email: regex },
      { mobile: regex },
      { address: regex },
    ];
  }
  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "agents",
        localField: "agentId",
        foreignField: "_id",
        as: "agent",
      },
    },
    { $unwind: { path: "$agent", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "categories",
        localField: "agent.speciality",
        foreignField: "_id",
        as: "agent.speciality",
      },
    },
  ];
  if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    pipeline.push({
      $match: {
        "agent.speciality._id": new mongoose.Types.ObjectId(categoryId),
      },
    });
  }
  pipeline.push(
    {
      $project: {
        name: 1,
        email: 1,
        mobile: 1,
        role: 1,
        lastActivity: 1,
        isActive: 1,
        isOnline: 1,
        createdAt: 1,
        agent: {
          _id: "$agent._id",
          name: "$agent.name",
          city: "$agent.city",
          jobTitle: "$agent.jobTitle",
          noOfYearsOfExperience: "$agent.noOfYearsOfExperience",
          noOfPropertiesSold: "$agent.noOfPropertiesSold",
          noOfDealsClosed: "$agent.noOfDealsClosed",
          languagesKnown: "$agent.languagesKnown",
          speciality: {
            _id: 1,
            name: 1,
            description: 1,
            image: 1,
            isActive: 1,
          },
        },
      },
    },
    { $sort: { createdAt: -1 } },
  );
  return await pagination(User, pipeline, page, limit);
};
