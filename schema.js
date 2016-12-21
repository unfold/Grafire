import { find, filter } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'

const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
]

const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL' },
  { id: 2, authorId: 2, title: 'GraphQL Rocks' },
  { id: 3, authorId: 2, title: 'Advanced GraphQL' },
]

const resolvers = {
  Author: {
    posts(author) {
      return filter(posts, { authorId: author.id })
    },
  },

  Post: {
    author(post) {
      return find(authors, { id: post.authorId })
    },
  },

  Query: {
    posts() {
      return posts
    }
  },
}

const schema = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
    author: Author
  }

  type Query {
    posts: [Post]
  }
`

export default makeExecutableSchema({ typeDefs: schema, resolvers })
