import { ggl } from "@apollo/client";
import { ggl } from "@apollo/client";

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      bookCount
      savedBooks
    }
  }
`;
