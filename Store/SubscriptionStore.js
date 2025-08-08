import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useSubscriptionStore = create(

    immer((set, get) => ({
      cart: [],
      totalAmount: 0,
      discount: 0,
      finalAmount: 0,
      totalItems: 0,
        deliveryCharge: 0,
      gstAmount: 0,

      // ✅ Recalculate Totals
      calculateTotals: () => {
        const {
          cart,
          deliveryCharge,
          gstAmount
        } = get();

        const total = cart.reduce((sum, item) => sum + (item.sellPrice || 0) * item.quantity, 0);
        const discount = cart.reduce((sum, item) => sum + (item.discount || 0) * item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.sellPrice || 0) * item.quantity, 0);
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        const baseAmount = Math.max(subtotal , 0);
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
    const normalizedId = Number(item.id);
    const sizeId = Number(item.selectedSize?.id);

    const existingItem = state.cart.find(
      (i) => Number(i.id) === normalizedId && Number(i.selectedSize?.id) === sizeId
    );
    
    

    const costPrice = item.selectedSize?.costPrice || 0;
    const sellPrice = item.selectedSize?.sellPrice || 0;
    const discount = costPrice - sellPrice;

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.selectedSize = { ...item.selectedSize, id: sizeId };
      existingItem.price = sellPrice;
      existingItem.costPrice = costPrice;
      existingItem.discount = discount;
    } else {
      state.cart.push({
        ...item,
        id: normalizedId,
        selectedSize: { ...item.selectedSize, id: sizeId },
        quantity: 1,
        price: sellPrice,
        sellPrice,
        costPrice,
        discount,
      });
    }
  });
  get().calculateTotals();
},


      // ✅ Remove from cart
      removeFromCart: (id, sizeId) => {
        set((state) => {
          state.cart = state.cart.filter(
            item => !(item.id === id && item.selectedSize?.id === sizeId)

          );
        });
        get().calculateTotals();
      },
increment: (id, sizeId) => {
  set((state) => {
    const item = state.cart.find(
      (i) => Number(i.id) === Number(id) && Number(i.selectedSize?.id) === Number(sizeId)
    );

    if (item) {
      item.quantity += 1;
    }
  });
  get().calculateTotals();
},


decrement: (id, sizeId) => {
  set((state) => {
    const index = state.cart.findIndex(
      (i) => Number(i.id) === Number(id) && Number(i.selectedSize?.id) === Number(sizeId)
    );

    if (index !== -1) {
      const item = state.cart[index];
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.cart.splice(index, 1); // remove the item completely
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


       applyChargesFromBackend: (data) => { 
        const { deliverycharge , tax  } = data;
        set((state) => {
          state.deliveryCharge = deliverycharge;
          state.gstAmount = tax;
        });
        get().calculateTotals();
      },
    

    


    }))
   
  
);

export default useSubscriptionStore;
