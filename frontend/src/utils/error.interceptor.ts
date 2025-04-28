import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { logger } from './logger';

export class ErrorInterceptor {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        logger.error('Request error:', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          
          const { status, data } = error.response;
          
          switch (status) {
            case 401:
              // Unauthorized - redirect to login
              localStorage.removeItem('token');
              window.location.href = '/login';
              break;
            case 403:
              // Forbidden - show access denied message
              logger.error('Access denied:', data);
              break;
            case 404:
              // Not found - show not found message
              logger.error('Resource not found:', data);
              break;
            case 500:
              // Server error - show server error message
              logger.error('Server error:', data);
              break;
            default:
              logger.error('API error:', data);
          }
        } else if (error.request) {
          // The request was made but no response was received
          logger.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          logger.error('Request setup error:', error.message);
        }

        return Promise.reject(error);
      },
    );
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
} 