import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const startInterview = async (role, experienceLevel, topic) => {
    try {
        const response = await api.post('/ai/generate-questions', { role, experienceLevel, topic });
        return response.data;
    } catch (error) {
        console.error('Error starting interview:', error);
        throw error;
    }
};

export const evaluateAnswer = async (question, answer, role) => {
    try {
        const response = await api.post('/ai/evaluate-answer', { question, answer, role });
        return response.data;
    } catch (error) {
        console.error('Error evaluating answer:', error);
        throw error;
    }
};

export const uploadResumeFile = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    try {
        const response = await api.post('/ai/upload-resume-questions', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading resume:', error);
        throw error;
    }
};

export default api;
