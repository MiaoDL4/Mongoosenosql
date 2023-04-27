const { User, Thought } = require("../models");

module.exports = {
  //get all users
  async getAllUsers(req, res) {
    try {
      const allUser = await User.find();
      res.json(allUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //get sigle user
  async getSingleUser(req, res) {
    try {
      const singleUser = await User.findOne({ _id: req.params.id })
        .populate("thoughts")
        .populate("friends")
        .select("-__v");
      if (!singleUser) {
        return res
          .status(404)
          .json({ message: "Unable to delete, No user with that ID" });
      }
      res.json(singleUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //post new user
  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //put update user
  async updateUser(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        res
          .status(404)
          .json({ message: "Unable to update, No user with this id!" });
      }

      res.json(updatedUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //delete user
  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findOneAndDelete({
        _id: req.params.id,
      });

      if (!deletedUser) {
        res.status(404).json({ message: "No user with that ID" });
      }

      await Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });
      res.json({ message: "user and associated thoughts deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // add friend
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      if (!user) {
        res.status(404).json({ message: "No user with that ID" });
        return;
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //remove friend
  async removeFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      if (!user) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
