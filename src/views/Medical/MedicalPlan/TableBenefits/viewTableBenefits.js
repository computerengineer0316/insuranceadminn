import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewTableBenefits = () => {
  const navigate = useNavigate();
  const [tableBenefit, setTabaleBenefits] = useState([]);
  const [enabledRows, setEnabledRows] = useState({});
  const [formData, setFormData] = useState([]);

  const customURL = window.location.href;
  const params = new URLSearchParams(customURL.split('?')[1]);
  const ParamValue = params.get('id');
  const ParamType = "medical";

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

      getTableBenefits(id);
    }
  }, []);

  const handleCheckboxChange = (rowId) => {
    setEnabledRows((prevState) => ({
      ...prevState,
      [rowId]: !prevState[rowId],
    }));

    setFormData((prevData) => {
      const newData = [...prevData];
      const existingDataIndex = newData.findIndex((item) => item.itemId === rowId);

      if (existingDataIndex !== -1) {
        newData[existingDataIndex] = {
          ...newData[existingDataIndex],
          checked: !newData[existingDataIndex].checked,
        };
      }
      else {
        const newItem = {
          itemId: rowId,
          checked: true,
          benefit: '',
          itemdesc: '',
          value: '',
        };
        const benefitsItem = tableBenefit.find((item) => item._id === rowId);
        if (benefitsItem) {
          newItem.benefit = benefitsItem.table_benefit;
          newItem.itemdesc = benefitsItem.table_benefit_description;
        }
        newData.push(newItem);
      }
      return newData;
    });
  };

  const getTableBenefits = async (id) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_medical_benefits`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const tableBenefits = data.data;

        const benefitsLenght = tableBenefits.length;

        for (let i = 0; i < benefitsLenght; i++) {
          medicalBenefitsData(tableBenefits[i], id)
        }
      });
  }

  const medicalBenefitsData = (MedicalBenefits, id) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(`https://insuranceapi-3o5t.onrender.com/api/single_medical_plan_details/${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const medicalPlanDetails = data.data.medical_benefits;
        const medicalPlanDetailslen = medicalPlanDetails.length;
        for (let i = 0; i < medicalPlanDetailslen; i++) {
          if (medicalPlanDetails[i].itemId == MedicalBenefits._id) {
            MedicalBenefits['itemdesc'] = medicalPlanDetails[i].itemdesc;
            MedicalBenefits['value'] = medicalPlanDetails[i].value;
          }
        }
        setTabaleBenefits((prevData) => [...prevData, MedicalBenefits]);

      });
  };
  const handleInputChange = (e, itemId) => {
    console.log(itemId)
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = [...prevData];
      const existingDataIndex = newData.findIndex((item) => item.itemId === itemId);
      if (existingDataIndex !== -1) {
        newData[existingDataIndex] = {
          ...newData[existingDataIndex],
          [name]: value,
        };
      }
      else {
        newData.push({
          itemId,
          [name]: value,
        });
      }
      return newData;
    });
  };

  const handleSubmit = () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: ParamValue, type: ParamType, formData: formData }),
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/add_medical_benefits`, requestOptions)
      .then(response => response.json())
      .then(data => {
        window.location.href = '/viewMedicalBenefits?id=' + ParamValue;
      }
      );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card ">
            <div className="card-header">
              <div className='row'>
                <div className='col-md-6'>
                  <h4>Medical Benefits</h4>
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
                    <th><strong>value</strong></th>
                  </tr>
                </thead>
                <tbody>
                  {tableBenefit.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="checkboxs">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexCheckDefault"
                            defaultChecked={item.itemdesc && item.value}
                            onChange={() => handleCheckboxChange(item._id)}
                          />
                        </div>
                      </td>
                      <td>{item.table_benefit}</td>
                      <td>
                        <div className="form-group">
                          <input
                            type="text"
                            name="description"
                            className="form-control"
                            disabled={!enabledRows[item._id] && !item.itemdesc}
                            onChange={(e) => handleInputChange(e, item._id)}
                            defaultValue={item.itemdesc ? item.itemdesc : item.table_benefit_description}
                          />
                        </div>
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

export default ViewTableBenefits