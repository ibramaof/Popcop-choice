import { Router } from 'express';
import { rewriteQuery, generateRecommendation } from '../services/llmService.js';
import { embedText } from '../services/embeddingService.js';
import { searchSimillarMovies } from '../services/supabaseService.js';

const router = Router()
const combineUserInput = (body) => {
    return `
    Favourite movie: ${body.favouriteMovie}
    Mood: ${body.mood}
    Preferred genre: ${body.genre}
    What they want: ${body.preference}
  `.trim()
}

router.post('/recommend', async (req, res) => {
    try {

        const userInput = combineUserInput(req.body);
        const richQuery = await rewriteQuery(userInput);
        const queryEmbedding = await embedText(richQuery);
        const similarMovies = await searchSimillarMovies(queryEmbedding);

        if (!similarMovies || similarMovies.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No matching movies found. Try describing your preferences differently.'
            });
        };

        const recommendation = await generateRecommendation(userInput, similarMovies);

        res.json({
            success: true,
            recommendation,
            movies: similarMovies.slice(0, 3)
        });
    } catch (error) {
        console.error('Recommendation error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    };
})

export default router