import { response } from "express";

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

const headers = {
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
}

export const fetchMovies = async (page = 1) => {
    const response = await fetch(`${TMDB_BASE_URL}/discover/movie?sort_by=vote_average.desc&vote_count.gte=1000&page=${page}`,
        { headers });
    const data = await response.json();
    return data.results

};

export const fetchMovieKeyWords = async (movieId) => {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/keywords`,
        { headers }
    );
    const data = await response.json();
    return data.keywords.map(k => k.name)
};

export const fetchMoive = async (movieId) => {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}`,
        { headers }
    );
    const data = await response.json();
    return {
        title: data.title,
        overview: data.overview,
        poster_path: data.poster_path,
        vote_average: data.vote_average,
        release_date: data.release_date,
        genres: data.genres.map(g => g.name)
    }
};