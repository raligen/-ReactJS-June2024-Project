//import { articlesAPI } from "../../api/articles-api";
import {useGetAllArticles} from '../../hooks/useArticles';
import ArticleListItem from './article-list-item/ArticleListItem';

export default function ArticleList(){
    const [articles, setArticles] = useGetAllArticles();


   
    return (
        <>
           <div className="container pt-4 pb-4 align-self-center">          
              <h5 className="m-0 pt-0 font-weight-bold spanborder">
                <span>Categories</span>
              </h5>
              
              <ul className="nav justify-content-center">
                    <li className="nav-item">
                        <a type="button" className="nav-link active" href="#">All news</a>
                    </li>
              </ul>
        
        {articles.length > 0
            ? articles.map(article => <ArticleListItem key={article._id} {...article} />)
            : <h3>No articles yet.</h3>
        }
            </div>
        </>
    );
}