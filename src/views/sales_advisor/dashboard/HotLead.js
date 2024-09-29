import React, { useState, useEffect } from 'react'
import ReactPaginate from "react-paginate";
import { useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';

HotLead.propTypes =
{
  filterOptions: PropTypes.shape({
    location: PropTypes.string,
    lob: PropTypes.string,
    businessType: PropTypes.string,
    agent: PropTypes.string,
    dateRange: PropTypes

  })
};

HotLead.propTypes = {
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

HotLead.propTypes = {
  updateSharedData: PropTypes.func.isRequired,
};

function HotLead({ filterOptions, defaultOptions, updateSharedData }) {
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
  const [lead_status, set_Lead_Status] = useState('');
  const [direct_payment, set_Direct_Payment] = useState('');
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
  const SADashboardPermission = loginuser?.dashboard_permission[0]?.sa_dashboard

  // const matchid = loginuserlocation[0]['loc_id']

  let matchid = '';

  if (loginuserlocation && loginuserlocation.length > 0 && loginuserlocation[0]['loc_id']) {
    matchid = loginuserlocation[0]['loc_id'];
  }

  const getnewleadslist = async (page, perPage) => {
    try {
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

      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
          page: page,
          limit: perPage,
          location: newlocation,
          lob: newlob,
          business_type:
            newbusinessType,
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
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?leadType=Hot&dashboardType=salesAdvisorDashboard`, requestOptions)
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
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?leadType=Hot&dashboardType=salesAdvisorDashboard`, requestOptions)
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
    catch (error) {
      console.log(error)
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

  const handleNameClick = (item) => {
    try {
      console.log(item)
      window.open(item, '_blank')
    } catch (err) {
      console.log(err)
    }
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
    if (value != 'Forward') {
      setAssignDc('')
      let a = document.getElementById(itemId)
      a.value = ''
    }
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
      const assignDcValue = assigndc[itemId];

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
      };
      fetch(`https://insuranceapi-3o5t.onrender.com/api/update_new_lead_details`, requestOptions)
        .then(response => response.json())
        .then(data => {
          getnewleadslist(page, perPage);
          updateSharedData(getnewleadslist(page, perPage));
        }
        );
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
      <Accordion>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <div style={{ position: 'relative' }} className="card-header new_leads">
              <strong>Hot Leads</strong>
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
                  <th scope="col">Link</th>
                  <th scope="col">DP</th>
                  <th scope="col">Lead Status</th>
                  <th scope="col">Forward To</th>
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
                    {newleaddata.length > 0 ? (
                      newleaddata.map((item, index) => (

                        <tr key={index}>
                          <td>{startFrom + index + 1}</td>
                          <td onClick={() => handleNameClick(item.buisnessEntityCostomerLink)}> {item.name}</td>
                          <td><a href="#" onClick={() => handleWhatsappClick(item.phoneno)}>{item.phoneno}</a></td>
                          <td><a href="#" onClick={() => handleEmailClick(item.email)}>{item.email}</a></td>
                          <td>{item.nationality}</td>
                          <td>{item.assign_salesadvisor_timestamp ? new Date(item.assign_salesadvisor_timestamp).toString() : new Date(item.new_lead_timestamp).toString()}</td>
                          <td>{item.assign_salesadvisor_timestamp ? moment(item.assign_salesadvisor_timestamp).fromNow() : moment(item.new_lead_timestamp).fromNow()}</td>
                          <td>{item['policy_type'][0]['line_of_business_name']}</td>
                          {/* { matchid != '64116415591c2f02bcddf51e' &&
                          <td>
                            <a href={item.buisnessEntityCostomerLink} target="_blank" rel="noopener noreferrer">
                              {item.buisnessEntityCostomerLink}
                              </a>
                          </td>
                          } */}
                          <td className='buttons_icons'>
                            <button type="button" className="btn btn-primary btn-sm " onClick={() => handleshowlink(item.buisnessEntityCostomerLink)}><i className="fa-solid fa-link"></i></button>
                          </td>
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
                          <td><select name="lead_status" id="lead_status"
                            onChange={(e) => handleLeadStatusChange(item._id, e.target.value)}
                          >
                            <option value="" hidden>{item.lead_status}</option>
                            {leadstatus.map((item, index) => (
                              <option key={index} value={item.lead_status}>{item.lead_status}</option>
                            ))}
                          </select>
                          </td>


                          <td><select name="lead_status" id={item._id}
                            onChange={(e) => handledcagentchange(item._id, e.target.value)}
                            disabled={leadStatusByItemId[item._id] !== 'Forward'}
                          >
                            <option value="" hidden>
                              {item.forward_to == undefined || item.forward_to == "" || item.forward_to == null ? 'Document Chaser' : getDcAgentName(item.forward_to)}
                            </option>
                            {dclist.map((item, index) => (
                              <option key={index} value={item.value}>{item.label}</option>
                            ))}
                          </select>
                          </td>



                          {/* <td>{item.phoneno.substr(0, 6) + "..."}</td>  */}
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
            <section>
              {/* <p style={{justifyContent:'flex-start'}}><strong>Total : {total}</strong></p> */}
              <button className='save-btn' onClick={handlesubmit}>Save </button>
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

export default HotLead;