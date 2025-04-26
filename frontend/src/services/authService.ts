export const authService = {
  async login(email: string, password: string) {
    // Mock login - em um sistema real, isso seria uma chamada à API
    if (email === 'admin@hublocal.com' && password === 'admin123') {
      return {
        token: 'mock-token',
        user: {
          id: 1,
          name: 'Admin',
          email: 'admin@hublocal.com'
        }
      };
    }
    throw new Error('Credenciais inválidas');
  },

  logout() {
    // Limpar dados de autenticação
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}; 