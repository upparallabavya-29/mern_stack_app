const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const upload = multer({ storage: multer.memoryStorage() });

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key available:', !!apiKey);
const genAI = new GoogleGenerativeAI(apiKey);

// Generate Interview Questions
router.post('/generate-questions', async (req, res) => {
    try {
        const { role, experienceLevel, topic } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
// Generate Prompts from Resume
router.post('/generate-resume-questions', async (req, res) => {
    try {
        const { resumeText } = req.body;
        
        if (!resumeText) {
            return res.status(400).json({ error: 'Resume text is required.' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an expert technical recruiter analyzing a candidate's resume. 
        Read the following resume text carefully and extract 5 highly specific, challenging interview questions tailored directly to this candidate's listed skills, tools, past project experiences, and roles. 
        Do not ask generic questions; instead, refer specifically to technologies or experiences mentioned in the resume. Try to make the questions sound conversational.
        
        Resume text:
        """${resumeText}"""
        
        Return exactly 5 questions.
        Return the response as a valid JSON array of strings. Do not include markdown blocks like \`\`\`json.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Basic cleaning to ensure JSON format
        const cleanedText = text.replace(/```json|```/g, '').trim();

        try {
            const questions = JSON.parse(cleanedText);
            res.json({ questions });
        } catch (e) {
            res.json({ questions: [text] }); // Fallback if parsing fails
        }

    } catch (error) {
        console.error('Error generating resume questions:', error);
        res.status(500).json({ error: 'Failed to generate questions from resume' });
    }
});

// Handle Document Upload
router.post('/upload-resume-questions', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        let resumeText = '';
        const mimeType = req.file.mimetype;
        const originalName = req.file.originalname.toLowerCase();

        if (mimeType === 'application/pdf' || originalName.endsWith('.pdf')) {
            const pdfData = await pdfParse(req.file.buffer);
            resumeText = pdfData.text;
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || originalName.endsWith('.docx') || originalName.endsWith('.doc')) {
            const result = await mammoth.extractRawText({ buffer: req.file.buffer });
            resumeText = result.value;
        } else if (mimeType === 'text/plain' || originalName.endsWith('.txt')) {
            resumeText = req.file.buffer.toString('utf8');
        } else {
            return res.status(400).json({ error: 'Unsupported file format. Please upload PDF or Word document.' });
        }

        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(400).json({ error: 'Could not extract text from document.' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an expert technical recruiter analyzing a candidate's resume. 
        Read the following resume text carefully and extract 5 highly specific, challenging interview questions tailored directly to this candidate's listed skills, tools, past project experiences, and roles. 
        Do not ask generic questions; instead, refer specifically to technologies or experiences mentioned in the resume. Try to make the questions sound conversational.
        
        Resume text:
        """${resumeText}"""
        
        Return exactly 5 questions.
        Return the response as a valid JSON array of strings. Do not include markdown blocks like \`\`\`json.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const cleanedText = text.replace(/```json|```/g, '').trim();

        try {
            const questions = JSON.parse(cleanedText);
            res.json({ questions });
        } catch (e) {
            res.json({ questions: [text] }); // Fallback if parsing fails
        }
    } catch (error) {
        console.error('Error generating uploaded resume questions:', error);
        res.status(500).json({ error: 'Failed to process document and generate questions' });
    }
});

// Evaluate Answer
router.post('/evaluate-answer', async (req, res) => {
    try {
        const { question, answer, role } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
