import { CButton } from '@coreui/react';
import React, { useState, useEffect } from 'react'
import { Container, Row } from 'react-bootstrap'
import Multiselect from 'multiselect-react-dropdown';

import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

function Updatetraveltype() {
    const navigate = useNavigate()

    const customURL = window.location.href
    const params = new URLSearchParams(customURL.split('?')[1])
    const ParamValue = params.get('id')


    useEffect(() => {
        locationList();
        detailsbyid();
    }, [])

    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState();
    const [data, setData] = useState([]);
    const [travel_type, setTraveltype] = useState('');
    const [travel_type_location, setTraveltypelocation] = useState([]);
    const [travel_type_status, setTraveltypestatus] = useState()



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

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const detailsbyid = async () => {

        const requestOptions = {
            method: "post",
            body: JSON.stringify({ ParamValue }),
            headers: {
                "Content-Type": "application/json",
            },
        };

        let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_travel_type_by_id`, requestOptions);
        result = await result.json();
        setTraveltype(result.travel_type)
        setTraveltypestatus(result.travel_type_status)
        const locationid = result.travel_type_location;
        const location_id = locationid.toString().split(",");
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
                        setTraveltypelocation(location_name_arr_obj);
                    }
                });
        }
        locationList();
    }


    const updateTravelType = async (e) => {
        e.preventDefault();
        if (travel_type === '' || travel_type === null) {
            swal("Please Enter Travel Type", "", "warning")
            return false;
        } else if (travel_type_location == undefined || travel_type_location == null) {
            swal("Please Select Travel Type Location", "", "warning")
            return false;
        } else if (travel_type_status === '' || travel_type_status === null) {
            swal("Please Select Travel Type Status", "", "warning")
            return false;
        } else {

            const travel_type_location = selectedOption;
            const travel_type_location_len = travel_type_location.length;
            const travel_type_location_str = [];
            for (let i = 0; i < travel_type_location_len; i++) {
                travel_type_location_str.push(travel_type_location[i].value);
            }
            console.log(travel_type_location_str.toString())
            console.log(ParamValue)
            console.log(travel_type)
            console.log(travel_type_location_str.toString())
            console.log(travel_type_status)

            let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/update_travel_type_details`, {
                method: "POST",
                body: JSON.stringify({ ParamValue: ParamValue, travel_type: travel_type, travel_type_location: travel_type_location_str.toString(), travel_type_status: travel_type_status }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            result = await result.json();
            swal("Updated Succesfully", "", "success")
            navigate('/Viewtraveltype')
        }
    }


    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Update Travel Type</h4>
                            </div>
                            <div className="card-body">
                                <form action="/" method="POST" onSubmit={updateTravelType}>
                                    <div className="row">
                                        <div className="col-md-6">

                                            <label className="form-label"><strong>Edit Travel Type</strong></label>
                                            <input type='text' className="form-control"
                                                name='name'
                                                placeholder='Name'
                                                defaultValue={travel_type}
                                                onChange={(e) => setTraveltype(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label"><strong>Select Location</strong></label>

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
                                        <div className="col-md-6">
                                            <label className="form-label"><strong>Status</strong></label>.
                                            <select className="form-control" name="status" onChange={(e) => setTraveltypestatus(e.target.value)}>
                                                <option defaultValue={travel_type_status} hidden>{travel_type_status == 1 ? 'Active' : 'InActive'}</option>
                                                <option value="1">Active</option>
                                                <option value="0">InActive</option>
                                            </select>
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
        </>
    )
}

export default Updatetraveltype