import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create(
  persist(
    immer((set, get) => ({
      user: null,
      token: null,

      // Set user and token
      login: (data) => {
        set((state) => {
          state.user = {
            name: data.name,
            userId: data.userId,
            email: data.email,
          };
          state.token = data.token;
        });
      },

      // Clear user and token
      logout: () => {
        set((state) => {
          state.user = null;
          state.token = null;
        });
      },

      // Helper to check if authenticated
      isAuthenticated: () => !!get().token,
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
