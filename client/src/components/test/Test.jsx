import { useState, useEffect } from "react";
import * as requester from "../../api/requester";
import articlesAPI from "../../api/articles-api";

import LatestNews from "../latest-news/LatestNews";

export default function Test() {
    const [articleDetails, setArticleDetails] = useState([]);

    useEffect(() => {
      (async () => {
            const result = await articlesAPI.getDetails();
            setArticleDetails(result);
      })();
    }, []);

    return (
      
        <>
        <div className="container">
          <div className="jumbotron jumbotron-fluid mb-3 pl-0 pt-0 pb-0 bg-white position-relative">
            <div className="h-100 tofront">
              <div className="row justify-content-between">
                <div className="col-md-6 pt-6 pb-6 pr-6 align-self-center">
                  <h1 className="text-uppercase font-weight-bold">
                    <p className="text-danger">
                      {article.category}
                    </p>
                  </h1>
                  <h1 className="display-4 secondfont mb-3 font-weight-bold">
                    {article.title}
                  </h1>
                  <div className="d-flex align-items-center">
                    <small className="ml-2">
                      <span>
                        {article.source_name}
                      </span>
                      <span className="text-muted">
                        {article.pubDate}
                      </span>
                    </small>
                  </div>
                </div>
                <div className="col-md-6 pr-0">
                  <img src={article.image_url} className="shadow" />
                </div>
              </div>
            </div>
          </div>
        </div>
  
      <div className="container pt-4 pb-4">
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-8">
            <article className="article-post">
              <p>
               {article.content}
              </p>
            </article>
  
          
          </div>
        </div>
      </div>
     
    </>  

      <div className="container">
        
            {/* <div className="card border-0 mb-4 box-shadow h-xl-300">       */}
            <h5 className="m-0 pt-0 font-weight-bold spanborder">
                <span>Article Details</span>
            </h5>        

        {articleDetails.length > 0
          ? articleDetails.map(values => <LatestNews key={articles._id} {...values}/>)
          : <h2 className="h4 font-weight-bold">No news yet</h2>
        }
        
        </div>
    )
};