const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello?");
        const response = await result.response;
        console.log(response.text());
    } catch (e) {
        require('fs').writeFileSync('err.txt', e.message);
        console.error('ERROR OCCURRED:', e.message);
    }
}
run();
