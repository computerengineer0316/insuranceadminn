import React, { useState, useEffect } from 'react'
import ReactPaginate from "react-paginate";
import { useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';

ProducerNewLead.propTypes =
{
  filterOptions: PropTypes.shape({
    location: PropTypes.string,
    lob: PropTypes.string,
    businessType: PropTypes.string,
    agent: PropTypes.string,
    dateRange: PropTypes

  })
};

ProducerNewLead.propTypes = {
  defaultOptions: PropTypes.shape({
    defaultlocation: PropTypes.string,
    defaultlob: PropTypes.string,
    defaultbusinessType: PropTypes.string,
    defaultagent: PropTypes.string,
    defaultdateRange: PropTypes,
    startdate: PropTypes,
    enddate: PropTypes,

  })
};



ProducerNewLead.propTypes = {
  updateSharedData: PropTypes.func.isRequired,
};

function ProducerNewLead({ filterOptions, defaultOptions, updateSharedData }) {

  const navigate = useNavigate();
  const [newleaddata, setNewleadData] = useState([]);
  const [leadstatus, setLeadStatus] = useState([]);
  const [leaddetails, setLeadDetails] = useState([]);
  const [line_of_business_name, setLineOfBusinessName] = useState([]);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState('');
  const [lead_status, set_Lead_Status] = useState({});
  const [direct_payment, set_Direct_Payment] = useState({});
  const [dclist, setDcList] = useState([]);
  const [assigndc, setAssignDc] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getnewleadslist(page, perPage);
      getleadstatus();
      Documentchaserlist();
    }
  }, [filterOptions]);

  const loginuser = JSON.parse(localStorage.getItem('user'));
  const loginusertype = loginuser.usertype;
  const loginuserlocation = loginuser?.location;
  // const matchid = loginuserlocation[0]['loc_id']

  let matchid = '';

  if (loginuserlocation && loginuserlocation.length > 0 && loginuserlocation[0]['loc_id']) {
    matchid = loginuserlocation[0]['loc_id'];
  }

  const getnewleadslist = async (page, perPage) => {
    setLoading(true);
    let newlocation = filterOptions.location
    let newlob = filterOptions.lob
    let newbusinessType = filterOptions.businessType
    let newagent = filterOptions.agent
    let dateRange = filterOptions.dateRange
    let startdate = defaultOptions.startdate
    let enddate = defaultOptions.enddate

    // console.log("from new lead>>>>>>>>>>>>>>>>>>>>>>newlocation", newlocation)
    // console.log("from new lead>>>>>>>>>>>>>>>>>>>>>>newlob", newlob)
    // console.log("from new lead>>>>>>>>>>>>>>>>>>>>>>newbusinessType", newbusinessType)
    // console.log("from new lead>>>>>>>>>>>>>>>>>>>>>>newagent", newagent)


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
    const loginuserlocation = loginuser?.location;
    // const matchid = loginuserlocation[0]['loc_id']
    let matchid = '';

    if (loginuserlocation && loginuserlocation.length > 0 && loginuserlocation[0]['loc_id']) {
      matchid = loginuserlocation[0]['loc_id'];
    }

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        page: page,
        limit: perPage,
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

    if (loginusertype == "66068569e8f96a29286c956e") {
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?producer=new`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const total = data.total;
          setNotificationCount(total)
          const slice = total / perPage;
          const pages = Math.ceil(slice);
          setPageCount(pages);
          const list = data.data;
          setNewleadData(list)
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          setLoading(false); // Hide the loader
        });

    }

    if (loginusertype == "64622470b201a6f07b2dff22") {
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?producer=new&dashboardType=producerDashbord`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const total = data.total;
          setNotificationCount(total)
          const slice = total / perPage;
          const pages = Math.ceil(slice);
          setPageCount(pages);
          const list = data.data;
          setNewleadData(list)
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          setLoading(false); // Hide the loader
        });

    }

  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getnewleadslist(selectedPage + 1, perPage, localStorage.getItem('lob'));
  };

  const getleadstatus = async () => {
    const userdt = JSON.parse(localStorage.getItem('user'));
    const usertype = userdt.usertype;
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_lead_status_name?type=salesAdvisor', {
      method: 'post',
      body: JSON.stringify({ usertype: usertype }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
    )
    result = await result.json();
    setLeadStatus(result.data)
  }

  const getleaddetails = async (ParamValue) => {
    setId(ParamValue)
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_new_lead_detailsbyid', {
      method: 'post',
      body: JSON.stringify({ ParamValue }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    setLeadDetails(result.data[0])
    setLineOfBusinessName(result.data[0].policy_type[0].line_of_business_name)
    setShowModal(true);
  }

  const startFrom = (page - 1) * perPage;

  const handleEmailClick = (email) => {
    const mailtoLink = `mailto:${email}`;
    window.open(mailtoLink);
  }

  const handleWhatsappClick = (phoneNumber) => {
    const whatsappLink = `https://wa.me/${phoneNumber}`;
    window.open(whatsappLink);
  }

  const Documentchaserlist = () => {
    const requestOptions =
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
    };
    // fetch(`https://insuranceapi-3o5t.onrender.com/api/getDocumentChaser`, requestOptions)
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getUserAccordingUserType?userType=dacumentsChaser`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const agentdt = data.data;
        const agent_len = agentdt.length;
        const agent_list = [];
        for (let i = 0; i < agent_len; i++) {
          const agent_obj = { label: agentdt[i].name, value: agentdt[i]._id };
          agent_list.push(agent_obj);
        }
        setDcList(agent_list);
      });
  }

  const handleDirectPaymentChange = (itemId, checked) => {
    set_Direct_Payment(prevState => ({
      ...prevState,
      [itemId]: checked
    }));
  };

  const handleLeadStatusChange = (itemId, value) => {
    set_Lead_Status(prevState => ({
      ...prevState,
      [itemId]: value
    }));
    setLeadStatusByItemId((prevState) => ({
      ...prevState,
      [itemId]: value,
    }));
  };

  const handledcagentchange = (itemId, value) => {
    setAssignDc(prevState => ({
      ...prevState,
      [itemId]: value
    }));
  };

  const getDcAgentName = (id) => {
    const selectedDCItem = dclist.find((dcItem) => dcItem.value === id);
    return selectedDCItem ? selectedDCItem.label : "";
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const userdt = JSON.parse(localStorage.getItem('user'));
    const assigningagent = userdt._id;
    const directPayment = JSON.stringify(direct_payment) === '{}' ? null : direct_payment;
    const leadStatus = JSON.stringify(lead_status) === '{}' ? null : lead_status;
    const assignDc = assigndc === '' ? null : assigndc;
    const itemIds = new Set(Object.keys(directPayment || {}).concat(Object.keys(leadStatus || {}), Object.keys(assignDc || {})));



    for (const itemId of itemIds) {
      const directPaymentValue = direct_payment[itemId];
      const leadStatusValue = lead_status[itemId];
      console.log('leadstatus', leadStatusValue)

      const assignDcValue = assigndc[itemId];
      console.log('assigndc', assignDcValue)

      if (leadStatusValue === 'Forward') {
        if (assignDcValue === '' || assignDcValue === null || assignDcValue === undefined) {
          alert('Please select DC agent')
          return false;
        }
      }
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
          id: itemId,
          direct_payment: directPaymentValue,
          lead_status: leadStatusValue,
          forward_to: assignDcValue,
          assigningagent: assigningagent
        }),
        headers: {
          'Content-Type': 'application/json',
        },


      }


      // return false;


      fetch(`https://insuranceapi-3o5t.onrender.com/api/update_new_lead_details`, requestOptions)
        .then(response => response.json())
        .then(data => {
          getnewleadslist(page, perPage);
          updateSharedData(getnewleadslist(page, perPage));
        }).catch(error => {
          console.log(error);
        })
    }
  }

  console.log("newleaddata>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", newleaddata)


  // const handleNameClick = (item) => {
  //   try {
  //     console.log(item._id, 'check policy')
  //     if (item.type_of_policy == '6418643bf42eaf5ba1c9e0ef') {
  //       //motor
  //       window.open(`/MotorQuote?id=${item._id}`, '_blank')
  //     } else if (item.type_of_policy == '6418645df42eaf5ba1c9e0f6') {
  //       //travel
  //       window.open(`/Travelquotes?id=${item._id}`, '_blank')
  //     } else if (item.type_of_policy == '641bf214cbfce023c8c76762') {
  //       //medical
  //       window.open(`/app/lead/MedicalQuote`, '_blank')
  //     } else if (item.type_of_policy == '641bf0a2cbfce023c8c76724') {
  //       //home
  //       window.open(`/app/lead/HomeQuote`)
  //     } else if (item.type_of_policy == '641bf0bbcbfce023c8c76739') {
  //       //yacht
  //       window.open(`/app/lead/YachtQuote`, '_blank')
  //       // } else {
  //       //   navigate(`/app/lead/MotorQuote`, '_blank')
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  const handleNameClick = (item) => {
    try {
      console.log(item)
      window.open(item, '_blank')
    } catch (err) {
      console.log(err)
    }
  }

  const [leadStatusByItemId, setLeadStatusByItemId] = useState({});

  const [showlink, setShowlink] = useState(false);
  const [linkdetails, setLinkDetails] = useState('');
  const handleshowlink = (item) => {
    console.log(item)
    setLinkDetails(item)
    setShowlink(true);
  }

  const handleCopyToClipboard = () => {
    // Create a new textarea element to copy the content to the clipboard
    const textarea = document.createElement('textarea');
    textarea.value = linkdetails;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Link copied to clipboard!');
  };


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
    if (lob === 'Other Insurance') {
      window.open(`/OtherInsuranceLeaddetails?id=${id}`, '_blank')
    }

  }



  return (
    <>
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div style={{ position: 'relative' }} className="card-header new_leads">
              <strong>New Leads</strong>
              {notificationCount > 0 ? <div className='dashboardNotify'><h6>{notificationCount}</h6></div> : ''}
            </div>
          </Accordion.Header>
          <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
            <table className="table table-bordered">
              <thead >
                <tr className="table-info">
                  <th scope="col">Sr</th>
                  <th scope="col">Name</th>
                  <th scope="col">Phone No.</th>
                  <th scope="col">Email-ID</th>
                  <th scope="col">Nationality</th>
                  <th scope="col">Assigned Date & Time</th>
                  <th scope="col">Aging (as of today)</th>
                  <th scope="col">Type of Policy</th>
                  <th scope="col">Business Type</th>
                  <th scope="col">Sales Advisor</th>
                  <th scope="col">Producer</th>
                  <th scope="col">Link</th>
                  {/* <th scope="col">DP</th>
                  <th scope="col">Lead Status</th>
                  <th scope="col">Forward To</th> */}
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <div className="loader-container">
                    <ClipLoader color="#ED1C24" loading={loading} size={50} />
                  </div>
                ) : (
                  <>
                    {newleaddata.length > 0 ? (
                      newleaddata?.map((item, index) => (
                        <tr key={index}>
                          <td>{startFrom + index + 1}</td>
                          <td>{item.name}</td>
                          {/* <td onClick={() => handleNameClick(item.buisnessEntityCostomerLink)}><a href='#'>{item.name}</a></td> */}
                          <td><a href="#" onClick={() => handleWhatsappClick(item.phoneno)}>{item.phoneno}</a></td>
                          <td><a href="#" onClick={() => handleEmailClick(item.email)}>{item.email}</a></td>
                          <td>{item.nationality}</td>
                          <td>{item.assign_salesadvisor_timestamp ? new Date(item.assign_salesadvisor_timestamp).toString() : new Date(item.new_lead_timestamp).toString()}</td>
                          <td>{item.assign_salesadvisor_timestamp ? moment(item.assign_salesadvisor_timestamp).fromNow() : moment(item.new_lead_timestamp).fromNow()}</td>
                          <td>{Array.isArray(item.policy_type) && item.policy_type.length > 0 ? item.policy_type[0]['line_of_business_name'] : "-"}</td>
                          <td>{item.business_type}</td>
                          <td>{item.assigned_agent_info != "" ? item.assigned_agent_info[0]?.name : "-"}</td>
                          <td>{item.producerdetail != "" ? item.producerdetail[0]?.name : "-"}</td>

                          <td className='buttons_icons1'>
                            <button type="button" className="btn btn-primary btn-sm " onClick={() => handleshowlink(item.buisnessEntityCostomerLink)}><i className="fa-solid fa-link"></i></button>
                          </td>
                          <td className='buttons_icons1'>
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
            <section>
              {/* <button className='save-btn' onClick={handlesubmit}>Save </button> */}
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
            </section>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Lead Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" className="form-control" id="name" name="name" value={leaddetails.name} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="text" className="form-control" id="email" name="email" value={leaddetails.email} />
                </div>
              </div>
            </Row>
            <Row>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="phoneno">Phone No.</label>
                  <input type="text" className="form-control" id="phoneno" name="phoneno" value={leaddetails.phoneno} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="dob">Line Of Business</label>
                  <input type="text" className="form-control" id="lob" name="lob" value={line_of_business_name} />
                </div>
              </div>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size='lg' show={showlink} onHide={() => setShowlink(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="name"></label>
                  <textarea className="form-control" id="address" name="address" value={linkdetails} readOnly>
                    {linkdetails && (
                      <a href={linkdetails} target="_blank" rel="noopener noreferrer">
                        {linkdetails}
                      </a>
                    )}
                  </textarea>
                </div>
              </div>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCopyToClipboard}>
            Copy Link
          </Button>
          <Button variant="secondary" onClick={() => setShowlink(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ProducerNewLead