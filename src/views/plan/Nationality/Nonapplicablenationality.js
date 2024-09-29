import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Nonapplicablenationality = () => {
  const navigate = useNavigate();
  const customURL = window.location.href;
  const params = new URLSearchParams(customURL.split('?')[1]);
  const ParamValue = params.get('id');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login');
    } else {
      getNationality();
    }
  }, []);

  // const [nationality, setNationality] = useState([]);
  const [defaultNationality, setDefaultNationality] = useState([]);
  const [formData, setFormData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const getNationality = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_nationality', requestOptions);
      const data = await response.json();

      const all_nations = data.data;
      const NationArray = []
      for (let a = 0; a < all_nations.length; a++) {
        NationArray.push({
          non_applicable_nationality_id: all_nations[a]._id,
          non_applicable_nationality_label: all_nations[a].nationality_name,
        })

      }
      try {
        const response = await fetch(`https://insuranceapi-3o5t.onrender.com/api/motor_plan_details/${ParamValue}`, requestOptions);
        const data = await response.json();

        const motorPlanDetails = data.data.non_applicable_nationality;
        setFormData(motorPlanDetails)
        for (let i = 0; i < motorPlanDetails.length; i++) {

          for (let j = 0; j < NationArray.length; j++) {
            if (motorPlanDetails[i].non_applicable_nationality_id == NationArray[j].non_applicable_nationality_id) {
              NationArray[j]["itemvalue"] = "checked"
            }
          }
        }
        // setNationality(NationArray)
        setDefaultNationality(NationArray)
        setFilteredData(NationArray)
      } catch (error) {
        console.error('Error:', error);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };



  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterData(query);
  };

  const filterData = (query) => {
    if (query.trim() === '') {
      setFilteredData(filteredData);
    } else {
      const lowerCaseQuery = query?.toLowerCase();
      setFilteredData(defaultNationality.filter((item) =>
        item.non_applicable_nationality_label.toLowerCase().includes(lowerCaseQuery)
      ));
      // (filtered);
    }
  };

  const handleInputChange = (e, item) => {
    const newformData = [...formData]

    if (e.target.checked == true) {
      item['itemvalue'] = 'checked';
      newformData.push(item)
    } else if (e.target.checked == false) {

      const indx = newformData.indexOf(item)
      newformData.splice(indx, 1)
    }
    setFormData(newformData)

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: ParamValue, formData: formData }),
    };

    try {
      const response = await fetch('https://insuranceapi-3o5t.onrender.com/api/add_non_applicable_nationality', requestOptions);
      const data = await response.json();

      if (response.ok) {
        window.location.href = '/Nonapplicablenationality?id=' + ParamValue;
      } else {
        // Handle the error case if the response is not successful
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    setFilteredData(filteredData);
  }, [filteredData, formData]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-6">
                  <h4>Nationality (Plan Non-Applicable)</h4>
                </div>
                <div className="col-md-6">
                  <a href="/motor-plan" className="btn btn-primary" style={{ float: 'right' }}>
                    Back
                  </a>
                </div>
              </div>
            </div>
            <div className="row" style={{ justifyContent: 'end', marginRight: '4px', marginTop: '10px' }}>
              <div className="col-md-3">
                <input
                  className="form-control"
                  type="text"
                  defaultValue={searchQuery}
                  onChange={(e) => handleSearchInputChange(e)}
                  placeholder="Search..."
                />
              </div>
            </div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th style={{ width: '10px' }}>
                      <strong>Select Nationality</strong>
                    </th>
                    <th>
                      <strong>Nationality</strong>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData?.map((item) => (
                    <tr key={item.non_applicable_nationality_id}>
                      <td>
                        <div className="checkboxs">
                          <input
                            defaultChecked={item.itemvalue ? true : false}
                            className="form-check-input"
                            type="checkbox"
                            id={`flexCheckDefault_${item._id}`}
                            onChange={(e) => handleInputChange(e, item)}
                          />
                        </div>
                      </td>
                      <td>{item.non_applicable_nationality_label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer">
              <button className="btn btn-primary" onClick={handleSubmit} style={{ float: 'right' }}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nonapplicablenationality;
