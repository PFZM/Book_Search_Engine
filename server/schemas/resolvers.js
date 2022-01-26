const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (root, { username }) => {
      try {
        return User.findOne({ username });
      } catch (err) {
        console.error(err);
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
      }
    },

    saveBook: async (root, { bookId }, context) => {
      try {
        if (context.user) {
          const updateUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: { bookId } } },
            { new: true }
          );
          return updateUser;
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (err) {
        console.error(err);
      }
    },
    removeBook: async (root, { bookId }, context) => {
      try {
        if (context.user) {
          const updateUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
          return updateUser;
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (err) {
        console.error(err);
      }
    },
  },
};

module.export = resolvers;
