import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
const MotorToolTips = () => {

    const [defaultFormData, setdefaultFormData] = useState({})

    useEffect(() => {
        getMotorToooltips()
    }, [])
    const getMotorToooltips = () => {
        const requestOptions =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getMotorToooltip`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setdefaultFormData(data.data)
            });
    }
    const ChassisNumberDetailsForm = (e) => {
        const { name, value } = e.target;
        setdefaultFormData({ ...defaultFormData, [name]: value })
    }
    const PersonalDetailsChange = (e) => {
        const { name, value } = e.target
        setdefaultFormData({
            ...defaultFormData,
            'personalDetails': {
                ...defaultFormData.personalDetails,
                [name]: value
            }
        })

    }
    const InsuranceDetailsFormChange = (e) => {
        const { name, value } = e.target
        setdefaultFormData({
            ...defaultFormData,
            'insuredDetails': {
                ...defaultFormData.insuredDetails,
                [name]: value
            }
        })
    }
    const DrivingDetailsChangeForm = (e) => {
        const { name, value } = e.target
        setdefaultFormData({
            ...defaultFormData,
            'insuredDetails': {
                ...defaultFormData.insuredDetails,
                'drivingDetails': {
                    ...defaultFormData.insuredDetails?.drivingDetails,
                    [name]: value
                }
            }
        })
    }
    const submitForm = () => {
        const requestOptions =
        {
            method: 'PUT',
            // method:'POST',
            body: JSON.stringify(defaultFormData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateMotorTooltip?id=${defaultFormData._id}`, requestOptions)
            // fetch(`https://insuranceapi-3o5t.onrender.com/api/addMotorTooltip`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == '200') {
                    // if(data.status == '201'){
                    getMotorToooltips()
                    swal({
                        text: data.message,
                        type: 'success',
                        icon: 'success'
                    })
                } else {
                    swal({
                        text: data.message,
                        type: 'error',
                        icon: 'error'
                    })
                }

            });
    }
    return (
        <div className="container mb-5">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className='container'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Chassis No.</strong></label>
                                        <textarea onChange={(e) => ChassisNumberDetailsForm(e)}
                                            type='text' name='chassisNumber' className='form-control'
                                            defaultValue={defaultFormData?.chassisNumber} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Vehicle Value</strong></label>
                                        <textarea onChange={(e) => ChassisNumberDetailsForm(e)}
                                            type='text' name='valueOfVehicle' className='form-control'
                                            defaultValue={defaultFormData?.valueOfVehicle} />
                                    </div>
                                </div>


                            </div>
                            <label><strong><h4>Personal Details</h4></strong></label>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Name</strong></label>
                                        <textarea type='text' onChange={(e) => PersonalDetailsChange(e)}
                                            name='name' className='form-control'
                                            defaultValue={defaultFormData?.personalDetails?.name} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Email</strong></label>
                                        <textarea type='text' onChange={(e) => PersonalDetailsChange(e)}
                                            name='email' className='form-control'
                                            defaultValue={defaultFormData?.personalDetails?.email} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Phone No.</strong></label>
                                        <textarea type='text'
                                            onChange={(e) => PersonalDetailsChange(e)} name='phone'
                                            className='form-control'
                                            defaultValue={defaultFormData?.personalDetails?.phone} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Date</strong></label>
                                        <textarea type='text'
                                            onChange={(e) => PersonalDetailsChange(e)} name='date'
                                            className='form-control' defaultValue={defaultFormData?.personalDetails?.date} />
                                    </div>
                                </div>
                            </div>
                            <label><strong><h4>Policy Details</h4></strong></label>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Policy Start Date</strong></label>
                                        <textarea onChange={(e) => ChassisNumberDetailsForm(e)}
                                            type='text' name='policyStartDate' className='form-control'
                                            defaultValue={defaultFormData?.policyStartDate} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Discount Coupon</strong></label>
                                        <textarea
                                            onChange={(e) => ChassisNumberDetailsForm(e)} type='text'
                                            name='discountCoupon' className='form-control'
                                            defaultValue={defaultFormData?.discountCoupon} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Insured Name</strong></label>
                                        <textarea onChange={(e) => ChassisNumberDetailsForm(e)}
                                            type='text' name='insuredName' className='form-control'
                                            defaultValue={defaultFormData?.insuredName} />
                                    </div>
                                </div>
                            </div>
                            <label><strong><h4>Insured Details</h4></strong></label>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Name</strong></label>
                                        <textarea type='text'
                                            onChange={(e) => InsuranceDetailsFormChange(e)} name='name'
                                            className='form-control' defaultValue={defaultFormData?.insuredDetails?.name} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Nationality</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='nationality' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.nationality}
                                            placeholder='Enter Phone No.' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Drivers Date Of Birth</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='driverDateOfBirth' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.driverDateOfBirth}
                                            placeholder='Enter Name' />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Mobile Number</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='mobileNumber' className='form-control'
                                            defaultValue={defaultFormData.insuredDetails?.mobileNumber} placeholder='Enter Email' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Email</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='email' className='form-control' defaultValue={defaultFormData.insuredDetails?.email} placeholder='Enter Phone No.' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Model Year</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='modelYear' className='form-control' defaultValue={defaultFormData.insuredDetails?.modelYear} placeholder='Enter Name' />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Make</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='make' className='form-control' defaultValue={defaultFormData.insuredDetails?.make} placeholder='Enter Email' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Model</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='model' className='form-control' defaultValue={defaultFormData.insuredDetails?.model} placeholder='Enter Phone No.' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Date Of First Registration</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='dateOfFirstRegistration' className='form-control' defaultValue={defaultFormData.insuredDetails?.dateOfFirstRegistration} placeholder='Enter Name' />
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Body Type</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='bodyType' className='form-control' defaultValue={defaultFormData.insuredDetails?.bodyType} placeholder='Enter Email' />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Number Of Cylinders</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='numberOfCylinders' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.numberOfCylinders} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Sum Insured</strong></label>
                                        <textarea type='text'
                                            onChange={(e) => InsuranceDetailsFormChange(e)} name='sumInsured'
                                            className='form-control' defaultValue={defaultFormData?.insuredDetails?.sumInsured} />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Currently Uninsured Break In Insurance</strong></label>
                                        <textarea type='text'
                                            onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='currentlyUninsuredBreakInInsurance' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.currentlyUninsuredBreakInInsurance} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Third Party Last Year</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='thirdPartyLastYear' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.thirdPartyLastYear} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Modified NonGCC Spec</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)} name='modifiedNonGCCSpec'
                                            className='form-control' defaultValue={defaultFormData?.insuredDetails?.modifiedNonGCCSpec} />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Profession</strong></label>
                                        <textarea type='text'
                                            onChange={(e) => InsuranceDetailsFormChange(e)} name='profession'
                                            className='form-control' defaultValue={defaultFormData?.insuredDetails?.profession} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>TCF No</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='TCFNo' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.TCFNo} />
                                    </div>
                                </div>

                            </div>
                            <label><strong><h4>Driving Details</h4></strong></label>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>License Number</strong></label>
                                        <textarea type='text' onChange={(e) => DrivingDetailsChangeForm(e)}
                                            name='licenseNumber' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.drivingDetails?.licenseNumber}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>License Issue Date</strong></label>
                                        <textarea type='text' onChange={(e) => DrivingDetailsChangeForm(e)}
                                            name='licenseIssueDate' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.drivingDetails?.licenseIssueDate}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>License Expiry Date</strong></label>
                                        <textarea type='text' onChange={(e) => DrivingDetailsChangeForm(e)}
                                            name='licenseExpiryDate' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.drivingDetails?.licenseExpiryDate} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>License Issuing Emirate</strong></label>
                                        <textarea type='text' onChange={(e) => DrivingDetailsChangeForm(e)} name='licenseIssuingEmirate' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.drivingDetails.licenseIssuingEmirate} />
                                    </div>
                                </div>
                            </div>
                            <label><strong><h4>Insured Details</h4></strong></label>
                            <div className='row'>

                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Chassis Number</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='chassisNumber' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.chassisNumber} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Engine Number</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='engineNumber' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.engineNumber} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Registration Number</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='registrationNumber' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.registrationNumber} />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>

                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Plate Category</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='plateCategory' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.plateCategory} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Policy IssueDate</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='policyIssueDate' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.policyIssueDate} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Country Of Manufacturing</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='countryOfManufacturing' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.countryOfManufacturing} />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>

                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Vehicle Color</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='vehicleColor' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.vehicleColor} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Emirates ID Number</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='emiratesIDNumber' className='form-control'
                                            defaultValue={defaultFormData?.insuredDetails?.emiratesIDNumber} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form-group mb-3">
                                        <label><strong>Gender</strong></label>
                                        <textarea type='text' onChange={(e) => InsuranceDetailsFormChange(e)}
                                            name='gender' className='form-control' defaultValue={defaultFormData?.insuredDetails?.gender} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button
                                className="btn btn-outline-success" style={{ float: "right" }}
                                onClick={() => submitForm()}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default MotorToolTips
