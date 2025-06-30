import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCartStore = create(
  persist(
    immer((set, get) => ({
      cart: [],

      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cart.find(i => i.id === item.id);

          if (existingItem) {
            existingItem.selectedSize = item.selectedSize;
            existingItem.price = item.selectedSize.sellPrice;
          } else {
            state.cart.push({
              ...item,
              quantity: 1,
              price: item.selectedSize.sellPrice,
            });
          }
        });
      },

      removeFromCart: (id, size) => {
        set((state) => {
          state.cart = state.cart.filter(
            item => !(item.id === id && item.selectedSize?.size === size)
          );
        });
      },

      increment: (id) => {
        set((state) => {
          const item = state.cart.find(i => i.id === id);
          if (item) {
            item.quantity += 1;
          }
        });
      },

      decrement: (id) => {
        set((state) => {
          const index = state.cart.findIndex(i => i.id === id);
          if (index !== -1) {
            if (state.cart[index].quantity > 1) {
              state.cart[index].quantity -= 1;
            } else {
              state.cart.splice(index, 1);
            }
          }
        });
      },

      clearCart: () => {
        set((state) => {
          state.cart = [];
        });
      },
    })),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCartStore;
