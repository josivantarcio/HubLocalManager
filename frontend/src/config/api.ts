import { ErrorInterceptor } from '../utils/error.interceptor';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const errorInterceptor = new ErrorInterceptor(API_URL);
export const api = errorInterceptor.getInstance(); 