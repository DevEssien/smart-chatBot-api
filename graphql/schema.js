const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type User {
        id: ID!
        email: String!
    }

    type AuthData {
        token: String
        userId: String!
    }

    type MessageStructure {
        role: String!
        content: String!
    }
    type ResultMessage {
        messages: [MessageStructure!]!
    }

    input UserInputData {
        email: String!
        password: String!
    }

    type RootMutation {
        signup(userInput: UserInputData): AuthData!
        search(content: String!): ResultMessage!
    }
    
    type RootQuery {
        login(email: String!, password: String!): User
        users: [User]
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }   
`)