import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ViewLob = () => {
    const navigate = useNavigate();
    const [companyId, setCompanyId] = useState('');
    const [lineofbusiness, setLob] = useState([]);

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
        }
    }, []);

    const CompanyDetails = (id) => {
        setLob([]);
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
                    const lob = company.company_line_of_business_id;
                    const lob_id = lob.split(',');
                    const lob_id_len = lob_id.length;
                    for (let i = 0; i < lob_id_len; i++) {
                        const requestOptions = {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        };
                        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_by_id/${lob_id[i]}`, requestOptions)
                            .then(response => response.json())
                            .then(data => {
                                if (data.status === 200) {
                                    const line_of_business_id = data.data._id;
                                    const line_of_business_name = data.data.line_of_business_name;

                                    const requestOptions = {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            company_id: id,
                                            line_of_business_id: line_of_business_id,
                                        })
                                    };
                                    fetch(`https://insuranceapi-3o5t.onrender.com/api/getapiintegrate`, requestOptions)
                                        .then(response => response.json())
                                        .then(data1 => {
                                            if (data1.status === 200) {
                                                const ischeck1 = data1.data[0].api_integrate > 0 ? true : false;

                                                const lobdt = {
                                                    line_of_business_id: line_of_business_id,
                                                    line_of_business_name: line_of_business_name,
                                                    isCheck: ischeck1,
                                                    api_int_id: data1.data[0]._id,
                                                    api_status: data1.data[0].api_status,
                                                    credit_limit: data1.data[0].credit_limit
                                                }
                                                setLob(lineofbusiness => [...lineofbusiness, lobdt]);
                                            }
                                            else {
                                                const lobdt = {
                                                    line_of_business_id: line_of_business_id,
                                                    line_of_business_name: line_of_business_name,
                                                    isCheck: false,
                                                    api_int_id: 0,
                                                    api_status: 0,
                                                    credit_limit: 0
                                                }
                                                setLob(lineofbusiness => [...lineofbusiness, lobdt]);
                                            }
                                        });
                                }
                            });
                    }
                }
            });
    }

    const handleCheckboxChange = (event, id, id1) => {
        const isChecked = event.target.checked;

        if (isChecked) {
            apiintegrate(id, isChecked, id1);
        }
        else {
            apiintegrate(id, isChecked, id1);
        }
    };

    const apiintegrate = (id, isChecked, id1) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_id: companyId,
                line_of_business_id: id,
                isChecked: isChecked,
                api_int_id: id1
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/apiintegrate`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                CompanyDetails(companyId);
            });
    }

    const updateStatus = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                status: status
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateapistatus`, requestOptions)
            .then(response => response.json())
            .then(data => {
                CompanyDetails(companyId);
            });
    }

    const updatecreditamt = (event, id) => {
        const credit_limit = event.target.value;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                credit_limit: credit_limit
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updatecreditlimit`, requestOptions)
            .then(response => response.json())
            .then(data => {
                CompanyDetails(companyId);
            });
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mt-5">
                        <div className="card-header">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h4>Line of Business</h4>
                                </div>
                                <div className="col-md-6">
                                    <a href="/insurance-company" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Line of Business</th>
                                        <th>API Integrated</th>
                                        <th>Credit Limit</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        lineofbusiness.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.line_of_business_name}</td>
                                                    <td>
                                                        <div className="checkboxs">
                                                            <input className="form-check-input" type="checkbox" id="flexCheckDefault" checked={item.isCheck} onClick={(event) => handleCheckboxChange(event, item.line_of_business_id, item.api_int_id)} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='form-group'>
                                                            <input type='text' className='form-control' defaultValue={item.credit_limit} onBlur={(event) => updatecreditamt(event, item.api_int_id)} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {
                                                            item.api_int_id == "" ? "" : item.api_status === 1 ?
                                                                <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updateStatus(item.api_int_id, 0) }}>Deactivate</button> :
                                                                <button className="btn btn-success btn-sm" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updateStatus(item.api_int_id, 1) }}>Activate</button>

                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewLob
