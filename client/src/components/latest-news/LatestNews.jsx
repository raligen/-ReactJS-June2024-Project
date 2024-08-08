import { Link } from "react-router-dom";

export default function LatestNews({
  _id, 
  title, 
  description, 
  creator, 
  image_url, 
  pubDate
})
  
  {
    return (

      <div className="container">
      <div className="jumbotron jumbotron-fluid mb-3 pt-0 pb-0 bg-lightblue position-relative">
        <div className="pl-4 pr-0 h-100 tofront">
          <div className="row justify-content-between">
            <div className="col-md-6 pt-6 pb-6 align-self-center">
              <h1 className="secondfont mb-3 font-weight-bold">{title}</h1>
              <p className="mb-3">
                {description}
              </p>
              <div>
                  <small className="d-block">
                     <p className="text-muted">
                       {creator}
                      </p>
                  </small>
                  <small className="text-muted">{pubDate}</small>
               </div>  
              <Link to={`/articles/${_id}/details`} className="btn btn-dark">
                  Read More
              </Link>
            </div>
            <div className="col-md-6 d-none d-md-block pr-0" 
            style={{
                  backgroundSize: "cover",
                  backgroundImage: `${image_url}`
                }} 
                >
                {" "}
              </div>    
            </div>
            </div>
        </div>
      </div>

  )
}



        {/* <div NameName="container pt-4 pb-4 align-self-center">          
        
            <div>
            <div className="jumbotron jumbotron-fluid mb-3 pt-0 pb-0 bg-lightblue position-relative">
              <div className="pl-4 pr-0 h-100 tofront">
                <div className="row justify-content-between">            
            
              <div className="col-md-6 pt-6 pb-6 align-self-center">
                <h1 className="secondfont mb-3 font-weight-bold">
                  {title}
                </h1>
                <p className="mb-3">
                  {description}
                </p>
                <div>
                    <small className="d-block">
                      <a className="text-muted" href="./author.html">
                        {creator}
                      </a>
                    </small>
                    <small className="text-muted">{pubDate}</small>
                  </div>
                <Link to={`/articles/${_id}/details`} className="btn btn-dark">
                  Read More
                </Link>
              </div>
              <div
                className="col-md-6 d-none d-md-block pr-0"
                style={{
                  backgroundSize: "cover",
                  backgroundImage: `${image_url}`
                }}
              >
                {" "}
              </div>
            </div>
          </div>
        </div>
      </div>    
      </div> */}
 