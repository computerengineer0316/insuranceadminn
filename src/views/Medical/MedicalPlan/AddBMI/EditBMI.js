import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const EditBMI = () => {
    const navigate = useNavigate();
    const [medical_bmi_id, setMedicalBmiId] = useState('');
    const [planBMI, setPlanBMIData] = useState({});
    const [ageRange, setAgeRange] = useState('');
    const [bmiRange, setBMIRange] = useState('');
    const [weightType, setWeightType] = useState([]);
    const [medical_plan_id, setMedicalPlanId] = useState('');
    const [weight_type, setWeight_Type] = useState('');


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            const url = window.location.href;
            const url1 = url.split("/")[3];
            const url2 = url1.split("?")[1];
            const url3 = url2.split("&");
            const bmIid = url3[0].split("=")[1];
            setMedicalBmiId(bmIid);
            const planId = url3[1].split("=")[1];
            setMedicalPlanId(planId);
            planBMIDeltails(bmIid)
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

    const planBMIDeltails = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/medicalplan_bmi_details/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const bmiData = data.data.BMIArray[0]
                setPlanBMIData(bmiData);
                setWeight_Type(data.data?.weight_type)
                setAgeRange(bmiData.minAge + "-" + bmiData.maxAge)
                setBMIRange(bmiData.minBmi + "-" + bmiData.maxBmi)
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        const weight_type = data.get('weight_type');
        const age_range = data.get('age_range');
        const bmi_range = data.get('bmi_range');
        const Malevalue = data.get('Malevalue');
        const fmalevalue = data.get('Femalevalue');
        const fmaleMarridevalue = data.get('FemaleMarridvalue');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ weight_type, age_range, bmi_range, Malevalue, fmalevalue, fmaleMarridevalue })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_medicalplan_bmi?id=${medical_bmi_id}`, requestOptions)
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
                                    <h4 className="card-title">Edit BMI</h4>
                                </div>
                                <div className='col-md-6'>
                                    <a href={`/viewBMI?id=${medical_plan_id}`} className="btn btn-primary" style={{ float: "right" }}>Back</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <form action="/" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Weight Type</label>
                                            <select className="form-control" name="weight_type">
                                                <option value="">Select Weight Type</option>
                                                {
                                                    weightType.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item._id} selected={weight_type == item._id ? true : false}>{item.medical_weight_type}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Age Range</label>
                                            <input type="text" name="age_range" className="form-control" placeholder="Enter Age Range" defaultValue={ageRange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>BMI Range</label>
                                            <input type="text" name="bmi_range" className="form-control" placeholder="Enter BMI Range" defaultValue={bmiRange} />
                                        </div>
                                    </div>

                                </div>
                                <div className='row'>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label> Male Value</label>
                                            <input type="text" name="Malevalue" className="form-control" placeholder="Enter Value" defaultValue={planBMI.Malevalue} required />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label> female Value</label>
                                            <input type="text" name="Femalevalue" className="form-control" defaultValue={planBMI.fmalevalue} placeholder="Enter Value" required />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label> Female(Marride)Value</label>
                                            <input type="text" name="FemaleMarridvalue" className="form-control" placeholder="Enter Value" defaultValue={planBMI.fmaleMarridevalue} required />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <button type="submit" className="btn btn-primary mt-2" style={{ float: "right" }}>Update</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditBMI
