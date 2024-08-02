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
          <div className="navbar-collapse collapse" id="navbarColor02">
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
                    <li><Link className="dropdown-item" to="/politics">Politics</Link></li>
                    <li><Link className="dropdown-item" to="/business">Business</Link></li>
                    <li><Link className="dropdown-item" to="/technology">Technology</Link></li>
                </ul>
              </li>
                      
              <li className="nav-item">
                <Link className="nav-link" to="./politics">
                  Politics
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="./business">
                  Business
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="./technology">
                  Technology
                </Link>
              </li>
            </ul>

           
              <ul id="guest" className="navbar-nav ml-auto d-flex align-items-center">
              <li className="nav-item highlight pl-1">
                <button
                  className="nav-link"
                  to="/register"
                >
                  Register
                </button>
              </li>
              <li className="nav-item highlight pl-1">
                <button
                  className="nav-link" style={{textDecoration: "underline"}}
                  to="/login"
                >
                  Login
                </button>
              </li>
            </ul>
            

            
              <ul id="user" className="navbar-nav ml-auto d-flex align-items-center">
              <li className="nav-item highlight pl-1">
                <button className="btn btn-warning" 
                  to="/create-news" 
                >
                  Create News
                </button>
              </li>
            
              <li className="nav-item highlight pl-1">
                <button
                  className="nav-link" style={{textDecoration: "underline"}}
                  to="/logout"
                >
                  Logout
                </button>
              </li>
            </ul>
            

          </div>
        </div>
      </nav>
    );
}