import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';

const OtherIsurancesToolTips = () => {
  const [defaultFormData, setdefaultFormData] = useState({})

  useEffect(() => {
    getOtherInsurancesToooltips()
  }, [])
  const getOtherInsurancesToooltips = () => {
    const requestOptions =
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getOtherInsurancesToooltip`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setdefaultFormData(data.data)

      });
  }

  const DetailsChange = (e) => {
    const { name, value } = e.target
    setdefaultFormData({ ...defaultFormData, [name]: value })
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
    fetch(`https://insuranceapi-3o5t.onrender.com/api/updateOtherInsurancesTooltip?id=${defaultFormData._id}`, requestOptions)
      // fetch(`https://insuranceapi-3o5t.onrender.com/api/addOtherInsurancesTooltip`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status == '200') {
          // if (data.status == '201') {
          getOtherInsurancesToooltips()
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
                    <label><strong>Other Insurance Option</strong></label>
                    <textarea onChange={(e) => DetailsChange(e)} type='text'
                      name='otherInsuranceOption' className='form-control'
                      defaultValue={defaultFormData?.otherInsuranceOption} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Name</strong></label>
                    <textarea onChange={(e) => DetailsChange(e)} type='text'
                      name='name' className='form-control'
                      defaultValue={defaultFormData?.name} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Email</strong></label>
                    <textarea onChange={(e) => DetailsChange(e)} type='text'
                      name='email' className='form-control' defaultValue={defaultFormData?.email} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Phone Number</strong></label>
                    <textarea type='text' onChange={(e) => DetailsChange(e)} name='phone' className='form-control'
                      defaultValue={defaultFormData?.phone} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Brief Information</strong></label>
                    <textarea type='text' onChange={(e) => DetailsChange(e)} name='briefInformation' className='form-control'
                      defaultValue={defaultFormData?.briefInformation} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Day</strong></label>
                    <textarea type='text' onChange={(e) => DetailsChange(e)} name='day' className='form-control'
                      defaultValue={defaultFormData?.day} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Time</strong></label>
                    <textarea type='text' onChange={(e) => DetailsChange(e)} name='time' className='form-control'
                      defaultValue={defaultFormData?.time} />
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

export default OtherIsurancesToolTips
