import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Container, Row } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';

const AddNationality = () => {
  const navigate = useNavigate()
  useEffect(() => {
    locationList()
  }, [])



  const [nationality_name, setNationalityname] = useState('')
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [nationality_status, setNationalitystatus] = useState('')

  const locationList = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const locationdt = data.data;
        const location_len = locationdt.length;
        const location_list = [];
        for (let i = 0; i < location_len; i++) {
          const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
          location_list.push(location_obj);
        }
        setLocation(location_list);
      });
  }


  const addnationalitylist = async (e) => {
    e.preventDefault();
    if (nationality_name == '') {
      swal("Please Enter Nationality name", "", "warning");
      return false;
    } else if (selectedOption == undefined) {
      swal("Please Select Location", "", "warning");
      return false;
    } else if (nationality_status == '') {
      swal("Please Select Status", "", "warning");
      return false;
    }
    else {
      const nationality_location = selectedOption;
      const nationality_location_len = nationality_location.length;
      const nationality_location_str = [];
      for (let i = 0; i < nationality_location_len; i++) {
        nationality_location_str.push(nationality_location[i].value);
      }
      let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/add_nationality_list', {
        method: 'post',
        body: JSON.stringify({
          nationality_name: nationality_name,
          nationality_location: nationality_location_str.toString(),
          nationality_status: nationality_status
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      result = await result.json();
      swal("Added Succesfully", "", "success");
      console.log(result)
      navigate('/ViewNationality')
    }
  }

  return (
    <>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Add Nationality</h4>
              </div>
              <div className="card-body">
                <form action="/" method="POST" onSubmit={addnationalitylist}>
                  <div className="row">
                    <div className="col-md-6">

                      <label className="form-label"><strong>Add Cover Type</strong></label>
                      <input type='text' className="form-control"
                        name='name'
                        placeholder="Enter Nationality Name"
                        defaultValue=""
                        onChange={e => setNationalityname(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label"><strong>Select Location</strong></label>

                      <Multiselect
                        options={location}
                        displayValue="label"
                        onSelect={setSelectedOption}
                        onRemove={setSelectedOption}
                        placeholder="Select Location"
                        showCheckbox={true}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label"><strong>Status</strong></label>.
                      <select className="form-control" name="status" onChange={(e) => setNationalitystatus(e.target.value)}>
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

export default AddNationality

