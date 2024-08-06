import requester from "./requester";

const BASE_URL = 'http://localhost:3030/data/comments';

const create = (articleId, commentText) => requester.post(BASE_URL, {articleId, commentText});

const getAll = (articleId) => {
    const params = new URLSearchParams({
        where: `articleId="${articleId}"`
    });
    return requester.get(`${BASE_URL}?${params.toString()}`);
}

const commentsAPI {
    create,
    getAll,
}

export default commentsAPI;