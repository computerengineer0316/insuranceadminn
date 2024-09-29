import React from "react";
import { useEffect, useState } from 'react';
import Multiselect from "multiselect-react-dropdown";

function TablePlan({ rowsData, deleteTableRows, handleChange, handleChange123 }) {
    const [travel_cover_type, setTravelCoverType] = useState([]);
    const [natureOfPlan, setNatureOfPlan] = useState([]);
    const [TravelType, setTravelType] = useState([]);
    const [TravelInsuranceFor, setTravelInsuranceFor] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [location, setLocation] = useState([]);
    const [errmsg, setErrmsg] = useState({
        status: false,
        name: '',
        index: ''
    })

    useEffect(() => {
        company_list();
        travel_cover_type_list();
        NatureOfPlan();
        TravelTypeList();
        travel_insurance_for();
        country_list();
        locationList();
    }, []);

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

    const travel_cover_type_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/travelcovertype`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setTravelCoverType(data.data);
            });
    }

    const NatureOfPlan = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getNatureOfPlan`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNatureOfPlan(data.data);
            });
    }

    const TravelTypeList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getTravelType`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setTravelType(data.data);
            });
    }

    const travel_insurance_for = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getTravelInsuranceFor`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setTravelInsuranceFor(data.data);
            });
    }

    const country_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getNationality`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setCountryList(data.data);
            });
    }

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
    const handleChange1 = (index, evnt, title) => {
        handleChange123(index, evnt, title);
    };
    const validateInput = (e, index) => {
        const inputValue = e.target.value;
        const textPattern = /^[A-Za-z,]*$/;
        if (!textPattern.test(inputValue)) {
            setErrmsg({ status: true, name: e.target.name, index: index })
            e.target.value = inputValue.replace(/[^a-zA-Z\s,]/g, '');
        } else {
            setErrmsg({ status: false, name: e.target.name, index: index })
        }
    }
    return (
        rowsData.map((data, index) => {
            return (
                <tr key={index}>
                    <td>
                        <button className="btn btn-outline-danger" onClick={() => (deleteTableRows(index))}>x</button>
                    </td>
                    <td>
                        <select className="form-control" name="company_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="" hidden>Select Company</option>
                            {companyList.map((item, index) => (
                                <option key={index} value={item._id}>{item.company_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <select className="form-control" name="plan_type" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="" hidden>Select Plan Type</option>
                            {TravelInsuranceFor.map((item, index) => (
                                <option key={index} value={item._id}>{item.travel_insurance_for}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="plan_name" className="form-control" placeholder="Enter Plan Name" />
                    </td>
                    <td>
                        <select className="form-control" name="plan_category_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="" hidden>Select Cover Type</option>
                            {travel_cover_type.map((item, index) => (
                                <option key={index} value={item._id}>{item.travel_cover_type}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <select className="form-control" name="nature_of_plan_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="" hidden>Select Nature Of Plan</option>
                            {natureOfPlan.map((item, index) => (
                                <option key={index} value={item._id}>{item.nature_of_plan_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <select className="form-control" name="travel_type_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="" hidden>Select Travel Type</option>
                            {TravelType.map((item, index) => (
                                <option key={index} value={item._id}>{item.travel_type}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={countryList}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'country_name'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'country_name'))}
                            displayValue="nationality_name"
                            showCheckbox={true}
                        />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="country_topup" className="form-control" placeholder="Enter Country Topup" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} onInput={(e) => validateInput(e, index)} name="add_op_con_desc" className="form-control" placeholder="Enter Add Option Condition Description" />
                        {errmsg.status == true && errmsg.name == "add_op_con_desc" && errmsg.index == index ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="add_op_con_desc_topup" className="form-control" placeholder="Enter Topup (Add Option Condition Description)" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} onInput={(e) => validateInput(e, index)} name="vat" className="form-control" placeholder="Enter Vat Able" />
                        {errmsg.status == true && errmsg.name == "vat" && errmsg.index == index ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="jdv_comm" className="form-control" placeholder="Enter JDV Commission" />
                    </td>
                    <td>
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
                    </td>
                </tr>
            )
        })
    )
}

export default TablePlan;