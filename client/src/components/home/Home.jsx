import { useState, useEffect } from "react";
import * as requester from "../../api/requester";
import articlesAPI from "../../api/articles-api";

import LatestNews from "../latest-news/LatestNews";

export default function Home() {
    const [latestNews, setLatestNews] = useState([]);

    useEffect(() => {
      (async () => {
            const result = await articlesAPI.getLatest();
            setLatestNews(result);
      })();
    }, []);

    return (
      
      
      <div className="container">
        
            {/* <div className="card border-0 mb-4 box-shadow h-xl-300">       */}
            <h5 className="m-0 pt-0 font-weight-bold spanborder">
                <span>Latest News</span>
            </h5>        

        {latestNews.length > 0
          ? latestNews.map(articles => <LatestNews key={articles._id} {...articles}/>)
          : <h2 className="h4 font-weight-bold">No news yet</h2>
        }
        
        
       </div>
      //  </div>

        // <div className="container pt-4 pb-4">
      
        //     <div className="col-lg-6">
        //       <div className="flex-md-row mb-4 box-shadow h-xl-300">
        //         <div className="mb-3 d-flex align-items-center">
        //           <img height={80} src="./assets/img/demo/blog4.jpg" />
        //           <div className="pl-3">
        //             <h2 className="mb-2 h6 font-weight-bold">
        //               <a className="text-dark" href="./article.html">
        //                 Nasa's IceSat space laser makes height maps of Earth
        //               </a>
        //             </h2>
        //             <div className="card-text text-muted small">
        //               Jake Bittle in LOVE/HATE
        //             </div>
        //             <small className="text-muted">Dec 12 · 5 min read</small>
        //           </div>
        //         </div>
        //         <div className="mb-3 d-flex align-items-center">
        //           <img height={80} src="./assets/img/demo/blog5.jpg" />
        //           <div className="pl-3">
        //             <h2 className="mb-2 h6 font-weight-bold">
        //               <a className="text-dark" href="./article.html">
        //                 Underwater museum brings hope to Lake Titicaca
        //               </a>
        //             </h2>
        //             <div className="card-text text-muted small">
        //               Jake Bittle in LOVE/HATE
        //             </div>
        //             <small className="text-muted">Dec 12 · 5 min read</small>
        //           </div>
        //         </div>
        //         <div className="mb-3 d-flex align-items-center">
        //           <img height={80} src="./assets/img/demo/blog6.jpg" />
        //           <div className="pl-3">
        //             <h2 className="mb-2 h6 font-weight-bold">
        //               <a className="text-dark" href="./article.html">
        //                 Sun-skimming probe starts calling home
        //               </a>
        //             </h2>
        //             <div className="card-text text-muted small">
        //               Jake Bittle in LOVE/HATE
        //             </div>
        //             <small className="text-muted">Dec 12 · 5 min read</small>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>

        // <div className="container">

        //   <div className="row justify-content-between">
        //     <div className="col-md-8">
        //       <h5 className="font-weight-bold spanborder">
        //         <span>All Stories</span>
        //       </h5>

        //       <div className="mb-3 d-flex justify-content-between">
        //         <div className="pr-3">
        //           <h2 className="mb-1 h4 font-weight-bold">
        //             <a className="text-dark" href="./article.html">
        //               Nearly 200 Great Barrier Reef coral species also live in the
        //               deep sea
        //             </a>
        //           </h2>
        //           <p>
        //             There are more coral species lurking in the deep ocean that
        //             previously thought.
        //           </p>
        //           <div className="card-text text-muted small">
        //             Jake Bittle in SCIENCE
        //           </div>
        //           <small className="text-muted">Dec 12 · 5 min read</small>
        //         </div>
        //         <img height={120} src="./assets/img/demo/blog8.jpg" />
        //       </div>

        //       <div className="mb-3 d-flex justify-content-between">
        //         <div className="pr-3">
        //           <h2 className="mb-1 h4 font-weight-bold">
        //             <a className="text-dark" href="./article.html">
        //               East Antarctica's glaciers are stirring
        //             </a>
        //           </h2>
        //           <p>
        //             Nasa says it has detected the first signs of significant melting
        //             in a swathe of glaciers in East Antarctica.
        //           </p>
        //           <div className="card-text text-muted small">
        //             Jake Bittle in SCIENCE
        //           </div>
        //           <small className="text-muted">Dec 12 · 5 min read</small>
        //         </div>
        //         <img height={120} src="./assets/img/demo/1.jpg" />
        //       </div>

        //       <div className="mb-3 d-flex justify-content-between">
        //         <div className="pr-3">
        //           <h2 className="mb-1 h4 font-weight-bold">
        //             <a className="text-dark" href="./article.html">
        //               50 years ago, armadillos hinted that DNA wasn’t destiny
        //             </a>
        //           </h2>
        //           <p>
        //             Nasa says it has detected the first signs of significant melting
        //             in a swathe of glaciers in East Antarctica.
        //           </p>
        //           <div className="card-text text-muted small">
        //             Jake Bittle in SCIENCE
        //           </div>
        //           <small className="text-muted">Dec 12 · 5 min read</small>
        //         </div>
        //         <img height={120} src="./assets/img/demo/5.jpg" />
        //       </div>
        //     </div>

        //     <div className="col-md-4 pl-4">
        //       <h5 className="font-weight-bold spanborder">
        //         <span>Popular</span>
        //       </h5>

        //       <ol className="list-featured">
        //         <li>
        //           <span>
        //             <h6 className="font-weight-bold">
        //               <a href="./article.html" className="text-dark">
        //                 Did Supernovae Kill Off Large Ocean Animals?
        //               </a>
        //             </h6>
        //             <p className="text-muted">Jake Bittle in SCIENCE</p>
        //           </span>
        //         </li>
                
        //         <li>
        //           <span>
        //             <h6 className="font-weight-bold">
        //               <a href="./article.html" className="text-dark">
        //                 Humans Reversing Climate Clock: 50 Million Years
        //               </a>
        //             </h6>
        //             <p className="text-muted">Jake Bittle in SCIENCE</p>
        //           </span>
        //         </li>

        //         <li>
        //           <span>
        //             <h6 className="font-weight-bold">
        //               <a href="./article.html" className="text-dark">
        //                 Unprecedented Views of the Birth of Planets
        //               </a>
        //             </h6>
        //             <p className="text-muted">Jake Bittle in SCIENCE</p>
        //           </span>
        //         </li>

        //         <li>
        //           <span>
        //             <h6 className="font-weight-bold">
        //               <a href="./article.html" className="text-dark">
        //                 Effective New Target for Mood-Boosting Brain Stimulation Found
        //               </a>
        //             </h6>
        //             <p className="text-muted">Jake Bittle in SCIENCE</p>
        //           </span>
        //         </li>
        //       </ol>

        //     </div>
        //   </div>
        // </div>
        // </div>
        // </div>  
  );
}