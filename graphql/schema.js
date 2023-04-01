const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type User {
        name: String!
        age: Int!
    }

    type AuthData {
        token: String
        userId: String
    }

    type MessageStructure {
        role: String!
        content: String!
    }
    type ResultMessage {
        messages: [MessageStructure!]!
    }

    type RootMutation {
        signup(email: String!, password: String!): AuthData
        search(content: String!): ResultMessage!
    }
    
    type RootQuery {
        users: [User]
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }   
`)