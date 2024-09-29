import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';

const AddTatDays = () => {
    const navigate = useNavigate();

    const [rowsData, setRowsData] = useState([]);
    const [location, setLocation] = useState([]);

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

    const addTableRow = () => {
        setRowsData([...rowsData, { tatdays: '', location: [] }]);
    }

    const deleteTableRow = (index) => {
        const updatedRowsData = [...rowsData];
        updatedRowsData.splice(index, 1);
        setRowsData(updatedRowsData);
    }

    const handleChange = (index, fieldName, value) => {
        console.log('index:', index, 'fieldName:', fieldName, 'value:', value);
        const updatedRowsData = [...rowsData];
        updatedRowsData[index][fieldName] = value;
        setRowsData(updatedRowsData);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('rowsData:', rowsData);

        const hasEmptyFields = rowsData.some(row => row.tatdays.trim() === '' || row.location.length === 0);
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
            const response = await fetch(`https://insuranceapi-3o5t.onrender.com/api/createtatdays`, requestOptions);
            const data = await response.json();
            if (data.status == 201) {
                swal({
                    text: data.message,
                    icon: "success"
                });
                navigate('/TatView');
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
                                    <h4 className="card-title">Add Tat dats</h4>
                                </div>
                                <div className="col-md-6">
                                    <Link to="/TatView" className="btn btn-primary" style={{ float: 'right' }}>Back</Link>
                                </div>
                            </div>
                        </div>
                        <div className="card-body addmotorplans">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th><button className="btn btn-outline-success" onClick={addTableRow}>+</button></th>
                                        <th>TAT Days</th>
                                        <th>Location</th>
                                        <th>Claim Type</th>
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
                                                    name='tatdays'
                                                    placeholder="Enter Tat Days"
                                                    required
                                                    onChange={(evnt) => (handleChange(index, 'tatdays', evnt.target.value))}
                                                />
                                            </td>
                                            <td>
                                                <Multiselect
                                                    options={location}
                                                    selectedValues={row.location}
                                                    displayValue="label"
                                                    onSelect={(selectedList) => handleChange(index, 'location', selectedList)}
                                                    onRemove={(selectedList) => handleChange(index, 'location', selectedList)}
                                                    placeholder="Select Location"
                                                    showCheckbox={true}
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <select className="form-control" name='claimtype' required onChange={(evnt) => (handleChange(index, 'claimtype', evnt.target.value))}>
                                                    <option value="" hidden>Select Claim Type</option>
                                                    <option value="cashless">Cashless</option>
                                                    <option value="reimbursement">Reimbursement</option>
                                                </select>
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

export default AddTatDays;
