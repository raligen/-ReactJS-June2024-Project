export default function Register(){
    return (
        <div className="border p-5 bg-lightgrey">
        <div className="row justify-content-between">
          <div className="col-md-5 mb-2 mb-md-0">
            <h5 className="font-weight-bold secondfont">Register</h5>
            Fill the form to start writing articles!
          </div>
        
        <form>
            <div className="form-group">
                <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    required=""
                />
            <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
            </small>
            </div>
            <div className="form-group">
                <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Password"
                    required=""
                />
            </div>
            <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">
                        Check me out
                    </label>
            </div>
            <button type="submit" className="btn btn-success btn-round">
                        Register
            </button>
        </form>

        </div>
    </div>
    );
}


  {/* <div className="col-md-7">
    <div className="row">
      <div className="col-md-12">
        <input
          type="text"
          className="form-control"
          placeholder="Enter your e-mail address"
        />
      </div>
      <div className="col-md-12 mt-2">
        <button type="submit" className="btn btn-success btn-block">
          Subscribe
        </button>
      </div>
    </div>
  </div> */}
