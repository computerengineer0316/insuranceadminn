import { CButton } from '@coreui/react';
import React, { useState, useEffect } from 'react'
import { Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

function Updatetravelinsurancefor() {

  let navigate = useNavigate();

  const customURL = window.location.href;
  const params = new URLSearchParams(customURL.split("?")[1]);
  const ParamValue = params.get("id");

  useEffect(() => {
    getdetails();
  }, []);

  const [travel_insurance_for, setTravelinsurancefor] = useState('')
  const [travel_insurance_for_status, setTravelinsuranceforstatus] = useState()
  const [iddetails, setIddetails] = useState([{}])

  const getdetails = async () => {
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_travel_insurance_for_detailsbyid', {
      method: 'post',
      body: JSON.stringify({ ParamValue }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    setTravelinsurancefor(result[0].travel_insurance_for)
    setTravelinsuranceforstatus(result[0].travel_insurance_for_status)
  }

  const updatetravelinsurancefor = async (e) => {
    e.preventDefault()
    if (travel_insurance_for === '') {
      swal({
        title: "warning!",
        text: "Please Enter Travel Insurance For",
        icon: "warning",
        button: "OK",
      });
      return false;
    } else if (travel_insurance_for_status === '') {
      swal({
        title: "Warning!",
        text: "Please Select Status",
        icon: "warning",
        button: "OK",
      });
      return false;
    }
    else {
      console.log(travel_insurance_for)
      console.log(travel_insurance_for_status)
      let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_travel_insurance_for_details', {
        method: 'post',
        body: JSON.stringify({ ParamValue: ParamValue, travel_insurance_for: travel_insurance_for, travel_insurance_for_status: travel_insurance_for_status }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      result = await result.json();
      swal("Updated Succesfully", "", "success");
      navigate('/Viewtravelinsurancefor')
    }
  }


  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Update Travel Insurance For</h4>
              </div>
              <div className="card-body">
                <form >
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label"><strong>Add Insurance For</strong></label>
                      <input type='text' className="form-control"
                        name='name'
                        placeholder='Name'
                        defaultValue={travel_insurance_for}
                        onChange={(e) => setTravelinsurancefor(e.target.value)}
                        autoComplete="off"
                        required
                      />
                    </div>
                    <div className="col-md-6">

                      <label className="form-label"><strong>Status</strong></label>
                      <select className="form-control"
                        onChange={(e) => setTravelinsuranceforstatus(e.target.value)}
                        name="status"
                        required
                      >
                        <option hidden defaultValue={travel_insurance_for_status}>{travel_insurance_for_status == 1 ? 'Active' : 'InActive'} </option>
                        <option value="1">Active</option>
                        <option value="0">InActive</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <button type="submit" className="btn btn-primary mt-2" style={{ float: "right" }} onClick={updatetravelinsurancefor}>Submit</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default Updatetravelinsurancefor