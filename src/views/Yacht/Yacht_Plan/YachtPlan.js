import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import filePath from '../../../webroot/sample-files/Yacht-comprehensive-plans.fc9fd04c850aeb90acc3.xlsx';
import filePath1 from '../../../webroot/sample-files/Yacht-TPL-plans.fc9fd04c850aeb90acc3.xlsx';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';

const CompYachtPlan = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [uploadid, setUploadid] = useState('');
  const [viewfile, setViewfile] = useState('');
  const [file, setFile] = useState('');
  const [visible, setVisible] = useState(false);
  const [excelfile, setExcelfile] = useState("");
  const [yachtpermission, setYachtpermission] = useState([]);
  const [insurancecompany, setInsuranceCompany] = useState([]);
  const [planname, setPlanName] = useState('');
  const [status, setStatus] = useState(2);
  const [company, setCompany] = useState('');
  const [policytype, setPolicyType] = useState([]);
  const [selectedpolicytype, setSelectedPolicyType] = useState('');
  const [companiesPlans, setCompaniesPlans] = useState([])
  const [showMakeTable, setshowMaketable] = useState('')
  const [userLocations, setUserLocations] = useState('')
  const [limitedData, setLimitedShowData] = useState({})
  const [showLimitedModal, setShowLimitedModal] = useState(false)
  const [natureOfPlan, setNatureOfPlan] = useState([])
  const [planCategory, setPlanCategory] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getMotorPlans(page, perPage);
      getCompaniesPlans()
      const userdata = JSON.parse(localStorage.getItem('user'));
      let userLoc = userdata?.location?.map((itm) => itm.loc_id).join(',')
      setUserLocations(userLoc)
      const yacht_permission = userdata?.yacht_permission?.[0] || {};
      setYachtpermission(yacht_permission);
      getlistCompany();
      getpolicytypelist();
      NatureOfPlan()
      Plancategory()

    }
  }, []);
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

  useEffect(() => {
    getMotorPlans(page, perPage);
    getCompaniesPlans()
  }, [planname, status, company, selectedpolicytype]);

  const collectExceldata = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('xlFile', excelfile)
    let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/addBulkYachtPlan ",
      {
        method: "post",
        body: fd,
      });
    result = await result.json();
    setVisible(!visible)
    if (result.status === 200) {
      swal("Uploaded Succesfully", "", "success");
    } else {
      swal("Something Went Wrong", "", "failed");

    }
    getMotorPlans(page, perPage)
  }

  const getMotorPlans = (page, perPage) => {
    setPlans([]);
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getyachtplans?page=${page}&limit=${perPage}&name=${planname}&status=${status}&companyid=${company}&policy_type=${selectedpolicytype}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const total = data.totalCount;
        const slice = total / perPage;
        const pages = Math.ceil(slice);
        setPageCount(pages);
        setPlans(data.data);
      });
  }

  console.log(plans)

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getMotorPlans(selectedPage + 1, perPage);
  };

  const deactivatePlan = (id, status) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/updateStatusYachtPlan/${id}/${status}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            title: "Success!",
            text: data.message,
            icon: "success",
            button: false,
          })
          getCompaniesPlans()
          // getMotorPlans(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
        else {
          swal({
            title: "Error!",
            text: data.message,
            icon: "error",
            button: "Ok",
          }).then(() => {
            getCompaniesPlans()
            // getMotorPlans(page, perPage);
          });
        }
      });
  }

  const handlemodal = (id, policywording) => {
    setShowModal(true);
    setUploadid(id);
    setViewfile(policywording);
  }

  const handleFileuploads = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('policywordings_file', file);
    formData.append('id', uploadid);

    const requestOptions = {
      method: 'POST',
      body: formData,
    };

    await fetch("https://insuranceapi-3o5t.onrender.com/api/upload_Yacht_plan_policywordings_file", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

    setShowModal(false);
    swal({
      title: "Success!",
      text: "Policy Wordings File Uploaded Successfully",
      icon: "success",
      button: "Ok",
    })
  }

  const getlistCompany = () => {

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getCompany`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setInsuranceCompany(data.data);
      });
  }

  const getpolicytypelist = async () => {


    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_all_policiy_type`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setPolicyType(data.data);
      });
  }

  console.log(policytype, ">>>>")
  console.log(selectedpolicytype, ">>>>selectedpolicytype")


  const startFrom = (page - 1) * perPage;

  const deleteitem = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteYachtMaster?id=${id}&type=yachtplan`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          getMotorPlans(page, perPage);
          getCompaniesPlans()
          setTimeout(() => {
            swal.close()
          }, 1000);

        }
        else {
          swal({
            title: "Error!",
            text: data.message,
            icon: "error",
            button: "Ok",
          }).then(() => {
            getMotorPlans(page, perPage);
            getCompaniesPlans()
          });
        }
      });
  }
  const NatureOfPlan = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getNatureOfPlan`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setNatureOfPlan(data.data);
      });
  }
  const getCompaniesPlans = () => {

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getyachtCompaniesplans?name=${planname}&policy_typeId=${selectedpolicytype}&companyId=${company}&status=${status}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const modelmotordt = data.data;
        setCompaniesPlans(modelmotordt);
        console.log("Companies yacht plans >>>>>>>", modelmotordt)
      });
  }

  const yacht_plan_details = (id, company, type) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/yacht_plan_details/${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const resData = data.data
        const measurement_values = resData.measurement_value_or_topup;
        const measurement_value_obj = [];
        for (let i = 0; i < measurement_values.length; i++) {
          const measurement_val_objmin = measurement_values[i]['Min'];
          const measurement_val_objmax = measurement_values[i]['Max'];
          measurement_value_obj.push(measurement_val_objmin + '-' + measurement_val_objmax);
        }
        var m_v_names = measurement_value_obj.join(',');
        //
        const passenger_capacity = resData.passenger_capacity_or_topup;
        const passenger_capacity_obj = [];
        for (let i = 0; i < passenger_capacity.length; i++) {
          let passenger_capacity_obj1;
          if (passenger_capacity[i]['passenger_capacity_Min'] == passenger_capacity[i]['passenger_capacity_Max']) {
            passenger_capacity_obj1 = passenger_capacity[i]['passenger_capacity_Min'];
          }
          else {
            passenger_capacity_obj1 = passenger_capacity[i]['passenger_capacity_Min'] + '-' + passenger_capacity[i]['passenger_capacity_Max'];
          }
          passenger_capacity_obj.push(passenger_capacity_obj1);
        }
        var passenger_capacityValues = passenger_capacity_obj.join(',');
        //

        const dinghy_ten = resData?.dinghy_ten_value_range_or_topup;
        const dinghy_ten_obj = [];
        const din_ten_rate = []
        for (let i = 0; i < dinghy_ten.length; i++) {
          let dinghy_ten_obj1;
          if (dinghy_ten[i]['dinghy_tender_Min'] == dinghy_ten[i]['dinghy_tender_Max']) {
            dinghy_ten_obj1 = dinghy_ten[i]['dinghy_tender_Min'];
          }
          else {
            dinghy_ten_obj1 = dinghy_ten[i]['dinghy_tender_Min'] + '-' + dinghy_ten[i]['dinghy_tender_Max'];
          }
          dinghy_ten_obj.push(dinghy_ten_obj1);
          din_ten_rate.push(dinghy_ten[i]?.rate)
        }
        var dinghy_tenValues = dinghy_ten_obj.join(',');
        var din_Rate = din_ten_rate?.join(",")
        //
        const hull_and_eqp = resData?.hull_and_equipment_value_range_or_topup;
        const hull_and_eqp_obj = [];
        const rateARr = [];
        for (let i = 0; i < hull_and_eqp.length; i++) {
          let hull_and_eqp_obj1;
          if (hull_and_eqp[i]['hull_equipment_Min'] == hull_and_eqp[i]['hull_equipment_Max']) {
            hull_and_eqp_obj1 = hull_and_eqp[i]['hull_equipment_Min'];
          }
          else {
            hull_and_eqp_obj1 = hull_and_eqp[i]['hull_equipment_Min'] + '-' + hull_and_eqp[i]['hull_equipment_Max'];
          }
          hull_and_eqp_obj.push(hull_and_eqp_obj1);
          rateARr.push(hull_and_eqp[i]['rate']);
        }
        var hull_and_eqpValues = hull_and_eqp_obj?.join(',');
        var rateArr = rateARr?.join(',');
        //
        const yacht_speed_knot = resData?.yacht_speed_knot_type_or_topup;

        const speedknotValues = []
        for (let i = 0; i < yacht_speed_knot.length; i++) {
          speedknotValues.push(yacht_speed_knot[i].min + "-" + yacht_speed_knot[i].max)

        }
        var s_k_values = speedknotValues.join(",")
        let body_type_values = ''
        if (type == 'comprehensive') {
          body_type_values = resData?.yacht_body_type_or_topup?.map((body) => body.yacht_body_type)?.join(", ")
        } else if (type == 'tpl') {
          const y_b_type = resData.yacht_body_type_or_topup;
          const body_type_obj = [];
          for (let i = 0; i < y_b_type.length; i++) {
            body_type_obj.push({
              _id: y_b_type[i]['_id'],
              yacht_body_type: y_b_type[i]['yacht_body_type'],
            });
          }
          function removeDuplicateObjects(array, key) {
            const seen = new Set();
            return array.filter((item) => {
              const keyValue = item[key];
              if (!seen.has(keyValue)) {
                seen.add(keyValue);
                return true;
              }
              return false;
            });
          }
          const uniqueBodyTypes = removeDuplicateObjects(body_type_obj, 'yacht_body_type');
          body_type_values = uniqueBodyTypes?.map((body) => body.yacht_body_type)?.join(", ")
        }
        let nature_of_plan = natureOfPlan?.find((item) => item._id == data.data?.nature_of_plan_id)
        let PlanCategory = planCategory?.find((item) => item._id == data.data?.plan_category_id)
        const limitObj = {
          insurancecompany: company,
          plan_name: data.data?.plan_name,
          plan_categroy: PlanCategory?.plan_category_name,
          nature_of_plan: nature_of_plan.nature_of_plan_name,
          plan_for: resData?.plan_for?.map((plan) => plan.plan_for_name)?.join(', '),
          business_type: resData?.business_type?.map((bt) => bt.business_type_name)?.join(', '),
          hull_eq_Value: hull_and_eqpValues,
          hull_eq_Value_rate: rateArr,
          dighy_range: dinghy_tenValues,
          dinghy_rate: din_Rate,
          body_type: body_type_values,
          hull_material: resData?.yacht_hull_material_or_topup?.map((hull) => hull.yacht_hull_material)?.join(', '),
          engine_type: resData?.yacht_engine_type_or_topup?.map((engine) => engine.yacht_engine_type)?.join(", "),
          boat_length: m_v_names,
          boat_breadth: resData?.yacht_breadth_value_or_topup?.map((breadth) => breadth.name)?.join(', '),
          speed_knot: s_k_values,
          passenger_capacity: passenger_capacityValues,
          type: type
        }
        setLimitedShowData(limitObj)
      });
    setShowLimitedModal(true)

  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-6">
                  <h4 className="card-title">Yacht Plans</h4>
                </div>
                {/* <div className="col-md-12">
                  { yachtpermission.yacht_plan?.includes('upload') ?
                  <button className="btn btn-primary" style={{marginLeft:'4px'}} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                  : '' }
                  { yachtpermission.yacht_plan?.includes('download') ?
                  <a className="btn btn-primary" style={{marginLeft:'4px'}} href={filePath} download>Download Comprehensive Yacht Plan Sample File</a>
                  : '' }
                  { yachtpermission.yacht_plan?.includes('download') ?
                  <a className="btn btn-primary" style={{marginLeft:'4px'}} href={filePath1} download>Download Third Party Yacht Plan Sample File</a>
                  : '' }
                </div>
                <br />
                <br /> */}
                <div className="col-md-6">
                  {yachtpermission.yacht_plan?.includes('create') ?
                    <a href="/Addyachtplan" className="btn btn-primary" style={{ float: "right", marginLeft: '4px' }}>Add Comprehensive Yacht Plan</a>
                    : ''}
                  {yachtpermission.yacht_plan?.includes('create') ?
                    <a href="/AddTPLyachtplan" className="btn btn-primary" style={{ float: "right", marginLeft: '4px' }}>Add Third Party Yacht Plan</a>
                    : ''}
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="card-header">
                <div className="col-md-12" style={{ textAlign: 'right' }}>

                  {yachtpermission.yacht_plan?.includes('download') ?
                    <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginLeft: '4px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Comprehensive Yacht Plan Sample File</a>

                    : ''}
                  {yachtpermission.yacht_plan?.includes('download') ?
                    <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginLeft: '4px' }} href={filePath1} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Third Party Motor Plan Sample File</a>

                    : ''}
                  {yachtpermission.yacht_plan?.includes('upload') ?
                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginLeft: '4px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>

                    : ''}
                </div>
              </div>
              <Accordion defaultActiveKey="0" >
                <Accordion.Item eventKey="0">
                  <Accordion.Header className='modifyaccordian'>Filters </Accordion.Header>
                  <Accordion.Body>

                    <div className='card-header'>
                      <div className='row'>
                        <div className='col-lg-3'>
                          <label><strong>Plan Name</strong></label><br />
                          <input type="text" className="form-control" placeholder="Search Plan" onChange={(e) => setPlanName(e.target.value)} />

                        </div>
                        <div className='col-lg-3'>
                          <label><strong>Select Insurance co.</strong></label><br />
                          <select className="form-control" onChange={(e) => setCompany(e.target.value)}>
                            <option value="" hidden >Select Insurance co.</option>
                            <option value="">-- All --</option>

                            {insurancecompany.map((item, index) => (
                              <option key={index} value={item._id}>{item.company_name}</option>
                            ))}
                          </select>
                        </div>
                        <div className='col-lg-3'>
                          <label><strong>Select Policy Type (TPL or comprehensive)</strong></label><br />
                          <select
                            className='form-control'
                            value={selectedpolicytype}
                            onChange={(e) => setSelectedPolicyType(e.target.value)}
                          >
                            <option value="">-- All --</option>
                            {policytype?.map((item, index) => (
                              <option key={index} value={item._id}>{item.policy_type_name}</option>
                            ))}
                          </select>
                        </div>
                        <div className='col-lg-3'>
                          <label><strong>Select Status</strong></label><br />
                          <select className="form-control" onChange={(e) => setStatus(e.target.value)}>
                            <option value={2}>-- All --</option>
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <div className="card-body">
                <div className="table-responsive">
                  {/* <table className="table table-bordered">
                    <thead className="thead-dark">
                      <tr className="table-info">
                        <th>Sr No.</th>
                        <th>Policy Type</th>
                        <th>Company Name</th>
                        <th>Plan Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody> */}
                  {/* {
                        plans.map((plan, index) => (
                          <tr key={index}>
                            <td>{startFrom + index + 1}</td>
                            <td>{plan.policy_type[0]['policy_type_name']}</td>
                            <td>{plan.company[0]['company_name']}</td>
                            {plan.status === 1 ?
                              <td style={{ color: "green" }}>{plan.plan_name}</td>
                              :
                              <td style={{ color: "red" }}>{plan.plan_name}</td>
                            }
                            <td>
                              {yachtpermission.yacht_plan?.includes('edit') && (
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  {plan.policy_type_id == "641161a4591c2f02bcddf51c" ? (
                                    <a href={`/EditYachtPlan?id=${plan._id}`} className="btn btn-primary">Edit</a>
                                  ) : (
                                    <a href={`/EditTPLYachtPlan?id=${plan._id}`} className="btn btn-primary">Edit</a>
                                  )}
                                </div>
                              )}
                              {' '}
                              {yachtpermission.yacht_plan?.includes('delete') && (
                                <>
                                  {
                                    plan.status === 1 ?
                                      <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(plan._id, 0) }}>Deactivate</button></div> :
                                      <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(plan._id, 1) }}>Activate</button></div>
                                  }
                                </>
                              )}
                              {' '}
                              {yachtpermission.yacht_plan?.includes('edit') && (
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <button className="btn btn-success" onClick={() => handlemodal(plan._id, plan.policywordings_file)}>T & C</button>
                                </div>
                              )}
                              {' '}
                              {yachtpermission.yacht_plan?.includes('edit') && (
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewStandardCover?id=${plan._id}&type=yacht`} className="btn btn-info">Standard Cover</a>
                                </div>
                              )}
                              {' '}
                              {yachtpermission.yacht_plan?.includes('edit') && (
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewAdditionalCover?id=${plan._id}&type=yacht`} className="btn btn-warning">Additional Cover</a>
                                </div>
                              )}
                              {' '}
                              {yachtpermission.yacht_plan?.includes('edit') && (
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/YachtCondition?id=${plan._id}&type=yacht`} className="btn btn-secondary">Conditions</a>
                                </div>)}
                              {' '}
                              {yachtpermission.yacht_plan?.includes('edit') && (
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/BlacklistYacht?id=${plan._id}&type=yacht`} className="btn btn-secondary">Black Listed Yacht</a>
                                </div>)}
                              {' '}

                              {yachtpermission.yacht_plan?.includes('delete') && (
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteitem(plan._id) }}>Delete</button>
                                </div>
                              )}

                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table> */}
                  {companiesPlans?.map((itm1, indx) =>
                    <div className='col-md-12' key={indx}>
                      <h6
                        className='text-primary'
                      > {itm1?._id != showMakeTable ?
                        <button onClick={() => setshowMaketable(itm1?._id)}
                          className='btn btn-success text-light'><i className='fa fa-angle-right'></i></button> :
                        <button className='btn btn-success text-light' onClick={() => setshowMaketable('')}><i className='fa fa-angle-down'></i></button>} {itm1?.company_name}</h6>

                      {/*Comprehensive plans from here*/}

                      {itm1?._id == showMakeTable && itm1?.comprehensive_plans?.map((plan, planindex) =>
                        <tr key={planindex}>
                          {planindex == 0 ? <div className='mx-4 d-flex'>
                            <button className='btn btn-success btn-sm text-light'>
                              <i className='fa fa-check'></i>
                            </button> <h6 className='mx-2 text-danger'>Comprehensive</h6></div> : ''}

                          {userLocations.includes(plan?.plan_created_by) || userLocations.includes('64116415591c2f02bcddf51e') ?
                            <div className='d-flex col-md-12 my-1' style={{ marginLeft: '30px' }} >
                              <div className='mx-3'>
                                <button className='btn btn-success btn-sm text-white'><i className='fa fa-check'></i></button>
                              </div>                            <div className=' col-md-1 mx-1 my-1' style={{ fontWeight: '700', color: 'red', }}>
                                {plan?.plan_name?.slice(0, 15)}{plan?.plan_name?.length > 15 ? '....' : ''}</div>
                              <div className='table-responsive'>
                                {yachtpermission.yacht_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    {plan.policy_type_id == "641161a4591c2f02bcddf51c" ? (
                                      <a href={`/EditYachtPlan?id=${plan._id}`} className="btn btn-primary">Edit</a>
                                    ) : (
                                      <a href={`/EditTPLYachtPlan?id=${plan._id}`} className="btn btn-primary">Edit</a>
                                    )}
                                  </div>
                                )}
                                {' '}
                                {yachtpermission.yacht_plan?.includes('delete') && (
                                  <>
                                    {
                                      plan.status === 1 ?
                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(plan._id, 0) }}>Deactivate</button></div> :
                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(plan._id, 1) }}>Activate</button></div>
                                    }
                                  </>
                                )}
                                {' '}
                                {yachtpermission.yacht_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-success" onClick={() => handlemodal(plan._id, plan.policywordings_file)}>T & C</button>
                                  </div>
                                )}
                                {' '}
                                {yachtpermission.yacht_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewStandardCover?id=${plan._id}&type=yacht`} className="btn btn-info">Standard Cover</a>
                                  </div>
                                )}
                                {' '}
                                {yachtpermission.yacht_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewAdditionalCover?id=${plan._id}&type=yacht`} className="btn btn-warning">Additional Cover</a>
                                  </div>
                                )}
                                {' '}
                                {yachtpermission.yacht_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/YachtCondition?id=${plan._id}&type=yacht`} className="btn btn-secondary">Conditions</a>
                                  </div>)}
                                {' '}
                                {yachtpermission.yacht_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/BlacklistYacht?id=${plan._id}&type=yacht`} className="btn btn-secondary">Black Listed Yacht</a>
                                  </div>)}
                                {' '}

                                {yachtpermission.yacht_plan?.includes('delete') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteitem(plan._id) }}>Delete</button>
                                  </div>
                                )}

                              </div>
                            </div> : <div className='d-flex col-md-12 my-1' style={{ marginLeft: '30px' }}>
                              <div className='mx-3'>
                                <button className='btn btn-success btn-sm text-white'>
                                  <i className='fa fa-check'></i></button>
                              </div>
                              <div className=' col-md-3 mx-1 my-1' style={{ fontWeight: '700', color: 'red', }}>
                                {plan?.plan_name?.slice(0, 15)}{plan?.plan_name?.length > 15 ? '....' : ''}
                              </div>
                              <div className='col-md-3'><button className='btn btn-primary' onClick={() => yacht_plan_details(plan._id, itm1?.company_name, 'comprehensive')}>View</button></div>
                            </div>}
                        </tr>
                      )
                      }

                      {/*Third party plans from here*/}

                      {itm1?._id == showMakeTable && itm1?.tpl_plans?.map((plan, planindex) =>
                        <tr key={planindex}>

                          {planindex == 0 ? <div className='mx-4 d-flex'><button className='btn btn-success btn-sm text-light'>
                            <i className='fa fa-check'></i>
                          </button> <h6 className='mx-2 text-danger'>Third Party Liability (TPL)</h6></div> : ''}
                          {userLocations.includes(plan?.plan_created_by) || userLocations.includes('64116415591c2f02bcddf51e') ?
                            <div className='d-flex col-md-12 my-1' style={{ marginLeft: '30px' }} >
                              <div className='mx-3'>
                                <button className='btn btn-success btn-sm text-white'><i className='fa fa-check'></i></button>
                              </div>                            <div className=' col-md-1 mx-1 my-1' style={{ fontWeight: '700', color: 'red', }}>
                                {plan?.plan_name?.slice(0, 15)}{plan?.plan_name?.length > 15 ? '....' : ''}</div>
                              <div className='table-responsive'>
                                {yachtpermission.yacht_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    {plan.policy_type_id == "641161a4591c2f02bcddf51c" ? (
                                      <a href={`/EditYachtPlan?id=${plan._id}`} className="btn btn-primary">Edit</a>
                                    ) : (
                                      <a href={`/EditTPLYachtPlan?id=${plan._id}`} className="btn btn-primary">Edit</a>
                                    )}
                                  </div>
                                )}
                                {' '}
                                {yachtpermission.yacht_plan?.includes('delete') && (
                                  <>
                                    {
                                      plan.status === 1 ?
                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(plan._id, 0) }}>Deactivate</button></div> :
                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(plan._id, 1) }}>Activate</button></div>
                                    }
                                  </>
                                )}
                                {' '}
                                {yachtpermission.yacht_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-success" onClick={() => handlemodal(plan._id, plan.policywordings_file)}>T & C</button>
                                  </div>
                                )}
                                {' '}
                                {yachtpermission.yacht_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewStandardCover?id=${plan._id}&type=yacht`} className="btn btn-info">Standard Cover</a>
                                  </div>
                                )}
                                {' '}
                                {yachtpermission.yacht_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewAdditionalCover?id=${plan._id}&type=yacht`} className="btn btn-warning">Additional Cover</a>
                                  </div>
                                )}
                                {' '}
                                {yachtpermission.yacht_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/YachtCondition?id=${plan._id}&type=yacht`} className="btn btn-secondary">Conditions</a>
                                  </div>)}
                                {' '}
                                {yachtpermission.yacht_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/BlacklistYacht?id=${plan._id}&type=yacht`} className="btn btn-secondary">Black Listed Yacht</a>
                                  </div>)}
                                {' '}

                                {yachtpermission.yacht_plan?.includes('delete') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteitem(plan._id) }}>Delete</button>
                                  </div>
                                )}
                              </div>
                            </div> : <div className='d-flex my-1' style={{ marginLeft: '30px' }}>
                              <div className='mx-3'>
                                <button className='btn btn-success btn-sm text-white'><i className='fa fa-check'></i></button>
                              </div>
                              <div className=' col-md-3 mx-1 my-1' style={{ fontWeight: '700', color: 'red', }}>
                                {plan?.plan_name?.slice(0, 15)}{plan?.plan_name?.length > 15 ? '....' : ''}
                              </div>
                              <div className='col-md-3 table-responsive'>
                                <button className='btn btn-primary'
                                  onClick={() => yacht_plan_details(plan._id, itm1?.company_name, 'tpl')}>View</button></div>
                            </div>}
                        </tr>
                      )
                      }
                      <hr />
                    </div>)}
                  {/* <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-end"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="name">Policy Wordings/T&C</label>
                  <input type="file" className="form-control" id="file" name="file" onChange={(event) => setFile(event.target.files[0])} />
                </div>
              </div>
              {viewfile == '' || viewfile == null
                || viewfile == undefined ||
                viewfile == 'undefined' || viewfile.length == 0 ?
                "" :
                <div className="col-md-6">
                  <a className="btn btn-warning" href={`https://insuranceapi-3o5t.onrender.com/uploads/${viewfile}`} style={{ position: 'relative', top: '23px' }} rel="noreferrer" target='_blank'>view</a>
                </div>
              }
            </Row>
          </Container>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleFileuploads}>
            Upload
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Upload Excel File</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div >
            <input type="file" className="form-control" id="DHA" defaultValue="" required
              onChange={(e) => setExcelfile(e.target.files[0])} />
          </div>

        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={collectExceldata} href={'/motor-make'}>Upload</CButton>
        </CModalFooter>
      </CModal>
      <CModal size='lg' alignment="center" visible={showLimitedModal} onClose={() => setShowLimitedModal(false)}>
        <CModalHeader onClose={() => setShowLimitedModal(false)}>
          <CModalTitle>Yacht Plan Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className='row'>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className='text-danger'>Insurance Company Name</label>
                <input type='text' className='form-control' value={limitedData?.insurancecompany} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className='text-danger'>Plan Name</label>
                <input type='text' className='form-control' value={limitedData?.plan_name} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className='text-danger'>Plan Category</label>
                <input type='text' className='form-control' value={limitedData?.plan_categroy} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className='text-danger'>Nature of Plan</label>
                <input type='text' className='form-control' value={limitedData?.nature_of_plan} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className='text-danger'>Plan For</label>
                <input type='text' className='form-control' value={limitedData?.plan_for} />
              </div>
            </div>
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Business Type</label>
                <textarea rows={2} type='text' className='form-control' value={limitedData?.business_type} />
              </div>
            </div>
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>HULL AND EQUIPMENT VALUE RANGE</label>
                <input type='text' className='form-control' value={limitedData?.hull_eq_Value} />
              </div>
            </div>
            {limitedData.type == 'comprehensive' ? <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>HULL AND EQUIPMENT VALUE RATE</label>
                <input type='text' className='form-control' value={limitedData?.hull_eq_Value_rate} />
              </div>
            </div> : ''}
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>DINGHY/TENDER VALUE RANGE RANGE</label>
                <input type='text' className='form-control' value={limitedData?.dighy_range} />
              </div>
            </div>
            {limitedData.type == 'comprehensive' ? <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>DINGHY/TENDER VALUE RANGE RATE</label>
                <input type='text' className='form-control' value={limitedData?.dinghy_rate} />
              </div>
            </div> : ''}
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Body Type</label>
                <textarea rows={2} type='text' className='form-control' value={limitedData?.body_type} />
              </div>
            </div>
            {limitedData.type == 'tpl' ?
              <div className='col-md-6'>
                <div className="form-group mb-3">
                  <label className='text-danger'>Hull Material</label>
                  <input type='text' className='form-control' value={limitedData.hull_material} />
                </div>
              </div> : ''}
            {limitedData.type == 'tpl' ?
              <div className='col-md-6'>
                <div className="form-group mb-3">
                  <label className='text-danger'>Engine Type</label>
                  <input type='text' className='form-control' value={limitedData?.engine_type} />
                </div>
              </div> : ''}
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Boat Length</label>
                <input type='text' className='form-control' value={limitedData?.boat_length} />
              </div>
            </div>
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Speed Knot</label>
                <input type='text' className='form-control' value={limitedData?.speed_knot} />
              </div>
            </div>
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Passenger Capacity</label>
                <input type='text' className='form-control' value={limitedData?.passenger_capacity} />
              </div>
            </div>
          </div>

        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowLimitedModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default CompYachtPlan