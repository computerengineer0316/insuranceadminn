import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Multiselect from "multiselect-react-dropdown";

const EditPlanCategory = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [plan_category_name, setPlanCategoryName] = useState('');
    const [plan_category_status, setPlanCategoryStatus] = useState('');
    const [plan_category_id, setPlanCategoryId] = useState([]);

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
            setPlanCategoryId(id);
            planCategoryDetails(id);
            locationList();
        }
    }, []);

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

    const planCategoryDetails = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_plan_category_details/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const plan_category_details = data.data;
                setPlanCategoryName(plan_category_details.plan_category_name);
                const locationid = plan_category_details.plan_category_location;
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
                setPlanCategoryStatus(plan_category_details.plan_category_status);
            });
    }

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const plan_category_name = data.get('plan_category_name');
        const plan_category_location = selectedOption;
        const plan_category_location_len = plan_category_location.length;
        const plan_category_location_id = [];
        for (let i = 0; i < plan_category_location_len; i++) {
            plan_category_location_id.push(plan_category_location[i].value);
        }
        const plan_category_status = data.get('status');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan_category_name: plan_category_name,
                plan_category_location: plan_category_location_id.toString(),
                plan_category_status: plan_category_status,
                plan_category_id: plan_category_id
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_plan_category`, requestOptions)
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
                            navigate("/plan-category");
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
                            navigate("/plan-category");
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
                            <h4 className="card-title">Edit Plan Category</h4>
                        </div>
                        <div className="card-body">
                            <form action="/" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Plan Category Name</label>
                                            <input type="text" className="form-control" placeholder="Plan Category Name" name="plan_category_name" autoComplete="off" defaultValue={plan_category_name} required />
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
                                                <option value="1" selected={plan_category_status == 1 ? true : false}>Active</option>
                                                <option value="0" selected={plan_category_status == 0 ? true : false}>Inactive</option>
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

export default EditPlanCategory
