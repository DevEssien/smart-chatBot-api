require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    
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

    search: async ({searchInput}) => {
        try {
            const model = "gpt-3.5-turbo"
            const messages = [
                {
                    "role": "system",
                    "content": 'you are a wonderful helpful assistant'
                },

                {
                    "role": "user",
                    "content": 'What is the recipe to make banana muffins'
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
            // console.log('result message ', resultMessage)
            // const chat = messages.push(resultMessage)
            // console.log('chat ', typeof chat)
            // return chat
            return {
                messages
            }
        } catch(error) {
            console.log("error", error)
        }
    }
}