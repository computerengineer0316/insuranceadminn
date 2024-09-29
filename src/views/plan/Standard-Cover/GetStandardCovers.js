import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Row, Modal, Button } from 'react-bootstrap';
import Multiselect from "multiselect-react-dropdown";
import filePath from '../../../webroot/sample-files/Standard-Cover.xlsx';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';

const GetStandardCovers = () => {
    const navigate = useNavigate();
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [lob, setLob] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [standardcover, setstandardcover] = useState([]);
    const [standard_cover_label, setstandard_cover_label] = useState();
    const [standard_cover_description, setstandard_cover_description] = useState();
    const [standard_cover_status, setstandard_cover_status] = useState();
    const [standard_cover_id, setstandard_cover_id] = useState();
    const [editselectedoption, setEditSelectedLOB] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editshowModal, setEditShowModal] = useState(false);
    const [excelfile, setExcelfile] = useState("");
    const [masterpermission, setMasterpermission] = useState([]);
    const [company, setCompany] = useState([]);
    const [selectedcompany, setSelectedCompanies] = useState([]);
    const [plan, setPlan] = useState([]);
    const [selectedplan, setSelectedPlan] = useState([]);
    const [location, setLocation] = useState([]);
    const [locationData, setLocationData] = useState([])
    const [defaultCompany, setDefaultCompany] = useState([])
    const [selectedPlanCategory, setSelectedPlanCategory] = useState([])
    const [selectedlob, setSelectedlob] = useState([])
    const [searchvalue, setSearchvalue] = useState('');
    const [nodata, setNodata] = useState('');
    const [statusvalue, setStatusvalue] = useState(2);
    const [filterlob, setFilterLOB] = useState('');
    const [planCategory, setPlanCategory] = useState([]);
    const [defaultPlancategory, setDefaultPlanCategory] = useState([])
    const [TravelInsuranceFor, setTravelInsuranceFor] = useState([]);
    const [travel_cover_type, setTravelCoverType] = useState([]);
    const [HomePlanList, setHomePlanList] = useState([]);
    const [PlanType, setPlanType] = useState([]);
    const [deftravelinsurancefor, setDefTravelInsuranceFor] = useState([]);
    const [homeplanType, setDefHomePlanType] = useState([]);
    const [defmedicalcovertype, setDefMedicalPlanType] = useState([]);




    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getstandardcover(page, perPage);
            lobList();
            const userdata = JSON.parse(localStorage.getItem('user'));
            const master_permission = userdata?.master_permission?.[0] || {};
            setMasterpermission(master_permission);
            getCompanylist();
            travel_insurance_for();
            travel_cover_type_list();
            getPlanlist();
            locationList();
            Plancategory();
            getHomePlanTypeList();
            MedicalPlanType()
        }
    }, [])

    useEffect(() => {
        getstandardcover(page, perPage);
    }, [searchvalue, filterlob, statusvalue])

    const getstandardcover = async (page, perPage) => {
        setstandardcover([]);
        const requestOptions =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_standard_covers?page=${page}&limit=${perPage}&name=${searchvalue}&lob=${filterlob}&status=${statusvalue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNodata(data.message)
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                setstandardcover(list)
            });
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getstandardcover(selectedPage + 1, perPage);
    };


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
                handlelocationbefore(location_list);
            });
    }

    const lobList = () => {
        const userdata = JSON.parse(localStorage.getItem('user'));
        const lob = userdata.line_of_business;
        if (lob.length > 0) {
            const lobdt = lob;
            const lob_len = lobdt.length;
            const lob_list = [];
            for (let i = 0; i < lob_len; i++) {
                const lob_obj = { label: lobdt[i].lob_name, value: lobdt[i].lob_id };
                lob_list.push(lob_obj);
            }
            setLob(lob_list);
            handlelobbefore(lob_list);
        }
        else {
            const requestOptions =
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const lobdt = data.data;
                    const lob_len = lobdt.length;
                    const lob_list = [];
                    for (let i = 0; i < lob_len; i++) {
                        const lob_obj = { label: lobdt[i].line_of_business_name, value: lobdt[i]._id };
                        lob_list.push(lob_obj);
                    }
                    setLob(lob_list);
                    handlelobbefore(lob_list);
                });
        }
    }



    const updatestatus = async (id, standard_cover_status) => {
        let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_standard_cover_status', {
            method: 'post',
            body: JSON.stringify({ id, standard_cover_status }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        result = await result.json();
        swal("Updated Succesfully", "", "success");
        getstandardcover(page, perPage)
    }


    const addstandardcover = async (e) => {
        e.preventDefault();
        try {

            // const plan_category_id = e.target.plan_category_id.value;


            // .map(({ value }) => value).join(',');


            console.log("standard_cover_label", standard_cover_label)
            console.log("standard_cover_description", standard_cover_description)
            console.log("selectedcompany", selectedcompany)
            console.log("selectedplan", selectedplan)//
            console.log("standard_cover_lob", selectedlob)
            console.log("location", selectedOption)

            // return false;
            if (selectedcompany.length === 0) {
                swal("Please Select Company", "", "error");
                return false;
            }
            else if (selectedplan.length === 0 && selectedlob.label === 'Motor') {
                swal("Please Select Policy Type", "", "error");
                return false;
            }
            else if (selectedlob.length === 0) {
                swal("Please Select Line of Business", "", "error");
                return false;
            }
            else if (selectedOption.length === 0) {
                swal("Please Select Location", "", "error");
                return false;
            } else {
                let payloadbody = {};
                const standard_cover_label = e.target.standard_cover_label.value;
                const standard_cover_description = e.target.standard_cover_description.value;

                if (selectedlob.label == 'Travel') {
                    //    const  travel_insurance_for = e.target.travel_insurance_for.value;
                    //     const cover_type = e.target.travel_cover_type.value;
                    payloadbody = {
                        standard_cover_label: standard_cover_label,
                        standard_cover_description: standard_cover_description,
                        standard_cover_company: selectedcompany,
                        standard_cover_lob: [selectedlob],
                        travel_insurance_for: deftravelinsurancefor,
                        cover_type: deftravelcovertype,
                        location: selectedOption,
                    }
                } else if (selectedlob.label == 'Motor' || selectedlob.label == 'Yacht') {
                    payloadbody = {
                        standard_cover_label: standard_cover_label,
                        standard_cover_description: standard_cover_description,
                        standard_cover_company: selectedcompany,
                        standard_cover_plan: selectedplan,
                        standard_cover_lob: [selectedlob],
                        location: selectedOption,
                        plan_category_id: defaultPlancategory
                    }
                } else if (selectedlob.label == 'Home') {
                    payloadbody = {
                        standard_cover_label: standard_cover_label,
                        standard_cover_description: standard_cover_description,
                        standard_cover_company: selectedcompany,
                        standard_cover_plan: selectedplan,
                        standard_cover_lob: [selectedlob],
                        location: selectedOption,
                        plan_category_id: defaultPlancategory,
                        home_plan_type: homeplanType
                    }
                }
                else if (selectedlob.label == 'Medical') {
                    payloadbody = {
                        standard_cover_label: standard_cover_label,
                        standard_cover_description: standard_cover_description,
                        standard_cover_company: selectedcompany,
                        standard_cover_plan: selectedplan,
                        standard_cover_lob: [selectedlob],
                        location: selectedOption,
                        plan_category_id: defaultPlancategory,
                        medical_plan_type: defmedicalcovertype
                    }
                }
                else {
                    payloadbody = {
                        standard_cover_label: standard_cover_label,
                        standard_cover_description: standard_cover_description,
                        standard_cover_company: selectedcompany,
                        standard_cover_lob: [selectedlob],
                        location: selectedOption,
                        plan_category_id: defaultPlancategory
                    }
                }
                const requestOptions =
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payloadbody)
                };
                await fetch('https://insuranceapi-3o5t.onrender.com/api/add_standard_cover', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 200) {
                            setShowModal(false);
                            swal({
                                text: data.message,
                                icon: "success",
                                button: false,
                            })
                            getstandardcover(page, perPage);
                            setTimeout(() => {
                                swal.close()
                            }, 1000);
                        }
                        else {
                            setShowModal(false);
                            swal({
                                title: "Error!",
                                text: data.message,
                                icon: "error",
                                button: false,
                            })
                            getstandardcover(page, perPage);
                        }
                    });
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const handlelobbefore = (value) => {
        setSelectedlob(value);
    }

    const handlelocationbefore = (value) => {
        setSelectedOption(value);
    }


    const handlecomapny = (event) => {
        console.log(event)
        setEditSelectedCompanies(event)
        setCompany_id(event)
    }
    const handleCategory = (event) => {
        setEditSelectedCategory(event)
    }

    const handleplan = (value) => {
        setEditSelectedPlan(value)
    }

    const handleChange = (value) => {
        setEditSelectedLocation(value);
    };

    const handlelobChange = (value) => {
        setEditSelectedlob(value);
    };

    const [companyid, setCompany_id] = useState([]);
    const [policy_type_id, setPolicy_type_id] = useState([]);
    const [lob_id, setLob_id] = useState([]);
    const [location_id, setLocation_id] = useState([]);
    // const [deftravelinsurancefor, setDefTravelInsuranceFor] = useState();
    const [deftravelcovertype, setDefTravelCoverType] = useState([]);



    const detailsbyid = async (ParamValue) => {

        try {
            setLob_id([])
            setSelectedlob([])
            setstandard_cover_id(ParamValue)
            const requestOptions = {
                method: "post",
                body: JSON.stringify({ ParamValue }),
                headers: {
                    "Content-Type": "application/json",
                },
            };

            await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_standard_coverbyid`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    setstandard_cover_description(data.data[0]?.standard_cover_description)
                    setstandard_cover_label(data.data[0]?.standard_cover_label)
                    const companydetails = data.data[0]?.company;
                    console.log(companydetails, ">>>>>>>>>>>>>>>>>>>>> companydetails")
                    const company_id = companydetails.map(data => ({
                        label: data.company_name,
                        value: data._id,
                    }));
                    setCompany_id(company_id)
                    console.log(data.data[0], ">>>>>>>>>>>>> plan_category")
                    const plan_category = data.data[0]?.plan_category;
                    const plan_category_id = plan_category?.map(data => ({
                        label: data.plan_category_name,
                        value: data._id,
                    }));
                    setSelectedPlanCategory(plan_category_id)
                    setDefaultPlanCategory(plan_category_id)
                    setEditSelectedCategory(plan_category_id)
                    const plandetails = data.data[0]?.policy_types;
                    const plan_id = plandetails?.map(data => ({
                        label: data.policy_type_name,
                        value: data._id,
                    }));
                    setPolicy_type_id(plan_id)
                    const lobdetails = data.data[0]?.lob_result;
                    const lob_id = lobdetails?.map(data => ({
                        label: data.line_of_business_name,
                        value: data._id,
                    }));
                    setLob_id(lob_id[0])
                    setSelectedlob(lob_id[0])
                    const locationdetails = data.data[0]?.locations;
                    const location_id = locationdetails?.map(data => ({
                        label: data.location_name,
                        value: data._id,
                    }));
                    setLocation_id(location_id)
                    handleChange(location_id)
                    const travel_id = data.data[0]?.travel_insurance_for;
                    const travel_insurance_for = travel_id?.map(data => ({
                        label: data.travel_insurance_for,
                        value: data._id,
                    }));
                    setDefTravelInsuranceFor(travel_insurance_for)
                    const coverTypeId = data.data[0]?.cover_type;
                    const cover_type = coverTypeId?.map(data => ({
                        label: data.travel_cover_type,
                        value: data._id,
                    }));
                    setDefTravelCoverType(cover_type)
                    const home_plan_type = data.data[0]?.home_plan_type;
                    const home_plan_type_id = home_plan_type?.map(data => ({
                        label: data.home_plan_type,
                        value: data._id,
                    }));
                    setDefHomePlanType(home_plan_type_id)
                    const medical_plan_type = data.data[0]?.medical_plan_type;
                    const medical_plan_type_id = medical_plan_type?.map(data => ({
                        label: data.medical_plan_type,
                        value: data._id,
                    }));
                    setDefMedicalPlanType(medical_plan_type_id)
                    setEditShowModal(true);

                })
        } catch (err) {
            console.log(err)
        }




        // result = await result.json();
        // setDefaultCompany(result.data[0]?.company)
        // // setDefaultPolicyType(result.data[0].policy_types)
        // setstandard_cover_description(result.data[0]?.standard_cover_description);
        // setstandard_cover_status(result.data.standard_cover_status);
        // handleplan(result.data[0]?.policy_types)
        // setSelectedCompany(result.data[0]?.company)
        // handlelobChange(result.data[0]?.lob_result);
        // handleChange(result.data[0]?.locations)
        // setEditShowModal(true);

    }


    const [editselectedcompany, setEditSelectedCompanies] = useState([]);
    const [editselectedplan, setEditSelectedPlan] = useState([]);
    const [editselectedlob, setEditSelectedlob] = useState([]);
    const [editselectedlocation, setEditSelectedLocation] = useState([]);
    const [editselectedCategory, setEditSelectedCategory] = useState([]);

    const editstandardcover = async (e) => {
        e.preventDefault();
        const ParamValue = standard_cover_id;

        const standard_cover_description = e.target.standard_cover_description.value;
        const standard_cover_label = e.target.standard_cover_label.value;
        let payloadbody = {};
        if (selectedlob.label == 'Travel') {
            payloadbody = {
                ParamValue: ParamValue,
                standard_cover_label: standard_cover_label,
                standard_cover_description: standard_cover_description,
                standard_cover_company: companyid,
                standard_cover_lob: [selectedlob],
                travel_insurance_for: deftravelinsurancefor,
                cover_type: deftravelcovertype,
                location: editselectedlocation,
                plan_category_id: defaultPlancategory
            }
        } else if (selectedlob.label == 'Motor' || selectedlob.label == 'Yacht') {
            payloadbody = {
                ParamValue: ParamValue,
                standard_cover_label: standard_cover_label,
                standard_cover_description: standard_cover_description,
                standard_cover_company: companyid,
                standard_cover_plan: policy_type_id,
                standard_cover_lob: [selectedlob],
                location: editselectedlocation,
                plan_category_id: defaultPlancategory
            }
        } else if (selectedlob.label == 'Home') {
            // const home_plan_type = e.target.home_plan_type.value;
            payloadbody = {
                ParamValue: ParamValue,
                standard_cover_label: standard_cover_label,
                standard_cover_description: standard_cover_description,
                standard_cover_company: companyid,
                standard_cover_lob: [selectedlob],
                location: editselectedlocation,
                plan_category_id: defaultPlancategory,
                home_plan_type: homeplanType

            }
        } else if (selectedlob.label == 'Medical') {
            // const medical_plan_type = e.target.medical_plan_type.value;
            payloadbody = {
                ParamValue: ParamValue,
                standard_cover_label: standard_cover_label,
                standard_cover_description: standard_cover_description,
                standard_cover_company: companyid,
                standard_cover_lob: [selectedlob],
                location: editselectedlocation,
                plan_category_id: defaultPlancategory,
                medical_plan_type: defmedicalcovertype
            }
        }
        else {
            payloadbody = {
                ParamValue: ParamValue,
                standard_cover_label: standard_cover_label,
                standard_cover_description: standard_cover_description,
                standard_cover_company: companyid,
                standard_cover_lob: [selectedlob],
                location: editselectedlocation,
                plan_category_id: defaultPlancategory
            }
        }

        const requestOptions =
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payloadbody)
        };
        await fetch('https://insuranceapi-3o5t.onrender.com/api/update_standard_cover', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {

                    swal({
                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false
                    });
                    setEditShowModal(false);
                    getstandardcover(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                    });
                }
            });
    }

    const fileType = 'xlsx'
    const exporttocsv = () => {
        const ws = XLSX.utils.json_to_sheet(standardcover);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "Standard-Cover" + ".xlsx")
    }

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_standard_cover_excel",
            {
                method: "post",
                body: fd,
            });
        result = await result.json();
        setVisible(!visible)
        swal("Uploaded Succesfully", "", "success");
        getstandardcover(page, perPage)
    }

    const startFrom = (page - 1) * perPage;


    const getCompanylist = async (e) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch('https://insuranceapi-3o5t.onrender.com/api/getCompany', requestOptions)
            .then(response => response.json())
            .then(data => {
                let company = data.data;
                const company_list = company.map((data) => ({ label: data.company_name, value: data._id }));
                setCompany(company_list);
            });
    }


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

    const deletedata = async (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMotorMaster/?id=${id}&type=standardCover`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getstandardcover(page, perPage)
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
                    getstandardcover(page, perPage)
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
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

    const AddCoverToAllPlan = async (desc, label, type) => {

        const requestOptions = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyid: editselectedcompany,
                lobId: editselectedlob,
                policyTypeId: editselectedplan,
                planCategoriesId: editselectedCategory,
                standard_cover_id: standard_cover_id,
                standard_cover_label: label,
                standard_cover_desc: desc,
                coveredType: type,
            })
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/quotesStanderedCovered`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    // alert(`${data.message}`)
                    swal({
                        title: "Success!",
                        icon: "success",
                        text: data.message + `\n\n Motor Plans : \n`
                            + data.Motor + `\n\n Travel Plans : \n`
                            + data.Travel + `\n\n Home Plans : \n`
                            + data.Home + `\n\n Yacht Plans : \n`
                            + data.Yatch + `\n\n Medical Plans : \n`
                            + data.Medical,
                        confirm: 'ok',
                    })
                        .then(() => {
                            getstandardcover(page, perPage)

                        });
                    // setTimeout(() => {
                    // swal.close()
                    // },1000);
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: 'Ok',
                    })
                        .then(() => {
                            getstandardcover(page, perPage)

                        });
                    // getstandardcover(page, perPage)
                    // setTimeout(() => {
                    // swal.close()
                    // }, 1000);
                }

            })
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
    const ShowAddCoverModal = () => {
        setShowModal(true)
        setLob_id([])
        setSelectedlob([])
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card ">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Standard Covers</h4>
                                </div>
                                <div className="col-md-6">
                                    {masterpermission.standard_cover?.includes('create') ?
                                        <button className='btn btn-primary' style={{ float: "right" }} onClick={() => ShowAddCoverModal()}>Add Standard Cover</button>
                                        : ''}
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className='row card-header' style={{ marginLeft: '10px', marginRight: '10px', alignItems: 'center', paddingTop: '5px', paddingBottom: '5px', }}>
                                <div className="col-lg-12" style={{ textAlign: 'right', float: "right" }}>
                                    {masterpermission.standard_cover?.includes('download') ?
                                        <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                                        : ''}
                                    {masterpermission.standard_cover?.includes('upload') ?
                                        <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                                        : ''}
                                    {masterpermission.standard_cover?.includes('export') ?
                                        <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                                        : ''}
                                </div>
                            </div>
                            <div className='row card-header' style={{ marginLeft: '10px', marginRight: '10px', alignItems: 'center', paddingTop: '5px', paddingBottom: '5px' }}>
                                <div className='col-lg-3'>
                                    <label><strong>Search</strong></label><br />
                                    <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearchvalue(e.target.value)} />

                                </div>
                                <div className='col-lg-3'>
                                    <label><strong>Select LOB</strong></label><br />
                                    <select className='form-control'
                                        value={filterlob}
                                        onChange={(e) => setFilterLOB(e.target.value)}
                                    >
                                        <option hidden>Select LOB</option>
                                        <option value=''>-- All --</option>

                                        {
                                            lob.map((item, index) =>
                                                <option key={index} value={item.value}>{item.label}</option>
                                            )}

                                    </select>

                                </div>
                                <div className='col-lg-3'>
                                    <label><strong>Status</strong></label><br />
                                    <select className='form-control'
                                        value={statusvalue}
                                        onChange={(e) => setStatusvalue(e.target.value)}
                                    >
                                        <option value={2}>-- All --</option>
                                        <option value={1}>Active</option>
                                        <option value={0}>Inactive</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                        <div className="card-body" style={{ overflow: 'scroll' }}>
                            <table className="table table-bordered" >
                                <thead>
                                    <tr>
                                        <th><strong>#</strong></th>
                                        <th><strong>Cover</strong></th>
                                        <th><strong>Description</strong></th>
                                        <th><strong>Location</strong></th>
                                        <th><strong>Line Of Business</strong></th>
                                        <th><strong>Action</strong></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {standardcover && standardcover.length > 0 ?
                                        <>

                                            {
                                                standardcover.map((item, index) =>
                                                    <tr key={index}>
                                                        <td>{startFrom + index + 1}</td>
                                                        <td>{item.standard_cover_label}</td>
                                                        <td>{item.standard_cover_description}</td>
                                                        <td>{item.locations?.map((val) => val.location_name).join(", ")}</td>
                                                        <td>{item.lob_result?.map((val) => val.line_of_business_name).join(", ")}</td>
                                                        <td>
                                                            {/* {masterpermission.standard_cover?.includes('edit') && ( 
                                                        // <input type='radio' onClick={() => detailsbyid(item,"Add")}/>
                                                    // )}
                                                    // {' '}*/}
                                                            {masterpermission.standard_cover?.includes('edit') && (
                                                                <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>
                                                            )}
                                                            {' '}
                                                            {masterpermission.standard_cover?.includes('delete') && (
                                                                <>
                                                                    {
                                                                        item.standard_cover_status === 1 ?
                                                                            <button className="btn btn-danger mr-5" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                                                            <button className="btn btn-success mr-5" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                                                                    }
                                                                </>
                                                            )}
                                                            {' '}
                                                            {masterpermission.standard_cover?.includes('delete') && (
                                                                <button className="btn btn-warning mr-5" onClick={() => { if (window.confirm('Are you sure you wish to Delete this item?')) deletedata(item._id) }}>Delete</button>

                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </>
                                        :
                                        <tr><td colSpan="17" style={{ textAlign: 'center' }}><strong>{nodata}</strong></td></tr>
                                    }
                                </tbody>
                            </table>
                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                breakLabel={"..."}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination justify-content-end"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                                breakClassName={"page-item"}
                                breakLinkClassName={"page-link"}
                                activeClassName={"active"}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Upload Excel File</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <input type="file" className="form-control" id="DHA" defaultValue="" required onChange={(e) => setExcelfile(e.target.files[0])} />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                    <CButton color="primary" onClick={collectExceldata} href={'/Viewtraveltype'}>Upload</CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Standard Cover</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={addstandardcover}>
                                            <div className="row">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label"><strong>Standard Cover Label</strong></label>
                                                            <input type='text' className="form-control"
                                                                name='standard_cover_label'
                                                                placeholder="Enter Standard Cover Label"
                                                                autoComplete='off'
                                                                defaultValue=""
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label"><strong>Standard Cover Description</strong></label>
                                                            <input type='text' className="form-control"
                                                                name='standard_cover_description'
                                                                placeholder="Enter Standard Cover Description"
                                                                autoComplete='off'
                                                                defaultValue=""
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">

                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label"><strong>Select Company</strong></label>

                                                            <Multiselect
                                                                options={company}
                                                                displayValue="label"
                                                                onSelect={setSelectedCompanies}
                                                                onRemove={setSelectedCompanies}
                                                                placeholder="Select Company"
                                                                showCheckbox={true}
                                                                showArrow={true}
                                                                required
                                                            />

                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label className="form-label"><strong>Line Of Business</strong></label>
                                                            <select className="form-control" onChange={(e) => handleLObChange(e)} name="plan_category_id" >
                                                                <option value="" hidden>Select Line Of Buisness</option>
                                                                {lob.map((item, index) => (
                                                                    <option key={index} value={item.value + "," + item.label}>{item.label}</option>
                                                                ))}
                                                            </select>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">

                                                    {
                                                        selectedlob.label === "Motor" ||
                                                            selectedlob.label === "Yacht" ||
                                                            selectedlob.label === "Medical" ||
                                                            selectedlob.label === "Home" ?
                                                            (
                                                                <div className="col-md-6">
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
                                                            <div className="col-md-6">
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
                                                                <div className="col-md-6">
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
                                                                <div className="col-md-6">
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
                                                                <div className="col-md-6">
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

                                                            <div className="col-md-6">
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
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Locations</strong></label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={location}
                                                            displayValue="label"
                                                            onSelect={setSelectedOption}
                                                            onRemove={setSelectedOption}
                                                            placeholder="Select Location"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Submit</button>
                                                </div>
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

            <Modal size='lg' show={editshowModal} onHide={() => setEditShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Standard Cover</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={editstandardcover}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Standard Cover Label</strong></label>
                                                        <input type='text' className="form-control" name='standard_cover_label' placeholder='Enter Standard Cover Label' defaultValue={standard_cover_label} autoComplete='off' required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Standard Cover Description</strong></label>
                                                        <input type='text' className="form-control" name='standard_cover_description' placeholder='Enter Standard Cover Description' defaultValue={standard_cover_description} autoComplete='off' required />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Select Company</strong></label>

                                                        <Multiselect
                                                            options={company}
                                                            selectedValues={companyid}
                                                            displayValue="label"
                                                            onSelect={handlecomapny}
                                                            onRemove={handlecomapny}
                                                            placeholder="Select Company"
                                                            showCheckbox={true}
                                                            showArrow={true}
                                                            required
                                                        />

                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Line Of Business</strong></label>
                                                        <select className="form-control" onChange={(e) => handleLObChange(e)} name="plan_category_id" >
                                                            <option value="" hidden>Select line Of Buisness</option>
                                                            {lob.map((item, index) => (
                                                                <option key={index} value={item.value + "," + item.label} selected={item.value == lob_id.value ? true : false}>{item.label}</option>
                                                            ))}
                                                        </select>
                                                        {/* <Multiselect
                                                            options={lob}
                                                            selectedValues={lob_id}
                                                            onSelect={handlelobChange}
                                                            onRemove={handlelobChange}
                                                            displayValue="label"
                                                            placeholder="Select Line of Business"
                                                            // closeOnSelect={false}
                                                            showCheckbox={true}
                                                            style={{ chips: { background: "#007bff" } }}
                                                            required
                                                        /> */}
                                                    </div>
                                                </div>
                                                {
                                                    selectedlob.label === "Motor" ||
                                                        selectedlob.label === "Yacht" ||
                                                        selectedlob.label === "Medical" ||
                                                        selectedlob.label === "Home" ?
                                                        (
                                                            <div className="col-md-6">
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
                                                        <div className="col-md-6">
                                                            <div className="form-group mb-3">
                                                                <label className="form-label"><strong>Select Policy Type</strong></label>

                                                                <Multiselect
                                                                    options={plan}
                                                                    displayValue="label"
                                                                    selectedValues={policy_type_id}
                                                                    onSelect={setPolicy_type_id}
                                                                    onRemove={setPolicy_type_id}
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
                                                            <div className="col-md-6">
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
                                                            <div className="col-md-6">
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
                                                            <div className="col-md-6">
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
                                                        <div className='col-md-6'>
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
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Select Locations</strong></label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={location_id}
                                                            onSelect={handleChange}
                                                            onRemove={handleChange}
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
                                                <div className="col-md-6">

                                                    <div className=" mt-5">
                                                        <div className="btn btn-success mx-2"
                                                            onClick={() => AddCoverToAllPlan(standard_cover_description, standard_cover_label, 'Add')}
                                                        >Covered</div>
                                                        {"  "}
                                                        <div className="btn btn-warning mx-2"
                                                            onClick={() => AddCoverToAllPlan(standard_cover_description, standard_cover_label, 'Remove')}
                                                        >Not Covered</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Update</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default GetStandardCovers;