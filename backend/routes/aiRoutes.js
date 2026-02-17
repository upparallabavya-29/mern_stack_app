const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key available:', !!apiKey);
const genAI = new GoogleGenerativeAI(apiKey);

// Generate Interview Questions
router.post('/generate-questions', async (req, res) => {
    try {
        const { role, experienceLevel, topic } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Generate 5 technical interview questions for a ${role} position with ${experienceLevel} years of experience. Focus on ${topic || 'general'} topics. Return the response as a JSON array of strings.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Basic cleaning to ensure JSON format if the model returns markdown code blocks
        const cleanedText = text.replace(/```json|```/g, '').trim();

        try {
            const questions = JSON.parse(cleanedText);
            res.json({ questions });
        } catch (e) {
            res.json({ questions: [text] }); // Fallback if parsing fails
        }

    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({ error: 'Failed to generate questions' });
    }
});

// Evaluate Answer
router.post('/evaluate-answer', async (req, res) => {
    try {
        const { question, answer, role } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are an expert interviewer for a ${role} position. 
        Question: "${question}"
        Candidate Answer: "${answer}"
        
        Evaluate the answer. Provide a JSON response with:
        - score: (1-10)
        - feedback: (string)
        - improvements: (array of strings)
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const cleanedText = text.replace(/```json|```/g, '').trim();

        try {
            const evaluation = JSON.parse(cleanedText);
            res.json(evaluation);
        } catch (e) {
            res.status(500).json({ error: 'Failed to parse evaluation', raw: text });
        }

    } catch (error) {
        console.error('Error evaluating answer:', error);
        res.status(500).json({ error: 'Failed to evaluate answer' });
    }
});

module.exports = router;
