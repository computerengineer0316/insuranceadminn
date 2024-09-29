import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'

const YachtLeaddetails = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search)
    const ParamValue = params.get('id')


    useEffect(() => {
        detailsbyid();
    }, []);

    const [data, setData] = useState([]);
    const [model_year, setmodel_year] = useState('');
    const [viewTerritoryCoverage, setviewTerritoryCoverage] = useState(false);
    const [opExp, setviewOperatorExperience] = useState(false)
    const [claimExp, setviewClaimExperience] = useState(false)


    const detailsbyid = async () => {
        const requestOptions = {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getYatchNewLeadDetails?leadId=${ParamValue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setData(data.data)
                setmodel_year(data.data.model_year)
            }
            )
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
                                        <h4 className="card-title">Details</h4>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ float: 'right' }}>Back</button>
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
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Name</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="dep"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.name}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Email Address</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="min"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.email}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Date of Birth</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="max"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.date_of_birth ? new Date(item.date_of_birth).toLocaleDateString('en-GB') : ''}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}


                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Mobile Number</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="min_dep"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.phoneno}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>LOB</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.policy_type[0].line_of_business_name}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <label style={{ fontSize: '18px' }}><strong>Yacht Details</strong></label>
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Yacht Name</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_details?.boat_name}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Registration No.</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_details?.boat_registration_no}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Hull Serial Number</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_details?.boat_hull_serial_number}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Hull Material</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_details?.boat_hull_material}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Length of the Boat</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_details?.boat_length_in_meter}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Breadth of the boat</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_details?.boat_breath_in_meter}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>No. of Passengers</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_details?.no_of_passengers}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Place of Mooring</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_details?.place_of__mooring}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Type of use</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_details?.yacht_type_of_use}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label" ><strong>Is Your Boat Brand New?</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.bot_brand_new == true ? "Yes" : "No"}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Current policy status</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_details?.current_policy_status}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Yacht model year</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.model_year}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Yacht Maker</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.YachtMakerData[0].name}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Yacht Model</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.YachtVarientData[0].name}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <label style={{ fontSize: '18px' }}><strong>Engine Details</strong></label>
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Maker</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_engine_details?.engine_maker}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Engine Serial Number</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_engine_details?.engine_seriel_number}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Model Year</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_engine_details?.engine_model_year}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Horse Power</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_engine_details?.engine_horsepower}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Yacht Speed</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_engine_details?.engine_speed}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Engine Type</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_engine_details?.engine_type}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Type Of Use</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_details?.yacht_type_of_use}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Is your boat brand new?</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.bot_brand_new == true ? "Yes" : "No"}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <label style={{ fontSize: '18px' }}><strong>Sum Insured(AED):</strong></label>
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Hull and Equipment Value</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.sumInsured?.sum_insured_hull_equipment_value}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Dinghy/Tender</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.sumInsured?.sum_insured_dinghy_tender}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Out Board</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.sumInsured?.sum_insured_out_board}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Personal Effect Includning Cash</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.sumInsured?.sum_insured_personal_effect_including_cash}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Trailer</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.sumInsured?.sum_insured_trailer}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Lead Location</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.lead_location.map((item1, index) => (
                                                                                    item1.location_name
                                                                                )).join(', ')}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Claim Years</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.yatchClaimsExperience}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Opearators Experience</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.yatchClaimsExperience}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Claim Experience</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.yatchClaimsExperience1 ? (item.yatchClaimsExperience1.min / 12) + "-" + (item.yatchClaimsExperience1.max / 12) + " years" : ""}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <label style={{ fontSize: '18px' }}><strong>Questions:</strong></label>
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Territory of Coverage</strong></label>
                                                                            <div className='btn btn-warning mx-2' onClick={() => setviewTerritoryCoverage(true)}>View</div>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Operator Experience Questions</strong></label>
                                                                            <div className='btn btn-warning mx-2' onClick={() => setviewOperatorExperience(true)}>View</div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Claim Experience Questions</strong></label>
                                                                            <div className='btn btn-warning mx-2' onClick={() => setviewClaimExperience(true)}>View</div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <label style={{ fontSize: '18px' }}><strong>Plan Details:</strong></label>
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Plan Company</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.insuranceompanyData[0]?.company_name}
                                                                            // value={item.yachtPlanData?.map(item1 => (
                                                                            //     item1.company_name
                                                                            // )).join(', ')}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Plan Name</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.yachtPlanData[0]?.plan_name}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}


                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Policy Issued Date</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.policy_issued_date?.slice(0, 10)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Policy Expiry Date</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.policy_expiry_date}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Payment Status</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.paymentStatus}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Premium</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.final_price}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Policy Type</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.boat_details?.current_policy_status}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                <div className="col-md-12">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label"><strong>Documents</strong></label>

                                                                    </div>
                                                                    <div className="ksndfksk">
                                                                        {data.map((item, index) => (
                                                                            <div className="row form-group md-4" key={index}>
                                                                                {item?.documents.map((image, index1) => (
                                                                                    <div className='col-lg-4' key={index1}>
                                                                                        <a
                                                                                            href={`https://insuranceapi-3o5t.onrender.com/documents/${image?.file}`}
                                                                                            download target='_blank' rel="noreferrer">
                                                                                            <img src={`https://insuranceapi-3o5t.onrender.com/documents/${image?.file}`} alt="license_front" className='img_abcd1234' />
                                                                                            <p className="form-label"><strong>{image?.name}</strong></p>
                                                                                        </a>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                            </div>

                                                        </form>
                                                        <Modal size="lg" show={viewTerritoryCoverage} onHide={() => setviewTerritoryCoverage(false)}>
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Territory of Coverage</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <div className="container">
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="card">
                                                                                <div>
                                                                                    <table className="table table-bordered">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th>No.</th>
                                                                                                <th>Condition</th>
                                                                                                <th>Value</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {data[0]?.territoryCoverage?.map((item1, index1) => (
                                                                                                <tr key={index1}>
                                                                                                    <td>{index1 + 1}</td>
                                                                                                    <td>{item1.name}</td>
                                                                                                    <td>{item1.value == true ? "YES" : "NO"}</td>
                                                                                                </tr>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={() => setviewTerritoryCoverage(false)}>
                                                                    Close
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>
                                                        <Modal size="lg" show={opExp} onHide={() => setviewOperatorExperience(false)}>
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Operator Experience Questions</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <div className="container">
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="card">
                                                                                <div>
                                                                                    <table className="table table-bordered">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th>No.</th>
                                                                                                <th>Condition</th>
                                                                                                <th>Value</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {data[0]?.YachtOperaterExperienceQuestions?.map((item1, index1) => (
                                                                                                <tr key={index1}>
                                                                                                    <td>{index1 + 1}</td>
                                                                                                    <td>{item1.name}</td>
                                                                                                    <td>{item1.value == true ? "YES" : "NO"}</td>
                                                                                                </tr>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={() => setviewOperatorExperience(false)}>
                                                                    Close
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>
                                                        <Modal size="lg" show={claimExp} onHide={() => setviewClaimExperience(false)}>
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Claim Experience Questions</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <div className="container">
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="card">
                                                                                <div>
                                                                                    <table className="table table-bordered">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th>No.</th>
                                                                                                <th>Condition</th>
                                                                                                <th>Value</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {data[0]?.yatchClaimsExperienceQuestions?.map((item1, index1) => (
                                                                                                <tr key={index1}>
                                                                                                    <td>{index1 + 1}</td>
                                                                                                    <td>{item1.name}</td>
                                                                                                    <td>{item1.value == true ? "YES" : "NO"}</td>
                                                                                                </tr>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={() => setviewClaimExperience(false)}>
                                                                    Close
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>
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

        </>
    )
}

export default YachtLeaddetails;