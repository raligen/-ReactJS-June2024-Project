import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";


export default function Logout(){
    const { logout } = useAuthContext()
    
    logout();

    //TODO server logout

    return <Navigate to='/'/>
      
}