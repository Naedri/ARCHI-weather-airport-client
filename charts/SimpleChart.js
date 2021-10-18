import React, {useState} from "react";
import useData from "../hooks/useData";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import {useQueryClient} from "react-query";
import useAverage from "../hooks/useAverage";

const formatDate = (unixDate) => {
    const date = new Date(+unixDate * 1000);
    const lang = 'en-US';
    const options = {month: '2-digit', day: '2-digit', hour: "2-digit", minute: "2-digit"};
    return date.toLocaleDateString(lang, options);
}

export default function SimpleChart(props) {
    const [startDate, setStarDate] = useState("");
    const [meanDate, setMeanDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dataType, setDataType] = useState("");
    const [iata, setIata] = useState("");
    const queryClient = useQueryClient();
    const {data: dataFromServer, isLoading, isFetching} = useData(iata, startDate, endDate, dataType);
    const {data: average} = useAverage(iata, meanDate)

    const getSemanticInfo = (d) => {
        let info = {};
        switch (d) {
            case "temperature" :
                info = {
                    name: "Temperature",
                    unit: "(°C)"
                }
                break;
            case "wind_speed" :
                info = {
                    name: "Wind speed",
                    unit: "(m/s)"
                };
                break;
            default :
                info = {
                    name: "Atmospheric pressure",
                    unit: "(P)"
                };
        }
        info.title = info.name + " in fonction of the time.";
        info.yAxis = info.name + " " + info.unit;
        return info;
    }

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

    const av = average && Object.entries(
        JSON.parse(average.replaceAll("NaN", null)))

    const semanticInfo = getSemanticInfo(dataType);
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
            <label htmlFor="meanDate">Mean date</label>
            <input id="meanDate" type="date" value={meanDate}
                   onChange={({target}) => setMeanDate(target.value)}/>
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
            {average && <>
                <ul>
                    {Object.entries(av)
                        .map(([_, v], i) =>
                            <li key={i}>
                                {`${v}`}
                            </li>
                        )}
                </ul>
            </>}
            <h4>{semanticInfo.title}</h4>
            <div style={{padding: "30px"}}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dataForChart}>
                        <XAxis dataKey="time" interval="preserveStart" tick={{fontSize: 10, fill: 'orange'}}/>
                        <YAxis label={{ value: semanticInfo.yAxis , angle: -90, position: 'insideLeft' }} />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                        <Line type="monotone" dataKey="value" stroke="orange" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {isLoading || isFetching && <p>Loading ...</p>}
        </div>

    );
}
