import React from "react";
import { useEffect, useState } from 'react';
import Multiselect from "multiselect-react-dropdown";

function GroupMedicalPlanTable({ rowsData, deleteTableRows, handleChange, handleChange1 }) {
    const [companyList, setCompanyList] = useState([]);
    const [location, setLocation] = useState([]);
    // const [tpa, setTPAs] = useState([]);
    // const [network, setNetworks] = useState([]);
    // const [networkList, setNetworkList] = useState([]);
    useEffect(() => {
        company_list();
        locationList();
        // activeMedicalTPAList();
        // activeMedicalNetwork();
        // MedicalNetworkList();
    }, [])
    const locationList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const locationdt = data.data;
                const location_len = locationdt.length;
                const location_list = [];
                for (let i = 0; i < location_len; i++) {
                    const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
                    location_list.push(location_obj);
                }
                setLocation(location_list);
            });
    }
    const company_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/company_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setCompanyList(data.data);
            });
    }
    // const activeMedicalTPAList = () => {
    //     const requestOptions = {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     };
    //     fetch(`https://insuranceapi-3o5t.onrender.com/api/activeMedicalTPA`, requestOptions)
    //         .then(response => response.json())
    //         .then(data => {
    //             const locationdt = data.data;
    //             setTPAs(locationdt)
    //         });
    // }
    // const activeMedicalNetwork = () => {
    //     const requestOptions = {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     };
    //     fetch(`https://insuranceapi-3o5t.onrender.com/api/activeMedicalNetwork`, requestOptions)
    //         .then(response => response.json())
    //         .then((data) => {
    //             setNetworks(data.data)
    //         });
    // }
    // const MedicalNetworkList = () => {
    //     const requestOptions = {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     };
    //     fetch(`https://insuranceapi-3o5t.onrender.com/api/activeMedicalNetworkList`, requestOptions)
    //         .then(response => response.json())
    //         .then((data) => {
    //             setNetworkList(data.data)
    //         });
    // }
    return (
        rowsData.map((row, index) => {
            return (
                <tr key={index}>
                    <td>
                        <button className="btn btn-outline-danger" onClick={() => (deleteTableRows(index))}>x</button>
                    </td>
                    <td>
                        <input type="text" name="plan_name" value={row.plan_name} onChange={(e) => handleChange(e, index)} className="form-control" />
                    </td>
                    <td>
                        <select className="form-control" name="company_id" onChange={(e) => (handleChange(e, index))}>
                            <option hidden value="">Select Insurance Company</option>
                            {companyList.map((item, index) => (
                                <option key={index} value={item._id}>{item.company_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        {/* <select className="form-control" name="tpa" onChange={(e) => (handleChange(e, index))}>
                            <option value="">Select TPA</option>
                            {tpa.map((item, index) => (
                                <option key={index} value={item._id}>{item.name}</option>
                            ))}
                        </select> */}
                        <input type='date' className='form-control' name='from_date' onChange={(e) => handleChange(e, index)} />
                    </td>
                    <td>
                        {/* <select className="form-control" name="network" onChange={(e) => (handleChange(e, index))}>
                            <option value="">Select Network</option>
                            {network.map((item, index) => (
                                <option key={index} value={item._id}>{item.name}</option>
                            ))}
                        </select> */}
                        <input type="date" className="form-control" name="to_date" onChange={(e) => handleChange(e, index)} />
                    </td>
                    {/* <td> */}
                    {/* <select className="form-control" name="network_list" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="">Select Network List</option>
                            {networkList.map((item, index) => (
                                <option key={index} value={item._id}>{item.name}</option>
                            ))}
                        </select> */}
                    {/* <Multiselect
                            options={networkList}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'network_list'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'network_list'))}
                            displayValue="name"
                            placeholder="Select Location"
                            closeOnSelect={false}
                            avoidHighlightFirstOption={true}
                            showCheckbox={true}
                            style={{ chips: { background: "#007bff" } }}
                            required
                        />
                    </td> */}
                    <td>
                        <Multiselect
                            options={location}
                            selectedValues={location}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'location'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'location'))}
                            displayValue="label"
                            placeholder="Select Location"
                            closeOnSelect={false}
                            avoidHighlightFirstOption={true}
                            showCheckbox={true}
                            style={{ chips: { background: "#007bff" } }}
                            required
                        />
                    </td>
                </tr>
            )
        })
    )
}

export default GroupMedicalPlanTable
