import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";
import Select from 'react-select';
import Swal from 'sweetalert2';

const AddMotormodeldetails = () => {
    const navigate = useNavigate();
    const [motor_model, setMotormodel] = useState([]);
    const [make_motor, setMakeMotor] = useState([]);
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [motor_model_detail_name, setMotorModelDetailName] = useState('');
    const [motor_model_detail_model_id, setMotorModelDetailModelId] = useState('');
    const [motor_model_detail_status, setMotorModelDetailStatus] = useState('');
    const [rowsData, setRowsData] = useState([])
    const [errors, setErrors] = useState({});
    const [bodytype, setBodytype] = useState([]);
    const [selected, setSelected] = useState(null)
    const [modelList, setModelList] = useState([]);
    // const [defaultmodelmotor,setDefaultModelMotor]= useState('')

    // const [state, setState] = useState({
    //     make_motor : '',
    // })

    useEffect(() => {

        getlistMotormodel();
        getlistMakeMotor();
        locationList();
        bodytypelist();
    }, [])

    const errormsg = {
        body_type: "Body Type",
        cylinder: "Cylinder",
        dep: "Depreciation Up To Years",
        location: "Location",
        max: "Max Car Value",
        max_dep: "Max Depreciation",
        min: "Min Car Value",
        min_dep: "Min Depreciation",
        motor_model_detail_id: "Motor Model",
        motor_model_detail_name: "Motor model Name",
        motor_model_make_id: "Make Motor",
        start_year: "Start Year"
    }





    const getlistMotormodel = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/get_model_motor_name', requestOptions)
            .then(response => response.json())
            .then(data => {
                setMotormodel(data.data);
            });
    }
    const getlistMakeMotor = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/getlistMakeMotor', requestOptions)
            .then(response => response.json())
            .then(data => {
                setMakeMotor(data.data);
            });
    }
    const bodytypelist = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/get_body_type_list', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data.data, ">>>>> body types")
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
                        if (!val && key != "discontinution_year") {
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
            console.log(rowsData, ">>>>>>>>>>rowsData")



            // const hasEmptyFields = rowsData.map((row) => {
            //     return row.motor_model_detail_name.trim() == '' || !row.motor_model_detail_id || row.start_year.trim() == '' || !row.body_type || !row.cylinder || row.min.trim() == '' || row.max.trim() == '' || row.dep.trim() == '' || row.min_dep.trim() == '' || row.max_dep.trim() == '' || row.discontinution_year.trim() == '' || !row.location;
            // });
            // console.log(hasEmptyFields,"empty feilds")
            // if (hasEmptyFields) {
            //     swal({
            //         title: "Warning!",
            //         text: "Please fill in all fields for each row.",
            //         type: "warning",
            //         icon: "warning"
            //     });
            //     return; // Exit the function if there are empty fields
            // }

            console.log(rowsData, ">>>>>>>>>>rowsData")

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rowsData)
            };

            fetch('https://insuranceapi-3o5t.onrender.com/api/add_Motor_model_details', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status == 200) {
                        swal({
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false
                        })
                        navigate('/ViewMotorModelDetails')
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
                        navigate('/AddMotorModelDetails')
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
            motor_model_detail_name: '',
            motor_model_detail_id: "",
            motor_model_make_id: make_motor[0]?._id,
            start_year: '',
            body_type: bodytype[0]?._id,
            cylinder: '',
            min: '',
            max: '',
            dep: '',
            min_dep: '',
            max_dep: '',
            discontinution_year: '',
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
        // if(name == "motor_model_detail_id"){
        //     setDefaultModelMotor(value)
        // }
        const rowsInput = [...rowsData]
        rowsInput[index][name] = value
        setRowsData(rowsInput)
    }
    const handleChange1 = (index, value, title) => {
        const rowsInput = [...rowsData];
        rowsInput[index][title] = value;
        setRowsData(rowsInput)
    }

    const handleMotorChange = (index, event) => {
        const modelmotor = event.target.value;
        console.log(modelmotor, ">>>>")
        const { name, value } = event.target
        const rowsInput = [...rowsData]
        rowsInput[index][name] = value
        setRowsData(rowsInput)
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/modelmotor/${modelmotor}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const motormodeldt = data.data;

                const motormodel_len = motormodeldt.length;
                // setDefaultModelMotor(motormodeldt[0]?._id)
                console.log(motormodeldt[0]?._id, ">>>>>>>>modelMotorid")
                const motormodel_list = [];
                for (let i = 0; i < motormodel_len; i++) {
                    const motormodel_obj = { label: motormodeldt[i].motor_model_name, value: motormodeldt[i]._id };
                    motormodel_list.push(motormodel_obj);
                }
                if (modelList.length > 0) {
                    const newModelist = [...modelList]
                    newModelist.splice(index, 1, motormodel_list)
                    setModelList(newModelist)
                }
                else {
                    const newModelist = [...modelList]
                    newModelist[index] = motormodel_list;
                    setModelList(newModelist)
                }
            });
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
                                            <th>Motor Model details</th>
                                            <th>Make Motor</th>
                                            <th>Motor Models</th>
                                            <th>Start Year</th>
                                            <th>Body Type</th>
                                            <th>Cylinder</th>
                                            <th>Min Car</th>
                                            <th>Max Car</th>
                                            <th>Depreciation up to years</th>
                                            <th>Min Depreciation up to years</th>
                                            <th>Max Depreciation up to years</th>
                                            <th>Discontinution Year</th>
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
                                                            <input type="text" onChange={(evnt) => (handleChange(index, evnt))} className="form-control" name="motor_model_detail_name" placeholder="Model Motor Name" autoComplete="off" />

                                                        </td>
                                                        <td>
                                                            <select className="form-control" defaultValue={make_motor[0]?._id} onChange={(evnt) => (handleMotorChange(index, evnt))} name="motor_model_make_id">
                                                                {make_motor?.map((item, indx) => {
                                                                    return (
                                                                        <option key={indx} value={item._id}>{item.make_motor_name}</option>

                                                                    )
                                                                })}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select className="form-control" onChange={(evnt) => (handleChange(index, evnt))} name="motor_model_detail_id">
                                                                <option hidden>Select Motor model</option>
                                                                {modelList[index]?.map((item, indx) => {
                                                                    return (
                                                                        <option key={indx} value={item.value}>{item.label}</option>
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
                                                                        <option selected={indx == 0 ? true : false} key={indx} value={item._id}>{item.body_type_name}</option>
                                                                    )
                                                                })}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select className="form-control" name="cylinder" onChange={(evnt) => (handleChange(index, evnt))}>
                                                                <option>Select Cylinder</option>
                                                                <option value="2">2</option>
                                                                <option value="4">4</option>
                                                                <option value="6">6</option>
                                                                <option value="8">8</option>
                                                                <option value="10">10</option>
                                                                <option value="12">12</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input type="text" className="form-control" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Min" name="min" autoComplete="off" />
                                                        </td>
                                                        <td>
                                                            <input type="text" className="form-control" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Max" name="max" autoComplete="off" />
                                                        </td>
                                                        <td>
                                                            <input type="text" className="form-control" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Depreciation up to years" name="dep" autoComplete="off" />
                                                        </td>
                                                        <td>
                                                            <input type="text" className="form-control" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Min Depreciation up to years" name="min_dep" autoComplete="off" />
                                                        </td>
                                                        <td>
                                                            <input type="text" className="form-control" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Max Depreciation up to years" name="max_dep" autoComplete="off" />
                                                        </td>
                                                        <td>
                                                            <input type="text" className="form-control" onChange={(evnt) => (handleChange(index, evnt))} placeholder="Discontinution Year" name="discontinution_year" autoComplete="off" />
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

export default AddMotormodeldetails