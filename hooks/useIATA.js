import { useQuery } from "react-query";
import axios from "axios";


const apiUrl = process.env.NEXT_PUBLIC_API;

const getIATA = async () => {

    const res = await axios.get(
        `${apiUrl}/iata`
    );
    return res;
};

export default function useIATA() {
    return useQuery("iata", getIATA);
}
