const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (root, { username }) => {
      try {
        return User.findOne({ username });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error finding the usser" });
      }
    },
  },

  Mutation: {
    addUser: async (root, { username, email, password }) => {
      try {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding the user" });
      }
    },

    login: async (root, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError("No user found with these details");
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          throw new AuthenticationError("Incorrect credentials");
        }

        const token = signToken(user);

        return { token, user };
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error logging in" });
      }
    },

    saveBook: async (root, { user, body }) => {
      try {
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error logging in" });
      }
    },
  },
};
