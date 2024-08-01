export default function Navbar(){
    return (
        <nav className="topnav navbar navbar-expand-lg navbar-light bg-white fixed-top">
        <div className="container">
          <a className="navbar-brand" href="./index.html">
            <strong>News Create Website</strong>
          </a>
          <button
            className="navbar-toggler collapsed"
            type="button"
            data-toggle="collapse"
            data-target="#navbarColor02"
            aria-controls="navbarColor02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="navbar-collapse collapse" id="navbarColor02" style={{}}>
            <ul className="navbar-nav mr-auto d-flex align-items-center">
              <li className="nav-item">
                <a className="nav-link" href="./index.html">
                  Home <span className="sr-only">(current)</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="./article.html">
                  Politics
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="./article.html">
                  Business
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="./article.html">
                  Tech
                </a>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto d-flex align-items-center">
              <li className="nav-item highlight">
                <button
                  className="nav-link"
                  href="https://www.wowthemes.net/mundana-free-html-bootstrap-template/"
                >
                  Create an Article
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
}