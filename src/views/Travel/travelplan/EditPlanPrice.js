import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";

const EditPlanPrice = () => {
    const navigate = useNavigate();
    const [planpriceid, setPlanPriceId] = useState('');
    const [travel_plan_type, setTravelPlanType] = useState([]);
    const [travel_region, setTravelRegion] = useState([]);
    const [travel_cover_type, setTravelCoverType] = useState([]);
    const [planprice, setPlanPrice] = useState([]);
    const [age, setAge] = useState([]);
    const [age_topup, setAgeTopup] = useState([]);
    const [no_of_days, setNoOfDays] = useState([]);
    const [no_of_days_topup, setNoOfDaysTopup] = useState([]);
    const [travel_plan_id, setTravelPlanId] = useState('');
    const [travel_region_id, setTravelRegionId] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [planType, setPlanType] = useState(false);
    const [no_of_childern, setNoOfChildern] = useState('');
    const [children_topup, setChildrenTopup] = useState('');
    const [no_of_spouse, setNoOfSpouse] = useState('');
    const [spouse_topup, setSpouseTopup] = useState('');

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
            setPlanPriceId(id);
            travel_plan_type_list();
            travel_region_list();
            travel_cover_type_list();
            planpricedetails(id);
        }
    }, []);

    const travel_plan_type_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/travelplantype`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setTravelPlanType(data.data);
            });
    }

    const travel_region_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/travelregion`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const list = data.data;
                const list1 = [];
                for (let i = 0; i < list.length; i++) {
                    list1.push({ value: list[i]._id, label: list[i].travel_region });
                }
                setTravelRegion(list1);
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

    const planpricedetails = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/planpricedetails/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setPlanPrice(data.data[0]);

                const priceData = data.data[0];
                if (priceData.plan_type_id == '641d700e2e8acf350eaab204') {
                    setPlanType(true)
                }
                console.log("plan price data>>>>>>>>>>>>>>", data.data[0])
                const age = data.data[0].age_or_topup;
                const age_dt = age.length;
                const age_obj = [];
                const age_topup = [];
                for (let i = 0; i < age_dt; i++) {
                    let age_obj1;
                    if (age[i]['ageMin'] == age[i]['ageMax']) {
                        age_obj1 = age[i]['ageMin'];
                    }
                    else {
                        age_obj1 = age[i]['ageMin'] + '-' + age[i]['ageMax'];
                    }
                    age_obj.push(age_obj1);

                    const age_topup1 = age[i]['agetopup'];
                    age_topup.push(age_topup1);
                }
                var ageValues = age_obj.join(',');
                var ageTopupValues = age_topup.join(',');
                setAge(ageValues);
                setAgeTopup(ageTopupValues);
                const no_of_childern = [];
                const children_topup = [];
                if (data.data[0]?.no_of_child) {
                    const no_of_childern_dt = data.data[0].no_of_child;
                    for (let i = 0; i < no_of_childern_dt?.length; i++) {
                        let no_of_childern1;
                        if (no_of_childern_dt[i]['no_of_childMin'] == no_of_childern_dt[i]['no_of_childMax']) {
                            no_of_childern1 = no_of_childern_dt[i]['no_of_childMin'];
                        }
                        else {
                            no_of_childern1 = no_of_childern_dt[i]['no_of_childMin'] + '-' + no_of_childern_dt[i]['no_of_childMax'];
                        }
                        no_of_childern.push(no_of_childern1);

                        const children_topup1 = no_of_childern_dt[i]['no_of_child_topup'];
                        children_topup.push(children_topup1);
                    }
                    var no_of_childernValues = no_of_childern?.join(',');
                    var childrenTopupValues = children_topup?.join(',');
                    setNoOfChildern(no_of_childernValues);
                    setChildrenTopup(childrenTopupValues);
                    const no_of_spouse = [];
                    const spouse_topup = [];
                    const no_of_spouse_dt = data.data[0].no_of_spouse;
                    for (let i = 0; i < no_of_spouse_dt?.length; i++) {
                        let no_of_spouse1;
                        if (no_of_spouse_dt[i]['no_of_spouseMin'] == no_of_spouse_dt[i]['no_of_spouseMax']) {
                            no_of_spouse1 = no_of_spouse_dt[i]['no_of_spouseMin'];
                        }
                        else {
                            no_of_spouse1 = no_of_spouse_dt[i]['no_of_spouseMin'] + '-' + no_of_spouse_dt[i]['no_of_spouseMax'];
                        }
                        no_of_spouse.push(no_of_spouse1);

                        const spouse_topup1 = no_of_spouse_dt[i]['no_of_spouse_topup'];
                        spouse_topup.push(spouse_topup1);
                    }
                    var no_of_spouseValues = no_of_spouse?.join(',');
                    var spouseTopupValues = spouse_topup?.join(',');
                    setNoOfSpouse(no_of_spouseValues);
                    setSpouseTopup(spouseTopupValues);
                }

                const no_of_days = data.data[0].no_of_days_or_topup;
                const no_of_days_dt = no_of_days.length;
                const no_of_days_obj = [];
                const no_of_days_topup = [];
                for (let i = 0; i < no_of_days_dt; i++) {
                    let no_of_days_obj1;
                    if (no_of_days[i]['number_of_daysMin'] == no_of_days[i]['number_of_daysMax']) {
                        no_of_days_obj1 = no_of_days[i]['number_of_daysMin'];
                    }
                    else {
                        no_of_days_obj1 = no_of_days[i]['number_of_daysMin'] + '-' + no_of_days[i]['number_of_daysMax'];
                    }
                    no_of_days_obj.push(no_of_days_obj1);

                    const no_of_days_topup1 = no_of_days[i]['travel_premium'];
                    no_of_days_topup.push(no_of_days_topup1);
                }
                var no_of_daysValues = no_of_days_obj.join(',');
                var no_of_daysTopupValues = no_of_days_topup.join(',');
                setNoOfDays(no_of_daysValues);
                setNoOfDaysTopup(no_of_daysTopupValues);
                setTravelPlanId(data.data[0].plan_id);
                const listData = data.data[0].regions;
                const listData1 = [];
                for (let i = 0; i < listData.length; i++) {
                    listData1.push({ value: listData[i]._id, label: listData[i].travel_region });
                }
                setSelectedOption(listData1);
            });
    }

    const updateSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const travel_plan_type_id = data.get('plan_type_id');
        if (selectedOption == null) {
            swal({
                title: "Error!",
                text: "Please Select Region",
                type: "error",
                icon: "error"
            });
            return false;
        }
        const travel_region_id = selectedOption;
        const travel_cover_type_id = data.get('cover_type_id');
        const number_of_days = data.get('no_of_days');
        const travel_pemium = data.get('travel_premium');
        const age = data.get('age');
        const price_name = data.get('price_name');
        const age_topup = data.get('age_topup');
        const number_of_child = data.get('no_of_child');
        const no_of_children_topup = data.get('no_of_children_topup');
        const number_of_spouse = data.get('no_of_spouse');
        const no_of_spouse_topup = data.get('no_of_spouse_topup');
        let body = {}
        if (planType == true) {
            body = {
                plan_type_id: travel_plan_type_id,
                region_id: travel_region_id,
                plan_id: travel_plan_id,
                cover_type_id: travel_cover_type_id,
                no_of_days: number_of_days,
                travel_premium: travel_pemium,
                age: age,
                age_topup: age_topup,
                price_name: price_name,
                no_of_child: number_of_child,
                no_of_children_topup: no_of_children_topup,
                no_of_spouse: number_of_spouse,
                no_of_spouse_topup: no_of_spouse_topup,
            }
        }
        else {
            body = {
                plan_type_id: travel_plan_type_id,
                region_id: travel_region_id,
                plan_id: travel_plan_id,
                cover_type_id: travel_cover_type_id,
                no_of_days: number_of_days,
                travel_premium: travel_pemium,
                age: age,
                age_topup: age_topup,
                price_name: price_name,
            }
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateplanprice/${planpriceid}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false

                    })
                    setTimeout(() => {
                        swal.close();
                        navigate('/ViewPlanPrice?id=' + travel_plan_id);
                    }, 1000);
                    // .then(function() {
                    //     navigate('/ViewPlanPrice?id='+travel_plan_id);
                    // });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error"
                    }).then(function () {
                        navigate('/ViewPlanPrice?id=' + travel_plan_id);
                    });
                }
            });
    }
    const ChangePlanType = (e) => {
        if (e.target.value == '641d700e2e8acf350eaab204') {
            setPlanType(true)
        }
        else {
            setPlanType(false)
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h4 className="card-title">Edit Plan Price</h4>
                                </div>
                                <div className='col-md-6'>
                                    <a href={`/ViewPlanPrice?id=${travel_plan_id}`} className="btn btn-primary" style={{ float: "right" }}>Back</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <form method="POST" onSubmit={updateSubmit}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Plan Type</label>
                                            <select className="form-control" onChange={(e) => ChangePlanType(e)} name="plan_type_id" required>
                                                <option value="">Select Plan Type</option>
                                                {
                                                    travel_plan_type.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item._id} selected={planprice.plan_type_id == item._id ? true : false}>{item.travel_plan_type}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Travel Region</label>
                                            <Multiselect
                                                options={travel_region}
                                                selectedValues={selectedOption}
                                                onSelect={setSelectedOption}
                                                onRemove={setSelectedOption}
                                                displayValue="label"
                                                placeholder="Select Region"
                                                closeOnSelect={false}
                                                avoidHighlightFirstOption={true}
                                                showCheckbox={true}
                                                style={{ chips: { background: "#007bff" } }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Cover Type</label>
                                            <select className="form-control" name="cover_type_id" required>
                                                <option value="">Select Cover Type</option>
                                                {
                                                    travel_cover_type.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item._id} selected={planprice.cover_type_id == item._id ? true : false}>{item.travel_cover_type}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Price Name</label>
                                            <input
                                                // onChange={(evnt)=>handleChange(index, evnt)}
                                                defaultValue={planprice.price_name}
                                                type="text" name="price_name" className="form-control"
                                                placeholder="Enter Price Name" required />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Number Of Days</label>
                                            <input type="text" className="form-control" name="no_of_days" defaultValue={no_of_days} required />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Travel Premium</label>
                                            <input type="text" className="form-control" name="travel_premium" defaultValue={no_of_days_topup} required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Age</label>
                                            <input type="text" className="form-control" name="age" defaultValue={age} required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Fixed/Percentage/Reffered</label>
                                            <input type="text" className="form-control" name="age_topup" defaultValue={age_topup} required />
                                        </div>
                                    </div>
                                    {planType == true ? (
                                        <>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Number Of Child</label>
                                                    <input type="text" className="form-control" name="no_of_child" defaultValue={no_of_childern} required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Fixed/Percentage/Reffered</label>
                                                    <input
                                                        // onChange={(evnt)=>handleChange(index, evnt)}
                                                        defaultValue={children_topup}
                                                        type="text" name="no_of_children_topup" className="form-control"
                                                        placeholder="Enter Fixed/Percentage/Reffered" required />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Number Of Spouse</label>
                                                    <input type="text" className="form-control" name="no_of_spouse" defaultValue={no_of_spouse} required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Fixed/Percentage/Reffered</label>
                                                    <input
                                                        // onChange={(evnt)=>handleChange(index, evnt)}
                                                        defaultValue={spouse_topup}
                                                        type="text" name="no_of_spouse_topup" className="form-control"
                                                        placeholder="Enter Fixed/Percentage/Reffered" required />
                                                </div>
                                            </div>
                                        </>
                                    ) : ("")}
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

export default EditPlanPrice
