import Multiselect from 'multiselect-react-dropdown';
import React from 'react'
import { useState, useEffect } from 'react';
import { json, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const EditHomePlan = () => {
    const navigate = useNavigate();
    const [planCategory, setPlanCategory] = useState([]);
    const [natureOfPlan, setNatureOfPlan] = useState([]);
    const [propertyTypeList, setpropertyTypeList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [ownershipList, setOwnershipList] = useState([]);
    const [homePlanList, setHomePlanList] = useState([]);
    const [rowsData, setRowsData] = useState([]);
    const [content_value, setContentValue] = useState('');
    const [content_value_topup, setContentValueTopup] = useState('');
    const [pb_value, setPbValue] = useState('');
    const [pb_value_topup, setPbValueTopup] = useState('');
    const [building_value, setBuildingValue] = useState('');
    const [building_value_topup, setBuildingValueTopup] = useState('');
    const [dm_value, setDmValue] = useState('');
    const [dm_value_topup, setDmValueTopup] = useState('');
    const [claimyear, setClaimyear] = useState('');
    const [claimyear_topup, setClaimyearTopup] = useState('');
    const [add_op_con_desc, setAddopcondesc] = useState('');
    const [addop_con_desc_topup, setAddopcondesctopup] = useState('');
    const [home_plan_id, setHomePlanId] = useState('');
    const [plan_id, setPlanId] = useState('');
    const [vat, setVat] = useState('');
    const [location, setLocation] = useState([]);
    const [defaultlocation, setDefaultLocation] = useState([]);
    const [selectedPropertyType, setSelectedPpropertyType] = useState([]);
    const [cv_rate, setcv_rate] = useState('');
    const [pbv_rate, setPbv_rate] = useState('');
    const [bv_rate, setBvrate] = useState('');
    const [errmsg, setErrmsg] = useState({
        status: false,
        name: '',
    })
    const [cv_premium, setcv_premium] = useState('');
    const [pbv_premium, setpbv_premium] = useState('');
    const [bv_premium, setbv_premium] = useState('');
    const [opcondesc, setopcondescvalue] = useState('');
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
            setPlanId(id)
            company_list();
            property_type_list();
            Plancategory();
            NatureOfPlan();
            ownership_list();
            getHomePlanTypeList();
            Home_plan_details(id);
            locationList();
        }

    }, []);

    const Home_plan_details = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/home_plan_details/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {

                setRowsData(data.data);
                console.log(data.data, "rowsdata")
                setDefaultLocation(data.data?.location)
                setHomePlanId(data.data?.plan_type_id)
                setSelectedPpropertyType(data.data?.property_type_id)
                    ;
                if (data.data?.content_value_or_topup) {
                    const content_val_and_topup = data.data.content_value_or_topup;
                    const content_val_obj = [];
                    const content_val_topup_obj = [];
                    const content_val_rate = []
                    const cv_premium = []
                    for (let i = 0; i < content_val_and_topup.length; i++) {
                        const content_val_objmin = content_val_and_topup[i]['conMin'];
                        const content_val_objmax = content_val_and_topup[i]['conMax'];

                        const content_val_obj_topup = content_val_and_topup[i]['content_topup'];
                        const content_val_rate1 = content_val_and_topup[i]['rate'];
                        const cv_premium1 = content_val_and_topup[i]['minmumPrimium'];
                        content_val_obj.push(content_val_objmin + "-" + content_val_objmax);
                        content_val_topup_obj.push(content_val_obj_topup);
                        content_val_rate.push(content_val_rate1);
                        cv_premium.push(cv_premium1);
                    }
                    var content_value = content_val_obj.join(',');
                    var content_value_topup = content_val_topup_obj.join(',');
                    var cv_rate = content_val_rate.join(',');
                    var cv_premium1 = cv_premium?.join(',');
                    setContentValue(content_value);
                    setContentValueTopup(content_value_topup);
                    setcv_rate(cv_rate);
                    setcv_premium(cv_premium1);
                }
                if (data.data?.pbvalue_or_topup) {
                    const pb_val_and_topup = data.data.pbvalue_or_topup;
                    const pb_val_obj = [];
                    const pb_val_topup_obj = [];
                    const pb_rate = [];
                    const pbv_premium = [];

                    for (let i = 0; i < pb_val_and_topup.length; i++) {
                        const pb_val_objmin = pb_val_and_topup[i]['pbvMin'];
                        const pb_val_objmax = pb_val_and_topup[i]['pbvMax'];
                        const pb_val_obj_topup = pb_val_and_topup[i]['pbv_topup'];
                        const pb_rate1 = pb_val_and_topup[i]['rate'];
                        const pbv_premium1 = pb_val_and_topup[i]['minmumPrimium'];

                        pb_val_obj.push(pb_val_objmin + "-" + pb_val_objmax);
                        pb_val_topup_obj.push(pb_val_obj_topup);
                        pb_rate.push(pb_rate1);
                        pbv_premium.push(pbv_premium1);
                    }
                    var pb_value = pb_val_obj.join(',');
                    var pb_value_topup = pb_val_topup_obj?.join(',');
                    var pbv_rate = pb_rate?.join(',');
                    var pbv_premium1 = pbv_premium?.join(',');
                    setPbValue(pb_value);
                    setPbValueTopup(pb_value_topup);
                    setPbv_rate(pbv_rate);
                    setpbv_premium(pbv_premium1);
                }
                if (data.data?.building_value_or_topup) {
                    const bv_val_and_topup = data.data.building_value_or_topup;
                    const building_val_obj = [];
                    const building_val_topup_obj = [];
                    const bvrate = [];
                    const bv_premium = [];

                    for (let i = 0; i < bv_val_and_topup.length; i++) {
                        const building_val_objmin = bv_val_and_topup[i]['bvMin'];
                        const building_val_objmax = bv_val_and_topup[i]['bvMax'];
                        const building_val_obj_topup = bv_val_and_topup[i]['bv_topup'];
                        const bvrate1 = bv_val_and_topup[i]['rate'];
                        const bv_premium1 = bv_val_and_topup[i]['minmumPrimium'];

                        building_val_obj.push(building_val_objmin + '-' + building_val_objmax);
                        building_val_topup_obj.push(building_val_obj_topup);
                        bvrate.push(bvrate1);
                        bv_premium.push(bv_premium1);
                    }
                    var building_value = building_val_obj.join(',');
                    var building_value_topup = building_val_topup_obj.join(',');
                    var bv_rate = bvrate.join(',');
                    var bv_premium1 = bv_premium?.join(',');
                    setBuildingValue(building_value);
                    setBuildingValueTopup(building_value_topup);
                    setBvrate(bv_rate);
                    setbv_premium(bv_premium1);
                }
                const claimyear = data.data.claimyears_or_topup;
                const claimyear_dt = claimyear.length;
                const claimyear_obj = [];
                const claimyear_topup = [];
                for (let i = 0; i < claimyear_dt; i++) {
                    const claimyear_obj1 = claimyear[i]['claimyears'];
                    claimyear_obj.push(claimyear_obj1);

                    const claimyear_topup1 = claimyear[i]['claimyeardisc'];
                    claimyear_topup.push(claimyear_topup1);
                }
                var claimyearValues = claimyear_obj.join(',');
                var claimyearTopupValues = claimyear_topup.join(',');
                setClaimyear(claimyearValues);
                setClaimyearTopup(claimyearTopupValues);

                const dm_val_and_topup = data.data.domestic_helper_or_topup;
                const dm_val_obj = [];
                const dm_val_topup_obj = [];

                for (let i = 0; i < dm_val_and_topup.length; i++) {
                    const dm_val_objmin = dm_val_and_topup[i]['domMin'];
                    const dm_val_objmax = dm_val_and_topup[i]['domMax'];
                    const dm_val_obj_topup = dm_val_and_topup[i]['dom_topup'];

                    let dm_val_obj1;
                    if (dm_val_and_topup[i]['domMin'] == dm_val_and_topup[i]['domMax']) {
                        dm_val_obj1 = dm_val_and_topup[i]['domMin'];
                    }
                    else {
                        dm_val_obj1 = dm_val_and_topup[i]['domMin'] + '-' + dm_val_and_topup[i]['domMax'];
                    }

                    dm_val_obj.push(dm_val_obj1);
                    dm_val_topup_obj.push(dm_val_obj_topup);
                }
                var dom_value = dm_val_obj.join(',');
                var dom_value_topup = dm_val_topup_obj.join(',');
                setDmValue(dom_value);
                setDmValueTopup(dom_value_topup);

                const add_op_con_desc = data.data?.add_op_con_desc_or_topup;
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
                setopcondescvalue(add_op_con_descValues)
                var add_op_con_desc_topupValues = add_op_con_desc_topup.join(',');
                var vatValues = vat.join(',');

                setAddopcondesc(add_op_con_descValues);
                setAddopcondesctopup(add_op_con_desc_topupValues);
                setVat(vatValues);
            });
    }
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
    const property_type_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_home_property_type_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const propertydt = data.data;
                const propertys = propertydt.map((item, index) => {
                    return {
                        label: item.home_property_type,
                        value: item._id
                    }
                })
                setpropertyTypeList(propertys);
            });
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

    const ownership_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_home_owner_type_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setOwnershipList(data.data);
                console.log(data.data)
            });
    }

    const getHomePlanTypeList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_all_home_plan_type`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setHomePlanList(data.data);
                console.log(data.data, "homeplanlist")
            });
    }
    const handleChangeLoc = (loc) => {
        setDefaultLocation(loc)
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
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const company_id = data.get('company_id');
        const plan_name = data.get('plan_name');
        const plan_category_id = data.get('plan_category_id');
        const nature_of_plan_id = data.get('nature_of_plan_id');
        const property_type = data.get('property_type_id')
        const ownership_status = data.get('ownership_type_id')
        const plan_type = data.get('plan_type_id');
        // const initial_rate = data.get('initial_rate');
        // const discount_rate = data.get('discount_rate')
        const excess = data.get('excess')
        const content_value = data.get('content_value')
        const content_value_topup = data.get('cv_topup');
        const cv_rate = data.get('cv_rate')
        const cv_min_premium = data.get('cv_min_premium')
        const personal_belonging_value = data.get('pb_value')
        const personal_belonging_value_topup = data.get('pbv_topup')
        const pbv_rate = data.get('pbv_rate')
        const pbv_min_premium = data.get('pbv_min_premium')
        const building_value = data.get('building_value')
        const building_value_topup = data.get('bv_topup')
        const bv_rate = data.get('bv_rate')
        const bv_min_premium = data.get('bv_min_premium')
        const no_claim_year = data.get('no_claim_year')
        const no_claim_discount = data.get('no_claim_discount')
        const domestic_helper = data.get('domestic_helper')
        const dom_topup = data.get('dom_topup')
        const add_op_con_desc = data.get('add_op_con_desc')
        const add_op_con_desc_topup = data.get('op_con_desc_topup')
        const vat = data.get('vat')
        const jdv_comm = data.get('jdv_comm')

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_id: company_id,
                plan_name: plan_name,
                plan_category_id: plan_category_id,
                nature_of_plan_id: nature_of_plan_id,
                property_type: selectedPropertyType,
                ownership_status: ownership_status,
                plan_type: plan_type,
                excess: excess,
                content_value: content_value,
                content_value_topup: content_value_topup,
                cv_rate: cv_rate,
                cv_premium: cv_min_premium,
                personal_belonging_value: personal_belonging_value,
                personal_belonging_value_topup: personal_belonging_value_topup,
                pbv_premium: pbv_min_premium,
                building_value: building_value,
                pbv_rate: pbv_rate,
                building_value_topup: building_value_topup,
                bv_rate: bv_rate,
                bv_premium: bv_min_premium,
                no_claim_year: no_claim_year,
                no_claim_discount: no_claim_discount,
                domestic_helper: domestic_helper,
                dom_topup: dom_topup,
                add_op_con_desc: add_op_con_desc,
                add_op_con_desc_topup: add_op_con_desc_topup,
                vat: vat,
                jdv_comm: jdv_comm,
                location: defaultlocation
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateHomePlan/${plan_id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    Swal.fire({
                        title: 'Success',
                        text: data.message,
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/homeplan');
                        }
                    })
                }
                else {
                    Swal.fire({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        confirmButtonText: "Ok",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/homeplan');
                        }
                    })
                }
            });
    }
    const validateInput = (e) => {
        const inputValue = e.target.value;
        setopcondescvalue(e.target.value)
        const textPattern = /^[A-Za-z,]*$/;
        if (!textPattern.test(inputValue)) {
            setErrmsg({ status: true, name: e.target.name })
            e.target.value = inputValue.replace(/[^a-zA-Z\s,]/g, '');
        } else {
            setErrmsg({ status: false, name: e.target.name })
        }
    }
    const PlanTypeChanged = (e) => {
        const plan_type_id = e.target.value;
        console.log(plan_type_id, "plan_type_id")
        setHomePlanId(plan_type_id);
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card" style={{ marginTop: '20px' }}>
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Edit Home Plan</h4>
                                </div>
                                <div className="col-md-6">
                                    <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ float: 'right' }}>Back</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <form action="/" method="POST"
                                onSubmit={handleSubmit}
                            >
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Company Name</label>
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
                                            <label className='text-danger'>Plan Name</label>
                                            <input required type="text" className="form-control" name="plan_name" autoComplete="off" defaultValue={rowsData.plan_name} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Plan Category</label>
                                            <select required className="form-control" name="plan_category_id">
                                                <option value="">Select Plan Category</option>
                                                {
                                                    planCategory.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item._id} selected={rowsData.plan_category_id == item._id ? true : false}>{item.plan_category_name}</option>
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
                                            <label className='text-danger'>Ownership Status</label>
                                            <select required className="form-control" name="ownership_type_id">
                                                <option value="">Select Ownership Status</option>
                                                {ownershipList.map((item, index) => (
                                                    <option key={index} value={item._id} selected={rowsData?.ownership_status_id === item._id ? true : false}>{item.home_owner_type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Nature Of Plan</label>
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
                                            <label className='text-danger'>Property Type</label>
                                            {/* <select required className="form-control" name="property_type_id">
                                                <option  value="">Select Property Type</option>

                                                {propertyTypeList.map((item, index) => (
                                                    <option key={index} value={item._id} selected={rowsData.property_type_id == item._id ? true : false}>{item.home_property_type}</option>
                                                ))}

                                            </select> */}
                                            <Multiselect
                                                options={propertyTypeList}
                                                selectedValues={selectedPropertyType}
                                                onSelect={(evnt) => (setSelectedPpropertyType(evnt))}
                                                onRemove={(evnt) => (setSelectedPpropertyType(evnt))}
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
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Excess</label>
                                            <input required type="text" className="form-control" placeholder="Enter Excess" name="excess" autoComplete="off" defaultValue={rowsData.excess} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>Plan Type</label>
                                            <select required className="form-control" onChange={(e) => PlanTypeChanged(e)} name="plan_type_id">
                                                <option value="">Select Plan Type</option>
                                                {homePlanList?.map((item, index) => (
                                                    <option key={index} value={item._id} selected={rowsData.plan_type_id == item._id ? true : false}>{item.home_plan_type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Initial Rate</label>
                                            <input required type="text" className="form-control"  name="initial_rate" autoComplete="off" defaultValue={rowsData.initial_rate} />
                                        </div>
                                    </div> */}
                                    {/* <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Discounted Rate</label>
                                            <input required type="text" className="form-control"  name="discount_rate" autoComplete="off" defaultValue={rowsData.discount_rate} />
                                        </div>
                                    </div> */}

                                </div>
                                <div className="row">

                                    {home_plan_id == "642279d4fb67d39380fef82d" ?
                                        (<>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Building Value</label>
                                                        <input type="text" className="form-control" placeholder="Enter Building Value" name="building_value" autoComplete="off" defaultValue={building_value} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Building Value Topup</label>
                                                        <input type="text" className="form-control" placeholder="Enter Building Value Topup" name="bv_topup" autoComplete="off" defaultValue={building_value_topup} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Building Value Rate %</label>
                                                        <input type="text" className="form-control" placeholder="Enter Building Value Rate %" name="bv_rate" autoComplete="off" defaultValue={bv_rate} />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className='row'> */}
                                            <div className="col-md-4">
                                                <div className="form-group mb-3">
                                                    <label>Building Value Minumum Premium</label>
                                                    <input type="text" className="form-control" placeholder="Enter Building Value Minimum Premium" name="bv_min_premium" autoComplete="off" defaultValue={bv_premium} />
                                                </div>
                                            </div>
                                            {/* </div> */}
                                        </>
                                        ) : home_plan_id == "642279f2fb67d39380fef834" ? (
                                            <>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Content Value</label>
                                                            <input type="text" className="form-control" placeholder="Enter Content Value" name="content_value" autoComplete="off" defaultValue={content_value} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Content Value Topup</label>
                                                            <input required type="text" className="form-control" placeholder="Enter Content Value Topup" name="cv_topup" autoComplete="off" defaultValue={content_value_topup} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Content Value Rate %</label>
                                                            <input type="text" className="form-control" placeholder="Enter Content Value Rate %" name="cv_rate" autoComplete="off" defaultValue={cv_rate} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className='row'> */}
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Content Value Minumum Premium</label>
                                                        <input type="text" className="form-control" placeholder="Enter Minimum Premium" name="cv_min_premium" autoComplete="off" defaultValue={cv_premium} />
                                                    </div>
                                                </div>
                                                {/* </div> */}
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Personal Belonging Value</label>
                                                        <input type="text" className="form-control" placeholder="Enter Personal Belonging Value" name="pb_value" autoComplete="off" defaultValue={pb_value} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Personal Belonging Value Topup</label>
                                                        <input type="text" className="form-control" placeholder="Enter Personal Belonging Topup" name="pbv_topup" autoComplete="off" defaultValue={pb_value_topup} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Personal Belonging Value Rate %</label>
                                                        <input type="text" className="form-control" placeholder="Enter Personal Belonging Value Rate %" name="pbv_rate" autoComplete="off" defaultValue={pbv_rate} />
                                                    </div>
                                                </div>
                                                {/* <div className='row'> */}
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Personal Belonging Value Minumum Premium</label>
                                                        <input type="text" className="form-control" placeholder="Enter Minimum Premium" name="pbv_min_premium" autoComplete="off" defaultValue={pbv_premium} />
                                                    </div>
                                                </div>
                                                {/* </div> */}

                                            </>
                                        ) : home_plan_id == "64227a65fb67d39380fef842" || home_plan_id == "64227a40fb67d39380fef83b" ? (
                                            <>
                                                <div className='row'>
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Content Value</label>
                                                            <input type="text" className="form-control" placeholder="Enter Content Value" name="content_value" autoComplete="off" defaultValue={content_value} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Content Value Topup</label>
                                                            <input type="text" className="form-control" placeholder="Enter Content Value Topup" name="cv_topup" autoComplete="off" defaultValue={content_value_topup} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Content Value Rate %</label>
                                                            <input required type="text" className="form-control" placeholder="Enter Content Value Rate %" name="cv_rate" autoComplete="off" defaultValue={cv_rate} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Content Value Minumum Premium</label>
                                                            <input type="text" className="form-control" placeholder="Enter Content Value Minimum Premium" name="cv_min_premium" autoComplete="off" defaultValue={cv_premium} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Personal Belonging Value</label>
                                                            <input type="text" className="form-control" placeholder="Enter Personal Belonging Value" name="pb_value" autoComplete="off" defaultValue={pb_value} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Personal Belonging Value Topup</label>
                                                            <input type="text" className="form-control" placeholder="Enter Personal Belonging Topup" name="pbv_topup" autoComplete="off" defaultValue={pb_value_topup} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Personal Belonging Value Rate %</label>
                                                            <input type="text" className="form-control" placeholder="Enter Personal Belonging
                                                                 Rate %" name="pbv_rate" autoComplete="off" defaultValue={pbv_rate} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Personal Belonging Value Minumum Premium</label>
                                                            <input type="text" className="form-control" placeholder="Enter Personal Belonging Value Minimum Premium" name="pbv_min_premium" autoComplete="off" defaultValue={pbv_premium} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Building Value</label>
                                                            <input type="text" className="form-control" placeholder="Enter Building Value" name="building_value" autoComplete="off" defaultValue={building_value} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Building Value Topup</label>
                                                            <input type="text" className="form-control" placeholder="Enter Building Value Topup" name="bv_topup" autoComplete="off" defaultValue={building_value_topup} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Building Value Rate %</label>
                                                            <input type="text" className="form-control" placeholder="Enter Building Value Rate %" name="bv_rate" autoComplete="off" defaultValue={bv_rate} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-3">
                                                            <label>Building Value Minumum Premium</label>
                                                            <input type="text" className="form-control" placeholder="Enter Building Value Minimum Premium" name="bv_min_premium" autoComplete="off" defaultValue={bv_premium} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : ("")
                                    }
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>No Claim Year</label>
                                            <input type="text" className="form-control" placeholder="Enter No Claim Year" name="no_claim_year" autoComplete="off" defaultValue={claimyear} />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>No Claim Discount</label>
                                            <input type="text" className="form-control" placeholder="Enter No Claim Discount" name="no_claim_discount" autoComplete="off" defaultValue={claimyear_topup} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Domestic Helper</label>
                                            <input type="text" className="form-control" placeholder="Enter Domestic Helper" name="domestic_helper" autoComplete="off" defaultValue={dm_value} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Domestic Helper Topup</label>
                                            <input type="text" className="form-control" placeholder="Enter Domestic Helper Topup" name="dom_topup" autoComplete="off" defaultValue={dm_value_topup} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Add Option Condition Description</label>
                                            <input type="text" name="add_op_con_desc" onInput={(e) => validateInput(e)} className="form-control" placeholder="Enter Add Option Condition Description" autoComplete="off" defaultValue={add_op_con_desc} />
                                            {errmsg.status == true && errmsg.name == "add_op_con_desc" ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Topup</label>
                                            <input type="text" required={opcondesc != '' ? true : false} className="form-control" placeholder="Enter Option Condition Description Topup" name="op_con_desc_topup" autoComplete="off" defaultValue={addop_con_desc_topup} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Vat Able</label>
                                            <input required={opcondesc != '' ? true : false} type="text" name="vat" onInput={(e) => validateInput(e)} className="form-control" placeholder="Enter Vat Able" autoComplete="off" defaultValue={vat} />
                                            {errmsg.status == true && errmsg.name == "vat" ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className='text-danger'>JDV Commission</label>
                                            <input required type="text" name="jdv_comm" className="form-control" placeholder="Enter JDV Commission" autoComplete="off" defaultValue={rowsData.jdv_comm} />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
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

export default EditHomePlan
