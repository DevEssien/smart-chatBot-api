const express = require('express');
const { graphqlHTTP } = require('express-graphql')

const schema = require('./graphql/schema')
const resolver = require('./graphql/resolver')

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: resolver,
    graphiql: true,
    customFormatErrorFn(err) {
        if (!err.originalError) {
            return err
        }
        const data = err.originalError?.data || null;
        console.log('data error ', data);
        const code = err.originalError?.code || 500;
        const message = err?.message || 'An error occured'

        return {
            status: code,
            message,
            data,
        }
    }
}))

app.listen(3000, () => {
    console.log('server is spinning at port 3000')
})