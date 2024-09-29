import React, { useState, useEffect } from 'react';
import ReactPaginate from "react-paginate";
import { useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';

BEIssued.propTypes =
{
  filterOptions: PropTypes.shape({
    location: PropTypes.string,
    lob: PropTypes.string,
    businessType: PropTypes.string,
    agent: PropTypes.string,
    dateRange: PropTypes
  })
};

BEIssued.propTypes = {
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

function BEIssued({ filterOptions, defaultOptions }) {
  const navigate = useNavigate();
  const [newleaddata, setNewleadData] = useState([]);
  const [leaddetails, setLeadDetails] = useState([]);
  const [line_of_business_name, setLineOfBusinessName] = useState([]);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getclosedleadslist(page, perPage);
    }
  }, [filterOptions]);

  const getclosedleadslist = async (page, perPage) => {
    setLoading(true);
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
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?leadType=Closed`, requestOptions)
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
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (loginusertype == "64622470b201a6f07b2dff22") {
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?leadType=Closed&dashboardType=salesAdvisorDashboard`, requestOptions)
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
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getclosedleadslist(selectedPage + 1, perPage, localStorage.getItem('lob'));
  };

  const getleaddetails = async (ParamValue) => {
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

  return (
    <>
      <Accordion>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <div className="card-header new_leads">
              <strong>Issued Policies</strong>
            </div>
          </Accordion.Header>
          <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
            <table className="table solid salesdashboards1234">
              <thead >
                <tr className="table-info">
                  <th scope="col">Sr</th>
                  <th scope="col">Name</th>
                  <th scope="col">Phone No.</th>
                  <th scope="col">Email-ID</th>
                  <th scope="col">Assigned Date & Time</th>
                  <th scope="col">Aging (as of today)</th>
                  <th scope="col">Type of Policy</th>
                  <th scope="col">Business Type</th>
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
                      newleaddata.map((item, index) => (

                        <tr key={index}>
                          <td>{startFrom + index + 1}</td>
                          <td>{item.name}</td>
                          <td><a href="#" onClick={() => handleWhatsappClick(item.phoneno)}>{item.phoneno}</a></td>
                          <td><a href="#" onClick={() => handleEmailClick(item.email)}>{item.email}</a></td>
                          <td>{item.assign_salesadvisor_timestamp ? new Date(item.assign_salesadvisor_timestamp).toString() : new Date(item.new_lead_timestamp).toString()}</td>
                          <td>{item.assign_salesadvisor_timestamp ? moment(item.assign_salesadvisor_timestamp).fromNow() : moment(item.new_lead_timestamp).fromNow()}</td>
                          <td>{item['policy_type'][0]['line_of_business_name']}</td>
                          <td>{item.business_type}</td>
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
                  </>
                )}
              </tbody>
            </table>
            <section>
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

export default BEIssued;