import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import axios from 'axios'

const EditLocation = () => {
    const navigate = useNavigate();
    const [locationid, setLocationid] = useState("");
    const [locationname, setLocationname] = useState("");
    const [locationstatus, setLocationstatus] = useState("");

    useEffect(() => {
        if (localStorage.getItem('token') == null || localStorage.getItem('token') == '' || localStorage.getItem('token') == undefined) {
            navigate('/login')
        }
        else {
            const url = window.location.href;
            const url1 = url.split("/")[3];
            const url2 = url1.split("?")[1];
            const id = url2.split("=")[1];
            setLocationid(id);
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location_by_id/${id}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    const locationdt = data.data;
                    console.log(locationdt);
                    setLocationname(locationdt.location_name);
                    setLocationstatus(locationdt.location_status);
                });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const location_name = data.get("location_name");
        const location_status = data.get("status");
        const locationdata = { location_name: location_name, location_status: location_status, location_id: locationid };
        const response = await axios.post(`https://insuranceapi-3o5t.onrender.com/api/update_location`, locationdata);
        if (response.data.status == 200) {
            swal({
                title: "Success",
                text: response.data.message,
                icon: "success",
                button: "OK",
            }).then(() => {
                navigate("/location");
            });
        }
        else {
            swal({
                title: "Error",
                text: response.data.message,
                icon: "error",
                button: "OK",
            }).then(() => {
                navigate("/location");
            });
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Edit Location</h4>
                        </div>
                        <div className="card-body">
                            <form action="/" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Location Name</label>
                                            <input type="text" className="form-control" name="location_name" placeholder="Location Name" defaultValue={locationname} autoComplete="off" required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Status</label>
                                            <select className="form-control" name="status" required>
                                                <option value="">Select Status</option>
                                                <option value="1" selected={locationstatus == 1 ? true : false}>Active</option>
                                                <option value="0" selected={locationstatus == 0 ? true : false}>Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <button type="submit" className="btn btn-primary mt-2" style={{ float: "right" }}>Update</button>
                                        </div>
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

export default EditLocation
