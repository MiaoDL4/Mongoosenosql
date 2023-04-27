const { Thought, User } = require("../models");

module.exports = {
  //get all thoughts
  async getAllThoughts(req, res) {
    try {
      const allThoughts = await Thought.find({});
      res.json(allThoughts);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //get single thought
  async getSingleThought(req, res) {
    try {
      const singleThought = await Thought.findById(req.params.id);
      if (!singleThought) {
        res
          .status(404)
          .json({ message: "unable to get thought: no thought with that ID" });
        return;
      }
      res.json(singleThought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //post new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      await User.findByIdAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { runValidators: true, new: true }
      );
      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //put update thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thought) {
        res.status(404).json({
          message: "unable to update thought: no thought with that ID",
        });
        return;
      }
      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Delete thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.id);
      if (!thought) {
        res.status(404).json({
          message: "unable to delete thought: no thought with that ID",
        });
        return;
      }
      res.json({ message: "thought deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //add reaction
  async addReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        res
          .status(404)
          .json({ message: "unable to add reaction: no thought with that ID" });
        return;
      }
      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //remove reaction
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        res.status(404).json({
          message: "unable to delete reaction: no thought with that ID",
        });
        return;
      }
      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
