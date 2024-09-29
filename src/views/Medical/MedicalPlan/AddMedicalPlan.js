import React, { useEffect } from 'react';
import TablePlan from './MedicalPlanTable';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

const AddMedicalPlan = () => {
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
    const [location, setLocation] = useState([])
    const errorArray = {
        plan_name: "Plan Name Required",
        company_id: "Company Required",
        plan_category_id: "Plan Category Required",
        nature_of_plan_id: "Nature Of Plan Required",
        medical_plan_type: "Medical Plan Type Required",
        medical_plan_condition: "Medical Plan Condition Required",
        medical_plan_condition_topup: "Medical Plan Condition Topup Required",
        nationality_name: "Nationality Required",
        nationality_topup: "Nationality Topup Required",
        medical_salary_range: "Medical Salary Range Required",
        salary_range_topup: "Salary Range Topup Required",
        add_op_con_desc: "Add Option Cond. Description Required",
        add_op_con_desc_topup: "Add Option Cond. Description Topup Required",
        jdv_comm: "JDV Commission Required",
        vat_able: "Vat Able Required",
        excess: "Excess Required",
        location: "Location Required",
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
    const addTableRows = () => {
        const rowsInput =
        {
            plan_name: "",
            company_id: "",
            plan_category_id: "",
            nature_of_plan_id: "",
            medical_plan_type: "",
            medical_plan_condition: "",
            medical_plan_condition_topup: "",
            nationality_name: "",
            nationality_topup: "",
            medical_salary_range: "",
            salary_range_topup: "",
            add_op_con_desc: "",
            add_op_con_desc_topup: "",
            jdv_comm: "",
            vat_able: "",
            excess: "",
            location: location,
        }
        setRowsData([...rowsData, rowsInput])
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

                    if (key == "add_op_con_desc" || key == "add_op_con_desc_topup" || key == "vat_able"
                    ) {
                        if (rowData["add_op_con_desc"] != "" && key != "add_op_con_desc") {
                            return true;
                        }
                        return false
                    } else {
                        return true;
                    }
                }
                else if (key == "plan_name" || key == "company_id" || key == "plan_category_id" || key == "nature_of_plan_id"
                    || key == "medical_plan_type" || key == "medical_plan_condition" || key == "medical_plan_condition_topup"
                    || key == "nationality_name" || key == "nationality_topup" || key == "excess"
                    || key == "medical_salary_range" || key == "salary_range_topup" || key == "location" || key == "jdv_comm"

                ) {

                    if (!value.length) {
                        return true
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
            await fetch('https://insuranceapi-3o5t.onrender.com/api/addmedicalplan', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        swal({
                            title: "Success!",
                            text: data.message,
                            type: "success",
                            icon: "success"
                        }).then(function () {
                            navigate('/medicalplan')
                        });
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error"
                        }).then(function () {
                            navigate('/medicalplan');
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
                                    <h4 className="card-title">Add Medical Plan</h4>
                                </div>
                                <div className='col-md-6'>
                                    <button className="btn btn-primary" style={{ float: "right" }} onClick={() => navigate('/medicalplan')}>Back</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body addmotorplans " style={{ overflowX: 'scroll' }}>
                            <table className="table table-bordered table-responsive" style={{ width: "7500px" }}>
                                <thead>
                                    <tr>
                                        <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                        <th className='text-danger '>Plan Name</th>
                                        <th className='text-danger'>Company</th>
                                        <th className='text-danger'>Plan Category</th>
                                        <th className='text-danger'>Nature Of Plan</th>
                                        <th className='text-danger'>Medical Plan Type</th>
                                        {/* <th>Emirates Issuing Visa</th>
                                        <th>Topup</th> */}
                                        <th className='text-danger'>Plan Condition</th>
                                        <th className='text-danger'>topup</th>
                                        <th className='text-danger'> Nationality</th>
                                        <th className='text-danger'>Topup</th>
                                        <th className='text-danger'>Medical Salary Range</th>
                                        <th className='text-danger'>Topup</th>
                                        <th>Add Option Cond. Description</th>
                                        <th>Topup</th>
                                        <th>Vat Able</th>
                                        <th className='text-danger'>JDV Commission</th>
                                        {/* <th className='text-danger'>excess</th> */}
                                        <th className='text-danger'>Location</th>
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
                            <button disabled={!rowsData.length} className="btn btn-outline-success" style={{ float: "right" }} onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddMedicalPlan
