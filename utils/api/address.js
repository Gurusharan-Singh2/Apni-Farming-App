import axios from 'axios';

export const fetchAddresses = async (uid) => {
  const res = await axios.get(`/api/addresses?uid=${uid}`);
  return res.data;
};

export const addAddress = async (data) => {
  const res = await axios.post(`/api/addresses`, data);
  return res.data;
};

export const updateAddress = async ({ id, data }) => {
  const res = await axios.put(`/api/addresses/${id}`, data);
  return res.data;
};

export const deleteAddress = async (id) => {
  const res = await axios.delete(`/api/addresses/${id}`);
  return res.data;
};
