import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { json, useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'
import Multiselect from 'multiselect-react-dropdown'
import axios from 'axios'

const View_Best_Plan = () => {
    const navigate = useNavigate()
    const [limit, setLimit] = useState(10)
    const [pageCount, setPageCount] = useState(0)
    const [perPage] = useState(5);
    const [page, setPage] = useState(1)
    const [masterPermission, setMasterpermission] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [visibleedit, setVisibleedit] = useState(false)
    const [BestPlans, setBestPlans] = useState([])
    const [updateData, setUpdateData] = useState([])
    const [LineOfBusiness, setLineOfBusiness] = useState([]);
    const [location, setLocation] = useState([]);
    const [natureOfPlan, setNatureOfPlan] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [defaultlocation, setDefaultLocation] = useState([]);
    const [repairCondition, setRepairCondition] = useState([]);

    const [defaultPlancategory, setDefaultPlanCategory] = useState([])
    const [TravelInsuranceFor, setTravelInsuranceFor] = useState([]);
    const [plan, setPlan] = useState([]);
    const [selectedplan, setSelectedPlan] = useState([]);
    const [selectedlob, setSelectedlob] = useState([])
    const [planCategory, setPlanCategory] = useState([]);
    const [deftravelinsurancefor, setDefTravelInsuranceFor] = useState([]);
    const [travel_cover_type, setTravelCoverType] = useState([]);
    const [deftravelcovertype, setDefTravelCoverType] = useState([]);
    const [HomePlanList, setHomePlanList] = useState([]);
    const [homeplanType, setDefHomePlanType] = useState([]);
    const [defmedicalcovertype, setDefMedicalPlanType] = useState([]);
    const [PlanType, setPlanType] = useState([]);
    const API = 'https://insuranceapi-3o5t.onrender.com/api'

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            const userdata = JSON.parse(localStorage.getItem('user'))
            const master_permission = userdata?.master_permission?.[0] || {}
            setMasterpermission(master_permission)
            getAll_Best_Plans(page, perPage)
            getlistLineOfBusiness()
            locationList()
            NatureOfPlan()
            company_list()
            repair_condition()
            Plancategory()
            getHomePlanTypeList()
            MedicalPlanType()
            travel_insurance_for()
            travel_cover_type_list()
            getPlanlist()
        }

    }, [])
    const getPlanlist = async (e) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch('https://insuranceapi-3o5t.onrender.com/api/getPolicyType', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data.data)

                let plan = data.data;
                const plan_len = plan.length;
                const plan_list = [];
                for (let i = 0; i < plan_len; i++) {
                    const plan_obj = { label: plan[i].policy_type_name, value: plan[i]._id };
                    plan_list.push(plan_obj);
                }
                setPlan(plan_list);
            });
    }
    const handleLObChange = (e) => {
        e.preventDefault()
        const lob = e.target.value;
        const lobsplit = lob.split(',');
        let lobObj = {
            value: lobsplit[0],
            label: lobsplit[1]
        }
        console.log("lob value>>>>>", lobObj)
        setSelectedlob(lobObj);
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
                const list = data.data;
                const listdata = list.map((data) => ({ label: data.travel_insurance_for, value: data._id }));
                setTravelInsuranceFor(listdata);
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
                const list = data.data;
                const listdata = list.map((data) => ({ label: data.travel_cover_type, value: data._id }));
                setTravelCoverType(listdata);
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
                const list = data.data;
                const listdata = list.map((data) => ({ label: data.plan_category_name, value: data._id }));
                setPlanCategory(listdata);
            });
    }
    const getHomePlanTypeList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_home_plan_type?match=${true}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const list = data.data;
                const listdata = list.map((data) => ({ label: data.home_plan_type, value: data._id }));
                setHomePlanList(listdata);
            });
    }
    const MedicalPlanType = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getMedicalPlanTypeList`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const list = data.data;
                const listdata = list.map((data) => ({ label: data.medical_plan_type, value: data._id }));
                setPlanType(listdata);
            });
    }
    const getlistLineOfBusiness = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                const line_of_businessdt = data.data
                const line_of_business_len = line_of_businessdt.length
                const line_of_business_list = []
                for (let i = 0; i < line_of_business_len; i++) {
                    const line_of_business_obj = {
                        label: line_of_businessdt[i].line_of_business_name,
                        value: line_of_businessdt[i]._id,
                    }
                    line_of_business_list.push(line_of_business_obj)
                }
                console.log(line_of_business_list, 'line_of_business_list')
                setLineOfBusiness(line_of_business_list)
            })
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
                setDefaultLocation(location_list)
                setLocation(location_list);
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
    const repair_condition = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getRepairCondition`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const repair_type = data.data;
                const repair_type_dt = repair_type.length;
                const repair_type_obj = [];
                for (let i = 0; i < repair_type_dt; i++) {
                    const repair_type_obj1 = { _id: repair_type[i]['_id'], repair_type_name: repair_type[i]['repair_type_name'] };
                    repair_type_obj.push(repair_type_obj1);
                }
                setRepairCondition(repair_type_obj);
            });
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected
        setPage(selectedPage + 1)
        getAll_Best_Plans(selectedPage + 1, perPage)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const lob = data.get('lob')
        const company_id = data.get('company_id')
        const best_plan_price = data.get('best_plan_price')
        const best_plan_topup = data.get('best_plan_price_topup')
        const nature_of_plan = data.get('nature_of_plan')
        let payloadbody = {}
        if (selectedlob.label == 'Travel') {
            if (deftravelinsurancefor.length == 0) {
                swal({
                    title: 'Alert!',
                    text: 'Please select Travel Insurance For',
                    type: 'warning',
                    icon: 'warning',
                })
                return false
            }
            if (deftravelcovertype.length == 0) {
                swal({
                    title: 'Alert!',
                    text: 'Please select Cover Type',
                    type: 'warning',
                    icon: 'warning',
                })
                return false
            }
            payloadbody = {
                lob: lob,
                company_id: company_id,
                best_plan_price: best_plan_price,
                best_plan_topup: best_plan_topup,
                travel_insurance_for: deftravelinsurancefor,
                travel_cover_type: deftravelcovertype,
                location: defaultlocation,
                nature_of_plan: nature_of_plan
            }
        } else if (selectedlob.label == 'Motor' || selectedlob.label == 'Yacht') {
            if (selectedplan.length == 0) {
                swal({
                    title: 'Alert!',
                    text: 'Please select Policy Type',
                    type: 'warning',
                    icon: 'warning',
                })
                return false
            }
            if (defaultPlancategory.length == 0) {
                swal({
                    title: 'Alert!',
                    text: 'Please select Plan Category',
                    type: 'warning',
                    icon: 'warning',
                })
                return false
            }
            payloadbody = {
                lob: lob,
                company_id: company_id,
                best_plan_price: best_plan_price,
                best_plan_topup: best_plan_topup,
                location: defaultlocation,
                plan_category: defaultPlancategory,
                policy_type: selectedplan,
                nature_of_plan: nature_of_plan
            }
        } else if (selectedlob.label == 'Home') {
            if (homeplanType.length == 0) {
                swal({
                    title: 'Alert!',
                    text: 'Please select Home Plan Type',
                    type: 'warning',
                    icon: 'warning',
                })
                return false
            }
            if (defaultPlancategory.length == 0) {
                swal({
                    title: 'Warning!',
                    text: 'Please select Plan Category',
                    type: 'warning',
                    icon: 'warning',
                })
                return false
            }
            payloadbody = {
                lob: lob,
                company_id: company_id,
                best_plan_price: best_plan_price,
                best_plan_topup: best_plan_topup,
                location: defaultlocation,
                plan_category: defaultPlancategory,
                home_plan_type: homeplanType,
                nature_of_plan: nature_of_plan
            }
        }
        else if (selectedlob.label == 'Medical') {
            if (defmedicalcovertype.length == 0) {
                swal({
                    title: 'Error!',
                    text: 'Please select Medical Plan Type',
                    type: 'warning',
                    icon: 'warning',
                })
                return false
            }
            if (defaultPlancategory.length == 0) {
                swal({
                    title: 'Error!',
                    text: 'Please select Plan Category',
                    type: 'waring',
                    icon: 'warning',
                })
                return false
            }
            payloadbody = {
                lob: lob,
                company_id: company_id,
                best_plan_price: best_plan_price,
                best_plan_topup: best_plan_topup,
                location: defaultlocation,
                plan_category: defaultPlancategory,
                medical_plan_type: defmedicalcovertype,
                nature_of_plan: nature_of_plan
            }
        }
        axios.post(`https://insuranceapi-3o5t.onrender.com/api/addBestPlan`, payloadbody)
            .then((data) => {
                if (data.status == 201) {
                    setShowModal(false)
                    swal({
                        text: data.data?.message,
                        type: 'success',
                        icon: 'success',
                    }).then(function () {
                        getAll_Best_Plans(page, perPage)
                    })
                } else {
                    setShowModal(false)
                    swal({
                        title: 'Error!',
                        text: data.data?.message,
                        type: 'error',
                        icon: 'error',
                    }).then(function () {
                    })
                }
            })

    }
    const updatestatus = async (id, status) => {

        axios.post(`https://insuranceapi-3o5t.onrender.com/api/updateBestPlanStatus?id=${id}&status=${status}`)
            .then((data) => {
                if (data.status == 200) {
                    setShowModal(false)
                    swal({
                        text: data.data.message,
                        type: 'success',
                        icon: 'success',
                    }).then(function () {
                        getAll_Best_Plans(page, perPage)
                    })
                } else {
                    setShowModal(false)
                    swal({
                        title: 'Error!',
                        text: data.data?.message,
                        type: 'error',
                        icon: 'error',
                    }).then(function () {
                        getAll_Best_Plans(page, perPage)
                    })
                }
            })
        // gettestimonials(page, perPage)
    }
    const getAll_Best_Plans = (page, perPage) => {

        try {
            axios.get(`https://insuranceapi-3o5t.onrender.com/api/getAllBestPlans?page=${page}&perPage=${perPage}`)
                // .then((res) => res.json())
                .then((data) => {
                    if (data.status == 200) {
                        const total = data.data.count;
                        const slice = total / perPage;
                        const pages = Math.ceil(slice);
                        setPageCount(pages);
                        console.log(data.data.data, 'data.data.data')
                        setBestPlans(data.data.data)
                        setShowModal(false)
                    } else {
                        setShowModal(false)
                        swal({
                            title: 'Error!',
                            text: data.data.message,
                            type: 'error',
                            icon: 'error',
                        }).then(function () {
                        })
                    }
                })

        } catch (error) {
            console.log(error.message)
        }
    }
    const getSingleBest_Plan = (id) => {
        try {
            axios.get(`https://insuranceapi-3o5t.onrender.com/api/getbestplanbyid?id=${id}`)
                // .then((res) => res.json())
                .then((data) => {
                    if (data.status == 201) {
                        console.log(data.data?.data[0], '>>>>>>> Update data')
                        setUpdateData(data.data?.data[0])
                        const aldata = data.data?.data[0]?.location
                        const location_list = [];
                        for (let i = 0; i < aldata?.length; i++) {
                            const location_obj = { label: aldata[i].location_name, value: aldata[i]._id };
                            location_list.push(location_obj);
                        }
                        setDefaultLocation(location_list)
                        const planCategory = data.data?.data[0]?.plan_category;
                        const plancat = planCategory?.map(data => ({
                            label: data.plan_category_name,
                            value: data._id,
                        }));
                        const policyTypes = data.data?.data[0]?.policy_types;
                        const policyt = policyTypes?.map(data => ({
                            label: data.policy_type_name,
                            value: data._id,
                        }));
                        setSelectedPlan(policyt)
                        setDefaultPlanCategory(plancat)
                        const plandetails = data.data?.data[0]?.policy_types;
                        const plan_id = plandetails?.map(data => ({
                            label: data.policy_type_name,
                            value: data._id,
                        }));

                        // setPolicy_type_id(plan_id)
                        const lobdetails = data.data?.data[0]?.lob_result;
                        const lob_id = lobdetails?.map(data => ({
                            label: data.line_of_business_name,
                            value: data._id,
                        }));
                        // setLob_id(lob_id[0])
                        setSelectedlob(lob_id[0])
                        const locationdetails = data.data?.data[0]?.locations;
                        const location_id = locationdetails?.map(data => ({
                            label: data.location_name,
                            value: data._id,
                        }));
                        // handleChange(location_id)
                        const travel_id = data.data?.data[0]?.travel_insurance_for;
                        const travel_insurance_for = travel_id?.map(data => ({
                            label: data.travel_insurance_for,
                            value: data._id,
                        }));
                        setDefTravelInsuranceFor(travel_insurance_for)
                        const coverTypeId = data.data?.data[0]?.cover_type;
                        const cover_type = coverTypeId?.map(data => ({
                            label: data.travel_cover_type,
                            value: data._id,
                        }));
                        setDefTravelCoverType(cover_type)
                        const home_plan_type = data.data?.data[0]?.home_plan_type;
                        const home_plan_type_id = home_plan_type?.map(data => ({
                            label: data.home_plan_type,
                            value: data._id,
                        }));
                        setDefHomePlanType(home_plan_type_id)
                        const medical_plan_type = data.data?.data[0]?.medical_plan_type;
                        const medical_plan_type_id = medical_plan_type?.map(data => ({
                            label: data.medical_plan_type,
                            value: data._id,
                        }));
                        setVisibleedit(true)
                    } else {
                        setShowModal(false)
                        swal({
                            title: 'Error!',
                            text: data.message,
                            type: 'error',
                            icon: 'error',
                        }).then(function () {
                        })
                    }
                })

        } catch (error) {
            console.log(error.message)
        }
    }
    const handleUpdate = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const lob = data.get('lob')
        const company_id = data.get('company_id')
        const best_plan_price = data.get('best_plan_price')
        const best_plan_topup = data.get('best_plan_price_topup')
        const nature_of_plan = data.get('nature_of_plan')
        let payloadbody = {}
        if (selectedlob.label == 'Travel') {
            if (deftravelinsurancefor.length == 0) {
                swal({
                    title: 'Alert!',
                    text: 'Please select Travel Insurance For',
                    type: 'warning',
                    icon: 'warning',
                })
                return false
            }
            if (deftravelcovertype.length == 0) {
                swal({
                    title: 'Alert!',
                    text: 'Please select Cover Type',
                    type: 'warning',
                    icon: 'warning',
                })
                return false
            }
            payloadbody = {
                lob: lob,
                company_id: company_id,
                best_plan_price: best_plan_price,
                best_plan_topup: best_plan_topup,
                travel_insurance_for: deftravelinsurancefor,
                travel_cover_type: deftravelcovertype,
                nature_of_plan: nature_of_plan,
                location: defaultlocation,
            }
        } else if (selectedlob.label == 'Motor' || selectedlob.label == 'Yacht') {
            if (selectedplan.length == 0) {
                swal({
                    title: 'Alert!',
                    text: 'Please select Policy Type',
                    type: 'warning',
                    icon: 'warning',
                })
                return false
            }
            if (defaultPlancategory.length == 0) {
                swal({
                    title: 'Alert!',
                    text: 'Please select Plan Category',
                    type: 'warning',
                    icon: 'warning',
                })
                return false
            }
            payloadbody = {
                lob: lob,
                company_id: company_id,
                best_plan_price: best_plan_price,
                best_plan_topup: best_plan_topup,
                location: defaultlocation,
                plan_category: defaultPlancategory,
                policy_type: selectedplan,
                nature_of_plan: nature_of_plan
            }
        } else if (selectedlob.label == 'Home') {
            if (homeplanType.length == 0) {
                swal({
                    title: 'Alert!',
                    text: 'Please select Home Plan Type',
                    type: 'warning',
                    icon: 'warning',
                })
                return false
            }
            if (defaultPlancategory.length == 0) {
                swal({
                    title: 'Warning!',
                    text: 'Please select Plan Category',
                    type: 'warning',
                    icon: 'warning',
                })
                return false
            }
            payloadbody = {
                lob: lob,
                company_id: company_id,
                best_plan_price: best_plan_price,
                best_plan_topup: best_plan_topup,
                location: defaultlocation,
                plan_category: defaultPlancategory,
                nature_of_plan: nature_of_plan,
                home_plan_type: homeplanType
            }
        }
        else if (selectedlob.label == 'Medical') {
            if (defmedicalcovertype.length == 0) {
                swal({
                    title: 'Error!',
                    text: 'Please select Medical Plan Type',
                    type: 'warning',
                    icon: 'warning',
                })
                return false
            }
            if (defaultPlancategory.length == 0) {
                swal({
                    title: 'Error!',
                    text: 'Please select Plan Category',
                    type: 'waring',
                    icon: 'warning',
                })
                return false
            }
            payloadbody = {
                lob: lob,
                company_id: company_id,
                best_plan_price: best_plan_price,
                best_plan_topup: best_plan_topup,
                location: defaultlocation,
                nature_of_plan: nature_of_plan,
                plan_category: defaultPlancategory,
                medical_plan_type: defmedicalcovertype
            }
        }
        const updateId = updateData._id
        axios.post(`https://insuranceapi-3o5t.onrender.com/api/updateBestPlan?id=${updateId}`, payloadbody)
            // .then((res) => res.json())
            .then((data) => {
                if (data.status == 200) {
                    setVisibleedit(false)
                    getAll_Best_Plans(page, perPage)
                    swal({
                        text: data.message,
                        type: 'success',
                        icon: 'success',
                    })
                } else {
                    setVisibleedit(false)
                    swal({
                        title: 'Error!',
                        text: data.message,
                        type: 'error',
                        icon: 'error',
                    }).then(function () {
                    })
                }
            })

    }
    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMasterData/?id=${id}&type=best_plan`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getAll_Best_Plans(page, perPage)
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false,
                    })
                    getAll_Best_Plans(page, perPage)
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }
    const startFrom = (page - 1) * perPage;
    return (
        <>
            <Container>
                <div className="card mb-4">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className="card-title">Best Plan</h4>
                            </div>
                            <div className="col-md-6">
                                {masterPermission.best_plan?.includes('create') ? (
                                    <button
                                        className="btn btn-primary"
                                        style={{ float: 'right' }}
                                        onClick={() => setShowModal(true)}
                                    >
                                        Add Best Plan
                                    </button>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <table className="table table-bordered table-responsive ">
                            <thead className="thead-dark">
                                <tr className="table-info">
                                    <th scope="col">#</th>
                                    <th scope="col">LOB</th>
                                    <th scope="col">Company Name</th>
                                    <th scope="col">Plan Price</th>
                                    <th scope="col">Plan Price Topup</th>
                                    <th scope="col">Location</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    BestPlans?.length > 0 ?
                                        BestPlans.map((item, index) =>
                                            <tr key={index}>
                                                <td>{startFrom + index + 1}</td>
                                                <td>{item?.lob[0]?.line_of_business_name}</td>
                                                <td>{item?.company_id[0]?.company_name}</td>
                                                <td>{item?.best_plan_price}</td>
                                                <td>{item?.best_plan_topup}</td>
                                                <td>{item?.location?.map((Val) => Val.location_name)?.join(", ")}</td>
                                                <td>
                                                    {masterPermission.best_plan?.includes('edit') && (
                                                        <button className="btn btn-primary" onClick={() => getSingleBest_Plan(item._id)} >Edit</button>
                                                    )}
                                                    {' '}
                                                    {masterPermission.best_plan?.includes('edit') && (
                                                        <>
                                                            {
                                                                item.status == 1 ?
                                                                    <button className="btn btn-danger mx-1" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                                                    <button className="btn btn-success mx-1" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                                                            }
                                                            <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to Delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ) : <tr>
                                            <td colSpan="6">No Data Found</td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination justify-content-end'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                            activeClassName={'active'}
                        />
                    </div>
                </div>
            </Container>

            <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add best plan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div>
                                        <form
                                            onSubmit={handleSubmit}
                                        >
                                            <div className='row'>
                                                <div className="col-md-4">
                                                    <div className="form-group ">
                                                        <strong>Company Name</strong>
                                                        <select required className="form-control" name="company_id">
                                                            <option value="">Select Company</option>
                                                            {
                                                                companyList.map((item, index) => {
                                                                    return (
                                                                        <option key={index} value={item._id} >{item.company_name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='col-md-4'>
                                                    <div className="form-group ">
                                                        <strong>Line Of Business</strong>
                                                        <select required className="form-control" onChange={(e) => handleLObChange(e)} name="lob">
                                                            <option value="">Select Line Of Business</option>
                                                            {
                                                                LineOfBusiness.map((item, index) => {
                                                                    return (
                                                                        <option key={index} value={item.value + "," + item.label} >{item.label}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>

                                                </div>

                                                {/* <div className="col-md-4">
                                                    <div className="form-group ">
                                                        <strong>Repair Type</strong>
                                                        <select required className="form-control" name="repair_type">
                                                            <option value="">Select Repair Type</option>
                                                            {
                                                                repairCondition.map((item, index) => {
                                                                    return (
                                                                        <option key={index} value={item._id} >{item.repair_type_name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div> */}
                                                {
                                                    selectedlob.label === "Motor" ||
                                                        selectedlob.label === "Yacht" ||
                                                        selectedlob.label === "Medical" ||
                                                        selectedlob.label === "Home" ?
                                                        (
                                                            <div className="col-md-4">
                                                                <div className="form-group mb-3">
                                                                    <label className="form-label"><strong>Select Plan Category</strong></label>

                                                                    <Multiselect
                                                                        options={planCategory}
                                                                        displayValue="label"
                                                                        onSelect={setDefaultPlanCategory}
                                                                        onRemove={setDefaultPlanCategory}
                                                                        placeholder="Select Plan Category"
                                                                        showCheckbox={true}
                                                                        showArrow={true}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : ("")
                                                }
                                                {selectedlob.label === "Motor" || selectedlob.label === "Yacht" ?
                                                    (
                                                        <div className="col-md-4">
                                                            <div className="form-group mb-3">
                                                                <label className="form-label"><strong>Select Policy Type</strong></label>

                                                                <Multiselect
                                                                    options={plan}
                                                                    displayValue="label"
                                                                    onSelect={setSelectedPlan}
                                                                    onRemove={setSelectedPlan}
                                                                    placeholder="Select Policy Type"
                                                                    showCheckbox={true}
                                                                    showArrow={true}
                                                                    required
                                                                />

                                                            </div>
                                                        </div>
                                                    ) : ("")
                                                }
                                                {
                                                    selectedlob.label === "Travel" ? (
                                                        <>
                                                            <div className="col-md-4">
                                                                <div className="form-group mb-3">
                                                                    <strong><label>Travel Insurance For</label></strong>
                                                                    <Multiselect
                                                                        options={TravelInsuranceFor}
                                                                        // selectedValues={lob}
                                                                        displayValue="label"
                                                                        onSelect={setDefTravelInsuranceFor}
                                                                        onRemove={setDefTravelInsuranceFor}
                                                                        placeholder="Select Travel Insurance For"
                                                                        showArrow={true}
                                                                        showCheckbox={true}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group mb-3">
                                                                    <strong><label>Cover Type</label></strong>
                                                                    <Multiselect
                                                                        options={travel_cover_type}
                                                                        // selectedValues={lob}
                                                                        displayValue="label"
                                                                        onSelect={setDefTravelCoverType}
                                                                        onRemove={setDefTravelCoverType}
                                                                        placeholder="Select Travel Cover Type"
                                                                        showArrow={true}
                                                                        showCheckbox={true}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : ("")
                                                }
                                                {
                                                    selectedlob.label === "Home" ? (
                                                        <>
                                                            <div className="col-md-4">
                                                                <div className="form-group mb-3">
                                                                    <label className="form-label"><strong>Home Plan Type</strong></label>
                                                                    <Multiselect
                                                                        options={HomePlanList}
                                                                        // selectedValues={lob}
                                                                        displayValue="label"
                                                                        onSelect={setDefHomePlanType}
                                                                        onRemove={setDefHomePlanType}
                                                                        placeholder="Select Home Plan Type"
                                                                        showArrow={true}
                                                                        showCheckbox={true}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : ("")
                                                }
                                                {
                                                    selectedlob.label === "Medical" ? (

                                                        <div className="col-md-4">
                                                            <div className="form-group mb-3">
                                                                <strong><label>Medical Plan Type</label></strong>
                                                                <Multiselect
                                                                    options={PlanType}
                                                                    // selectedValues={lob}
                                                                    displayValue="label"
                                                                    onSelect={setDefMedicalPlanType}
                                                                    onRemove={setDefMedicalPlanType}
                                                                    placeholder="Select Home Plan Type"
                                                                    showArrow={true}
                                                                    showCheckbox={true}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                    ) : ("")
                                                }
                                                <div className="col-md-4">
                                                    <div className="form-group ">
                                                        <strong>Nature of Plan</strong>
                                                        <select required className="form-control" name="nature_of_plan">
                                                            <option value="">Select Nature of Plan</option>
                                                            {
                                                                natureOfPlan.map((item, index) => {
                                                                    return (
                                                                        <option key={index} value={item._id} >{item.nature_of_plan_name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Best Plan Price</strong></label>
                                                        <input type='text' className="form-control" name='best_plan_price' placeholder='Enter best plan price' autoComplete='off' required />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Best Plan Price Topup</strong></label>
                                                        <input type='text' className="form-control" name='best_plan_price_topup' placeholder='Enter best plan price topup' autoComplete='off' required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Location</label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={location}
                                                            onSelect={(evnt) => (setDefaultLocation(evnt))}
                                                            onRemove={(evnt) => (setDefaultLocation(evnt))}
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

                                            <div>
                                                <button className='btn btn-primary my-2 mx-2' type="submit">Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal size="lg" show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Best Plan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form method="PUT"
                                            onSubmit={handleUpdate}
                                        >
                                            <div className='row'>
                                                <div className="col-md-4">
                                                    <strong>Company Name</strong>
                                                    <select required className="form-control" name="company_id">
                                                        <option value="">Select Company</option>
                                                        {
                                                            companyList.map((item, index) => {
                                                                return (
                                                                    <option key={index} value={item._id} selected={updateData.company_id == item._id ? true : false}>{item.company_name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className='col-md-4'>
                                                    <div className="form-group ">
                                                        <strong>Line Of Business</strong>
                                                        <select required className="form-control" onChange={(e) => handleLObChange(e)} name="lob">
                                                            <option value="">Select Line Of Business</option>
                                                            {
                                                                LineOfBusiness.map((item, index) => {
                                                                    return (
                                                                        <option key={index} value={item.value + "," + item.label} selected={item.value == updateData.lob ? true : false}>{item.label}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>

                                                </div>
                                                {
                                                    selectedlob.label === "Motor" ||
                                                        selectedlob.label === "Yacht" ||
                                                        selectedlob.label === "Medical" ||
                                                        selectedlob.label === "Home" ?
                                                        (
                                                            <div className="col-md-4">
                                                                <div className="form-group mb-3">
                                                                    <label className="form-label"><strong>Select Plan Category</strong></label>
                                                                    <Multiselect
                                                                        options={planCategory}
                                                                        selectedValues={defaultPlancategory}
                                                                        displayValue="label"
                                                                        onSelect={setDefaultPlanCategory}
                                                                        onRemove={setDefaultPlanCategory}
                                                                        placeholder="Select Plan Category"
                                                                        showCheckbox={true}
                                                                        showArrow={true}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : ("")
                                                }
                                                {selectedlob.label === "Motor" || selectedlob.label === "Yacht" ?
                                                    (
                                                        <div className="col-md-4">
                                                            <div className="form-group mb-3">
                                                                <label className="form-label"><strong>Select Policy Type</strong></label>

                                                                <Multiselect
                                                                    options={plan}
                                                                    displayValue="label"
                                                                    selectedValues={selectedplan}
                                                                    onSelect={setSelectedPlan}
                                                                    onRemove={setSelectedPlan}
                                                                    placeholder="Select Policy Type"
                                                                    showCheckbox={true}
                                                                    showArrow={true}
                                                                    required
                                                                />

                                                            </div>
                                                        </div>
                                                    ) : ("")
                                                }
                                                {
                                                    selectedlob.label === "Travel" ? (
                                                        <>
                                                            <div className="col-md-4">
                                                                <div className="form-group mb-3">
                                                                    <strong><label>Travel Insurance For</label></strong>
                                                                    <Multiselect
                                                                        options={TravelInsuranceFor}
                                                                        selectedValues={deftravelinsurancefor}
                                                                        displayValue="label"
                                                                        onSelect={setDefTravelInsuranceFor}
                                                                        onRemove={setDefTravelInsuranceFor}
                                                                        placeholder="Select Travel Insurance For"
                                                                        showArrow={true}
                                                                        showCheckbox={true}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group mb-3">
                                                                    <strong><label>Travel Cover Type</label></strong>
                                                                    <Multiselect
                                                                        options={travel_cover_type}
                                                                        selectedValues={deftravelcovertype}
                                                                        displayValue="label"
                                                                        onSelect={setDefTravelCoverType}
                                                                        onRemove={setDefTravelCoverType}
                                                                        placeholder="Select Travel Cover Type"
                                                                        showArrow={true}
                                                                        showCheckbox={true}
                                                                        required
                                                                    />

                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : ("")
                                                }
                                                {
                                                    selectedlob.label === "Home" ? (
                                                        <>
                                                            <div className="col-md-4">
                                                                <div className="form-group mb-3">
                                                                    <label className="form-label"><strong>Home Plan Type</strong></label>
                                                                    <Multiselect
                                                                        options={HomePlanList}
                                                                        selectedValues={homeplanType}
                                                                        displayValue="label"
                                                                        onSelect={setDefHomePlanType}
                                                                        onRemove={setDefHomePlanType}
                                                                        placeholder="Select Travel Cover Type"
                                                                        showArrow={true}
                                                                        showCheckbox={true}
                                                                        required
                                                                    />

                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : ("")
                                                }
                                                {
                                                    selectedlob.label === "Medical" ? (
                                                        <div className='col-md-4'>
                                                            <div className="form-group mb-3">
                                                                <strong><label>Medical Plan Type</label></strong>
                                                                <Multiselect
                                                                    options={PlanType}
                                                                    selectedValues={defmedicalcovertype}
                                                                    displayValue="label"
                                                                    onSelect={setDefMedicalPlanType}
                                                                    onRemove={setDefMedicalPlanType}
                                                                    placeholder="Select Home Plan Type"
                                                                    showArrow={true}
                                                                    showCheckbox={true}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : ("")
                                                }

                                                {/* <div className="col-md-4">
                                                    <strong>Repair Type</strong>
                                                    <select required className="form-control" name="repair_type">
                                                        <option value="">Select Repair Type</option>
                                                        {
                                                            repairCondition.map((item, index) => {
                                                                return (
                                                                    <option key={index} value={item._id} selected={updateData.repair_type == item._id ? true : false}>{item.repair_type_name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div> */}
                                                <div className="col-md-4">
                                                    <strong>Nature of Plan</strong>
                                                    <select required className="form-control" name="nature_of_plan">
                                                        <option hidden value="">Select Nature of Plan</option>
                                                        {
                                                            natureOfPlan.map((item, index) => {
                                                                return (
                                                                    <option key={index} value={item._id} selected={updateData.nature_of_plan == item._id ? true : false}>{item.nature_of_plan_name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Best plan Price</strong></label>
                                                        <input type='text' className="form-control" name='best_plan_price' placeholder='Enter Best plan price Description' defaultValue={updateData?.best_plan_price} autoComplete='off' required />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Best Plan Price Topup</strong></label>
                                                        <input type='text' className="form-control" name='best_plan_price_topup' placeholder='Enter best plan price topup' defaultValue={updateData?.best_plan_topup} autoComplete='off' required />
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Location</label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={defaultlocation}
                                                            onSelect={(evnt) => (setDefaultLocation(evnt))}
                                                            onRemove={(evnt) => (setDefaultLocation(evnt))}
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
                                            <div>
                                                <button className='btn btn-primary my-2 mx-2' type="submit">Update</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setVisibleedit(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default View_Best_Plan
