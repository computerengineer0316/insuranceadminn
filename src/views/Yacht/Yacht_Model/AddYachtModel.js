import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";
import Select from 'react-select';
import Swal from 'sweetalert2';

const AddYachtModel = () => {
    const navigate = useNavigate();
    const [yacht_make, setYachtMake] = useState([]);
    const [location, setLocation] = useState([]);
    const [rowsData, setRowsData] = useState([])
    const [errors, setErrors] = useState({});
    const [bodytype, setBodytype] = useState([]);
    const [selected, setSelected] = useState(null)
    const [modelList, setModelList] = useState([]);

    useEffect(() => {
        getlistYachtMake();
        locationList();
        bodytypelist();
    }, [])

    const errormsg = {
        name: "Model Name",
        MakeId: "Make Name",
        start_year: "Start Year",
        body_type: "Body Type",
        engine: "Engine",
        minValue: "Min Value",
        maxValue: "Max Value",
        Mindep: "Min Depreciation",
        maxDep: "Max Depreciation",
        noOfDep: "Depreciation Up To Years",
        location: "Location",
    }
    const getlistYachtMake = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/getYachtMake', requestOptions)
            .then(response => response.json())
            .then(data => {
                setYachtMake(data.data);
            });
    }
    const bodytypelist = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/get_Yacht_Body_type', requestOptions)
            .then(response => response.json())
            .then(data => {
                setBodytype(data.data);
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
            for (let i = 0; i < rowsData.length; i++) {
                for (const key in rowsData[i]) {
                    if (rowsData[i].hasOwnProperty(key)) {
                        const val = rowsData[i][key]
                        if (val == "" || val == null || val == undefined) {
                            Swal.fire({
                                title: 'warning',
                                text: `${errormsg[key]}  is required`,
                                icon: 'warning',
                                confirmButtonText: 'Ok'
                            })
                            return;
                        } else {
                            continue;
                        }
                    }
                }
            }
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rowsData)
            };

            fetch('https://insuranceapi-3o5t.onrender.com/api/add_Yacht_model', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status == 200) {
                        swal({
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false
                        })
                        navigate('/ViewYachtModel')
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
                        navigate('/ViewYachtModel')
                        setTimeout(() => {
                            swal.close()
                        }, 1000);

                    }
                });
        } catch (error) {
            console.log(error)
        }

    }
    const addTableRows = () => {
        const rowsInput =
        {
            name: '',
            MakeId: yacht_make[0]?._id,
            start_year: '',
            body_type: bodytype[0]?._id,
            engine: '',
            minValue: '',
            maxValue: '',
            Mindep: '',
            maxDep: '',
            noOfDep: '',
            location: location,

        }
        setRowsData([...rowsData, rowsInput])
    }
    const deleteTableRows = (index) => {
        const rows = [...rowsData]
        const modelListData = [...modelList]
        modelListData.splice(index, 1)
        rows.splice(index, 1)
        setRowsData(rows)
        setModelList(modelListData)

    }
    const handleChange = (index, evnt) => {
        const { name, value } = evnt.target
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
        <>

            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Add Motor Model details</h4>
                            </div>
                            <div className="card-body addmotorplans" style={{ overflowX: 'scroll' }}>
                                <table className="table table-bordered" style={{ width: "1700px" }}>
                                    <thead>
                                        <tr>
                                            <th><button className="btn btn-outline-success" onClick={addTableRows}>+</button></th>
                                            <th>Yacht Model Name</th>
                                            <th>Yacht Make</th>
                                            <th>Start Year</th>
                                            <th>Body Type</th>
                                            <th>Engine</th>
                                            <th>Min Value</th>
                                            <th>Max Value</th>
                                            <th>Min Depreciation</th>
                                            <th>Max Depreciation</th>
                                            <th>No. Of Depreciation</th>
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
                                                            <input type="text" onChange={(evnt) => (handleChange(index, evnt))} className="form-control" name="name" placeholder="Yacht Model Name" autoComplete="off" />

                                                        </td>
                                                        <td>
                                                            <select className="form-control" defaultValue={yacht_make[0]?._id}
                                                                name="MakeId">
                                                                {yacht_make?.map((item, indx) => {
                                                                    return (
                                                                        <option key={indx} value={item._id}>{item.name}</option>

                                                                    )
                                                                })}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input type="text" className="form-control" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Start Year" name="start_year" autoComplete="off" />
                                                        </td>
                                                        <td>
                                                            <select className="form-control" onChange={(evnt) => (handleChange(index, evnt))} name="body_type">

                                                                {bodytype?.map((item, indx) => {
                                                                    return (
                                                                        <option selected={indx == 0 ? true : false} key={indx} value={item._id}>{item.yacht_body_type}</option>
                                                                    )
                                                                })}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select className="form-control" name="engine" onChange={(evnt) => (handleChange(index, evnt))}>
                                                                <option>Select Engine</option>
                                                                <option value="2">2</option>
                                                                <option value="4">4</option>
                                                                <option value="6">6</option>
                                                                <option value="8">8</option>
                                                                <option value="10">10</option>
                                                                <option value="12">12</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input type="text" className="form-control" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Min Value" name="minValue" autoComplete="off" />
                                                        </td>
                                                        <td>
                                                            <input type="text" className="form-control" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Max Value" name="maxValue" autoComplete="off" />
                                                        </td>
                                                        <td>
                                                            <input type="text" className="form-control" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Min Depreciation " name="Mindep" autoComplete="off" />
                                                        </td>
                                                        <td>
                                                            <input type="text" className="form-control" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Max Depreciation " name="maxDep" autoComplete="off" />
                                                        </td>
                                                        <td>
                                                            <input type="text" className="form-control" onChange={(evnt) => (handleChange(index, evnt))} placeholder="No. Of Depreciation " name="noOfDep" autoComplete="off" />
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

export default AddYachtModel