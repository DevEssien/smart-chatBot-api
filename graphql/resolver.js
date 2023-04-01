require('dotenv').config()
const bcrypt = require('bcryptjs')
const { Configuration, OpenAIApi } = require("openai");
const { findOne } = require('../models/user');

const User = require('../models/user')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    signup: async ({ email, password}) => {
        try {
            const user = await findOne({ email: email}) 
            if (user) {
                const error = new Error('Email already exist!');
                error.code = 422;
                error.message = 'Email already exist!';
                throw error
            }
            const newUser = new User({
                email: 'essienemma',
                password: await bcrypt.hash(password, 12)
            })
            await newUser.save();
            return {
                userId: newUser._id
            }
        } catch(error) {
            if (!error.code) {
                error.code = 500
            }
            next(error)
        }
    },
    users: () => {
        try { 
           return  [
                {
                    name: 'Essien Emmanuel',
                    age: 89
                }
            ]   
        } catch(error) {
            console.log('error ', error)
        }
    },

    search: async ({content}) => {
        try {
            const model = "gpt-3.5-turbo"
            const messages = [
                {
                    "role": "system",
                    "content": 'you are a wonderful helpful assistant'
                },

                {
                    "role": "user",
                    "content": content
                }
            ];
            
            const completion = await openai.createChatCompletion({
                model,
                messages
            });

            if (!completion.status === 200) {
                const error = new Error('An error occured');
                error.code = completion.status;
                error.message = completion.statusText;
                throw error
            }
            const resultMessage = completion.data.choices[0].message
            messages.push(resultMessage)
            return {
                messages
            }
        } catch(error) {
            console.log("error", error)
        }
    }
}