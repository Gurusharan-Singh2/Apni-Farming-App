// src/store/useAddressStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAddressStore = create(
  persist(
    immer((set) => ({
      addresses: [
        {
          id: '1', // Add unique IDs
          title: "Home",
          name: "Gurusharan Singh",
          street: "123 Main Street",
          city: "Amritsar", 
          state: "Punjab",
          zip: "143001",
        },
        {
          id: '2', // Add unique IDs
          title: "Work",
          name: "Priya Sharma",
          street: "456 MG Road",
          city: "Delhi",
          state: "Delhi",
          zip: "110001",
        },
      ],
      selectedAddress: null,

      setAddresses: (addresses) => {
        set((state) => {
          state.addresses = addresses;
        });
      },

      addAddress: (address) => {
        set((state) => {
          state.addresses.push(address);
        });
      },

      updateAddress: (index, updatedAddress) => {
        set((state) => {
          state.addresses[index] = updatedAddress;
        });
      },

      deleteAddress: (index) => {
        set((state) => {
          state.addresses.splice(index, 1);
        });
      },

      setSelectedAddress: (address) => {
        set((state) => {
          state.selectedAddress = address;
        });
      },
    })),
    {
      name: 'address-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAddressStore;
