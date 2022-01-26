import { ggl } from "@apollo/client";

export const GET_ME = ggl`
  query me {
    me {
      _id
      username
      bookCount
      savedBooks
    }
  }
`;
