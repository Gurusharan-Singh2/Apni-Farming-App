// src/Store/wishlistStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useWishlistStore = create(
  persist(
    immer((set) => ({
      wishlist: [],

      setWishlist: (ids) => {
        set((state) => {
          state.wishlist = ids;
        });
      },

      addToWishlist: (id) => {
        set((state) => {
          if (!state.wishlist.includes(id)) {
            state.wishlist.push(id);
          }
        });
      },

      removeFromWishlist: (id) => {
        set((state) => {
          state.wishlist = state.wishlist.filter((i) => i !== id);
        });
      },

      clearWishlist: () => {
        set((state) => {
          state.wishlist = [];
        });
      },
    })),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useWishlistStore;
