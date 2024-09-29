import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";

const AddModelMotor = () => {
    const navigate = useNavigate();
    const [make_motor, setMakeMotor] = useState([]);
    const [location, setLocation] = useState([]);
    const [rowsData, setRowsData] = useState([])
    const [errors, setErrors] = useState({});


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
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

                setLocation(locationdt);
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // const data = new FormData(e.target);
        // const model_motor_name = data.get('model_motor_name');
        // const make_motor = data.get('make_motor');
        // const model_motor_status = data.get('status');
        // const model_motor_location = selectedOption;
        // const model_motor_location_len = model_motor_location.length;
        // const model_motor_location_str = [];
        // for(let i = 0; i < model_motor_location_len; i++)
        // {
        //     model_motor_location_str.push(model_motor_location[i].value);
        // }

        try {


            const hasEmptyFields = rowsData.some((row) => {
                return row.motor_model_name.trim() === '' || !row.make_motor || row.location.length === 0;
            });

            if (hasEmptyFields) {
                swal({
                    title: "Warning!",
                    text: "Please fill in all fields for each row.",
                    type: "warning",
                    icon: "warning"
                });
                return; // Exit the function if there are empty fields
            }


            // console.log(rowsData,">>>>>>>>>>rowsData")

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rowsData)
            };
            fetch('https://insuranceapi-3o5t.onrender.com/api/addModelMotor', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status == 200) {
                        swal({
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false
                        })
                        navigate('/motor-model')
                        setTimeout(() => {
                            swal.close()
                        }, "1000");
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error",
                            button: false
                        })
                        navigate('/motor-model/AddModelMotor')
                        setTimeout(() => {
                            swal.close()
                        }, "1000");
                    }
                });
        }
        catch (error) {
            console.log(error);
        }
    }
    const addTableRows = () => {
        const rowsInput =
        {
            motor_model_name: '',
            make_motor: '',
            location: location,


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
        const rowsInput = [...rowsData];
        rowsInput[index][title] = value;
        setRowsData(rowsInput)
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-12">
                                    <h4 className="card-title">Add Model Motor</h4>
                                </div>
                            </div>
                            <div className="card-body addmotorplans" style={{ overflowX: 'scroll' }}>
                                <table className="table table-bordered" style={{ width: "auto" }}>
                                    <thead>
                                        <tr>
                                            <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                            <th>Model Motor Name</th>
                                            <th>Make Motor</th>
                                            <th>Make Motor Location</th>
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
                                                            <input type="text" onChange={(evnt) => (handleChange(index, evnt))} className="form-control" name="motor_model_name" placeholder="Model Motor Name" autoComplete="off" required />

                                                        </td>
                                                        <td>
                                                            <select className="form-control" onChange={(evnt) => (handleChange(index, evnt))} name="make_motor" required>
                                                                <option value="">Select Make Motor</option>
                                                                {make_motor.map((item, index) => (
                                                                    <option key={index} value={item._id}>{item.make_motor_name}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <Multiselect
                                                                style={{ overflow: 'visible' }}
                                                                options={location}
                                                                selectedValues={location}
                                                                displayValue="location_name"
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
        </div>
    )
}

export default AddModelMotor
