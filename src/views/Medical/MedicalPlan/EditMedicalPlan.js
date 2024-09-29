import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Multiselect from "multiselect-react-dropdown";

const EditMedicalPlan = () => {
    const navigate = useNavigate();
    const [medical_plan_id, setMedicalPlanId] = useState([]);
    const [planCategory, setPlanCategory] = useState([]);
    const [natureOfPlan, setNatureOfPlan] = useState([]);
    const [medicalPlanType, setMedicalPlanType] = useState([]);
    const [rowsData, setRowsData] = useState([]);
    const [visaCountry, setVisaCountry] = useState([]);
    const [planConditon, setPlanCondition] = useState([]);
    const [nationality, setNationality] = useState([]);
    const [salaryRange, setSalaryRange] = useState([]);
    const [defaultvisaCountry, setDefaultVisaCountry] = useState([]);
    const [defaultVisaCountryTopup, setDefaultVisaCountryTopup] = useState('');
    const [defaultplanConditon, setDefaultPlanCondition] = useState('');
    const [defaultplanConditonTopup, setDefaultPlanConditionTopup] = useState('');
    const [defaultnationality, setDefaultNationality] = useState('');
    const [defaultnationalityTopup, setDefaultNationalityTopup] = useState('');
    const [defaultsalaryRange, setDefaultSalaryRange] = useState('');
    const [defaultsalaryRangeTopup, setDefaultSalaryRangeTopup] = useState('');
    const [add_op_con_desc, setAddopcondesc] = useState('');
    const [add_op_con_desc_topup, setAddopcondesctopup] = useState('');
    const [vat, setVat] = useState('');
    const [companyList, setCompanyList] = useState([]);
    const [location, setLocation] = useState([]);
    const [defaultlocation, setDefaultLocation] = useState([]);
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
            setMedicalPlanId(id);
            medical_plan_details(id);
            Plancategory();
            NatureOfPlan();
            nationality_list();
            MedicalPlanType();
            company_list();
            get_MedicalVisaCountry();
            getMedicalPlanCondition();
            getMedicalSalaryRange();
            locationList();
        }
    }, []);
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
                setMedicalPlanType(data.data);
                console.log(data.data, "hii")
            });
    }
    const get_MedicalVisaCountry = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getmedicalVisaCountry`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setVisaCountry(data.data);

            });
    }
    const getMedicalPlanCondition = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getMedicalPlanCondition`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setPlanCondition(data.data);
            });
    }
    const nationality_list = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getNationality`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNationality(data.data);
            });
    }
    const getMedicalSalaryRange = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getMedicalSalaryRange`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setSalaryRange(data.data);
            });
    }


    const medical_plan_details = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch(`https://insuranceapi-3o5t.onrender.com/api/single_medical_plan_details/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setRowsData(data.data);
                console.log(data.data, ">>>>>>>>>>>>>>>>>>> data")
                console.log(data.data)
                const Med_VisaCountry = data.data.medical_visa_country_or_topup;
                const Med_VisaCountry_dt = Med_VisaCountry.length;
                setDefaultLocation(data.data?.location)
                // console.log(data.data)   
                const MedVisaCountry_topup = [];
                for (let i = 0; i < Med_VisaCountry_dt; i++) {
                    const MedVisaCountry_topup1 = Med_VisaCountry[i]['issuing_visa_topup'];
                    MedVisaCountry_topup.push(MedVisaCountry_topup1);
                }

                var TopupValues = MedVisaCountry_topup.join(',');
                setDefaultVisaCountry(Med_VisaCountry);
                setDefaultVisaCountryTopup(TopupValues);

                const plan_condition = data.data.plan_condition_or_topup;
                const plan_condition_dt = plan_condition.length;
                const plan_condition_topup = [];
                for (let i = 0; i < plan_condition_dt; i++) {
                    const plan_condition_topup1 = plan_condition[i]['plan_condition_topup'];
                    plan_condition_topup.push(plan_condition_topup1);
                }
                var plan_conditionTopupValues = plan_condition_topup.join(',');
                setDefaultPlanCondition(plan_condition);
                setDefaultPlanConditionTopup(plan_conditionTopupValues);

                const salary_range = data.data.salary_range_or_topup;
                const salary_range_dt = salary_range.length;
                const salary_range_topup = [];
                for (let i = 0; i < salary_range_dt; i++) {
                    const salary_range_topup1 = salary_range[i]['salary_range_topup'];
                    salary_range_topup.push(salary_range_topup1);
                }
                var salary_rangeTopupValues = salary_range_topup.join(',');
                setDefaultSalaryRange(salary_range);
                setDefaultSalaryRangeTopup(salary_rangeTopupValues);

                const nationality = data.data.nationality_or_topup;
                const nationality_dt = nationality.length;
                const nationality_topup = [];
                for (let i = 0; i < nationality_dt; i++) {
                    const nationality_topup1 = nationality[i]['nationalitytopup'];
                    nationality_topup.push(nationality_topup1);
                }
                var nationalityTopupValues = nationality_topup.join(',');
                setDefaultNationality(nationality);
                setDefaultNationalityTopup(nationalityTopupValues);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const plan_name = data.get('plan_name');
        const company_id = data.get('company_id');
        const plan_category_id = data.get('plan_category_id');
        const nature_of_plan_id = data.get('nature_of_plan_id');
        const medical_plan_type = data.get('medical_plan_type_id');
        // const medical_visa_country= defaultvisaCountry;
        const medical_visa_country_topup = data.get('medical_visa_country_topup');
        console.log(medical_visa_country_topup)
        // const medical_plan_condition= defaultplanConditon;
        const medical_plan_condition_topup = data.get('medical_plan_condition_topup');
        // const nationality_name= defaultnationality;
        const nationality_topup = data.get('nationality_topup');
        // const medical_salary_range= defaultsalaryRange;
        const salary_range_topup = data.get('salary_range_topup');
        const add_op_con_desc = data.get('add_op_con_desc');
        const add_op_con_desc_topup = data.get('add_op_con_desc_topup');
        const vat = data.get('vat');
        const jdv_comm = data.get('jdv_comm');

        if (add_op_con_desc != '' && (add_op_con_desc_topup == '' || vat == '')) {
            if (add_op_con_desc_topup == '') {
                Swal.fire({
                    title: "Error!",
                    text: "Please Enter Topup (Add Option Condition Description)",
                    icon: "error",
                    confirmButtonText: "Ok",
                })
                return false;
            }
            else if (vat == '') {
                Swal.fire({
                    title: "Error!",
                    text: "Please Enter Vat",
                    icon: "error",
                    confirmButtonText: "Ok",
                })
                return false;
            }
        }
        if (defaultplanConditon.length == 0) {
            Swal.fire({
                title: "Error!",
                text: "Please Select Plan Condition",
                icon: "error",
                confirmButtonText: "Ok",
            })
            return false;
        }
        if (defaultnationality.length == 0) {
            Swal.fire({
                title: "Error!",
                text: "Nationality Required",
                icon: "error",
                confirmButtonText: "Ok",
            })
            return false;
        }
        if (defaultsalaryRange.length == 0) {
            Swal.fire({
                title: "Error!",
                text: "Please Select Medical Salary Range",
                icon: "error",
                confirmButtonText: "Ok",
            })
            return false;
        }
        if (defaultlocation.length == 0) {
            Swal.fire({
                title: "Error!",
                text: "Please Select Location",
                icon: "error",
                confirmButtonText: "Ok",
            })
            return false;
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan_name: plan_name,
                company_id: company_id,
                plan_category_id: plan_category_id,
                nature_of_plan_id: nature_of_plan_id,
                medical_plan_type: medical_plan_type,
                medical_visa_country: defaultvisaCountry,
                medical_visa_country_topup: medical_visa_country_topup,
                medical_plan_condition: defaultplanConditon,
                medical_plan_condition_topup: medical_plan_condition_topup,
                nationality_name: defaultnationality,
                nationality_topup: nationality_topup,
                medical_salary_range: defaultsalaryRange,
                salary_range_topup: salary_range_topup,
                add_op_con_desc: add_op_con_desc,
                add_op_con_desc_topup: add_op_con_desc_topup,
                vat: vat,
                jdv_comm: jdv_comm,
                excess: data.get('excess'),
                location: defaultlocation
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_medical_plan/${medical_plan_id}`, requestOptions)
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
                            navigate('/medicalplan');
                        }
                    })
                }
                else {
                    Swal.fire({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        confirmButtonText: "Ok",
                    })
                        .then((result) => {
                            if (result.isConfirmed) {
                                navigate("/medicalplan");
                            }
                        });
                }
            });
    }


    const handleChange1 = (selectedOption) => {
        setDefaultVisaCountry(selectedOption);
    };

    const handleChange2 = (selectedOption) => {
        setDefaultPlanCondition(selectedOption);
    };

    const handleChange3 = (selectedOption) => {
        setDefaultNationality(selectedOption);
    };

    const handleChange4 = (selectedOption) => {
        setDefaultSalaryRange(selectedOption);
    };
    const handleChangeLoc = (loc) => {
        setDefaultLocation(loc)
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
                                    <h4 className="card-title">Edit Medical Plan</h4>
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
                                            <label>Plan Name</label>
                                            <input required type="text" className="form-control" placeholder="Enter Plan Name" name="plan_name" autoComplete="off" defaultValue={rowsData.plan_name} />
                                        </div>
                                    </div>
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
                                    {/* <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Plan Category</label>
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
                                    </div> */}

                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Medical Plan Type</label>
                                            <select required className="form-control" name="medical_plan_type_id">
                                                <option value="">Select Medical Plan Type</option>
                                                {medicalPlanType.map((item, index) => (
                                                    <option key={index} value={item._id} selected={rowsData.medical_plan_type_id == item._id ? true : false}>{item.medical_plan_type}</option>
                                                ))}
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
                                </div>
                                <div className="row">
                                    {/* <div className="col-md-6" >
                                        <div className="form-group mb-3">
                                            <label>Emirates Issuing Visa</label>
                                            <Multiselect
                                                className="form-control"
                                                options={visaCountry}
                                                selectedValues={rowsData.medical_visa_country_or_topup}
                                                onSelect={(handleChange1)}
                                                onRemove={(handleChange1)}
                                                displayValue="medical_visa_country"
                                                showCheckbox={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Topup(Emirates Issuing Visa)</label>
                                            <input type="text" name="medical_visa_country_topup" className="form-control" placeholder="Enter Topup (Emirates Issuing Visa)" autoComplete="off" defaultValue={defaultVisaCountryTopup} />
                                        </div>
                                    </div> */}

                                </div>
                                <div className="row">
                                    <div className="col-md-6" >
                                        <div className="form-group mb-3">
                                            <label>Plan Condition</label>
                                            <Multiselect
                                                className="form-control"
                                                options={planConditon}
                                                selectedValues={rowsData.plan_condition_or_topup}
                                                onSelect={(handleChange2)}
                                                onRemove={(handleChange2)}
                                                displayValue="medical_plan_condition"
                                                showCheckbox={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Topup(Plan Condition)</label>
                                            <input type="text" name="medical_plan_condition_topup" className="form-control" placeholder="Enter Topup (Plan Condition)" autoComplete="off" defaultValue={defaultplanConditonTopup} />
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Nationality</label>
                                            <Multiselect
                                                options={nationality}
                                                selectedValues={rowsData.nationality_or_topup}
                                                displayValue="nationality_name"
                                                showCheckbox={true}
                                                onSelect={handleChange3}
                                                onRemove={handleChange3}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Topup(Nationality)</label>
                                            <input type="text" name="nationality_topup" className="form-control" placeholder="Enter Topup (Nationality)" autoComplete="off" defaultValue={defaultnationalityTopup} />
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-6" >
                                        <div className="form-group mb-3">
                                            <label>Medical Salary Range</label>
                                            <Multiselect
                                                className="form-control"
                                                options={salaryRange}
                                                selectedValues={rowsData.salary_range_or_topup}
                                                onSelect={(handleChange4)}
                                                onRemove={(handleChange4)}
                                                displayValue="medical_salary_range"
                                                showCheckbox={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Topup(Salary Range Topup)</label>
                                            <input type="text" name="salary_range_topup" className="form-control" placeholder="Enter Topup (Medical Salary Range)" autoComplete="off" defaultValue={defaultsalaryRangeTopup} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Add Option Condition Description</label>
                                            <input required type="text" name="add_op_con_desc" onInput={(e) => validateInput(e)} className="form-control" placeholder="Enter Add Option Condition Description" autoComplete="off" defaultValue={add_op_con_desc} />
                                            {errmsg.status == true && errmsg.name == "add_op_con_desc" ? <span style={{ color: 'red' }}>Text Only</span> : ""}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Topup (Add Option Condition Description)</label>
                                            <input type="text" name="add_op_con_desc_topup" className="form-control" placeholder="Enter Fixed/Percentage/Reffered (Add Option Condition Description)" autoComplete="off" defaultValue={add_op_con_desc_topup} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Vat Able</label>
                                            <input required type="text" name="vat" onInput={(e) => validateInput(e)} className="form-control" placeholder="Enter Vat Able" autoComplete="off" defaultValue={vat} />
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
                                    {/* <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>excess</label>
                                            <input required type="text" name="excess" className="form-control" placeholder="Enter excess" autoComplete="off" defaultValue={rowsData.excess} />
                                        </div>
                                    </div> */}
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

export default EditMedicalPlan
