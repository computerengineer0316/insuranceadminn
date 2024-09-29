import React from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const AddPlanRates = () => {
    const navigate = useNavigate();
    const [medical_plan_id, setMedicalPlanId] = useState('');
    const [planCategory, setPlanCategory] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [TPAData, setTPAData] = useState([]);
    const [networkData, setNetworkData] = useState([]);


    const [rowsData, setRowsData] = useState([{
        policy_name: '',
        TPA: '',
        network: '',
        planCatagoryId: '',
        medical_plan_id: medical_plan_id,
        locationArray: locationData

    }])
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            const url = window.location.href;
            const url1 = url.split("/")[3];
            const url2 = url1.split("?")[1];
            const id = url2.split("=")[1];
            setMedicalPlanId(id);
            Plancategory()
            getLocationdata()
            getTPAData()
            getNetworkData()
        }
    }, []);
    const addTableRows = () => {
        const lastitm = rowsData[rowsData.length - 1];
        const rowsInput =
        {
            policy_name: lastitm?.policy_name,
            TPA: lastitm?.TPA,
            network: lastitm?.network,
            planCatagoryId: lastitm?.planCatagoryId,
            medical_plan_id: lastitm?.medical_plan_id,
            locationArray: lastitm?.locationArray

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
        if (name == "TPA") {
            getLinkListByTPAid(value, index)
        }
        const rowsInput = [...rowsData]
        rowsInput[index][name] = value
        rowsInput[index]["medical_plan_id"] = medical_plan_id

        setRowsData(rowsInput)
    }
    const handleChange123 = (index, value, title) => {
        const rowsInput = [...rowsData];
        rowsInput[index][title] = value;
        setRowsData(rowsInput)
    }
    const Plancategory = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getGroupMedicalCategory`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setPlanCategory(data.data);
            });
    }

    const getLocationdata = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
            .then(response => response.json())
            .then(result => {
                let data = result.data;
                const locationArray = [];
                for (let i = 0; i < data?.length; i++) {
                    const obj = { label: data[i].location_name, value: data[i]._id };
                    locationArray.push(obj);
                }
                const rowsInput = [...rowsData]
                rowsInput[0]["locationArray"] = locationArray
                setRowsData(rowsInput)
                setLocationData(locationArray)

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
                let rowsInput = [...rowsData]
                rowsInput[index]["network"] = data.data[0]._id
                setRowsData(rowsInput)
            })
            .catch(error => console.log('error', error));
    }

    const getTPAData = () => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch("https://insuranceapi-3o5t.onrender.com/api/activeMedicalTPA", requestOptions)
            .then(response => response.json())
            .then((data) => {
                setTPAData(data.data)

            })
    }
    const getNetworkData = () => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch("https://insuranceapi-3o5t.onrender.com/api/activeMedicalNetwork", requestOptions)
            .then(response => response.json())
            .then((data) => {
                setNetworkData(data.data)
            })
    }
    const addRatePrimium = async () => {
        var requestOptions = {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rowsData),
        };

        fetch("https://insuranceapi-3o5t.onrender.com/api/add_Group_Medical_Plan_rates", requestOptions)
            .then(response => response.json())
            .then(result => {
                let data = result
                if (data.status == 201) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false
                    })
                    setTimeout(() => {
                        swal.close()
                        navigate(`/ViewGroupMedicalPlanPrice?id=${medical_plan_id}`)
                    }, 1000);
                } else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error",
                        button: false
                    })
                    setTimeout(() => {
                        swal.close()
                        // navigate('/ViewGroupMedicalPlanPrice?id=' + travel_plan_id)
                    }, 1000);

                }
            })
            .catch(error => console.log('error', error));
    }


    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h4 className="card-title">Add TPA/Network</h4>
                                </div>
                                <div className='col-md-6'>
                                    <a href={`/ViewGroupMedicalPlanPrice?id=${medical_plan_id}`} className="btn btn-primary" style={{ float: "right" }}>Back</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            {/* ////////////////////////////////// */}
                            <button className="btn btn-outline-success my-1" onClick={addTableRows}>+</button>
                            {/* <form action="/" method="POST" onSubmit={()=>handleSubmit()}> */}
                            {rowsData?.map((item, index) => {
                                return (
                                    <div className="row mb-3" key={index}>
                                        <div className='row'>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Policy Name</label>
                                                    <input
                                                        onChange={(evnt) => handleChange(index, evnt)}
                                                        type="text" name="policy_name" className="form-control"
                                                        defaultValue={rowsData[index].policy_name}
                                                        placeholder="Enter " required />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Plan Category</label>
                                                    <select required className="form-control" onChange={(evnt) => handleChange(index, evnt)}
                                                        name="planCatagoryId"
                                                        defaultValue={rowsData[index].planCatagoryId} >
                                                        <option hidden value="">Select Plan Category</option>
                                                        {
                                                            planCategory.map((item, indx) => {
                                                                return (
                                                                    <option key={indx} value={item._id}>{item.category_name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>TPA</label>
                                                    <select required className="form-control" onChange={(evnt) => handleChange(index, evnt)} name="TPA" defaultValue={rowsData[index].TPA} >
                                                        <option hidden value="">Select TPA</option>
                                                        {
                                                            TPAData.map((item, indx) => {
                                                                return (
                                                                    <option key={indx} value={item._id}>{item.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>


                                        </div>

                                        <div className='row'>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Network</label>
                                                    <select required className="form-control" onChange={(evnt) => handleChange(index, evnt)} name="network" defaultValue={rowsData[index].network} >
                                                        <option hidden value="">Select network</option>
                                                        {
                                                            networkData.map((item, index) => {
                                                                return (
                                                                    <option key={index} selected={index === 0} value={item._id}>{item.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Location</label>
                                                    <Multiselect
                                                        options={locationData}
                                                        selectedValues={locationData}
                                                        onSelect={(evnt) => (handleChange123(index, evnt, 'locationArray'))}
                                                        onRemove={(evnt) => (handleChange123(index, evnt, 'locationArray'))}
                                                        displayValue="label"
                                                        placeholder="Select Location"
                                                        closeOnSelect={false}
                                                        avoidHighlightFirstOption={true}
                                                        showCheckbox={true}
                                                        showArrow={true}
                                                        style={{ chips: { background: "#007bff" } }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 my-2">
                                            <div className="btn btn-outline-danger" style={{ float: "right" }} onClick={() => (deleteTableRows(index))}>x</div>
                                        </div>
                                        <hr style={{ borderTop: '2px solid #111' }}></hr>
                                    </div>

                                )
                            })

                            }
                            <div className="row">
                                <div className="col-md-12">
                                    <button disabled={!rowsData.length ? true : false} onClick={() => addRatePrimium()} className="btn btn-primary mt-2" style={{ float: "right" }}>Submit</button>
                                </div>
                            </div>
                            {/* ///////////////////////////////// */}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AddPlanRates
