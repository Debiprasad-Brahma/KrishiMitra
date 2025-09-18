import Escalation from "../models/Escalation.js";

export const createEscalation = async (req, res) => {
  try {
    const { name, location, crop, concern, issueDescription, language } = req.body;
    
    const escalation = await Escalation.create({
      user: req.user._id,
      name,
      location,
      crop,
      concern,
      issueDescription,
      language
    });

    res.status(201).json({
      success: true,
      message: "Escalation submitted successfully",
      escalation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllEscalations = async (req, res) => {
  try {
    // Officers can see all escalations, farmers only their own
    const filter = req.user.role === "officer" ? {} : { user: req.user._id };
    const escalations = await Escalation.find(filter)
      .populate("user", "name phone")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, escalations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
