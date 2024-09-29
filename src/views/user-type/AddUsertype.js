import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';

const AddUsertype = () => {
  const navigate = useNavigate();

  const [usertype, setUsertype] = useState('');
  const [usertype_status, setUsertypestatus] = useState('');

  const addusertype = async (e) => {
    e.preventDefault();
    if (usertype == '' || usertype == null) {
      swal("Please Enter Travel Type", "", "warning");
      return false;
    } else if (usertype_status == '' || usertype_status == null) {
      swal("Please Select Status", "", "warning");
      return false;
    }
    else {

      let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/add_user_type', {
        method: 'post',
        body: JSON.stringify({ usertype: usertype, usertype_status: usertype_status }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      result = await result.json();
      swal("Added Succesfully", "", "success");
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
                <h4 className="card-title">Add User Type</h4>
              </div>
              <div className="card-body">
                <form action="/" method="POST" onSubmit={addusertype}>
                  <div className="row">
                    <div className="col-md-6">

                      <label className="form-label"><strong>Add User Type</strong></label>
                      <input type='text' className="form-control"
                        name='name'
                        placeholder='Enter User Type'
                        defaultValue=""
                        onChange={e => setUsertype(e.target.value)}
                        autoComplete="off"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label"><strong>Status</strong></label>.
                      <select className="form-control" name="status" onChange={(e) => setUsertypestatus(e.target.value)}>
                        <option value="" hidden>Select Status</option>
                        <option value="1">Active</option>
                        <option value="0">InActive</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <button type="submit" className="btn btn-primary mt-2" style={{ float: "right" }}>Submit</button>
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

export default AddUsertype