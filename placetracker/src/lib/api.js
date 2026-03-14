import axios from 'axios'

const api = axios.create({
    baseURL: `${process.env.VITE_API_URL || "http://localhost:5000"}/api`,
});

api.interceptors.request.use(async(config) => {
    try{
        const token = await window.Clerk?.session?.getToken();
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
    }  
    }catch{
        console.error("Error fetching token");
    }
    return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      console.warn("Session expired — please sign in again");
    }
    return Promise.reject(err);
  }
);

export default api;