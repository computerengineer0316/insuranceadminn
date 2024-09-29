import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import filePath from '../../../webroot/sample-files/travel-plans.xlsx';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const MotorPlan = () => {
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
  const [travelpermission, setTravelpermission] = useState([]);
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
      getTravelPlans(page, perPage);
      exportlistdata();
      getCompaniesPlans()
      const userdata = JSON.parse(localStorage.getItem('user'));
      let userLoc = userdata?.location?.map((itm) => itm.loc_id).join(',')
      setUserLocations(userLoc)
      const travel_permission = userdata?.travel_permission?.[0] || {};
      setTravelpermission(travel_permission);
      getlistCompany();
    }
  }, []);

  useEffect(() => {
    getTravelPlans(page, perPage);
    getCompaniesPlans()
  }, [planname, status, company]);


  const getTravelPlans = (page, perPage) => {
    setPlans([]);
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getTravelPlan?page=${page}&limit=${perPage}&name=${planname}&status=${status}&companyid=${company}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const total = data.total;
        const slice = total / perPage;
        const pages = Math.ceil(slice);
        setPageCount(pages);
        setPlans(data.data);
      });
  }

  const [exportlist, setExportlist] = useState([]);
  const exportlistdata = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('https://insuranceapi-3o5t.onrender.com/api/getTravelPlan', requestOptions)
      .then(response => response.json())
      .then(data => {
        setExportlist(data.data);
      });
  }

  console.log(exportlist)

  const fileType = 'xlsx'
  const exporttocsv = () => {
    const updatedData = exportlist.map((item, index) => {
      return {

        'Company Name': item.company[0].company_name,
        'Plan Name': item.plan_name,
        'Travel Insurance For': item.travel_insurance_for[0].travel_insurance_for,
        'Travel Type': item.travel_type[0].travel_type,
        'Plan Category': item.plan_category[0].plan_category_name,
        'Nature Of Plan': item.nature_of_plan[0].nature_of_plan_name,
        'Country': item.country_or_topup.map((item) => item.country_name),
        'Country (Topup)': item.country_or_topup.map((item) => item.countrytopup),
        'Add Option Condition Description': item.add_op_con_desc.map((item) => item.add_op_con_desc),
        'Topup (Add Option Condition Description)': item.add_op_con_desc.map((item) => item.add_op_con_desc_topup),
        'Vat Able': item.add_op_con_desc.map((item) => item.vat),
        'JDV Commision': item.jdv_comm,
        'Sales Person Commision': item.sale_person_comm,

      }
    })

    console.log(updatedData)
    const ws = XLSX.utils.json_to_sheet(updatedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
    const newdata = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(newdata, "Travel-Plan" + ".xlsx")
  }


  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getTravelPlans(selectedPage + 1, perPage);
  };

  const deactivatePlan = (id, status) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/updatestatusTravelPlan/${id}/${status}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            title: "Success!",
            text: data.message,
            icon: "success",
            button: false,
          })
          getTravelPlans(page, perPage);
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
            getTravelPlans(page, perPage);
          });
        }
      });
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
    console.log(Array.from(formData));

    const requestOptions = {
      method: 'POST',
      body: formData,
    };

    await fetch("https://insuranceapi-3o5t.onrender.com/api/upload_travel_plan_policywordings_file", requestOptions)
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
    let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/addBulkTravelPlan",
      {
        method: "post",
        body: fd,
      });
    result = await result.json();
    setVisible(!visible)
    swal("Uploaded Succesfully", "", "success");
    getTravelPlans(page, perPage)
  }

  const startFrom = (page - 1) * perPage;

  const deleteitem = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteTravelMaster/?id=${id}&type=deleteTravelPlan`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          // getTravelPlans(page, perPage);
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
            // getTravelPlans(page, perPage);
            getCompaniesPlans()

          });
        }
      });
  }
  const getCompaniesPlans = () => {

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getplansAccordingToCompanies?lob=travel&name=${planname}&companyId=${company}&status=${status}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const modelmotordt = data.data;
        setCompaniesPlans(modelmotordt);
        console.log("Companies travel plans >>>>>>>", modelmotordt)
      });

  }
  const get_travel_plan_Details = (id, company) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getPlanPriceAndTravelPlan?id=${id}`, requestOptions)
      .then(response => response.json())
      .then((data) => {
        console.log(data.data, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> dataaaa")
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
        const resData = data.data[0]
        const planpriceData = resData?.travel_plan_prices
        const travelregionArr = []
        for (let i = 0; i < planpriceData?.length; i++) {
          travelregionArr.push(planpriceData[i].region_id[0])
        }
        const unique_covertype = removeDuplicateObjects(planpriceData, 'travel_cover_type')
        const unique_planprice = removeDuplicateObjects(planpriceData, 'price_name')
        const unique_travelRegion = removeDuplicateObjects(travelregionArr, 'label')
        const unique_noOfDays = removeDuplicateObjects(planpriceData, 'no_of_days_strings')
        const limitObj = {
          insurancecompany: company,
          plan_name: resData?.plan_name,
          travel_insurance_for: resData?.travel_insurance_for,
          cover_type: unique_covertype?.map((cover) => cover.travel_cover_type)?.join(', '),
          plan_price: unique_planprice?.map((price) => price.price_name)?.join(', '),
          travel_region: unique_travelRegion?.map((region) => region.label)?.join(', '),
          number_of_days: unique_noOfDays?.map((days) => days.no_of_days_strings)?.join(', ')
        }
        setLimitedShowData(limitObj)
      })
    setShowLimitedModal(true)
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-4">
                  <h4 className="card-title">Travel Plans</h4>
                </div>

                <div className="col-md-8">
                  {/* { travelpermission.travel_plan?.includes('download') ?
                  <a className="btn btn-primary" href={filePath} style={{float:"right",marginLeft:'4px'}} download>Download Travel Plan Sample File</a>
                  : '' }
                  { travelpermission.travel_plan?.includes('upload') ?
                  <button className="btn btn-primary" style={{float:"right",marginLeft:'4px'}} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                  : '' } */}
                  {travelpermission.travel_plan?.includes('create') ?
                    <a onClick={() => navigate("/AddTravelPlan")} className="btn btn-primary" style={{ float: "right" }}>Add Travel Plan</a>
                    : ''}
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="card-header">
                <div className="col-md-12" style={{ textAlign: 'right' }}>
                  {travelpermission.travel_plan?.includes('download') ?
                    <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginLeft: '4px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                    : ''}
                  {travelpermission.travel_plan?.includes('upload') ?
                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginLeft: '4px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                    : ''}
                  {travelpermission.travel_plan?.includes('export') ?
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
                        <th>Sr No......</th>
                        <th>Company Name</th>
                        <th>Travel Insurance For</th>
                        <th>Travel Type</th>
                        <th>Plan Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plans.length > 0 ? (
                        plans.map((item, index) => (
                          <tr key={index}>
                            <td>{startFrom + index + 1}</td>
                            <td>{item.company[0]['company_name']}</td>
                            <td>{item.travel_insurance_for[0]['travel_insurance_for']}</td>
                            <td>{item.travel_type[0]['travel_type']}</td>
                            {item.status === 1 ?
                              <td style={{ color: "green" }}>{item.plan_name}</td>
                              :
                              <td style={{ color: "red" }}>{item.plan_name}</td>

                            }
                            <td>
                              {travelpermission.travel_plan?.includes('edit') && (
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/EdittravelPlan?id=${item._id}`} className="btn btn-primary">Edit</a>
                                </div>
                              )}
                              {' '}
                              {travelpermission.travel_plan?.includes('delete') && (
                                <>
                                  {
                                    item.status === 1 ?
                                      <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(item._id, 0) }}>Deactivate</button></div> :
                                      <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(item._id, 1) }}>Activate</button></div>
                                  }
                                </>
                              )}
                              {' '}
                              {travelpermission.travel_plan?.includes('edit') && (
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewPlanPrice?id=${item._id}`} className="btn btn-dark">Add Plan Price</a>
                                </div>
                              )}
                              {' '}
                              {travelpermission.travel_plan?.includes('edit') && (
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <button className="btn btn-success" onClick={() => handlemodal(item._id, item.policywordings_file)}>T & C</button>
                                </div>
                              )}
                              {' '}
                              {travelpermission.travel_plan?.includes('edit') && (
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewStandardCover?id=${item._id}&type=travel`} className="btn btn-info">Standard Cover</a>
                                </div>
                              )}
                              {' '}
                              {travelpermission.travel_plan?.includes('edit') && (
                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <a href={`/ViewAdditionalCover?id=${item._id}&type=travel`} className="btn btn-warning">Additional Cover</a>
                                </div>
                              )}
                              {' '}
                              {travelpermission.travel_plan?.includes('delete') && (

                                <div className="btn-group" role="group" aria-label="Basic example">
                                  <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deleteitem(item._id) }}>Delete</button>
                                </div>

                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6">No Data Found</td>
                        </tr>
                      )}
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
                              </div>
                              <div className=' col-md-1 mx-1 my-1' style={{ fontWeight: '700', color: 'red', }}>
                                {plan?.plan_name?.slice(0, 15)}{plan?.plan_name?.length > 15 ? '....' : ''}
                              </div>
                              <div className='col-md-12 table-responsive'>
                                {travelpermission.travel_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/EdittravelPlan?id=${plan._id}`} className="btn btn-primary">Edit</a>
                                  </div>
                                )}
                                {' '}
                                {travelpermission.travel_plan?.includes('delete') && (
                                  <>
                                    {
                                      plan.status === 1 ?
                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatePlan(plan._id, 0) }}>Deactivate</button></div> :
                                        <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatePlan(plan._id, 1) }}>Activate</button></div>
                                    }
                                  </>
                                )}
                                {' '}
                                {travelpermission.travel_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewPlanPrice?id=${plan._id}`} className="btn btn-dark">Add Plan Price</a>
                                  </div>
                                )}
                                {' '}
                                {travelpermission.travel_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-success" onClick={() => handlemodal(plan._id, plan.policywordings_file)}>T & C</button>
                                  </div>
                                )}
                                {' '}
                                {travelpermission.travel_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewStandardCover?id=${plan._id}&type=travel`} className="btn btn-info">Standard Cover</a>
                                  </div>
                                )}
                                {' '}
                                {travelpermission.travel_plan?.includes('edit') && (
                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <a href={`/ViewAdditionalCover?id=${plan._id}&type=travel`} className="btn btn-warning">Additional Cover</a>
                                  </div>
                                )}
                                {' '}
                                {travelpermission.travel_plan?.includes('delete') && (

                                  <div className="btn-group" role="group" aria-label="Basic example">
                                    <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deleteitem(plan._id) }}>Delete</button>
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
                              <div className='col-md-3'><button className='btn btn-primary' onClick={() => get_travel_plan_Details(plan._id, itm1?._id?.company_name)}>View</button></div>
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
                <label className='text-danger'>Travel Insurance For</label>
                <input type='text' className='form-control' value={limitedData?.travel_insurance_for} />
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
                <label className='text-danger'>Cover Type</label>
                <input type='text' className='form-control' value={limitedData?.cover_type} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className='text-danger'>Plan Price</label>
                <textarea rows={2} type='text' className='form-control' value={limitedData?.plan_price} />
              </div>
            </div>
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Travel Region</label>
                <input type='text' className='form-control' value={limitedData?.travel_region} />
              </div>
            </div>
            <div className='col-md-6'>
              <div className="form-group mb-3">
                <label className='text-danger'>Number Of Days</label>
                <textarea rows={2} type='text' className='form-control' value={limitedData?.number_of_days} />
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

export default MotorPlan