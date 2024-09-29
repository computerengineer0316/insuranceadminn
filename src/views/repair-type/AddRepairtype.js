import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Container, Row } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';

const AddRepairtype = () => {

    const navigate = useNavigate()
    useEffect(() => {
        locationList()
    }, [])


    const [selectedOption, setSelectedOption] = useState();
    const [repair_type_status, setRepairtypestatus] = useState('')

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

    // const addtravelcovertypelist = async (e) => {
    //   e.preventDefault();
    //   if (repair_type_name == '') {
    //     swal("Please Enter Repair Type", "", "warning");
    //     return false;
    //   } else if (selectedOption == undefined) {
    //     swal("Please Select Location", "", "warning");
    //     return false;
    //   }else if (repair_type_status == '') {
    //     swal("Please Select Status", "", "warning");
    //     return false;
    //   } 
    //   else {
    //   const repair_type_location = selectedOption;
    //   const repair_type_location_len = repair_type_location.length;
    //   const repair_type_location_str = [];
    //   for (let i = 0; i < repair_type_location_len; i++) {
    //       repair_type_location_str.push(repair_type_location[i].value);
    //   }
    //   let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/add_repair_type', {
    //     method: 'post',
    //     body: JSON.stringify({ repair_type_name: repair_type_name, 
    //       repair_type_location: repair_type_location_str.toString(),
    //       repair_type_status: repair_type_status }),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   })
    //   result = await result.json();
    //   swal("Added Succesfully", "", "success");
    //   console.log(result)
    //   navigate('/ViewRepairtype')
    // }
    // }

    const [rowsData, setRowsData] = useState([])
    const [errors, setErrors] = useState({});
    const [repair_type_name, setRepairtypename] = useState('')
    const [location, setLocation] = useState([]);

    const addTableRows = () => {
        const rowsInput =
        {
            repair_type_name: '',
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
        const rowsInput = [...rowsData];
        rowsInput[index][title] = value;
        setRowsData(rowsInput)
    }



    const addtravelcovertypelist = async (e) => {
        e.preventDefault();
        try {

            const hasEmptyFields = rowsData.some((row) => {
                return row.repair_type_name === '' || !row.location;
            }
            );

            if (hasEmptyFields) {
                swal({
                    title: "Warning!",
                    text: "Please fill in all fields for each row.",
                    type: "warning",
                    icon: "warning"
                });
                return false;
            }
            console.log(rowsData, "rowsData")

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rowsData)
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/add_repair_type`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status == 200) {
                        swal({
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false
                        })
                        navigate('/ViewRepairtype')
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
                        navigate('/ViewRepairtype')
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                });

        } catch (err) {
            console.log(err)
        }
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
                                        <h4 className="card-title">Add Repair Type</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body addmotorplans" style={{ overflowX: 'scroll' }}>
                                <table className="table table-bordered" style={{ width: "auto" }}>
                                    <thead>
                                        <tr>
                                            <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                            <th>Repair Type Name</th>
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
                                                            <input type="text" onChange={(evnt) => (handleChange(index, evnt))} className="form-control" name="repair_type_name" placeholder="Repair Type Name" autoComplete="off" required />

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
                                <button className="btn btn-outline-success" onClick={addtravelcovertypelist}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AddRepairtype