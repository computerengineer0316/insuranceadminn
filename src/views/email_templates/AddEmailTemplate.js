import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AddEmailTemplate = () => {

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


    const [lineOfBusiness, setLineOfBusiness] = useState([]);
    const [policyType, setPolicyType] = useState([]);

    const [subject, setSubject] = useState('');
    const [selectedLineOfBusiness, setSelectedLineOfBusiness] = useState('');
    const [selectedBusinessType, setSelectedBusinessType] = useState('');
    const [selectedPlanType, setSelectedPlanType] = useState('');
    const [email, setEmail] = useState('');
    const [emailtypelist, setEmailTypeList] = useState([]);
    const [emailType, setEmailType] = useState('');


    useEffect(() => {
        getlistLineOfBusiness();
        getpolicytypelist();
        handleType();
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

    const handlelob = (e) => {
        const selectedList = e.target.value;
        console.log('selectedList', selectedList);
        setSelectedLineOfBusiness(selectedList);
        setSelectedPlanType('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('subject', subject);
            console.log('selectedLineOfBusiness', selectedLineOfBusiness);
            console.log('selectedBusinessType', selectedBusinessType);
            console.log('selectedPlanType', selectedPlanType);
            console.log('email', email);



            const formData = new FormData();
            formData.append('subject', subject);
            formData.append('LOB', selectedLineOfBusiness);
            formData.append('business_type', selectedBusinessType);
            formData.append('plan_type', selectedPlanType);
            formData.append('body', email);
            formData.append('email_type', emailType);

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
                },
                body: JSON.stringify({ subject, LOB: selectedLineOfBusiness, business_type: selectedBusinessType, plan_type: selectedPlanType, body: email, email_type: emailType })
            };

            await fetch('https://insuranceapi-3o5t.onrender.com/api/addEmailTemplate', requestOptions)
                .then((response) => response.json())
                .then(data => {
                    console.log('data', data);
                    if (data.status == '201') {
                        swal('', data.message, 'success');
                        navigate('/viewemailtemplates');
                    } else {
                        swal('', data.message, 'error');
                    }
                });

        } catch (error) {
            console.log('error', error);
        }
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
                                        <h4 className="card-title">Add Email Template</h4>
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
                                                        <input type="text" className="form-control" name="staff_name" placeholder="Enter Name" autoComplete="off" required onChange={(e) => setSubject(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Line Of Business</strong></label>
                                                        <select className="form-control" name="line_of_business" required onChange={(e) => handlelob(e)}>
                                                            <option value="" hidden>Select Line Of Business</option>
                                                            {lineOfBusiness.map((item, indx) => (
                                                                <option key={indx} value={item.value}>{item.label}</option>
                                                            ))}
                                                        </select>

                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Business Type </strong></label>
                                                        <select className="form-control" name="business_type" required onChange={(e) => setSelectedBusinessType(e.target.value)}>
                                                            <option value="" hidden>Select Business Type</option>
                                                            <option value="New">New Business</option>
                                                            <option value="Renewal">Renewal Business</option>
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
                                                                    <option key={index} value={item._id}>{item.policy_type_name}</option>
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
                                                            {emailtypelist?.map((item, index) => (
                                                                <option key={index} value={item._id}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Email</strong></label>
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            data="<p>Dear Valued Customer,</p>"
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

export default AddEmailTemplate