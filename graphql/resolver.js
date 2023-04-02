require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Configuration, OpenAIApi } = require("openai");

const User = require('../models/user')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    signup: async ({ userInput}) => {
        const { email, password } = userInput;
        const user = await User.findOne({ email: email }) 
        if (user) {
            const error = new Error('Email already exist!');
            error.code = 422;
            error.message = 'Email already exist!';
            throw error
        }
        const newUser = new User({
            email: email,
            password: await bcrypt.hash(password, 12),
            chat: []
        })
        const savedUser = await newUser.save();
        if (!savedUser) {
            const error = new Error('Server side error');
            error.code = 500;
            error.message = 'Server side error!';
            throw error
        }
        // console.log(newUser._id)
        return {
            _id: newUser._id.toString()
        }
    },

    login: async ({ email, password}, req) => {
        const user = await User.findOne({ email: email})
        console.log(user)
        if (!user) {
            const error = new Error('User not found!');
            error.code = 404;
            error.message = 'User not found!';
            throw error
        };
        const matchedPassword = await bcrypt.compare(password, user?.password);
        if (!matchedPassword) {
            const error = new Error('Incorrect password!');
            error.code = 401;
            error.message = 'Incorrect password!';
            throw error
        }
        const token = jwt.sign({
            _id: user._id.toString(),
            email: email
        }, 'checking0my2SecretKey234', { expiresIn: '1h'});

        req.token = token
        return {
            token,
            userId: user._id.toString(),
        }
    },

    search: async ({content}) => {
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
        
        // const completion = await openai.createChatCompletion({
        //     model,
        //     messages
        // });

        // if (!completion.status === 200) {
        //     const error = new Error('An error occured');
        //     error.code = completion.status;
        //     error.message = completion.statusText;
        //     throw error
        // }
        // const resultMessage = completion.data.choices[0].message
        // if (!resultMessage) {
        //     const error = new Error('No Response');
        //     error.code = 404;
        //     error.message = completion.statusText;
        //     throw error
        // }
        const resultMessage = {
            role: "Assistant",
            content: "There is no best footballer in the world as Neymar jr, Lionel Messi and Christiano Ronaldo is debated the world best footballers"
        }
        messages.push(resultMessage);

        // const user = await User.findById("6429d2d3e661a46d505e4704");
        // user.
        return {
            messages
        }
    }
}