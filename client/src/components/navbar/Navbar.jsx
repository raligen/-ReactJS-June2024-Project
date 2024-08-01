import { Link } from "react-router-dom";

export default function Navbar(){
    return (
        <nav className="topnav navbar navbar-expand-lg navbar-light bg-white fixed-top">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <strong>NewsCreate</strong>
          </Link>
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
                <Link className="nav-link" to="/">
                  Home <span className="sr-only">(current)</span>
                </Link>
              </li>
              
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="/categories" id="navbarDropdown" role="button" aria-expanded="false">
                    Categories
                </Link>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" to="#">Politics</a></li>
                    <li><a className="dropdown-item" to="#">Business</a></li>
                    <li><a className="dropdown-item" to="#">Technology</a></li>
                </ul>
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
                  href=" "
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