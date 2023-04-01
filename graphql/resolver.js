require('dotenv').config()
const bcrypt = require('bcryptjs')
const { Configuration, OpenAIApi } = require("openai");

const User = require('../models/user')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    signup: async ({ userInput}) => {
        const { email, password } = userInput;
        const user = await User.findOne({ email: email}) 
        if (user) {
            const error = new Error('Email already exist!');
            error.code = 422;
            error.message = 'Email already exist!';
            throw error
        }
        const newUser = new User({
            email: email,
            password: await bcrypt.hash(password, 12)
        })
        const savedUser = await newUser.save();
        if (!savedUser) {
            const error = new Error('Server side error');
            error.code = 500;
            error.message = 'Server side error!';
            throw error
        }
        return {
            userId: newUser._id
        }
    },

    login: async ({ email, password}) => {
        const user = await User.findOne({ email: email})
        if (!user) {
            const error = new Error('User not found!');
            error.code = 404;
            error.message = 'EUser not found!';
            throw error
        };
        const matchedPassword = await bcrypt.compare(password, user?.password);
        if (!matchedPassword) {
            const error = new Error('Incorrect password!');
            error.code = 401;
            error.message = 'Incorrect password!';
            throw error
        }
        return user
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