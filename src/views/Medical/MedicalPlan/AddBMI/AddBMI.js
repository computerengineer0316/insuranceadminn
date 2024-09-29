import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const AddBMI = () => {
    const navigate = useNavigate();
    const [medical_plan_id, setMedicalPlanId] = useState('');
    const [weightType, setWeightType] = useState([]);
    const [rowsData, setRowsData] = useState([{
        weight_type: '',
        age_range: '',
        bmi_range: '',
        Malevalue: '',
        Femalevalue: '',
        FemaleMarridvalue: ''
    }])
    const addTableRows = () => {
        const lastitm = rowsData[rowsData.length - 1];
        const rowsInput =
        {
            weight_type: lastitm.weight_type,
            age_range: lastitm.age_range,
            bmi_range: lastitm.bmi_range,
            Malevalue: lastitm.Malevalue,
            Femalevalue: lastitm.Femalevalue,
            FemaleMarridvalue: lastitm.FemaleMarridvalue
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
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            const url = window.location.href;
            const url1 = url.split("/")[3];
            const url2 = url1.split("?")[1];
            const id = url2.split("=")[1];
            setMedicalPlanId(id);
            Weight_type_list();
        }
    }, []);

    const Weight_type_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_medical_weight_type_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setWeightType(data.data);
            });
    }

    const handleSubmit = () => {

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rowsData)
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/add_medicalplan_bmi?plan_id=${medical_plan_id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        type: "success",
                        icon: "success"
                    }).then(function () {
                        navigate('/viewBMI?id=' + medical_plan_id);
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error"
                    }).then(function () {
                        navigate('/viewBMI?id=' + medical_plan_id);
                    });
                }
            });
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h4 className="card-title">Add BMI</h4>
                                </div>
                                <div className='col-md-6'>
                                    <a href={`/viewBMI?id=${medical_plan_id}`} className="btn btn-primary" style={{ float: "right" }}>Back</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <button className="btn btn-outline-success my-1" onClick={addTableRows}>+</button>
                            {/* <form action="/" method="POST" onSubmit={()=>handleSubmit()}> */}
                            {rowsData?.map((item, index) => {
                                return (
                                    <div className="row mb-3" key={index}>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Weight Type</label>
                                                    <select className="form-control" onChange={(evnt) => handleChange(index, evnt)} defaultValue={rowsData[index].weight_type} name="weight_type">
                                                        <option value="">Select Weight Type</option>
                                                        {
                                                            weightType.map((item, index) => {
                                                                return (
                                                                    <option key={index} value={item._id}>{item.medical_weight_type}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Age Range</label>
                                                    <input type="text" name="age_range" onChange={(evnt) => handleChange(index, evnt)} defaultValue={rowsData[index].age_range} className="form-control" placeholder="Enter Age Range" />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>BMI Range</label>
                                                    <input type="text" name="bmi_range" onChange={(evnt) => handleChange(index, evnt)} defaultValue={rowsData[index].bmi_range} className="form-control" placeholder="Enter BMI Range" />
                                                </div>
                                            </div>

                                        </div>
                                        <div className='row'>

                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label> Male Value</label>
                                                    <input type="text" name="Malevalue" onChange={(evnt) => handleChange(index, evnt)} defaultValue={rowsData[index].Malevalue} className="form-control" placeholder="Enter Value" />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label> female Value</label>
                                                    <input type="text" name="Femalevalue" onChange={(evnt) => handleChange(index, evnt)} defaultValue={rowsData[index].Femalevalue} className="form-control" placeholder="Enter Value" />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label> Female(Marride)Value</label>
                                                    <input type="text" name="FemaleMarridvalue" onChange={(evnt) => handleChange(index, evnt)} defaultValue={rowsData[index].FemaleMarridvalue} className="form-control" placeholder="Enter Value" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-12 my-2">
                                            <div className="btn btn-outline-danger" style={{ float: "right" }} onClick={() => (deleteTableRows(index))}>x</div>
                                        </div>
                                        <hr style={{ borderTop: '2px solid #111' }}></hr>
                                    </div>

                                )
                            })
                            }
                            <div className="row">
                                <div className="col-md-12">
                                    <button type="submit" onClick={handleSubmit} className="btn btn-primary mt-2" style={{ float: "right" }}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddBMI
