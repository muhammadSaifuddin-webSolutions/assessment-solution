import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:4500/api/v1/tasks',
  headers: {
    'Content-Type': 'application/json',
  },
});