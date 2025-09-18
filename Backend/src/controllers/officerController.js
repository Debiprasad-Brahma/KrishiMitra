import User from "../models/User.js";
import Query from "../models/Query.js";

export const getAllQueries = async (req, res) => {
  const queries = await Query.find().populate("user");
  res.json(queries);
};

export const getFarmers = async (req, res) => {
  const farmers = await User.find({ role: "farmer" });
  res.json(farmers);
};
