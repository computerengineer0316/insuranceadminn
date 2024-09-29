import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';

const Addmedicalsalaryrange = () => {
    const navigate = useNavigate();

    const [location, setLocation] = useState([]);
    const [rowsData, setRowsData] = useState([])
    const [visaCountry, setVisaCountry] = useState([])
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            locationList();
            getMedVisaCountry();
        }
    }, [])



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
    const getMedVisaCountry = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_area_of_registration`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const visac = data.data;
                console.log("data", visac)
                setVisaCountry(visac);
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        try {


            const hasEmptyFields = rowsData.some((row) => {
                return row.salary_range.trim() === '' || row.location.length === 0;
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
            fetch('https://insuranceapi-3o5t.onrender.com/api/add_medical_salary_range', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status == 200) {
                        swal({
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false
                        })
                        navigate('/Viewmedicalsalaryange')
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
            salary_range: '',
            medical_visa_country: '',
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
                                    <h4 className="card-title">Add Medical Salary Range</h4>
                                </div>
                            </div>
                            <div className="card-body addmotorplans" style={{ overflowX: 'scroll' }}>
                                <table className="table table-bordered" style={{ width: "auto" }}>
                                    <thead>
                                        <tr>
                                            <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                            <th>Salary Range</th>
                                            <th>Emirates Visa</th>
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
                                                            <input type="text" onChange={(evnt) => (handleChange(index, evnt))} className="form-control" name="salary_range" placeholder="Medical Salary Range" autoComplete="off" required />

                                                        </td>
                                                        <td>
                                                            <Multiselect
                                                                style={{ overflow: 'visible' }}
                                                                options={visaCountry}
                                                                // selectedValues={location}
                                                                displayValue="area_of_registration_name"
                                                                onSelect={(evnt) => (handleChange1(index, evnt, 'medical_visa_country'))}
                                                                onRemove={(evnt) => (handleChange1(index, evnt, 'medical_visa_country'))}
                                                                placeholder="Select Visa Emirate"
                                                                showCheckbox={true}
                                                                required
                                                            />
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
                                <button disabled={!rowsData.length} className="btn btn-outline-success" onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Addmedicalsalaryrange