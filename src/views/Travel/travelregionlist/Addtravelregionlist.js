import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Container, Row } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';


function Addtravelregionlist() {
    const navigate = useNavigate();

    useEffect(() => {
        locationList();
        countrylist();

    }, [])

    const [travel_type, setTraveltype] = useState('')
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState();
    const [travel_type_status, setTraveltypestatus] = useState()
    const [rowsData, setRowsData] = useState([])
    const [errors, setErrors] = useState({});
    const [countrylistdata, setCountrylistdata] = useState([])
    const [true1, setTrue] = useState(false)
    useEffect(() => {

    }, [true1])

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
                return row.travel_region.trim() === '' || row.location == 0 || row.country == 0;
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

                fetch(`https://insuranceapi-3o5t.onrender.com/api/add_travel_region_list`, requestOptions)
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
                                navigate('/Viewtravelregionlist')
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
            travel_region: '',
            location: location,
            country: []

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
        if (name == "travel_region" && value == "worldwide") {
            setTrue(true)
            handleChange1(index, countrylistdata, 'country')
            rowsInput[index][name] = value


        }
        else {
            rowsInput[index][name] = value
            setRowsData(rowsInput)
        }
    }
    const handleChange1 = (index, value, title) => {
        console.log(value, "multiselect value")
        const rowsInput = [...rowsData];
        rowsInput[index][title] = value;
        setRowsData(rowsInput)
    }


    const countrylist = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getNationality`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    console.log(data.data, "countrylist")
                    setCountrylistdata(data.data)
                }
            });
    }




    return (
        <>

            <div className="container">
                <div className="row" >
                    <div className="col-md-12" >
                        <div className="card" >
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="card-title">Add Travel Region </h4>
                                    </div>
                                    <div className="col-md-6">
                                        <a href="/Viewtravelregionlist" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                                    </div>
                                </div>
                            </div>
                            {/* addmotorplans"  style={{overflowX:'scroll'}} */}
                            <div className="card-body" >
                                <div className="table-responsive">
                                    <table className=" table table-bordered addmotorplans" style={{ marginBottom: "100px" }}>
                                        <thead className="thead-dark">
                                            <tr className="table-info">
                                                <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                                <th>Travel Region </th>
                                                <th>Location</th>
                                                <th>Country</th>
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
                                                                <input type="text" onChange={(evnt) => (handleChange(index, evnt))} className="form-control" name="travel_region" placeholder="Travel Region" autoComplete="off" required />

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

                                                            <td>
                                                                <Multiselect
                                                                    options={countrylistdata} // Options to display in the dropdown
                                                                    selectedValues={true1 === true ? countrylistdata : []}
                                                                    displayValue="nationality_name" // Property name to display in the dropdown options
                                                                    onSelect={(evnt) => (handleChange1(index, evnt, 'country'))}
                                                                    onRemove={(evnt) => (handleChange1(index, evnt, 'country'))}
                                                                    placeholder="Select Country"
                                                                    showCheckbox={true}
                                                                    closeOnSelect={false}
                                                                    required
                                                                    searchable={true}
                                                                    showArrow={true}

                                                                />
                                                            </td>


                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
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

export default Addtravelregionlist