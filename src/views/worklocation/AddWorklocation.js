import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';

const AddWorklocation = () => {
    const navigate = useNavigate();

    const [rowsData, setRowsData] = useState([]);
    const [location, setLocation] = useState([]);
    const [errors, setErrors] = useState({});


    useEffect(() => {
        locationList();
    }, []);

    const locationList = () => {
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`)
            .then(response => response.json())
            .then(data => {
                const location_list = data.data.map(location => ({
                    label: location.location_name,
                    value: location._id
                }));
                setLocation(location_list);

            })
            .catch(error => console.error('Error fetching locations:', error));
    }

    // const addTableRow = () => {
    //     setRowsData([...rowsData, { worklocation: '', location: [] }]);
    // }

    const addTableRow = () => {
        const rowsInput =
        {
            worklocation: '',
            location: location,

        }
        setRowsData([...rowsData, rowsInput])
    }

    const deleteTableRow = (index) => {
        const updatedRowsData = [...rowsData];
        updatedRowsData.splice(index, 1);
        setRowsData(updatedRowsData);
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('rowsData:', rowsData);

        const hasEmptyFields = rowsData.some(row => row.worklocation.trim() === '' || row.location == 0);
        if (hasEmptyFields) {
            swal({
                title: "Warning!",
                text: "Please fill in all fields for each row.",
                type: "warning",
                icon: "warning"
            });
            return;
        }

        try {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rowsData)
            };
            const response = await fetch(`https://insuranceapi-3o5t.onrender.com/api/addworklocation`, requestOptions);
            const data = await response.json();
            if (data.status == 200) {
                swal({
                    text: data.message,
                    icon: "success"
                });
                navigate('/ViewWorkLocation');
            }
            else if (data.status == 403) {
                swal({
                    text: data.message,
                    icon: "warning"
                });
            }
            else {
                swal({
                    text: data.message,
                    icon: "error"
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="container mb-5">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Add Work Location </h4>
                                </div>
                                <div className="col-md-6">
                                    <Link to="/ViewWorkLocation" className="btn btn-primary" style={{ float: 'right' }}>Back</Link>
                                </div>
                            </div>
                        </div>
                        <div className="card-body addmotorplans">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th><button className="btn btn-outline-success" onClick={addTableRow}>+</button></th>
                                        <th>Work Location</th>
                                        <th>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rowsData.map((row, index) => (
                                        <tr key={index}>
                                            <td>
                                                <button className="btn btn-outline-danger" onClick={() => (deleteTableRow(index))}>x</button>
                                            </td>
                                            <td>
                                                <input
                                                    type='text'
                                                    className="form-control"
                                                    name='worklocation'
                                                    placeholder="Enter Sponsor Type"
                                                    required
                                                    onChange={(evnt) => (handleChange(index, evnt))}
                                                />
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-outline-success" style={{ float: "right" }} onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddWorklocation;


