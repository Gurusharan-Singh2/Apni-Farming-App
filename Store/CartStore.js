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
      totalItems: 0,

      // ✅ Coupon States
      couponCode: null,
      couponDiscount: 0,
      couponMessage: null,

      // ✅ Delivery & GST (from separate API)
      deliveryCharge: 0,
      gstAmount: 0,

      // ✅ Recalculate Totals
      calculateTotals: () => {
        const {
          cart,
          couponDiscount,
          deliveryCharge,
          gstAmount
        } = get();

        const total = cart.reduce((sum, item) => sum + (item.costPrice || 0) * item.quantity, 0);
        const discount = cart.reduce((sum, item) => sum + (item.discount || 0) * item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        const baseAmount = Math.max(subtotal - couponDiscount, 0);
        const final = baseAmount + deliveryCharge + gstAmount;

        set((state) => {
          state.totalAmount = total;
          state.discount = discount;
          state.totalItems = totalItems;
          state.finalAmount = final;
        });
      },

      // ✅ Add to cart
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

      // ✅ Remove from cart
      removeFromCart: (id, size) => {
        set((state) => {
          state.cart = state.cart.filter(
            item => !(item.id === id && item.selectedSize?.size === size)
          );
        });
        get().calculateTotals();
      },

      // ✅ Increment quantity
      increment: (id) => {
        set((state) => {
          const item = state.cart.find(i => i.id === id);
          if (item) {
            item.quantity += 1;
          }
        });
        get().calculateTotals();
      },

      // ✅ Decrement quantity
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

      // ✅ Clear cart
      clearCart: () => {
        set((state) => {
          state.cart = [];
          state.totalAmount = 0;
          state.discount = 0;
          state.finalAmount = 0;
          state.totalItems = 0;
          state.couponCode = null;
          state.couponDiscount = 0;
          state.couponMessage = null;
          state.deliveryCharge = 0;
          state.gstAmount = 0;
        });
      },

      // ✅ Apply coupon from backend
      applyCouponFromBackend: (couponData) => {
        const { code, discount, final_total, message } = couponData;
        set((state) => {
          state.couponCode = code;
          state.couponDiscount = discount;
          state.couponMessage = message;
        });
        get().calculateTotals();
      },

      // ✅ Remove coupon
      removeCoupon: () => {
        set((state) => {
          state.couponCode = null;
          state.couponDiscount = 0;
          state.couponMessage = null;
        });
        get().calculateTotals();
      },

      // ✅ Set delivery charge and GST from external API
      applyChargesFromBackend: (data) => {
        const { delivery_charge = 0, gst = 0 } = data;
        set((state) => {
          state.deliveryCharge = delivery_charge;
          state.gstAmount = gst;
        });
        get().calculateTotals();
      },

      // revalidate coupon
      revalidateCoupon: async (applyCouponFn) => {
  const { couponCode, finalAmount } = get();
  if (!couponCode) return;

  try {
    const payload = {
      code: couponCode,
      cart_total: finalAmount,
    };

    const data = await applyCouponFn(payload);

    if (data && data.status === 'success') {
      get().applyCouponFromBackend(data.data); // ✅ reapply
    } else {
      get().removeCoupon(); // ❌ remove invalid coupon
    }
  } catch (err) {
    console.error('Coupon revalidation failed:', err);
    get().removeCoupon(); // fallback
  }
},


    })),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCartStore;
