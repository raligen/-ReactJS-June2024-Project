
import {login} from "../api/auth-api";


export const useLogin = () => {
    const {changeAuthState} = useContext(AuthContext);
    
    const loginHandler = async (email, password) => {
        const {password:_, ...authData } = await login(email, password);
       
        changeAuthState(authData);
                
        return authData;
    }

    return loginHandler;
};

export const useRegister = () => {
    const { changeAuthState } = useContext(AuthContext);

    console registerHandler = async (email, password) => {
        const {password: _, ...authData} = await register(email, password);
       
        changeAuthState(authData);
                
        return authData;
    };

    return registerHandler;
};