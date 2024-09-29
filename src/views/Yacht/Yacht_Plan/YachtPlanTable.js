import React from "react";
import { useEffect, useState } from 'react';
import Multiselect from "multiselect-react-dropdown";

function TablePlan({ rowsData, deleteTableRows, handleChange, handleChange123 }) {
    const [planCategory, setPlanCategory] = useState([]);
    const [natureOfPlan, setNatureOfPlan] = useState([]);
    const [buisnessTypeList, setBuisnessTypeList] = useState([]);
    const [planForList, setPlanForpList] = useState([]);
    const [bodyTypeList, setBodyTypeList] = useState([]);
    const [hullMaterialList, setHullMaterialList] = useState([]);
    const [HorsePowerList, setHorsePowerList] = useState([]);
    const [EngineTypeList, setEngineTypeList] = useState([]);
    const [speedKnotTypeList, setSpeedKnotTypeList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [location, setLocation] = useState([]);
    const [policyTypes, setPolicyTypes] = useState([]);
    const [errmsg, setErrmsg] = useState({
        status: false,
        name: '',
        index: ''
    })

    const [BreadthList, setBreadthList] = useState([]);
    useEffect(() => {
        Plancategory();
        NatureOfPlan();
        plan_for_list();
        getBuisnessTypeList();
        getBodyTypeList();
        getHullMaterialList();
        getHorsePowerList();
        getEngineTypeList();
        getSpeedknotTypeList();
        policy_types();
        company_list();
        locationList();
        getBoatBreadth();
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
    const getBoatBreadth = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/activeboaBreadth`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setBreadthList(data.data);
            });
    }

    const policy_types = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getPolicyTypes`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setPolicyTypes(data.data);
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

    const plan_for_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getPlanFor`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setPlanForpList(data.data);
            });
    }

    const getBuisnessTypeList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getBusinessType`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setBuisnessTypeList(data.data);
            });
    }

    const getBodyTypeList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getyachtbodytype`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setBodyTypeList(data.data);
            });
    }

    const getHullMaterialList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Yacht_hull_materials`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setHullMaterialList(data.data);
            });
    }

    const getHorsePowerList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Yacht_horespower_type`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setHorsePowerList(data.data);
            });
    }

    const getEngineTypeList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Yacht_engine_type_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setEngineTypeList(data.data);
            });
    }

    const getSpeedknotTypeList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Yacht_speed_knot_typeList`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setSpeedKnotTypeList(data.data);
            });
    }



    const handleChange1 = (index, evnt, title) => {
        handleChange123(index, evnt, title);
    };
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
                        <input type="text" className="form-control" name="plan_name" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Plan Name" />
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
                        <select className="form-control" name="plan_category_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="">Select Plan Category</option>
                            {planCategory.map((item, index) => (
                                <option key={index} value={item._id}>{item.plan_category_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <select className="form-control" name="nature_of_plan_id" onChange={(evnt) => (handleChange(index, evnt))}>
                            <option value="">Select Nature Of Plan</option>
                            {natureOfPlan.map((item, index) => (
                                <option key={index} value={item._id}>{item.nature_of_plan_name}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={planForList}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'plan_for_name'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'plan_for_name'))}
                            displayValue="plan_for_name"
                            showCheckbox={true}
                        />
                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={buisnessTypeList}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'business_type_name'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'business_type_name'))}
                            displayValue="business_type_name"
                            showCheckbox={true}
                        />
                    </td>
                    {/* <td>
                        <input type="text" className="form-control" name="initial_rate" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Initial Rate" />
                    </td>
                    <td>
                        <input type="text" className="form-control" name="discount_rate" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Discount Rate" />
                    </td> */}
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="hull_and_eq_value_range" className="form-control" placeholder="Enter HULL AND EQUIPMENT VALUE RANGE" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="hull_and_eqvr_topup" className="form-control" placeholder="Enter Enter HULL AND EQUIPMENT VALUE RANGE Topup" />
                    </td>
                    <td>
                        <input type="text" className="form-control" name="rate" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Rate" />
                    </td>
                    <td>
                        <input type="text" className="form-control" name="excess" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Excess" />
                    </td>
                    <td>
                        <input type="text" className="form-control" name="minimum_premium" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Mimimum Premium" />
                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={bodyTypeList}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'yacht_body_type'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'yacht_body_type'))}
                            displayValue="yacht_body_type"
                            showCheckbox={true}
                        />
                    </td>
                    <td>
                        <input type="text" className="form-control" name="yb_topup" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Yacht body type Topup" />
                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={hullMaterialList}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'yacht_hull_material'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'yacht_hull_material'))}
                            displayValue="yacht_hull_material"
                            showCheckbox={true}
                        />
                    </td>
                    <td>
                        <input type="text" className="form-control" name="hull_material_topup" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Hull material topup" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="boat_horsepower" className="form-control" placeholder="Enter HORSEPOWER" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="horsepower_topup" className="form-control" placeholder="Enter Enter HORSEPOWER Topup" />
                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={BreadthList}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'breadth_value'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'breadth_value'))}
                            displayValue="name"
                            showCheckbox={true}
                            showArrow={true}
                        />
                    </td>
                    {/* <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="breadth_value" className="form-control" placeholder="Enter BREADTH VALUE" />
                    </td> */}
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="breadth_topup" className="form-control" placeholder="Enter BREADTH VALUE Topup" />
                    </td>
                    {/* <td>
                        <Multiselect
                            className="form-control"
                            options={HorsePowerList}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'yacht_horsepower_type'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'yacht_horsepower_type'))}
                            displayValue="yacht_horsepower_type"
                            showCheckbox={true}
                        />
                    </td>
                    <td>
                        <input type="text" className="form-control" name="horsepower_topup" onChange={(evnt) => (handleChange(index, evnt))} placeholder="HORSEPOWER Topup" />
                    </td> */}
                    <td>
                        <Multiselect
                            className="form-control"
                            options={EngineTypeList}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'yacht_engine_type'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'yacht_engine_type'))}
                            displayValue="yacht_engine_type"
                            showCheckbox={true}
                        />
                    </td>
                    <td>
                        <input type="text" className="form-control" name="engine_type_topup" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Engine Type topup" />
                    </td>
                    {/* <td>
                        <input type="text" className="form-control" name="measurement" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Boat Lenght" />
                    </td> */}
                    <td>
                        <input type="text" className="form-control" name="measurement_value" onChange={(evnt) => (handleChange(index, evnt))} placeholder="e.g. 0-10,10-20" />
                    </td>
                    {/* <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="m_v_topup" className="form-control" placeholder="Enter Boat Length value topup" />
                    </td> */}
                    <td>
                        {/* <Multiselect
                            className="form-control"
                            options={speedKnotTypeList}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'yacht_speed_knot_type'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'yacht_speed_knot_type'))}
                            displayValue="yacht_speed_knot_type"
                            showCheckbox={true}
                        /> */}
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="yacht_speed_knot_type" className="form-control" placeholder="e.g. 0-10,10-20" />

                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="s_k_topup" className="form-control" placeholder="Enter Yacht Speed knot Topup" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="driving_experience" className="form-control" placeholder="e.g. 0-10,10-20" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="driving_exp_topup" className="form-control" placeholder="Enter Driving experience topup" />
                    </td>
                    {/* <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="home_country_driving_experience" className="form-control" placeholder="Enter Home Country Driving Experience" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="h_c_driving_exp_topup" className="form-control" placeholder="Enter Home Country Driving experience topup" />
                    </td> */}

                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="den_ten_value_range" className="form-control" placeholder="e.g. 0-10,10-20" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="den_tender_topup" className="form-control" placeholder="Enter DINGHY/TENDER VALUE RANGE Rate" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="din_ten_val_rate" className="form-control" placeholder="Enter DINGHY/TENDER VALUE RANGE Topup" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="outboard_value_range" className="form-control" placeholder="e.g. 0-10,10-20" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="outboard_value_range_topup" className="form-control" placeholder="Enter outboard value range Topup" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="outboard_range_rate" className="form-control" placeholder="Enter outboard value range Rate" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="personal_eff_cash" className="form-control" placeholder="e.g. 0-10,10-20" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="personal_eff_cash_topup" className="form-control" placeholder="Enter personal effect including cash Topup" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="personal_eff_rate" className="form-control" placeholder="Enter personal effect including cash Rate" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="trailer" className="form-control" placeholder="e.g. 0-10,10-20" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="trailer_topup" className="form-control" placeholder="Enter personal effect including cash Topup" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="trailer_rate" className="form-control" placeholder="Enter personal effect including cash Rate" />
                    </td>
                    <td>
                        <Multiselect
                            className="form-control"
                            options={policyTypes}
                            onSelect={(evnt) => (handleChange1(index, evnt, 'policy_type_name'))}
                            onRemove={(evnt) => (handleChange1(index, evnt, 'policy_type_name'))}
                            displayValue="policy_type_name"
                            showCheckbox={true}
                            showArrow={true}
                        />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="last_year_policy_type_topup" className="form-control" placeholder="Enter Last Year Policy Type Fixed/Percentage/Reffered" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="age_of_the_car" className="form-control" placeholder=" e.g. 0-2,0-5,0-10" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="age_of_the_car_topup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (Age Of The Car)" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="claim_years" className="form-control" placeholder="Enter No Claim Years" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="claim_years_disc" className="form-control" placeholder="Enter Claim Years Discount" />
                    </td>
                    <td>
                        <input type="text" className="form-control" name="pass_capacity" onChange={(evnt) => (handleChange(index, evnt))} placeholder="e.g. 0-10,10-20" />
                    </td>
                    <td>
                        <input type="text" className="form-control" name="pass_capacity_topup" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter passenger capacity topup" />
                    </td>
                    <td>
                        <input type="text" className="form-control" name="crew_capacity" onChange={(evnt) => (handleChange(index, evnt))} placeholder="e.g. 0-10,10-20" />
                    </td>
                    <td>
                        <input type="text" className="form-control" name="crew_capacity_topup" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Enter Crew capacity topup" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="add_op_con_desc" onInput={(e) => validateInput(e, index)} className="form-control" placeholder="Add option condition Description" />
                        {errmsg.status == true && errmsg.name == "add_op_con_desc" && errmsg.index == index ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} name="add_op_con_desc_topup" className="form-control" placeholder="Add option condition Description topup" />
                    </td>
                    <td>
                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} onInput={(e) => validateInput(e, index)} name="vat_able" className="form-control" placeholder="Enter Vat Able" />
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