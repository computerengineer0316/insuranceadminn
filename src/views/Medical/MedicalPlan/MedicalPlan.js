import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import planfilePath from '../../../webroot/sample-files/Medical-Plan-sample-sheet.xlsx';

const MedicalPlan = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [uploadid, setUploadid] = useState('');
  const [viewfile, setViewfile] = useState('');
  const [file, setFile] = useState('');
  const [status, setStatus] = useState(2);
  const [visible, setVisible] = useState(false);
  const [excelfile, setExcelfile] = useState("");
  const [medicalpermission, setMedicalPermission] = useState([]);
  const [planname, setPlanName] = useState([]);
  const [selectedcompany, setSelectedCompany] = useState('');
  const [insurancecompany, setInsuranceCompany] = useState([]);
  const [companiesPlans, setCompaniesPlans] = useState([])
  const [showMakeTable, setshowMaketable] = useState('')
  const [userLocations, setUserLocations] = useState('')
  const [limitedData, setLimitedShowData] = useState({})
  const [showLimitedModal, setShowLimitedModal] = useState(false)
  const [rbonAge, setRBOA] = useState()
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getMedicalPlans(page, perPage);
      getCompaniesPlans()

      const userdata = JSON.parse(localStorage.getItem('user'));
      let userLoc = userdata?.location?.map((itm) => itm.loc_id).join(',')
      setUserLocations(userLoc)
      const motor_permission = userdata?.motor_permission?.[0] || {};
      setMedicalPermission(motor_permission);
      getlistCompany();
    }
  }, [planname, status, selectedcompany]);

  const getMedicalPlans = (page, perPage) => {
    setPlans([]);
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getmedicalplans?page=${page}&limit=${perPage}&name=${planname}&status=${status}&company=${selectedcompany}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const total = data?.total;
        const slice = total / perPage;
        const pages = Math.ceil(slice);
        setPageCount(pages);
        // console.log(data.data, "data");

        setPlans(data.data);
      });
  }

  const deactivatePlan = (id, status) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/updatestatusMedicalPlan/${id}/${status}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            title: "Success!",
            text: data.message,
            icon: "success",
            button: false,
          })
        }
        else {
          swal({
            title: "Error!",
            text: data.message,
            icon: "error",
            button: false,
          })
        }
        // getMedicalPlans(page, perPage);
        getCompaniesPlans()
        setTimeout(() => {
          swal.close()
        }, 1000);
      });
  }

  const handlemodal = (id, policywording) => {
    setShowModal(true);
    setUploadid(id);
    setViewfile(policywording);
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getMedicalPlans(selectedPage + 1, perPage);
  };

  const handleFileuploads = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('policywordings_file', file);
    formData.append('id', uploadid);

    const requestOptions = {
      method: 'POST',
      body: formData,
    };

    await fetch("https://insuranceapi-3o5t.onrender.com/api/upload_medical_plan_policywordings_file", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

    setShowModal(false);
    swal({
      title: "Success!",
      text: "Policy Wordings File Uploaded Successfully",
      icon: "success",
      button: false,
    })
  }
  const collectExceldata = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('xlFile', excelfile)
    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/add_bulk_Medical_plan`,
      {
        method: "post",
        body: fd,
      });
    result = await result.json();
    setVisible(!visible)
    if (result.status === 200) {
      swal({
        text: result.message,
        icon: "success",
        button: false,
      })
    } else {
      swal({
        title: "Error!",
        text: "Failed to upload excel file",
        icon: "error",
        button: false,
      })
    }
    getMedicalPlans(page, perPage);
    setTimeout(() => {
      swal.close()
    }, 1000);

  }
  const deleteItem = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMedicalMaster/?id=${id}&type=medicalplan`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          // getMedicalPlans(page, perPage);
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
            button: false,
          })
          // getMedicalPlans(page, perPage);
          getCompaniesPlans()
          setTimeout(() => {
            swal.close()
          }, 1000);
        }

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
  const getCompaniesPlans = () => {

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getplansAccordingToCompanies?lob=medical&name=${planname}&companyId=${selectedcompany}&status=${status}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const modelmotordt = data.data;
        setCompaniesPlans(modelmotordt);
        console.log("Companies medical plans >>>>>>>", modelmotordt)
      });

  }
  const get_medical_plan_Details = (id, company) => {
    setRBOA()
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getlimitedDataOfMedicalPlan?id=${id}`, requestOptions)
      .then(response => response.json())
      .then((data) => {
        const resData = data.data[0]
        console.log(resData, " >>>>>>>>>>>>>>>> data.dtaa")
        const limitObj = {
          insurancecompany: company,
          plan_name: resData?.plan_name,
          nature_of_plan: resData?.natureofplans,
          plan_condition: resData?.plan_condition?.map((condition) => condition.medical_plan_condition),
          medical_salary_range: resData?.salary_range?.map((range) => range.medical_salary_range),
          ratesBasedOnAge: resData.ratesBasedOnAge
        }
        setLimitedShowData(limitObj)
      })
    setShowLimitedModal(true)
  }
  const startFrom = (page - 1) * perPage;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-4">
                  <h4 className="card-title">Medical Plans</h4>
                </div>
                <div className="col-md-8">
                  <a href="/addmedicalplan" className="btn btn-primary" style={{ float: "right" }}>Add Medical Plan</a>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="card-header">
                <div className="col-md-12" style={{ textAlign: 'right' }}>
                  <a className="btn btn-dark btn-sm btn-icon-text m-r-10" href={planfilePath} style={{ backgroundColor: "green", marginLeft: '4px' }} download>Download Medical Plan Sample File</a>
                  <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginLeft: '4px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                </div>
              </div>
              <Accordion defaultActiveKey="0" >
                <Accordion.Item eventKey="0">
                  <Accordion.Header className='modifyaccordian'>Filters </Accordion.Header>
                  <Accordion.Body>

                    <div className='card-header'>
                      <div className='row'>
                        <div className='col-lg-3'>
                          <label><strong>Select Insurance co.</strong></label><br />
                          <select
                            className='form-control'
                            value={selectedcompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                          >
                            <option value="">-- All --</option>
                            {insurancecompany?.map((item, index) => (
                              <option key={index} value={item._id}>{item.company_name}</option>
                            ))}

                          </select>
                        </div>
                        <div className='col-lg-3'>
                          <label><strong>Plan Name</strong></label><br />
                          <input type="text" className="form-control" placeholder="Search Plan" onChange={(e) => setPlanName(e.target.value)} />
                        </div>
                        <div className='col-lg-3'>
                          <label><strong>Select Status</strong></label><br />
                          <select className='form-control'
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value={2}>-- All --</option>
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                          </select>
                        </div>
                        {/* <div className='col-lg-3'>
                  <label><strong>Select Plan Category(Basic/Enhanced etc)</strong></label><br />
                  <select className='form-control'
                    value={selectedplan_category}
                    onChange={(e) => setSelectedPlanCategory(e.target.value)}
                  >
                    <option value=''>-- All --</option>
                    {plan_category?.map((item, index) => (
                      <option key={index} value={item._id}>{item.plan_category_name}</option>
                    ))}
                    
                  </select>
                </div> */}
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <div className="card-body">
                <div className="table-responsive">
                  {/* <table className="table table-bordered yatchplanss123"> */}
                  {/* <thead className="thead-dark">
                      <tr className="table-info">
                        <th>Sr No.</th>
                        <th>Company Name</th>
                        <th>plan Name</th>
                        <th>Action</th>
                      </tr>
                    </thead> */}
                  {/* <tbody>
                      {
                        plans && plans.length > 0 ?
                          plans.map((item, index) => (

                            <tr key={index}>
                              <td>{startFrom + index + 1}</td>
                              <td>{item.company[0]?.company_name}</td>
                              <td className={item.status == 1 ? 'text-success' : 'text-danger'}>{item.plan_name}</td>
                              <td>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/EditMedicalPlan?id=${item._id}`} className="btn btn-primary">Edit</a>
                                </div>&nbsp;&nbsp;
                                {
                                  item.status === 1 ?
                                    <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger"
                                      onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(item._id, 0) }}
                                    >Deactivate</button></div> :
                                    <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success"
                                      onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(item._id, 1) }}
                                    >Activate</button></div>
                                }&nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewRatesBasedOnAge?id=${item._id}`} className="btn btn-info">Rates Based On Age</a>
                                </div>
                                &nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/viewBMI?id=${item._id}`} className="btn btn-warning">Add BMI</a>
                                </div>&nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/viewStandardConditions?id=${item._id}`} className="btn btn-primary">Additional Condition</a>
                                </div>
                                &nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewmedicalGeneralUnderwriting?id=${item._id}`} className="btn btn-dark">Health Questionnaire</a>
                                </div>
                                &nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewUnderwritingConditions?id=${item._id}`} className="btn btn-success">Underwriting Condition</a>
                                </div>
                                &nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/MaternityConditions?id=${item._id}`} className="btn btn-info">Maternity Condition</a>
                                </div>
                                &nbsp;&nbsp; */}
                  {/* <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/viewAdditionalConditions?id=${item._id}`} className="btn btn-warning">Additional Underwriting Condition</a>
                                </div> */}
                  {/* &nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewStandardCover?id=${item._id}&type=medical`} className="btn btn-primary">Standard Cover</a>
                                </div>
                                &nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewAdditionalCover?id=${item._id}&type=medical`} className="btn btn-dark">Additional Cover</a>
                                </div>&nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <button className="btn btn-success"
                                    onClick={() => handlemodal(item._id, item.policywordings_file)}
                                  >T & C</button>
                                </div>&nbsp;&nbsp; */}
                  {/* <div className="btn-group" role="group" aria-label="Basic example"> 
                            <a href={`/viewMedicalBenefits?id=${item._id}`} className="btn btn-warning">Medical Benifits</a>
                          </div>
                          &nbsp;&nbsp; */}


                  {/* <div className="btn-group" role="group" aria-label="Basic example">
                                  <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                </div>


                              </td>
                            </tr>
                          )) : <tr><td colSpan="5">No data found</td></tr>}
                    </tbody>
                  </table> */}
                  {companiesPlans?.map((itm1, indx) =>
                    <div className='col-md-12' key={indx}>
                      <h6
                        className='text-danger'
                      > {itm1?._id?._id != showMakeTable ?
                        <button onClick={() => setshowMaketable(itm1?._id?._id)}
                          className='btn btn-success text-light'><i className='fa fa-angle-right'></i></button> :
                        <button className='btn btn-success text-light' onClick={() => setshowMaketable('')}><i className='fa fa-angle-down'></i></button>} {itm1?._id?.company_name}</h6>



                      {itm1?._id?._id == showMakeTable && itm1?.plans?.map((item, planindex) =>
                        <tr key={planindex}>
                          {userLocations.includes(item?.plan_created_by) || userLocations.includes('64116415591c2f02bcddf51e') ?
                            <div className='d-flex my-1' style={{ marginLeft: '30px' }} >
                              <div className='mx-3'>
                                <button className='btn btn-success btn-sm text-white'><i className='fa fa-check'></i></button>
                              </div>                            <div className=' col-md-1 mx-1 my-1' style={{ fontWeight: '700', color: 'red', }}>
                                {item?.plan_name?.slice(0, 15)}{item?.plan_name?.length > 15 ? '....' : ''}</div>
                              <div className='table-responsive'>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/EditMedicalPlan?id=${item._id}`} className="btn btn-primary">Edit</a>
                                </div>&nbsp;&nbsp;
                                {
                                  item.status === 1 ?
                                    <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger"
                                      onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(item._id, 0) }}
                                    >Deactivate</button></div> :
                                    <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success"
                                      onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(item._id, 1) }}
                                    >Activate</button></div>
                                }&nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewRatesBasedOnAge?id=${item._id}`} className="btn btn-info">Rates Based On Age</a>
                                </div>
                                &nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/viewBMI?id=${item._id}`} className="btn btn-warning">Add BMI</a>
                                </div>&nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/viewStandardConditions?id=${item._id}`} className="btn btn-primary">Additional Condition</a>
                                </div>
                                &nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewmedicalGeneralUnderwriting?id=${item._id}`} className="btn btn-dark">Health Questionnaire</a>
                                </div>
                                &nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewUnderwritingConditions?id=${item._id}`} className="btn btn-success">Underwriting Condition</a>
                                </div>
                                &nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/MaternityConditions?id=${item._id}`} className="btn btn-info">Maternity Condition</a>
                                </div>
                                &nbsp;&nbsp;
                                {/* <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/viewAdditionalConditions?id=${item._id}`} className="btn btn-warning">Additional Underwriting Condition</a>
                                </div> */}
                                &nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewStandardCover?id=${item._id}&type=medical`} className="btn btn-primary">Standard Cover</a>
                                </div>
                                &nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewAdditionalCover?id=${item._id}&type=medical`} className="btn btn-dark">Additional Cover</a>
                                </div>&nbsp;&nbsp;
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <button className="btn btn-success"
                                    onClick={() => handlemodal(item._id, item.policywordings_file)}
                                  >T & C</button>
                                </div>&nbsp;&nbsp;
                                {/* <div className="btn-group" role="group" aria-label="Basic example"> 
                            <a href={`/viewMedicalBenefits?id=${item._id}`} className="btn btn-warning">Medical Benifits</a>
                          </div>
                          &nbsp;&nbsp; */}


                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                </div>
                              </div>
                            </div>

                            :
                            <div className='d-flex col-md-12 my-1' style={{ marginLeft: '30px' }}>
                              <div className='mx-3'>
                                <button className='btn btn-success btn-sm text-white'>
                                  <i className='fa fa-check'></i></button>
                              </div>
                              <div className=' col-md-3 mx-1 my-1' style={{ fontWeight: '700', color: 'red', }}>
                                {item?.plan_name?.slice(0, 15)}{item?.plan_name?.length > 15 ? '....' : ''}
                              </div>
                              <div className='col-md-3'><button className='btn btn-primary'
                                onClick={() => get_medical_plan_Details(item?._id, itm1?._id?.company_name)}
                              >View</button></div>
                            </div>
                          }
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
          <CButton color="primary" onClick={collectExceldata}>Upload</CButton>
        </CModalFooter>
      </CModal>
      <CModal size='lg' alignment="center" visible={showLimitedModal} onClose={() => setShowLimitedModal(false)}>
        <CModalHeader onClose={() => setShowLimitedModal(false)}>
          <CModalTitle>Travel Plan Details</CModalTitle>
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
                <label className='text-danger'>Nature of Plan</label>
                <input type='text' className='form-control' value={limitedData?.nature_of_plan} />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className='text-danger'>Plan Condition</label>
                <input type='text' className='form-control' value={limitedData?.plan_condition} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className='text-danger'>Medical Salary Range</label>
                <input type='text' className='form-control' value={limitedData?.medical_salary_range} />
              </div>
            </div>



          </div>
          <div className='row'>
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Rate based on Age</label>
                <select className='form-control'
                  onChange={(e) => setRBOA(e.target.value)}
                >
                  <option value={''} hidden>Select rates based on Age</option>
                  {
                    limitedData?.ratesBasedOnAge?.map((rate, indx) => <option value={indx} key={indx}>{rate.rate_name}</option>)
                  }
                </select>
              </div>
            </div>
          </div>
          {
            limitedData?.ratesBasedOnAge?.map((rate, indx) => (
              <div className='row' hidden={rbonAge == indx ? false : true} key={indx}>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className='text-danger'>Rate Name</label>
                    <input type='text' className='form-control' value={rate?.rate_name} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className='text-danger'>TPA</label>
                    <input type='text' className='form-control' value={rate?.tpa?.map((itm) => itm.name)?.join(", ")} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className='text-danger'>Network</label>
                    <input type='text' className='form-control' value={rate?.networks?.map((itm) => itm.name)?.join(", ")} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className='text-danger'>Age</label>
                    <input type='text' className='form-control' value={rate?.ageRange?.map((itm) => itm.minAge + "-" + itm.maxAge)?.join(", ")} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className='text-danger'>Emirates Issueing Visa</label>
                    <textarea rows={2} type='text' className='form-control' value={rate?.emirateId?.map((itm) => itm.area_of_registration_name)?.join(", ")} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className='text-danger'>Co-Payments</label>
                    <textarea rows={2} type='text' className='form-control' value={rate?.primiumArray?.map((itm) => itm.coPayments)?.join("::")} />
                  </div>
                </div>
              </div>
            ))
          }

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

export default MedicalPlan
