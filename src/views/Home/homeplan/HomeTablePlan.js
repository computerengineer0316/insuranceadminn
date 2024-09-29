import Multiselect from "multiselect-react-dropdown";
import React from "react";
import { useEffect, useState } from 'react';
// import Multiselect from "multiselect-react-dropdown";

function TablePlan({ rowsData, deleteTableRows, handleChange, handleChange123 }) {
    const [planCategory, setPlanCategory] = useState([]);
    const [natureOfPlan, setNatureOfPlan] = useState([]);
    const [propertyTypeList, setpropertyTypeList] = useState([]);
    const [ownershipList, setOwnershipList] = useState([]);
    const [homePlanList, setHomePlanList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [location, setLocation] = useState([]);
    const [errmsg, setErrmsg] = useState({
        status: false,
        name: '',
        index: ''
    })



    useEffect(() => {
        company_list();
        property_type_list();
        Plancategory();
        NatureOfPlan();
        ownership_list();
        getHomePlanTypeList();
        locationList();
    }, []);
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
    const property_type_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_home_property_type_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const property_type_list = data.data;
                const proptype = property_type_list?.map((item, index) => (
                    { label: item.home_property_type, value: item._id }
                ));
                setpropertyTypeList(proptype);
                console.log(data.data, "property_type_list")
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

    const Plancategory = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getPlanCategory`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setPlanCategory(data.data);
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

    const ownership_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_home_owner_type_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setOwnershipList(data.data);
            });
    }

    const getHomePlanTypeList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_home_plan_type?match=${true}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setHomePlanList(data.data);
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
                            {companyList?.map((item, index) => (
                                <option key={index} value={item._id}>{item.company_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <input type="text" className="form-control" name="plan_name" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Plan Name" />
                    </td>

                    <td>
                        <select className="form-control" name="plan_category_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="">Select Plan Category</option>
                            {planCategory?.map((item, index) => (
                                <option key={index} value={item._id}>{item.plan_category_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <select className="form-control" name="nature_of_plan_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="">Select Nature Of Plan</option>
                            {natureOfPlan?.map((item, index) => (
                                <option key={index} value={item._id}>{item.nature_of_plan_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        {/* <select className="form-control" name="property_type_id" onChange={(evnt)=>(handleChange(index, evnt))}>
                        <option value="">Property Type</option>
                        {propertyTypeList?.map((item, index) => (
                            <option key={index} value={item._id}>{item.home_property_type}</option>
                        ))}
                        
                       
                    </select> */}
                        <Multiselect
                            options={propertyTypeList}
                            selectedValues={propertyTypeList}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'property_type_id'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'property_type_id'))}
                            displayValue="label"
                            placeholder="Select Location"
                            closeOnSelect={false}
                            avoidHighlightFirstOption={true}
                            showCheckbox={true}
                            style={{ chips: { background: "#007bff" } }}
                            required
                        />
                    </td>
                    <td>
                        <select className="form-control" name="ownership_status_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="">Ownership Status</option>
                            {ownershipList?.map((item, index) => (
                                <option key={index} value={item._id}>{item.home_owner_type}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <select className="form-control" name="plan_type_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="">Plan Type</option>
                            {homePlanList?.map((item, index) => (
                                <option key={index} value={item._id}>{item.home_plan_type}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <input type="text"
                            disabled={rowsData[index].plan_type_id == "642279f2fb67d39380fef834" ? true : false}
                            className="form-control" name="building_value" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Building Value" />
                    </td>
                    <td>
                        <input type="text"
                            disabled={rowsData[index].plan_type_id == "642279f2fb67d39380fef834" ? true : false}
                            className="form-control" name="building_value_topup" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Building Value topup" />
                    </td>
                    <td>
                        <input type="text"
                            disabled={rowsData[index].plan_type_id == "642279f2fb67d39380fef834" ? true : false}
                            className="form-control" name="bv_rate" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Building Value Rate" />
                    </td>
                    <td>
                        <input type="text"
                            disabled={rowsData[index].plan_type_id == "642279f2fb67d39380fef834" ? true : false}
                            className="form-control" name="bvminmumPrimium" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Building Primium" />
                    </td>
                    {/* <td>
                <input type="text" className="form-control" name="initial_rate" onChange={(evnt)=>(handleChange(index, evnt))} placeholder="Enter Initial Rate"/>
                </td>
                <td>
                <input type="text" className="form-control" name="discount_rate" onChange={(evnt)=>(handleChange(index, evnt))} placeholder="Enter Discount Rate"/>
                </td> */}

                    <td>
                        <input type="text"
                            disabled={rowsData[index].plan_type_id == "642279d4fb67d39380fef82d" ? true : false}
                            className="form-control" name="content_value" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Content Value" />
                    </td>
                    <td>
                        <input type="text" disabled={rowsData[index].plan_type_id == "642279d4fb67d39380fef82d" ? true : false} className="form-control" name="content_topup" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Content Topup" />
                    </td>
                    <td>
                        <input type="text" disabled={rowsData[index].plan_type_id == "642279d4fb67d39380fef82d" ? true : false} className="form-control" name="cv_rate" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Content Rate" />
                    </td>
                    <td>
                        <input type="text" disabled={rowsData[index].plan_type_id == "642279d4fb67d39380fef82d" ? true : false} className="form-control" name="contentMinmuprimium" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Content Primium" />
                    </td>
                    <td>
                        <input type="text" disabled={rowsData[index].plan_type_id == "642279d4fb67d39380fef82d" ? true : false} className="form-control" name="pbvalue" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Personal Belongings Value" />
                    </td>
                    <td>
                        <input type="text" disabled={rowsData[index].plan_type_id == "642279d4fb67d39380fef82d" ? true : false} className="form-control" name="pbvalue_topup" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Personal Belonging Value topup" />
                    </td>
                    <td>
                        <input type="text" disabled={rowsData[index].plan_type_id == "642279d4fb67d39380fef82d" ? true : false} className="form-control" name="pbv_rate" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Personal Belonging Rate" />
                    </td>
                    <td>
                        <input type="text" disabled={rowsData[index].plan_type_id == "642279d4fb67d39380fef82d" ? true : false} className="form-control" name="pvminmumPrimium" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Personal Primium" />
                    </td>
                    <td>
                        <input type="text" className="form-control" name="excess" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Excess" />
                    </td>
                    <td>
                        <input type="text" className="form-control" name="no_claim_year" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter No Claim Year" />

                    </td>
                    <td>
                        <input type="text" className="form-control" name="no_claim_discount" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter No Claim Discount" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="domestic_helper" className="form-control" placeholder="Enter Domestic Helper" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="domestic_helper_topup" className="form-control" placeholder="Enter Domestic Helper Topup" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="add_op_con_desc" onInput={(e) => validateInput(e, index)} className="form-control" placeholder="Add option condition Description" />
                        {errmsg.status == true && errmsg.name == "add_op_con_desc" && errmsg.index == index ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="add_op_con_desc_topup" className="form-control" placeholder="Add option condition Description topup" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="vat_able" onInput={(e) => validateInput(e, index)} className="form-control" placeholder="Enter Vat Able" />
                        {errmsg.status == true && errmsg.name == "vat_able" && errmsg.index == index ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="jdv_commision" className="form-control" placeholder="Enter JDV Commision" />
                    </td>
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

export default TablePlan;