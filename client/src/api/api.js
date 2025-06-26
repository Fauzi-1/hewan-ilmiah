// client/src/api/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Ganti kalau ke server production
});

export default instance;
