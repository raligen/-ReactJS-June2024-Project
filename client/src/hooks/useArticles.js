import { useState, useEffect } from "react";
import articlesAPI from '../api/articles-api';

export function useGetAllArticles() {
    const {articleId} = useParams()    
    const [username, setUsername] = useState('');
    const [comment, setComment] = useState('');
    const [article, setArticle] = useGetOneArticles(articleId);

    useEffect(() => {
        (async () => {
            const result = await articlesAPI.getOne(articleId);

            setArticle(result);
        })();
    }, []);

    return [articles, setArticles]
    
}

export function useGetOneArticles(articleId) {
    const [article, setArticle] = useState({});

    useEffect(() => {
        (async () => {
            const result = await articlesAPI.getOne(articleId);

            setArticle(result);
        })();
    }, [articleId]);

    return [
        article, 
        setArticle,
    ];
}