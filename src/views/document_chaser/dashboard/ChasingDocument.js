import React from 'react'
import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Modal, Button, Accordion, Col, Table } from 'react-bootstrap';
import moment from 'moment';
import PropTypes, { element } from 'prop-types';
import swal from 'sweetalert';
import { ClipLoader } from 'react-spinners';
import Leadsstatus from 'src/views/manager-supervisor_dashboard/dashboard/Leadsstatus';
import StackItem from 'rsuite/esm/Stack/StackItem';

ChasingDocument.propTypes =
{
  filterOptions: PropTypes.shape({
    location: PropTypes.string,
    lob: PropTypes.string,
    businessType: PropTypes.string,
    agent: PropTypes.string,
    dateRange: PropTypes
  })
};

ChasingDocument.propTypes =
{
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

ChasingDocument.propTypes =
{
  updateSharedData: PropTypes.func.isRequired,
};

function ChasingDocument({ filterOptions, defaultOptions, updateSharedData }) {


  const navigate = useNavigate();
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [dcleads, setDcleads] = useState([]);
  const [direct_payment, set_Direct_Payment] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [leaddetails, setLeaddetails] = useState({});
  const [leadStatus, setLeadStatus] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [leadid, setLeadid] = useState('');
  const [userdocuments, setUserDocuments] = useState([]);
  const [pilist, setPIlist] = useState([]);
  const [dcleadstatus, setDcleadstatus] = useState('Open');
  const [dcleadforwardto, setDcleadforwardto] = useState('');
  const [dcleadreason, setDcleadreason] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [documentDetails, setDocumentDetails] = useState([]);
  const [payload, setPayload] = useState([]);
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


  const getleadstatus = async () => {
    const userdt = JSON.parse(localStorage.getItem('user'));
    const usertype = userdt.usertype;
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_lead_status_name?type=documentchaser',
      {
        method: 'post',
        body: JSON.stringify({ usertype: usertype }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    result = await result.json();
    setLeadStatus(result.data)
  }

  // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>leadstatus', leadStatus)

  const getreasons = async () => {
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_Reason_Type_list', {
      method: 'get',
      headers: {
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
    }
    else {
      newagent = newagent.map((item) => item.value);
    }

    const token = localStorage.getItem('token');
    const loginuser = JSON.parse(localStorage.getItem('user'));
    const loginusertype = loginuser.usertype;
    const DCDashboardPermission = loginuser?.dashboard_permission[0]?.dc_dashboard

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
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?documentType=open&dashboardType=documentsChaserDashbord`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const total = data.total;
          setNotificationCount(total)
          const slice = total / perPage;
          const pages = Math.ceil(slice);
          setPageCount(pages);
          const list = data.data;
          console.log(">>>>>>>>>>>>>>>>>>>>dc leadssss", list)
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
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?documentType=open&dashboardType=documentsChaserDashbord`, requestOptions)
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

  console.log(dcleads);

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
    setDcleadstatus('Open');
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
    const lobid = result.data[0]['type_of_policy'];
    const userdocuments = result.data[0]['documents'];
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>userdocuments', userdocuments)
    setUserDocuments(userdocuments);

    let result1 = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_Documents_listbyid', {
      method: 'post',
      body: JSON.stringify({ ParamValue: lobid }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result1 = await result1.json();
    let AllDocs = result1.data;

    for (let i = 0; i < AllDocs.length; i++) {
      const ReqDocs = AllDocs[i];
      let matchHoGya = false;
      for (let j = 0; j < userdocuments.length; j++) {
        const LeadDocs = userdocuments[j];
        if (ReqDocs.document_type === LeadDocs.name) {
          matchHoGya = true;
          AllDocs[i]["name"] = ReqDocs.document_type;
          AllDocs[i]["status"] = LeadDocs.status;
          AllDocs[i]["reason"] = LeadDocs.reason;
          AllDocs[i]["file"] = LeadDocs.file ? LeadDocs.file : "";
        }

      }
      if (matchHoGya === false) {
        AllDocs[i]["name"] = ReqDocs.document_type;
        AllDocs[i]["status"] = "";
        AllDocs[i]["reason"] = "";
        AllDocs[i]["file"] = "";
      }
    }
    setDocuments(AllDocs);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>> required documents', documents)
    setShowModal(true);
  }

  const handleverificationstatus = async () => {
    if (dcleadstatus == 'Forward' && dcleadforwardto == '') {
      swal({
        text: "Please select the Policy Issuer",
        icon: "warning",
      });
      return;
    }
    if (dcleadstatus == 'Pending' && dcleadreason == '') {
      swal({
        text: "Please select the Reason",
        icon: "warning",
      });
      return;
    }
    const userdt = JSON.parse(localStorage.getItem('user'));
    const assigningagent = userdt._id;
    const requestOptions =
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'id': leadid,
        'dcleadstatus': dcleadstatus,
        'dcleadforwardto': dcleadforwardto,
        'dcleadreason': dcleadreason,
        'assigningagent': assigningagent
      })
    };
    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/updatedcverification`, requestOptions);
    result = await result.json();
    if (result.status === 200) {
      swal("Success!", "Updated", "success");
      getdcleads(page, perPage);
      updateSharedData(getdcleads(page, perPage));
      setShowModal(false);
    }
  }

  const Policyissuerlist = () => {
    const requestOptions =
    {
      method: 'GET',
      headers:
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
    };
    // fetch(`https://insuranceapi-3o5t.onrender.com/api/getPolicyIssuer`, requestOptions)
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getUserAccordingUserType?userType=policyIssuer`, requestOptions)

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

  const handleFileUpload = (e, index, item) => {
    const file = e.target.files[0];
    let AllPayload = [...payload];
    const elementExists = AllPayload?.some((payloadItem, payloadIndex) => payloadItem.name == item.name);
    console.log("elementExists: ", elementExists)
    if (elementExists === true) {
      const foundElement = AllPayload?.find(element => element.name === item.name);
      let foundIndex = AllPayload?.indexOf(foundElement);
      console.log("foundIndex: ", foundIndex)
      if (foundIndex === -1) {
        AllPayload.push({
          name: foundElement?.name,
          status: foundElement?.status,
          reason: foundElement?.reason,
          file: file,
          newfile: true,
          origionalname: file.name
        });
      } else {
        AllPayload[foundIndex] = {
          name: foundElement.name,
          status: foundElement.status,
          reason: foundElement.reason,
          file: file,
        }
      }
      setPayload(AllPayload);
    } else {
      AllPayload.push({
        name: item.name,
        status: item.status,
        reason: item.reason,
        file: file,
      });
      // The element with the provided index does not exist in AllPayload
      setPayload(AllPayload);
    }
    console.log("||||AllPayload: ", AllPayload)
    // const updatedDocuments = [...uploadedDocuments];
    // updatedDocuments[index] = file;
    // setUploadedDocuments(updatedDocuments);
  };

  const handleStatusChange = (e, index, item) => {
    const { value } = e.target;
    let AllPayload = [...payload];
    const elementExists = AllPayload?.some((payloadItem, payloadIndex) => payloadItem.name === item.name);
    console.log("elementExists: ", elementExists)
    if (elementExists === true) {
      const foundElement = AllPayload?.find(element => element.name === item.name);
      console.log("foundElement: ", foundElement)
      let foundIndex = AllPayload?.indexOf(foundElement);
      if (foundIndex === -1) {
        AllPayload.push({
          name: foundElement?.name,
          status: value,
          reason: foundElement?.reason,
          file: foundElement?.file === null ? "" : foundElement?.file,
        });
      } else {
        AllPayload[foundIndex] = {
          name: foundElement?.name,
          status: value,
          reason: foundElement?.reason,
          file: foundElement?.file === null ? "" : foundElement?.file,
        }
      }
      setPayload(AllPayload);
    } else {
      AllPayload.push({
        name: item.name,
        status: value,
        reason: item.reason,
        file: item.file === null ? "" : item.file
      });
      // The element with the provided index does not exist in AllPayload
      setPayload(AllPayload);
    }
    console.log("||||AllPayload: ", AllPayload)
  };

  const handleReasonChange = (e, index, item) => {
    const { value } = e.target;
    let AllPayload = [...payload];
    const elementExists = AllPayload.some((payloadItem, payloadIndex) => payloadItem.name == item.name);
    if (elementExists === true) {
      const foundElement = AllPayload.find(element => element.name === item.name);
      let foundIndex = AllPayload.indexOf(foundElement);
      if (foundIndex === -1) {
        AllPayload.push({
          name: foundElement?.name,
          status: foundElement?.status,
          reason: value,
          file: foundElement?.file === null ? "" : foundElement?.file
        });
      } else {
        console.log("foundIndex: ", foundIndex)
        AllPayload[foundIndex] = {
          name: foundElement?.name,
          status: foundElement?.status,
          reason: value,
          file: foundElement?.file === null ? "" : foundElement?.file
        }
      }
      setPayload(AllPayload);
    } else {
      AllPayload.push({
        name: item.name,
        status: item.status,
        reason: value,
        file: item.file === null ? "" : item.file
      });
      // The element with the provided index does not exist in AllPayload
      setPayload(AllPayload);
    }
    console.log("||||AllPayload: ", AllPayload)
  };

  const uploadAllDocuments = () => {
    const formData = new FormData();
    const documentData = [];
    payload.forEach((item, index) => {
      // const documentName = item.document_type;
      // const documentStatus = documentDetails[index]?.status || '';
      // const documentReason = documentDetails[index]?.reason || '';
      // const documentFile = uploadedDocuments[index] || null;
      // const fileIndex = uploadedDocuments[index] ? item.document_type : 0;

      // const document = {
      //   id: leadid,
      //   name: documentName,
      //   status: documentStatus,
      //   reason: documentReason,
      //   file: documentFile,
      //   fileindex: fileIndex
      // };
      // documentData.push(document);
      // formData.append('name', item.name)
      // formData.append('status', item.status)
      // formData.append('reason', item.reason)
      formData.append('file', item.file)
    });
    formData.append('id', leadid)
    formData.append('payload', JSON.stringify(payload));
    if (payload.length > 0) {
      fetch('https://insuranceapi-3o5t.onrender.com/api/update_all_documents', {
        method: 'post',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 200) {
            swal("Success!", "Updated", "success");
            setShowModal(false);
            getdcleads(page, perPage);
            setPayload([]);
            // window.location.reload()
          }
          else {
            swal("Error!", "Something went wrong", "error");
          }
        })
        .catch(error => {
          console.error(error)
        })
    }
    else {
      alert("No Documents")
    }
  }

  const handlewindow = (url) => {
    window.open(`https://insuranceapi-3o5t.onrender.com/documents/${url}`)
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
              <strong>Chasing Documents</strong>
              {notificationCount > 0 ? <div className='dashboardNotify'><h6>{notificationCount}</h6></div> : ''}
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
                  <th scope="col">Instant Policy</th>
                  <th scope="col">DP</th>
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
                          <td><a href="#" onClick={() => handleverification(item._id)}>{item.name}</a></td>
                          <td><a href="#" onClick={() => handleWhatsappClick(item.phoneno)}>{item.phoneno}</a></td>
                          <td><a href="#" onClick={() => handleEmailClick(item.email)}>{item.email}</a></td>
                          <td>{item['policy_type'][0]['line_of_business_name']}</td>
                          <td>{item.recived_from_data?.map(data => data.name)}</td>
                          <td>{item.assign_documentchaser_timestamp ? new Date(item.assign_documentchaser_timestamp).toString() : new Date(item.new_lead_timestamp).toString()}</td>
                          <td>{item.assign_documentchaser_timestamp ? moment(item.assign_documentchaser_timestamp).fromNow() : moment(item.new_lead_timestamp).fromNow()}</td>
                          <td>{item.instant_policy == false ? 'No' : 'Yes'} </td>
                          <td>
                            <input
                              type="checkbox"
                              name="direct_payment"
                              id="direct_payment"
                              defaultChecked={item.direct_payment == 'true'}
                              onChange={(e) => handleDirectPaymentChange(item._id, e.target.checked)}
                              required
                            />
                          </td>
                          <td className='buttons_icons'>
                            {/* <button type="button" className="btn btn-primary btn-sm " onClick={() => getleaddetails(item._id)}><i className="fa-solid fa-eye"></i></button> */}
                            <button className="btn btn-primary btn-sm " onClick={() => details(item._id, item.policy_type[0]?.line_of_business_name)}><i className='fa fa-eye'></i></button>
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

      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)} scrollable={true}>
        <Modal.Header closeButton style={{ backgroundColor: '#0D2F92', color: '#ffff' }}>
          <Modal.Title>Verification Window</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Container>
            <div>
              <Row>
                <Col lg={12} style={{ width: '100%', overflowY: 'scroll', height: '300px' }}>
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
                      {documents.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.document_type}</td>
                          <td>
                            {item?.file ? (
                              <div style={{ display: 'flex' }}>
                                <button
                                  className="btn btn-warning "
                                  style={{ marginRight: '5px' }}
                                  key={index}
                                  onClick={() => handlewindow(item.file)}
                                >
                                  View
                                </button>
                                <input name={item.document_type} type="file" onChange={(e) => handleFileUpload(e, index, item)} />
                              </div>
                            ) : <input name={item.document_type} type="file" onChange={(e) => handleFileUpload(e, index, item)} />
                            }
                            {/* {userdocuments?.length > 0 ? (
                              userdocuments.map((item1, index1) =>
                                item1.name == item.document_type ? (
                                  item1.file ? (
                                    <div style={{ display: 'flex' }}>
                                      <button
                                        className="btn btn-warning "
                                        style={{ marginRight: '5px' }}
                                        key={index1}
                                        onClick={() => handlewindow(item1?.file)}
                                      >
                                        View
                                      </button>
                                      <input name={item.document_type} type="file" onChange={(e) => handleFileUpload(e, index, item1)} />
                                    </div>
                                  ) : <input name={item.document_type} type="file" onChange={(e) => handleFileUpload(e, index, item1)} />
                                ) : ""
                              )
                            ) : (
                              <input name={item.document_type} type="file" onChange={(e) => handleFileUpload(e, index, { name: item.document_type, status: "", reason: "", file: null })} />
                            )
                            } */}

                          </td>
                          <td>
                            <select
                              name="lead_status"
                              id="lead_status"
                              defaultValue={item?.status || ""}
                              onChange={(e) => handleStatusChange(e, index, item)}
                            >
                              <option hidden>Select</option>
                              {leadStatus.map((item2, index) => (
                                <option key={index} value={item2.lead_status}>
                                  {item2.lead_status}
                                </option>
                              ))}
                            </select>

                            {/* {userdocuments != "" ? (
                              userdocuments.map((item1, index1) =>
                                item1.name == item.document_type ? (
                                  item1.status != "" ? (
                                    <select
                                      name="lead_status"
                                      id="lead_status"
                                      defaultValue={item1.status || ""}
                                      onChange={(e) => handleStatusChange(e, index, item1)}
                                    >
                                      <option hidden>Select</option>
                                      {leadStatus.map((item2, index) => (
                                        <option key={index} value={item2.lead_status}>
                                          {item2.lead_status}
                                        </option>
                                      ))}
                                    </select>
                                  ) :
                                    <select
                                      name="lead_status"
                                      id="lead_status"
                                      onChange={(e) => handleStatusChange(e, index, item1)}
                                    >
                                      <option hidden>Select</option>
                                      {leadStatus.map((item2, index) => (
                                        <option key={index} value={item2.lead_status}>
                                          {item2.lead_status}
                                        </option>
                                      ))}
                                    </select>

                                ) : null
                              )
                            ) : <select
                              name="lead_status"
                              id="lead_status"

                              onChange={(e) => handleStatusChange(e, index, { name: item.document_type, status: "", reason: "", file: null })}
                            >
                              <option hidden>Select</option>
                              {leadStatus.map((item2, index) => (
                                <option key={index} value={item2.lead_status}>
                                  {item2.lead_status}
                                </option>
                              ))}
                            </select>

                            } */}
                          </td>
                          <td>
                            <select
                              name="reason_type"
                              id="reason_type"
                              defaultValue={item?.reason || ""}
                              onChange={(e) => handleReasonChange(e, index, item)}
                            >
                              <option hidden>Select</option>
                              {reasons.map((item2, index) => (
                                <option key={index} value={item2.reason_type}>
                                  {item2.reason_type}
                                </option>
                              ))}
                            </select>
                            {/* {userdocuments != "" ? (
                              userdocuments.map((item1, index1) =>
                                item1.name == item.document_type ? (
                                  item1.reason != "" ? (
                                    <select
                                      name="reason_type"
                                      id="reason_type"
                                      defaultValue={item1.reason || ""}
                                      onChange={(e) => handleReasonChange(e, index, item1)}
                                    >
                                      <option hidden>Select1</option>
                                      {reasons.map((item2, index) => (
                                        <option key={index} value={item2.reason_type}>
                                          {item2.reason_type}
                                        </option>
                                      ))}
                                    </select>
                                  )
                                    :
                                    <select
                                      name="reason_type"
                                      id="reason_type"
                                      onChange={(e) => handleReasonChange(e, index, item1)}
                                    >
                                      <option hidden>Select2</option>
                                      {reasons.map((item2, index) => (
                                        <option key={index} value={item2.reason_type}>
                                          {item2.reason_type}
                                        </option>
                                      ))}
                                    </select>
                                ) : null
                              )
                            ) : <select
                              name="reason_type"
                              id="reason_type"
                              onChange={(e) => handleReasonChange(e, index, { name: item.document_type, status: "", reason: "", file: null })}
                            >
                              <option hidden>Select3</option>
                              {reasons.map((item2, index) => (
                                <option key={index} value={item2.reason_type}>
                                  {item2.reason_type}
                                </option>
                              ))}
                            </select>
                            } */}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </Table>
                </Col>
              </Row>
            </div>
            <Row>
              <Col lg={12}>
                <Button className='btn btn-primary mt-3 mb-3' onClick={uploadAllDocuments}>
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

                  {Array.isArray(leaddetails) &&
                    leaddetails.map((item, index) => (
                      <option key={index} value={item.dcleadstatus}
                        //  selected={item.dcleadstatus === dcleadstatus}
                        hidden
                      >
                        {item.dcleadstatus}
                      </option>
                    ))
                  }
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
                        disabled={dcleadstatus == "Open" || dcleadstatus == "Pending"}

                      >
                        <option hidden>Policy Issuer</option>
                        {pilist.map((item1, index1) => (
                          <option key={index1} value={item1.value} selected={item.dcleadforwardto == item1.label}>
                            {item1.label}
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
                        disabled={dcleadstatus == "Open" || dcleadstatus == "Forward"}

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
      </Modal>

    </>
  )
}

export default ChasingDocument