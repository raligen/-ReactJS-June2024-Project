export default function Register(){
    return (
        <div className="d-flex p-2 center">
        <div className="p-5 border bg-lightgrey">
        <div>
            <h5 className="font-weight-bold secondfont">Register</h5>
            <h6 className="mt-3">Create an account to start writing articles!</h6>
        </div>

        <form className="mt-3"> 
       
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            required=""
          />
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
       
        <button type="submit" className="btn btn-success btn-round">
          Sign up
        </button>
      
      </form>
      </div>
      </div>
    );
}

{/* <div className="border p-5 bg-lightgrey"> */}


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
