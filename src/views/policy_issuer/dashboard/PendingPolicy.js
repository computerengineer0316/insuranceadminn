import React from 'react'
import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { ClipLoader } from 'react-spinners';

PendingPolicy.propTypes =
{
  filterOptions: PropTypes.shape({
    location: PropTypes.string,
    lob: PropTypes.string,
    businessType: PropTypes.string,
    agent: PropTypes.string,
    dateRange: PropTypes
  })
};

PendingPolicy.propTypes =
{
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

PendingPolicy.propTypes =
{
  updateSharedData: PropTypes.func.isRequired,
};

function PendingPolicy({ filterOptions, defaultOptions, updateSharedData }) {
  const navigate = useNavigate();
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pileads, setpileads] = useState([]);
  const [show, setShow] = useState(false);
  const [modalid, setmodalid] = useState('');
  const [loading, setLoading] = useState(false);
  const [finalprice, setFinalPrice] = useState({});
  const [purchasedPolicy, setPurchasedPolicy] = useState({});
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [email, setEmail] = useState('');
  const [showdetailsmodal, setShowDetailsModal] = useState(false);
  const [userdata, setUserdata] = useState([])
  const [notificationCount, setNotificationCount] = useState(0)

  const getagent = JSON.parse(localStorage.getItem('user'));
  const agentid = getagent?._id;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getpileads(page, perPage);
    }
  }, [filterOptions]);

  const startFrom = (page - 1) * perPage;

  // const getfUCNTIOHN = () => {
  //   RES.DATA
  //   setTo(res.data.aemail)
  // }

  const getpileads = async (page, perPage) => {
    setLoading(true);
    let newlocation = filterOptions.location;
    let newlob = filterOptions.lob;
    let newbusinessType = filterOptions.businessType;
    let newagent = filterOptions.agent;
    let dateRange = filterOptions.dateRange;
    let startdate = defaultOptions.startdate;
    let enddate = defaultOptions.enddate;

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
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?policyIssuer=pendingPolicyes&dashboardType=policyIssuerDashbord`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const total = data.total;
          setNotificationCount(total)
          const slice = total / perPage;
          const pages = Math.ceil(slice);
          setPageCount(pages);
          const list = data.data;
          setpileads(list)
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          setLoading(false); // Hide the loader
        });
    }

    if (loginusertype == "64622470b201a6f07b2dff22") {
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?policyIssuer=pendingPolicyes&dashboardType=policyIssuerDashbord`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const total = data.total;
          setNotificationCount(total)
          const slice = total / perPage;
          const pages = Math.ceil(slice);
          setPageCount(pages);
          const list = data.data;
          setpileads(list)
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
    getpileads(selectedPage + 1, perPage, localStorage.getItem('lob'));
  };

  const handleEmailClick = (email) => {
    const mailtoLink = `mailto:${email}`;
    window.open(mailtoLink);
  }

  const handleWhatsappClick = (phoneNumber) => {
    const whatsappLink = `https://wa.me/${phoneNumber}`;
    window.open(whatsappLink);
  }

  const handleInputChange = (itemId, value) => {
    setFinalPrice(prevState => ({
      ...prevState,
      [itemId]: value
    }));
  };

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      const final_price = JSON.stringify(finalprice) === '{}' ? null : finalprice;
      for (const itemId in final_price) {
        const finalpriceValue = final_price[itemId];
        const requestOptions = {
          method: 'POST',
          body: JSON.stringify({ id: itemId, final_price: finalpriceValue }),
          headers: {
            'Content-Type': 'application/json',
          },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_final_price`, requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.status === 200) {
              swal('Success', 'Updated Successfully', 'success');
              getpileads(page, perPage);
            }
          }).catch((error) => {
            console.log(error)
          });
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handlemodal = (id, item) => {
    console.log(item)
    setmodalid(id)
    setTo(item.email)
    setUserdata(item)
    setShow(true)
  }

  const handledocumentfileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleEmailSubmit = (e) => {
    try {
      // || message === '' || files.length === 0

      if (to === '') {
        swal('Warning', 'Please fill To fields', 'warning');
        return false;
      }
      else if (!to.includes('@') || !to.includes('.')) {
        swal('Warning', 'Please enter a valid email address', 'warning');
        return false;
      }
      else if (message === '') {
        swal('Warning', 'The email body is empty', 'warning');
        return false;
      }
      else if (files.length === 0) {
        swal('Warning', 'Please upload the document', 'warning');
        return false;
      }

      else {

        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append('purchasedPolicy', purchasedPolicy);
        formData.append('to', to);
        formData.append('cc', cc);
        formData.append('message', message);
        formData.append('id', modalid);
        formData.append('policy_issued_by', agentid);
        formData.append('policy_issued_status', 1);
        formData.append('lead_status', "Closed");
        files.forEach((file, index) => {
          formData.append('file', file);
        });

        const currentDate = new Date();
        formData.append('policy_issued_date', currentDate.toISOString());

        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        formData.append('policy_expiry_date', expiryDate.toISOString());

        fetch('https://insuranceapi-3o5t.onrender.com/api/Send_Email', {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === 200) {
              const lobtype = userdata?.policy_type[0]?.line_of_business_name;
              fetch('https://insuranceapi-3o5t.onrender.com/api/addThiredPartyComission', {
                method: 'POST',
                body: JSON.stringify({ leadId: modalid, lobType: lobtype }),
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              swal('Success', 'Email Sent Successfully', 'success');
              getpileads(page, perPage);
              setShow(false)
              updateSharedData(getpileads(page, perPage));
            }
          })
          .catch(error => {
            console.error('Error:', error);
          })
          .finally(() => {
            setLoading(true);
          })
      }

    } catch (error) {
      console.log(error)
    }

  };

  const callApi = async (id) => {
    console.log(id)
    console.log('api called')
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
              <strong>Pending Policies</strong>
              {notificationCount > 0 ? <div className='dashboardNotify'><h6>{notificationCount}</h6></div> : ''}
            </div>
          </Accordion.Header>
          <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
            <table className="table table-bordered">
              <thead >
                <tr className="table-info">
                  <th scope="col">Sr</th>
                  <th scope="col">Client Name</th>
                  <th scope="col">Contact Number</th>
                  <th scope="col">Email Address</th>
                  <th scope="col">Received</th>
                  <th scope="col">LOB</th>
                  <th scope="col">Time & Date Recieved</th>
                  <th scope="col">Final Price</th>
                  <th scope="col">View</th>
                  <th scope="col">Issue Policy</th>
                </tr>
              </thead>
              <tbody>
                {
                  pileads.length > 0 ? (
                    pileads.map((item, index) => (
                      <tr key={index}>
                        <td>{startFrom + index + 1}</td>
                        <td >{item.name}</td>
                        <td><a href="#" onClick={() => handleWhatsappClick(item.phoneno)}>{item.phoneno}</a></td>
                        <td><a href="#" onClick={() => handleEmailClick(item.email)}>{item.email}</a></td>
                        <td>{item.dc_recived_from[0]?.name}</td>
                        <td>{item.policy_type[0]?.line_of_business_name}</td>
                        <td>{item.assign_policyissuer_timestamp ? new Date(item.assign_policyissuer_timestamp).toString() : new Date(item.new_lead_timestamp).toString()}</td>
                        {/* <td>{item.assign_salesadvisor_timestamp ? moment(item.assign_salesadvisor_timestamp).fromNow() : moment(item.new_lead_timestamp).fromNow()}</td> */}
                        <td>
                          <input
                            type="text"
                            placeholder="Final Price"
                            defaultValue={item.final_price}
                            onChange={(e) => handleInputChange(item._id, e.target.value)}
                          />
                        </td>
                        <td><button className="small-btn" onClick={() => details(item._id, item.policy_type[0]?.line_of_business_name)}><i className='fa fa-eye'></i></button></td>

                        {/* item.api_integrated && item.api_integrated.length ? (
                            item.api_integrated.map((api, index) => (
                              item.policy_type[0]?._id === api.line_of_business_id ? (
                                api.api_integrate == 1 ? (
                                  <td key={index}>
                                    <button className="small-btn" onClick={() => callApi(api._id)}>Call API</button>
                                  </td>
                                ) : (
                                  <td key={index}>
                                    <button className="small-btn" onClick={() => handlemodal(item._id, item)}>Issue Policy</button>
                                  </td>
                                )
                              ) : "1"
                            ))
                          ) : ( */}
                        <td>
                          <button className="small-btn" onClick={() => handlemodal(item._id, item)}>Issue Policy</button>
                        </td>
                        {/* ) */}

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
              <button className='save-btn' onClick={handleSubmit}>Save</button>
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
      <Modal size='lg' show={show} onHide={() => setShow(false)} scrollable={true}>
        {
          loading ? (
            <>
              <Modal.Header closeButton style={{ backgroundColor: '#0D2F92', color: '#ffff' }}>
                <Modal.Title>Issue Policy</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="loader-container">
                  <ClipLoader color="#ED1C24" loading={loading} size={50} />
                </div>
              </Modal.Body>
            </>

          ) : (
            <>
              <Modal.Header closeButton style={{ backgroundColor: '#0D2F92', color: '#ffff' }}>
                <Modal.Title>Issue Policy</Modal.Title>
              </Modal.Header>
              <Modal.Body >

                <Container>
                  <Row>
                    <label><strong>Purchased Policy Number</strong></label>
                    <input type="text" className='form-control' name="purchasedPolicy" id="purchasedPolicy" onChange={(e) => setPurchasedPolicy(e.target.value)} />
                  </Row>
                  <Row>
                    <label><strong>To <span style={{ color: 'red' }}>&#42;</span></strong></label>
                    <input type="email" className='form-control' name="to" id="to" defaultValue={to} onChange={(e) => setTo(e.target.value)} required />
                  </Row>
                  <Row>
                    <label><strong>CC</strong></label>
                    <input type="text" className='form-control' name="cc" id="cc" value={cc} onChange={(e) => setCc(e.target.value)} />
                  </Row>

                  <Row>
                    <label><strong>Message <span style={{ color: 'red' }}>&#42;</span></strong></label>
                    {/* <textarea className='form-control' name="message" id="message" onChange={(e) => setMessage(e.target.value)} cols="30" rows="10" required>

                      Dear {userdata.name},

                      We are pleased to inform you that your insurance policy has been successfully issued. Below is the summary of your policy details:

                      Policy Number: [Policy Number]
                      Policy Start Date: [Policy Start Date]
                      Policy End Date: [Policy End Date]

                      Please review the policy document attached for a comprehensive understanding of your coverage and terms. If you have any questions or require further assistance, feel free to contact our customer support team at [Customer Support Email] or [Customer Support Phone Number].

                      Thank you for choosing [Your Insurance Company Name] for your insurance needs. We look forward to serving you.

                      Best regards,
                      [Your Name]
                      [Your Title]
                      [Your Insurance Company Name]
                      [Contact Information]

                    </textarea> */}
                    <textarea
                      className='form-control'
                      name="message"
                      id="message"
                      onChange={(e) => setMessage(e.target.value)}
                      cols="30"
                      rows="10"
                      required
                    >
                      {`
  Dear ${userdata?.name},

  We are pleased to inform you that your insurance policy has been successfully issued. Below is the summary of your policy details:

  Policy Number: [Policy Number]
  Policy Start Date: [Policy Start Date]
  Policy End Date: [Policy End Date]

  Please review the policy document attached for a comprehensive understanding of your coverage and terms. If you have any questions or require further assistance, feel free to contact our customer support team at [Customer Support Email] or [Customer Support Phone Number].

  Thank you for choosing [Your Insurance Company Name] for your insurance needs. We look forward to serving you.

  Best regards,
  [Your Name]
  [Your Title]
  [Your Insurance Company Name]
  [Contact Information]
  `}
                    </textarea>


                  </Row>
                  <Row>
                    <label><strong>Upload Documents <span style={{ color: 'red' }}>&#42;</span></strong></label>
                    <input type="file" className='form-control' name="emaildocumentfiles" id="emaildocumentfiles" multiple required onChange={handledocumentfileChange} />
                  </Row>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleEmailSubmit}>
                  Submit
                </Button>
                <Button variant="dark" onClick={() => setShow(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </>
          )}
      </Modal>

    </>
  )
}

export default PendingPolicy;