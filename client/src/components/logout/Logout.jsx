import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

export default function Logout(){
    const {changeAuthState} = useAuthContext();
    
    logout();

    return <Navigate to='/'/>
      
}