import { useQuery } from 'react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API;

const getIATA = async () => {
  // const { data } = await axios.get(`${apiUrl}/iata`);
  // return data;
  return ['NYC'];
};

export default function useIATA() {
  return useQuery('iata', getIATA);
}
