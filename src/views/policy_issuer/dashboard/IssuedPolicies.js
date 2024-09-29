import React from 'react'
import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { differenceInDays, parseISO } from 'date-fns';

IssuedPolicies.propTypes =
{
  filterOptions: PropTypes.shape({
    location: PropTypes.string,
    lob: PropTypes.string,
    businessType: PropTypes.string,
    agent: PropTypes.string,
    dateRange: PropTypes
  })
};

IssuedPolicies.propTypes = {
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

function IssuedPolicies({ filterOptions, defaultOptions }) {
  const navigate = useNavigate();
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pileads, setpileads] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0)
  const getagent = JSON.parse(localStorage.getItem('user'));
  const agentid = getagent._id;

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

  const getpileads = async (page, perPage) => {
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

    const requestOptions =
    {
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

      await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?policyIssuer=issuedPolicy&dashboardType=policyIssuerDashbord`, requestOptions)
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
        });
    }

    if (loginusertype == "64622470b201a6f07b2dff22") {

      await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_supervisor_leads?policyIssuer=issuedPolicy&dashboardType=policyIssuerDashbord`, requestOptions)
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

  return (
    <>
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div style={{ position: 'relative' }} className="card-header new_leads">
              <strong>Issued Policies</strong>
              {notificationCount > 0 ? <div className='dashboardNotify'><h6>{notificationCount}</h6></div> : ''}
            </div>
          </Accordion.Header>
          <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
            <table className="table table-bordered">
              <thead >
                <tr >
                  <th scope="col">Sr</th>
                  <th scope="col">Client Name</th>
                  <th scope="col">Contact Number</th>
                  <th scope="col">Email Address</th>
                  <th scope="col">Received From</th>
                  <th scope="col">LOB</th>
                  <th scope="col">Time & Date Issued</th>
                  <th scope="col">PI TAT</th>
                  <th scope="col">Authorities Pending</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {pileads.length > 0 ? (
                  pileads.map((item, index) => {
                    const givenDate = parseISO(item.policy_issued_date);
                    const currentDate = new Date();
                    const days = Math.abs(differenceInDays(givenDate, currentDate));

                    return (
                      <tr key={index}>
                        <td>{startFrom + index + 1}</td>
                        <td>
                          {item.name}
                        </td>
                        <td>
                          <a href="#" onClick={() => handleWhatsappClick(item.phoneno)}>
                            {item.phoneno}
                          </a>
                        </td>
                        <td>
                          <a href="#" onClick={() => handleEmailClick(item.email)}>
                            {item.email}
                          </a>
                        </td>
                        <td>{item['dc_recived_from'][0]['name']}</td>
                        <td>{item['policy_type'][0]['line_of_business_name']}</td>
                        <td>{new Date(item.policy_issued_date).toUTCString()}</td>
                        <td>{days + " Days"}</td>
                        <td><input type="checkbox" name="" id="" /></td>
                        <td><button type="button" className="small-btn">Update</button></td>
                      </tr>
                    );
                  })
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
    </>
  )
}

export default IssuedPolicies;