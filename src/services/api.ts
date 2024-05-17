import axios from "axios";

const api = axios.create({
  baseURL: "https://api-my-account.onrender.com",
});

export default api;
