import axios from 'axios';

const BASE_URL = 'https://your-api.com/api/addresses';

export const fetchAddresses = async () => {
  const { data } = await axios.get(BASE_URL);
  return data;
};

export const createAddress = async (address) => {
  const { data } = await axios.post(BASE_URL, address);
  return data;
};

export const updateAddress = async (id, address) => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, address);
  return data;
};

export const deleteAddress = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`);
  return data;
};
