import { useQuery } from 'react-query';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API;

const getAverage = async (IATA, date) => {
  const { data } = await axios.get(
    `${apiUrl}/iata/${IATA}/probes/average?date=${Date.parse(date) / 1000}`
  );
  return data;
};

export default function useAverage(IATA, date) {
  return useQuery(['data', IATA, date], () => getAverage(IATA, date), {
    enabled: !!(date && IATA),
  });
}
