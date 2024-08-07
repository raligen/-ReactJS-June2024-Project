import { useNavigate } from "react-router-dom";

import { useForm } from "../../hooks/useForm";
import { useRegister } from "../../hooks/useAuth";

const initialValues = {email: '', password: '', confirmpass:'' }; 

export default function Register(){
  const [error, setError] = useState('');
  const register = useRegister();
  const navigate = useNavigate();
  
  const registerHandler = async ({email, password, confirmpass}) => {
        if (password !== confirmpass) {
            return setError('Passwords do not match.');
        }
        try {
            await register(email, password)
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
      };

      const {
        values, 
        changeHandler, 
        submitHandler
      } = useForm(initialValues, registerHandler);  


    return (
        <div className="d-flex p-2 center">
        <div className="p-5 border bg-lightgrey">
        <div>
            <h5 className="font-weight-bold secondfont">Register</h5>
            <h6 className="mt-3">Create an account to start writing articles!</h6>
        </div>

        <form onSubmit={submitHandler} className="mt-3"> 
       
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            required=""
            name="email"
            value={values.email}
            onChange={changeHandler}
          />
        </div>
       
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            required=""
            name="password"
            value={values.password}
            onChange={changeHandler}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            className="form-control"
            id="confirmpass"
            placeholder="Confirm Password"
            required=""
            name="confirmpass"
            value={values.confirmpass}
            onChange={changeHandler}
          />
        </div>
       
        <button type="submit" className="btn btn-success btn-round">
          Sign up
        </button>

        {error && ( 
              <p>
                <span>{error}</span>
              </p>
        )}
      
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
