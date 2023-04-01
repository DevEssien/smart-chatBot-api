const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type User {
        name: String!
        age: Int!
    }

    type MessageStructure {
        role: String!
        content: String!
    }
    type ResultMessage {
        messages: [MessageStructure!]!
    }

    type RootMutation {
        search(searchInput: String!): ResultMessage!
    }
    
    type RootQuery {
        users: [User]
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }   
`)