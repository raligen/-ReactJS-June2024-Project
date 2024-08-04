import { useState } from "react";
import { useParams } from "react-router-dom";
import commentsApi from "../../api/comments-api";

export default function ArticleDetails(){
    const {articleId} = useParams()    
    const [username, setUsername] = useState('');
    const [comment, setComment] = useState('');
    const [article, setArticle] = useGetOneArticles(articleId);
    
       
    const commentSubmitHandler = async (e) => {
        e.preventDefault();

        const newComment = await commentsApi.create(articleId, username, comment)
    }

        //to be refactored

    return (
    
    );
}