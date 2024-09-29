import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewStandardCover = () => {
  const navigate = useNavigate();
  const [standardcover, setstandardcover] = useState([]);
  const [enabledRows, setEnabledRows] = useState({});
  const [formData, setFormData] = useState([]);
  const [planStandardCover, setPlanStandardCover] = useState([])
  const [planName, setPlanName] = useState('')
  const [planType, setPlanType] = useState('')
  const [company_name, setCompanyName] = useState('')
  const customURL = window.location.href;
  const params = new URLSearchParams(customURL.split('?')[1]);
  const ParamValue = params.get('id');
  const ParamType = params.get('type');
  const companyid = params.get('companyid');
  const planid = params.get('policytype');
  // console.log(ParamValue,ParamType,companyid,planid,"params")

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
      const type = url3[1].split("=")[1];
      getstandardcover(id, type);
      setPlanType(type)
    }
  }, []);

  const handleCheckboxChange = (e, cover) => {
    const stateValue = [...formData]


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

  const getstandardcover = async (id, type) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_standard_cover/${id}/${type}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const standardcover = data.data;
        console.log(standardcover, ">>>>>>>>>> matched standard covers")
        const standcoverlen = standardcover.length;
        const requestOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };
        let url = '';
        if (type == 'motor') {
          url = `https://insuranceapi-3o5t.onrender.com/api/motor_plan_details/${id}`;
        }
        if (type == 'travel') {
          url = `https://insuranceapi-3o5t.onrender.com/api/travel_plan_details/${id}`;
        }
        if (type == 'home') {
          url = `https://insuranceapi-3o5t.onrender.com/api/home_plan_details/${id}`;
        }
        if (type == 'yacht') {
          url = `https://insuranceapi-3o5t.onrender.com/api/yacht_plan_details/${id}`;
        }
        if (type == 'medical') {
          url = `https://insuranceapi-3o5t.onrender.com/api/single_medical_plan_details/${id}`;
        }
        fetch(url, requestOptions)
          .then(response => response.json())
          .then(data => {
            const StandardCover = data.data.standard_cover_arr;
            setPlanName(data.data.plan_name)
            setCompanyName(data.company_name)
            console.log(data.data, ">>>>>>>>>> plan data")
            const coverdata = [];
            for (let i = 0; i < standcoverlen; i++) {
              for (let j = 0; j < StandardCover.length; j++) {
                if (standardcover[i]._id == StandardCover[j].standard_cover_id) {
                  coverdata.push(standardcover[i])
                  standardcover[i]['checked'] = 'checked';
                  standardcover[i]['value'] = StandardCover[j].standard_cover_value;
                  standardcover[i]['standard_cover_description'] = StandardCover[j].standard_cover_desc;
                }
              }
            }
            setstandardcover(standardcover)
            setFormData(coverdata)
          });
      });
  }

  const handleInputChange = (e, itemId) => {
    const valdata = new FormData();
    const desc = valdata.get('standard_cover_description');
    const val = valdata.get('value');
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
          standard_cover_description: desc,
          value: val,
        });
      }
      return newData;
    });
  };

  const handleSubmit = () => {
    console.log(formData, "submit data")

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: ParamValue, type: ParamType, formData: formData }),
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/add_plan_standard_cover`, requestOptions)
      .then(response => response.json())
      .then(data => {
        window.location.href = '/ViewStandardCover?id=' + ParamValue + '&type=' + ParamType;
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
                  <h4>Standard Covers</h4>
                  {
                    planType == 'travel' ?
                      <>
                        <h5>Plan Name : {planName}</h5>
                        <h5>Company Name : {company_name}</h5>
                      </>
                      : ''
                  }
                </div>

                <div className="col-md-6">
                  <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ float: 'right' }}>Back</button>

                </div>
              </div>
            </div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th><strong>#</strong></th>
                    <th><strong>Standard Cover Label</strong></th>
                    <th><strong>Description</strong></th>
                    <th><strong>Fixed/Percentage/Reffered</strong></th>
                  </tr>
                </thead>
                <tbody>
                  {standardcover.map((item, index) => (
                    <tr key={index}>
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
                      <td>{item.standard_cover_label}</td>
                      <td>
                        <div className="form-group">
                          <input
                            type="text"
                            name="standard_cover_description"
                            className="form-control"
                            disabled={!item.checked}
                            onChange={(e) => handleInputChange(e, item._id)}
                            defaultValue={item.standard_cover_description}
                          />
                        </div>
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

export default ViewStandardCover