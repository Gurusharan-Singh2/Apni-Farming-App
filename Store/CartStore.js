import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCartStore = create(
  persist(
    immer((set, get) => ({
      cart: [],
      totalAmount: 0,
      discount: 0,
      finalAmount: 0,
      totalItems: 0, // ✅ NEW STATE

      calculateTotals: () => {
        const { cart } = get();
        const total = cart.reduce((sum, item) => sum + (item.costPrice || 0) * item.quantity, 0);
        const discount = cart.reduce((sum, item) => sum + (item.discount || 0) * item.quantity, 0);
        const final = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // ✅ Total items count

        set((state) => {
          state.totalAmount = total;
          state.discount = discount;
          state.finalAmount = final;
          state.totalItems = totalItems;
        });
      },

      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cart.find(
            i => i.id === item.id && i.selectedSize?.size === item.selectedSize?.size
          );

          const costPrice = item.selectedSize?.costPrice || 0;
          const sellPrice = item.selectedSize?.sellPrice || 0;
          const discount = costPrice - sellPrice;

          if (existingItem) {
            existingItem.selectedSize = item.selectedSize;
            existingItem.price = sellPrice;
            existingItem.costPrice = costPrice;
            existingItem.discount = discount;
          } else {
            state.cart.push({
              ...item,
              quantity: 1,
              price: sellPrice,
              costPrice,
              discount,
            });
          }
        });
        get().calculateTotals();
      },

      removeFromCart: (id, size) => {
        set((state) => {
          state.cart = state.cart.filter(
            item => !(item.id === id && item.selectedSize?.size === size)
          );
        });
        get().calculateTotals();
      },

      increment: (id) => {
        set((state) => {
          const item = state.cart.find(i => i.id === id);
          if (item) {
            item.quantity += 1;
          }
        });
        get().calculateTotals();
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
        get().calculateTotals();
      },

      clearCart: () => {
        set((state) => {
          state.cart = [];
        });
        get().calculateTotals();
      },
    })),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCartStore;
