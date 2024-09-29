import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';

const HomeToolTips = () => {
  const [defaultFormData, setdefaultFormData] = useState({})

  useEffect(() => {
    getHomeToooltips()
  }, [])
  const getHomeToooltips = () => {
    const requestOptions =
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getHomeToooltip`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setdefaultFormData(data.data)

      });
  }
  const BasicDetailsChange = (e) => {
    const { name, value } = e.target;
    setdefaultFormData({ ...defaultFormData, [name]: value })
  }
  const personalDetailsChange = (e) => {
    const { name, value } = e.target

    setdefaultFormData({ ...defaultFormData, 'personalDetails': { ...defaultFormData.personalDetails, [name]: value } })

  }
  const AddressDetailsChange = (e) => {
    const { name, value } = e.target

    setdefaultFormData({ ...defaultFormData, 'addressDetails': { ...defaultFormData.addressDetails, [name]: value } })

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
    fetch(`https://insuranceapi-3o5t.onrender.com/api/updateHomeTooltip?id=${defaultFormData._id}`, requestOptions)
      // fetch(`https://insuranceapi-3o5t.onrender.com/api/addHomeTooltip`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status == '200') {
          // if (data.status == '201') {
          getHomeToooltips()
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
                    <label><strong>Building Value</strong></label>
                    <textarea type='text' onChange={(e) => BasicDetailsChange(e)}
                      name='buildingValue' className='form-control'
                      defaultValue={defaultFormData?.buildingValue} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>policy Start Date</strong></label>
                    <textarea type='text' onChange={(e) => BasicDetailsChange(e)}
                      name='policyStartDate' className='form-control'
                      defaultValue={defaultFormData?.policyStartDate} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Discount Coupon</strong></label>
                    <textarea type='text' onChange={(e) => BasicDetailsChange(e)}
                      name='discountCoupon' className='form-control'
                      defaultValue={defaultFormData?.discountCoupon} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Content Value</strong></label>
                    <textarea type='text' onChange={(e) => BasicDetailsChange(e)}
                      name='contentValue' className='form-control'
                      defaultValue={defaultFormData?.contentValue} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Personal Belonging Value</strong></label>
                    <textarea type='text' onChange={(e) => BasicDetailsChange(e)}
                      name='personalbelongingValue' className='form-control'
                      defaultValue={defaultFormData?.personalbelongingValue} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Building Name</strong></label>
                    <textarea type='text' onChange={(e) => BasicDetailsChange(e)}
                      name='buildingName' className='form-control'
                      defaultValue={defaultFormData?.buildingName} />
                  </div>
                </div>
                <label><strong><h4>Perosnal Details</h4></strong></label>
                <div className='row'>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Name</strong></label>
                      <textarea onChange={(e) => personalDetailsChange(e)} type='text'
                        name='name' className='form-control'
                        defaultValue={defaultFormData?.personalDetails?.name} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Email</strong></label>
                      <textarea onChange={(e) => personalDetailsChange(e)} type='text'
                        name='email' className='form-control' defaultValue={defaultFormData?.personalDetails?.email} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Phone Number</strong></label>
                      <textarea type='text' onChange={(e) => personalDetailsChange(e)}
                        name='phone' className='form-control'
                        defaultValue={defaultFormData?.personalDetails?.phone} />
                    </div>
                  </div>

                </div>
                <label><strong><h4>Address Details</h4></strong></label>
                <div className='row'>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Flat/Villa Number</strong></label>
                      <textarea onChange={(e) => AddressDetailsChange(e)} type='text'
                        name='flatVillaNo' className='form-control'
                        defaultValue={defaultFormData?.addressDetails?.flatVillaNo} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Street Name</strong></label>
                      <textarea onChange={(e) => AddressDetailsChange(e)} type='text' name='streetName'
                        className='form-control' defaultValue={defaultFormData?.addressDetails?.streetName} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Area</strong></label>
                      <textarea type='text' onChange={(e) => AddressDetailsChange(e)} name='area'
                        className='form-control'
                        defaultValue={defaultFormData?.addressDetails?.area} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>POBox</strong></label>
                      <textarea type='text' onChange={(e) => AddressDetailsChange(e)} name='pOBox'
                        className='form-control'
                        defaultValue={defaultFormData?.addressDetails?.pOBox} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Makani</strong></label>
                      <textarea type='text' onChange={(e) => AddressDetailsChange(e)} name='makani'
                        className='form-control'
                        defaultValue={defaultFormData?.addressDetails?.makani} />
                    </div>
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

export default HomeToolTips
