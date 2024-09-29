import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Multiselect from "multiselect-react-dropdown";
import swal from 'sweetalert';
import { Modal, Button } from 'react-bootstrap'

const MedicalLeaddetails = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search)
    const ParamValue = params.get('id')


    useEffect(() => {
        detailsbyid();
    }, []);

    const [data, setData] = useState([]);
    const [model_year, setmodel_year] = useState('');
    const [health_questionnaire, setHealthQuestionaire] = useState(false);
    const [underWritingQuestions, setUnderwritingQuestions] = useState(false)
    const [additionalConditions, setAdditionalConditions] = useState(false)


    const detailsbyid = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getMedicalNewLeadDetails?leadId=${ParamValue}`, requestOptions)
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
                                                                            <label className="form-label"><strong>Do you have an active medical policy in UAE ?</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.medical_policy_active == true ? "Yes" : "No"}

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
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Emirate Issuing Visa</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item?.emirate_issuing_visa ? (item?.emirate_issuing_visa[0]?.area_of_registration_name) : ('')}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Visa Type</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.visa_type ? item.visa_type[0]?.medical_plan_condition : ""}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Salary</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.salaryData[0]?.medical_salary_range}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Height</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.hight}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Weight</strong></label>
                                                                            <input type="text"
                                                                                className="form-control"
                                                                                name="model_motor_detail_name"
                                                                                autoComplete="off"
                                                                                required
                                                                                readOnly
                                                                                value={item.weight}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <label style={{ fontSize: '18px' }}><strong>Health Questionnaire:</strong></label>
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>General Questions</strong></label>
                                                                            <div className='btn btn-warning mx-2' onClick={() => setHealthQuestionaire(true)}>View</div>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Underwriting Condition</strong></label>
                                                                            <div className='btn btn-warning mx-2' onClick={() => setUnderwritingQuestions(true)}>View</div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {data.map((item, index) => (
                                                                    <div className="col-md-4" key={index}>
                                                                        <div className="form-group mb-3">
                                                                            <label className="form-label"><strong>Additional Conditions</strong></label>
                                                                            <div className='btn btn-warning mx-2' onClick={() => setAdditionalConditions(true)}>View</div>
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
                                                                                value={item.medicalPlanData[0]?.plan_name}

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
                                                                                    <div className='col-lg-4' key={index}>
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

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <Modal size="lg" show={health_questionnaire} onHide={() => setHealthQuestionaire(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Medical General Questions</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="card" style={{ overflow: "scroll" }}>
                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <th>No.</th>
                                                                    <th>Condition</th>
                                                                    <th>Value</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {data[0]?.medical_general_condition?.map((item1, index1) => (
                                                                    <tr key={index1}>
                                                                        <td>{index1 + 1}</td>
                                                                        <td style={{ width: "300px" }}>{item1.name}</td>
                                                                        <td>{item1.value == true ? "YES" : "NO"}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setHealthQuestionaire(false)}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal size="lg" show={underWritingQuestions} onHide={() => setUnderwritingQuestions(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Underwriting Conditions</Modal.Title>
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
                                                                    {data[0]?.medical_under_condition?.map((item1, index1) => (
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
                                        <Button variant="secondary" onClick={() => setUnderwritingQuestions(false)}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal size="lg" show={additionalConditions} onHide={() => setAdditionalConditions(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Additional Conditions</Modal.Title>
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
                                                                    {data[0]?.medical_additional_condition?.map((item1, index1) => (
                                                                        <tr key={index1}>
                                                                            <td>{index1 + 1}</td>
                                                                            <td>{item1.benefit}</td>
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
                                        <Button variant="secondary" onClick={() => setAdditionalConditions(false)}>
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

export default MedicalLeaddetails;