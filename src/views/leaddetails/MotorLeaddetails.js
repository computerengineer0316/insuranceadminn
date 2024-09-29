import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Multiselect from "multiselect-react-dropdown";
import swal from 'sweetalert';
import { useToaster } from 'rsuite';

const MotorLeaddetails = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search)
    const ParamValue = params.get('id')


    useEffect(() => {
        detailsbyid();
    }, []);

    const [data, setData] = useState([]);
    const [model_year, setmodel_year] = useState('');



    const detailsbyid = async () => {
        const requestOptions = {
            method: 'Post',
            body: JSON.stringify({ ParamValue }),
            headers: { 'Content-Type': 'application/json' },
        };
        await fetch('https://insuranceapi-3o5t.onrender.com/api/get_new_lead_detailsbyid', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("data", data.data)
                setData(data.data)
                setmodel_year(data.data.model_year)
            }
            )
    }



    console.log(data)


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
                                                                {/* {
                                                                    data.map((item, index) => (
                                                                        <>
                                                                        <div className='row'> 
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Name: </label><p>{item.name}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Email: </label><p>{item.email}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Phone Number: </label><p>{item.phoneno}</p></strong>
                                                                        </div>
                                                                        <div className='row'> 
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Date Of Birth: </label><p>{item.date_of_birth ? new Date(item.date_of_birth).toLocaleDateString('en-GB') : ''}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>LOB: </label><p>{item.policy_type[0].line_of_business_name}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Lead Location: </label><p>{item.lead_location?.map((item1, index) => (item1.location_name)).join(', ')}</p></strong>
                                                                        </div>
                                                                        <div className='row'>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Final Price: </label><p>{item.final_price}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Plan Company: </label><p>{item.plan_company_id.map(item1 => (item1.company_name)).join(', ')}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Plan Name: </label><p>{item.plan_id.map(item1 => (item1.plan_name)).join(', ')}</p></strong>
                                                                        </div>
                                                                        <div className='row'>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Policy Issued Date: </label><p>{item.policy_issued_date}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Policy Exipry Date: </label><p>{item.policy_expiry_date}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Payment Status: </label><p>{item.paymentStatus}</p></strong>
                                                                        </div>
                                                                        <div className='row'>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Your Electric Car: </label><p>{item.electric_car == true ? 'Yes' : 'No'}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Buying Used Car: </label><p>{item.buying_used_car == true ? 'Yes' : 'No'}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Is Your Vehicle Brand New?: </label><p>{item.car_brand_new == true ? 'Yes' : 'No'}</p></strong>
                                                                        </div>
                                                                        <div className='row'>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Policy last_year_policy_type: </label><p>{item.polcy_type}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Last Year Policy Type: </label><p>{item.last_year_policy_type}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Model Year: </label><p>{item.model_year}</p></strong>
                                                                        </div>
                                                                        <div className='row'>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Make: </label><p>{item.car_maker}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Model: </label><p>{item.car_model}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Variant: </label><p>{item.car_variant}</p></strong>
                                                                        </div>
                                                                        <div className='row'>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Register Area: </label><p>{item.register_area}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Registration Year: </label><p>{item.registration_year}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Vehicle Specification: </label><p>{item.vehicle_specification}</p></strong>
                                                                        </div>
                                                                        <div className='row'>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Nationality: </label><p>{item.nationality}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Is the vehicle GCC Spec And unmodified?: </label><p>{item.vehicle_specification == 'GCC' ? 'Yes' : 'No'}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Driving Experience in UAE (months): </label><p>{(item.drivingexpinuae?.min != undefined ? item.drivingexpinuae.min : "")   + '-' + (item.drivingexpinuae?.max != undefined ? item.drivingexpinuae.max : "")}</p></strong>
                                                                        </div>
                                                                        <div className='row'>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Home Country Driving Experience (months): </label><p>{(item.drivingexp?.min != undefined ? item.drivingexp.min : "") + '-' + (item.drivingexp?.max != undefined ? item.drivingexp.max : "")}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Repair Type Name: </label><p>{item.repair_type_name.map(item1 => (item1.repair_type_name))}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Your Existing Policy Expired: </label><p>{item.your_existing_policy_expired == true ? 'Yes' : 'No'}</p></strong>
                                                                        </div>
                                                                        <div className='row'>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Last Year Claim: </label><p>{item.last_year_claim}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Claims Certificate From Issurer: </label><p>{item.claims_certificate_from_issurer}</p></strong>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Min Car Value: </label><p>{item.minCarValue}</p></strong>
                                                                        </div>
                                                                        <div className='row'>
                                                                        <strong className="col-md-4"><label style={{color:'red'}}>Max Car Value: </label><p>{item.maxCarValue}</p></strong>
                                                                        </div>

                                                                        </>
                                                                    ))
                                                                } */}
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

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Electric Car</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.electric_car == true ? 'Yes' : 'No'}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Is Your Vehicle Brand New?</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.car_brand_new == true ? 'Yes' : 'No'}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data[0]?.car_brand_new == false ? (
                                                                    <>
                                                                        {data.map((item, index) => (
                                                                            <div className="col-md-4" key={index}>
                                                                                <div className="form-group mb-3">
                                                                                    <label className="form-label"><strong>Buying Used Car</strong></label>
                                                                                    <input type="text"
                                                                                        className="form-control"
                                                                                        name="model_motor_detail_name"
                                                                                        autoComplete="off"
                                                                                        required
                                                                                        readOnly
                                                                                        value={item.buying_used_car == true ? 'Yes' : 'No'}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                        {
                                                                            data[0]?.buying_used_car == false ? (
                                                                                <>
                                                                                    {data.map((item, index) => (
                                                                                        <div className="col-md-4" key={index}>
                                                                                            <div className="form-group mb-3">
                                                                                                <label className="form-label"><strong>Current Insurer</strong></label>
                                                                                                <input type="text"
                                                                                                    className="form-control"
                                                                                                    name="current_insurer"
                                                                                                    autoComplete="off"
                                                                                                    required
                                                                                                    readOnly
                                                                                                    value={item.current_insurance_company_id[0]?.company_name}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </>
                                                                            ) : ("")
                                                                        }
                                                                    </>) : ("")}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Last Year Insurance Type</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.last_year_policy_type
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Vehicle Registration Under</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.polcy_type}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}



                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Vehicle Model Year</strong></label>
                                                                            <input
                                                                                type="text"
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
                                                                            <label className="form-label"><strong>Vehicle Make</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.car_maker}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Vehicle Model</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.car_model}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Vehicle Variant</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.CarvarientName}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Min Car Value</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.minCarValue}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Max Car Value</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.maxCarValue}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Vehicle Register Area</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.register_area}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>First Registration Year</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.registration_year}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Vehicle Specification</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.vehicle_specification}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Nationality</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.nationality}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {/* <div className="col-md-4">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label"><strong>Date of first registration</strong></label>
                                                                        <input type="text" className="form-control" name="start_year" autoComplete="off" required />
                                                                    </div>
                                                                </div> */}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Is the vehicle GCC Spec And unmodified?</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.vehicle_specification == 'GCC' ? 'Yes' : 'No'}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Driving Experience in UAE (months)</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="discontinution_year"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={(item.drivingexp?.min != undefined ? item.drivingexp.min : "") + '-' + (item.drivingexp?.max != undefined ? item.drivingexp.max : "")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Home Country Driving Experience (months)</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={(item.drivingexpinuae?.min != undefined ? item.drivingexpinuae?.min : "") + '-' + (item.drivingexpinuae?.max != undefined ? item.drivingexpinuae?.max : "")}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}


                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>How many years without any claim?</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="max_dep"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.last_year_claim}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Do You have no claims certificate from the insurer?</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="claim_certeficate_from_insurer"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.claims_certificate_from_issurer}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Is your current year policy still valid?</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.your_existing_policy_expired == true ? 'Yes' : 'No'}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {/* {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Repair Type Name</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.repair_type_name.map(item1 => (
                                                                                    item1.repair_type_name
                                                                                ))}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}


                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Last Year Claim</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.last_year_claim}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))} */}

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
                                                                            <label className="form-label"><strong>Final Price</strong></label>
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
                                                                {/*final_price*/}


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
                                                                                value={item.plan_company_id.map(item1 => (
                                                                                    item1.company_name
                                                                                )).join(', ')}
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
                                                                                value={item.plan_id.map(item1 => (
                                                                                    item1.plan_name
                                                                                )).join(', ')}
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

                                                                {/* {data.map((item, index) => (
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
                                                                ))} */}

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

                                                                <div className="col-md-12">
                                                                    <div className='row'>
                                                                        {/* <div className="col-md-4">
                                                                            <div className="form-group">
                                                                                <label className="form-label">
                                                                                    <strong>Transaction Type</strong>
                                                                                </label>
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    name="TCFno"
                                                                                    readOnly
                                                                                    defaultValue={""}
                                                                                
                                                                                />
                                                                            </div>
                                                                        </div> */}
                                                                        <div className="col-md-4">
                                                                            <div className="form-group">
                                                                                <label className="form-label">
                                                                                    <strong>TCF No</strong>
                                                                                </label>
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    name="TCFno"
                                                                                    readOnly
                                                                                    defaultValue={data[0]?.TCFno}
                                                                                // onChange={(e) => setTCFnodata(e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label className="form-label">
                                                                            <strong>Driving Details</strong>
                                                                        </label>
                                                                        <div className="row">
                                                                            <div className="col-md-3">
                                                                                <label className="form-label">
                                                                                    <strong>license number</strong>
                                                                                </label>
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    name="licenseNumber"
                                                                                    readOnly
                                                                                    defaultValue={data[0]?.drivingDetails?.licenseNumber}
                                                                                // onChange={(e) => setLicenseNumberdata(e.target.value)}

                                                                                />
                                                                            </div>
                                                                            <div className="col-md-3">
                                                                                <label className="form-label">
                                                                                    <strong>license issue date</strong>
                                                                                </label>
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    name="issuedate"
                                                                                    readOnly
                                                                                    // onChange={(e) => setIssueDatedata(e.target.value)}
                                                                                    defaultValue={data[0]?.drivingDetails?.issueDate}
                                                                                />
                                                                            </div>
                                                                            <div className="col-md-3">
                                                                                <label className="form-label">
                                                                                    <strong>license expiry date</strong>
                                                                                </label>
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    name="expirydate"
                                                                                    readOnly
                                                                                    // onChange={(e) => setExpiryDatedata(e.target.value)}
                                                                                    defaultValue={data[0]?.drivingDetails?.expiryDate}
                                                                                />
                                                                            </div>
                                                                            <div className="col-md-3">
                                                                                <label className="form-label">
                                                                                    <strong>license issuing Emirate</strong>
                                                                                </label>

                                                                                <input className="form-control"
                                                                                    name="essuingEmirate"
                                                                                    readOnly
                                                                                    defaultValue={data[0]?.drivingDetails?.issuingEmirate} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label className="form-label">
                                                                            <strong>Chassis number</strong>
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            name="chassisNumber"
                                                                            readOnly
                                                                            defaultValue={data[0]?.chassisNumber}
                                                                        // onChange={(e) => setChassisNumberdata(e.target.value)}

                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label className="form-label">
                                                                            <strong>Engine number</strong>
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            name="EnginNumber"
                                                                            readOnly
                                                                            defaultValue={data[0]?.EnginNumber}
                                                                        // onChange={(e) => setEnginNumberdata(e.target.value)}

                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label className="form-label">
                                                                            <strong>Registration Code</strong>
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            name="registrationNumber"
                                                                            readOnly
                                                                            defaultValue={data[0]?.registrationNumberCode}
                                                                        // onChange={(e) => setRegistrationNumberdata(e.target.value)}

                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label className="form-label">
                                                                            <strong>Registration number</strong>
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            name="registrationNumber"
                                                                            readOnly
                                                                            defaultValue={data[0]?.registrationNumber}
                                                                        // onChange={(e) => setRegistrationNumberdata(e.target.value)}

                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label className="form-label">
                                                                            <strong>Plate Category</strong>
                                                                        </label>
                                                                        <input
                                                                            name="plateCategory" className="form-control"
                                                                            readOnly
                                                                            defaultValue={data[0]?.plateCategory}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label className="form-label">
                                                                            <strong>Date Of First Registration</strong>
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            name="ThefirstRegistrationDate"
                                                                            readOnly
                                                                            defaultValue={data[0]?.date_of_first_registration?.slice(0, 10)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label className="form-label">
                                                                            <strong>Country of Manufacturing </strong>
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            name="countryOfManufacturing"
                                                                            defaultValue={data[0]?.countryOfManufacturing}
                                                                            readOnly
                                                                        // onChange={(e) => setCountryOfManufacturingdata(e.target.value)}

                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label className="form-label">
                                                                            <strong>Vehicle color</strong>
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            name="vehicleColour"
                                                                            defaultValue={data[0]?.vehicleColour}
                                                                            readOnly
                                                                        // onChange={(e) => setVehicleColourdata(e.target.value)}

                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label className="form-label">
                                                                            <strong>Emirates ID number</strong>
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            name="emiratesIdNumber"
                                                                            defaultValue={data[0]?.emiratesIdNumber}
                                                                            readOnly
                                                                        // onChange={(e) => setEmiratesIdNumberdata(e.target.value)}

                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label className="form-label">
                                                                            <strong>Gender</strong>
                                                                        </label>
                                                                        <input
                                                                            name="gender" className="form-control"
                                                                            type='text'
                                                                            readOnly
                                                                            defaultValue={data[0]?.gender}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label className="form-label">
                                                                            <strong>Trade license number</strong>
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            name="tradeLicenseNumber"
                                                                            readOnly
                                                                            defaultValue={data[0]?.TRNNumber}
                                                                        // onChange={(e) => setTradeLicenseNumberdata(e.target.value)}

                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label className="form-label">
                                                                            <strong>TRN No</strong>
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            name="TRNNumber"
                                                                            readOnly
                                                                            defaultValue={data[0]?.TRNNumber}
                                                                        // onChange={(e) => setTRNNumberdata(e.target.value)}

                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label className="form-label">
                                                                            <strong>Profession (for individual)</strong>
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            name="motorProfession"
                                                                            readOnly
                                                                            defaultValue={data[0]?.motorProfession}
                                                                        // onChange={(e) => setTRNNumberdata(e.target.value)}

                                                                        />
                                                                    </div>
                                                                </div>






                                                                {/* {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label"><strong>Deal Closed Time</strong></label>
                                                                        <input type="text"
                                                                            className="form-control"
                                                                            name="model_motor_detail_name"
                                                                            autoComplete="off"
                                                                            required
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                                ))} */}


                                                                {/* <div className="col-md-4">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label"><strong>Emirate Standardisation Certificate</strong></label>
                                                                        <input type="text"
                                                                            className="form-control"
                                                                            name="model_motor_detail_name"
                                                                            autoComplete="off"
                                                                            required
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div> */}






                                                                {/* 
                                                                <div className="col-md-4">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label"><strong>Mortgage</strong></label>
                                                                        <input type="text"
                                                                            className="form-control"
                                                                            name="model_motor_detail_name"
                                                                            autoComplete="off"
                                                                            required
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div> */}

                                                                {/* <div className="col-md-4">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label"><strong>Policy Start Date</strong></label>
                                                                        <input type="text"
                                                                            className="form-control"
                                                                            name="model_motor_detail_name"
                                                                            autoComplete="off"
                                                                            required
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div> */}

                                                                {/* <div className="col-md-4">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label"><strong>Area of Registration</strong></label>
                                                                        <input type="text"
                                                                            className="form-control"
                                                                            name="model_motor_detail_name"
                                                                            autoComplete="off"
                                                                            required
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div> */}

                                                                {/* <div className="col-md-4">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label"><strong>Policy Expiry Date</strong></label>
                                                                        <input type="text"
                                                                            className="form-control"
                                                                            name="model_motor_detail_name"
                                                                            autoComplete="off"
                                                                            required
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div> */}


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
                                                                                            href={`https://insuranceapi-3o5t.onrender.com/documents/${image?.file ? image?.file : image?.file}`}
                                                                                            download target='_blank' rel="noreferrer">
                                                                                            <img src={`https://insuranceapi-3o5t.onrender.com/documents/${image?.file ? image?.file : image?.file}`} alt="" className='img_abcd1234' />
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

export default MotorLeaddetails