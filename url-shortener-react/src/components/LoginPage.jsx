import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import TextField from './TextField';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useStoreContext } from '../contextApi/ContextApi';
import GoogleAuthButton from './GoogleAuthButton';
import { useTheme } from '../contextApi/ThemeContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const { setToken } = useStoreContext();
    const { isDarkMode } = useTheme();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    const loginHandler = async (data) => {
        setLoader(true);
        try {
            const { data: response } = await api.post(
                "/api/auth/public/login",
                data
            );
            console.log(response.token);
            setToken(response.token);
            localStorage.setItem("JWT_TOKEN", JSON.stringify(response.token));
            toast.success("Login Successful!");
            reset();
            navigate("/dashboard");
        } catch (error) {
            console.log(error);
            toast.error("Login Failed!")
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className={`min-h-[calc(100vh-64px)] flex justify-center items-center ${isDarkMode ? 'bg-darkBg' : 'bg-lightBg'}`}>
            <form onSubmit={handleSubmit(loginHandler)}
                className={`sm:w-[450px] w-[360px] shadow-custom py-8 sm:px-8 px-4 rounded-md ${isDarkMode ? 'bg-darkCard border border-darkBorder' : 'bg-white'}`}>
                <h1 className={`text-center font-serif ${isDarkMode ? 'text-darkHighlight' : 'text-btnColor'} font-bold lg:text-3xl text-2xl`}>
                    Login Here
                </h1>

                <hr className={`mt-2 mb-5 ${isDarkMode ? 'border-darkBorder' : 'text-black'}`}/>

                <div className="flex flex-col gap-3">
                    <TextField
                        label="UserName"
                        required
                        id="username"
                        type="text"
                        message="*Username is required"
                        placeholder="Type your username"
                        register={register}
                        errors={errors}
                        isDarkMode={isDarkMode}
                    />

                    <TextField
                        label="Password"
                        required
                        id="password"
                        type="password"
                        message="*Password is required"
                        placeholder="Type your password"
                        register={register}
                        min={6}
                        errors={errors}
                        isDarkMode={isDarkMode}
                    />
                </div>

                <button
                    disabled={loader}
                    type='submit'
                    className={`font-semibold text-white w-full py-2 rounded-md my-3 ${
                        isDarkMode 
                            ? 'bg-darkHighlight hover:bg-blue-700' 
                            : 'bg-custom-gradient hover:opacity-90'
                    } ${loader ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {loader ? "Loading..." : "Login"}
                </button>

                {/* Google Authentication */}
                <div className="mt-4">
                    <div className="flex items-center my-4">
                        <div className={`flex-1 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                        <p className={`mx-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>OR</p>
                        <div className={`flex-1 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                    </div>
                    
                    <GoogleAuthButton />
                </div>

                <p className={`text-center text-sm ${isDarkMode ? 'text-darkTextSecondary' : 'text-slate-700'} mt-6`}>
                    Don't have an account? 
                    <Link
                        className={`font-semibold underline hover:text-black ${isDarkMode ? 'text-darkHighlight' : ''}`}
                        to="/register">
                            <span className={isDarkMode ? 'text-darkHighlight' : 'text-btnColor'}> SignUp</span>
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default LoginPage