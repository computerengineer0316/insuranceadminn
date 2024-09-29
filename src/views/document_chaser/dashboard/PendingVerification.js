import React, { useCallback } from 'react'
import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import { Form, useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion, Col, Table } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';

PendingVerification.propTypes =
{
  filterOptions: PropTypes.shape({
    location: PropTypes.string,
    lob: PropTypes.string,
    businessType: PropTypes.string,
    agent: PropTypes.string,
    dateRange: PropTypes
  })
};

PendingVerification.propTypes = {
  defaultOptions: PropTypes.shape({
    defaultlocation: PropTypes.string,
    defaultlob: PropTypes.string,
    defaultbusinessType: PropTypes.string,
    defaultagent: PropTypes.string,
    defaultdateRange: PropTypes,
    startdate: PropTypes,
    enddate: PropTypes
  })
};

PendingVerification.propTypes =
{
  updateSharedData: PropTypes.func.isRequired,
}

function PendingVerification({ filterOptions, defaultOptions, updateSharedData }) {

  const navigate = useNavigate();
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [dcleads, setDcleads] = useState([]);
  const [direct_payment, set_Direct_Payment] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [leaddetails, setLeaddetails] = useState({});
  const [leadStatus, setLeadStatus] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [leadid, setLeadid] = useState('');
  const [emirates_idback_copy, setEmirates_idback_copy] = useState([]);
  const [emirates_idback_copy_status, setEmirates_idback_copy_status] = useState('');
  const [emirates_idback_copy_reason, setEmirates_idback_copy_reason] = useState('');
  const [emirates_idfront_copy, setEmirates_idfront_copy] = useState([]);
  const [emirates_idfront_copy_status, setEmirates_idfront_copy_status] = useState('');
  const [emirates_idfront_copy_reason, setEmirates_idfront_copy_reason] = useState('');
  const [passport_copy, setPassport_copy] = useState([]);
  const [passport_copy_status, setPassport_copy_status] = useState('');
  const [passport_copy_reason, setPassport_copy_reason] = useState('');
  const [visa_copy, setVisa_copy] = useState([]);
  const [visa_copy_status, setVisa_copy_status] = useState('');
  const [visa_copy_reason, setVisa_copy_reason] = useState('');
  const [trade_license_copy, setTrade_license_copy] = useState([]);
  const [trade_license_copy_status, setTrade_license_copy_status] = useState('');
  const [trade_license_copy_reason, setTrade_license_copy_reason] = useState('');
  const [vat_certificate_copy, setVat_certificate_copy] = useState([]);
  const [vat_certificate_copy_status, setVat_certificate_copy_status] = useState('');
  const [vat_certificate_copy_reason, setVat_certificate_copy_reason] = useState('');
  const [pilist, setPIlist] = useState([]);
  const [dcleadstatus, setDcleadstatus] = useState('Pending');
  const [dcleadforwardto, setDcleadforwardto] = useState('');
  const [dcleadreason, setDcleadreason] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0)


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getdcleads(page, perPage);
      getleadstatus();
      getreasons();
      Policyissuerlist();
    }
  }, [filterOptions]);

  const getagent = JSON.parse(localStorage.getItem('user'));
  const agentid = getagent._id;
  const usertype = getagent.usertype;
  const getleadstatus = async () => {
    const userdt = JSON.parse(localStorage.getItem('user'));
    const usertype = userdt.usertype;
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_lead_status_name', {
      method: 'post',
      body: JSON.stringify({ usertype: usertype }),
      headers:
      {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    setLeadStatus(result.data)
  }

  const getreasons = async () => {
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_Reason_Type_list', {
      method: 'get',
      headers:
      {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((data) => {
        setReasons(data.data);
      });
  }

  const getdcleads = async (page, perPage) => {
    setLoading(true);
    let newlocation = filterOptions.location
    let newlob = filterOptions.lob
    let newbusinessType = filterOptions.businessType
    let newagent = filterOptions.agent
    let dateRange = filterOptions.dateRange
    let startdate = defaultOptions.startdate
    let enddate = defaultOptions.enddate

    if (newlocation == null || newlocation == undefined || !Array.isArray(newlocation) || newlocation.length === 0) {
      newlocation = defaultOptions.defaultlocation.map((item) => item.value);
      // newlocation = [];
    }
    else {
      newlocation = newlocation.map((item) => item.value);
    }

    if (newlob == null || newlob == undefined || !Array.isArray(newlob) || newlob.length === 0) {
      newlob = defaultOptions.defaultlob.map((item) => item.value);
      // newlob = [];
    }
    else {
      newlob = newlob.map((item) => item.value);
    }

    if (newbusinessType == null || newbusinessType == undefined || !Array.isArray(newbusinessType) || newbusinessType.length === 0) {
      newbusinessType = defaultOptions.defaultbusinessType.map((item) => item.value);
      // newbusinessType = [];

    }
    else {
      newbusinessType = newbusinessType.map((item) => item.value);
    }


    if (newagent == null || newagent == undefined || !Array.isArray(newagent) || newagent.length === 0) {
      newagent = defaultOptions.defaultagent.map((item) => item.value);
    } else {
      newagent = newagent.map((item) => item.value);
    }

    const token = localStorage.getItem('token');
    const loginuser = JSON.parse(localStorage.getItem('user'));
    const loginusertype = loginuser.usertype;
    const DCDashboardPermission = loginuser?.dashboard_permission[0]?.dc_dashboard
    console.log(loginusertype)
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        page: page,
        limit: perPage,
        agentid: agentid,
        location: newlocation,
        lob: newlob,
        business_type: newbusinessType,
        newagent: newagent,
        dateRange: dateRange,
        startdate: startdate,
        enddate: enddate
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    };

    if (loginusertype == "6462250eb201a6f07b2dff3a" || loginusertype == "646224eab201a6f07b2dff36"
      || loginusertype == "646224deb201a6f07b2dff32" || loginusertype == '64622526b201a6f07b2dff3e') {
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?documentType=pending&dashboardType=documentsChaserDashbord`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const total = data.total;
          setNotificationCount(total)
          const slice = total / perPage;
          const pages = Math.ceil(slice);
          setPageCount(pages);
          const list = data.data;
          setDcleads(list)
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (loginusertype == "64622470b201a6f07b2dff22") {
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?documentType=pending&dashboardType=documentsChaserDashbord`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const total = data.total;
          setNotificationCount(total)
          const slice = total / perPage;
          const pages = Math.ceil(slice);
          setPageCount(pages);
          const list = data.data;
          setDcleads(list)
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }
  const startFrom = (page - 1) * perPage;
  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getdcleads(selectedPage + 1, perPage, localStorage.getItem('lob'));
  };

  const handleDirectPaymentChange = (itemId, checked) => {
    set_Direct_Payment(prevState => ({
      ...prevState,
      [itemId]: checked
    }));
  };

  const handleEmailClick = (email) => {
    const mailtoLink = `mailto:${email}`;
    window.open(mailtoLink);
  }

  const handleWhatsappClick = (phoneNumber) => {
    const whatsappLink = `https://wa.me/${phoneNumber}`;
    window.open(whatsappLink);
  }

  const handleverification = async (ParamValue) => {
    setLeadid(ParamValue);
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_new_lead_detailsbyid', {
      method: 'post',
      body: JSON.stringify({ ParamValue }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    setLeaddetails(result.data);
    setShowModal(true);
  }

  const handlebackidcopywindow = async (url) => {
    setEmirates_idback_copy(url);
    window.open(`https://insuranceapi-3o5t.onrender.com/documents/${url[0].filename}`)
  }

  const handlefrontidcopywindow = async (url) => {
    setEmirates_idfront_copy(url);
    window.open(`https://insuranceapi-3o5t.onrender.com/documents/${url[0].filename}`)
  }

  const handlepassportcopywindow = async (url) => {
    setPassport_copy(url);
    window.open(`https://insuranceapi-3o5t.onrender.com/documents/${url[0].filename}`)
  }

  const handlevisacopywindow = async (url) => {
    setVisa_copy(url);
    window.open(`https://insuranceapi-3o5t.onrender.com/documents/${url[0].filename}`)
  }

  const handletradeLicensewindow = async (url) => {
    setTrade_license_copy(url);
    window.open(`https://insuranceapi-3o5t.onrender.com/documents/${url[0].filename}`)
  }

  const handlevatcertificatewindow = async (url) => {
    setVat_certificate_copy(url);
    window.open(`https://insuranceapi-3o5t.onrender.com/documents/${url[0].filename}`)
  }

  const uploadDocuments = async () => {
    const formData = new FormData();

    formData.append('emirates_idback_copy', emirates_idback_copy);
    formData.append('emirates_idback_copy_status', emirates_idback_copy_status);
    formData.append('emirates_idback_copy_reason', emirates_idback_copy_reason);

    formData.append('emirates_idfront_copy', emirates_idfront_copy);
    formData.append('emirates_idfront_copy_status', emirates_idfront_copy_status);
    formData.append('emirates_idfront_copy_reason', emirates_idfront_copy_reason);

    formData.append('passport_copy', passport_copy);
    formData.append('passport_copy_status', passport_copy_status);
    formData.append('passport_copy_reason', passport_copy_reason);

    formData.append('visa_copy', visa_copy);
    formData.append('visa_copy_status', visa_copy_status);
    formData.append('visa_copy_reason', visa_copy_reason);

    formData.append('id', leadid);

    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/upload_documents', {
      method: 'post',
      body: formData,
    })
    result = await result.json();
  }

  const uploadsponsoreddocument = async () => {

    const formData = new FormData();

    formData.append('trade_license_copy', trade_license_copy);
    formData.append('trade_license_copy_status', trade_license_copy_status);
    formData.append('trade_license_copy_reason', trade_license_copy_reason);

    formData.append('vat_certificate_copy', vat_certificate_copy);
    formData.append('vat_certificate_copy_status', vat_certificate_copy_status);
    formData.append('vat_certificate_copy_reason', vat_certificate_copy_reason);

    formData.append('id', leadid);

    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/upload_sponsored_documents', {
      method: 'post',
      body: formData,
    })
    result = await result.json();
  }

  const handleverificationstatus = async () => {
    const requestOptions =
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'id': leadid, 'dcleadstatus': dcleadstatus, 'dcleadforwardto': dcleadforwardto, 'dcleadreason': dcleadreason })
    };
    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/updatedcverification`, requestOptions);
    result = await result.json();
    setShowModal(false);
  }

  const Policyissuerlist = () => {
    const requestOptions =
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getPolicyIssuer`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const agentdt = data.data;
        const agent_len = agentdt.length;
        const agent_list = [];
        for (let i = 0; i < agent_len; i++) {
          const agent_obj = { label: agentdt[i].name, value: agentdt[i]._id };
          agent_list.push(agent_obj);
        }
        setPIlist(agent_list);
      });
  }

  const handlestatus = async (id) => {
    const requestOptions =
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'id': id, 'dcleadstatus': dcleadstatus, 'dcleadforwardto': dcleadforwardto, })
    };
    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/updatedcverification`, requestOptions);
    result = await result.json();
    if (result.status == 200) {
      swal('Status Updated Successfully', '', 'success');
      getdcleads(page, perPage);
      updateSharedData(getdcleads(page, perPage));
    }
    else {
      swal('Status Not Updated', '', 'error')
    }
  }

  const details = (id, lob) => {

    if (lob === 'Motor') {
      window.open(`/MotorLeaddetails?id=${id}`, '_blank')
    }
    if (lob === 'Travel') {
      window.open(`/TravelLeaddetails?id=${id}`, '_blank')
    }
    if (lob === 'Medical') {
      window.open(`/MedicalLeaddetails?id=${id}`, '_blank')
    }
    if (lob === 'Home') {
      window.open(`/HomeLeaddetails?id=${id}`, '_blank')
    }
    if (lob === 'Yacht') {
      window.open(`/YachtLeaddetails?id=${id}`, '_blank')
    }

  }

  return (
    <>

      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div style={{ position: 'relative' }} className="card-header new_leads">
              <strong>Pending for Verification / To Be Received</strong>
              {notificationCount > 0 ? <div className='dashboardNotify'><h6>{notificationCount}</h6></div> : ''}

              {/* <button className='btn btn-dark' onClick={handlerefresh}>Refresh</button> */}
            </div>
          </Accordion.Header>
          <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>

            <table className="table table-bordered">
              <thead >
                <tr className="table-info">
                  <th scope="col">Sr#</th>
                  <th scope="col">Client Name</th>
                  <th scope="col">Contact Number</th>
                  <th scope="col">Email Address</th>
                  <th scope="col">LOB</th>
                  <th scope="col">Received From</th>
                  <th scope="col">Assign Date & Time</th>
                  <th scope="col">Aging in minutes</th>
                  <th scope="col">Status</th>
                  {/* <th scope="col">Assign to</th> */}
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <div className="loader-container">
                    <ClipLoader color="#000000" loading={loading} size={50} />
                  </div>
                ) : (
                  <>
                    {dcleads.length > 0 ? (
                      dcleads.map((item, index) => (
                        <tr key={index}>
                          <td>{startFrom + index + 1}</td>
                          {/* <td><a href="#" onClick={() => handleverification(item._id)}>{item.name}</a></td>
                      <td><a href="#" onClick={() => handleWhatsappClick(item.phoneno)}>{item.phoneno}</a></td>
                      <td><a href="#" onClick={() => handleEmailClick(item.email)}>{item.email}</a></td> */}
                          <td>{item.name}</td>
                          <td>{item.phoneno}</td>
                          <td>{item.email}</td>
                          <td>{item['policy_type'][0]['line_of_business_name']}</td>
                          <td>{item['recived_from_data'][0]?.name}</td>
                          <td>{item.assign_documentchaser_timestamp ? new Date(item.assign_documentchaser_timestamp).toString() : new Date(item.new_lead_timestamp).toString()}</td>
                          <td>{item.assign_documentchaser_timestamp ? moment(item.assign_documentchaser_timestamp).fromNow() : moment(item.new_lead_timestamp).fromNow()}</td>
                          <td>
                            <select name="status" id="status" className="form-control" onChange={(e) => setDcleadstatus(e.target.value)}>
                              <option defaultValue={item.dcleadstatus} hidden>{item.dcleadstatus}</option>
                              {/* <option value="Forward">Forward</option> */}
                              <option value="Open">Open</option>
                              <option value="Pending">Pending</option>
                            </select>
                          </td>
                          {/* <td>
                        <select className="form-select" aria-label="Default select example"
                          disabled={dcleadstatus === "Open" || dcleadstatus === "Pending"}
                          onChange={(e) => setDcleadforwardto(e.target.value)}
                        >
                          <option selected hidden>Policy Issuer</option>
                          {pilist.map((item, index) => (
                            <option key={index} value={item.value}>{item.label}</option>
                          ))}
                        </select>
                      </td> */}
                          <td className='buttons_icons'>
                            <button className="btn btn-primary update_abcsds" onClick={() => details(item._id, item['policy_type'][0]['line_of_business_name'])}><i className="fa-solid fa-eye"></i></button>
                            <button className="btn btn-primary update_abcsds" onClick={() => handlestatus(item._id)}>Update</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-center">
                          <strong>No Records Found</strong>
                        </td>
                      </tr>
                    )
                    }
                  </>
                )}
              </tbody>
            </table>

            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={1}
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
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* <Modal size='lg' show={showModal} onHide={() => setShowModal(false)} scrollable={true}>
        <Modal.Header closeButton style={{ backgroundColor: '#0D2F92', color: '#ffff' }}>
          <Modal.Title>Verification Window</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Container>
            <Row>
              <Col>
                {leaddetails && Array.isArray(leaddetails) ? (
                  leaddetails.map((item, index) => (
                    <>
                      <h5>Date and Time: {new Date(item.new_lead_timestamp).toUTCString()}</h5>
                      <h5>Aging in minutes: {moment(item.new_lead_timestamp).fromNow()}</h5>
                    </>
                  ))
                ) : (
                  <p>No lead details available.</p>
                )}
              </Col>
            </Row>
            <div >
              <Row>
                <Col lg={12} style={{ width: '100%', overflowY: 'scroll', height: '150px' }}>
                  <Table bordered hover>
                    <thead>
                      <tr>
                        <th>Sr.</th>
                        <th>Name</th>
                        <th>View / Upload</th>
                        <th>Status</th>
                        <th>Reasons</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaddetails && Array.isArray(leaddetails) ?
                        leaddetails.map((item, index) => (
                          <>
                            <tr>
                              <td>1</td>
                              <td>Emirates ID Back copy</td>
                              <td>{
                                item.emirates_idback_copy === [] || item.emirates_idback_copy === undefined || item.emirates_idback_copy.length === 0 ?
                                  <input type="file" onChange={(e) => setEmirates_idback_copy(e.target.files[0])} />
                                  :

                                  <button
                                    className='btn btn-warning'
                                    onClick={() => handlebackidcopywindow(item.emirates_idback_copy)}
                                  >
                                    View
                                  </button>
                              }
                              </td>
                              <td>
                                <select name="lead_status" id="lead_status" onChange={(e) => setEmirates_idback_copy_status(e.target.value)}>
                                  <option defaultValue={item.emirates_idback_copy_status} hidden>{item.emirates_idback_copy_status}</option>
                                  {leadStatus.map((item, index) => (
                                    <option key={index} value={item.lead_status}>{item.lead_status}</option>
                                  ))}
                                </select>
                              </td>
                              <td><select name="reason_type" id="reason_type" onChange={(e) => setEmirates_idback_copy_reason(e.target.value)}>
                                <option defaultValue={item.emirates_idback_copy_reason} hidden>{item.emirates_idback_copy_reason}</option>
                                {reasons.map((item, index) => (
                                  <option key={index} value={item.reason_type}>{item.reason_type}</option>
                                ))}
                              </select>
                              </td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>Emirates ID Front copy</td>
                              <td>{
                                item.emirates_idfront_copy === [] || item.emirates_idfront_copy === undefined || item.emirates_idfront_copy.length === 0 ?
                                  <input type="file" onChange={(e) => setEmirates_idfront_copy(e.target.files[0])} />
                                  :
                                  <button className='btn btn-warning' onClick={() => handlefrontidcopywindow(item.emirates_idfront_copy)}>
                                    View
                                  </button>
                              }
                              </td>
                              <td><select name="lead_status" id="lead_status" onChange={(e) => setEmirates_idfront_copy_status(e.target.value)}>
                                <option defaultValue={item.emirates_idfront_copy_status} hidden>{item.emirates_idfront_copy_status}</option>
                                {leadStatus.map((item, index) => (
                                  <option key={index} value={item.lead_status}>{item.lead_status}</option>
                                ))}
                              </select>
                              </td>
                              <td><select name="reason_type" id="reason_type" onChange={(e) => setEmirates_idfront_copy_reason(e.target.value)}>
                                <option defaultValue={item.emirates_idfront_copy_reason} hidden>{item.emirates_idfront_copy_reason}</option>
                                {reasons.map((item, index) => (
                                  <option key={index} value={item.reason_type}>{item.reason_type}</option>
                                ))}
                              </select>
                              </td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>Passport copy</td>
                              <td>{
                                item.passport_copy === [] || item.passport_copy === undefined || item.passport_copy.length === 0 ?
                                  <input type="file" onChange={(e) => setPassport_copy(e.target.files[0])} />
                                  :
                                  <button className='btn btn-warning' onClick={() => handlepassportcopywindow(item.passport_copy)}>
                                    View
                                  </button>
                              }
                              </td>
                              <td><select name="lead_status" id="lead_status" onChange={(e) => setPassport_copy_status(e.target.value)}>
                                <option defaultValue={item.passport_copy_status} hidden>{item.passport_copy_status}</option>
                                {leadStatus.map((item, index) => (
                                  <option key={index} value={item.lead_status}>{item.lead_status}</option>
                                ))}
                              </select>
                              </td>
                              <td><select name="reason_type" id="reason_type" onChange={(e) => setPassport_copy_reason(e.target.value)}>
                                <option defaultValue={item.passport_copy_reason} hidden>{item.passport_copy_reason}</option>
                                {reasons.map((item, index) => (
                                  <option key={index} value={item.reason_type}>{item.reason_type}</option>
                                ))}
                              </select>
                              </td>
                            </tr>
                            <tr>
                              <td>4</td>
                              <td>Visa copy</td>
                              <td>{
                                item.visa_copy == [] || item.visa_copy == undefined || item.visa_copy.length === 0 ?
                                  <input type="file" onChange={(e) => setVisa_copy(e.target.files[0])} />
                                  :
                                  <button className='btn btn-warning' onClick={() => handlevisacopywindow(item.visa_copy)}>
                                    View
                                  </button>
                              }
                              </td>
                              <td><select name="lead_status" id="lead_status" onChange={(e) => setVisa_copy_status(e.target.value)}>
                                <option defaultValue={item.visa_copy_status} hidden>{item.visa_copy_status}</option>
                                {leadStatus.map((item, index) => (
                                  <option key={index} value={item.lead_status}>{item.lead_status}</option>
                                ))}
                              </select>
                              </td>
                              <td><select name="reason_type" id="reason_type" onChange={(e) => setVisa_copy_reason(e.target.value)}>
                                <option defaultValue={item.visa_copy_reason} hidden>{item.visa_copy_reason}</option>
                                {reasons.map((item, index) => (
                                  <option key={index} value={item.reason_type}>{item.reason_type}</option>
                                ))}
                              </select>
                              </td>

                            </tr>
                          </>
                        ))
                        : (
                          <p>No lead details available.</p>
                        )}

                    </tbody>
                  </Table>

                </Col>
              </Row>
            </div>
            <Row>
              <Col>
                <Button className='btn btn-primary mt-3 mb-3' onClick={uploadDocuments}>
                  Save
                </Button>
              </Col>
            </Row>
          </Container>
          <Container>
            <div>
              <Row>
                <Col lg={12} style={{ width: '100%', overflowY: 'scroll', height: '150px' }}>
                  <Table bordered hover>
                    <thead>
                      <tr>
                        <th>Sr.</th>
                        <th>Name</th>
                        <th>View / Upload</th>
                        <th>Status</th>
                        <th>Reasons</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaddetails && Array.isArray(leaddetails) ?
                        leaddetails.map((item, index) => (
                          <>
                            <tr>
                              <td>1</td>
                              <td>Trade License Copy</td>
                              <td>{
                                item.trade_license_copy == [] || item.trade_license_copy == undefined || item.trade_license_copy.length === 0 ?
                                  <input type="file" onChange={(e) => setTrade_license_copy(e.target.files[0])} />
                                  :
                                  <button className='btn btn-warning' onClick={() => window.open(item.trade_license_copy)}>
                                    View
                                  </button>
                              }
                              </td>
                              <td><select name="lead_status" id="lead_status" onChange={(e) => setTrade_license_copy_status(e.target.value)}>
                                <option defaultValue={item.trade_license_copy_status} hidden>{item.trade_license_copy_status}</option>
                                {leadStatus.map((item, index) => (
                                  <option key={index} value={item.lead_status}>{item.lead_status}</option>
                                ))}
                              </select>
                              </td>
                              <td><select name="reason_type" id="reason_type" onChange={(e) => setTrade_license_copy_reason(e.target.value)}>
                                <option defaultValue={item.trade_license_copy_reason} hidden>{item.trade_license_copy_reason}</option>
                                {reasons.map((item, index) => (
                                  <option key={index} value={item.reason_type}>{item.reason_type}</option>
                                ))}
                              </select>
                              </td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>VAT Certificate</td>
                              <td>{
                                item.vat_certificate_copy == [] || item.vat_certificate_copy == undefined || item.vat_certificate_copy.length === 0 ?
                                  <input type="file" onChange={(e) => setVat_certificate_copy(e.target.files[0])} />
                                  :
                                  <button className='btn btn-warning' onClick={() => window.open(item.vat_certificate_copy)}>
                                    View
                                  </button>
                              }
                              </td>
                              <td><select name="lead_status" id="lead_status" onChange={(e) => setVat_certificate_copy_status(e.target.value)}>
                                <option defaultValue={item.vat_certificate_copy_status} hidden>{item.vat_certificate_copy_status}</option>
                                {leadStatus.map((item, index) => (
                                  <option key={index} value={item.lead_status}>{item.lead_status}</option>
                                ))}
                              </select>
                              </td>
                              <td><select name="reason_type" id="reason_type" onChange={(e) => setVat_certificate_copy_reason(e.target.value)}>
                                <option defaultValue={item.vat_certificate_copy_reason} hidden>{item.vat_certificate_copy_reason}</option>
                                {reasons.map((item, index) => (
                                  <option key={index} value={item.reason_type}>{item.reason_type}</option>
                                ))}
                              </select>
                              </td>
                            </tr>
                          </>
                        ))
                        : (
                          <p>No lead details available.</p>
                        )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
            <Row>
              <Col lg={12}>
                <Button className='btn btn-primary mt-3 mb-3' onClick={uploadsponsoreddocument}>
                  Save
                </Button>
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col lg={12}>
                <label className="form-label"><strong>Status</strong></label>
                <select name="status" id="status" className="form-control" onChange={(e) => setDcleadstatus(e.target.value)}>
                  {leaddetails && Array.isArray(leaddetails) ?
                    leaddetails.map((item, index) => (
                      <option key={index} defaultValue={item.dcleadstatus} hidden>{item.dcleadstatus}</option>
                    ))
                    : (
                      <option defaultValue={'Open'} hidden>Select Status</option>
                    )}
                  <option value="Forward">Forward</option>
                  <option value="Open">Open</option>
                  <option value="Pending">Pending</option>
                </select>
              </Col>
            </Row>
            <Row>
              <Col>
                {leaddetails && Array.isArray(leaddetails) ?
                  leaddetails.map((item, index) => (
                    <>
                      <label className="form-label"><strong>Status Updated</strong></label>
                      <select name="" id=""
                        className="form-control"
                        onChange={(e) => setDcleadforwardto(e.target.value)}
                        disabled={dcleadstatus === "Open" || dcleadstatus === "Pending"}
                      >
                        {leaddetails && Array.isArray(leaddetails) ?
                          leaddetails.map((item, index) => (
                            <option key={index} defaultValue={item.dcleadforwardto != "" ? item.dcleadforwardto : ""} hidden>
                              {item.dcleadforwardto != "" ? item.dcleadforwardto : "Policy Issuer"}
                            </option>
                          ))
                          : (
                            'Policy Issuer'
                          )}

                        {pilist.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </>
                  )) : (
                    <p>No lead details available.</p>
                  )}

              </Col>
            </Row>
            <Row>
            <Col>
                {leaddetails && Array.isArray(leaddetails) ?
                  leaddetails.map((item, index) => (
                    <>
                      <label className="form-label">
                        <strong>Reasons</strong>
                      </label>
                      <select
                        name="reason_type"
                        id="reason_type"
                        className="form-control"
                        onChange={(e) => setDcleadreason(e.target.value)}
                        disabled={dcleadstatus === "Open" || dcleadstatus === "Forward"}

                      >
                        <option hidden>Select Reason</option>
                        {reasons.map((reasonItem, reasonIndex) => (
                          <option key={reasonIndex} value={reasonItem.reason_type} selected={item.dcleadreason == reasonItem.reason_type}>
                            {reasonItem.reason_type}
                          </option>
                        ))}
                      </select>
                    </>
                  ))
                  : (
                    <p>No lead details available.</p>
                  )}
              </Col>

            </Row>
            <Row>
              <Col>
                <button className='btn btn-primary mt-3 mb-3' onClick={handleverificationstatus}>
                  Submit
                </button>
              </Col>
            </Row>
          </Container>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  )
}

export default PendingVerification;