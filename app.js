const express = require('express');
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const schema = require('./graphql/schema')
const resolver = require('./graphql/resolver')
const auth = require('./middlewares/auth')

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(auth)

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


app.use((error, req, res, next) => {
    console.log(error)
    const code = error?.code || 500;
    const message = error?.message || 'Server side error';
    const data = error?.data || null;
    return res.status(code).json({
        statusCode: code,
        message,
        data
    })
})

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/smart-chatDB', { useNewUrlParser: true})

app.listen(3000, () => {
    console.log('server is spinning at port 3000')
})