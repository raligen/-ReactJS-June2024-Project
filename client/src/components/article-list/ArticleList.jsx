import {useGetAllArticles} from '../../hooks/useArticles';
import ArticleListItem from './article-list-item/ArticleListItem';

export default function ArticleList(){
    const [articles, setArticles] = useGetAllArticles();
   
    return (
        <>
        {articles.length > 0
            ? articles.map(article => <ArticleListItem key={article._id} {...article} />)
            : <h3>No articles yet.</h3>
        }
        </>
    );
}