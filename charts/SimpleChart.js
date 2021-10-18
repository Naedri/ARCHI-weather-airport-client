import React, {useState} from "react";
import useData from "../hooks/useData";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import {useQueryClient} from "react-query";
import useAverage from "../hooks/useAverage";

const formatDate = (unixDate) => {
    const date = new Date(+unixDate*1000);
    const lang = 'en-US';
    const options = {month: '2-digit', day: '2-digit', hour: "2-digit", minute: "2-digit"};
    return date.toLocaleDateString(lang, options);
}

export default function SimpleChart(props) {
    const [startDate, setStarDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dataType, setDataType] = useState("");
    const [iata, setIata] = useState("");
    const queryClient = useQueryClient();
    const {data: dataFromServer} = useData(iata, startDate, endDate, dataType);
    const {data: average} = useAverage(iata, endDate)


    const formatData = (data) => {
        return Object.entries(data)
            .map(([_, v]) =>
                v.map(entry =>
                    Object.entries(entry).map(([time, value]) =>
                        ({
                            time: formatDate(time),
                            value
                        }))
                ))
    }

    const dataForChart = formatData(dataFromServer ?? []).flat(2);


    return (
        <div style={{width: '100%'}}>
            <h4>Average state of the weather</h4>
            <label htmlFor="startDate">Start date</label>
            <input id="startDate" type="datetime-local" value={startDate}
                   onChange={({target}) => setStarDate(target.value)}/>
            <br/>
            <label htmlFor="endDate">End date</label>
            <input id="endDate" type="datetime-local" value={endDate}
                   onChange={({target}) => setEndDate(target.value)}/>
            <br/>
            <label htmlFor="iata">IATA</label>
            <select id="iata" value={iata}
                    onChange={({target}) => setIata(target.value)}>
                <option value="" disabled>--Please choose an airport--</option>
                <option value="NYC">US - New York</option>
                <option value="NTE">FR - Nantes</option>
            </select>

            <br/>
            <label htmlFor="dataType">Data type</label>
            <select id="dataType" value={dataType}
                    onChange={({target}) => setDataType(target.value)}>
                <option value="" disabled>--Please choose a type of mesure--</option>
                <option value="temperature">Temperature</option>
                <option value="wind_speed">Wind speed</option>
                <option value="atmospheric_pressure">Atmospheric pressure</option>
            </select>
            <br/>
            <button onClick={() => queryClient.invalidateQueries("data")}>Refresh</button>
            <pre>
                {JSON.stringify(average, null, 2)}
            </pre>
            <div style={{padding: "30px"}}>

            <ResponsiveContainer width="100%" height={200}>
                <LineChart width={500} height={300} data={dataForChart}>
                    <XAxis dataKey="time" interval="preserveStart" allowDuplicatedCategory={false}/>
                    <YAxis/>
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                    <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false}/>
                </LineChart>
            </ResponsiveContainer>
            </div>


        </div>
    );
}
