import React, { useEffect } from 'react';
import TablePlan from './TravelTablePlan';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

function AddPlan() {
    const navigate = useNavigate();
    const validations = {
        company_id: 'Company Name',
        plan_name: 'Plan Name',
        plan_type: 'Travel Insurance For',
        plan_category_id: 'Cover Type',
        nature_of_plan_id: 'Nature Of Plan',
        travel_type_id: 'Travel Type',
        country_topup: 'Country Topup',
        add_op_con_desc: 'Addition Option Condition Description',
        add_op_con_desc_topup: 'Addition Option Condition Description Topup',
        vat: 'Vat',
        jdv_comm: 'JDV commission',
    }
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
    const [loading, setLoading] = useState(false);

    const addTableRows = () => {
        const rowsInput =
        {
            company_id: '',
            plan_type: '',
            plan_name: '',
            plan_category_id: '',
            nature_of_plan_id: '',
            travel_type_id: '',
            country_topup: '',
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
                    if (key === 'country_topup') {

                        if (!rowData['country_name'] || !rowData['country_name']?.length) {

                            return false;

                        } else {

                            return true;
                        }

                    }
                    if (key === 'add_op_con_desc') {
                        return false;
                    }
                    if (key === 'add_op_con_desc_topup' || key === 'vat') {
                        if (rowData['add_op_con_desc'] === '') {
                            return false;
                        } else {
                            return true;
                        }
                    }
                    return true; // Include this key in emptyKeys

                } else {
                    return false; // Ignore this key - it is not empty
                }
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
                    text: `${validations[errval]} is required`,
                    type: "warning",
                    icon: "warning"
                }).then(function () {
                    return false;
                });

            });
        } else {
            const requestOptions =
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ rowsData })
            };
            await fetch('https://insuranceapi-3o5t.onrender.com/api/addTravelPlan', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        swal({
                            title: "Success!",
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false
                        })
                        navigate('/travel-plan')

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
                        navigate('/travel-plan')

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
                                    <h4 className="card-title">Add Travel Plan</h4>
                                </div>
                                <div className="col-md-6">
                                    <a href="/travel-plan" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body addmotorplans" style={{ overflowX: 'scroll' }}>
                            <table className="table table-bordered" style={{ width: "3500px" }}>
                                <thead>
                                    <tr>
                                        <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                        <th>Company Name</th>
                                        <th>Travel Insurance For</th>
                                        <th>Plan Name</th>
                                        <th>Cover Type</th>
                                        <th>Nature Of Plan</th>
                                        <th>Travel Type</th>
                                        <th>Country</th>
                                        <th>Fixed/Percentage/Reffered (Country)</th>
                                        <th>Add Option Condition Description</th>
                                        <th>Fixed/Percentage/Reffered (Add Option Condition Description)</th>
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
export default AddPlan
