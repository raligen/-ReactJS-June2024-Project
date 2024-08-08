import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

export default function AuthorizedView({children}){
    const {isAuthenticated} = useAuthContext();

    if(!isAuthenticated) {

        return  <Navigate to="/login" />

    } else {

        return (
            <>
             {children}
            </>
        );
    } 
}