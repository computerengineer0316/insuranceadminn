import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row } from 'react-bootstrap'
import Multiselect from 'multiselect-react-dropdown';
import swal from 'sweetalert'

function Addtravelplantype() {

    const navigate = useNavigate();

    useEffect(() => {
        locationList();

    }, [])

    const [travel_type, setTraveltype] = useState('')
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState();
    const [travel_type_status, setTraveltypestatus] = useState()
    const [rowsData, setRowsData] = useState([])
    const [errors, setErrors] = useState({});


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

        try {
            const hasEmptyFields = rowsData.some((row) => {
                return row.travel_plan_type.trim() === '' || row.location == 0;
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
                console.log(rowsData, "rowsData")

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(rowsData)
                };

                fetch(`https://insuranceapi-3o5t.onrender.com/api/add_travel_plan_type`, requestOptions)
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
                                navigate('/Viewtravelplantype')
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
            travel_plan_type: '',
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
        <>

            <div className="container">
                <div className="row" >
                    <div className="col-md-12" >
                        <div className="card" >
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h4 className="card-title">Add Travel Plan Type </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body addmotorplans" style={{ overflowX: 'scroll' }}>
                                <table className="table table-bordered" style={{ width: "auto" }}>
                                    <thead>
                                        <tr>
                                            <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                            <th>Travel Plan Type </th>
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
                                                            <input type="text" onChange={(evnt) => (handleChange(index, evnt))} className="form-control" name="travel_plan_type" placeholder="Travel Plan Type" autoComplete="off" required />

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

        </>
    )
}

export default Addtravelplantype