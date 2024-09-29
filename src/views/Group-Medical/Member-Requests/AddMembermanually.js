import React, { useEffect, useState } from 'react'
import ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx'

const AddMembermanually = () => {

  const [companyList, setCompanyList] = useState([]);
  const [TPAData, setTPAData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [planList, setPlanList] = useState([]);
  const [nationalityData, setNationalityData] = useState([]);
  const [planId, setPlanId] = useState('');
  const [RateTPAdata, setRatesTPAData] = useState([]);
  const [policyNumber, SetpolicyNumber] = useState('');
  const [companyData, setCompanyData] = useState({});
  const [visaLocations, setVisaIssuedLocationlist] = useState([])
  const [maritalStatus, setMaritalStatusList] = useState([])
  const [genderList, setGenderList] = useState([])
  const [relationList, setRelationList] = useState([])
  const [workLocationList, setWorkLocationList] = useState([])
  const [sponsorTypeList, setSponsorTypeList] = useState([])
  const [regionList, setRegionList] = useState([])
  const [lsbList, setLSBlist] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [salaryBandList, setSalaryBandList] = useState([])
  useEffect(() => {
    company_list();
    getTPAData();
    // getNetworkData();
    GetGroupMedicalPlans();
    getNationality();
    getvisaissuedlocation()
    getMaritalStatus()
    getGender()
    GetRealtionList()
    GetWorkLocationList()
    GetSponsorTypeList()
    GetRegionList()
    getLSB()
    GetGroupMedicalCategory()
    getActualSalaryBand()
  }, []);



  const company_list = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/company_list`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setCompanyList(data.data);
      });
  }

  const GetGroupMedicalPlans = () => {
    const reqOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('https://insuranceapi-3o5t.onrender.com/api/getActiveMedicalGroupPlan', reqOptions)
      .then(response => response.json())
      .then(data => {
        setPlanList(data.data);
      });
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

  const getNationality = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + localStorage.getItem("token") || ""
      },
    }
    fetch("https://insuranceapi-3o5t.onrender.com/api/get_nationality_list", requestOptions)
      .then(response => response.json())
      .then((data) => {
        setNationalityData(data.data)
        // console.log("nationalityData>>>>>>>>>>>>>>>>>>>>>>>>", data.data)
      })
  }


  const getLSB = async (e) => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      }
      fetch(`https://insuranceapi-3o5t.onrender.com/api/get_medical_salary_range`, requestOptions)
        .then(response => response.json())
        .then((data) => {
          console.log("LSB>>>>>>>>>>>>>>>>>>>>>>>>", data.data)
          setLSBlist(data.data)
        })
        .catch(error => console.log('error', error));
    }
    catch (error) {
      console.log(error.message)
    }
  }
  const getActualSalaryBand = () => {
    const reqOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }
    fetch("https://insuranceapi-3o5t.onrender.com/api/get_actualSalaryBand", reqOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("salary band data", data.data)
        setSalaryBandList(data.data)
      })
  }
  const fileType = 'xlsx'

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
      },
      body: JSON.stringify(Object.fromEntries(data)),
    };
    await fetch('https://insuranceapi-3o5t.onrender.com/api/addManuallyGroupMedicalMemberBYAdmin', requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status == 201) {
          window.location.href = "/ViewGroupMedicalPlans";
        } else {
          alert(data.message);
        }
      });
  }

  const handlePlanChange = (evnt) => {
    setRatesTPAData([])
    // setCompanyData('')
    setNetworkData([])
    SetpolicyNumber('')
    const { name, value } = evnt.target
    setPlanId(value)
    const requestOptions = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getRatesOfPlan?planId=${value}`, requestOptions)
      .then(response => response.json())
      .then((data) => {
        const ratesData = data.data
        const TPAdataARr = []
        for (let i = 0; i < ratesData.length; i++) {
          TPAdataARr.push(ratesData[i]?.TPAs[0])
        }

        setRatesTPAData(TPAdataARr)
        // setCompanyData(data.company)
        setCompanyData(data.company[0].company_id[0])

      })
      .catch(error => console.log('error', error));
  }
  const getLinkListByTPAid = (id) => {
    const requestOptions = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getNetworksOfPlanratebyTPA?tpaid=${id}&planid=${planId}`, requestOptions)
      .then(response => response.json())
      .then((data) => {
        const networkData = data.data
        const netwrokArr = []
        for (let i = 0; i < networkData.length; i++) {
          let obj = networkData[i]?.networks[0]
          obj['policy_number'] = networkData[i]?.policy_name
          netwrokArr.push(obj)
        }
        setNetworkData(netwrokArr)
      })
      .catch(error => console.log('error', error));
  }
  const FindPolicyNumber = (e) => {
    const foundPolicyNumber = networkData.find((item) => item._id == e)
    // console.log(foundPolicyNumber?.policy_number)
    SetpolicyNumber(foundPolicyNumber?.policy_number)
  }

  const getvisaissuedlocation = () => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('usertoken')
        },
      };
      fetch(`https://insuranceapi-3o5t.onrender.com/api/getAreaOfRegistrations`, requestOptions)
        .then(response => response.json())
        .then(data => {
          setVisaIssuedLocationlist(data.data)
        });
    } catch (error) {
      console.log(error.message)
    }
  }

  const getMaritalStatus = () => {
    const reqOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }
    fetch("https://insuranceapi-3o5t.onrender.com/api/getMaritalStatus", reqOptions)
      .then((response => response.json()))
      .then(data => {
        setMaritalStatusList(data.data)
      })
  }
  const getGender = () => {
    const reqOption = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }
    fetch("https://insuranceapi-3o5t.onrender.com/api/getGender", reqOption)
      .then((response => response.json()))
      .then(data => {
        console.log(data.data, "gender data")
        setGenderList(data.data)
      })
  }
  const GetRealtionList = () => {
    const reqOptioins = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    fetch("https://insuranceapi-3o5t.onrender.com/api/getRelation", reqOptioins)
      .then((response) => response.json())
      .then((data) => {
        setRelationList(data.data)
      })
  }
  const GetWorkLocationList = () => {
    const reqOption = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }
    fetch("https://insuranceapi-3o5t.onrender.com/api/getWorkLocation", reqOption)
      .then((response) => response.json())
      .then((data) => {
        setWorkLocationList(data.data)
      })
  }
  const GetSponsorTypeList = () => {
    const reqOption = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    fetch("https://insuranceapi-3o5t.onrender.com/api/getsponsortype", reqOption)
      .then((response) => response.json())
      .then((data) => {
        setSponsorTypeList(data.data)
      })
  }
  const GetRegionList = () => {
    const reqOptioins = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    }
    fetch("https://insuranceapi-3o5t.onrender.com/api/get_area_of_registration", reqOptioins)
      .then((val) => val.json())
      .then((data) => {
        setRegionList(data.data)
      })
  }
  const GetGroupMedicalCategory = () => {
    const reqOptions = {
      method: "GET",
      headers: {
        'Content-Type': 'Application/json'
      }
    }
    fetch("https://insuranceapi-3o5t.onrender.com/api/getGroupMedicalCategory", reqOptions)
      .then((response) => response.json())
      .then((data) => {
        setCategoryList(data.data)
      })
  }
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <div className="row">
                <div className="col-md-6">
                  <h4 className="card-title">Member details</h4>
                </div>
                <div className="col-md-6">
                  <a href="/ViewGroupMedicalPlans" className="btn btn-primary" style={{ float: 'right' }}>Back</a>
                </div>
                <div className="card-body">
                  <form method="POST" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Customer Name</strong></label>
                          <select
                            className="form-control"
                            name="planId"
                            onChange={(e) => handlePlanChange(e)}
                            required
                          >
                            <option value="" hidden>Select Plan</option>
                            {planList.map((item, index) => (
                              <option key={index} value={item._id}>{item.plan_name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Insurance Company Name</strong></label>
                          <select
                            className="form-control"
                            name="planCompanyId"
                            required
                          >
                            {/* <option value="" hidden>Select Company</option> */}

                            <option value={companyData._id}>{companyData.company_name}</option>

                          </select>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>TPA</strong></label>
                          <select
                            className="form-control"
                            name="TPAId"
                            onChange={(e) => getLinkListByTPAid(e.target.value)}
                            required
                          >
                            <option value="" hidden>Select Plan</option>
                            {RateTPAdata.map((item, index) => (
                              <option key={index} value={item._id}>{item.name}</option>
                            ))}
                          </select>

                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Network</strong></label>
                          <select
                            className="form-control"
                            name="networkListId"
                            onChange={(e) => FindPolicyNumber(e.target.value)}
                            required
                          >
                            <option value="" hidden>Select Network</option>
                            {networkData.map((item, index) => (
                              <option key={index} value={item._id}>{item.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Policy Number</strong></label>
                          <input type="text" className="form-control" name="policy_number" placeholder="Policy Number" defaultValue={policyNumber} autoComplete="off" required />
                        </div>
                      </div>
                    </div>


                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>First name</strong></label>
                          <input type="text" className="form-control" name="firstName" placeholder="First name" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Middle Name</strong></label>
                          <input type="text" className="form-control" name="middleName" placeholder="Enter Middle Name" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Last Name</strong></label>
                          <input type="text" className="form-control" name="lastnName" placeholder="Enter Last Name" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Employee Number</strong></label>
                          <input type="text" className="form-control" name="employeeNumber" placeholder="Enter Employee Number" autoComplete="off" required />
                        </div>
                      </div>
                      {/* </div>
                        <div className="row"> */}
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Date Of Birth</strong></label>
                          <input type="date" max={currentDate} className="form-control" name="dateOfBirth" placeholder="Enter Date Of Birth" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Gender</strong></label>
                          {/* <input type="text" className="form-control" name="gender" placeholder="Enter Gender" autoComplete="off" required /> */}
                          <select
                            className="form-control"
                            name="gender"
                            required
                          >
                            <option value={""} hidden>Select Gender</option>
                            {genderList?.map((item) => (
                              <option key={item._id} value={item.name}>{item.name}</option>
                            ))
                            }
                            {/* <option value={"Male"} >Male</option>
                                    <option value={"Female"} >Female</option>
                                    <option value={"Others"} >Others</option> */}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Marital Status</strong></label>
                          {/* <input type="text" className="form-control" name="maritalStatus" placeholder="Enter Marital Status" autoComplete="off" required /> */}
                          <select
                            className="form-control"
                            name="maritalStatus"
                            required
                          >
                            <option value={""} hidden>Select Marital Status</option>
                            {maritalStatus?.map((item) => (
                              <option key={item._id} value={item.name}>{item.name}</option>
                            ))
                            }
                            {/* <option value={"Single"} >Single</option>
                                    <option value={"Married"} >Married</option>
                                    <option value={"Divorced"} >Divorced</option>
                                    <option value={"Widowed"} >Widowed</option> */}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Relation</strong></label>
                          <select className='form-control'
                            name='relation' required>
                            <option value='' hidden>Select Relations</option>
                            {relationList?.map((item) => (
                              <option key={item._id} value={item.name} >{item.name}</option>
                            ))}
                            {/* <option value='Employee'>Employee</option>
                              <option value='Spouse'>Spouse</option>
                              <option value='Child'>Child</option> */}
                          </select>
                          {/* <input type="text" className="form-control" name="relation" placeholder="Enter Relation" autoComplete="off" required /> */}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Category</strong></label>
                          <select className='form-control' name='category' required>
                            <option value='' hidden>Select Category</option>
                            {categoryList?.map((item, index) => (
                              <option key={index} value={item.category_name}>{item.category_name}</option>
                            ))
                            }
                          </select>
                          {/* <input type="text" className="form-control" name="category" placeholder="Enter Category" autoComplete="off" required /> */}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Region</strong></label>
                          <select className='form-control' required name='regino'>
                            <option value='' hidden>Select Region</option>
                            {regionList?.map((item) => (
                              <option key={item._id} value={item.area_of_registration_name}>{item.area_of_registration_name}</option>
                            ))
                            }
                            {/* <option value={"Dubai"} >Dubai</option>
                            <option value={"Abu Dhabi"} >Abu Dhabi</option>
                            <option value={"Northern Emirates"} >Northern Emirates</option> */}
                          </select>
                          {/* <input type="text" className="form-control" name="regino" placeholder="Enter Region" autoComplete="off" required /> */}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>LSB</strong></label>
                          <select className='form-control' name='LSB'>
                            <option value={''} hidden>Select LSB</option>
                            {lsbList?.map((item) => (
                              <option key={item._id} value={item.medical_salary_range}>{item.medical_salary_range}</option>))
                            }
                          </select>
                          {/* <input type="text" className="form-control" name="LSB" placeholder="Enter LSB" autoComplete="off" required /> */}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Nationality</strong></label>
                          {/* <input type="text" className="form-control" name="nationality" placeholder="Enter Nationality" autoComplete="off" required /> */}
                          <select
                            className="form-control"
                            name='nationality'
                            required
                          >
                            <option value={""} hidden>Select Country</option>
                            {nationalityData.map((item, index) => (
                              <option key={index} value={item.nationality_name}>{item.nationality_name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Passport Number</strong></label>
                          <input type="text" className="form-control" name="passportNumber" placeholder="Enter Passport Number" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Eid Number</strong></label>
                          <input type="text" className="form-control" name="EidNumber" placeholder="Enter Eid Number" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Uid Number</strong></label>
                          <input type="text" className="form-control" name="UidNumber" placeholder="Enter Uid Number" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Visa Issued Location</strong></label>
                          <select
                            className='form-control' name='visaIssuedLocation'
                          >
                            <option value='' hidden>Select Visa Issued Location</option>
                            {visaLocations?.map((item, index) =>
                              <option key={index} value={item.area_of_registration_name}>{item.area_of_registration_name}</option>
                            )
                            }
                          </select>
                          {/* <input type="text" className="form-control" name="visaIssuedLocation" placeholder="Enter Visa Issued Location" autoComplete="off" required /> */}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Actual Salary Band</strong></label>
                          <select className='form-control' name='actualSalryBand'>
                            <option value={''} hidden>Select Actual Salary Band</option>
                            {salaryBandList?.map((item) => (
                              <option key={item._id} value={item.actual_salary_band}>{item.actual_salary_band}</option>))
                            }
                          </select>
                          {/* <input type="text" className="form-control" name="actualSalryBand" placeholder="Enter Actual Salary band" autoComplete="off" required /> */}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Person Commission</strong></label>
                          <input type="text" className="form-control" name="personCommission" placeholder="Enter Person Commission" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Residential Location</strong></label>
                          <select className='form-control' name='residentialLocation'>
                            <option value='' hidden>Select Residential Location</option>
                            {workLocationList?.map((item) => (
                              <option key={item._id} value={item.worklocation}>{item.worklocation}</option>
                            ))
                            }
                          </select>
                          {/* <input type="text" className="form-control" name="residentialLocation" placeholder="Enter Residential Location" autoComplete="off" required /> */}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Work location</strong></label>
                          <select className='form-control' name='workLocation' required>
                            <option value='' hidden>Select Work Location</option>
                            {workLocationList?.map((item) => (
                              <option key={item._id} value={item.worklocation}>{item.worklocation}</option>
                            ))
                            }
                          </select>
                          {/* <input type="text" className="form-control" name="workLocation" placeholder="Enter Work location" autoComplete="off" required /> */}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Mobile Number</strong></label>
                          <input type="number" className="form-control" name="phoneno" placeholder="Enter Mobile Number" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Email</strong></label>
                          <input type="Email" className="form-control" name="email" placeholder="Enter Email" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Photo File Name</strong></label>
                          <input type="text" className="form-control" name="photoFileName" placeholder="Enter Photo File Name" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Sponsor Type</strong></label>
                          <select className='form-control' name='sponsorType'>
                            <option value='' hidden>Select Sponsor Type</option>
                            {sponsorTypeList?.map((item) => (
                              <option key={item._id} value={item.sponsortype}>{item.sponsortype}</option>
                            ))
                            }
                          </select>
                          {/* <input type="text" className="form-control" name="sponsorType" placeholder="Enter Sponsor Type" autoComplete="off" required /> */}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Sponsor Id</strong></label>
                          <input type="text" className="form-control" name="sponsorId" placeholder="Enter Sponsor Id" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Sponsor Contact Number</strong></label>
                          <input type="number" className="form-control" name="sponsorContactNumber" placeholder="Enter Sponsor Contact Number" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Sponsor Contact Email</strong></label>
                          <input type="text" className="form-control" name="sponsorContactEmail" placeholder="Enter Sponsor Contact Email" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Occupation</strong></label>
                          <input type="text" className="form-control" name="occupation" placeholder="Enter Occupation" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Addition Effective Date</strong></label>
                          <input type="date" className="form-control" name="AdditionEffectiveDate" placeholder="Enter Addition Effective Date" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Visa File Number</strong></label>
                          <input type="text" className="form-control" name="visaFileNumber" placeholder="Enter Visa File Number" autoComplete="off" required />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label><strong>Birth Certificate Number</strong></label>
                          <input type="text" className="form-control" name="birthCertificateNumber" placeholder="Enter irth Certificate Number" autoComplete="off" required />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12" style={{ textAlign: 'right' }}>
                        <button type="submit" className="btn btn-primary">Save</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>


  )
}

export default AddMembermanually