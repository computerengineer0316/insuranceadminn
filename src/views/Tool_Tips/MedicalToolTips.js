import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';

const MedicalToolTips = () => {
  const [defaultFormData, setdefaultFormData] = useState({})

  useEffect(() => {
    getMedicalToooltips()
  }, [])
  const getMedicalToooltips = () => {
    const requestOptions =
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getIndividualToooltip`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setdefaultFormData(data.data)

      });
  }
  const BasicDetailsChange = (e) => {
    const { name, value } = e.target;
    setdefaultFormData({ ...defaultFormData, [name]: value })
  }
  const InsuredDetailsChange = (e) => {
    const { name, value } = e.target

    setdefaultFormData({ ...defaultFormData, 'insuredDetails': { ...defaultFormData.insuredDetails, [name]: value } })

  }
  const SponsorDetailsChange = (e) => {
    const { name, value } = e.target

    setdefaultFormData({ ...defaultFormData, 'sponsorDetials': { ...defaultFormData.sponsorDetials, [name]: value } })

  }



  const submitForm = () => {

    const requestOptions =
    {
      method: 'PUT',
      // method: 'POST',
      body: JSON.stringify(defaultFormData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/updateIndividualTooltip?id=${defaultFormData._id}`, requestOptions)
      // fetch(`https://insuranceapi-3o5t.onrender.com/api/addIndividualTooltip`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status == '200') {
          // if (data.status == '201') {
          getMedicalToooltips()
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
                    <label><strong>Height</strong></label>
                    <textarea type='text' onChange={(e) => BasicDetailsChange(e)}
                      name='height' className='form-control'
                      defaultValue={defaultFormData?.height} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Weight</strong></label>
                    <textarea type='text' onChange={(e) => BasicDetailsChange(e)}
                      name='weight' className='form-control'
                      defaultValue={defaultFormData?.weight} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Policy Start Date</strong></label>
                    <textarea type='text' onChange={(e) => BasicDetailsChange(e)}
                      name='PolicyStartDate' className='form-control'
                      defaultValue={defaultFormData?.PolicyStartDate} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Discount Coupon</strong></label>
                    <textarea type='text' onChange={(e) => BasicDetailsChange(e)}
                      name='DiscountCoupon' className='form-control'
                      defaultValue={defaultFormData?.DiscountCoupon} />
                  </div>
                </div>
                <label><strong><h4>Insured Details</h4></strong></label>
                <div className='row'>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Name</strong></label>
                      <textarea onChange={(e) => InsuredDetailsChange(e)} type='text'
                        name='name' className='form-control'
                        defaultValue={defaultFormData?.insuredDetails?.name} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Email</strong></label>
                      <textarea onChange={(e) => InsuredDetailsChange(e)} type='text'
                        name='email' className='form-control' defaultValue={defaultFormData?.insuredDetails?.email} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Phone Number</strong></label>
                      <textarea type='text' onChange={(e) => InsuredDetailsChange(e)} name='phone' className='form-control'
                        defaultValue={defaultFormData?.insuredDetails?.phone} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Date</strong></label>
                      <textarea type='text' onChange={(e) => InsuredDetailsChange(e)} name='date' className='form-control'
                        defaultValue={defaultFormData?.insuredDetails?.date} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Passport Number</strong></label>
                      <textarea type='text' onChange={(e) => InsuredDetailsChange(e)} name='passportNumber' className='form-control'
                        defaultValue={defaultFormData?.insuredDetails?.passportNumber} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Passport Issue Date</strong></label>
                      <textarea type='text' onChange={(e) => InsuredDetailsChange(e)} name='passportIssueDate' className='form-control'
                        defaultValue={defaultFormData?.insuredDetails?.passportIssueDate} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Passport Expiry Date</strong></label>
                      <textarea type='text' onChange={(e) => InsuredDetailsChange(e)} name='passportExpiryDate' className='form-control'
                        defaultValue={defaultFormData?.insuredDetails?.passportExpiryDate} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Visa File Number</strong></label>
                      <textarea type='text' onChange={(e) => InsuredDetailsChange(e)} name='visaFileNumber' className='form-control'
                        defaultValue={defaultFormData?.insuredDetails?.visaFileNumber} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Visa Issue Date</strong></label>
                      <textarea type='text' onChange={(e) => InsuredDetailsChange(e)} name='visaIssueDate' className='form-control'
                        defaultValue={defaultFormData?.insuredDetails?.visaIssueDate} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Visa Expiry Date</strong></label>
                      <textarea type='text' onChange={(e) => InsuredDetailsChange(e)} name='visaExpiryDate' className='form-control'
                        defaultValue={defaultFormData?.insuredDetails?.visaExpiryDate} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Emirates Id Number</strong></label>
                      <textarea type='text' onChange={(e) => InsuredDetailsChange(e)} name='emiratesIdNumber' className='form-control'
                        defaultValue={defaultFormData?.insuredDetails?.emiratesIdNumber} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Emirates Issue Date</strong></label>
                      <textarea type='text' onChange={(e) => InsuredDetailsChange(e)} name='emiratesIssueDate' className='form-control'
                        defaultValue={defaultFormData?.insuredDetails?.emiratesIssueDate} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="form-group mb-3">
                      <label><strong>Emirates Expiry Date</strong></label>
                      <textarea type='text' onChange={(e) => InsuredDetailsChange(e)} name='emiratesExpiryDate' className='form-control'
                        defaultValue={defaultFormData?.insuredDetails?.emiratesExpiryDate} />
                    </div>
                  </div>

                </div>
              </div>
              <label><strong><h4>Sponsor Details</h4></strong></label>
              <div className='row'>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Trade License Number</strong></label>
                    <textarea type='text' onChange={(e) => SponsorDetailsChange(e)} name='tradeLicenseNumber' className='form-control'
                      defaultValue={defaultFormData?.sponsorDetials?.tradeLicenseNumber} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Trade License Expiry Date</strong></label>
                    <textarea type='text' onChange={(e) => SponsorDetailsChange(e)} name='tradeLicenseExpiryDate' className='form-control'
                      defaultValue={defaultFormData?.sponsorDetials?.tradeLicenseExpiryDate} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Tax Registration Number</strong></label>
                    <textarea type='text' onChange={(e) => SponsorDetailsChange(e)} name='taxRegistrationNumber' className='form-control'
                      defaultValue={defaultFormData?.sponsorDetials?.taxRegistrationNumber} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Establishment Card Number</strong></label>
                    <textarea type='text' onChange={(e) => SponsorDetailsChange(e)} name='establishmentCardNumber' className='form-control'
                      defaultValue={defaultFormData?.sponsorDetials?.establishmentCardNumber} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Establishment Card Expiry Date</strong></label>
                    <textarea type='text' onChange={(e) => SponsorDetailsChange(e)} name='establishmentCardExpiryDate' className='form-control'
                      defaultValue={defaultFormData?.sponsorDetials?.establishmentCardExpiryDate} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Sponsor Visa</strong></label>
                    <textarea type='text' onChange={(e) => SponsorDetailsChange(e)} name='sponsorVisa' className='form-control'
                      defaultValue={defaultFormData?.sponsorDetials?.sponsorVisa} />
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

export default MedicalToolTips
