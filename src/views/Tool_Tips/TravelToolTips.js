import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';

const TravelToolTips = () => {
  const [defaultFormData, setdefaultFormData] = useState({})

  useEffect(() => {
    getTravelToooltips()
  }, [])
  const getTravelToooltips = () => {
    const requestOptions =
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getTravelToooltip`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setdefaultFormData(data.data)

      });
  }
  const policyDetailsChange = (e) => {
    const { name, value } = e.target;
    setdefaultFormData({ ...defaultFormData, [name]: value })
  }
  const personalDetailsChange = (e) => {
    const { name, value } = e.target

    setdefaultFormData({
      ...defaultFormData,
      'personalDetails': {
        ...defaultFormData.personalDetails,
        [name]: value
      }
    })

  }
  const familyDetailsChange = (e) => {
    const { name, value } = e.target

    setdefaultFormData({
      ...defaultFormData,
      'familyDetails': {
        ...defaultFormData.familyDetails,
        [name]: value
      }
    })

  }
  const beneficiaryDetailsChange = (e) => {
    const { name, value } = e.target

    setdefaultFormData({
      ...defaultFormData,
      'beneficiaryDetails': {
        ...defaultFormData.beneficiaryDetails,
        [name]: value
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
    fetch(`https://insuranceapi-3o5t.onrender.com/api/updateTravelTooltip?id=${defaultFormData._id}`, requestOptions)
      // fetch(`https://insuranceapi-3o5t.onrender.com/api/addTravelTooltip`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status == '200') {
          // if(data.status == '201'){
          getTravelToooltips()
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
              <label><strong><h4>Perosnal Details</h4></strong></label>

              <div className='row'>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Name</strong></label>
                    <textarea onChange={(e) => personalDetailsChange(e)} type='text'
                      name='name' className='form-control'
                      defaultValue={defaultFormData?.personalDetails?.name} placeholder='Enter Name' />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Email</strong></label>
                    <textarea onChange={(e) => personalDetailsChange(e)}
                      type='text' name='email' className='form-control'
                      defaultValue={defaultFormData?.personalDetails?.email} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Phone Number</strong></label>
                    <textarea type='text' onChange={(e) => personalDetailsChange(e)}
                      name='phone' className='form-control' defaultValue={defaultFormData?.personalDetails?.phone} />
                  </div>
                </div>

              </div>
              <div className='row'>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Birth Date</strong></label>
                    <textarea type='text' onChange={(e) => personalDetailsChange(e)}
                      name='date' className='form-control'
                      defaultValue={defaultFormData?.personalDetails?.date} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Passport Number</strong></label>
                    <textarea type='text' onChange={(e) => personalDetailsChange(e)}
                      name='passport' className='form-control'
                      defaultValue={defaultFormData?.personalDetails?.passport} />
                  </div>
                </div>
              </div>
              <label><strong><h4>Family Details</h4></strong></label>
              <div className='row'>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Name</strong></label>
                    <textarea onChange={(e) => familyDetailsChange(e)} type='text'
                      name='name' className='form-control'
                      defaultValue={defaultFormData?.familyDetails?.name} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Passport</strong></label>
                    <textarea onChange={(e) => familyDetailsChange(e)} type='text' name='passport'
                      className='form-control' defaultValue={defaultFormData?.familyDetails?.passport} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Date Of Birth</strong></label>
                    <textarea type='text' onChange={(e) => familyDetailsChange(e)} name='DOB'
                      className='form-control'
                      defaultValue={defaultFormData?.familyDetails?.DOB} />
                  </div>
                </div>

              </div>
              <label><strong><h4>beneficiary Details</h4></strong></label>

              <div className='row'>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Name</strong></label>
                    <textarea onChange={(e) => beneficiaryDetailsChange(e)} type='text'
                      name='name' className='form-control'
                      defaultValue={defaultFormData?.beneficiaryDetails?.name} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Email</strong></label>
                    <textarea onChange={(e) => beneficiaryDetailsChange(e)} type='text'
                      name='email' className='form-control'
                      defaultValue={defaultFormData?.beneficiaryDetails?.email} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Phone Number</strong></label>
                    <textarea type='text' onChange={(e) => beneficiaryDetailsChange(e)}
                      name='phone' className='form-control'
                      defaultValue={defaultFormData?.beneficiaryDetails?.phone} />
                  </div>
                </div>

              </div>
              <div className='row'>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Passport Number</strong></label>
                    <textarea type='text' onChange={(e) => beneficiaryDetailsChange(e)}
                      name='passport' className='form-control'
                      defaultValue={defaultFormData?.beneficiaryDetails?.passport} />
                  </div>
                </div>
              </div>
              <label><strong><h4>policy Details</h4></strong></label>
              <div className='row'>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Travel Start Date</strong></label>
                    <textarea type='text' onChange={(e) => policyDetailsChange(e)}
                      name='travelStrartDate' className='form-control'
                      defaultValue={defaultFormData?.travelStrartDate} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>policy Start Date</strong></label>
                    <textarea type='text' onChange={(e) => policyDetailsChange(e)}
                      name='policyStartDate' className='form-control'
                      defaultValue={defaultFormData?.policyStartDate} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>discountCoupon</strong></label>
                    <textarea type='text' onChange={(e) => policyDetailsChange(e)}
                      name='discountCoupon' className='form-control'
                      defaultValue={defaultFormData?.discountCoupon} />
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

export default TravelToolTips
