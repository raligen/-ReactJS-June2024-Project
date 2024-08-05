
import {login} from "../api/auth-api";


export const useLogin = () => {
    const {changeAuthState} = useContext(AuthContext);
    
    const loginHandler = async (email, password) => {
        const result = await login(email, password);
       
        changeAuthState(result);
                
        
    }

    return loginHandler;
};