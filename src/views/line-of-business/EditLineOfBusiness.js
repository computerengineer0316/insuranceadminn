import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Multiselect from 'multiselect-react-dropdown'
import Swal from 'sweetalert2'

const EditLineOfBusiness = () => {
  const [selectedOption, setSelectedOption] = useState([])
  const [line_of_business_name, setLineOfBusinessName] = useState('')
  const [line_of_business_status, setLineOfBusinessStatus] = useState('')
  const [line_of_business_id, setLineOfBusinessId] = useState('')
  const [location, setLocation] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (
      localStorage.getItem('token') == null ||
      localStorage.getItem('token') == '' ||
      localStorage.getItem('token') == undefined
    ) {
      navigate('/login')
    } else {
      const url = window.location.href
      const url1 = url.split('/')[3]
      const url2 = url1.split('?')[1]
      const id = url2.split('=')[1]
      setLineOfBusinessId(id)
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      fetch(
        `https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_by_id/${id}`,
        requestOptions,
      )
        .then((response) => response.json())
        .then((data) => {
          const line_of_business = data.data
          setLineOfBusinessName(line_of_business.line_of_business_name)
          const locationid = line_of_business.line_of_business_location
          const location_id = locationid.split(',')
          const location_id_len = location_id.length
          const location_name = []
          for (let i = 0; i < location_id_len; i++) {
            const requestOptions = {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
            fetch(
              `https://insuranceapi-3o5t.onrender.com/api/get_location_by_id/${location_id[i]}`,
              requestOptions,
            )
              .then((response) => response.json())
              .then((data) => {
                location_name.push(data.data.location_name)
                const location_name_len = location_name.length
                if (location_name_len === location_id_len) {
                  const location_name_str = location_name.join(',')
                  const location_name_arr = location_name_str.split(',')
                  const location_name_arr_len = location_name_arr.length
                  const location_name_arr_obj = []
                  for (let i = 0; i < location_name_arr_len; i++) {
                    const location_name_arr_obj_obj = {
                      label: location_name_arr[i],
                      value: location_id[i],
                    }
                    location_name_arr_obj.push(location_name_arr_obj_obj)
                  }
                  setSelectedOption(location_name_arr_obj)
                }
              })
          }
          setLineOfBusinessStatus(line_of_business.line_of_business_status)
        })
      locationList()
    }
  }, [])

  const locationList = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const locationdt = data.data
        const location_len = locationdt.length
        const location_list = []
        for (let i = 0; i < location_len; i++) {
          const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id }
          location_list.push(location_obj)
        }
        setLocation(location_list)
      })
  }

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const line_of_business_name = data.get('line_of_business_name')
    const line_of_business_location = selectedOption
    const line_of_business_location_len = line_of_business_location.length
    const line_of_business_location_str = []
    for (let i = 0; i < line_of_business_location_len; i++) {
      line_of_business_location_str.push(line_of_business_location[i].value)
    }
    const line_of_business_status = data.get('status')
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        line_of_business_name: line_of_business_name,
        line_of_business_location: line_of_business_location_str.toString(),
        line_of_business_status: line_of_business_status,
        line_of_business_id: line_of_business_id,
      }),
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/update_line_of_business`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          Swal.fire({
            title: 'Success!',
            text: data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/line-of-business')
            }
          })
        } else {
          Swal.fire({
            title: 'Error!',
            text: data.message,
            icon: 'error',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/line-of-business')
            }
          })
        }
      })
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Edit Line Of Business</h4>
            </div>
            <div className="card-body">
              <form action="/" method="POST" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Line Of Business Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="line_of_business_name"
                        defaultValue={line_of_business_name}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Line Of Business Location</label>
                      <Multiselect
                        options={location}
                        selectedValues={selectedOption}
                        onSelect={handleChange}
                        onRemove={handleChange}
                        displayValue="label"
                        placeholder="Select Location"
                        closeOnSelect={false}
                        avoidHighlightFirstOption={true}
                        showCheckbox={true}
                        style={{ chips: { background: '#007bff' } }}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Status</label>
                      <select className="form-control" name="status" required>
                        <option value="">Select Status</option>
                        <option value="1" selected={line_of_business_status == 1 ? true : false}>
                          Active
                        </option>
                        <option value="0" selected={line_of_business_status == 0 ? true : false}>
                          Inactive
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <button
                      type="submit"
                      className="btn btn-primary mt-2"
                      style={{ float: 'right' }}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default EditLineOfBusiness
