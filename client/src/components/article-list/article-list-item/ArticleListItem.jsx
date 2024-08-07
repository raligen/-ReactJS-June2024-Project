import { Link } from "react-router-dom";

export default function ArticleListItem({
  _id,
  title, 
  category, 
  creator, 
  description, 
  image_url,
}) {
    return (
      <div className="col-lg-6">
        <div className="card border-0 mb-4 box-shadow h-xl-300">
          <div
            style={{
              backgroundImage: `${image_url}`,
              height: 150,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat"
            }}
          />
          <div className="card-body px-0 pb-0 d-flex flex-column align-items-start">
            <h2 className="h4 font-weight-bold">
              <Link className="text-dark" to={`/articles/${_id}/details`}>
                {title}
              </Link>
            </h2>
            <p className="card-text">
              {description}
            </p>
            <div>
              <small className="d-block">
                <a className="text-muted" href="./author.html">
                  {creator}
                </a>
              </small>
              <small className="text-muted">{category}</small>
              <small className="text-muted">{pubDate}</small>
            </div>
          </div>
        </div>
      </div>
    
    );
}