import { useQuery } from 'react-query';
import axios from 'axios';
import mockJson from '../docs/mock-data.json';

const apiUrl = process.env.NEXT_PUBLIC_API;

const getData = async (IATA, start, end, dataType) => {
  const startToUnix = Date.parse(start) / 1000;
  const endToUnix = Date.parse(end) / 1000;
  // const { data } = await axios.get(
  //   `${apiUrl}/iata/${IATA}/probes?start=${startToUnix}&end=${endToUnix}&dataType=${dataType}`
  // );
  return mockJson;
};

export default function useData(IATA, start, end, dataType) {
  return useQuery(
    ['data', IATA, start, end, dataType],
    () => getData(IATA, start, end, dataType),
    {
      enabled: !!(IATA && start && end && dataType),
    }
  );
}
