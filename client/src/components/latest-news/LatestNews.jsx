import { Link } from "react-router-dom";

export default function LatestNews({
  _id, 
  title, 
  description, 
  category,
  creator, 
  image_url, 
  pubDate
})
  
  {
    return ( 
    <div className="col-lg-6 mt-3">
    <div className="card border-0 mb-4 box-shadow h-xl-500">
          <div className="row  justify-content-between">
          <div className="card-body px-0 pb-0 d-flex flex-column align-items-start ">
              <h2 className="h4 mb-3 font-weight-bold">{title}</h2>
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
              <Link to={`/articles/${_id}`} className="btn btn-dark">
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


  )
}

