import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from 'multiselect-react-dropdown';
const EditPlanRates = () => {
    const navigate = useNavigate();
    const [rateID, SetRateId] = useState('');
    const [planCategory, setPlanCategory] = useState([]);
    const [medicalEmrateData, setMedicalEmrateData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [PlanRatesValues, setPlanRatesValues] = useState([]);
    const [selectedLocationData, setSelectedLocationData] = useState([]);

    const [TPAData, setTPAData] = useState([]);
    const [networkData, setNetworkData] = useState([]);
    const [real_medical_plan_id, setRealMedicalPlanId] = useState('');





    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {

            let url = window.location.href;
            url = url.split("?")[1]
            let rateId = url.split("&")[0]
            let planId = url.split("&")[1]
            rateId = rateId.split("=")[1]
            planId = planId.split("=")[1]
            console.log("rateId", rateId, "planId", planId)


            SetRateId(rateId);
            setRealMedicalPlanId(planId)
            medicalEmrate()
            Plancategory()
            getLocationdata()
            planRatesDeltails(rateId)
            getNetworkData()
            getTPAData()
        }
    }, []);
    const [rowsData, setRowsData] = useState({})
    const getLinkListByTPAid = (id) => {
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

            })
            .catch(error => console.log('error', error));
    }
    const handleChange = (evnt) => {
        const { name, value } = evnt.target
        if (name === 'TPA') {
            getLinkListByTPAid(value)
        }
        rowsData[name] = value
        setRowsData(rowsData)
        console.log("valuelllllllllllllllllllllllrowsData", rowsData)

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
                setLocationData(locationArray)

            });
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

    const planRatesDeltails = (id) => {
        console.log('planRatesDeltails..................................insede')
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_group_med_single_rate?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setPlanRatesValues(data.data[0]);
                console.log(data.data[0], "this is data>>>>>>>>>>>>>>>>>>>>>>>>>> ")

                let selectedLocation = data.data[0]?.locationData
                let locationArray = []
                for (let i = 0; i < selectedLocation?.length; i++) {
                    locationArray.push({ label: selectedLocation[i].location_name, value: selectedLocation[i]._id })
                }

                setSelectedLocationData(locationArray)
                let payload = {}
                payload['policy_name'] = data.data[0]?.policy_name
                payload['TPA'] = data.data[0]?.TPA
                payload['coPayments'] = data.data[0]?.primiumArray
                payload['network'] = data.data[0]?.network
                payload['planCatagoryId'] = data.data[0]?.planCatagoryId
                payload['locationArray'] = data.data[0]?.locationArray


                setRowsData(payload)
                // SetRateId(data.data.rateID)
            });
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const policy_name = data.get('policy_name');
        const TPA = data.get('TPA');
        const network = data.get('network');
        const planCatagoryId = data.get("planCatagoryId")

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                policy_name,
                TPA,
                network,
                planCatagoryId,
                locationArray: selectedLocationData
            })

        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_group_medicalplan_rates?id=${rateID}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        type: "success",
                        icon: "success"
                    }).then(function () {
                        navigate(`/ViewGroupMedicalPlanPrice?id=${real_medical_plan_id}`);
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error"
                    }).then(function () {
                        navigate(`/ViewGroupMedicalPlanPrice?id=${real_medical_plan_id}`);
                    });
                }
            });
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Edit TPA/Network</h4>
                                </div>
                                <div className="col-md-6">
                                    <a
                                        href={`/ViewGroupMedicalPlanPrice?id=${real_medical_plan_id}`}
                                        className="btn btn-primary"
                                        style={{ float: 'right' }}
                                    >
                                        Back
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <form action="/" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Policy Name</label>
                                            <input
                                                type="text"
                                                name="policy_name"
                                                className="form-control"
                                                onChange={(event) => handleChange(event)}
                                                placeholder="Enter Age Range"
                                                defaultValue={PlanRatesValues?.policy_name}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>TPA</label>
                                            <select className="form-control" name='TPA' onChange={(event) => handleChange(event)}>
                                                <option hidden value="">Select TPA</option>
                                                {TPAData.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item._id} selected={rowsData?.TPA == item._id ? true : false}>
                                                            {item.name}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Plan Category</label>
                                            <select required className="form-control"
                                                name="planCatagoryId"
                                                defaultValue={PlanRatesValues.planCatagoryId} >
                                                <option hidden value="">Select Plan Category</option>
                                                {
                                                    planCategory.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item._id}>{item.category_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Network</label>
                                            <select className="form-control" name='network' onChange={(event) => handleChange(event)}>
                                                <option hidden value="">Select network</option>
                                                {networkData.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item._id} selected={rowsData?.network == item._id ? true : false || index == 0}>
                                                            {item.name}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Location</label>
                                            <Multiselect
                                                options={locationData}
                                                selectedValues={selectedLocationData}
                                                onSelect={(evnt) => setSelectedLocationData(evnt)}
                                                onRemove={(evnt) => setSelectedLocationData(evnt)}
                                                displayValue="label"
                                                placeholder="Select Location"
                                                closeOnSelect={false}
                                                avoidHighlightFirstOption={true}
                                                showCheckbox={true}
                                                showArrow={true}
                                                style={{ chips: { background: '#007bff' } }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <button
                                            type="submit"
                                            className="btn btn-primary mt-2"
                                            style={{ float: 'right' }}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditPlanRates
