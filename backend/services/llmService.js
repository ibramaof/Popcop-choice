import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


export const rewriteQuery = async (userInput) => {
    const prompt =
        `
    A user is looking for a movie recommendation. Based on their answers below, 
    write a single rich descriptive paragraph that captures their taste, mood, 
    and preferences. Make it descriptive and focus on themes, tone, and style.
    Do not recommend a specific movie. Just describe what they are looking for.
    
    User answers:
    ${userInput}
    
    Rich description:
  `

    const response = await ai.models.generateContent({
        model: process.env.LLM_MODEL,
        contents: prompt,
    });
    return response.text
};


export const generateRecommendation = async (userInput, movies) => {
    const moviesContext = movies.map((movie, index) => `
    ${index + 1}. ${movie.title} (${movie_release_date?.slice(0, 4)})
    Genres: ${movie.genres?.join(', ')}
    Overview: ${movie.overview}
    Rating: ${movie.vote_average}/10
    Similarity Score: ${(movie.similarity * 100).toFixed(1)}%
    `).join('\n');

    const prompt = `
    You are a friendly movie expert helping someone find their perfect film.
    
    The user is looking for:
    ${userInput}
    
    Based on their preferences here are some candidate movies from our database:
    ${moviesContext}
    
    Please recommend the top 2-3 best matches from this list. For each movie:
    - Explain specifically why it matches what the user is looking for
    - Mention the tone, themes, and what makes it special
    - Keep it conversational and enthusiastic
    
    Only recommend movies from the list above. Do not invent movies.
  `
    const result = await model.generateContent(prompt);
    return result.response.text();
}



