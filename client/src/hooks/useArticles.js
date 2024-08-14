import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import articlesAPI from '../api/articles-api';

export function useGetAllArticles() {
    const {articleId} = useParams();    
    const [username, setUsername] = useState('');
    const [comment, setComment] = useState('');
    const [article, setArticle] = useGetOneArticles(articleId);

    useEffect(() => {
        (async () => {
            const result = await articlesAPI.getAll(articleId);

            setArticle(result);
        })();
    }, []);

    return [article, setArticle];
    
}

export function useGetOneArticles(articleId) {
    const [article, setArticle] = useState({});

    useEffect(() => {
        (async () => {
            const result = await articlesAPI.getOne(articleId);
            console.log(result);
            console.log(articleId);
            setArticle(result);
        })();
    }, [articleId]);

    return [
        article, 
        setArticle,
    ];
}



export function useCreateArticle() {
    const articleCreateHandler = (articleData) => articlesAPI.create(articleData);
    return articleCreateHandler;
};

export function useDeleteArticle() {

};