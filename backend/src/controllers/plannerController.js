import Planner from "../models/Planner.js";

export const createPlanner = async (req, res) => {
  try {
    const { title, description, date, category } = req.body;
    const planner = await Planner.create({
      user: req.user.id,
      title,
      description,
      date,
      category,
    });
    res.status(201).json({ message: "Planner created successfully", planner });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating planner", error: error.message });
  }
};

export const getPlanners = async (req, res) => {
  try {
    const planners = await Planner.find({ user: req.user.id });
    res.status(200).json(planners);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching planners", error: error.message });
  }
};

export const updatePlanner = async (req, res) => {
  try {
    const planner = await Planner.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    if (!planner) return res.status(404).json({ message: "Planner not found" });
    res.status(200).json({ message: "Planner updated", planner });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating planner", error: error.message });
  }
};

export const deletePlanner = async (req, res) => {
  try {
    const planner = await Planner.findByIdAndDelete(req.params.id);
    if (!planner) return res.status(404).json({ message: "Planner not found" });
    res.status(200).json({ message: "Planner deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting planner", error: error.message });
  }
};
