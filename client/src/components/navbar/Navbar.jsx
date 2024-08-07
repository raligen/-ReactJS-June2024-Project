import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

export default function Navbar(){
    const {isAuthenticated, email} = useAuthContext();

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

              <li className="nav-item">
                <Link className="nav-link" to="/articles">
                  All articles
                </Link>
              </li>
              
              {/* <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" aria-expanded="false">
                    Categories
                </a>
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
              </li> */}
            </ul>

              {isAuthenticated
                  ? (
                      <ul id="user" className="navbar-nav ml-auto d-flex align-items-center">
                        <li className="nav-item highlight pl-1">
                          <Link className="btn" style={{backgroundColor: "#ff8533", color: "#fff", border: "1px solid #ff8533"}}
                            to="/articles/create" 
                          >
                            Create News
                          </Link>
                        </li>
                        
                        <li className="nav-item highlight pl-1">
                          <p>{email}</p>
                        </li>
                            
                        <li className="nav-item highlight pl-1">
                          <Link
                            className="nav-link" style={{textDecoration: "underline"}}
                            to="/logout"
                          >
                            Logout
                          </Link>
                        </li>
                      </ul>
                  )
                  : (
                      <ul id="guest" className="navbar-nav ml-auto d-flex align-items-center">
                        <li className="nav-item highlight pl-1">
                          <Link
                            className="nav-link"
                            to="/register"
                          >
                            Register
                          </Link>
                        </li>
                        <li className="nav-item highlight pl-1">
                          <Link
                            className="nav-link" style={{textDecoration: "underline"}}
                            to="/login"
                          >
                            Login
                          </Link>
                        </li>
                      </ul>
                  )               
              }
              
            

          </div>
        </div>
      </nav>
    );
}

