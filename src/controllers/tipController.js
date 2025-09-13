import Tip from "../models/Tip.js";

export const getTips = async (req, res) => {
  const tips = await Tip.find({ language: req.user.language });
  res.json(tips);
};
