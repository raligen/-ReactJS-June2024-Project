import * as requester from "./requester";

const BASE_URL = 'http://localhost:3030/data/articles';

export const login = async (email, password) => {
    const authData = await requester.post(`${BASE_URL}/login`, {email, password});
    return authData;
};

export const register = (email, password) => requester.post(`${BASE_URL}/register`, {email, password});

export const logout = () => requester.get(`${BASE_URL}/logout`);