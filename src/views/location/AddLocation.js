import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import axios from 'axios';

const AddLocation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const location_name = data.get('location_name');
        const location_status = data.get('location_status');
        const locationdata = { location_name, location_status };
        const response = await axios.post('https://insuranceapi-3o5t.onrender.com/api/add_location', locationdata);
        if (response.data.status === 200) {
            swal({
                title: "Success!",
                text: response.data.message,
                icon: "success",
                button: "OK",
            }).then(function () {
                navigate('/location')
            });
        }
        else {
            swal({
                title: "Error!",
                text: response.data.message,
                icon: "error",
                button: "OK",
            }).then(function () {
                navigate('/location')
            });
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Add Location</h4>
                        </div>
                        <div className="card-body">
                            <form action="/" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Location Name</label>
                                            <input type="text" className="form-control" placeholder="Location Name" name="location_name" autoComplete="off" required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Status</label>
                                            <select className="form-control" name="location_status" required>
                                                <option value="">Select Status</option>
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
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
    )
}

export default AddLocation
