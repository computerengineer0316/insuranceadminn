import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Multiselect from 'multiselect-react-dropdown';


const EditPlanRates = () => {
  const navigate = useNavigate();
  const [medical_plan_id, setMedicalPlanId] = useState('');
  const [planCategory, setPlanCategory] = useState([]);
  const [medicalEmrateData, setMedicalEmrateData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [PlanRatesValues, setPlanRatesValues] = useState([]);
  const [selectedLocationData, setSelectedLocationData] = useState([]);
  const [selectedEmirateData, setSelectedEmirateData] = useState([]);
  const [TPAData, setTPAData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [real_medical_plan_id, setRealMedicalPlanId] = useState('');
  const [age_Range, setAge_Range] = useState('');
  const [periodRange, setDefaultPeriodDays] = useState({ perioddayRange: '', perioddayRange_topup: '' })




  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {

      let url = window.location.href;
      url = url.split("?")[1]
      let [rateId, planId] = url.split("&")
      rateId = rateId.split("=")[1]
      planId = planId.split("=")[1]

      setMedicalPlanId(rateId);
      setRealMedicalPlanId(planId)
      medicalEmrate()
      Plancategory()
      getLocationdata()
      planRatesDeltails(rateId)
      getNetworkData()
      getTPAData()
    }
  }, []);
  const [rowsData, setRowsData] = useState({})
  const getLinkListByTPAid = (id) => {
    const requestOptions = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getTpaLinkNetwork?tpaId=${id}`, requestOptions)
      .then(response => response.json())
      .then((data) => {
        setNetworkData(data.data)

      })
      .catch(error => console.log('error', error));
  }
  const handleChange = (evnt) => {
    const { name, value } = evnt.target
    if (name === 'TPA') {
      getLinkListByTPAid(value)
    }
    rowsData[name] = value
    setRowsData(rowsData)
    console.log("valuelllllllllllllllllllllllrowsData", rowsData)

  }

  const Plancategory = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getPlanCategory`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setPlanCategory(data.data);
      });
  }

  const getLocationdata = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
      .then(response => response.json())
      .then(result => {
        let data = result.data;
        const locationArray = [];
        for (let i = 0; i < data?.length; i++) {
          const obj = { label: data[i].location_name, value: data[i]._id };
          locationArray.push(obj);
        }
        setLocationData(locationArray)

      });
  }

  const medicalEmrate = () => {
    var requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    fetch('https://insuranceapi-3o5t.onrender.com/api/getAreaOfRegistrations', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        let data = result.data;
        const emirateArray = [];
        for (let i = 0; i < data.length; i++) {
          const obj = { label: data[i].area_of_registration_name, value: data[i]._id };
          emirateArray.push(obj);
        }
        setMedicalEmrateData(emirateArray)
      })
      .catch((error) => console.log('error', error))
  }
  const getTPAData = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch("https://insuranceapi-3o5t.onrender.com/api/activeMedicalTPA", requestOptions)
      .then(response => response.json())
      .then((data) => {
        setTPAData(data.data)

      })
  }
  const getNetworkData = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch("https://insuranceapi-3o5t.onrender.com/api/activeMedicalNetwork", requestOptions)
      .then(response => response.json())
      .then((data) => {
        setNetworkData(data.data)

      })
  }

  const planRatesDeltails = (id) => {
    console.log('planRatesDeltails..................................insede')
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/rates_based_on_age_details/${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setPlanRatesValues(data.data[0]);
        console.log("skfjikkoooooooooooooooooooo", data);
        const aData = data.data[0].ageRange
        const ageRange = []
        for (let i = 0; i < aData?.length; i++) {
          ageRange.push(aData[i].minAge + "-" + aData[i].maxAge)
        }
        const ageR = ageRange.join(",")
        setAge_Range(ageR)

        const pData = data.data[0]?.perioddays
        const periodDays = []
        const pDayTopup = []
        for (let i = 0; i < pData?.length; i++) {
          periodDays.push(pData[i].min + "-" + pData[i].max)
          pDayTopup.push(pData[i].topup)
        }

        const periodDay = periodDays.join(",")
        const periodDayTopup = pDayTopup.join(",")
        setDefaultPeriodDays({
          perioddayRange: periodDay,
          perioddayRange_topup: periodDayTopup
        })
        let selectedLocation = data.data[0]?.locationData
        let locationArray = []
        for (let i = 0; i < selectedLocation?.length; i++) {
          locationArray.push({ label: selectedLocation[i].location_name, value: selectedLocation[i]._id })
        }
        let selectedEmirateData = data.data[0]?.emirateData

        let emirateArray = []
        for (let i = 0; i < selectedEmirateData?.length; i++) {
          emirateArray.push({ label: selectedEmirateData[i].area_of_registration_name, value: selectedEmirateData[i]._id })
        }
        let ageTopupData = data.data[0]?.primiumArray
        let ageData
        setSelectedEmirateData(emirateArray)
        setSelectedLocationData(locationArray)
        let payload = {}
        payload['name'] = data.data[0]?.name
        payload['TPA'] = data.data[0]?.TPA
        payload['coPayments'] = data.data[0]?.primiumArray
        payload['network'] = data.data[0]?.network
        payload['emirateId'] = data.data[0]?.emirateId
        payload['planCatagoryId'] = data.data[0]?.planCatagoryId
        payload['locationArray'] = data.data[0]?.locationArray
        payload['ageRagne'] = (data.data[0]?.primiumArray?.map((obj) => obj?.minAge + "-" + obj.maxAge))?.join(",")
        payload['malePrimium'] = (data.data[0]?.primiumArray?.map((obj) => (obj?.malePre)))?.join(",")
        payload['femalePrimium'] = (data.data[0]?.primiumArray?.map((obj) => (obj?.femalePer)))?.join(",")
        payload['femaleMarridePrimiumRagne'] = (data.data[0]?.primiumArray?.map((obj) => (obj?.marrideFemalePre)))?.join(",")

        setRowsData(payload)
        // setMedicalPlanId(data.data.medical_plan_id)
      });
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name');
    const TPA = data.get('TPA');
    const network = data.get('network');
    const emirateId = data.get('emirateId');;
    const ageRagne = data.get('ageRagne');
    const malePrimium = data.get('malePrimium');
    const femalePrimium = data.get('femalePrimium');
    const femaleMarridePrimiumRagne = data.get('femaleMarridePrimium');
    const coPayments = data.get('coPayments');
    const perioddayRange = data.get('perioddayRange');
    const perioddayRange_topup = data.get('perioddayRange_topup');

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        TPA,
        network,
        emirateId,
        ageRagne,
        malePrimium,
        femalePrimium,
        femaleMarridePrimium: femaleMarridePrimiumRagne,
        coPayments,
        perioddayRange,
        perioddayRange_topup,
        region_id: selectedEmirateData,
        locationArray: selectedLocationData
      })

    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/update_medicalplan_rates/${medical_plan_id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            title: "Success!",
            text: data.message,
            type: "success",
            icon: "success"
          }).then(function () {
            navigate('/ViewRatesBasedOnAge?id=' + real_medical_plan_id);
          });
        }
        else {
          swal({
            title: "Error!",
            text: data.message,
            type: "error",
            icon: "error"
          }).then(function () {
            navigate('/ViewRatesBasedOnAge?id=' + real_medical_plan_id);
          });
        }
      });
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-6">
                  <h4 className="card-title">Edit Rates</h4>
                </div>
                <div className="col-md-6">
                  <a
                    href={`/ViewRatesBasedOnAge?id=${real_medical_plan_id}`}
                    className="btn btn-primary"
                    style={{ float: 'right' }}
                  >
                    Back
                  </a>
                </div>
              </div>
            </div>
            <div className="card-body">
              <form action="/" method="POST" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label>name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        onChange={(event) => handleChange(event)}
                        placeholder="Enter Age Range"
                        defaultValue={PlanRatesValues?.name}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label>TPA</label>
                      <select className="form-control" name='TPA' onChange={(event) => handleChange(event)}>
                        <option value="">Select TPA</option>
                        {TPAData.map((item, index) => {
                          return (
                            <option key={index} value={item._id} selected={rowsData?.TPA == item._id ? true : false}>
                              {item.name}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label>Networky</label>
                      <select className="form-control" name='network' onChange={(event) => handleChange(event)}>
                        <option value="">Select network</option>
                        {networkData.map((item, index) => {
                          return (
                            <option key={index} value={item._id} selected={rowsData?.network == item._id ? true : false || index == 0}>
                              {item.name}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>Age Ragne</label>
                      <input
                        type="text"
                        name="ageRagne"
                        className="form-control"
                        onChange={(event) => handleChange(event)}
                        placeholder="0-10"
                        defaultValue={age_Range}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>Emirates Issuing Visa</label>
                      <Multiselect
                        options={medicalEmrateData}
                        selectedValues={selectedEmirateData}
                        onSelect={(evnt) => setSelectedEmirateData(evnt)}
                        onRemove={(evnt) => setSelectedEmirateData(evnt)}
                        displayValue="label"
                        placeholder="Select Emirates Issuing"
                        closeOnSelect={false}
                        avoidHighlightFirstOption={true}
                        showCheckbox={true}
                        showArrow={true}
                        style={{ chips: { background: '#007bff' } }}
                      />
                    </div>
                  </div>

                </div>
                <div className='row'>
                  <div className="col-md-12">
                    <div className="form-group mb-3">
                      <label>Co-payments</label>
                      <textarea
                        type="text"
                        name="coPayments"
                        className="form-control"
                        onChange={(event) => handleChange(event)}
                        placeholder="Enter Co-payments"
                        defaultValue={rowsData?.coPayments?.map((obj) => obj?.coPayments)?.join('::')}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">

                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label>Male Primium</label>
                      <input
                        type="text"
                        name="malePrimium"
                        className="form-control"
                        onChange={(event) => handleChange(event)}
                        placeholder="5000,5000"
                        defaultValue={PlanRatesValues?.primiumArray
                          ?.map((obj) => obj?.malePre)
                          ?.join(',')}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label>Female Primium</label>
                      <input
                        type="text"
                        name="femalePrimium"
                        className="form-control"
                        onChange={(event) => handleChange(event)}
                        placeholder="5000,5000"
                        defaultValue={PlanRatesValues?.primiumArray
                          ?.map((obj) => obj?.femalePer)
                          ?.join(',')}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label>Female(Marride) Primium</label>
                      <input
                        type="text"
                        name="femaleMarridePrimium"
                        className="form-control"
                        onChange={(event) => handleChange(event)}
                        placeholder="5000,5000"
                        defaultValue={PlanRatesValues?.primiumArray
                          ?.map((obj) => obj?.marrideFemalePre)
                          .join(',')}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label>Period Days Range </label>
                      <input
                        onChange={(evnt) => handleChange(evnt)}
                        type="text" name="perioddayRange" className="form-control"
                        defaultValue={periodRange?.perioddayRange}
                        placeholder="10-20,20-30" required />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label>Topup</label>
                      <input
                        onChange={(evnt) => handleChange(evnt)}
                        type="text" name="perioddayRange_topup" className="form-control"
                        defaultValue={periodRange?.perioddayRange_topup}
                        placeholder="0,10,20" required />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label>Location</label>
                      <Multiselect
                        options={locationData}
                        selectedValues={selectedLocationData}
                        onSelect={(evnt) => setSelectedLocationData(evnt)}
                        onRemove={(evnt) => setSelectedLocationData(evnt)}
                        displayValue="label"
                        placeholder="Select Location"
                        closeOnSelect={false}
                        avoidHighlightFirstOption={true}
                        showCheckbox={true}
                        showArrow={true}
                        style={{ chips: { background: '#007bff' } }}
                      />
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

export default EditPlanRates
