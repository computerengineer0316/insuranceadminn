import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'

const OtherInsurancesLeadDetails = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search)
    const ParamValue = params.get('id')
    useEffect(() => {
        detailsbyid();
    }, []);

    const [data, setData] = useState();
    const [viewhomeConditions, setviewHomeConditions] = useState(false);
    const detailsbyid = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getOrtherLobLeaddetails?leadId=${ParamValue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data.data, "data")
                setData(data.data[0])
            }
            )
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card" style={{ marginTop: '20px' }}>
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Details</h4>
                                </div>
                                {/* <div className="col-md-6">
                                        <button onClick={() => navigate("/ManageSupervisorDashboard")} className="btn btn-primary" style={{ float: 'right' }}>Back</button>
                                    </div> */}
                            </div>
                        </div>
                        <div className="card-body">

                            <form action='/'>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card">
                                                <div className="card-body">
                                                    <form action="/" method="POST" >

                                                        <div className="row">

                                                            <div className="col-md-4" >
                                                                <div className="form-group mb-3">
                                                                    <label className="form-label"><strong>Other Insurance Option</strong></label>
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        name="model_motor_detail_name"
                                                                        autoComplete="off"
                                                                        required
                                                                        readOnly
                                                                        value={data?.other_insurance_name[0]?.insurance_name}

                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-4" >
                                                                <div className="form-group mb-3">
                                                                    <label className="form-label"><strong>Full Name</strong></label>
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        name="name"
                                                                        autoComplete="off"
                                                                        required
                                                                        readOnly
                                                                        value={data?.name}
                                                                    />
                                                                </div>
                                                            </div>



                                                            <div className="col-md-4">
                                                                <div className="form-group mb-3">
                                                                    <label className="form-label"><strong>Email Address</strong></label>
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        name="email"
                                                                        autoComplete="off"
                                                                        required
                                                                        readOnly
                                                                        value={data?.email}
                                                                    />
                                                                </div>
                                                            </div>


                                                            <div className="col-md-4">
                                                                <div className="form-group mb-3">
                                                                    <label className="form-label"><strong>Phone Number</strong></label>
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        name="mobile_number"
                                                                        autoComplete="off"
                                                                        required
                                                                        readOnly
                                                                        value={data?.phoneno}
                                                                    />
                                                                </div>
                                                            </div>


                                                            <div className="col-md-4">
                                                                <div className="form-group mb-3">
                                                                    <label className="form-label"><strong>Brief Information</strong></label>
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        name="model_motor_detail_name"
                                                                        autoComplete="off"
                                                                        required
                                                                        readOnly
                                                                        value={data?.brief_information}

                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-4" >
                                                                <div className="form-group mb-3">
                                                                    <label className="form-label"><strong>Selected Day</strong></label>
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        name="model_motor_detail_name"
                                                                        autoComplete="off"
                                                                        required
                                                                        readOnly
                                                                        value={data?.call_day[0]?.name}

                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-4" >
                                                                <div className="form-group mb-3">
                                                                    <label className="form-label"><strong>Selected Time</strong></label>
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        name="premium"
                                                                        autoComplete="off"
                                                                        required
                                                                        readOnly
                                                                        value={data?.call_time}

                                                                    />
                                                                </div>
                                                            </div>



                                                        </div>
                                                    </form>

                                                </div>
                                            </div>
                                        </div>
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

export default OtherInsurancesLeadDetails
