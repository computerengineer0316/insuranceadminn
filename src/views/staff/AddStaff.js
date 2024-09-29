import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";

const AddStaff = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState([]);
    const [LineOfBusiness, setLineOfBusiness] = useState([]);
    const [userTypes, setUserTypes] = useState([]);
    const [staff_lob, setStaff_lob] = useState(null);
    const [staff_location, setStaff_location] = useState([]);
    const [staff_Business_type, setBusiness_type] = useState([]);
    const [staff_Business_type1, setBusiness_type1] = useState(null);
    const [permission, setPermission] = useState([]);
    const [companyfeild, setShowCompanyfeild] = useState([])
    const [insuranceCompany, setInsuranceCompany] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            // getlistLineOfBusiness();
            locationList();
            userTypeList();
            getlistCompany()
            const Business_type = [
                { label: "New Business", value: "New Business" },
                { label: "Renewal Business", value: "Renewal Business" }
            ];
            setBusiness_type(Business_type);
            // getCompanyList()
        }
    }, []);

    useEffect(() => {
        console.log('i worked toooooooooooooooooooo');
        console.log(staff_location, "staff_location");
        getlistLineOfBusiness();
    }, [staff_location]);

    const getlistCompany = () => {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getCompany`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setInsuranceCompany(data.data);
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
                console.log(locationdt);
                const location_len = locationdt.length;
                const location_list = [];
                for (let i = 0; i < location_len; i++) {
                    const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };

                    location_list.push(location_obj);
                }
                setLocation(location_list);
                setStaff_location(location_list);
            });
    }

    console.log(location);

    console.log(staff_location);




    const getlistLineOfBusiness = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const locationValues = staff_location == null || staff_location.length == 0 ?
            location.map((val) => val.value) :
            staff_location.map((val) => val.value);

        // Create URLSearchParams object
        const params = new URLSearchParams();
        locationValues.forEach(value => {
            params.append('location', value);
        });


        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list?${params.toString()}`, requestOptions)
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


    const handlestafflocation = (selectedvalue) => {
        setStaff_location(selectedvalue);
    }



    const userTypeList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_user_type`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setUserTypes(data.data);
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const staff_name = data.get('staff_name');
        const staff_email = data.get('staff_email');
        const staff_mobile = data.get('staff_mobile');
        const staff_usertype = data.get('staff_usertype');
        const staff_password = data.get('staff_password');
        const company = data.get('company')
        const staff_lob_len = (staff_lob == null) ? LineOfBusiness.length : staff_lob.length;
        const staff_lob_str = [];
        for (let i = 0; i < staff_lob_len; i++) {
            if (staff_lob == null) {
                staff_lob_str.push(LineOfBusiness[i].value);
            }
            else {
                staff_lob_str.push(staff_lob[i].value);
            }
        }
        const staff_location_len = (staff_location == null) ? location.length : staff_location.length;
        const staff_location_str = [];
        for (let i = 0; i < staff_location_len; i++) {
            if (staff_location == null) {
                staff_location_str.push(location[i].value);
            }
            else {
                staff_location_str.push(staff_location[i].value);
            }
        }
        const staff_business_len = staff_Business_type1.length;
        const staff_business = [];
        for (let i = 0; i < staff_business_len; i++) {
            staff_business.push(staff_Business_type1[i].value);
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                staff_name: staff_name,
                staff_email: staff_email,
                staff_mobile: staff_mobile,
                staff_usertype: staff_usertype,
                staff_business: staff_business,
                staff_password: staff_password,
                company: company,
                staff_lob: staff_lob_str,
                staff_location: staff_location_str
            }),
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/addStaff', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    const staff_id = data.data._id;
                    copypermission(staff_id);
                    swal({
                        title: "Success!",
                        text: data.message,
                        type: "success",
                        icon: "success"
                    }).then(function () {
                        navigate('/ViewStaff')
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error"
                    }).then(function () {
                        navigate('/ViewStaff')
                    });
                }
            });
    }

    const copypermission = (id) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_user_permission/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                const result = convertResponse(data.data);
                const parsedPermission = JSON.stringify(result, null, 2);
                setPermission(JSON.parse(parsedPermission));
            });
    }

    console.log('permission>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', permission);

    const convertResponse = (response) => {
        const convertedResponse = [];

        for (const module in response[0]) {
            const permission = response[0][module][0];
            const moduleName = module.split('_')[0];

            const convertedModule =
            {
                module_name: moduleName.charAt(0).toUpperCase() + moduleName.slice(1),
                permission: [{ ...permission, _id: "64a3b25ba1f5ea6cfdbad390", __v: 0 }]
            };

            convertedResponse.push(convertedModule);
        }

        return convertedResponse;
    };
    const HandleUserTypeChange = (e) => {
        if (e.target.value === '653604248028cba2487f7d2a') {
            setShowCompanyfeild(true)
        } else {
            setShowCompanyfeild(false)
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
                                    <h4 className="card-title">Add Staff</h4>
                                </div>
                                <div className="col-md-6">
                                    <a href="/ViewStaff" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                                </div>
                                <div className="card-body">
                                    <form action="/" method="POST" onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Name</label>
                                                    <input type="text" className="form-control" name="staff_name" placeholder="Enter Name" autoComplete="off" required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Email</label>
                                                    <input type="email" className="form-control" name="staff_email" placeholder="Enter Email" autoComplete="off" required />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Mobile</label>
                                                    <input type="text" className="form-control" name="staff_mobile" placeholder="Enter Mobile" autoComplete="off" required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>User Type</label>
                                                    <select className="form-control" onClick={(e) => HandleUserTypeChange(e)} name="staff_usertype" required>
                                                        <option value="">Select User Type</option>
                                                        {
                                                            userTypes.length > 0 &&
                                                            userTypes.map((item, index) => (
                                                                <option key={index} value={item._id}>{item.usertype}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            {companyfeild == true ?
                                                <div className='col-md-6'>
                                                    <div className='form-group mb-3'>
                                                        <label>Company</label>
                                                        <select className='form-control' name='company' required>
                                                            <option value="">Select Company</option>
                                                            {insuranceCompany?.map((item, index) => (
                                                                <option key={index} value={item._id}>{item.company_name}</option>
                                                            ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div> : ""
                                            }
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Location</label>
                                                    <Multiselect
                                                        options={location}
                                                        displayValue="label"
                                                        selectedValues={staff_location}
                                                        onSelect={(selectedList) => handlestafflocation(selectedList)}
                                                        onRemove={(selectedList) => handlestafflocation(selectedList)}
                                                        placeholder="Select Location"
                                                        closeOnSelect={false}
                                                        avoidHighlightFirstOption={true}
                                                        showCheckbox={true}
                                                        style={{ chips: { background: "#007bff" } }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Line Of Business</label>
                                                    <Multiselect
                                                        options={LineOfBusiness}
                                                        displayValue="label"
                                                        selectedValues={LineOfBusiness}
                                                        onSelect={setStaff_lob}
                                                        onRemove={setStaff_lob}
                                                        placeholder="Select Line Of Business"
                                                        closeOnSelect={false}
                                                        avoidHighlightFirstOption={true}
                                                        showCheckbox={true}
                                                        style={{ chips: { background: "#007bff" } }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Type</label>
                                                    <Multiselect
                                                        options={staff_Business_type}
                                                        displayValue="label"
                                                        onSelect={setBusiness_type1}
                                                        onRemove={setBusiness_type1}
                                                        placeholder="Select Type"
                                                        closeOnSelect={false}
                                                        avoidHighlightFirstOption={true}
                                                        showCheckbox={true}
                                                        style={{ chips: { background: "#007bff" } }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Password</label>
                                                    <input type="password" className="form-control" name="staff_password" placeholder="Enter Password" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12" style={{ textAlign: 'right' }}>
                                                <button type="submit" className="btn btn-primary">Save</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddStaff
