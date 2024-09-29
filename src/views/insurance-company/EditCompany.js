import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";

const EditCompany = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const [body, setBody] = useState('');
    const [emailId, setEmailId] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [location, setLocation] = useState([]);
    const [LineOfBusiness, setLineOfBusiness] = useState([]);
    const [company_id, setCompanyId] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOption1, setSelectedOption1] = useState([]);
    const [logo, setLogo] = useState("");
    const [censuslist, setCensuslist] = useState("");
    const [medicalform, setMedicalForm] = useState("");
    const [salaryform, setSalaryForm] = useState("");
    const [kycform, setKycForm] = useState("");
    const [termscondition, setTermsCondition] = useState("");
    const [defaultTime, setdefautTime] = useState('')

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
            setCompanyId(id);
            CompanyDetails(id);
            getlistLineOfBusiness();
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
                const location_len = locationdt.length;
                const location_list = [];
                for (let i = 0; i < location_len; i++) {
                    const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };

                    location_list.push(location_obj);
                }
                setLocation(location_list);
            });
    }

    const getlistLineOfBusiness = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const line_of_businessdt = data.data;
                const line_of_business_len = line_of_businessdt.length;
                const line_of_business_list = [];
                for (let i = 0; i < line_of_business_len; i++) {
                    const line_of_business_obj = { label: line_of_businessdt[i].line_of_business_name, value: line_of_businessdt[i]._id };
                    line_of_business_list.push(line_of_business_obj);
                }
                setLineOfBusiness(line_of_business_list);
            });
    }

    const CompanyDetails = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getCompanyDetailsbyid/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    const company = data.data;
                    setCompanyName(company.company_name);
                    setBody(company.company_body);
                    setEmailId(company.company_email_id);
                    setAddress(company.company_address);
                    setPhoneNo(company.company_phone_no);
                    if (company.default_time) {
                        setdefautTime(company.default_time)
                    }
                    if (!company.company_logo) {
                        setLogo(company.company_logo[0].filename);
                    }
                    if (!company.company_dha_format) {
                        setCensuslist(company.company_dha_format[0].filename);
                    }
                    if (!company.company_medical_application) {
                        setMedicalForm(company.company_medical_application[0].filename);
                    }
                    if (!company.company_salary_declaration) {
                        setSalaryForm(company.company_salary_declaration[0].filename);
                    }
                    if (!company.company_kyc_form) {
                        setKycForm(company.company_kyc_form[0].filename);
                    }
                    if (!company.company_terms_condition) {
                        setTermsCondition(company.company_terms_conditions[0]?.filename)
                    }
                    const locationid = company.company_location;
                    const location_id = locationid.split(",");
                    const location_id_len = location_id.length;
                    const location_name = [];
                    for (let i = 0; i < location_id_len; i++) {
                        const requestOptions = {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        };
                        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location_by_id/${location_id[i]}`, requestOptions)
                            .then((response) => response.json())
                            .then((data) => {
                                location_name.push(data.data.location_name);
                                const location_name_len = location_name.length;
                                if (location_name_len === location_id_len) {
                                    const location_name_str = location_name.join(",");
                                    const location_name_arr = location_name_str.split(",");
                                    const location_name_arr_len = location_name_arr.length;
                                    const location_name_arr_obj = [];
                                    for (let i = 0; i < location_name_arr_len; i++) {
                                        const location_name_arr_obj_obj = { label: location_name_arr[i], value: location_id[i] };
                                        location_name_arr_obj.push(location_name_arr_obj_obj);
                                    }
                                    setSelectedOption1(location_name_arr_obj);
                                }
                            });
                    }
                    const line_of_businessid = company.company_line_of_business_id;
                    const line_of_business_id = line_of_businessid.split(",");
                    const line_of_business_id_len = line_of_business_id.length;
                    const line_of_business_name = [];
                    for (let i = 0; i < line_of_business_id_len; i++) {
                        const requestOptions = {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        };
                        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_by_id/${line_of_business_id[i]}`, requestOptions)
                            .then((response) => response.json())
                            .then((data) => {
                                line_of_business_name.push(data.data[0].line_of_business_name);
                                const line_of_business_name_len = line_of_business_name.length;
                                if (line_of_business_name_len === line_of_business_id_len) {
                                    const line_of_business_name_str = line_of_business_name.join(",");
                                    const line_of_business_name_arr = line_of_business_name_str.split(",");
                                    const line_of_business_name_arr_len = line_of_business_name_arr.length;
                                    const line_of_business_name_arr_obj = [];
                                    for (let i = 0; i < line_of_business_name_arr_len; i++) {
                                        const line_of_business_name_arr_obj_obj = { label: line_of_business_name_arr[i], value: line_of_business_id[i] };
                                        line_of_business_name_arr_obj.push(line_of_business_name_arr_obj_obj);
                                    }
                                    setSelectedOption(line_of_business_name_arr_obj);
                                    console.log(line_of_business_name_arr_obj, "line_of_business_name_arr_obj")
                                }
                            });
                    }
                }
            });
    }

    const handleChange = (selectedOption) => {
        setSelectedOption1(selectedOption);
    };

    const handleChange1 = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const updateSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const company_name = data.get('company_name');
        const body = data.get('body');
        const email_id = data.get('email_id');
        const phone_no = data.get('phone_no');
        const address = data.get('address');
        const default_time = data.get("default_time")
        if (selectedOption1 == null) {
            swal({
                title: "Error!",
                text: "Please Select Location",
                type: "error",
                icon: "error"
            });
            return false;
        }

        if (selectedOption == null) {
            swal({
                title: "Error!",
                text: "Please Select Line Of Business",
                type: "error",
                icon: "error"
            });
            return false;
        }
        const line_of_business = selectedOption;
        const line_of_business_len = line_of_business.length;
        const line_of_business_str = [];
        for (let i = 0; i < line_of_business_len; i++) {
            line_of_business_str.push(line_of_business[i].value);
        }
        const company_location = selectedOption1;
        const company_location_len = company_location.length;
        const company_location_str = [];
        for (let i = 0; i < company_location_len; i++) {
            company_location_str.push(company_location[i].value);
        }

        const fd = new FormData();
        fd.append('company_name', company_name);
        fd.append('company_body', body);
        fd.append('company_email_id', email_id);
        fd.append('company_phone_no', phone_no);
        fd.append('company_address', address);
        fd.append('company_logo', logo);
        fd.append('company_dha_format', censuslist);
        fd.append('company_medical_application', medicalform);
        fd.append('company_salary_declaration', salaryform);
        fd.append('company_kyc_form', kycform);
        fd.append('line_of_business_id', line_of_business_str.toString());
        fd.append('company_location', company_location_str.toString());
        fd.append('company_id', company_id);
        fd.append('company_terms_conditions', termscondition);
        fd.append('default_time', default_time)

        const requestOptions = {
            method: "POST",
            body: fd,
        };
        fetch("https://insuranceapi-3o5t.onrender.com/api/updateCompany", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        type: "success",
                        icon: "success"
                    }).then(function () {
                        navigate('/insurance-company');
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error"
                    }).then(function () {
                        navigate('/insurance-company');
                    });
                }
            });
    };


    console.log(termscondition)
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h4 className="card-title">Edit Company</h4>
                                    </div>
                                    <div className="col-md-6">
                                        <a href="/insurance-company" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <form action="/" method="POST" onSubmit={updateSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Company Name</label>
                                                <input type="text" className="form-control" placeholder="Enter Company Name" name="company_name" defaultValue={companyName} autoComplete="off" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Body</label>
                                                <textarea className="form-control" placeholder="Enter Body" name="body" defaultValue={body}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Email Id</label>
                                                <input type="email" className="form-control" placeholder="Enter Email Id" name="email_id" defaultValue={emailId} autoComplete="off" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Address</label>
                                                <textarea className="form-control" placeholder="Enter Address" name="address" defaultValue={address}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Phone No</label>
                                                <input type="text" className="form-control" placeholder="Enter Phone No" name="phone_no" defaultValue={phoneNo} autoComplete="off" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Location</label>
                                                <Multiselect
                                                    options={location}
                                                    selectedValues={selectedOption1}
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
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Company Logo</label>
                                                <input type="file" className="form-control" name="company_logo" accept=".png, .gif, .jpg, .jpeg" onChange={(e) => setLogo(e.target.files[0])} />
                                                {
                                                    logo ? (
                                                        <img src={"https://insuranceapi-3o5t.onrender.com/uploads/" + logo} alt="Company Logo" className="img-fluid" />
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Line Of Business</label>
                                                <Multiselect
                                                    options={LineOfBusiness}
                                                    selectedValues={selectedOption}
                                                    onSelect={handleChange1}
                                                    onRemove={handleChange1}
                                                    displayValue="label"
                                                    placeholder="Select Line Of Business"
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
                                        <div className="col-md-6">
                                            <div className="form-group" style={{ position: 'relative' }}>
                                                <label className="form-label">DHA Format Census List</label>
                                                <input type="file" style={{ width: '90%' }} className="form-control" name="dha_format" onChange={(e) => setCensuslist(e.target.files[0])} accept=".xlsx, .csv, .doc, .docx, .pdf" />
                                                {
                                                    censuslist ? (
                                                        <span style={{ position: 'absolute', right: '0px', padding: '10px', top: '26px' }}><a href={"https://insuranceapi-3o5t.onrender.com/uploads/" + censuslist} target="_blank" rel="noreferrer" title='View DHA Format Census List'><i className='fa fa-eye'></i></a></span>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group" style={{ position: 'relative' }}>
                                                <label className="form-label">Medical Application Form</label>
                                                <input type="file" style={{ width: '90%' }} className="form-control" name="medical_application" onChange={(e) => setMedicalForm(e.target.files[0])} accept=".xlsx, .csv, .doc, .docx, .pdf" />
                                                {
                                                    medicalform ? (
                                                        <span style={{ position: 'absolute', right: '0px', padding: '10px', top: '26px' }}><a href={"https://insuranceapi-3o5t.onrender.com/uploads/" + medicalform} target="_blank" rel="noreferrer" title='View Medical Application Form'><i className='fa fa-eye'></i></a></span>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group" style={{ position: 'relative' }}>
                                                <label className="form-label">Salary Declaration Form</label>
                                                <input type="file" style={{ width: '90%' }} className="form-control" name="salary_declaration" onChange={(e) => setSalaryForm(e.target.files[0])} accept=".xlsx, .csv, .doc, .docx, .pdf" />
                                                {
                                                    salaryform ? (
                                                        <span style={{ position: 'absolute', right: '0px', padding: '10px', top: '26px' }}><a href={"https://insuranceapi-3o5t.onrender.com/uploads/" + salaryform} target="_blank" rel="noreferrer" title='View Salary Declaration Form'><i className='fa fa-eye'></i></a></span>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group" style={{ position: 'relative' }}>
                                                <label className="form-label">KYC Form</label>
                                                <input type="file" style={{ width: '90%' }} className="form-control" name="kyc_form" onChange={(e) => setKycForm(e.target.files[0])} accept=".xlsx, .csv, .doc, .docx, .pdf" />
                                                {
                                                    kycform ? (
                                                        <span style={{ position: 'absolute', right: '0px', padding: '10px', top: '26px' }}><a href={"https://insuranceapi-3o5t.onrender.com/uploads/" + kycform} target="_blank" rel="noreferrer" title='View KYC Form'><i className='fa fa-eye'></i></a></span>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group" style={{ position: 'relative' }}>
                                                <label className="form-label">Terms & Condition</label>
                                                <input type="file" style={{ width: '90%' }} className="form-control" name="kyc_form" onChange={(e) => setTermsCondition(e.target.files[0])} accept=".xlsx, .csv, .doc, .docx, .pdf" />
                                                {
                                                    termscondition ? (
                                                        <span style={{ position: 'absolute', right: '0px', padding: '10px', top: '26px' }}><a href={"https://insuranceapi-3o5t.onrender.com/uploads/" + termscondition} target="_blank" rel="noreferrer" title='View KYC Form'><i className='fa fa-eye'></i></a></span>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className='form-group'>
                                                <label className='form-label'>default Time</label>
                                                <select className='form-control' name='default_time' required>
                                                    <option value='' hidden>Select Defalut Time</option>
                                                    <option selected={defaultTime == 'daily' ? true : false} value='daily'>Daily</option>
                                                    <option selected={defaultTime == 'weekly' ? true : false} value='weekly'>Weekly</option>
                                                    <option selected={defaultTime == 'monthly' ? true : false} value='monthly'>Monthly</option>
                                                    <option selected={defaultTime == 'yearly' ? true : false} value='yearly'>Yearly</option>
                                                </select>
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
        </>
    )
}

export default EditCompany
