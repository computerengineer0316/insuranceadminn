import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';



const ViewMail = () => {
    const navigate = useNavigate();

    const [lineOfBusiness, setLineOfBusiness] = useState([]);
    const [policyType, setPolicyType] = useState([]);

    const [subject, setSubject] = useState('');
    const [selectedLineOfBusiness, setSelectedLineOfBusiness] = useState('');
    const [selectedBusinessType, setSelectedBusinessType] = useState('');
    const [selectedPlanType, setSelectedPlanType] = useState('');
    const [email, setEmail] = useState('');
    const [emailtypelist, setEmailTypeList] = useState([]);
    const [emailType, setEmailType] = useState('');


    const [sent_by, setSentBy] = useState('');
    const [received_by, setReceivedBy] = useState([]);
    const [cc, setCC] = useState([]);
    const [bcc, setBCC] = useState([]);
    const [network, setNetwork] = useState('');
    const [template, setTemplate] = useState('');
    const [isReadOnly, setIsReadOnly] = useState(false);


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
            getEmaildetails(id);
            getlistLineOfBusiness();
            getpolicytypelist();

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

    const getEmaildetails = async (id) => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
                },
            }
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/getEmail/${id}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    setSubject(data?.data?.subject);
                    setEmail(data?.data?.body);
                    setSelectedLineOfBusiness(data?.data?.LOB?._id);
                    setSelectedBusinessType(data?.data?.business_type);
                    setSelectedPlanType(data?.data?.plan_type?._id);
                    setSentBy(data?.data?.sent_by);
                    setReceivedBy(data?.data?.received_by);
                    setCC(data?.data?.cc);
                    setBCC(data?.data?.bcc);
                    setNetwork(data?.data?.network);
                    setTemplate(data?.data?.subject);

                })
        }
        catch (error) {
            console.log(error)
        }
    }

    const customConfig = {
        toolbar: {
            items: [
                // 'heading', '|',
                // 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                // 'indent', 'outdent', '|',
                // 'blockQuote', '|',
                // 'undo', 'redo'
            ],
        },
        isReadOnly: true,

        placeholder: 'Start typing here...'
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card" style={{ marginTop: '20px' }}>
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="card-title">View Email</h4>
                                    </div>
                                    <div className="col-md-6">
                                        <a className="btn btn-primary" style={{ float: 'right' }} onClick={() => navigate(-1)}>Back</a>
                                    </div>
                                    <div className="card-body">
                                        <form action="/" method="POST">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Subject</strong></label>
                                                        <input type="text" className="form-control" name="staff_name" placeholder="Enter Name" autoComplete="off" required value={subject} readOnly />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Line Of Business</strong></label>
                                                        <select className="form-control" name="line_of_business" required readOnly>
                                                            <option value="" hidden>Select Line Of Business</option>
                                                            {lineOfBusiness.map((item, indx) => (
                                                                <option key={indx} value={item.value} selected={item.value == selectedLineOfBusiness}>{item.label}</option>
                                                            ))}
                                                        </select>

                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Business Type </strong></label>
                                                        <select className="form-control" name="business_type" required value={selectedBusinessType} readOnly>
                                                            <option value="" hidden>Select Business Type</option>
                                                            <option value="New">New Business</option>
                                                            <option value="Renewal">Renewal Business</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                {selectedLineOfBusiness == '6418643bf42eaf5ba1c9e0ef' || selectedLineOfBusiness == '641bf0bbcbfce023c8c76739' ?
                                                    <div className="col-md-6" >
                                                        <div className="form-group mb-3">
                                                            <label><strong>Plan Type</strong></label>
                                                            <select
                                                                className='form-control'
                                                                readOnly
                                                            >
                                                                <option value="" hidden>Select Plan Type</option>
                                                                {policyType?.map((item, index) => (
                                                                    <option key={index} value={item._id} selected={item._id == selectedPlanType}>{item.policy_type_name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    : ''
                                                }
                                                {/* <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Type </strong></label>
                                                        <select className="form-control" name="type" required >
                                                            <option value="" hidden>Select Type</option>
                                                            {emailtypelist?.map((item, index) => (
                                                                <option key={index} value={item._id}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div> */}
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Sent By</strong></label>
                                                        <input type="text" className="form-control" name="staff_name" placeholder="Enter Name" autoComplete="off" required value={sent_by} readOnly />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Received By</strong></label>
                                                        <input type="text" className="form-control" name="staff_name" placeholder="Enter Name" autoComplete="off" required value={received_by?.map((val) => val.email).join(', ')} readOnly />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>CC</strong></label>
                                                        <input type="text" className="form-control" name="staff_name" placeholder="CC" autoComplete="off" required value={cc?.map((val) => val?.name).join(', ')} readOnly />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>BCC</strong></label>
                                                        <input type="text" className="form-control" name="staff_name" placeholder="BCC" autoComplete="off" required value={bcc?.map((val) => val.name).join(', ')} readOnly />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Network</strong></label>
                                                        <input type="text" className="form-control" name="staff_name" placeholder="Enter Name" autoComplete="off" required value={network} readOnly />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label><strong>Template</strong></label>
                                                        <input type="text" className="form-control" name="staff_name" placeholder="Template" autoComplete="off" required value={template} readOnly />
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
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                </div>

                                            </div>

                                            {/* <div className="row">
                                                <div className="col-md-12" style={{ textAlign: 'right' }}>
                                                    <button type="submit" className="btn btn-primary" >Save</button>
                                                </div>
                                            </div> */}
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


export default ViewMail