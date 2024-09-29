import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditEmailTemplate = () => {
    const navigate = useNavigate();

    const customConfig = {
        toolbar: {
            items: [
                'heading', '|',
                'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                'indent', 'outdent', '|',
                'blockQuote', '|',
                'undo', 'redo'
            ]
        },
        placeholder: 'Start typing here...'
    };

    const [emailTemplate, setEmailTemplate] = useState([]);
    const [subject, setSubject] = useState('');
    const [email, setEmail] = useState('');
    const [lineOfBusiness, setLineOfBusiness] = useState([]);
    const [selectedLineOfBusiness, setSelectedLineOfBusiness] = useState('');
    const [selectedBusinessType, setSelectedBusinessType] = useState('');
    const [selectedPlanType, setSelectedPlanType] = useState('');
    const [policyType, setPolicyType] = useState([]);
    const [emailtypelist, setEmailTypeList] = useState([]);
    const [emailType, setEmailType] = useState('');

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
            getEmailTemplatedetails(id);
            getlistLineOfBusiness();
            getpolicytypelist();
            handleType();
        }
    }, [])

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

    const getpolicytypelist = async () => {


        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_all_policiy_type`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setPolicyType(data.data);
            });
    }

    const getEmailTemplatedetails = async (id) => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
                },
            }
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/getEmailTemplate/${id}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    setEmailTemplate(data?.data);
                    setSubject(data?.data?.subject);
                    setEmail(data?.data?.body);
                    setSelectedLineOfBusiness(data?.data?.LOB?._id);
                    setSelectedBusinessType(data?.data?.business_type);
                    setSelectedPlanType(data?.data?.plan_type?._id);
                    setEmailType(data?.data?.email_type);

                })
        }
        catch (error) {
            console.log(error)
        }
    }

    const handlelob = (e) => {
        const selectedList = e.target.value;
        console.log('selectedList', selectedList);
        setSelectedLineOfBusiness(selectedList)
        setSelectedPlanType('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = window.location.href;
        const url1 = url.split("/")[3];
        const url2 = url1.split("?")[1];
        const id = url2.split("=")[1];
        const data = {
            subject: subject,
            body: email,
            LOB: selectedLineOfBusiness,
            business_type: selectedBusinessType,
            plan_type: selectedPlanType,
            email_type: emailType
        }


        console.log(data)

        // return false;


        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
            },
            body: JSON.stringify(data)
        }
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/updateEmailTemplate/${id}`, requestOptions)
            .then(async (response) => {
                const status = response.status; // Extract status here
                const data = await response.json();
                return ({
                    status: status, // Add status to the data object
                    data: data
                });
            })
            .then((data) => {
                console.log(data)
                if (data.status == 200) {
                    Swal.fire({
                        title: 'Success',
                        text: data.message,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate('/ViewEmailTemplates')
                    })
                }
                else {
                    Swal.fire({
                        title: 'Error',
                        text: data.message,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
            })
    }


    const handleType = () => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/getEmailTypes`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    setEmailTypeList(data.data);
                });


        } catch (error) {
            console.log('error', error);
        }
    }


    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card" style={{ marginTop: '20px' }}>
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="card-title">Edit Email Template</h4>
                                    </div>
                                    <div className="col-md-6">
                                        <a href="/ViewEmailTemplates" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                                    </div>
                                    <div className="card-body">
                                        <form action="/" method="POST">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Subject</strong></label>
                                                        <input type="text" className="form-control" name="staff_name" placeholder="Enter Name" autoComplete="off" required value={subject} onChange={(e) => setSubject(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Line Of Business</strong></label>
                                                        <select className="form-control" name="line_of_business" required onChange={(e) => handlelob(e)} defaultValue={selectedLineOfBusiness}>
                                                            <option value="" hidden>Select Line Of Business</option>
                                                            {lineOfBusiness.map((item, indx) => (
                                                                <option key={indx} value={item.value} selected={item.value == selectedLineOfBusiness}  >{item.label}</option>
                                                            ))}
                                                        </select>

                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Business Type </strong></label>
                                                        <select className="form-control" name="business_type" required onChange={(e) => setSelectedBusinessType(e.target.value)} value={selectedBusinessType} >
                                                            <option value="" hidden>Select Business Type</option>
                                                            <option value="NEW">New Business</option>
                                                            <option value="RENEWAL">Renewal Business</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                {selectedLineOfBusiness == '6418643bf42eaf5ba1c9e0ef' || selectedLineOfBusiness == '641bf0bbcbfce023c8c76739' ?
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-3">
                                                            <label><strong>Plan Type</strong></label>
                                                            <select
                                                                className='form-control'
                                                                onChange={(e) => setSelectedPlanType(e.target.value)}
                                                            >
                                                                <option value="" hidden>Select Plan Type</option>
                                                                {policyType?.map((item, index) => (
                                                                    <option key={index} value={item._id} selected={item._id == selectedPlanType}>{item?.policy_type_name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    : ''
                                                }
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Type </strong></label>
                                                        <select className="form-control" name="type" required onChange={(e) => setEmailType(e.target.value)}>
                                                            <option value="" hidden>Select Type</option>
                                                            {emailtypelist?.map((item, indx) => (
                                                                <option key={indx} value={item._id} selected={item?._id == emailType}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Email</strong></label>
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            data={email}
                                                            config={customConfig}
                                                            onReady={editor => {
                                                                // You can store the "editor" and use when it is needed.
                                                                console.log('Editor is ready to use!', editor);
                                                            }}
                                                            onChange={(event, editor) => {
                                                                const data = editor.getData();
                                                                setEmail(data);
                                                            }}
                                                            onBlur={(event, editor) => {
                                                                console.log('Blur.', editor);
                                                            }}
                                                            onFocus={(event, editor) => {
                                                                console.log('Focus.', editor);
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="row">
                                                <div className="col-md-12" style={{ textAlign: 'right' }}>
                                                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Save</button>
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
        </>
    )
}

export default EditEmailTemplate