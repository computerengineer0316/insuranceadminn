import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ClaimrequestMemberdetails = () => {
    const navigate = useNavigate();
    const [memberDetails, setMemberDetails] = useState({});
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            const url = window.location.href;
            const url1 = url.split("/")[3];
            const url2 = url1.split("?")[1];
            const id = url2.split("=")[1];
            GetMemberDetails(id);
        }
    }, [])
    const GetMemberDetails = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`http://localhost:8000ntechhttp://localhost:8000/lmpapi.handsintechnology.inquest?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log('data>>>>>', data);
                setMemberDetails(data.data?.map((item) => {
                    return item;
                }));
            });
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h4>Claim Request Member Details</h4>
                                </div>
                                <div className='col-md-6'>
                                    <button className='btn btn-primary' style={{ float: 'right' }} onClick={() => navigate(-1)}>Back</button>
                                </div>
                            </div>
                        </div>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>First Name</label>
                                        <input readOnly defaultValue={memberDetails?.firstName} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Middle Name</label>
                                        <input readOnly defaultValue={memberDetails?.middleName} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Last Name</label>
                                        <input readOnly defaultValue={memberDetails?.lastnName} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Employee Number</label>
                                        <input readOnly defaultValue={memberDetails?.employeeNumber} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Date Of Birth</label>
                                        <input readOnly defaultValue={memberDetails?.dateOfBirth?.slice(0, 10)} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Gender</label>
                                        <input readOnly defaultValue={memberDetails?.gender} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Marital Status</label>
                                        <input readOnly defaultValue={memberDetails?.maritalStatus} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Relation</label>
                                        <input readOnly defaultValue={memberDetails?.relation} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Category</label>
                                        <input readOnly defaultValue={memberDetails?.category} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Region</label>
                                        <input readOnly defaultValue={memberDetails?.regino} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>LSB</label>
                                        <input readOnly defaultValue={memberDetails?.LSB} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Nationality</label>
                                        <input readOnly defaultValue={memberDetails?.nationality} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Passport Number</label>
                                        <input readOnly defaultValue={memberDetails?.passportNumber} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Eid Number</label>
                                        <input readOnly defaultValue={memberDetails?.EidNumber} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Uid Number</label>
                                        <input readOnly defaultValue={memberDetails?.UidNumber} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Visa Issued Location</label>
                                        <input readOnly defaultValue={memberDetails?.visaIssuedLocation} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Actual Salary Band</label>
                                        <input readOnly defaultValue={memberDetails?.actualSalryBand} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Person Commission</label>
                                        <input readOnly defaultValue={memberDetails?.personCommission} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>

                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Residential Location</label>
                                        <input readOnly defaultValue={memberDetails?.residentialLocation} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Work Location</label>
                                        <input readOnly defaultValue={memberDetails?.workLocation} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Mobile Number</label>
                                        <input readOnly defaultValue={memberDetails?.phoneno} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Email</label>
                                        <input readOnly defaultValue={memberDetails?.email} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Photo File Name</label>
                                        <input readOnly defaultValue={memberDetails?.photoFileName} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Sponsor Type</label>
                                        <input readOnly defaultValue={memberDetails?.sponsorType} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Sponsor Id</label>
                                        <input readOnly defaultValue={memberDetails?.sponsorId} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Sponsor Contact Number</label>
                                        <input readOnly defaultValue={memberDetails?.sponsorContactNumber} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Sponsor Contact Email</label>
                                        <input readOnly defaultValue={memberDetails?.sponsorContactEmail} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Occupation</label>
                                        <input readOnly defaultValue={memberDetails?.occupation} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Additional Effective Date</label>
                                        <input readOnly defaultValue={memberDetails?.AdditionEffectiveDate?.slice(0, 10)} type='text' className='form-control' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Visa File FNumber</label>
                                        <input readOnly defaultValue={memberDetails?.visaFileNumber} type='text' className='form-control' />
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label htmlFor=''>Birth Certificate Number</label>
                                        <input readOnly defaultValue={memberDetails?.birthCertificateNumber} type='text' className='form-control' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClaimrequestMemberdetails
