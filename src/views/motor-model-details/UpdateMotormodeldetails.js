import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Multiselect from "multiselect-react-dropdown";

const UpdateMotormodeldetails = () => {
  const navigate = useNavigate();

  const customURL = window.location.href
  const params = new URLSearchParams(customURL.split('?')[1])
  const ParamValue = params.get('id')

  const [motor_model, setMotormodel] = useState([]);
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [motor_model_detail_name, setMotorModelDetailName] = useState('');
  const [motor_model_detail_model_id, setMotorModelDetailModelId] = useState('');
  const [motor_model_detail_status, setMotorModelDetailStatus] = useState('');
  const [motor_model_detail_id, setModelMotorDetailId] = useState('');

  useEffect(() => {
    const url = window.location.href;
    const url1 = url.split("/")[3];
    const url2 = url1.split("?")[1];
    const id = url2.split("=")[1];
    setModelMotorDetailId(id);
    getlistMotormodel();
    detailsbyid()
  }, [])


  const getlistMotormodel = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('https://insuranceapi-3o5t.onrender.com/api/get_model_motor_name', requestOptions)
      .then(response => response.json())
      .then(data => {
        setMotormodel(data.data);
        console.log(motor_model);
      });
  }


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
  };

  const detailsbyid = async () => {

    const requestOptions = {
      method: "post",
      body: JSON.stringify({ ParamValue }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Motor_model_detailsbyid`, requestOptions);
    result = await result.json();
    setMotorModelDetailName(result.motor_model_detail_name);
    setMotorModelDetailStatus(result.motor_model_detail_status);
    setMotorModelDetailModelId(result.motor_model_detail_model_id);
    const locationid = result.motor_model_detail_location;
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
          }
        });
    }
    locationList();

  }

  const updateMotorModelDetails = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const model_motor_detail_name = data.get('model_motor_detail_name');
    const motor_model_detail_model_id = data.get('model_motor');
    const location = selectedOption;
    const location_len = location.length;
    const location_id = [];
    for (let i = 0; i < location_len; i++) {
      location_id.push(location[i].value);
    }
    const location_id_str = location_id.join(",");
    const model_motor_detail_status = data.get('status');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_motor_detail_name: model_motor_detail_name,
        motor_model_detail_model_id: motor_model_detail_model_id,
        motor_model_detail_location: location_id_str.toString(),
        model_motor_detail_status: model_motor_detail_status,
        motor_model_detail_id: motor_model_detail_id
      })
    };
    fetch('https://insuranceapi-3o5t.onrender.com/api/update_Motor_model_details', requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          Swal.fire({
            title: "Success!",
            text: data.message,
            icon: "success",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/ViewMotorModelDetails");
            }
          });
        }
        else {
          Swal.fire({
            title: "Error!",
            text: data.message,
            icon: "error",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/ViewMotorModelDetails");
            }
          });
        }
      });
  }


  return (
    <>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Update Motor Model details</h4>
              </div>
              <div className="card-body">
                <form action="/" method="POST" onSubmit={updateMotorModelDetails}>
                  <div className="row">
                    <div className="col-md-6">

                      <label className="form-label"><strong>Motor Model detail Name</strong></label>
                      <input type="text"
                        className="form-control"
                        placeholder="Model Detail"
                        name="model_motor_detail_name"
                        autoComplete="off"
                        required
                        defaultValue={motor_model_detail_name}
                        onChange={(e) => setMotorModelDetailName(e.target.value)} />
                    </div>
                    <div className="col-md-6">

                      <label className="form-label"><strong>Motor Models</strong></label>
                      <select className="form-control" name="model_motor" required

                        onChange={(e) => setMotorModelDetailModelId(e.target.value)}>
                        <option>Select Model Motor</option>
                        {motor_model.map((item, index) => (
                          <option key={index} value={item._id} selected={motor_model_detail_model_id == item._id ? true : false}>{item.motor_model_name}</option>
                        ))}
                      </select>
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

                      <select className="form-control" name="status" onChange={(e) => setMotorModelDetailStatus(e.target.value)}>
                        <option>Select Status</option>
                        <option value="1" selected={motor_model_detail_status == 1 ? true : false}>Active</option>
                        <option value="0" selected={motor_model_detail_status == 0 ? true : false}>InActive</option>
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

export default UpdateMotormodeldetails