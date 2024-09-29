import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import Multiselect from 'multiselect-react-dropdown'

const AddBusinessEntity = () => {
  const navigate = useNavigate();
  const [LineOfBusiness, setLineOfBusiness] = useState([]);
  const [lob, setlob] = useState([]);
  const [country, setCountry] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getlistLineOfBusiness();
      getcountryList();
    }
  }, [])

  const getlistLineOfBusiness = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const line_of_businessdt = data?.data
        const line_of_business_len = line_of_businessdt?.length
        const line_of_business_list = []
        for (let i = 0; i < line_of_business_len; i++) {
          const line_of_business_obj = {
            label: line_of_businessdt[i]?.line_of_business_name,
            value: line_of_businessdt[i]?._id,
          }
          line_of_business_list.push(line_of_business_obj)
        }
        setLineOfBusiness(line_of_business_list)
      })
  }

  const getcountryList = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getNationality`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const countrydt = data?.data
        const country_len = countrydt?.length
        const country_list = []
        for (let i = 0; i < country_len; i++) {
          const country_obj = { label: countrydt[i]?.nationality_name, value: countrydt[i]?._id }
          country_list.push(country_obj)
        }
        setCountry(country_list)
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const business_entity_name = data.get('name');
    const ref_number = data.get('ref_number');

    if (lob == undefined || lob == null || lob == '') {
      swal({
        title: "Error!",
        text: "Please Select LOB",
        type: "error",
        icon: "error"
      });
      return false;
    }

    const country = data.get('country');
    const technical_person_name = data.get('technical_person_name');
    const technical_person_email = data.get('technical_person_email');
    const technical_person_contact = data.get('technical_person_contact');
    const account_or_admin_name = data.get('account_or_admin_name');
    const account_or_admin_email = data.get('account_or_admin_email');
    const account_or_admin_contact = data.get('account_or_admin_contact');
    const supervisor_or_manager_name = data.get('supervisor_or_manager_name');
    const supervisor_or_manager_email = data.get('supervisor_or_manager_email');
    const supervisor_or_manager_contact = data.get('supervisor_or_manager_contact');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location_name: business_entity_name,
        ref_number: ref_number,
        lob: lob,
        country: country,
        technical_person_name: technical_person_name,
        technical_person_email: technical_person_email,
        technical_person_contact: technical_person_contact,
        account_or_admin_name: account_or_admin_name,
        account_or_admin_email: account_or_admin_email,
        account_or_admin_contact: account_or_admin_contact,
        supervisor_or_manager_name: supervisor_or_manager_name,
        supervisor_or_manager_email: supervisor_or_manager_email,
        supervisor_or_manager_contact: supervisor_or_manager_contact,
      }),
    }
    fetch('https://insuranceapi-3o5t.onrender.com/api/businessEntity', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          swal({
            title: "Success!",
            text: data.message,
            type: "success",
            icon: "success"
          }).then(function () {
            navigate('/ViewBusinessEntity')
          });
        }
        else {
          swal({
            title: "Error!",
            text: data.message,
            type: "error",
            icon: "error"
          }).then(function () {
            navigate('/ViewBusinessEntity')
          });
        }
      })
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <div className="row">
                <div className="col-md-6">
                  <h4 className="card-title">Add Location</h4>
                </div>
                <div className="col-md-6">
                  <a href="/ViewBusinessEntity" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                </div>
                <div className="card-body">
                  <form method="POST" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label>Location Name</label>
                          <input type="text" className="form-control" name="name" placeholder="Enter Location Name" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label>Reference Number</label>
                          <input type="text" className="form-control" name="ref_number" placeholder="Enter Reference Number" autoComplete="off" required />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label>Line Of Business</label>
                          <Multiselect
                            options={LineOfBusiness}
                            displayValue="label"
                            selectedValues={LineOfBusiness}
                            onSelect={setlob}
                            onRemove={setlob}
                            placeholder="Select LOB"
                            showCheckbox={true}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label>Country</label>
                          <select className="form-control" name="country" required>
                            <option value="">Select Country</option>
                            {country.map((item, index) => (
                              <option key={index} value={item.value}>{item.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label>Technical Person Name</label>
                          <input type="text" className="form-control" name="technical_person_name" placeholder="Enter Technical Person Name" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label>Technical Person Email</label>
                          <input type="email" className="form-control" name="technical_person_email" placeholder="Enter Technical Person Email" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label>Technical Person Contact No</label>
                          <input type="text" className="form-control" name="technical_person_contact" placeholder="Enter Technical Person Contact No" autoComplete="off" required />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label>Account / Admin Name</label>
                          <input type="text" className="form-control" name="account_or_admin_name" placeholder="Enter Account / Admin Name" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label>Account / Admin Email</label>
                          <input type="email" className="form-control" name="account_or_admin_email" placeholder="Enter Account / Admin Email" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label>Account / Admin Contact No</label>
                          <input type="text" className="form-control" name="account_or_admin_contact" placeholder="Enter Account / Admin Contact No" autoComplete="off" required />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label>Supervisor / Manager Name</label>
                          <input type="text" className="form-control" name="supervisor_or_manager_name" placeholder="Enter Supervisor / Manager Name" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label>Supervisor / Manager Email</label>
                          <input type="email" className="form-control" name="supervisor_or_manager_email" placeholder="Enter Supervisor / Manager name" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label>Supervisor / Manager Contact No</label>
                          <input type="text" className="form-control" name="supervisor_or_manager_contact" placeholder="Enter Supervisor / Manager name" autoComplete="off" required />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12" style={{ textAlign: 'right' }}>
                        <button type="submit" className="btn btn-primary">Save</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBusinessEntity
