import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";

const AddCompany = () => {
    const navigate = useNavigate();
    const [LineOfBusiness, setLineOfBusiness] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOption1, setSelectedOption1] = useState(null);
    const [logo, setLogo] = useState("");
    const [censuslist, setCensuslist] = useState("");
    const [medicalform, setMedicalForm] = useState("");
    const [salaryform, setSalaryForm] = useState("");
    const [kycform, setKycForm] = useState("");
    const [termscondition, setTermsCondition] = useState("");
    const [location, setLocation] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getlistLineOfBusiness();
            locationList();
        }
    }, []);

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
                setSelectedOption1(location_list);
            });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const company_name = data.get('company_name');
        const body = data.get('body');
        const email_id = data.get('email_id');
        const phone_no = data.get('phone_no');
        const address = data.get('address');
        const default_time = data.get('default_time')

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
        fd.append('company_terms_condition', termscondition);
        fd.append('line_of_business_id', line_of_business_str.toString());
        fd.append('company_location', company_location_str.toString());
        fd.append('default_time', default_time)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/addCompany",
            {
                method: "post",
                body: fd,
            });
        result = await result.json();
        if (result.status === 200) {
            swal({
                title: "Success!",
                text: result.message,
                type: "success",
                icon: "success"
            }).then(function () {
                navigate('/insurance-company');
            });
        }
        else {
            swal({
                title: "Error!",
                text: result.message,
                type: "error",
                icon: "error"
            }).then(function () {
                navigate('/insurance-company');
            });
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
                                    <h4 className="card-title">Add Company</h4>
                                </div>
                                <div className="col-md-6">
                                    <a href="/insurance-company" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <form action="/" method="POST" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Company Name</label>
                                            <input type="text" className="form-control" placeholder="Enter Company Name" name="company_name" autoComplete="off" required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Body</label>
                                            <textarea className="form-control" placeholder="Enter Body" name="body"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Email Id</label>
                                            <input type="email" className="form-control" placeholder="Enter Email Id" name="email_id" autoComplete="off" required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Address</label>
                                            <textarea className="form-control" placeholder="Enter Address" name="address"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Phone No</label>
                                            <input type="text" className="form-control" placeholder="Enter Phone No" name="phone_no" autoComplete="off" required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Location</label>
                                            <Multiselect
                                                options={location}
                                                displayValue="label"
                                                selectedValues={location}
                                                onSelect={setSelectedOption1}
                                                onRemove={setSelectedOption1}
                                                placeholder="Select Location"
                                                showCheckbox={true}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Company Logo</label>
                                            <input type="file" className="form-control" name="company_logo" accept=".png, .jpg, .jpeg" onChange={(e) => setLogo(e.target.files[0])} required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Line Of Business</label>
                                            <Multiselect
                                                options={LineOfBusiness}
                                                displayValue="label"
                                                onSelect={setSelectedOption}
                                                onRemove={setSelectedOption}
                                                placeholder="Select Line Of Business"
                                                showCheckbox={true}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">DHA Format Census List</label>
                                            <input type="file" className="form-control" name="dha_format" onChange={(e) => setCensuslist(e.target.files[0])} accept=".xlsx, .csv, .doc, .docx, .pdf" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Medical Application forms</label>
                                            <input type="file" className="form-control" name="medical_application" onChange={(e) => setMedicalForm(e.target.files[0])} accept=".xlsx, .csv, .doc, .docx, .pdf" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Salary Declaration Form</label>
                                            <input type="file" className="form-control" name="salary_declaration" onChange={(e) => setSalaryForm(e.target.files[0])} accept=".xlsx, .csv, .doc, .docx, .pdf" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">KYC Form</label>
                                            <input type="file" className="form-control" name="kyc_form" onChange={(e) => setKycForm(e.target.files[0])} accept=".xlsx, .csv, .doc, .docx, .pdf" />
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className="form-group" style={{ position: 'relative' }}>
                                            <label className="form-label">Terms & Condition</label>
                                            <input type="file" className="form-control" name="company_terms_condition" onChange={(e) => setTermsCondition(e.target.files[0])} accept=".xlsx, .csv, .doc, .docx, .pdf" />
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='form-group'>
                                            <label className='form-label'>default Time</label>
                                            <select className='form-control' name='default_time' required>
                                                <option value='' hidden>Select Defalut Time</option>
                                                <option value='daily'>Daily</option>
                                                <option value='weekly'>Weekly</option>
                                                <option value='monthly'>Monthly</option>
                                                <option value='yearly'>Yearly</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <button type="submit" className="btn btn-primary mt-2" style={{ float: "right" }}>Submit</button>
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

export default AddCompany
