import React, { useState, useEffect } from 'react'
import { Container, Row } from 'react-bootstrap'
import Multiselect from 'multiselect-react-dropdown';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const Updatehomeownership = () => {
  const navigate = useNavigate();

  useEffect(() => {
    locationList();
    detailsbyid();
  }, [])

  const customURL = window.location.href
  const params = new URLSearchParams(customURL.split('?')[1])
  const ParamValue = params.get('id')

  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [home_owner_type, setHomeownertype] = useState('');
  const [home_ownership_location, setHomeownershiplocation] = useState([]);
  const [home_ownership_status, setHomeownershipstatus] = useState();

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

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  }

  const detailsbyid = async () => {

    const requestOptions = {
      method: "post",
      body: JSON.stringify({ ParamValue }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_home_owner_type_detailsbyid`, requestOptions);
    result = await result.json();
    setHomeownertype(result.home_owner_type);
    setHomeownershipstatus(result.home_ownership_status);
    const locationid = result.home_ownership_location;
    const location_id = locationid.toString().split(",");
    const location_id_len = location_id.length;
    const location_name = [];
    for (let i = 0; i < location_id_len; i++) {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location_by_id/${location_id[i]}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          location_name.push(data.data.location_name);
          const location_name_len = location_name.length;
          if (location_name_len === location_id_len) {
            const location_name_str = location_name.join(",");
            const location_name_arr = location_name_str.split(",");
            const location_name_arr_len = location_name_arr.length;
            const location_name_arr_obj = [];
            for (let i = 0; i < location_name_arr_len; i++) {
              const location_name_arr_obj_obj = { label: location_name_arr[i], value: location_id[i] };
              location_name_arr_obj.push(location_name_arr_obj_obj);
            }
            setSelectedOption(location_name_arr_obj);
            setHomeownershiplocation(location_name_arr_obj);
          }
        });
    }
    locationList();
  }



  const updateHomeownershipstatus = async (e) => {
    e.preventDefault();
    if (home_owner_type === '' || home_owner_type === null) {
      swal("Please Enter Ownership Type", "", "error")
      return false;
    }
    if (home_ownership_location === '' || home_ownership_location === null) {
      swal("Please Select Location", "", "error")
      return false;
    }
    if (home_ownership_status === '' || home_ownership_status === null) {
      swal("Please Select Status", "", "error")
      return false;
    }
    else {
      const home_ownership_location = selectedOption;
      const home_ownership_location_len = home_ownership_location.length;
      const home_ownership_location_str = [];
      for (let i = 0; i < home_ownership_location_len; i++) {
        home_ownership_location_str.push(home_ownership_location[i].value);
      }
      let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/update_home_owner_type_details`, {
        method: "POST",
        body: JSON.stringify({
          ParamValue: ParamValue,
          home_owner_type: home_owner_type, home_ownership_location: home_ownership_location_str.toString(),
          home_ownership_status: home_ownership_status
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      swal("Updated Succesfully", "", "success")
      navigate('/Viewhomeownership')
    }
  }

  return (
    <>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Ownership Type</h4>
              </div>
              <div className="card-body">
                <form action="/" method="POST" onSubmit={updateHomeownershipstatus}>
                  <div className="row">
                    <div className="col-md-6">

                      <label className="form-label"><strong>Edit Ownership Type</strong></label>
                      <input type='text' className="form-control"
                        name='name'
                        placeholder='Name'
                        defaultValue={home_owner_type}
                        onChange={e => setHomeownertype(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label"><strong>Select Location</strong></label>

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
                        style={{ chips: { background: "#007bff" } }}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label"><strong>Status</strong></label>.
                      <select className="form-control" name="status" onChange={(e) => setHomeownershipstatus(e.target.value)}>
                        <option defaultValue={home_ownership_status} hidden>{home_ownership_status == 1 ? 'Active' : 'InActive'}</option>
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

export default Updatehomeownership