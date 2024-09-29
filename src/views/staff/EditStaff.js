import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Multiselect from "multiselect-react-dropdown";

const EditStaff = () => {
    const navigate = useNavigate();
    const [staffName, setStaffName] = useState('');
    const [staffEmail, setStaffEmail] = useState('');
    const [staffMobile, setStaffMobile] = useState('');
    const [staffLob, setStaffLob] = useState('');
    const [staffLocation, setStaffLocation] = useState('');
    const [staffBusiness, setStaffBusiness] = useState('');
    const [location, setLocation] = useState([]);
    const [LineOfBusiness, setLineOfBusiness] = useState([]);
    const [staffid, setStaffid] = useState('');
    const [userType, setUserType] = useState('');
    const [userTypes, setUserTypes] = useState([]);
    const [staff_Business_type, setBusiness_type] = useState([]);
    const [staff_Business_type1, setBusiness_type1] = useState(null);
    const [urluser, setUrlUserType] = useState('')
    const [customerDetails, setCustomerDetails] = useState({})
    const [companyfeild, setShowCompanyfeild] = useState([])
    const [insuranceCompany, setInsuranceCompany] = useState([])
    const [defICompany, setdefICompany] = useState('')
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
            const urlusr = url1.split("?")[2]
            const urlusrtype = urlusr.split("=")[1]
            console.log(id, ">>>>>>>>", urlusrtype)
            setStaffid(id);
            setUrlUserType(urlusrtype)
            getlistCompany()
            if (urlusrtype == 'Customer') {
                getCustomerdetails(id)
            } else {
                getstaffdetails(id);
            }
            // getlistLineOfBusiness();
            locationList();
            userTypeList();
            const Business_type = [
                { label: "New Business", value: "New Business" },
                { label: "Renewal Business", value: "Renewal Business" }
            ];
            setBusiness_type(Business_type);
        }
    }, []);
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
    useEffect(() => {
        console.log('i worked toooooooooooooooooooo');
        console.log(staffLocation, "staff_location");
        getlistLineOfBusiness();

    }, [staffLocation]);

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

    console.log(staffLob, "stafflob");

    const getlistLineOfBusiness = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const locationValues = staffLocation == null || staffLocation.length == 0 ?
            location.map((val) => val.value) :
            staffLocation.map((val) => val.value);

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
                if (staffLob.length > 0) {
                    const lobValues = staffLob.map((val) => val.value);
                    const lobValues1 = line_of_business_list.filter((val) => lobValues.includes(val.value));
                    setStaffLob(lobValues1);
                }


            });
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

    const getstaffdetails = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getStaffDetailsbyid/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setUserType(data.data[0]?.usertype);
                setStaffName(data.data[0]?.name);
                setStaffEmail(data.data[0]?.email);
                setStaffMobile(data.data[0]?.mobile);
                if (data.data[0]?.usertype == "653604248028cba2487f7d2a") {
                    setShowCompanyfeild(true)
                    setdefICompany(data.data[0]?.insurance_company)
                }
                const lob = data.data[0]?.line_of_business;
                const lob_dt = lob?.length;
                const lob_obj = [];
                for (let i = 0; i < lob_dt; i++) {
                    const lob_obj1 = { label: lob[i]['lob_name'], value: lob[i]['lob_id'] };
                    lob_obj.push(lob_obj1);
                }
                var lobValues = lob_obj;
                setStaffLob(lobValues);
                const location = data.data[0].location;
                const location_dt = location.length;
                const location_obj = [];
                for (let i = 0; i < location_dt; i++) {
                    const location_obj1 = { label: location[i]['loc_name'], value: location[i]['loc_id'] };
                    location_obj.push(location_obj1);
                }
                var locationValues = location_obj;

                const business_type = data.data[0].admin_business_type;
                const business_type_dt = business_type?.length;
                const business_type_obj = [];
                for (let i = 0; i < business_type_dt; i++) {
                    const business_type_obj1 = { label: business_type[i]['type'], value: business_type[i]['type'] };
                    business_type_obj.push(business_type_obj1);
                }
                var business_typeValues = business_type_obj;

                setStaffLocation(locationValues);
                setStaffBusiness(business_typeValues);
            });
    }
    const getCustomerdetails = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getCustomerDetails?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setCustomerDetails(data.data)
                console.log(data.data, "<<<<customer details")

            });
    }
    const CustomerupdateSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const staff_name = data.get('staff_name');
        const staff_email = data.get('staff_email');
        const staff_mobile = data.get('staff_mobile');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                full_name: staff_name,
                email: staff_email,
                mobile_number: staff_mobile,
            }),
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateCustomerProfile?id=${staffid}`, requestOptions)
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
                            navigate('/ViewStaff')
                        }
                    })
                }
                else {
                    Swal.fire({
                        title: 'Error',
                        text: data.message,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/ViewStaff");
                        }
                    });
                }
            });

    }
    const updateSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const staff_name = data.get('staff_name');
        const staff_email = data.get('staff_email');
        const staff_mobile = data.get('staff_mobile');
        const staff_business = (staff_Business_type1 == null) ? staffBusiness : staff_Business_type1;
        const staff_password = data.get('staff_password');
        const staff_usertype = data.get('staff_usertype');
        let company = ''
        if (staff_usertype == "653604248028cba2487f7d2a") {
            company = data.get('company')
        }
        const staff_lob = staffLob;
        const staff_location = staffLocation;
        const staff_id = staffid;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                staff_name: staff_name,
                staff_email: staff_email,
                staff_mobile: staff_mobile,
                staff_business: staff_business,
                staff_password: staff_password,
                staff_lob: staff_lob,
                staff_location: staff_location,
                staff_id: staff_id,
                company: company,
                staff_usertype: staff_usertype
            }),
        };
        console.log('requestOptions', {
            staff_name: staff_name,
            staff_email: staff_email,
            staff_mobile: staff_mobile,
            staff_business: staff_business,
            staff_password: staff_password,
            staff_lob: staff_lob,
            staff_location: staff_location,
            staff_id: staff_id,
            company: company,
            staff_usertype: staff_usertype
        })
        fetch('https://insuranceapi-3o5t.onrender.com/api/updateStaff', requestOptions)
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
                            navigate('/ViewStaff')
                        }
                    })
                }
                else {
                    Swal.fire({
                        title: 'Error',
                        text: data.message,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/ViewStaff");
                        }
                    });
                }
            });
    }

    const handleChange = (selectedOption) => {
        setStaffLocation(selectedOption);
    };

    const handleChange1 = (selectedOption) => {
        setStaffLob(selectedOption);
    };
    const HandleUserTypeChange = (e) => {
        if (e.target.value === '653604248028cba2487f7d2a') {
            setShowCompanyfeild(true)
        } else {
            setShowCompanyfeild(false)
            setdefICompany('')
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
                                    <h4 className="card-title">Edit Staff</h4>
                                </div>
                                <div className="col-md-6">
                                    <a href="/ViewStaff" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                                </div>
                                {urluser == "Customer" ? (
                                    <div className="card-body">
                                        <form action="/" method="PUT" onSubmit={CustomerupdateSubmit}>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Name</label>
                                                        <input type="text" className="form-control" name="staff_name" defaultValue={customerDetails?.full_name} placeholder="Enter Name" autoComplete="off" required />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Email</label>
                                                        <input type="email" className="form-control" name="staff_email" defaultValue={customerDetails?.email} placeholder="Enter Email" autoComplete="off" required />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Mobile</label>
                                                        <input type="text" className="form-control" name="staff_mobile" defaultValue={customerDetails?.mobile_number} placeholder="Enter Mobile" autoComplete="off" required />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12" style={{ textAlign: 'right' }}>
                                                    <button type="submit" className="btn btn-primary">Update</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                ) :
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={updateSubmit}>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Name</label>
                                                        <input type="text" className="form-control" name="staff_name" defaultValue={staffName} placeholder="Enter Name" autoComplete="off" required />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Email</label>
                                                        <input type="email" className="form-control" name="staff_email" defaultValue={staffEmail} placeholder="Enter Email" autoComplete="off" required />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label>Mobile</label>
                                                        <input type="text" className="form-control" name="staff_mobile" defaultValue={staffMobile} placeholder="Enter Mobile" autoComplete="off" required />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label>User Type</label>
                                                        <select className="form-control" onClick={(e) => HandleUserTypeChange(e)} name="staff_usertype" required>
                                                            <option hidden value="">Select User Type</option>
                                                            {
                                                                userTypes.length > 0 &&
                                                                userTypes.map((item, index) => (
                                                                    <option key={index} value={item._id} selected={userType == item._id ? true : false}>{item.usertype}</option>
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
                                                                    <option key={index} selected={defICompany == item._id} value={item._id}>{item.company_name}</option>
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
                                                            selectedValues={staffLocation}
                                                            onSelect={handleChange}
                                                            onRemove={handleChange}
                                                            placeholder="Select Location"
                                                            closeOnSelect={false}
                                                            avoidHighlightFirstOption={true}
                                                            showCheckbox={true}
                                                            style={{ chips: { background: "#007bff" } }}
                                                            showArrow={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label>Line Of Business</label>
                                                        <Multiselect
                                                            options={LineOfBusiness}
                                                            displayValue="label"
                                                            selectedValues={staffLob}
                                                            onSelect={handleChange1}
                                                            onRemove={handleChange1}
                                                            placeholder="Select Line Of Business"
                                                            closeOnSelect={false}
                                                            avoidHighlightFirstOption={true}
                                                            showCheckbox={true}
                                                            style={{ chips: { background: "#007bff" } }}
                                                            showArrow={true}

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
                                                            selectedValues={staffBusiness}
                                                            onSelect={setBusiness_type1}
                                                            onRemove={setBusiness_type1}
                                                            placeholder="Select Type"
                                                            closeOnSelect={false}
                                                            avoidHighlightFirstOption={true}
                                                            showCheckbox={true}
                                                            style={{ chips: { background: "#007bff" } }}
                                                            showArrow={true}

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
                                                    <button type="submit" className="btn btn-primary">Update</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditStaff
