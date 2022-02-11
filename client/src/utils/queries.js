import { gql } from "@apollo/client";

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      bookcount
      savedBooks {
        bookID
        title
        authors
        description
        image
        link
      }
    }
  }
`;
