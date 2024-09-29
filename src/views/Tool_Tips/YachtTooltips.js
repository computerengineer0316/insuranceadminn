import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';

const YachtTooltips = () => {
  const [defaultFormData, setdefaultFormData] = useState({})

  useEffect(() => {
    getYachtToooltips()
  }, [])
  const getYachtToooltips = () => {
    const requestOptions =
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getYachtToooltip`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setdefaultFormData(data.data)
      });
  }
  const YachtBasicsDetailsForm = (e) => {
    const { name, value } = e.target;
    setdefaultFormData({ ...defaultFormData, [name]: value })
  }
  const BoatDetailsDetailsForm = (e) => {
    const { name, value } = e.target
    setdefaultFormData({ ...defaultFormData, 'boatDetails': { ...defaultFormData.boatDetails, [name]: value } })
  }
  const PersonalDetailsChange = (e) => {
    const { name, value } = e.target
    setdefaultFormData({ ...defaultFormData, 'personalDetails': { ...defaultFormData.personalDetails, [name]: value } })
  }
  const EngineDetailsDetailsForm = (e) => {
    const { name, value } = e.target
    setdefaultFormData({ ...defaultFormData, 'engineDetails': { ...defaultFormData.engineDetails, [name]: value } })
  }
  const SumInsuredFormChange = (e) => {
    const { name, value } = e.target
    setdefaultFormData({
      ...defaultFormData,
      'sumInsured': {
        ...defaultFormData.sumInsured,
        [name]: value
      }
    })
  }

  const submitForm = () => {
    const requestOptions =
    {
      method: 'PUT',
      // method:"POST",
      body: JSON.stringify(defaultFormData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/updateYachtTooltip?id=${defaultFormData._id}`, requestOptions)
      // fetch(`https://insuranceapi-3o5t.onrender.com/api/addYachtTooltip`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status == '200') {
          // if(data.status == '201'){
          getYachtToooltips()
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
                    <label><strong>Policy Start Date</strong></label>
                    <textarea onChange={(e) => YachtBasicsDetailsForm(e)} type='text'
                      name='policyStartDate' className='form-control'
                      defaultValue={defaultFormData?.policyStartDate} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Yacht Make</strong></label>
                    <textarea onChange={(e) => YachtBasicsDetailsForm(e)}
                      type='text' name='yachtMaker' className='form-control'
                      defaultValue={defaultFormData?.yachtMaker} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Discount Coupon</strong></label>
                    <textarea onChange={(e) => YachtBasicsDetailsForm(e)}
                      type='text' name='discountCoupon' className='form-control'
                      defaultValue={defaultFormData?.discountCoupon} />
                  </div>
                </div>
                {/*Personal Details*/}
              </div>
              <label><strong><h4>Perosnal Details</h4></strong></label>
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
                      onChange={(e) => PersonalDetailsChange(e)} name='phone' className='form-control'
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
              <label><strong><h4>Engine Details</h4></strong></label>
              <div className='row'>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Engine Serial No</strong></label>
                    <textarea onChange={(e) => EngineDetailsDetailsForm(e)}
                      type='text' name='engineSerialNo' className='form-control'
                      defaultValue={defaultFormData?.engineDetails?.engineSerialNo} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Horse Powerr</strong></label>
                    <textarea
                      onChange={(e) => EngineDetailsDetailsForm(e)} type='text'
                      name='horsePower' className='form-control'
                      defaultValue={defaultFormData?.engineDetails?.horsePower} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Speed In Knots</strong></label>
                    <textarea
                      onChange={(e) => EngineDetailsDetailsForm(e)} type='text'
                      name='speedInKnots' className='form-control'
                      defaultValue={defaultFormData?.engineDetails?.speedInKnots} />
                  </div>
                </div>

              </div>
              <label><strong><h4>Boat Details</h4></strong></label>
              <div className='row'>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Yacht Name</strong></label>
                    <textarea onChange={(e) => BoatDetailsDetailsForm(e)}
                      type='text' name='yachtName' className='form-control'
                      defaultValue={defaultFormData?.boatDetails?.yachtName} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Registration Number</strong></label>
                    <textarea
                      onChange={(e) => BoatDetailsDetailsForm(e)} type='text'
                      name='regNo' className='form-control'
                      defaultValue={defaultFormData?.boatDetails?.regNo} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>hull Serial Number</strong></label>
                    <textarea
                      onChange={(e) => BoatDetailsDetailsForm(e)} type='text'
                      name='hullSerialNumber' className='form-control'
                      defaultValue={defaultFormData?.boatDetails?.hullSerialNumber} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Length Of Boat</strong></label>
                    <textarea
                      onChange={(e) => BoatDetailsDetailsForm(e)} type='text'
                      name='lengthOfBoat' className='form-control'
                      defaultValue={defaultFormData?.boatDetails?.lengthOfBoat} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Number Of Passengers</strong></label>
                    <textarea
                      onChange={(e) => BoatDetailsDetailsForm(e)} type='text'
                      name='numberOfPassengers' className='form-control'
                      defaultValue={defaultFormData?.boatDetails?.numberOfPassengers} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Place Of Mooring</strong></label>
                    <textarea
                      onChange={(e) => BoatDetailsDetailsForm(e)} type='text'
                      name='placeOfMooring' className='form-control'
                      defaultValue={defaultFormData?.boatDetails?.placeOfMooring} />
                  </div>
                </div>
              </div>
              <label><strong><h4>Sum Insured</h4></strong></label>
              <div className='row'>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Hull Equipment Value</strong></label>
                    <textarea type='text'
                      onChange={(e) => SumInsuredFormChange(e)} name='hullEquipmentValue'
                      className='form-control' defaultValue={defaultFormData?.sumInsured?.hullEquipmentValue} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Dinghy Tender Value</strong></label>
                    <textarea type='text' onChange={(e) => SumInsuredFormChange(e)}
                      name='dinghyTenderValue' className='form-control'
                      defaultValue={defaultFormData?.sumInsured?.dinghyTenderValue} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Outboard Value</strong></label>
                    <textarea type='text' onChange={(e) => SumInsuredFormChange(e)}
                      name='outboardValue' className='form-control'
                      defaultValue={defaultFormData?.sumInsured?.outboardValue} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Personal Belonging Cash</strong></label>
                    <textarea type='text' onChange={(e) => SumInsuredFormChange(e)}
                      name='personalBelongingCash' className='form-control'
                      defaultValue={defaultFormData?.sumInsured?.personalBelongingCash} />
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className="form-group mb-3">
                    <label><strong>Trailer Value</strong></label>
                    <textarea type='text' onChange={(e) => SumInsuredFormChange(e)}
                      name='trailerValue' className='form-control'
                      defaultValue={defaultFormData?.sumInsured?.trailerValue} />
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

export default YachtTooltips
