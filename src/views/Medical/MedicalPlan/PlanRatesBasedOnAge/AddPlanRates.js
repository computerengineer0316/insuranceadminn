import Multiselect from 'multiselect-react-dropdown';
import React from 'react';
import { useState, useEffect } from 'react';
import { json, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const AddPlanRates = () => {
    const navigate = useNavigate();
    const [medical_plan_id, setMedicalPlanId] = useState('');
    const [planCategory, setPlanCategory] = useState([]);
    const [medicalEmrateData, setMedicalEmrateData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [TPAData, setTPAData] = useState([]);
    const [networkData, setNetworkData] = useState([]);



    const [rowsData, setRowsData] = useState([{
        name: '',
        TPA: '',
        coPayments: '',
        perioddayRange: "",
        perioddayRange_topup: "",
        coPayments: "",
        // LABCoPayments:"",
        emirateId: '',
        network: '',
        // planCatagoryId: '',
        medical_plan_id: medical_plan_id,
        ageRagne: '',
        malePrimium: '',
        femalePrimium: '',
        femaleMarridePrimium: '',
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
            medicalEmrate()
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
            name: lastitm?.name,
            TPA: lastitm?.TPA,
            perioddayRange: lastitm?.perioddayRange,
            perioddayRange_topup: lastitm?.perioddayRange_topup,
            // PharmacyCoPayments: lastitm?.PharmacyCoPayments,
            emirateId: lastitm?.emirateId,
            coPayments: lastitm?.coPayments,
            network: lastitm?.network,
            // planCatagoryId: lastitm?.planCatagoryId,
            medical_plan_id: lastitm?.medical_plan_id,
            ageRagne: lastitm?.ageRagne,
            malePrimium: lastitm?.malePrimium,
            femalePrimium: lastitm?.femalePrimium,
            femaleMarridePrimium: lastitm?.femaleMarridePrimium,
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
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getPlanCategory`, requestOptions)
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
                setNetworkData(data.data)
                const rowsInput = [...rowsData]
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
                console.log("setTPADatal>>>>>>>>>>>>>>>>>>>>>>>>", data.data)

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
                console.log("networkDatasetTPADatalllllllllllllllllllllllll", data.data)

            })
    }
    const addRatePrimium = async () => {
        //     let result
        //     let checkStr = async (str, name) => {
        //         console.log("strkkkkkkkkkkkkkkkkkkkkk",{str,name})
        //       if (!str) {
        //         swal({
        //           title: `${name} is Empty`,
        //           text: 'Error',
        //           icon: 'Error',
        //           button: 'ok',
        //         })
        //         return false
        //       }
        //       return true
        //     }
        //     let checkArr = async (arr, name) => {
        //       if (!arr.length) {
        //         swal({
        //           title: `${name} is Empty}`,
        //           text: 'Error',
        //           icon: 'Error',
        //           button: 'ok',
        //         })
        //         return false
        //       }
        //     }
        //     result = await checkStr(rowsData.name, 'Name')
        //     if (!result) {
        //       return false
        //     }
        //     result = await checkStr(rowsData.network, 'network')
        //     if (!result) {
        //       return false
        //     }
        //     result = await checkStr(rowsData.network, 'network')
        //     if (!result) {
        //       return false
        //     }
        //     result = await checkStr(rowsData.network, 'Plan Category')
        //     if (!result) {
        //       return false
        //     }
        //     result = await checkArr(rowsData.network, 'Emirate')
        //     if (!result) {
        //       return false
        //     }

        // //     if(!rowsData.network){
        // //         swal({
        // //             title: "Please select Network",
        // //             text: "Error",
        // //         icon: "Error",
        // //         button:"ok"

        // //     })
        // //     return false
        // // }
        var requestOptions = {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rowsData),
        };

        fetch("https://insuranceapi-3o5t.onrender.com/api/add_rates_based_on_age", requestOptions)
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
                        navigate(`/ViewRatesBasedOnAge?id=${medical_plan_id}`)
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
                        // navigate('/ViewPlanPrice?id=' + travel_plan_id)
                    }, 1000);

                }
            })
            .catch(error => console.log('error', error));
    }

    const medicalEmrate = () => {
        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }

        fetch('https://insuranceapi-3o5t.onrender.com/api/getAreaOfRegistrations', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                let data = result.data;
                const emirateArray = [];
                for (let i = 0; i < data.length; i++) {
                    const obj = { label: data[i].area_of_registration_name, value: data[i]._id };
                    emirateArray.push(obj);
                }
                setMedicalEmrateData(emirateArray)
            })
            .catch((error) => console.log('error', error))
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h4 className="card-title">Add Rates Based On Age</h4>
                                </div>
                                <div className='col-md-6'>
                                    <a href={`/ViewRatesBasedOnAge?id=${medical_plan_id}`} className="btn btn-primary" style={{ float: "right" }}>Back</a>
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
                                                    <label>name</label>
                                                    <input
                                                        onChange={(evnt) => handleChange(index, evnt)}
                                                        type="text" name="name" className="form-control"
                                                        defaultValue={rowsData[index].name}
                                                        placeholder="Enter " required />
                                                </div>
                                            </div>
                                            {/* <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label>Plan Category</label>
                                                <select required className="form-control"  onChange={(evnt) => handleChange(index, evnt)} name="planCatagoryId" defaultValue={rowsData[index].planCatagoryId} >
                                                    <option value="">Select Plan Category</option>
                                                    {
                                                        planCategory.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item._id}>{item.plan_category_name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div> */}
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>TPA</label>
                                                    <select required className="form-control" onChange={(evnt) => handleChange(index, evnt)} name="TPA" defaultValue={rowsData[index].TPA} >
                                                        <option value="">Select TPA</option>
                                                        {
                                                            TPAData.map((item, index) => {
                                                                return (
                                                                    <option key={index} value={item._id}>{item.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Network</label>
                                                    <select required className="form-control" onChange={(evnt) => handleChange(index, evnt)} name="network" defaultValue={rowsData[index].network} >
                                                        <option value="">Select network</option>
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
                                        </div>
                                        <div className='row'>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Age Ragne</label>
                                                    <input
                                                        onChange={(evnt) => handleChange(index, evnt)}
                                                        type="text" name="ageRagne" className="form-control"
                                                        defaultValue={rowsData[index].ageRagne}
                                                        placeholder="0-10,11-20" required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Emirates Issuing Visa</label>
                                                    <Multiselect
                                                        options={medicalEmrateData}
                                                        selectedValues={rowsData[index].emirateId}
                                                        onSelect={(evnt) => (handleChange123(index, evnt, 'emirateId'))}
                                                        onRemove={(evnt) => (handleChange123(index, evnt, 'emirateId'))}
                                                        displayValue="label"
                                                        placeholder="Select Region"
                                                        closeOnSelect={false}
                                                        avoidHighlightFirstOption={true}
                                                        showCheckbox={true}
                                                        showArrow={true}
                                                        style={{ chips: { background: "#007bff" } }}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                        <div className='row'>
                                            <div className="col-md-12">
                                                <div className="form-group mb-3">
                                                    <label>Co-Payment</label>
                                                    <textarea
                                                        onChange={(evnt) => handleChange(index, evnt)}
                                                        type="text" name="coPayments" className="form-control"
                                                        defaultValue={rowsData[index].coPayments}
                                                        placeholder="Enter Co-Payment" required />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>

                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Male Primium</label>
                                                    <input
                                                        onChange={(evnt) => handleChange(index, evnt)}
                                                        type="text" name="malePrimium" className="form-control"
                                                        defaultValue={rowsData[index].malePrimium}
                                                        placeholder="5000,6000" required />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Female Primium</label>
                                                    <input
                                                        onChange={(evnt) => handleChange(index, evnt)}
                                                        type="text" name="femalePrimium" className="form-control"
                                                        defaultValue={rowsData[index].femalePrimium}
                                                        placeholder="5000,6000" required />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Female(Marride) Primium</label>
                                                    <input
                                                        onChange={(evnt) => handleChange(index, evnt)}
                                                        type="text" name="femaleMarridePrimium" className="form-control"
                                                        defaultValue={rowsData[index].femaleMarridePrimium}
                                                        placeholder="5000,6000" required />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Period Days Range </label>
                                                    <input
                                                        onChange={(evnt) => handleChange(index, evnt)}
                                                        type="text" name="perioddayRange" className="form-control"
                                                        defaultValue={rowsData[index].perioddayRange}
                                                        placeholder="10-20,20-30" />
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Topup</label>
                                                    <input
                                                        onChange={(evnt) => handleChange(index, evnt)}
                                                        type="text" name="perioddayRange_topup" className="form-control"
                                                        defaultValue={rowsData[index].perioddayRange_topup}
                                                        placeholder="0,10,20" />
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
                                    <button onClick={() => addRatePrimium()} className="btn btn-primary mt-2" style={{ float: "right" }}>Submit</button>
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
