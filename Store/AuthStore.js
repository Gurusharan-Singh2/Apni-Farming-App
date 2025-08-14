import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create(
  persist(
    immer((set, get) => ({
      user: null,
      token: null,
      phone: null,

      // Set user and token
      login: (data) => {
        set((state) => {
          state.user = {
            name: data.name,
            userId: data.userId,
            email: data.email,
            phone: data.phone,
          };
          state.token = data.token;
        });
      },

      // Clear user and token
      logout: () => {
        set((state) => {
          state.user = null;
          state.token = null;
          state.phone = null;
        });
      },
isLoggedIn: () => {
  const { token } = get();
  return !!token;
},
      // Auth check that waits for hydration
      isAuthenticated: async () => {
        // Wait until storage is hydrated
        if (!useAuthStore.persist.hasHydrated()) {
          await new Promise((resolve) => {
            const unsub = useAuthStore.persist.onFinishHydration(() => {
              unsub();
              resolve();
            });
          });
        }
        return !!get().token;
      },
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
