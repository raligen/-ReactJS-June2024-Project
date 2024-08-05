import * as request from './requester';

const BASE_URL = 'http://localhost:3030/data/articles';

export const getAll = async () => {
    await result = request.get(BASE_URL);

    const articles = Object.values(result);

    return articles;
}

export const getOne = (articleId) => request.get(`${BASE_URL}/${articleId}`);

export const create = (articleData) => request.post(`${BASE_URL}`, articleData)

const articlesAPI = {
    getAll,
    getOne,
};

export default articlesAPI;