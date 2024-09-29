import { CButton } from '@coreui/react';
import React, { useState, useEffect } from 'react'
import { Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const UpdateUsertype = () => {
  let navigate = useNavigate();

  const customURL = window.location.href;
  const params = new URLSearchParams(customURL.split("?")[1]);
  const ParamValue = params.get("id");

  useEffect(() => {
    getdetails();
  }, []);

  const [usertype, setUsertype] = useState('');
  const [usertype_status, setUsertypestatus] = useState('');

  const getdetails = async () => {
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_user_type_detailsbyid', {
      method: 'post',
      body: JSON.stringify({ ParamValue }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    setUsertype(result.usertype)
    setUsertypestatus(result.usertype_status)
  }

  const updateusertype = async (e) => {
    e.preventDefault();
    if (usertype == '' || usertype == null) {
      swal("Please Enter Travel Type", "", "warning");
      return false;
    } else if (usertype_status == '' || usertype_status == null) {
      swal("Please Select Status", "", "warning");
      return false;
    }
    else {

      let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_user_type_details', {
        method: 'post',
        body: JSON.stringify({ ParamValue: ParamValue, usertype: usertype, usertype_status: usertype_status }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      result = await result.json();
      swal("Updated Succesfully", "", "success");
      console.log(result)
      navigate('/ViewUsertype');
    }

  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Update User Type</h4>
              </div>
              <div className="card-body">
                <form >
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label"><strong>Edit user type</strong></label>
                      <input type='text' className="form-control"
                        name='name'
                        placeholder='Enter user type'
                        defaultValue={usertype}
                        onChange={(e) => setUsertype(e.target.value)}
                        autoComplete="off"
                        required
                      />
                    </div>
                    <div className="col-md-6">

                      <label className="form-label"><strong>Status</strong></label>
                      <select className="form-control"
                        onChange={(e) => setUsertypestatus(e.target.value)}
                        name="status"
                        required
                      >
                        <option hidden defaultValue={usertype_status}>{usertype_status == 1 ? 'Active' : 'InActive'} </option>
                        <option value="1">Active</option>
                        <option value="0">InActive</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <button type="submit" className="btn btn-primary mt-2" style={{ float: "right" }} onClick={updateusertype}>Submit</button>
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

export default UpdateUsertype