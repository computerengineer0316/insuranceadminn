import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import filePath from '../../../webroot/sample-files/Home-plan-sample-sheet.xlsx';
const HomePlan = () => {
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
  const [homepermission, setHomepermission] = useState([]);
  const [insurancecompany, setInsuranceCompany] = useState([]);
  const [planname, setPlanName] = useState('');
  const [status, setStatus] = useState(2);
  const [company, setCompany] = useState('');
  const [companiesPlans, setCompaniesPlans] = useState([])
  const [showMakeTable, setshowMaketable] = useState('')
  const [userLocations, setUserLocations] = useState('')
  const [limitedData, setLimitedShowData] = useState({})
  const [showLimitedModal, setShowLimitedModal] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getHomePlans(page, perPage);
      getCompaniesPlans()
      const userdata = JSON.parse(localStorage.getItem('user'));
      let userLoc = userdata?.location?.map((itm) => itm.loc_id).join(',')
      setUserLocations(userLoc)
      const home_permission = userdata?.home_permission?.[0] || {};
      setHomepermission(home_permission);
      getlistCompany();
    }
  }, []);

  useEffect(() => {
    getHomePlans(page, perPage);
    getCompaniesPlans()
  }, [planname, status, company]);

  const getHomePlans = (page, perPage) => {
    setPlans([]);
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/gethomeplan?page=${page}&limit=${perPage}&name=${planname}&status=${status}&companyid=${company}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const total = data.totalCount;
        console.log(total);
        const slice = total / perPage;
        const pages = Math.ceil(slice);
        setPageCount(pages);
        const list = data.data;
        console.log(list);
        setPlans(list);

      });
  }

  console.log(plans);

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

  const deactivatePlan = (id, status) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/updateStatusHomePlan/${id}/${status}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            title: "Success!",
            text: data.message,
            icon: "success",
            button: false,
          })
          // getHomePlans(page, perPage);
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
            // getHomePlans(page, perPage);
            getCompaniesPlans()

          });
        }
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
    getHomePlans(selectedPage + 1, perPage);

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

    await fetch("https://insuranceapi-3o5t.onrender.com/api/upload_home_policywordings_file", requestOptions)
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

  const collectExceldata = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('xlFile', excelfile)
    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/addBulkHomePlan`,
      {
        method: "post",
        body: fd,
      });

    result = await result.json();
    console.log(result)
    setVisible(!visible)
    if (result.status === 200) {
      swal("Uploaded Succesfully", "", "success");
    } else {
      swal("Something Went wrong", "", "failed");
    }
    getHomePlans(page, perPage);
  }


  const deleteitem = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteHomeMaster?id=${id}&type=homeplan`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          // getHomePlans(page, perPage);
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
            // getHomePlans(page, perPage);
            getCompaniesPlans()
          });
        }
      });
  }


  const exporttocsv = async (e) => {
  }

  const getCompaniesPlans = () => {

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getplansAccordingToCompanies?lob=home&name=${planname}&companyId=${company}&status=${status}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const modelmotordt = data.data;
        setCompaniesPlans(modelmotordt);
        console.log("Companies home plans >>>>>>>", modelmotordt)
      });

  }
  const gethomeplanDetails = (id, company) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getlimitedDataOfHomePlan?id=${id}`, requestOptions)
      .then(response => response.json())
      .then((data) => {
        console.log(data.data, " home plan data")
        const resData = data.data[0]
        const limitObj = {
          insurancecompany: company,
          plan_name: resData?.plan_name,
          plan_category: resData?.plancategories?.plan_category_name,
          ownershipStatus: resData?.ownershipstatus.home_owner_type,
          natureofPlan: resData?.natureofplan.nature_of_plan_name,
          propertytype: resData?.property_type_id?.map((property) => property.label)?.join(", "),
          planType: resData?.plantype?.home_plan_type,
          plan_type_id: resData?.plantype?._id,
          building_rate: resData?.building_value_or_topup?.map((rate) => rate.rate)?.join(", "),
          content_rate: resData?.content_value_or_topup?.map((rate) => rate.rate)?.join(", "),
          personal_rate: resData?.pbvalue_or_topup?.map((rate) => rate.rate)?.join(", "),
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
                  <h4 className="card-title">Home Plans</h4>
                </div>
                <div className="col-md-8">
                  {/* { homepermission.home_plan?.includes('download') ?
                  <a className="btn btn-primary" href={planfilePath} style={{float:"right",marginLeft:'4px'}} download>Download Home Plan Sample File</a>
                  : '' }
                  { homepermission.home_plan?.includes('upload') ?
                  <button className="btn btn-primary" style={{float:"right",marginLeft:'4px'}} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                  : '' } */}
                  {homepermission.home_plan?.includes('create') ?
                    <a href="/AddHomePlan" className="btn btn-primary" style={{ float: "right" }}>Add Home Plan</a>
                    : ''}
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="card-header">
                <div className="col-md-12" style={{ textAlign: 'right' }}>
                  {homepermission.home_plan?.includes('download') ?
                    <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginLeft: '4px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                    : ''}
                  {homepermission.home_plan?.includes('upload') ?
                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginLeft: '4px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                    : ''}
                  {homepermission.home_plan?.includes('export') ?
                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginLeft: '4px' }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to Excel</button>
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
                        <th>Company Name</th>
                        <th>plan Name</th>
                        <th>Property Type</th>
                        <th>Plan Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        plans ?
                          plans.map((item, index) => (

                            <tr key={index}>
                              <td>{startFrom + index + 1}</td>
                              <td>{item?.companies[0]['company_name']}</td>
                              <td style={item.status === 1 ? { color: "green" } : { color: "red" }}>{item?.plan_name}</td>
                              <td>{item?.property_type_id?.map((val) => val.label).join(", ")}</td>
                              <td >{item?.plan_type[0]['home_plan_type']}</td>
                              <td>
                                {homepermission.home_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/EditHomePlan?id=${item._id}`} className="btn btn-primary">Edit</a>
                                  </div>
                                )}
                                {' '}
                                {homepermission.home_plan?.includes('delete') && (
                                  <>
                                    {
                                      item.status === 1 ?
                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger"
                                          onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(item._id, 0) }}
                                        >Deactivate</button></div> :
                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success"
                                          onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(item._id, 1) }}
                                        >Activate</button></div>
                                    }
                                  </>
                                )}
                                {' '}
                                {homepermission.home_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-success"
                                      onClick={() => handlemodal(item._id, item.policywordings_file)}
                                    >T & C</button>
                                  </div>
                                )}
                                {' '}
                                {homepermission.home_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewStandardCover?id=${item._id}&type=home`} className="btn btn-info">Standard Cover</a>
                                  </div>
                                )}
                                {' '}
                                {homepermission.home_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewAdditionalCover?id=${item._id}&type=home`} className="btn btn-warning">Additional Cover</a>
                                  </div>
                                )}
                                {' '}
                                {homepermission.home_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/HomeCondition?id=${item._id}`} className="btn btn-dark">Condition</a>
                                  </div>
                                )}
                                {' '}
                                {homepermission.home_plan?.includes('delete') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-warning" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deleteitem(item._id) }}>Delete</button>
                                  </div>
                                )}
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



                      {itm1?._id?._id == showMakeTable && itm1?.plans?.map((plan, planindex) =>
                        <tr key={planindex}>
                          {userLocations.includes(plan?.plan_created_by) || userLocations.includes('64116415591c2f02bcddf51e') ?
                            <div className='d-flex my-1' style={{ marginLeft: '30px' }} >
                              <div className='mx-3'>
                                <button className='btn btn-success btn-sm text-white'><i className='fa fa-check'></i></button>
                              </div><div className=' col-md-1 mx-1 my-1' style={{ fontWeight: '700', color: 'red', }}>
                                {plan?.plan_name?.slice(0, 15)}{plan?.plan_name?.length > 15 ? '....' : ''}</div>
                              <div className='col-md-12 table-responsive'>
                                {homepermission.home_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/EditHomePlan?id=${plan._id}`} className="btn btn-primary">Edit</a>
                                  </div>
                                )}
                                {' '}
                                {homepermission.home_plan?.includes('delete') && (
                                  <>
                                    {
                                      plan.status === 1 ?
                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger"
                                          onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(plan._id, 0) }}
                                        >Deactivate</button></div> :
                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success"
                                          onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(plan._id, 1) }}
                                        >Activate</button></div>
                                    }
                                  </>
                                )}
                                {' '}
                                {homepermission.home_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-success"
                                      onClick={() => handlemodal(plan._id, plan.policywordings_file)}
                                    >T & C</button>
                                  </div>
                                )}
                                {' '}
                                {homepermission.home_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewStandardCover?id=${plan._id}&type=home`} className="btn btn-info">Standard Cover</a>
                                  </div>
                                )}
                                {' '}
                                {homepermission.home_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewAdditionalCover?id=${plan._id}&type=home`} className="btn btn-warning">Additional Cover</a>
                                  </div>
                                )}
                                {' '}
                                {homepermission.home_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/HomeCondition?id=${plan._id}`} className="btn btn-dark">Condition</a>
                                  </div>
                                )}
                                {' '}
                                {homepermission.home_plan?.includes('delete') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-warning" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deleteitem(plan._id) }}>Delete</button>
                                  </div>
                                )}
                              </div>
                            </div>
                            : <div className='d-flex col-md-12 my-1' style={{ marginLeft: '30px' }}>
                              <div className='mx-3'>
                                <button className='btn btn-success btn-sm text-white'>
                                  <i className='fa fa-check'></i></button>
                              </div>
                              <div className=' col-md-3 mx-1 my-1' style={{ fontWeight: '700', color: 'red', }}>
                                {plan?.plan_name?.slice(0, 15)}{plan?.plan_name?.length > 15 ? '....' : ''}
                              </div>
                              <div className='col-md-3'><button className='btn btn-primary' onClick={() => gethomeplanDetails(plan._id, itm1?._id?.company_name)}>View</button></div>
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
          <CButton color="primary" onClick={collectExceldata}>Upload</CButton>
        </CModalFooter>
      </CModal>
      <CModal size='lg' alignment="center" visible={showLimitedModal} onClose={() => setShowLimitedModal(false)}>
        <CModalHeader onClose={() => setShowLimitedModal(false)}>
          <CModalTitle>Home Plan Details</CModalTitle>
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
                <input type='text' className='form-control' value={limitedData?.plan_category} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className='text-danger'>Ownership Status</label>
                <input type='text' className='form-control' value={limitedData?.ownershipStatus} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className='text-danger'>Nature Of Plan</label>
                <input type='text' className='form-control' value={limitedData?.natureofPlan} />
              </div>
            </div>
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Property Type</label>
                <input type='text' className='form-control' value={limitedData?.propertytype} />
              </div>
            </div>
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Plan Type</label>
                <input type='text' className='form-control' value={limitedData?.planType} />
              </div>
            </div>
            {limitedData?.plan_type_id == '642279d4fb67d39380fef82d' ?
              <div className='col-md-6'>
                <div className="form-group mb-3">
                  <label className='text-danger'>Building only</label>
                  <input type='text' className='form-control' value={limitedData?.building_rate} />
                </div>
              </div> : limitedData?.plan_type_id == '642279f2fb67d39380fef834' ?
                <div className='col-md-12'>
                  <div className='col-md-6'>
                    <div className="form-group mb-3">
                      <label className='text-danger'>Content</label>
                      <input type='text' className='form-control' value={limitedData?.content_rate} />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className="form-group mb-3">
                      <label className='text-danger'>Personal Belonging</label>
                      <input type='text' className='form-control' value={limitedData?.personal_rate} />
                    </div>
                  </div>
                </div> : limitedData?.plan_type_id == '64227a65fb67d39380fef842' ?
                  <div>
                    <div className='col-md-6'>
                      <div className="form-group mb-3">
                        <label className='text-danger'>Building</label>
                        <input type='text' className='form-control' value={limitedData?.building_rate} />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className="form-group mb-3">
                        <label className='text-danger'>Content</label>
                        <input type='text' className='form-control' value={limitedData?.content_rate} />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className="form-group mb-3">
                        <label className='text-danger'>Personal Belonging</label>
                        <input type='text' className='form-control' value={limitedData?.personal_rate} />
                      </div>
                    </div>
                  </div> : ''
            }
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

export default HomePlan
