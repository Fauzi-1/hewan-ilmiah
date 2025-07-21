// client/src/api/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: "https://api.hewan-edu.my.id/",
  withCredentials: true,
});


export default instance;
