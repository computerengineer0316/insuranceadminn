import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Container, Row } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';

const AddBusinesstype = () => {

    const navigate = useNavigate()
    useEffect(() => {
        locationList()
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
                const location_len = locationdt.length;
                const location_list = [];
                for (let i = 0; i < location_len; i++) {
                    const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
                    location_list.push(location_obj);
                }
                setLocation(location_list);
            });
    }

    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   if (business_type_name == '') {
    //     swal("Please Enter Repair Type", "", "warning");
    //     return false;
    //   } else if (selectedOption == undefined) {
    //     swal("Please Select Location", "", "warning");
    //     return false;
    //   }
    //   else {
    //   const business_type_location = selectedOption;
    //   const business_type_location_len = business_type_location.length;
    //   const business_type_location_str = [];
    //   for (let i = 0; i < business_type_location_len; i++) {
    //       business_type_location_str.push(business_type_location[i].value);
    //   }
    //   let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/add_business_type', {
    //     method: 'post',
    //     body: JSON.stringify({ business_type_name: business_type_name, 
    //       business_type_location: business_type_location_str.toString(),

    //     }),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   })
    //   result = await result.json();
    //   swal("Added Succesfully", "", "success");
    //   console.log(result)
    //   navigate('/Viewbusinesstype')
    // }
    // }

    const handleSubmit = () => {

        try {

            const hasEmptyFields = rowsData.some((row) => {
                return row.business_type_name.trim() === '' || row.location.length == 0;
            });

            if (hasEmptyFields) {
                // Display an error message or handle the validation error as needed
                swal({
                    title: "Warning!",
                    text: "Please fill in all fields for each row.",
                    type: "warning",
                    icon: "warning"
                });
                return; // Exit the function if there are empty fields
            }


            console.log(rowsData)
            // return false;


            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rowsData)
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/add_business_type`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status == 200) {
                        swal({
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false
                        })
                        navigate('/ViewBusinesstype')
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
                        navigate('/ViewBusinesstype')
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



    const [business_type_name, setBusinesstypename] = useState('')
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState();
    const [rowsData, setRowsData] = useState([])
    const [errors, setErrors] = useState({});

    const addTableRows = () => {
        const rowsInput =
        {
            business_type_name: '',
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


    return (
        <>

            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h4 className="card-title">Add Business Type</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body addmotorplans" style={{ overflowX: 'scroll' }}>
                                <table className="table table-bordered" style={{ width: "auto" }}>
                                    <thead>
                                        <tr>
                                            <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                            <th>Business Type Name</th>
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
                                                            <input type="text" onChange={(evnt) => (handleChange(index, evnt))} className="form-control" name="business_type_name" placeholder="Business Type Name" autoComplete="off" required />

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

        </>
    )
}

export default AddBusinesstype