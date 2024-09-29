import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
const ViewAdditionalUnderwrinting = () => {
  const navigate = useNavigate();
  const [additionalCondtion, setAdditionalConditions] = useState([]);
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

      getAdditionalConditions(id);
    }
  }, []);

  const handleCheckboxChange = (e, cover) => {
    const stateValue = [...formData]
    setEnabledRows((prev) => ({ ...prev, [cover._id]: e.target.checked }));


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

  const getAdditionalConditions = async (id) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_additional_conditions`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const AdditionalCondtions = data.data;
        console.log(AdditionalCondtions, ">>>>>>>>>>>>>>> AdditionalCondtions")
        const additionalLenght = AdditionalCondtions.length;


        fetch(`https://insuranceapi-3o5t.onrender.com/api/single_medical_plan_details/${id}`, requestOptions)
          .then(response => response.json())
          .then(data => {
            const additional_conditionDetails = data.data.additional_conditions_arr;
            const additionalArr = [];
            for (let j = 0; j < additionalLenght; j++) {
              for (let i = 0; i < additional_conditionDetails.length; i++) {
                if (additional_conditionDetails[i].itemId == AdditionalCondtions[j]._id) {
                  console.log("hii")
                  AdditionalCondtions[j]['itemdesc'] = additional_conditionDetails[i].itemdesc;
                  AdditionalCondtions[j]['value'] = additional_conditionDetails[i].value;
                  AdditionalCondtions[j]['status'] = additional_conditionDetails[i].status;
                  AdditionalCondtions[j]['checked'] = 'checked';
                  additionalArr.push(AdditionalCondtions[j])
                }

              }
            }

            setAdditionalConditions(AdditionalCondtions);
            setFormData(additionalArr)

          });
      });
  }


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
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(ParamValue)
    console.log(ParamType)
    console.log(formData)

    const options = formData.map((item) => (item?.status.length))
    const numbersCount = formData.map((item) => (item?.value?.split(',').length));

    console.log("numberscount " + typeof numbersCount + " " + numbersCount)
    console.log("options " + typeof options + " " + options)

    const isMatch = JSON.stringify(numbersCount) === JSON.stringify(options);
    console.log("isMatch: " + isMatch);
    const hasEmptyValue = formData.some((item) => !item.value);

    // Check if no status is selected
    const hasNoStatus = formData.some((item) => !item.status || item.status.length === 0);

    if (hasNoStatus) {
      swal("Please select the status for all the conditions", "", "warning");
      return false;
    }
    else if (hasEmptyValue) {
      swal("Please fill in all the value fields", "", "warning");
      return false;
    }
    else if (isMatch === false && JSON.stringify(options) < JSON.stringify(numbersCount)) {
      swal("Please select the values for all the status", "", "warning")
      return false;
    }
    else if (isMatch === false && JSON.stringify(options) > JSON.stringify(numbersCount)) {
      swal("Please select the status for all the values", "", "warning")
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
      fetch(`https://insuranceapi-3o5t.onrender.com/api/add_Additional_underwriting_conditions`, requestOptions)
        .then(response => response.json())
        .then(data => {
          window.location.href = '/viewAdditionalConditions?id=' + ParamValue;
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
                  <h4>Additional Underwriting Conditions</h4>
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
                    <th><strong>value</strong></th>
                  </tr>
                </thead>
                <tbody>
                  {additionalCondtion.map((item) => (
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
                            disabled={item.checked == 'checked' ? false : true}
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
                            disabled={!item.checked}
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

export default ViewAdditionalUnderwrinting