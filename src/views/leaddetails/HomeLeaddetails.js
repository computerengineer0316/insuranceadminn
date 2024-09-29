import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'

const HomeLeaddetails = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search)
    const ParamValue = params.get('id')


    useEffect(() => {
        detailsbyid();
    }, []);

    const [data, setData] = useState([]);
    const [model_year, setmodel_year] = useState('');
    const [viewhomeConditions, setviewHomeConditions] = useState(false);



    const detailsbyid = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getHomeNewLeadDetails?leadId=${ParamValue}`, requestOptions)
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
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Name</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.name}
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
                                                                                name="email"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.email}
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
                                                                                name="date_of_birth"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.date_of_birth ? new Date(item?.date_of_birth).toLocaleDateString('en-GB') : ''}
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
                                                                                name="mobile_number"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.phoneno}
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
                                                                                value={item?.nationality}
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
                                                                                value={item?.policy_type[0]?.line_of_business_name}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Property Type</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="property_type"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.homePropertyDetails[0]?.home_property_type}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Ownership Status</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="ownership_status"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.home_ownershipDetails[0]?.home_owner_type}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Plan Type</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="plan_type"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.PlanTypeDetails[0]?.home_plan_type}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Building Value (AED)</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="building_value"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.building_value}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Content Value (AED)</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="content_value"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.content_value}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Personal belonging Value (AED)</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="personal_belonging_value"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.personal_belongings_value}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Do you have any Claims in last 5 years ?</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="any_claims"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.claimStatus == true ? 'Yes' : 'No'}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Domestic Helper</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="domestic_helper"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.domestic_value}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Flat / Villa No.</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="flat_villa_no"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.homeAddress?.flatvillano}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Street# / Name</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="street_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.homeAddress?.flatvillano}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Area</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="area"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.homeAddress?.area}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Emirate</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="emirate"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.homeAddress?.emirate}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>P.O. Box</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="po_box"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.homeAddress?.pobox}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Makani</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="Makani"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.homeAddress?.makani}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Home Conditions</strong></label>
                                                                            <div className='btn btn-warning mx-2' onClick={() => setviewHomeConditions(true)}>View</div>
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
                                                                                value={item?.lead_location?.map((item1, index) => (
                                                                                    item1.location_name
                                                                                )).join(', ')}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

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
                                                                                value={item?.plan_company_id.map(item1 => (
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
                                                                                value={item?.homePlanData[0]?.plan_name}

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
                                                                                value={item?.policy_issued_date?.slice(0, 10)}

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
                                                                                value={item?.policy_expiry_date}

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
                                                                                name="premium"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.final_price}

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
                                                                                value={item?.paymentStatus}

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
                                                                                            <img src={`https://insuranceapi-3o5t.onrender.com/documents/${image?.file}`} alt={image?.name} className='img_abcd1234' />
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
                                <Modal size="lg" show={viewhomeConditions} onHide={() => setviewHomeConditions(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Home Conditions</Modal.Title>
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
                                                                    {data[0]?.home_condition?.map((item1, index1) => (
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
                                        <Button variant="secondary" onClick={() => setviewHomeConditions(false)}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default HomeLeaddetails;