import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "http";

const reviews = [
  {
    id: "1",
    userId: "1",
    upc: "1",
    body: "Love it!",
  },
  {
    id: "2",
    userId: "1",
    upc: "2",
    body: "Too expensive.",
  },
  {
    id: "3",
    userId: "2",
    upc: "3",
    body: "Could be better.",
  },
  {
    id: "4",
    userId: "2",
    upc: "1",
    body: "Prefer something else.",
  },
];

createServer(
  createYoga({
    schema: createSchema({
      typeDefs: /* GraphQL */ `
        type Query {
          reviewsByUpc(upc: String!): [Review]!
          reviewsByUserId(userId: String!): [Review]!
        }
        type Review {
          id: ID!
          upc: String!
          userId: String!
          body: String!
        }
      `,
      resolvers: {
        Query: {
          reviewsByUpc: (_root, args) =>
            reviews.filter((review) => review.upc === args.upc),
            reviewsByUserId: (_root, args) => 
            reviews.filter((review) => review.userId === args.userId),
        },
      },
    }),
  })
).listen(4004, () => {
  console.log("Reviews service listening on port 4004");
});
