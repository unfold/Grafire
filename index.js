import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import schema from './schema'

const app = express()
app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  formatError: (err) => { console.log(err.stack); return err },
  context: {},
}))

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}))

app.listen(process.env.PORT || 8080)
