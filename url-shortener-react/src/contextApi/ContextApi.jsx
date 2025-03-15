import { createContext, useContext, useState, useEffect } from "react";

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
    const getToken = localStorage.getItem("JWT_TOKEN")
        ? JSON.parse(localStorage.getItem("JWT_TOKEN"))
        : null;
        
    const getUserInfo = localStorage.getItem("USER_INFO")
        ? JSON.parse(localStorage.getItem("USER_INFO"))
        : null;

    const [token, setToken] = useState(getToken);
    const [user, setUser] = useState(getUserInfo);
    
    useEffect(() => {
        if (token) {
            localStorage.setItem("JWT_TOKEN", JSON.stringify(token));
        } else {
            localStorage.removeItem("JWT_TOKEN");
        }
    }, [token]);
    
    useEffect(() => {
        if (user) {
            localStorage.setItem("USER_INFO", JSON.stringify(user));
        } else {
            localStorage.removeItem("USER_INFO");
        }
    }, [user]);
    
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("JWT_TOKEN");
        localStorage.removeItem("USER_INFO");
    };

    const sendData = {
        token,
        setToken,
        user,
        setUser,
        logout
    };

    return <ContextApi.Provider value={sendData}>{children}</ContextApi.Provider>
};


export const useStoreContext = () => {
    const context = useContext(ContextApi);
    return context;
}