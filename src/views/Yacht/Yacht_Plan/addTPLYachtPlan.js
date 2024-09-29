import React, { useEffect } from 'react';
import TablePlan from './YachtTPLTablePlan';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

function AddTPLYachtPlan() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            locationList();
        }
    }, []);

    const [rowsData, setRowsData] = useState([])
    const [location, setLocation] = useState([]);
    const errorArray = {
        company_id: "Insurance Company Name",
        plan_name: "Plan Name ",
        plan_category_id: "Plan Category",
        policy_type: 'Comprehensive',
        plan_for_name: "Plan For",
        nature_of_plan_id: "Nature Of Plan",
        yacht_body_type: "Body Type",
        initial_rate: "Initial rate",
        discount_rate: "Discount rate",
        rate: "Rate",
        excess: "Excess",
        minimum_premium: "Minimum Premium",
        premium: "Premium",
        business_type_name: "Buisness Type",
        yb_topup: "Body Topup",
        yacht_hull_material: "Hull Material",
        hull_material_topup: "Hull Material Topup",
        yacht_horsepower_type: "Horsepower Type",
        horsepower_topup: "Horse Power Topup",
        yacht_engine_type: "Engine Type",
        engine_type_topup: "Engine Type Topup",
        measurement: "Measurement",
        measurement_value: "Boat Length",
        m_v_topup: "Measurement Value Topup",
        yacht_speed_knot_type: "Speed Knot Type",
        s_k_topup: "Speed Knot Topup",
        driving_experience: "Driving experience",
        driving_exp_topup: "Driving experience Topup",
        home_country_driving_experience: "Home Country Driving Experience",
        h_c_driving_exp_topup: "Home Country Driving Experience Topup",
        hull_and_eq_value_range: "Hull And Equipment Value Range",
        hull_and_eqvr_topup: "HULL And Equipment Value Range ",
        den_ten_value_range: "Dinghy/Tender Value Range",
        den_tender_topup: "Dinghy/Tender Value Range Topup",
        outboard_value_range: "Outboard Value Range",
        outboard_value_range_topup: "Outboard Value Range Topup",
        personal_eff_cash: "Personal Effects including Cash",
        personal_eff_cash_topup: "Personal Effects including Cash Topup",
        trailer: "Trailer",
        policy_type_name: "Last Year Policy Type",
        trailer_topup: "Trailer Topup",
        claim_years: "Claim Years",
        claim_years_disc: "No Claim Discount",
        pass_capacity: "Passenger Capacity",
        pass_capacity_topup: "Passenger Capacity Topup",
        crew_capacity: "Crew Capacity",
        crew_capacity_topup: "Crew Capacity Topup",
        add_op_con_desc: "Add option Condition Description",
        add_op_con_desc_topup: "Add option Condition Description Topup",
        vat_able: "Vat Able",
        jdv_commision: "JDV Commission",
        // age_of_the_car: "Age Of the boat",
        location: "Location"
    }
    const addTableRows = () => {
        const rowsInput =
        {
            plan_name: "",
            company_id: "",
            policy_type: 'Third Party Liability (TPL)',
            plan_category_id: "",
            nature_of_plan_id: "",
            plan_for_name: [],
            // initial_rate: "",
            // discount_rate: "",
            business_type_name: [],
            yacht_body_type: [],
            yb_topup: "",
            measurement_value: "",
            minimum_premium: "",
            premium: "",
            // rate: "",
            // excess: "",
            yacht_hull_material: [],
            hull_material_topup: "",
            // yacht_horsepower_type: "",
            // horsepower_topup: "",
            yacht_engine_type: [],
            breadth_value: [],
            engine_type_topup: "",
            // measurement: "",
            // m_v_topup: "",
            yacht_speed_knot_type: "",
            s_k_topup: "",
            driving_experience: "",
            driving_exp_topup: "",
            // home_country_driving_experience: "",
            // h_c_driving_exp_topup: "",
            hull_and_eq_value_range: "",
            hull_and_eqvr_topup: "",
            den_ten_value_range: "",
            den_tender_topup: "",
            outboard_value_range: "",
            outboard_value_range_topup: "",
            personal_eff_cash: "",
            personal_eff_cash_topup: "",
            trailer: "",
            trailer_topup: "",
            claim_years: "",
            claim_years_disc: "",
            pass_capacity: "",
            pass_capacity_topup: "",
            crew_capacity: "",
            crew_capacity_topup: "",
            add_op_con_desc: "",
            add_op_con_desc_topup: "",
            vat_able: "",
            jdv_commision: "",
            // age_of_the_car: "",
            age_of_the_car_topup: "",
            location: location

        }//
        setRowsData([...rowsData, rowsInput])
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
    const deleteTableRows = (index) => {
        const rows = [...rowsData]
        rows.splice(index, 1)
        setRowsData(rows)
    }

    const handleChange = (index, evnt) => {
        const { name, value } = evnt.target
        const rowsInput = [...rowsData]
        rowsInput[index][name] = value
        setRowsData(rowsInput)
    }

    const handleChange123 = (index, value, title) => {
        const rowsInput = [...rowsData];
        rowsInput[index][title] = value;

        setRowsData(rowsInput)
        // console.log(rowsInput)
    }

    const handleSubmit = async () => {
        const objectsWithEmptyValues = [];
        rowsData.forEach((rowData, rowIndex) => {
            const emptyKeys = Object.keys(rowData).filter((key) => {
                const value = rowData[key];
                // console.log(value," : ",typeof value)
                if (typeof value === 'string' && value.trim() == '') {
                    // console.log("inside first if")
                    if (key == "company_id" || key == "plan_category_id" || key == "nature_of_plan_id" || key == "plan_name"
                        || key == "initial_rate" || key == "discount_rate" || key == "minimum_premium"
                        || key == "measurement" || key == "measurement_value" || key == "driving_experience" || key == "yacht_speed_knot_type"
                        || key == "hull_and_eq_value_range" || key == "den_ten_value_range" || key == "age_of_the_car"
                        || key == "outboard_value_range" || key == "personal_eff_cash" || key == "trailer" || key == "claim_years"
                        || key == "claim_years_disc" || key == "pass_capacity" || key == "crew_capacity"
                        || key == "jdv_commision"
                    ) {
                        return true
                    } else if (key == "vat_able" && rowData["add_op_con_desc"]) {
                        return true
                    } else {
                        return false;
                    }
                    // Include this key in emptyKeys
                }
                else if (typeof value === 'object' && (key == "plan_for_name" || key == "yacht_body_type" || key == "policy_type_name"
                    || key == "yacht_hull_material" || key == "yacht_horsepower_type" || key == "yacht_engine_type" || key == "business_type_name"
                    || key == "location")) {
                    // console.log("inside second if :",value)
                    if (!value.length) {
                        return true
                    } else {
                        return false
                    }
                }
                return false; // Ignore this key - it is not empty
            });

            if (emptyKeys.length > 0) {
                // Store information about the object and its empty keys
                objectsWithEmptyValues.push({
                    index: rowIndex,
                    emptyKeys: emptyKeys,
                });
            }
        });
        if (objectsWithEmptyValues.length > 0) {
            objectsWithEmptyValues.forEach((objectInfo) => {
                const errval = objectInfo.emptyKeys[0];
                swal({
                    title: "warning!",
                    text: `${errorArray[errval]} is required`,
                    type: "warning",
                    icon: "warning",
                }).then(function () {
                    return false;
                });

            });
        }
        else {
            const requestOptions =
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ rowsData })
            };
            await fetch('https://insuranceapi-3o5t.onrender.com/api/addyachtplan', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        swal({
                            title: "Success!",
                            text: data.message,
                            type: "success",
                            icon: "success"
                        }).then(function () {
                            navigate('/yachtplan')
                        });
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error"
                        }).then(function () {
                            navigate('/yachtplan');
                        });
                    }
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <div className="container mb-5">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Add Third Party Yacht Plan</h4>
                                </div>
                                <div className='col-md-6'>
                                    <a href="/yachtplan" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body addmotorplans" style={{ overflowX: 'scroll' }}>
                            <table className="table table-bordered" style={{ width: "12000px" }}>
                                <thead>
                                    <tr>
                                        <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>

                                        <th>Plan Name</th>
                                        <th>Company Name</th>
                                        <th>Plan Category</th>
                                        <th>Nature Of Plan</th>
                                        <th>Plan For</th>
                                        <th>Buisness Type</th>
                                        {/* <th>Initial Rate</th>
                                        <th>Discounted Rate</th> */}
                                        <th>Yacht Body Type</th>
                                        <th>Boat length</th>
                                        {/* <th>Boat Length Topup</th> */}
                                        {/* <th>Rate %</th>
                                        <th>Excess</th> */}
                                        <th>Minimum Premium</th>
                                        <th>Premium</th>
                                        {/* <th>Yacht Body Type Topup</th> */}
                                        <th>Hull Material</th>
                                        <th>Fixed/Percentage/Reffered (Topup)</th>
                                        <th>HORSEPOWER</th>
                                        <th>Fixed/Percentage/Reffered (Topup)</th>
                                        <th>BOAT BREADTH</th>
                                        <th>Fixed/Percentage/Reffered (Topup)</th>
                                        {/* <th>HORSEPOWER</th>
                                        <th>Topup</th> */}
                                        <th>ENGINE TYPE</th>
                                        <th>Fixed/Percentage/Reffered (Topup)</th>
                                        {/* <th>Boat length</th> */}
                                        <th>Speed Knots</th>
                                        <th>Fixed/Percentage/Reffered (Topup)</th>
                                        <th>Driving experience</th>
                                        <th>Fixed/Percentage/Reffered (Topup)</th>
                                        {/* <th>Home Country Driving experience</th>
                                        <th>Topup</th> */}
                                        <th>HULL AND EQUIPMENT VALUE RANGE</th>
                                        <th>Fixed/Percentage/Reffered (Topup)</th>
                                        <th>DINGHY/TENDER VALUE RANGE</th>
                                        <th>Fixed/Percentage/Reffered (Topup)</th>
                                        <th>Outboard value range(if any)</th>
                                        <th>Fixed/Percentage/Reffered (Topup)</th>
                                        <th>Personal Effects including Cash</th>
                                        <th>Fixed/Percentage/Reffered (Topup)</th>
                                        <th>Trailer(if any)</th>
                                        <th>Fixed/Percentage/Reffered (Topup)</th>
                                        <th>No Claim year</th>
                                        <th>No Claim Discount</th>
                                        <th>PASSENGER CAPACITY</th>
                                        <th>Fixed/Percentage/Reffered (Topup)</th>
                                        <th>CREW CAPACITY</th>
                                        <th>Fixed/Percentage/Reffered (Topup)</th>
                                        <th>Add option Condition Description</th>
                                        <th>Fixed/Percentage/Reffered (Topup)</th>
                                        <th>Vat Able</th>
                                        <th>JDV Commission</th>
                                        <th>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <TablePlan
                                        rowsData={rowsData}
                                        deleteTableRows={deleteTableRows}
                                        handleChange={handleChange}
                                        handleChange123={handleChange123}
                                    />
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-outline-success" style={{ float: "right" }} onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AddTPLYachtPlan
