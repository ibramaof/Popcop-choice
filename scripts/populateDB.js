import '../backend/config/env.js';
import { fetchMovies, fetchMovieKeyWords, fetchMoive } from '../backend/services/tmdbService.js';
import { embedText } from '../backend/services/embeddingService.js';
import { saveMovie } from '../backend/services/supabaseService.js';

const genreMap = {
    28: 'Action', 12: 'Adventure', 16: 'Animation',
    35: 'Comedy', 80: 'Crime', 99: 'Documentary',
    18: 'Drama', 10751: 'Family', 14: 'Fantasy',
    36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

// Helper: Sleep Function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Construct Movie Profile
const constructProfile = (movie, keywords) => {
    const genres = movie.genre_ids
        ? movie.genre_ids.map(id => genreMap[id]).filter(Boolean).join(', ')
        : movie.genres.map(g => g.name).join(', ') || ''
    return `
    ${movie.title} is a ${genres} film released in ${movie.release_date?.slice(0, 4)}.
    ${movie.overview}
    Keywords and themes: ${keywords.join(', ')}.
    Audience rating: ${movie.vote_average}/10.
  `.trim()
};


const populate = async () => {
    const totalPages = 10;
    let totalSkipped = 0;
    let savedCount = 0;

    console.log('Starting population script...');
    console.log(`Fetching ${totalPages} pages of movies from TMDB`);

    for (let page = 1; page <= totalPages; page++) {

        console.log(`\nFetching page ${page}/${totalPages}...`)
        const movies = await fetchMovies(page);

        for (const movie of movies) {
            try {

                if (!movie.overview || movie.overview.trim() === '') {
                    totalSkipped++;
                    continue;
                };

                const keywords = await fetchMovieKeyWords(movie.id);
                await sleep(300)

                const profile = constructProfile(movie, keywords);

                const embedding = await embedText(profile)
                await sleep(500)

                const movieData = {
                    tmdb_id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    genres: movie.genre_ids
                        ? movie.genre_ids.map(id => genreMap[id]).filter(Boolean)
                        : movie.genres?.map(g => g.name) || [],
                    keywords: keywords,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average,
                    release_date: movie.release_date,
                    profile,
                    embedding
                }
                await saveMovie(movieData)
                savedCount++
                console.log(`✓ Saved: ${movie.title}`)
            } catch (error) {
                if (error.message.includes('duplicate')) {
                    totalSkipped++
                    console.log(`- Skipped duplicate: ${movie.title}`)
                } else {
                    console.error(`✗ Failed: ${movie.title} — ${error.message}`)
                }
            }
        }
        await sleep(1000)
    }
}

populate()