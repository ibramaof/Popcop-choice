import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    apiVersion: 'v1beta'
});

export const embedText = async (text) => {
    const response = await ai.models.embedContent({
        model: process.env.EMBEDDING_MODEL,
        contents: text,
    });


    return response.embeddings[0].values;
}

