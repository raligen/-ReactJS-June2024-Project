import { useState, useEffect } from "react";
import * as requester from "../../api/requester";
import articlesAPI from "../../api/articles-api";
import { Link } from "react-router-dom";

import ArticleListItem from './article-list-item/ArticleListItem';

export default function ArticleList(){
    const [allNews, setAllNews] = useState([]);


    useEffect(() => {
        (async () => {
              const result = await articlesAPI.getAll();
              setAllNews(result);
        })();
      }, []);


   
    return (


        <div className="container">
        {/* <div className="card border-0 mb-4 box-shadow h-xl-300">       */}
        <h5 className="m-0 pt-0 font-weight-bold spanborder">
            <span>Categories</span>
        </h5>        
              
              <ul className="nav justify-content-center">
                    <li className="nav-item">
                        <a type="button" className="nav-link active" href="#">All news</a>
                    </li>
              </ul>
        
        
        {allNews.length > 0
            ? allNews.map(articles => 
               <ArticleListItem key={articles._id} {...articles} />)
                 
            : <h3>No articles yet.</h3>
        }
            </div>
       
    );
}