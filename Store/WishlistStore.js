import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useWishlistStore = create(
  persist(
    immer((set) => ({
      wishlist: [],

      // Set full wishlist (array of product objects)
     setWishlist: (items) => {
  set((state) => {
    state.wishlist = [...items]; // ✅ ensures a new array
  });
},


      // Add product object to wishlist
      addToWishlist: (product) => {
        set((state) => {
          const exists = state.wishlist.some((item) => item.id === product.id);
          if (!exists) {
            state.wishlist.push(product);
          }
        });
      },

      // Remove product object from wishlist by id
      removeFromWishlist: (id) => {
        set((state) => {
          state.wishlist = state.wishlist.filter((item) => item.id !== id);
        });
      },

      // Clear all wishlist items
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
