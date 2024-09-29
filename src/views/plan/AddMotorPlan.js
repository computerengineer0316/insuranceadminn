import React, { useEffect } from 'react';
import TablePlan from './MotorTablePlan';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

function AddPlan() {
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
    const [errors, setErrors] = useState({});
    const [location, setLocation] = useState([]);


    const errorArray = {
        company_id: "Insurance Company Name",
        plan_name: "Plan Name ",
        plan_category_id: "Plan Category",
        plan_label: "Plan Label",
        nature_of_plan_id: "Nature Of Plan",
        electric_vehicle: "Vehicle Type",
        car_value: "Car Value",
        car_value_topup: "Car Value Topup",
        rate: "Rate",
        min_premium: "Minimum Premium",
        excess: "Excess",
        age: "Driver Age",
        agetopup: "Age Topup",
        drivingexp: "Driving Experience",
        drivingexptopup: "Driving Experience Topup",
        homedrivingexp: "Home Country Driving Experience",
        homedrivingexptopup: "Home Country Driving Experience Topup",
        claimyear: "Claim Years",
        claimyeardisc: "Claim Years Discount",
        policy_type_name: "Last Year Policy Type",
        last_year_policy_type_topup: "Last Year Policy Type Topup",
        gccspecstopup: "GCC Specs Topup",
        nationalitytopup: "Nationality Topup",
        age_of_the_car: "Age Of The Car",
        age_of_the_car_topup: "Age Of The Car Topup",
        add_op_con_desc: "Add Option Condition Description",
        add_op_con_desc_topup: "Add Option Condition Description Topup",
        vat: "Vat",
        jdv_comm: "JDV Commission",
        location: "Location is required",
        nationality_name: "Nationality is required",
        body_type_name: "Body Type",
        repair_condition_id: "Repair Type",
        business_type_name: "Buisness Type",
        plan_for: "Plan For"
    }
    const addTableRows = () => {
        const rowsInput =
        {
            company_id: '',
            policy_type: 'Comprehensive',
            plan_name: '',
            plan_category_id: '',
            body_type_name: '',
            repair_condition_id: '',
            plan_for: '',
            business_type_name: '',
            plan_label: '',
            nature_of_plan_id: '',
            electric_vehicle: '',
            car_value: '',
            car_value_topup: '',
            rate: '',
            min_premium: '',
            excess: '',
            age: '',
            agetopup: '',
            drivingexp: '',
            drivingexptopup: '',
            homedrivingexp: '',
            homedrivingexptopup: '',
            claimyear: '',
            claimyeardisc: '',
            policy_type_name: '',
            last_year_policy_type_topup: '',
            gccspecstopup: '',
            nationalitytopup: '',
            age_of_the_car: '',
            age_of_the_car_topup: '',
            add_op_con_desc: '',
            add_op_con_desc_topup: '',
            vat: '',
            jdv_comm: '',
            location: location,

        }
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
        if (name == "car_value") {

            let excess = [];
            if (value?.includes("-") && value?.includes(",")) {
                const comasepval = value?.split(",")
                for (let i = 0; i < comasepval?.length; i++) {
                    if (comasepval[i].includes("-")) {
                        const hypeSep = comasepval[i]?.split("-")
                        if (hypeSep[1] <= 50000) {
                            excess.push(250)
                        }
                        else if (50000 < hypeSep[1] && hypeSep[1] <= 100000) {
                            excess.push(350)
                        }
                        else if (100000 < hypeSep[1] && hypeSep[1] < 1500000) {
                            excess.push(500)
                        } else if (!hypeSep[0] < 1000000 && hypeSep[1] >= 1500000) {
                            excess.push(500)
                        }
                    }
                }
                let excessVal = excess.join(",")
                const rowsInput = [...rowsData]
                rowsInput[index]["excess"] = excessVal
                setRowsData(rowsInput)
            }
            else if (value.includes("-") && !value.includes(",")) {
                const hypeSep = value.split("-")
                if (hypeSep[1] <= 50000) {
                    excess.push(250)
                }
                else if (50000 < hypeSep[1] && hypeSep[1] <= 100000) {
                    excess.push(350)
                }
                else if (100000 < hypeSep[1] && hypeSep[1] < 1500000) {
                    excess.push(500)
                } else if (!hypeSep[0] < 1000000 && hypeSep[1] >= 1500000) {
                    excess.push(500)
                }
                let excessVal = excess[0];
                const rowsInput = [...rowsData]
                rowsInput[index]["excess"] = excessVal
                setRowsData(rowsInput)
            } else {

                if (value <= 50000) {
                    excess.push(250)
                }

                else if (50000 < value && value <= 100000) {
                    excess.push(350)
                }
                else if (100000 < value && value < 1500000) {
                    excess.push(500)
                } else if (value >= 1500000) {
                    excess.push(500)
                }
                let excessVal = excess[0];
                console.log(excessVal, ">>>>> excess value")
                const rowsInput = [...rowsData]
                rowsInput[index]["excess"] = excessVal
                setRowsData(rowsInput)
            }
        }
        if (value.trim() === '') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: 'This is required',
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '', // Clear the error message if the value is not empty
            }));
        }
        const rowsInput = [...rowsData]
        rowsInput[index][name] = value
        setRowsData(rowsInput)
    }

    const handleChange123 = (index, value, title) => {
        const rowsInput = [...rowsData];
        rowsInput[index][title] = value;
        setRowsData(rowsInput)
    }

    const handleSubmit = async () => {
        const objectsWithEmptyValues = [];

        rowsData.forEach((rowData, rowIndex) => {
            const emptyKeys = Object.keys(rowData).filter((key) => {
                const value = rowData[key];
                if (typeof value === 'string' && value.trim() === '') {
                    if (key == "plan_label" || key == "car_value_topup" || key == "agetopup" || key == "drivingexptopup"
                        || key == "electric_vehicle" || key == "homedrivingexp" || key == "homedrivingexptopup"
                        || key == "nationality_name" || key == "last_year_policy_type_topup"
                        || key == "claimyear" || key == "claimyeardisc" || key == "gccspecstopup" || key == "nationalitytopup"
                        || key == "age_of_the_car" || key == "age_of_the_car_topup" || key == "add_op_con_desc"
                        || key == "add_op_con_desc_topup" || key == "vat" || key == "jdv_comm" || key == "business_type_name") {
                        return false
                    } else {
                        console.log(key, ">>>>>>>>>> this is key")
                        return true;
                    }
                    // Include this key in emptyKeys
                }
                else if (key == "body_type_name" || key == "repair_type_name" || key == "plan_for_name" || key == "business_type_name") {
                    if (!value.length) {
                        return true
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
            //   if( BodyType)
        } else {
            const requestOptions =
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({ rowsData })
            };
            await fetch('https://insuranceapi-3o5t.onrender.com/api/addMotorPlan', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        swal({
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false
                        })

                        navigate('/motor-plan')
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error",
                            button: false
                        })
                        navigate('/motor-plan')
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
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
                                    <h4 className="card-title">Add Comprehensive Motor Plan</h4>
                                </div>
                                <div className="col-md-6">
                                    <a href="/motor-plan" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body addmotorplans" style={{ height: "450px", overflowX: 'scroll' }}>
                            <table className="table table-bordered" style={{ width: "13000px" }}>
                                <thead>
                                    <tr>
                                        <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                        <th className='text-danger'>Company Name</th>
                                        <th className='text-danger'>Plan Name</th>
                                        <th className='text-danger'>Plan Category</th>
                                        <th>Plan Label</th>
                                        <th className='text-danger'>Nature Of Plan</th>
                                        <th className='text-danger'>Body Type</th>
                                        <th className='text-danger'>Repair Condition</th>
                                        <th>Electric Vehicle</th>
                                        <th className='text-danger'>Plan For</th>
                                        <th>Fixed/Percentage/Reffered (Plan For)</th>
                                        <th>Business Type</th>
                                        <th className='text-danger'>Car Value</th>
                                        <th className='text-danger'>Excess</th>
                                        <th>Fixed/Percentage/Reffered (Car Value)</th>
                                        <th className='text-danger'>Rate</th>
                                        <th className='text-danger'>Min Premium</th>
                                        <th className='text-danger'>Driver Age</th>
                                        <th>Fixed/Percentage/Reffered (Driver Age)</th>
                                        <th className='text-danger'>Driving Experiance</th>
                                        <th>Fixed/Percentage/Reffered (Driving Experiance)</th>
                                        <th>Home Country Driving Experiance</th>
                                        <th>Fixed/Percentage/Reffered (Home Country Driving Experiance)</th>
                                        <th>No Claim Year</th>
                                        <th>No Claim Discount</th>
                                        <th className='text-danger'>last year policy type</th>
                                        <th>Fixed/Percentage/Reffered (last year policy type)</th>
                                        <th>GCC / No-GCC</th>
                                        <th>Fixed/Percentage/Reffered (GCC / No-GCC)</th>
                                        <th>Nationality</th>
                                        <th>Fixed/Percentage/Reffered (Nationality)</th>
                                        <th>Car Model</th>
                                        <th>Fixed/Percentage/Reffered(Car Model)</th>
                                        <th>Age Of The Car</th>
                                        <th>Fixed/Percentage/Reffered (Age Of The Car)</th>
                                        <th>Add Option Condition Description</th>
                                        <th>Fixed/Percentage/Reffered (Add Option Condition Description)</th>
                                        <th>Vat Able</th>
                                        <th>JDV Commission</th>
                                        <th>Locations</th>
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
export default AddPlan
