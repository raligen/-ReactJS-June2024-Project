export default function ArticleHeader(){
    return (
        <div className="container">
        <div className="jumbotron jumbotron-fluid mb-3 pl-0 pt-0 pb-0 bg-white position-relative">
          <div className="h-100 tofront">
            <div className="row justify-content-between">
              <div className="col-md-6 pt-6 pb-6 pr-6 align-self-center">
                <p className="text-uppercase font-weight-bold">
                  <a className="text-danger" href="#">
                    CategoryLink
                  </a>
                </p>
                <h1 className="display-4 secondfont mb-3 font-weight-bold">
                  Mundana - Bootstrap 4 HTML Template for Professional Blogging
                </h1>
                <p className="mb-3">
                  Here we're introducing you what you can do with Mundana theme.
                </p>
                <div className="d-flex align-items-center">
                  <a target="_blank" href=" ">
                    <img
                      className="rounded-circle"
                      src="assets/img/demo/sal.jpg"
                      width={70}
                    />
                  </a>
                  <small className="ml-2">
                    <a target="_blank" href=" ">
                      Sal
                    </a>{" "}
                    <span className="text-muted d-block">
                      A few hours ago · 5 min. read
                    </span>
                  </small>
                </div>
              </div>
              <div className="col-md-6 pr-0">
                <img src="./assets/img/screenshot-mundana.png" className="shadow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}