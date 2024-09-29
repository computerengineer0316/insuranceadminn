import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Multiselect from "multiselect-react-dropdown";

const EditBodyType = () => {
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
            setBodyTypeId(id);
            BodyTypeDetails(id);
            locationList();
        }
    }, []);

    const navigate = useNavigate();
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [body_type_name, setBodyTypeName] = useState('');
    const [body_type_status, setBodyTypeStatus] = useState('');
    const [body_type_id, setBodyTypeId] = useState('');

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

    const BodyTypeDetails = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_body_type_details/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const body_type_details = data.data;
                setBodyTypeName(body_type_details.body_type_name);
                const locationid = body_type_details.body_type_location;
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
                setBodyTypeStatus(body_type_details.body_type_status);
            });
    }

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const body_type_name = data.get('body_type_name');
        const body_type_location = selectedOption;
        const body_type_location_len = body_type_location.length;
        const body_type_location_id = [];
        for (let i = 0; i < body_type_location_len; i++) {
            body_type_location_id.push(body_type_location[i].value);
        }
        const body_type_status = data.get('status');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                body_type_name: body_type_name,
                body_type_location: body_type_location_id.toString(),
                body_type_status: body_type_status,
                body_type_id: body_type_id
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_body_type`, requestOptions)
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
                            navigate("/body-type");
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
                            navigate("/body-type");
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
                            <h4 className="card-title">Edit Body Type</h4>
                        </div>
                        <div className="card-body">
                            <form action="/" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Body Type Name</label>
                                            <input type="text" className="form-control" placeholder="Body Type Name" name="body_type_name" autoComplete="off" defaultValue={body_type_name} required />
                                        </div>
                                    </div>
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
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Status</label>
                                            <select className="form-control" name="status" required>
                                                <option value="">Select Status</option>
                                                <option value="1" selected={body_type_status == 1 ? true : false}>Active</option>
                                                <option value="0" selected={body_type_status == 0 ? true : false}>Inactive</option>
                                            </select>
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

export default EditBodyType
