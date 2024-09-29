import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";

const AddCompanyUser = () => {

    const navigate = useNavigate();

    const [perPage] = useState(15);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [lineOfBusiness, setLineOfBusiness] = useState([]);
    const [lob, setlob] = useState([]);


    useEffect(() => {
        getlistLineOfBusiness();
    }, []);

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
                console.log(data)
                const line_of_businessdt = data?.data
                const line_of_business_list = line_of_businessdt?.map((item) => {
                    return {
                        label: item?.line_of_business_name,
                        value: item?._id,
                    }
                }
                )
                setLineOfBusiness(line_of_business_list)
            })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const name = data.get('staff_name');
        const email = data.get('staff_email');
        const mobile = data.get('staff_mobile');
        const date_of_brith = data.get('date_of_birth');
        const line_of_business = lob;

        console.log(name, email, mobile, date_of_brith, line_of_business);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
            },
            body: JSON.stringify({ name, email, mobile, date_of_brith, line_of_business })
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/requestForUserCreate', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status == 201) {
                    swal("Success", "User Added Successfully", "success");
                    navigate('/insurancecompanydashboard');
                    console.log(data.data);
                    getUsers(page, perPage);
                } else {
                    swal("Error", "Failed to Add User", "error");
                }
            });

    }

    const getUsers = async (page, perPage) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
            }
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getRequestForUserCreate?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data.data);
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                let request = 0;
                const requestdata = data.data;
                console.log(requestdata.filter((item) => item.agentApprovalStatus == false));
                request = requestdata?.length;
                console.log(request);
                localStorage.setItem('request', request);

            });
    }







    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card" style={{ marginTop: '20px' }}>
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Add User</h4>
                                </div>
                                <div className="col-md-6">
                                    <a href="/insurancecompanydashboard" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
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

                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Mobile</label>
                                                    <input type="text" className="form-control" name="staff_mobile" placeholder="Enter Mobile" autoComplete="off" required />
                                                </div>
                                            </div>


                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>D.O.B </label>
                                                    <input type="date"
                                                        className="form-control"
                                                        name="date_of_birth"
                                                        format="dd-mm-yyyy"
                                                        placeholder="Select Date Of Birth"
                                                        autoComplete="off"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label>Line Of Business </label>
                                                    <Multiselect

                                                        options={lineOfBusiness}
                                                        displayValue="label"
                                                        onSelect={setlob}
                                                        onRemove={setlob}
                                                        placeholder="Select LOB"
                                                        showCheckbox={true}
                                                        showArrow={true}
                                                    />
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

export default AddCompanyUser