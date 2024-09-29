import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";

const AddLineOfBusiness = () => {

    useEffect(() => {
        if (localStorage.getItem('token') == null || localStorage.getItem('token') == '' || localStorage.getItem('token') == undefined) {
            navigate('/login')
        }
        else {
            locationList();
        }
    }, []);

    const navigate = useNavigate();
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const line_of_business_name = data.get('line_of_business_name');
        const line_of_business_location = selectedOption;
        const line_of_business_location_len = line_of_business_location.length;
        const line_of_business_location_str = [];
        for (let i = 0; i < line_of_business_location_len; i++) {
            line_of_business_location_str.push(line_of_business_location[i].value);
        }
        const line_of_business_status = data.get('status');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                line_of_business_name: line_of_business_name,
                line_of_business_location: line_of_business_location_str.toString(),
                line_of_business_status: line_of_business_status
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/add_line_of_business`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    swal({
                        title: "Wow!",
                        text: data.message,
                        type: "success",
                        icon: "success"
                    }).then(function () {
                        navigate('/line-of-business')
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error"
                    }).then(function () {
                        navigate('/line-of-business/AddLineOfBusiness')
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
                            <h4 className="card-title">Add Line Of Business</h4>
                        </div>
                        <div className="card-body">
                            <form action="/" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Line Of Business Name</label>
                                            <input type="text" className="form-control" name="line_of_business_name" placeholder="Line Of Business Name" autoComplete="off" required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Location</label>
                                            <Multiselect
                                                options={location}
                                                displayValue="label"
                                                onSelect={setSelectedOption}
                                                onRemove={setSelectedOption}
                                                placeholder="Select Location"
                                                showCheckbox={true}
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
export default AddLineOfBusiness