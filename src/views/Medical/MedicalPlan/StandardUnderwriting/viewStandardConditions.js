import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const ViewStandardUnderwrinting = () => {
  const navigate = useNavigate();
  const [standardCondtions, setStandardConditions] = useState([]);
  const [enabledRows, setEnabledRows] = useState({});
  const [formData, setFormData] = useState([]);

  const customURL = window.location.href;
  const params = new URLSearchParams(customURL.split('?')[1]);
  const ParamValue = params.get('id');
  const ParamType = params.get('type');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      const url = window.location.href;
      const url1 = url.split("/")[3];
      const url2 = url1.split("?")[1];
      const url3 = url2.split("&");
      const id = url3[0].split("=")[1];

      getStandardConditions(id);
    }
  }, []);

  const handleCheckboxChange = (e, cover) => {
    const stateValue = [...formData]

    console.log(e.target.checked)
    setEnabledRows({ ...enabledRows, [cover._id]: e.target.checked });


    if (e.target.checked === true) {
      cover['checked'] = 'checked';
      stateValue.push(cover)
    } else if (e.target.checked === false) {

      const indx = stateValue.indexOf(cover)
      console.log(indx)
      stateValue.splice(indx, 1)
    }
    setFormData(stateValue)

  };



  const getStandardConditions = async (id) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_standard_conditions`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const standardCondtions = data.data;

        fetch(`https://insuranceapi-3o5t.onrender.com/api/single_medical_plan_details/${id}`, requestOptions)
          .then(response => response.json())
          .then(data => {
            const standard_conditionDetails = data.data.standard_conditions_arr;

            const standarddata = []
            for (let j = 0; j < standardCondtions.length; j++) {
              for (let i = 0; i < standard_conditionDetails.length; i++) {
                if (standard_conditionDetails[i].itemId == standardCondtions[j]._id) {

                  standardCondtions[j]['itemdesc'] = standard_conditionDetails[i].itemdesc;
                  standardCondtions[j]['value'] = standard_conditionDetails[i].value;
                  standardCondtions[j]['status'] = standard_conditionDetails[i].status;
                  standardCondtions[j]['checked'] = 'checked';
                  standarddata.push(standardCondtions[j])




                }

              }
            }
            setStandardConditions(standardCondtions);
            setFormData(standarddata)


          });

      });
  }

  console.log(standardCondtions)


  const handleInputChange = (e, itemId) => {


    const valdata = new FormData();
    const desc = valdata.get('description');
    const val = valdata.get('value');
    const id = valdata.get('status');
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newData = [...prevData];
      const existingDataIndex = newData.findIndex((item) => item._id === itemId);
      if (existingDataIndex !== -1) {
        newData[existingDataIndex] = {
          ...newData[existingDataIndex],
          [name]: value,
        };
      }
      else {
        newData.push({
          itemId,
          description: desc,
          status: id,
          value: val,
        });
      }
      return newData;
    });
  };


  console.log(formData)

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(ParamValue)
    console.log(ParamType)
    console.log(formData)

    const numbersCount = formData.map((item) => (item.value.split(',').length));
    const options = formData.map((item) => (item.status.length))

    console.log("numberscount " + typeof numbersCount + " " + numbersCount)
    console.log("options " + typeof options + " " + options)

    const isMatch = JSON.stringify(numbersCount) === JSON.stringify(options);
    console.log("isMatch: " + isMatch);


    if (isMatch === false && JSON.stringify(options) < JSON.stringify(numbersCount)) {
      swal("Please select the status for all the values", "", "warning")
      return false;
    }
    else if (isMatch === false && JSON.stringify(options) > JSON.stringify(numbersCount)) {
      swal("Please select the values for all the status", "", "warning")
      return false;
    }
    else {

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: ParamValue, type: ParamType, formData: formData }),
      };
      fetch(`https://insuranceapi-3o5t.onrender.com/api/add_Standard_underwriting_conditions`, requestOptions)
        .then(response => response.json())
        .then(data => {
          window.location.href = '/viewStandardConditions?id=' + ParamValue;

        }
        );
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card ">
            <div className="card-header">
              <div className='row'>
                <div className='col-md-6'>
                  <h4>Additional Conditions</h4>
                </div>

                <div className="col-md-6">
                  <a href="/medicalplan" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                </div>
              </div>
            </div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th><strong>#</strong></th>
                    <th><strong>Feature</strong></th>
                    <th><strong>Description</strong></th>
                    <th><strong>Status</strong></th>
                    <th><strong>Value</strong></th>
                  </tr>
                </thead>
                <tbody>
                  {standardCondtions.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="checkboxs">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexCheckDefault"
                            defaultChecked={item.checked}
                            onChange={(e) => handleCheckboxChange(e, item)}
                          />
                        </div>
                      </td>
                      <td>{item.feature}</td>
                      <td>
                        <div className="form-group">
                          <input
                            type="text"
                            name="description"
                            className="form-control"
                            disabled={!enabledRows[item._id] && !item.itemdesc}
                            onChange={(e) => handleInputChange(e, item._id)}
                            defaultValue={item.itemdesc ? item.itemdesc : item.description}
                          />
                        </div>
                      </td>
                      <td>
                        <Multiselect
                          options={[
                            { name: 'Yes', id: 'true' },
                            { name: 'No', id: 'false' },
                          ]}
                          selectedValues={item.status}
                          displayValue="name"
                          // disabled={!item.checked}
                          disable={!enabledRows[item._id] && !item?.status?.length}
                          onSelect={(selectedValues) => handleInputChange({ target: { name: 'status', value: selectedValues } }, item._id)}
                          onRemove={(selectedValues) => handleInputChange({ target: { name: 'status', value: selectedValues } }, item._id)}
                          showArrow={true}
                        />
                      </td>
                      <td>
                        <div className="form-group">
                          <input
                            type="text"
                            name="value"
                            className="form-control"
                            disabled={!enabledRows[item._id] && !item.value}
                            onChange={(e) => handleInputChange(e, item._id)}
                            defaultValue={item.value}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer">
              <button className='btn btn-primary' onClick={handleSubmit} style={{ float: 'right' }}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default ViewStandardUnderwrinting