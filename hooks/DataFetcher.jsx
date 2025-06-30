import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchBanners = async (url) => {
  const { data } = await axios.get(url);
  return data;
};

const DataFetcher = (url) => {
  return useQuery({
    queryKey: ['banners', url], // include url in the key for caching
    queryFn: () => fetchBanners(url),
    enabled: !!url, // only run if url is provided
  });
};

export default DataFetcher