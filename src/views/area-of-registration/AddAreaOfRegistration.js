import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";

const AddAreaOfRegistration = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
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

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     const data = new FormData(e.target);
    //     const area_of_registration_name = data.get('area_of_registeration_name');
    //     const area_of_registration_location = selectedOption;
    //     const area_of_registration_location_len = area_of_registration_location.length;
    //     const area_of_registration_location_str = [];
    //     for(let i = 0; i < area_of_registration_location_len; i++)
    //     {
    //         area_of_registration_location_str.push(area_of_registration_location[i].value);
    //     }
    //     const area_of_registration_status = data.get('status');
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             area_of_registration_name: area_of_registration_name,
    //             area_of_registration_location: area_of_registration_location_str.toString(),
    //             area_of_registration_status: area_of_registration_status
    //         })
    //     };
    //     fetch(`https://insuranceapi-3o5t.onrender.com/api/add_area_of_registeration`, requestOptions)
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.status === 200)
    //             {
    //                 swal({
    //                     title: "Success!",
    //                     text: data.message,
    //                     icon: "success",
    //                     button: "Ok",
    //                 }).then(function() {
    //                     navigate('/area-of-registration');
    //                 });
    //             }
    //             else
    //             {
    //                 swal({
    //                     title: "Error!",
    //                     text: data.message,
    //                     icon: "error",
    //                     button: "Ok",
    //                 }).then(function() {
    //                     navigate('/area-of-registration');
    //                 });
    //             }
    //         });
    // }


    // area_of_registeration_name


    const [rowsData, setRowsData] = useState([])
    const [errors, setErrors] = useState({});


    const addTableRows = () => {
        const rowsInput =
        {
            area_of_registration_name: '',
            location: location

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

        if (value.trim() === '') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: 'This is required',
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '', // Clear the error message if the value is not empty
            }));
        }
        const rowsInput = [...rowsData]
        rowsInput[index][name] = value
        setRowsData(rowsInput)
    }
    const handleChange1 = (index, value, title) => {
        console.log(value, "multiselect value")
        const rowsInput = [...rowsData];
        rowsInput[index][title] = value;
        setRowsData(rowsInput)
    }


    const handleSubmit = () => {

        try {

            const hasEmptyFields = rowsData.some((row) => {
                return row.area_of_registration_name === '' || row.location.length == 0;
            });

            if (hasEmptyFields) {
                swal({
                    title: "Warning!",
                    text: "Please fill in all fields for each row.",
                    type: "warning",
                    icon: "warning",
                    button: false
                })
                return;
            }

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rowsData)
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/add_area_of_registeration`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status == 200) {
                        swal({
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false

                        })
                        navigate('/area-of-registration')
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error",
                            button: false
                        })
                        navigate('/area-of-registration')
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                });
        }
        catch (err) {
            console.log(err)
        }

    }




    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-12">
                                    <h4 className="card-title">Add Area Of Registration</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body addmotorplans" style={{ overflowX: 'scroll' }}>
                            <table className="table table-bordered" style={{ width: "auto" }}>
                                <thead>
                                    <tr>
                                        <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                        <th>Area Of Registration Name</th>
                                        <th>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        rowsData.map((data, index) => {
                                            return (
                                                <tr key={index} >
                                                    <td>
                                                        <button className="btn btn-outline-danger" onClick={() => (deleteTableRows(index))}>x</button>
                                                    </td>
                                                    <td>
                                                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} className="form-control" name="area_of_registration_name" placeholder="Area Of Registration Name" autoComplete="off" required />

                                                    </td>
                                                    <td>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={location}
                                                            displayValue="label"
                                                            onSelect={(evnt) => (handleChange1(index, evnt, 'location'))}
                                                            onRemove={(evnt) => (handleChange1(index, evnt, 'location'))}
                                                            placeholder="Select Location"
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </td>

                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-outline-success" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddAreaOfRegistration
