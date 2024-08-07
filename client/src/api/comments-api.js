import requester from "./requester";

const BASE_URL = 'http://localhost:3030/data/comments';

const create = (articleId, content) => requester.post(BASE_URL, {articleId, content});

const getAll = (articleId) => {
    const params = new URLSearchParams({
        where: `articleId="${articleId}"`,
        load: `author=_ownerId:users`
    });
    return requester.get(`${BASE_URL}?${params.toString()}`);
}

const commentsAPI = {
    create,
    getAll,
}

export default commentsAPI;