import React, {useState} from "react";
import useData from "../hooks/useData";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import {useQueryClient} from "react-query";
import useAverage from "../hooks/useAverage";
import colors from "./Colors";

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
            case "temperature":
                info = {
                    name: "Temperature",
                    unit: "(°C)"
                }
                break;
            case "wind_speed":
                info = {
                    name: "Wind speed",
                    unit: "(m/s)"
                };
                break;
            default:
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
        const myObj = {};
        Object.entries(data)
            .forEach(([probeId, v]) =>
                v.forEach(entry =>
                    Object.entries(entry).forEach(([time, value]) => {
                            myObj[time] = {...myObj[time], [probeId]: value}
                        }
                    )))
        return Object.entries(myObj).map(([timeStamp, probes]) => {
            return {...probes, time: formatDate(timeStamp)}
        })
    }

    const chartMemo = React.useMemo(() => {
            const semanticInfo = getSemanticInfo(dataType);
            const data = formatData(dataFromServer ?? {})
            return (<ResponsiveContainer width="100%" height={350}>
                <LineChart data={data}>
                    <XAxis dataKey="time" interval="preserveStart" tick={{fontSize: 10, fill: 'blue'}}/>
                    <YAxis label={{value: semanticInfo.yAxis, angle: -90, position: 'insideLeft'}}/>
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                    {
                        Object.keys(dataFromServer ?? {})
                            .map((probeId, index) => <Line type="monotone"
                                                           key={probeId}
                                                           dataKey={probeId}
                                                           connectNulls
                                                           stroke={colors[index].hex}
                                                           dot={false}/>)
                    }

                    <Legend/>
                </LineChart>
            </ResponsiveContainer>)
        }
        , [dataFromServer, dataType])


    return (
        <div className="container">
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <h1>State of the weather</h1>
                {isLoading || isFetching && <p>Loading ...</p>}
            </div>

            <div className="bordered">
                <div className="grid grid--gutters">
                    <div className="grid__item grid__item--1-5">
                        <label htmlFor="iata">IATA : </label>
                        <select id="iata" value={iata}
                                onChange={({target}) => setIata(target.value)}>
                            <option value="" disabled>--Please choose an airport--</option>
                            <option value="NYC">US - New York</option>
                            <option value="NTE">FR - Nantes</option>
                        </select>
                    </div>
                    <div className="grid__item grid__item--1-5">
                        <label htmlFor="startDate">Start date : </label>
                        <input id="startDate" type="datetime-local" value={startDate}
                               onChange={({target}) => setStarDate(target.value)}/>
                    </div>
                    <div className="grid__item grid__item--1-5">
                        <label htmlFor="endDate">End date : </label>
                        <input id="endDate" type="datetime-local" value={endDate}
                               onChange={({target}) => setEndDate(target.value)}/>
                    </div>
                    <div className="grid__item grid__item--1-5">
                        <label htmlFor="dataType">Data type : </label>
                        <select id="dataType" value={dataType}
                                onChange={({target}) => setDataType(target.value)}>
                            <option value="" disabled>--Please choose a type of mesure--</option>
                            <option value="temperature">Temperature</option>
                            <option value="wind_speed">Wind speed</option>
                            <option value="atmospheric_pressure">Atmospheric pressure</option>
                        </select>
                    </div>
                    <div className="grid__item grid__item--1-5">
                        <label htmlFor="refresh">Refresh</label>
                        <button id="refresh" onClick={() => queryClient.invalidateQueries("data")}>🔄</button>
                    </div>
                </div>
            </div>

            <label htmlFor="meanDate">Mean date : </label>
            <input id="meanDate" type="date" value={meanDate}
                   onChange={({target}) => setMeanDate(target.value)}/>
            {average && <>
                <ul>
                    {Object.entries(average)
                        .map(([k, v], i) => {
                            let type = getSemanticInfo(k);
                            return (
                                <li key={i}>
                                    {`${type.name}: ${v} ${type.unit}`}
                                </li>
                            )
                        })}
                </ul>
            </>}
            <div style={{padding: "30px"}}>
                {chartMemo}
            </div>
        </div>

    );
}
