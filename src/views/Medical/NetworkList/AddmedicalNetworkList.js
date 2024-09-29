import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';

const AddmedicalNetworkList = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState([]);
    const [rowsData, setRowsData] = useState([{
        name: '',
        location: location,
        TPAID: "",
        planCategory: '',
        networkId: '',
    }])
    const [activeMedicalTPA, setactiveMedicalTPA] = useState([])
    const [defaultMedicalNetwork, setactiveMedicalNetwork] = useState([])
    const [errors, setErrors] = useState({});
    const [defaultPlancategories, setdefaultPlanCategories] = useState([])
    const [selectedPlan, setselectedPlan] = useState("")

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            locationList();
            activeMedicalTPAList()
            getAllPlanCategories()
            activeMedicalNetwork()
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
                handleChange1(0, locationdt, 'location')
            });
    }
    const getAllPlanCategories = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getAllPlanCategories`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setdefaultPlanCategories(data.data)
                setselectedPlan(data?.data?.[0]["_id"])
            });
    }
    const activeMedicalTPAList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/activeMedicalTPA`, requestOptions)
            .then(response => response.json())
            .then((data) => {

                setactiveMedicalTPA(data.data)
            });
    }
    const activeMedicalNetwork = (id) => {
        console.log("id>>>>>>>>>>>>>>>>>>>>>>>>>", id)
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getTpaLinkNetwork?tpaId=${id}`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                console.log('lllllllllllllllllllll', data.data)
                setactiveMedicalNetwork(data.data)
                // handleChange1(0, data.data, 'networkId')
            });
    }
    const getLinkListByTPAid = (id, index) => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getTpaLinkNetwork?tpaId=${id}`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                handleChange1(index, data.data, 'networkId')

            })
            .catch(error => console.log('error', error));
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        try {

            // return false


            const hasEmptyFields = rowsData.some((row) => {
                return row.name.trim() === '' || row.location.length === 0 || row.TPAID.length === 0
                    || row.planCategory === ''
                    || row.networkId.length === 0
            });

            if (hasEmptyFields) {
                swal({
                    title: "Warning!",
                    text: "Please fill in all fields for each row.",
                    type: "warning",
                    icon: "warning"
                });
                return; // Exit the function if there are empty fields
            } else {
                let payload = {}
                payload = rowsData.map((val) => {

                    return {
                        ...val,
                        location: val.location && val.location.length > 0 ? val.location.map(item => item?._id) : [],
                        networkId: val.networkId && val.networkId.length > 0 ? val.networkId.map(item => item?._id) : [],
                        // TPAID: val.TPAID && val.TPAID.length > 0 ? val.TPAID.map(item => item?._id) : [],
                    }

                })
                console.log("payload", payload)
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                };
                fetch('https://insuranceapi-3o5t.onrender.com/api/medicalNetworkList', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status == 201) {
                            swal({
                                text: data.message,
                                type: "success",
                                icon: "success",
                                button: false
                            })
                            navigate('/ViewmedicalNetworkList')
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


        }
        catch (error) {
            console.log(error);
        }
    }
    const addTableRows = () => {
        const rowsInput =
        {
            name: '',
            location: location,
            TPAID: "",
            planCategory: '',
            networkId: defaultMedicalNetwork,
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
        if (name === "TPAID") {
            getLinkListByTPAid(value, index)
        }
        rowsInput[index][name] = value
        setRowsData(rowsInput)
    }
    const handleChange1 = (index, value, title) => {
        const rowsInput = [...rowsData];
        rowsInput[index][title] = value;
        setRowsData(rowsInput)
    }
    console.log("rowsdata", rowsData)
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-12">
                                    <h4 className="card-title">Add Network List</h4>
                                </div>
                            </div>
                            <div className="card-body addmotorplans" style={{ overflowX: 'scroll' }}>
                                <table className="table table-bordered" style={{ width: "auto" }}>
                                    <thead>
                                        <tr>
                                            <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                            <th>Network Name</th>
                                            <th>Plan Categories</th>
                                            <th>Plan Administrator</th>
                                            <th>Networks</th>
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
                                                            <input type="text" onChange={(evnt) => (handleChange(index, evnt))} className="form-control" name="name" placeholder="Name" autoComplete="off" required />
                                                        </td>
                                                        <td>
                                                            <select name='planCategory' className="form-control" onChange={(evnt) => (handleChange(index, evnt))}>

                                                                {

                                                                    defaultPlancategories.length > 0 ? (<>
                                                                        <option value={""}>Select Plan Category</option>
                                                                        {
                                                                            defaultPlancategories.map((item) => (
                                                                                <option key={item._id} value={item._id}>{item.plan_category_name}</option>
                                                                            ))
                                                                        }
                                                                    </>) : <React.Fragment></React.Fragment>
                                                                }
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select name='TPAID' className="form-control" onChange={(evnt) => (handleChange(index, evnt))}>
                                                                {

                                                                    activeMedicalTPA.length > 0 ? (<React.Fragment>
                                                                        <option value={""}>Select TPA</option>
                                                                        {
                                                                            activeMedicalTPA.map((item) => (
                                                                                <option key={item._id} value={item._id}>{item.name}</option>
                                                                            ))
                                                                        }
                                                                    </React.Fragment>) : <React.Fragment></React.Fragment>
                                                                }
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <Multiselect
                                                                style={{ overflow: 'visible' }}
                                                                options={defaultMedicalNetwork}
                                                                selectedValues={rowsData[index]?.networkId}
                                                                displayValue="name"
                                                                onSelect={(evnt) => (handleChange1(index, evnt, 'networkId'))}
                                                                onRemove={(evnt) => (handleChange1(index, evnt, 'networkId'))}
                                                                placeholder="Select Network"
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
                                <button className="btn btn-outline-success" onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddmedicalNetworkList