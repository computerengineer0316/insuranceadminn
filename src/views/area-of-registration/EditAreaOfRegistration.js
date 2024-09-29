import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Multiselect from "multiselect-react-dropdown";

const EditAreaOfRegistration = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [area_of_registration_name, setAreaOfRegistrationName] = useState('');
    const [area_of_registration_status, setAreaOfRegistrationStatus] = useState('');
    const [area_of_registration_id, setAreaOfRegistrationId] = useState('');

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
            setAreaOfRegistrationId(id);
            locationList();
            AreaOfRegistrationDetails(id);
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

    const AreaOfRegistrationDetails = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_area_of_registration_details/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const area_of_registration_details = data.data;
                console.log(data.data, ">>>>>>>>>> area of reg data")
                setAreaOfRegistrationName(area_of_registration_details.area_of_registration_name);
                setAreaOfRegistrationStatus(area_of_registration_details.area_of_registration_status);
            });
    }

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const area_of_registeration_name = data.get('area_of_registeration_name');
        const area_of_registration_location = selectedOption;
        const area_of_registration_location_len = area_of_registration_location.length;
        const area_of_registration_location_id = [];
        for (let i = 0; i < area_of_registration_location_len; i++) {
            area_of_registration_location_id.push(area_of_registration_location[i].value);
        }
        const area_of_registration_status = data.get('status');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                area_of_registration_name: area_of_registration_name,
                area_of_registration_location: area_of_registration_location_id.toString(),
                area_of_registration_status: area_of_registration_status,
                area_of_registration_id: area_of_registration_id
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_area_of_registration`, requestOptions)
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
                            navigate("/area-of-registration");
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
                            navigate("/area-of-registration");
                        }
                    });
                }
            });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Edit Area Of Registration Name</h4>
                        </div>
                        <div className="card-body">
                            <form action="/" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Area Of Registration Name</label>
                                            <input type="text" className="form-control" placeholder="Area Of Registration Name" name="area_of_registeration_name" autoComplete="off" defaultValue={area_of_registration_name} required />
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
                                                <option value="1" selected={area_of_registration_status == 1 ? true : false}>Active</option>
                                                <option value="0" selected={area_of_registration_status == 0 ? true : false}>Inactive</option>
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

export default EditAreaOfRegistration
