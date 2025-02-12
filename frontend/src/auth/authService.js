import axios from "axios";
import { useNavigate } from "react-router-dom";

const instance = axios.create({
    baseURL: "http://localhost:3000/api/",
    headers: {
        "Content-Type": "application/json"
    }
});

/*
submits user and password path to backend
and redirects user to home page if credentials are correct
*/
const login = async (username, password, serverPaths) => {
    const response = await instance.post(serverPaths.LOGIN_PATH, {username, password});
    switch (response.status)
    {
        // login successful
        case 200:
        //
        case 400:
    }
    if (response.status === 200)
    {
        navigate('home/:userId');
    }
    else 
    {
        console.log('')
    }
};
/*
submits user and password to the register path on backend
and redirects user to home page if credentials are correct
*/
const register = async (username, password, serverPaths) => {
    const response = await instance.post(serverPaths.REGISTER_PATH, {username, password});
    if (response.status === 200)
    {
        navigate('/home/:userId');
    }
};

const handleLogin = (clientPaths) => {
    
}


