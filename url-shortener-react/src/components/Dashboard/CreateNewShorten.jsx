import React, { useState } from 'react'
import { useStoreContext } from '../../contextApi/ContextApi';
import { useForm } from 'react-hook-form';
import TextField from '../TextField';
import { Tooltip } from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { useTheme } from '../../contextApi/ThemeContext';

const CreateNewShorten = ({ setOpen, refetch }) => {
    const { token } = useStoreContext();
    const [loading, setLoading] = useState(false);
    const { isDarkMode } = useTheme();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            originalUrl: "",
            name: "",
        },
        mode: "onTouched",
    });

    const createShortUrlHandler = async (data) => {
        setLoading(true);
        try {
            const response = await api.post("/api/urls/shorten", data, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            });

            const shortenUrl = `${import.meta.env.VITE_REACT_FRONT_END_URL}/s/${response.data.shortUrl}`;
            
            // Copy to clipboard
            await navigator.clipboard.writeText(shortenUrl);
            
            // Show success message
            toast.success("Short URL created and copied to clipboard!", {
                position: "bottom-center",
                className: "mb-5",
                duration: 3000,
            });

            // Refresh the URL list
            await refetch();
            
            // Reset form and close popup
            reset();
            setOpen(false);
        } catch (error) {
            console.error("Error creating short URL:", error);
            toast.error(error.response?.data?.message || "Failed to create short URL", {
                position: "bottom-center",
                className: "mb-5",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-darkText' : 'text-lightText'}`}>Create New Short URL</h2>
                <Tooltip title="Close">
                    <button
                        onClick={() => setOpen(false)}
                        className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                    >
                        <RxCross2 className={`${isDarkMode ? 'text-darkText' : 'text-lightText'}`} />
                    </button>
                </Tooltip>
            </div>
            <form onSubmit={handleSubmit(createShortUrlHandler)}>
                <div className="mb-4">
                    <TextField
                        label="Original URL"
                        name="originalUrl"
                        register={register}
                        errors={errors}
                        required={true}
                        type="url"
                        message="Original URL is required"
                        placeholder="https://example.com"
                        isDarkMode={isDarkMode}
                    />
                </div>
                
                <div className="mb-4">
                    <TextField
                        label="Name (Optional)"
                        name="name"
                        register={register}
                        errors={errors}
                        required={false}
                        type="text"
                        placeholder="My Website"
                        isDarkMode={isDarkMode}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 rounded-md ${
                            isDarkMode
                                ? 'bg-darkHighlight hover:bg-blue-700 text-white'
                                : 'bg-lightHighlight hover:bg-blue-600 text-white'
                        } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "Creating..." : "Create Short URL"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateNewShorten;