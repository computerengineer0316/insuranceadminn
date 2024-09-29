import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const MaternityCondition = () => {
  const navigate = useNavigate();
  const [maternityCondtions, setMaternityConditions] = useState([]);
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
    console.log("stateValue>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", stateValue)
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
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_maternity`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const maternityCondtion = data.data;
        console.log("inside>>>>>>>>>>>>>>>>>>>>>>", maternityCondtion)

        fetch(`https://insuranceapi-3o5t.onrender.com/api/single_medical_plan_details/${id}`, requestOptions)
          .then(response => response.json())
          .then(data => {
            const maternityconditionDetails = data.data.maternity_condition_arr;
            console.log("maternityconditionDetails>>>>>>>>>>>>>>>>>>>>>>", maternityconditionDetails)

            const maternitydata = []
            for (let j = 0; j < maternityCondtion.length; j++) {
              for (let i = 0; i < maternityconditionDetails.length; i++) {
                if (maternityconditionDetails[i].itemId == maternityCondtion[j]._id) {

                  // maternityCondtion[j]['itemdesc'] = maternityconditionDetails[i].itemdesc;
                  maternityCondtion[j]['value'] = maternityconditionDetails[i].value;
                  maternityCondtion[j]['status'] = maternityconditionDetails[i].status;
                  maternityCondtion[j]['checked'] = 'checked';
                  maternitydata.push(maternityCondtion[j])

                }

              }
            }
            setMaternityConditions(maternityCondtion);
            setFormData(maternitydata)


          });

      });
  }

  console.log("outside>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", maternityCondtions)
  console.log("outside>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", formData)

  const handleInputChange = (e, itemId) => {

    const valdata = new FormData();
    // const desc = valdata.get('description');
    const val = valdata.get('value');
    const id = valdata.get('status');
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newData = [...prevData];
      console.log("newData>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", newData)
      const existingDataIndex = newData.findIndex((item) => item?._id === itemId);
      if (existingDataIndex !== -1) {
        newData[existingDataIndex] = {
          ...newData[existingDataIndex],
          [name]: value,
        };
      }
      else {
        newData.push({
          itemId,
          // description: desc,
          status: id,
          value: val,
        });
      }
      console.log("newData>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", newData)
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


    // return false;


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
      fetch(`https://insuranceapi-3o5t.onrender.com/api/add_Maternity_conditionarr`, requestOptions)
        .then(response => response.json())
        .then(data => {
          window.location.href = '/MaternityConditions?id=' + ParamValue;

        }
        );
    }
  };

  console.log("maternityCondtions>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", maternityCondtions)

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card ">
            <div className="card-header">
              <div className='row'>
                <div className='col-md-6'>
                  <h4>Maternity Conditions</h4>
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
                    {/* <th><strong>Description</strong></th> */}
                    <th><strong>Status</strong></th>
                    <th><strong>Value</strong></th>
                  </tr>
                </thead>
                <tbody>
                  {maternityCondtions.map((item) => (
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
                      <td>{item.condition}</td>
                      {/* <td>
                        <div className="form-group">
                          <input
                            type="text"
                            name="description"
                            className="form-control"
                            disabled={!enabledRows[item._id] && !item.itemdesc}
                            onChange={(e) => handleInputChange(e, item._id)}
                            defaultValue={item.itemdesc ? item.itemdesc : item.condition}
                          />
                        </div>
                      </td> */}
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

export default MaternityCondition