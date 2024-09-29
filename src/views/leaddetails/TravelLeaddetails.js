import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Multiselect from "multiselect-react-dropdown";
import swal from 'sweetalert';
import { useToaster } from 'rsuite';
import { Container, Row, Modal, Button } from 'react-bootstrap'

const TravelLeaddetails = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search)
    const ParamValue = params.get('id')


    useEffect(() => {
        detailsbyid();
    }, []);

    const [data, setData] = useState([]);
    const [model_year, setmodel_year] = useState('');
    const [showFamilydetails, setshowFamilydetails] = useState(false);
    const [familyData, setfamilyData] = useState([]);
    const [beneficiaryData, setbeneficiaryData] = useState([]);
    const [showBeneficiarydetails, setshowBeneficiarydetails] = useState(false);
    const [showFamilyDocument, setshowFamilyDocument] = useState();



    const detailsbyid = async () => {
        const requestOptions = {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getTravelNewLeadDetails?leadId=${ParamValue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("dataaaa>>> ", data)
                setData(data.data)
                setmodel_year(data.data.model_year)
            }
            )
    }
    const showFamily = (family) => {
        setfamilyData(family);
        setshowFamilydetails(true);
    }
    const showBeneficiary = (beneficiary) => {
        setbeneficiaryData(beneficiary);
        setshowBeneficiarydetails(true);
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
                                                                            <label className="form-label"><strong>Passport Number</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.passport_no}

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
                                                                                value={item.policy_type[0]?.line_of_business_name}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Travel Insurance For</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="travel_insurance_for"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.travel_insurance_for_data[0]?.travel_insurance_for}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Travel Type</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="travel_type"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.travel_plan_type_data[0]?.travel_type}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Number Of Travel Days</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="number_of_travel_days"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.no_of_travel}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Start Date</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="start_date"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.travel_start_date?.slice(0, 10)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>End Date</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="end_date"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.travel_end_date?.slice(0, 10)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Type of trip</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="end_date"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.travel_trip_type_data?.map((item1, index) => (item1.travel_plan_type)).join(', ')}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Destination</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.nationality}
                                                                            // value={item.lead_location.map((item1, index) => (
                                                                            //     item1.location_name
                                                                            // )).join(', ')}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Family details</strong></label>
                                                                            {
                                                                                item.travel_family_details.length > 0 ?
                                                                                    <button type="button" onClick={() => showFamily(item.travel_family_details)} className="btn btn-primary mx-1">View Family Details</button> : ""
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Beneficiary details</strong></label>
                                                                            {
                                                                                item.travel_beneficiary_details?.length > 0 ?
                                                                                    <button type="button" onClick={() => showBeneficiary(item.travel_beneficiary_details)} className="btn btn-primary mx-1">View Details</button> : ""
                                                                            }
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
                                                                                value={item.insuranceompanyData[0]?.company_name}
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
                                                                                value={item.travelPlanData[0]?.plan_name}

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
                                                                                value={item.policy_expiry_date?.slice(0, 10)}

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
                                                                                name="premium"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.final_price}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {/* {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Last Year Policy Type</strong></label>
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
                                                                ))} */}


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




                                                                <div className="col-md-12">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label"><strong>Documents</strong></label>

                                                                    </div>
                                                                    <div className="ksndfksk">
                                                                        {data.map((item, index) => (
                                                                            <div className="row form-group md-4" key={index}>
                                                                                {item?.documents.map((image, index1) => (
                                                                                    <div className='col-lg-4' key={index1}>
                                                                                        {/* <p>{image?.file[0]?.filename + "//////"}</p> */}
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
                                                                <div className='col-md-12'>
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label"><strong>Family Documents</strong></label>
                                                                    </div>
                                                                    <div className="ksndfksk">
                                                                        {data.map((item, index) => (
                                                                            <div className="row form-group md-4" key={index}>
                                                                                {item?.travel_family_details?.map((item, index1) => (
                                                                                    <div className='col-lg-12' key={index1}>
                                                                                        <table className="table table-bordered">
                                                                                            <thead>
                                                                                                <tr>
                                                                                                    <th>No</th>
                                                                                                    <th>Name</th>
                                                                                                    <th>Relationship</th>
                                                                                                    <th>Passport Number</th>
                                                                                                    <th>Date</th>
                                                                                                    <th>Documents</th>

                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td>{index1 + 1}</td>
                                                                                                    <td>{item.name}</td>
                                                                                                    <td>{item.relation}</td>
                                                                                                    <td>{item.passport}</td>
                                                                                                    <td>{item.date}</td>
                                                                                                    <td><div onClick={() => setshowFamilyDocument(index1)} className='btn btn-warning'>View</div></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                        <div style={showFamilyDocument === index1 ? { display: "block" } : { display: "none" }}>
                                                                                            <div className='d-flex'>
                                                                                                {item?.document?.map((image, index1) => (
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
                                                                                            {
                                                                                                !item?.document?.length ? <p>No Document Found</p> : ""
                                                                                            }
                                                                                            <div onClick={() => setshowFamilyDocument(null)} className='btn btn-danger'>Close</div>
                                                                                        </div>
                                                                                        <hr />
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
                                <Modal size="lg" show={showFamilydetails} onHide={() => setshowFamilydetails(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Family Details</Modal.Title>
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
                                                                        <th>No</th>
                                                                        <th>Name</th>
                                                                        <th>Relationship</th>
                                                                        <th>Passport Number</th>
                                                                        <th>Passport Expiry Date</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {familyData.map((item1, index1) => (
                                                                        <tr key={index1}>
                                                                            <td>{index1 + 1}</td>
                                                                            <td>{item1.name}</td>
                                                                            <td>{item1.relation}</td>
                                                                            <td>{item1.passport}</td>
                                                                            <td>{item1.date}</td>
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
                                        <Button variant="secondary" onClick={() => setshowFamilydetails(false)}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal size="lg" show={showBeneficiarydetails} onHide={() => setshowBeneficiarydetails(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Beneficiary Details</Modal.Title>
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
                                                                        <th>No</th>
                                                                        <th>Name</th>
                                                                        <th>Email</th>
                                                                        <th>Phone No.</th>
                                                                        <th>Passport Number</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {beneficiaryData.map((item1, index1) => (
                                                                        <tr key={index1}>
                                                                            <td>{index1 + 1}</td>
                                                                            <td>{item1.Name}</td>
                                                                            <td>{item1.email}</td>
                                                                            <td>{item1.phoneNumber}</td>
                                                                            <td>{item1.passportNumber}</td>
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
                                        <Button variant="secondary" onClick={() => setshowBeneficiarydetails(false)}>
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

export default TravelLeaddetails;