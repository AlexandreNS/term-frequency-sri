import axios from "axios";
import config from "./../config";

const api = axios.create({
  baseURL: config.base_url
});

export default api