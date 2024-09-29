import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';

const Addhomecondition = () => {

    const navigate = useNavigate();
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [rowsData, setRowsData] = useState([])
    const [errors, setErrors] = useState({});


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

                setLocation(locationdt.map((val) => ({ label: val.location_name, value: val._id })));
            });
    }




    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(rowsData, "rowsData")
        try {
            const hasEmptyFields = rowsData.some((row) => {
                return row.condition_label.trim() === '' || row.condition_description === '' || row.location == 0;
            });

            if (hasEmptyFields) {
                // Display an error message or handle the validation error as needed
                swal({
                    title: "Warning!",
                    text: "Please fill in all fields for each row.",
                    type: "warning",
                    icon: "warning"
                });
                return false; // Exit the function if there are empty fields
            }
            else {

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(rowsData)
                };

                fetch(`https://insuranceapi-3o5t.onrender.com/api/add_home_condition`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status == 200) {
                            swal({
                                text: data.message,
                                type: "success",
                                icon: "success",
                                button: false
                            })
                            setTimeout(() => {
                                swal.close()
                                navigate('/Viewhomecondition')
                            }, 1000);

                        }

                        else if (data.status != 200) {
                            swal({
                                title: "Error!",
                                text: data.message,
                                type: "error",
                                icon: "error",
                                button: false
                            })
                            setTimeout(() => {
                                swal.close()
                                // navigate('/motor-make')
                            }, 1000);
                        }
                    });
            }

        }
        catch (err) {
            console.log(err)
        }

    }
    const addTableRows = () => {
        const rowsInput =
        {
            condition_label: '',
            // condition_description: '',
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
        console.log(value, "multiselect value")
        const rowsInput = [...rowsData];
        rowsInput[index][title] = value;
        setRowsData(rowsInput)
    }



    return (
        <div className="container">
            <div className="row" >
                <div className="col-md-12" >
                    <div className="card" >
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-12">
                                    <h4 className="card-title">Add Home Condition</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body addmotorplans" style={{ overflowX: 'scroll' }}>
                            <table className="table table-bordered" style={{ width: "auto" }}>
                                <thead>
                                    <tr>
                                        <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                        <th>Condition Label</th>
                                        {/* <th>Condition Description</th> */}
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
                                                        <input type="text" onChange={(evnt) => (handleChange(index, evnt))} className="form-control" name="condition_label" placeholder="Condition Label" autoComplete="off" required />

                                                    </td>
                                                    {/* <td>
                                                        <select className="form-control" name="condition_description" required onChange={(evnt) => (handleChange(index, evnt))}>
                                                            <option value="" hidden>Select Condition Description</option>
                                                            <option value="1">Yes</option>
                                                            <option value="0">No</option>
                                                        </select>

                                                    </td> */}

                                                    <td>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={location}
                                                            displayValue="label"
                                                            onSelect={(evnt) => (handleChange1(index, evnt, 'location'))}
                                                            onRemove={(evnt) => (handleChange1(index, evnt, 'location'))}
                                                            placeholder="Select Location"
                                                            showCheckbox={true}
                                                            closeOnSelect={false}
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

export default Addhomecondition