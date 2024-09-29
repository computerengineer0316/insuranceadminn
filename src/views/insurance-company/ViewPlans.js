import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab } from 'react-bootstrap';
import MotorPlans from './MotorPlans';
import TravelPlans from './TravelPlans';
import HomePlans from './HomePlans';
import YachtPlans from './YachtPlans';
import MedicalPlans from './MedicalPlans';

const ViewPlans = () => {
    const navigate = useNavigate();
    const [companyId, setCompanyId] = useState('');
    const [lineofbusiness, setLob] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
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
                                    const line_of_business_id = data.data.map((val) => val?._id).toString();
                                    const line_of_business_name = data.data.map((val) => val?.line_of_business_name).toString()
                                    const lob = { line_of_business_id, line_of_business_name };
                                    setLob(lineofbusiness => [...lineofbusiness, lob]);
                                }
                            });
                    }
                }
            });
    }

    console.log(lineofbusiness);
    console.log(companyId);

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h4>Plans</h4>
                                    </div>
                                    <div className="col-md-6">
                                        <a href="/insurance-company" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '5px' }}>
                                <Tabs defaultActiveKey={lineofbusiness[0]?.line_of_business_name} id="uncontrolled-tab-example" className="mb-3">
                                    {lineofbusiness &&
                                        lineofbusiness.map((item, index) => (
                                            <Tab key={index} eventKey={item.line_of_business_name} title={item.line_of_business_name}>
                                                {item.line_of_business_name === 'Motor' && <MotorPlans companyId={companyId} />}
                                                {item.line_of_business_name === 'Travel' && <TravelPlans companyId={companyId} />}
                                                {item.line_of_business_name === 'Home' && <HomePlans companyId={companyId} />}
                                                {item.line_of_business_name === 'Yacht' && <YachtPlans companyId={companyId} />}
                                                {item.line_of_business_name === 'Medical' && <MedicalPlans companyId={companyId} />}

                                            </Tab>
                                        ))}
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewPlans;