import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_API_KEY
);

export const saveMovie = async (movie) => {
    const { error } = await supabase
        .from('movies')
        .insert(movie);

    if (error) throw new Error(`Failed to save movie: ${error.message}`);
};


export const searchSimillarMovies = async (embedding, threshold = 0.75, count = 10) => {
    const { data, error } = await supabase
        .rpc('match_movies', {
            query_embedding: embedding,
            match_threshold: threshold,
            match_count: count
        });
    if (error) throw new Error(`Search failed: ${error.message}`)
    return data
}

