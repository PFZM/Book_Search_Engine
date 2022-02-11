const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
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

    saveBook: async (root, { bookID }, context) => {
      try {
        if (context.user) {
          const updateUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $push: { savedBooks: { bookID } } },
            { new: true }
          );
          return updateUser;
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (err) {
        console.error(err);
      }
    },
    removeBook: async (root, { bookID }, context) => {
      try {
        if (context.user) {
          const updateUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookID } } },
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
