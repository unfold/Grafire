import firebase from 'firebase'
import { filter, map } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'

firebase.initializeApp({
  databaseURL: 'https://grafire-b1b6e.firebaseio.com',
})

const mapSnapshotToEntity = snapshot => ({ id: snapshot.key, ...snapshot.val() })
const mapSnapshotToEntities = snapshot => map(snapshot.val(), (value, id) => ({ id, ...value }))

const ref = path => firebase.database().ref(path)
const getValue = path => ref(path).once('value')
const getEntity = path => getValue(path).then(mapSnapshotToEntity)
const getEntities = path => getValue(path).then(mapSnapshotToEntities)

// http://dev.apollodata.com/tools/graphql-tools/resolvers.html
const resolvers = {
  Author: {
    posts(author) {
      return getEntities('posts').then(posts => filter(posts, { authorId: author.id }))
    },
  },

  Post: {
    author(post) {
      return getEntities('authors').then(posts => filter(authors, { id: authorId }))
    },
  },

  Query: {
    posts() {
      return getEntities('posts')
    },

    authors() {
      // ... so a resolver can return a promise that resolves to an array, or an array of promises, and both are handled correctly.
      return getEntities('authors')
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
    authors: [Author]
  }
`

export default makeExecutableSchema({ typeDefs: schema, resolvers })
