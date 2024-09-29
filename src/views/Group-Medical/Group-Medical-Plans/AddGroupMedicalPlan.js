import React, { useEffect } from 'react';
import TablePlan from './GroupMedicalPlanTable';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

const AddGroupMedicalPlan = () => {
    const navigate = useNavigate();
    const [rowsData, setRowsData] = useState([]);
    const [location, setLocation] = useState([]);
    const errorArray = {
        plan_name: 'Plan Name ',
        company_id: 'Company',
        from_date: 'From Date',
        to_date: 'To Date',
        location: 'Location'
    }
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            locationList();
        }
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
    const addTableRows = () => {
        setRowsData([...rowsData, {
            plan_name: '',
            company_id: '',
            from_date: '',
            to_date: '',
            location: location
        }])
    }
    const deleteTableRows = (index) => {
        const rows = [...rowsData]
        rows.splice(index, 1)
        setRowsData(rows)
    }
    const handleChange = (evnt, index) => {
        const { name, value } = evnt.target
        const rowsInput = [...rowsData]
        rowsInput[index][name] = value
        setRowsData(rowsInput)
    }
    const handleChange1 = (index, value, title) => {
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

                    if (key == "plan_name" || key == "company_id"
                        || key == "tpa" || key == "network") {
                        return true
                    }
                } else if (key == 'location' || key == 'network_list') {
                    if (!value.length) {
                        return true;
                    }
                }
                return false; // Ignore this key - it is not empty
            });

            if (emptyKeys.length > 0) {
                console.log(emptyKeys, ">> emptyKeys");
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
                    text: `${errorArray[errval]}`,
                    type: "warning",
                    icon: "warning",
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
                },
                body: JSON.stringify({ rowsData })
            };
            await fetch('https://insuranceapi-3o5t.onrender.com/api/addgroupmedicalplan', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        swal({
                            title: "Success!",
                            text: data.message,
                            type: "success",
                            icon: "success"
                        }).then(function () {
                            navigate('/ViewGroupMedicalPlans')
                        });
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error"
                        }).then(function () {
                            navigate('/ViewGroupMedicalPlans');
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
                                    <h4 className="card-title">Add Group Medical Plan</h4>
                                </div>
                                <div className='col-md-6'>
                                    <button className='btn btn-primary' onClick={() => navigate('/ViewGroupMedicalPlans')} style={{ float: 'right' }}>Back</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body addmotorplans " style={{ overflowX: 'scroll' }}>
                            <table className="table table-bordered table-responsive" style={{ width: "1500px" }}>
                                <thead>
                                    <tr>
                                        <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                        <th className='text-danger '>Customer Name</th>
                                        <th className='text-danger'>Insurance Company</th>
                                        <th className='text-danger'>From Date</th>
                                        <th className='text-danger'>To Date</th>
                                        {/* <th className='text-danger'>Network List</th> */}
                                        <th className='text-danger'>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <TablePlan
                                        rowsData={rowsData}
                                        deleteTableRows={deleteTableRows}
                                        handleChange={handleChange}
                                        handleChange1={handleChange1}

                                    />
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer">
                            <button disabled={!rowsData.length} className="btn btn-outline-success" style={{ float: "right" }} onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddGroupMedicalPlan
