import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Multiselect from "multiselect-react-dropdown";

const EditTravelPlan = () => {
    const navigate = useNavigate();
    const [companyList, setCompanyList] = useState([]);
    const [TravelInsuranceFor, setTravelInsuranceFor] = useState([]);
    const [travel_cover_type, setTravelCoverType] = useState([]);
    const [natureOfPlan, setNatureOfPlan] = useState([]);
    const [TravelType, setTravelType] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [Country, setCountry] = useState('');
    const [CountryTopup, setCountryTopup] = useState('');
    const [add_op_con_desc, setAddopcondesc] = useState('');
    const [add_op_con_desc_topup, setAddopcondesctopup] = useState('');
    const [vat, setVat] = useState('');
    const [travel_plan_id, setTravelPlanId] = useState('');
    const [rowsData, setRowsData] = useState([]);
    const [defaultlocation, setDefaultLocation] = useState([]);
    const [location, setLocation] = useState([]);
    const [errmsg, setErrmsg] = useState({
        status: false,
        name: '',
    })



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
            setTravelPlanId(id);
            company_list();
            travel_insurance_for();
            travel_cover_type_list();
            NatureOfPlan();
            TravelTypeList();
            country_list();
            locationList();
            travel_plan_details(id);
        }
    }, [])

    const company_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/company_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setCompanyList(data.data);
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
                const locData = [];
                for (let i = 0; i < locationdt.length; i++) {
                    locData.push({
                        label: locationdt[i].location_name,
                        value: locationdt[i]._id
                    })

                }
                setLocation(locData);
            });
    }
    const travel_insurance_for = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getTravelInsuranceFor`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setTravelInsuranceFor(data.data);
            });
    }

    const travel_cover_type_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/travelcovertype`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setTravelCoverType(data.data);
            });
    }

    const NatureOfPlan = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getNatureOfPlan`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNatureOfPlan(data.data);
            });
    }

    const TravelTypeList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getTravelType`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setTravelType(data.data);
            });
    }

    const country_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getNationality`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const countrylist = data.data;
                const countryData = [];
                for (let i = 0; i < countrylist.length; i++) {
                    countryData.push({
                        country_name: countrylist[i].nationality_name,
                        _id: countrylist[i]._id
                    })
                }
                setCountryList(countryData);
            });
    }

    const travel_plan_details = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/travel_plan_details/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setRowsData(data.data);

                const country = data.data.country_or_topup;
                setDefaultLocation(data.data?.location);
                const country_dt = country.length;
                const country_obj = [];
                const country_topup = [];

                for (let i = 0; i < country_dt; i++) {
                    const country_obj1 = { country_id: country[i]['country_id'], country_name: country[i]['country_name'] };
                    country_obj.push(country_obj1);

                    const country_topup1 = country[i]['countrytopup'];
                    country_topup.push(country_topup1);
                }
                var countryValues = country_obj;
                var countryTopupValues = country_topup.join(',');
                setCountry(countryValues);
                setCountryTopup(countryTopupValues);

                const add_op_con_desc = data.data.add_op_con_desc;
                const add_op_con_desc_dt = add_op_con_desc.length;
                const add_op_con_desc_obj = [];
                const add_op_con_desc_topup = [];
                const vat = [];
                for (let i = 0; i < add_op_con_desc_dt; i++) {
                    const add_op_con_desc_obj1 = add_op_con_desc[i]['add_op_con_desc'];
                    add_op_con_desc_obj.push(add_op_con_desc_obj1);

                    const add_op_con_desc_topup1 = add_op_con_desc[i]['add_op_con_desc_topup'];
                    add_op_con_desc_topup.push(add_op_con_desc_topup1);

                    const vat1 = add_op_con_desc[i]['vat'];
                    vat.push(vat1);
                }
                var add_op_con_descValues = add_op_con_desc_obj.join(',');
                var add_op_con_desc_topupValues = add_op_con_desc_topup.join(',');
                var vatValues = vat.join(',');

                setAddopcondesc(add_op_con_descValues);
                setAddopcondesctopup(add_op_con_desc_topupValues);
                setVat(vatValues);
            });
    }

    const handleChange = (selectedOption) => {
        setCountry(selectedOption);
    };
    const handleChangeLoc = (loc) => {
        setDefaultLocation(loc)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const company_id = data.get('company_id');
        const plan_name = data.get('plan_name');
        const plan_type = data.get('plan_type');
        const plan_category_id = data.get('plan_category_id');
        const nature_of_plan_id = data.get('nature_of_plan_id');
        const travel_type_id = data.get('travel_type_id');
        const country = Country;
        const countrytopup = data.get('countrytopup');
        const add_op_con_desc = data.get('add_op_con_desc');
        const add_op_con_desc_topup = data.get('add_op_con_desc_topup');
        const vat = data.get('vat');
        const jdv_comm = data.get('jdv_comm');
        if (Country.length != 0) {
            let countrytopup_arr = countrytopup?.split(',');
            if (Country.length != countrytopup_arr.length) {
                Swal.fire({
                    title: "Warning!",
                    text: "Please enter Country  Topup equal to Country",
                    icon: "warning",
                    button: false
                })
                return false;
            }
        }
        if (add_op_con_desc != '') {
            if (add_op_con_desc_topup == '') {
                Swal.fire({
                    title: "Warning!",
                    text: "Please enter Topup (Add Option Condition Description)",
                    icon: "warning",
                    button: false
                })
                return false;
            } else if (vat == '') {
                Swal.fire({
                    title: "Warning!",
                    text: "Please enter Vat",
                    icon: "warning",
                    button: false
                })
                return false;
            }
            else {
                const add_op_con_desc_arr = add_op_con_desc.split(',');
                const add_op_con_desc_topup_arr = add_op_con_desc_topup.split(',');
                const vat_arr = vat.split(',');
                if (add_op_con_desc_arr.length != add_op_con_desc_topup_arr.length) {
                    Swal.fire({
                        title: "Warning!",
                        text: "Please enter Topup (Add Option Condition Description) equal to Add Option Condition Description",
                        icon: "warning",
                        button: false
                    })
                    return false;
                }
                else if (add_op_con_desc_arr.length != vat_arr.length) {
                    Swal.fire({
                        title: "Warning!",
                        text: "Please enter Vat equal to Add Option Condition Description",
                        icon: "warning",
                        button: false
                    })
                    return false;
                }
            }
        }
        if (defaultlocation.length === 0) {
            Swal.fire({
                title: "Warning!",
                text: "Please Select Location",
                icon: "warning",
                button: false
            })
            return false;
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_id: company_id,
                plan_name: plan_name,
                plan_type: plan_type,
                plan_category_id: plan_category_id,
                nature_of_plan_id: nature_of_plan_id,
                travel_type_id: travel_type_id,
                country: Country,
                countrytopup: countrytopup,
                add_op_con_desc: add_op_con_desc,
                add_op_con_desc_topup: add_op_con_desc_topup,
                vat: vat,
                jdv_comm: jdv_comm,
                location: defaultlocation
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateTravelPlan/${travel_plan_id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    Swal.fire({
                        title: 'Success',
                        text: data.message,
                        icon: 'success',
                        button: false
                    })
                    navigate('/travel-plan');
                    setTimeout(() => {
                        Swal.close()
                    }, 1000);


                }
                else {
                    Swal.fire({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false
                    })
                    navigate('/travel-plan');
                    setTimeout(() => {
                        Swal.close()
                    }, 1000);
                }
            }
            );
    }
    const validateInput = (e) => {
        const inputValue = e.target.value;
        const textPattern = /^[A-Za-z,]*$/;
        if (!textPattern.test(inputValue)) {
            setErrmsg({ status: true, name: e.target.name })
            e.target.value = inputValue.replace(/[^a-zA-Z\s,]/g, '');
        } else {
            setErrmsg({ status: false, name: e.target.name })
        }
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card" style={{ marginTop: '20px' }}>
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Edit Travel Plan</h4>
                                </div>
                                <div className="col-md-6">
                                    <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ float: 'right' }}>Back</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <form action="/" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Company Name</label>
                                            <select required className="form-control" name="company_id">
                                                <option value="">Select Company</option>
                                                {
                                                    companyList.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item._id} selected={rowsData.company_id == item._id ? true : false}>{item.company_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Travel Insurance For</label>
                                            <select required className="form-control" name="plan_type">
                                                <option value="">Select Travel Insurance For</option>
                                                {
                                                    TravelInsuranceFor.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item._id} selected={rowsData.travel_insurance_for_id == item._id ? true : false}>{item.travel_insurance_for}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Plan Name</label>
                                            <input required type="text" className="form-control" placeholder="Enter Plan Name" name="plan_name" autoComplete="off" defaultValue={rowsData.plan_name} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Cover Type</label>
                                            <select required className="form-control" name="plan_category_id">
                                                <option value="">Select Cover Type</option>
                                                {
                                                    travel_cover_type.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item._id} selected={rowsData.plan_category_id == item._id ? true : false}>{item.travel_cover_type}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Nature Of Plan</label>
                                            <select required className="form-control" name="nature_of_plan_id">
                                                <option value="">Select Nature Of Plan</option>
                                                {
                                                    natureOfPlan.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item._id} selected={rowsData.nature_of_plan_id == item._id ? true : false}>{item.nature_of_plan_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Travel Type</label>
                                            <select required className="form-control" name="travel_type_id">
                                                <option value="">Select Travel Type</option>
                                                {
                                                    TravelType.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item._id} selected={rowsData.travel_type_id == item._id ? true : false}>{item.travel_type}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Country</label>
                                            <Multiselect
                                                options={countryList}
                                                selectedValues={Country}
                                                displayValue="country_name"
                                                showCheckbox={true}
                                                onSelect={handleChange}
                                                onRemove={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Fixed/Percentage/Reffered (Country)</label>
                                            <input required={Country.length > 0 ? true : false} type="text" name="countrytopup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (Country)" autoComplete="off" defaultValue={CountryTopup} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Add Option Condition Description</label>
                                            <input type="text" name="add_op_con_desc" onInput={(e) => validateInput(e)} className="form-control" placeholder="Enter Add Option Condition Description" autoComplete="off" defaultValue={add_op_con_desc} />
                                            {errmsg.status == true && errmsg.name == "add_op_con_desc" ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Fixed/Percentage/Reffered (Add Option Condition Description)</label>
                                            <input type="text" name="add_op_con_desc_topup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (Add Option Condition Description)" autoComplete="off" defaultValue={add_op_con_desc_topup} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Vat Able</label>
                                            <input type="text" name="vat" onInput={(e) => validateInput(e)} className="form-control" placeholder="Enter Vat Able" autoComplete="off" defaultValue={vat} />
                                            {errmsg.status == true && errmsg.name == "vat" ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>JDV Commission</label>
                                            <input required type="text" name="jdv_comm" className="form-control" placeholder="Enter JDV Commission" autoComplete="off" defaultValue={rowsData.jdv_comm} />
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Location</label>
                                            <Multiselect
                                                options={location}
                                                selectedValues={defaultlocation}
                                                onSelect={(evnt) => (handleChangeLoc(evnt))}
                                                onRemove={(evnt) => (handleChangeLoc(evnt))}
                                                displayValue="label"
                                                placeholder="Select Location"
                                                closeOnSelect={false}
                                                avoidHighlightFirstOption={true}
                                                showCheckbox={true}
                                                style={{ chips: { background: "#007bff" } }}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <button type="submit" className="btn btn-primary mt-2" style={{ float: "right" }}>Update</button>
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

export default EditTravelPlan
