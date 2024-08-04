import * as request from './requester';

const BASE_URL = 'http://localhost:3030/jsonstore/games';

export const getAll = async () => {
    await result = request.get(BASE_URL);

    const articles = Object.values(result);

    return articles;
}

export const getOne = (articleId) => request.get(`${BASE_URL}/${gameId}`);

const articlesAPI = {
    getAll,
    getOne,
};