import * as requester from "./requester";

const BASE_URL = 'http://localhost:3030/data/articles/';

export const getAll = async () => {
    const result = await requester.get(BASE_URL);

    const allNews = Object.values(result);

    return allNews;
};

export const getLatest = async () => {
    const urlSearchParams = new URLSearchParams({
        sortBy: `_createdOn desc`
    });

    const result = await requester.get(`${BASE_URL}?${urlSearchParams.toString()}`);

    const latestNews = Object.values(result);

    return latestNews;
};

export const getDetails = async () => {
    const URLSearchParams = new URLSearchParams({
        select: `title,creator,content,pubDate,image_url,category`
    });

    const result = await requester.get(`${BASE_URL}?${urlSearchParams.toString()}`);

    const articleDetails = Object.values(result);

    return articleDetails;

};

export const getOne = (articleId) => requester.get(`${BASE_URL}/${articleId}`);

export const create = (articleData) => requester.post(`${BASE_URL}`, articleData)

export const remove = (articleData) => requester.del(`${BASE_URL}/${articleId}`)

export const update = (articleId, articleData) => requester.put(`${BASE_URL}/${articleId}`, articleData);


const articlesAPI = {
    getAll,
    getLatest,
    getOne,
    create,
    remove,
    update,
};

export default articlesAPI;