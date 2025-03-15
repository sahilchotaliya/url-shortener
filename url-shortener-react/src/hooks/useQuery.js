import { useQuery } from "react-query"
import api from "../api/api"


export const useFetchMyShortUrls = (token, onError) => {
    return useQuery(
        "my-shortenurls",
        async () => {
            try {
                const response = await api.get(
                    "/api/urls/myurls",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization: "Bearer " + token,
                        },
                    }
                );
                return response.data;
            } catch (error) {
                console.error("Error fetching URLs:", error);
                throw error;
            }
        },
        {
            select: (data) => {
                if (!Array.isArray(data)) return [];
                return data.sort(
                    (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
                );
            },
            onError,
            staleTime: 5000,
            enabled: !!token
        }
    );
};

export const useFetchTotalClicks = (token, onError) => {
    return useQuery(
        "url-totalclick",
        async () => {
            try {
                const response = await api.get(
                    "/api/urls/totalClicks?startDate=2024-01-01&endDate=2025-12-31",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization: "Bearer " + token,
                        },
                    }
                );
                return response.data;
            } catch (error) {
                console.error("Error fetching total clicks:", error);
                throw error;
            }
        },
        {
            select: (data) => {
                if (!data || typeof data !== 'object') return [];
                return Object.keys(data).map((key) => ({
                    clickDate: key,
                    count: data[key],
                }));
            },
            onError,
            staleTime: 5000,
            enabled: !!token
        }
    );
};