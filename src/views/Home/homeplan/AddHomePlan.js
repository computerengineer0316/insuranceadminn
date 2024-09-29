import React, { useEffect } from 'react';
import TablePlan from './HomeTablePlan';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

function AddPlan() {
    const navigate = useNavigate();
    const validations = {
        company_id: 'Company Name',
        plan_name: 'Plan Name',
        plan_category_id: 'Plan Category',
        nature_of_plan_id: 'Nature Of Plan',
        property_type_id: 'Property Type',
        ownership_status_id: 'Ownership Status',
        plan_type_id: 'Plan Type',
        jdv_commision: 'JDV Commission',
        location: 'Location',

    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            locationList();
            property_type_list();
        }
    }, []);

    const [rowsData, setRowsData] = useState([])
    const [location, setLocation] = useState([]);
    const [propertyTypeList, setpropertyTypeList] = useState([]);

    const addTableRows = () => {
        const rowsInput =
        {
            company_id: "",
            plan_name: "",
            plan_category_id: "",
            nature_of_plan_id: "",
            property_type_id: propertyTypeList,
            add_op_con_desc: "",
            add_op_con_desc_topup: "",
            building_value: "",
            building_value_topup: "",
            bv_rate: "",
            content_topup: "",
            content_value: "",
            cv_rate: "",
            domestic_helper: "",
            domestic_helper_topup: "",
            excess: "",
            jdv_commision: "",
            no_claim_discount: "",
            no_claim_year: "",
            ownership_status_id: "",
            pbvalue: "",
            pbvalue_topup: "",
            pbv_rate: "",
            plan_type_id: "",
            rate: "",
            vat_able: "",
            location: location
        }
        setRowsData([...rowsData, rowsInput])

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
    const handleChange123 = (index, value, title) => {
        const rowsInput = [...rowsData];
        rowsInput[index][title] = value;
        setRowsData(rowsInput)
    }
    const handleChange = (index, evnt) => {
        const { name, value } = evnt.target
        const rowsInput = [...rowsData]
        rowsInput[index][name] = value
        setRowsData(rowsInput)
    }

    const handleSubmit = async () => {
        const objectsWithEmptyValues = [];

        rowsData.forEach((rowData, rowIndex) => {
            const emptyKeys = Object.keys(rowData).filter((key) => {
                const value = rowData[key];
                if (key == "plan_name" || key == "company_id" || key == "plan_category_id" || key == "nature_of_plan_id"
                    || key == "ownership_status_id" || key == "plan_type_id" || key == "jdv_commision" || key == "location" || key == "property_type_id"
                ) {
                    if (!value.length) {
                        return true
                    }

                    else if (typeof value === 'string' && value.trim() === '') {

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
                console.log(errval, "errval")
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
            await fetch('https://insuranceapi-3o5t.onrender.com/api/addhomeplan', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        swal({
                            title: "Success!",
                            text: data.message,
                            type: "success",
                            icon: "success"
                        }).then(function () {
                            navigate('/homeplan')
                        });
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error"
                        }).then(function () {
                            navigate('/homeplan');
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
                                    <h4 className="card-title">Add Home Plan</h4>
                                </div>
                                <div className="col-md-6">
                                    <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ float: 'right' }}>Back</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body addmotorplans" style={{ overflowX: 'scroll' }}>
                            <table className="table table-bordered" style={{ width: "7500px" }}>
                                <thead>
                                    <tr>
                                        <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                        <th style={{ color: "red" }}>Company Name</th>
                                        <th style={{ color: "red" }}>Plan Name</th>
                                        <th style={{ color: "red" }}>Plan Category</th>
                                        <th style={{ color: "red" }}>Nature Of Plan</th>
                                        <th style={{ color: "red" }}>Property Type</th>
                                        <th style={{ color: "red" }}>Ownership Status</th>
                                        <th style={{ color: "red" }}>Plan Type</th>
                                        <th>Building Value</th>
                                        <th>Bulding Topup</th>
                                        <th>Building Value Rate %</th>
                                        <th>Building Minmum Primium </th>
                                        {/* <th>Initial Rate</th>
                                        <th>Discounted Rate</th> */}
                                        <th>Content Value</th>
                                        <th>Content Topup</th>
                                        <th>Content Value Rate %</th>
                                        <th>Content Minmum Primium </th>
                                        <th>Personal Belongings Value</th>
                                        <th>Personal Belongings Topup</th>
                                        <th>Personal Belonging Value Rate %</th>
                                        <th>Personal Minmum Primium </th>
                                        <th>Excess</th>
                                        <th>No Claim Year</th>
                                        <th>No Claim Discount</th>
                                        <th>Domestic Helper</th>
                                        <th>Domestic Helper Topup</th>
                                        <th>Add Option Cond. Description</th>
                                        <th>Add Op. Cond. Desc.Topup</th>
                                        <th>Vat Able</th>
                                        <th style={{ color: "red" }}>JDV Commission</th>
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
