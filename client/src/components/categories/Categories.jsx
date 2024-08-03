import { Link } from "react-router-dom";
export default function Categories() {
    return (
        <div className="d-flex p-2 center">
        <div className="row row-cols-1 row-cols-md-3 g-4">
        
        
        <div className="col c-item">
          <Link to="/politics">
          <div className="card h-100">
            <img className="card-img-top c-img" src="https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Politics"/>
            <div className="card-body">
              <h5 className="card-title">Politics</h5>
              <p className="card-text">Learn more about latest political developments.</p>
            </div>
          </div>
        </Link>
        </div>
        
  
        
        <div className="col c-item">
          <Link to="/business">
          <div className="card h-100">
            <img className="card-img-top c-img" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Business"/>
            <div className="card-body">
              <h5 className="card-title">Business</h5>
              <p className="card-text">Click here for latest news and analyses on investment and entrepreneurship.</p>
            </div>
          </div>
          </Link>
        </div>
        
  
        
        <div className="col c-item">
          <Link to="/technology">
          <div className="card h-100">
            <img className="card-img-top c-img" src="https://images.unsplash.com/photo-1611264327630-8090373c8cef?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Technology"/>
            <div className="card-body">
              <h5 className="card-title">Technology</h5>
              <p className="card-text">Explore the latest news in technology.</p>
            </div>
          </div>
          </Link>
        </div>
       

      </div>
      </div>
    );
}


