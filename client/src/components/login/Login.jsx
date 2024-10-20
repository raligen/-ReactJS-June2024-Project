import { useNavigate } from "react-router-dom";

import { useForm } from "../../hooks/useForm";
import { useLogin } from "../../hooks/useAuth";

const initialValues = {email: '', password: ''}; 

export default function Login(){
    const login = useLogin();
    const navigate = useNavigate();
    
    const loginHandler = async (values) => {
          try {
            await login(values.email, values.password)
            navigate('/');
          } catch (err) {
           console.log(err.message);
          }
        };

        const {
          values,
          changeHandler, 
          submitHandler
        } = useForm(initialValues, loginHandler);

        return (
        <div className="d-flex p-2 center">
        <div className="p-5 border bg-lightgrey">
        <div>
            <h5 className="font-weight-bold secondfont">Login</h5>
            <h6 className="mt-3">Sign in to your account to write an article!</h6>
        </div>

        <form onSubmit={submitHandler} className="mt-3"> 
       
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            required=""
            value={values.email}
            onChange={changeHandler}
          />
        </div>
       
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
            required=""
            value={values.password}
            onChange={changeHandler}
          />
        </div>
       
        <button type="submit" className="btn btn-success btn-round">
          Sign in 
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
