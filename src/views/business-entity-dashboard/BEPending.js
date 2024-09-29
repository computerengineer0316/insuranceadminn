import React, { useState, useEffect } from 'react'
import ReactPaginate from "react-paginate";
import { useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';

BEPending.propTypes =
{
  filterOptions: PropTypes.shape({
    location: PropTypes.string,
    lob: PropTypes.string,
    businessType: PropTypes.string,
    agent: PropTypes.string,
    dateRange: PropTypes
  })
};

BEPending.propTypes = {
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

BEPending.propTypes =
{
  updateSharedData: PropTypes.func.isRequired,
};

function BEPending({ filterOptions, defaultOptions, updateSharedData }) {
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

  const getnewleadslist = async (page, perPage) => {
    let newlocation = filterOptions.location
    let newlob = filterOptions.lob
    let newbusinessType = filterOptions.businessType
    let newagent = filterOptions.agent
    let dateRange = filterOptions.dateRange
    let startdate = defaultOptions.startdate
    let enddate = defaultOptions.enddate

    if (newlocation == null || newlocation == undefined || !Array.isArray(newlocation) || newlocation.length === 0) {
      // newlocation = defaultOptions.defaultlocation.map((item) => item.value);
      newlocation = [];
    }
    else {
      newlocation = newlocation.map((item) => item.value);
    }

    if (newlob == null || newlob == undefined || !Array.isArray(newlob) || newlob.length === 0) {
      // newlob = defaultOptions.defaultlob.map((item) => item.value);
      newlob = [];
    }
    else {
      newlob = newlob.map((item) => item.value);
    }

    if (newbusinessType == null || newbusinessType == undefined || !Array.isArray(newbusinessType) || newbusinessType.length === 0) {
      // newbusinessType = defaultOptions.defaultbusinessType.map((item) => item.value);
      newbusinessType = [];

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

    if (loginusertype == "646224eab201a6f07b2dff36") {
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?leadType=pendingPolicues`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const total = data.total;
          const slice = total / perPage;
          const pages = Math.ceil(slice);
          setPageCount(pages);
          const list = data.data;
          setNewleadData(list)
        })
        .catch((error) => {
          console.log(error)
        });
    }

    if (loginusertype == "64622470b201a6f07b2dff22") {
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?leadType=pendingPolicues&dashboardType=salesAdvisorDashboard`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const total = data.total;
          const slice = total / perPage;
          const pages = Math.ceil(slice);
          setPageCount(pages);
          const list = data.data;
          setNewleadData(list)
        })
        .catch((error) => {
          console.log(error)
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
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getDocumentChaser`, requestOptions)
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
          console.log(data);
          getnewleadslist(page, perPage);
          updateSharedData(getnewleadslist(page, perPage));
        }
        );
    }
  }

  return (
    <>
      <Accordion>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <div className="card-header new_leads">
              <strong>Pending For Issuance</strong>
            </div>
          </Accordion.Header>
          <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
            <table className="table solid salesdashboards1234">
              <thead >
                <tr className="table-info">
                  <th scope="col">Sr#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Phone No.</th>
                  <th scope="col">Email-ID</th>
                  <th scope="col">Assigned Date & Time</th>
                  <th scope="col">Aging (as of today)</th>
                  <th scope="col">Type of Policy</th>
                  <th scope="col">DP</th>
                  {/* <th scope="col">Lead Status</th>
                  <th scope="col">Forward To</th> */}
                  <th scope="col">Assigned Stage</th>
                  <th scope="col">Assigned To</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                {newleaddata.length > 0 ? (
                  newleaddata.map((item, index) => (

                    <tr key={index}>
                      <td>{startFrom + index + 1}</td>
                      <td>{item.name}</td>
                      <td><a href="#" onClick={() => handleWhatsappClick(item.phoneno)}>{item.phoneno}</a></td>
                      <td><a href="#" onClick={() => handleEmailClick(item.email)}>{item.email}</a></td>
                      <td>{item.assign_salesadvisor_timestamp ? new Date(item.assign_salesadvisor_timestamp).toString() : new Date(item.new_lead_timestamp).toString()}</td>
                      <td>{item.assign_salesadvisor_timestamp ? moment(item.assign_salesadvisor_timestamp).fromNow() : moment(item.new_lead_timestamp).fromNow()}</td>
                      <td>{item['policy_type'][0]['line_of_business_name']}</td>
                      <td>
                        <input
                          type="checkbox"
                          name="direct_payment"
                          id="direct_payment"
                          defaultChecked={item.direct_payment == 'true'}
                          onChange={(e) => handleDirectPaymentChange(item._id, e.target.checked)}
                          required
                          readOnly
                        />
                      </td>
                      {/* <td><select name="lead_status" id="lead_status"
                        onChange={(e) => handleLeadStatusChange(item._id, e.target.value)}
                      >
                        <option value="" hidden>{item.lead_status}</option>
                        {leadstatus.map((item, index) => (
                          <option key={index} value={item.lead_status}>{item.lead_status}</option>
                        ))}
                      </select>
                      </td> */}
                      {/* <td><select name="lead_status" id="lead_status"
                        onChange={(e) => handledcagentchange(item._id, e.target.value)}
                      >
                        <option value="" hidden>
                        {item.forward_to === "" ? 'Document Chaser' : getDcAgentName(item.forward_to)}
                          </option>
                        {dclist.map((item, index) => (
                          <option key={index} value={item.value}>{item.label}</option>
                        ))}
                      </select>
                      </td> */}
                      {/* <td>{item.phoneno.substr(0, 6) + "..."}</td>  */}

                      <td>
                        {item.assigned_agent_info != "" ? (
                          item.forward_to_info != "" ? (
                            item.dc_forward_to_info != "" ? (
                              item.dcforward_to_type_info[0]?.usertype || "-"
                            ) : (
                              item.forward_to_type_info[0]?.usertype || "-"
                            )
                          ) : (
                            item.assigned_type_info[0]?.usertype || "-"
                          )
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        {item.assigned_agent_info != "" ? (
                          item.forward_to_info != "" ? (
                            item.dc_forward_to_info != "" ? (
                              item.dc_forward_to_info[0]?.name || "-"
                            ) : (
                              item.forward_to_info[0]?.name || "-"
                            )
                          ) : (
                            item.assigned_agent_info[0]?.name || "-"
                          )
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className='buttons_icons'>
                        <button type="button" className="btn btn-primary btn-sm " onClick={() => getleaddetails(item._id)}><i className="fa-solid fa-eye"></i></button>
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
    </>
  )
}

export default BEPending