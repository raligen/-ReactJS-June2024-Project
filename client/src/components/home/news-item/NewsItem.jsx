export default function NewsItem(
    _id, title, category, source, imgUrl, publishedAt, author
){
    
    return (
        <div>
        <div className="container">
        <div className="jumbotron jumbotron-fluid mb-3 pl-0 pt-0 pb-0 bg-white position-relative">
          <div className="h-100 tofront">
            <div className="row justify-content-between">
              <div className="col-md-6 pt-6 pb-6 pr-6 align-self-center">
                <p className="text-uppercase font-weight-bold">
                  <a className="text-danger" href="./category.html">
                    {category}
                  </a>
                </p>
                <h1 className="display-4 secondfont mb-3 font-weight-bold">
                  {title}
                </h1>
                <p className="mb-3">
                  {subtitle}
                </p>
                <div className="d-flex align-items-center">
                  <img
                    className="rounded-circle"
                    src={avatarlogo}
                    width={70}
                  />
                  <small className="ml-2">
                    {author}{" "}
                    <span className="text-muted d-block">
                      {publishedAt} · 5 min. read
                    </span>
                  </small>
                </div>
              </div>
              <div className="col-md-6 pr-0">
                <img src={imgUrl} />
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="container pt-4 pb-4">
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-8">
            <article className="article-post article-text">
              <p>
                {content}
              </p>
            </article>
  
      
          </div>
        </div>
      </div>
      
      <ReadNext />
      </div>
    );
}