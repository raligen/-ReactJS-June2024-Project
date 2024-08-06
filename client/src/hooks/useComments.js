import commentsAPI from '../api/comments-api';


export function useCreateComment() {
    const createCommentHandler = (articleId, comment) => commentsAPI.create(articleId, comment);
    return createCommentHandler;
}

export function useGetAllComments(articleId) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        (async () => {
            const result = await commentsAPI.getAll(articleId);
            setComments(result);
        })();
    }, [articleId]);

    return [comments, setComments];
}