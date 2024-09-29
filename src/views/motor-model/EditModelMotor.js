import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Multiselect from "multiselect-react-dropdown";

const EditModelMotor = () => {
    const navigate = useNavigate();
    const [make_motor, setMakeMotor] = useState([]);
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [model_motor_id, setModelMotorId] = useState('');
    const [model_motor_name, setModelMotorName] = useState('');
    const [model_motor_make, setModelMotorMake] = useState('');
    const [model_motor_status, setModelMotorStatus] = useState('');

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
            setModelMotorId(id);
            getModelMotor(id);
            getlistMakeMotor();
            locationList();
        }
    }, [])

    const getlistMakeMotor = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/getlistMakeMotor', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data.data);
                setMakeMotor(data.data);
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

    const getModelMotor = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getModelMotorDetails/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setModelMotorName(data.data.motor_model_name);
                setModelMotorMake(data.data.motor_model_make_id);
                const locationid = data.data.motor_model_location;
                const location_id = locationid.split(",");
                const location_id_len = location_id.length;
                const location_name = [];
                for (let i = 0; i < location_id_len; i++) {
                    const requestOptions = {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    };
                    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location_by_id/${location_id[i]}`, requestOptions)
                        .then((response) => response.json())
                        .then((data) => {
                            location_name.push(data.data.location_name);
                            const location_name_len = location_name.length;
                            if (location_name_len === location_id_len) {
                                const location_name_str = location_name.join(",");
                                const location_name_arr = location_name_str.split(",");
                                const location_name_arr_len = location_name_arr.length;
                                const location_name_arr_obj = [];
                                for (let i = 0; i < location_name_arr_len; i++) {
                                    const location_name_arr_obj_obj = { label: location_name_arr[i], value: location_id[i] };
                                    location_name_arr_obj.push(location_name_arr_obj_obj);
                                }
                                setSelectedOption(location_name_arr_obj);
                            }
                        });
                }
                setModelMotorStatus(data.data.motor_model_status);
            });
    }

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const model_motor_name = data.get('model_motor_name');
        const make_motor = data.get('make_motor');
        const location = selectedOption;
        const location_len = location.length;
        const location_id = [];
        for (let i = 0; i < location_len; i++) {
            location_id.push(location[i].value);
        }
        const location_id_str = location_id.join(",");
        const model_motor_status = data.get('status');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model_motor_name: model_motor_name,
                make_motor: make_motor,
                model_motor_location: location_id_str.toString(),
                model_motor_status: model_motor_status,
                model_motor_id: model_motor_id
            })
        };
        fetch('/updateModelMotor', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    Swal.fire({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        confirmButtonText: "Ok",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/motor-model");
                        }
                    });
                }
                else {
                    Swal.fire({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        confirmButtonText: "Ok",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/motor-model");
                        }
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
                            <div className="row">
                                <div className="col-md-12">
                                    <h4 className="card-title">Edit Model Motor</h4>
                                </div>
                            </div>
                            <div className="card-body">
                                <form action="/" method="POST" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Model Motor Name</label>
                                                <input type="text" className="form-control" placeholder="Model Motor Name" name="model_motor_name" defaultValue={model_motor_name} autoComplete="off" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Make Motor</label>
                                                <select className="form-control" name="make_motor" required>
                                                    <option value="">Select Make Motor</option>
                                                    {make_motor.map((item, index) => (
                                                        <option key={index} value={item._id} selected={model_motor_make == item._id ? true : false}>{item.make_motor_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Location</label>
                                                <Multiselect
                                                    options={location}
                                                    selectedValues={selectedOption}
                                                    onSelect={handleChange}
                                                    onRemove={handleChange}
                                                    displayValue="label"
                                                    placeholder="Select Location"
                                                    closeOnSelect={false}
                                                    avoidHighlightFirstOption={true}
                                                    showCheckbox={true}
                                                    style={{ chips: { background: "#007bff" } }}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Status</label>
                                                <select className="form-control" name="status" required>
                                                    <option value="">Select Status</option>
                                                    <option value="1" selected={model_motor_status == 1 ? true : false}>Active</option>
                                                    <option value="0" selected={model_motor_status == 0 ? true : false}>Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <button type="submit" className="btn btn-primary mt-2" style={{ float: "right" }}>Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditModelMotor
