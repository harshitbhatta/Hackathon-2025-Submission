import React, { useState, useEffect } from "react";
import axios from 'axios';
// import { json2csv } from 'json-2-csv';

const VisualsPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [csvData, setCsvData] = useState('');

    function convertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
    
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
    
                line += array[i][index];
            }
    
            str += line + '\r\n';
        }
    
        return str;
    }

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/processed-data/');
            // const jsonData = typeof(response.data);
            console.log(response.data);
            console.log("eg");
            // console.log(typeof(jsonData));
            // var csv_data = JSON.parse(response.data);
            // console.log(csv_data);
            setData(response.data);
            console.log(response.data[0])
            const csv_data = convertToCSV(JSON.stringify(response.data));
            console.log(csv_data);
        } catch (error) {
            setError('Error fetching data');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Ensure data is an array before mapping
    // if (!Array.isArray(data)) {
    //     return <div>Data is not in the expected format</div>;
    // }

    return (
        <>
            <div>
            <h1>Data Table</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Log.Event Dt</th>
                        <th>Fleet Name</th>
                        <th>Region Name</th>
                        <th>Performance</th>
                        {/* Add more headers as needed */}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={index}>
                                <td>{item["Log.Event Dt"]}</td>
                                <td>{item["Fleet Name"]}</td>
                                <td>{item["Region Name"]}</td>
                                <td>{item["Performance"]}</td>
                                {/* Render other fields as needed */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        </>
        // <div>
        //     <h1>Data Visualization</h1>
        //     <table>
        //         <thead>
        //             <tr>
        //                 {data[0] && Object.keys(data[0]).map((key) => (
        //                     <th key={key}>{key}</th>
        //                 ))}
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {data.map((row, index) => (
        //                 <tr key={index}>
        //                     {Object.values(row).map((value, i) => (
        //                         <td key={i}>{value}</td>
        //                     ))}
        //                 </tr>
        //             ))}
        //         </tbody>
        //     </table>
        // </div>
    );
};

export default VisualsPage;
