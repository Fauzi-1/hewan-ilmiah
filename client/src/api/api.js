// client/src/api/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: "https://ant-meet-highly.ngrok-free.app/api",
  withCredentials: true,
});


export default instance;
