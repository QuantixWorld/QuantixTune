import { defineStore } from 'pinia'
import axiosInstance from '@/services/axiosInstance'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
    }),
    actions: {
        async checkAuthStatus() {
            try {
                const response = await axiosInstance.get('http://localhost:3000/auth-status', { withCredentials: true });
                this.isLoggedIn = response.data.loggedIn;
            } catch {
                this.isLoggedIn = false
            }
        },
        async logout() {
            try {
                await axiosInstance.delete('http://localhost:3000/logout', {
                    withCredentials: true
                });
                this.isLoggedIn = false;
            } catch (error) {
                console.error('Logout failed:', error);
            }
        },
    },
});
