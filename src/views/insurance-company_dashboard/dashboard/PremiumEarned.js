import React, { useCallback } from 'react'
import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import { Form, useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion, Col, Table } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';


PremiumEarned.propTypes =
{
  filterOptions: PropTypes.shape({
    location: PropTypes.string,
    lob: PropTypes.string,
    businessType: PropTypes.string,
    agent: PropTypes.string,
    dateRange: PropTypes
  })
};

PremiumEarned.propTypes = {
  defaultOptions: PropTypes.shape({
    defaultlocation: PropTypes.string,
    defaultlob: PropTypes.string,
    defaultbusinessType: PropTypes.string,
    defaultagent: PropTypes.string,
    defaultdateRange: PropTypes,
    startdate: PropTypes,
    enddate: PropTypes,
    userType: PropTypes
  })
};
function PremiumEarned({ filterOptions, defaultOptions }) {
  const navigate = useNavigate()
  const [premiumData, setPremiumData] = useState([])
  const [showModal, setShowModal] = useState(null);
  const [modalData, setModalData] = useState([])
  const [showTable, setShowTable] = useState(null)
  const [loading, setLoader] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getPremiumData()
    }
  }, [])
  useEffect(() => {
    console.log('filterOptions>>>> ', filterOptions)
    getPremiumData()

  }, [filterOptions])
  const getPremiumData = () => {

    const reqOption = {
      method: 'POST',
      body: JSON.stringify({
        location: filterOptions.location?.map((val) => val.value),
        lob: filterOptions.lob?.map((val) => val.value),
        business_type: filterOptions.businessType?.map((item) => item.value),
        dateRange: filterOptions.dateRange,
        startdate: defaultOptions.startdate,
        enddate: defaultOptions.enddate,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }

    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getInsurancePrimiumEarnedByLob`, reqOption)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "premium earned Data")
        setPremiumData(data.data)
      })
  }
  const HandleLOBClick = (LOB, indx, e) => {
    if (e != 'accordion-button') {
      setShowModal(indx)
      setLoader(true)
      setModalData([])
      setShowTable(LOB)
      const reqOption = {
        method: 'POST',
        body: JSON.stringify({
          location: filterOptions.location?.map((val) => val.value),
          lob: filterOptions.lob?.map((val) => val.value),
          business_type: filterOptions.businessType?.map((item) => item.value),
          dateRange: filterOptions.dateRange,
          startdate: defaultOptions.startdate,
          enddate: defaultOptions.enddate,
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }

      }
      let url
      if (LOB == 'Motor') {
        url = 'insurancePrimiumByBodyType'
      } else if (LOB == 'Travel') {
        url = 'getInsurancePrimiumEarnedByTravelCoverType'
      } else if (LOB == 'Yacht') {
        url = 'getInsurancePrimiumEarnedByYachtBodyType'
      } else if (LOB == 'Home') {
        url = 'insurancePrimiumByHomePlaneType'
      } else if (LOB == 'Medical') {
        url = 'getInsurancePrimiumEarnedByIndiviualLob'
      }
      fetch(`https://insuranceapi-3o5t.onrender.com/api/${url}`, reqOption)
        .then((response) => response.json())
        .then((data) => {
          setModalData(data.data)
          setLoader(false)
        })
    }
  }
  return (
    <>
      <Accordion className='neww' defaultActiveKey="1">
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <div className="card-header new_leads">
              <strong>Premium Earned</strong>
            </div>
          </Accordion.Header>
          <Accordion.Body style={{ padding: '2px' }}>
            <table className="table table-bordered striped ">
              <thead className="thead-dark">
                <tr className="table-info">
                  {/* <th scope="col"><strong>Sr#</strong></th> */}
                  <th scope="col" style={{ width: '70%' }}><strong>Line Of Business</strong></th>
                  <th scope="col"><strong>Premium</strong></th>
                  {/* <th scope="col">Email Address</th>
                <th scope="col">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {premiumData?.map((item, index) => (
                  <tr key={index}>

                    {/* <td>{index + 1}</td> */}
                    <td style={{ borderLeft: 'hidden', borderRight: 'hidden' }} >
                      <Accordion>
                        <Accordion.Item eventKey={index}>
                          <Accordion.Header className='headersss' onClick={(e) => HandleLOBClick(item.Lob[0]?.line_of_business_name, index, e.target.className)}>
                            <div className="d-flex justify-content-center">
                              {/* <tr className='d-flex justify-content-center'> */}
                              {item.Lob[0]?.line_of_business_name}
                              {/* </tr> */}
                            </div>
                          </Accordion.Header>

                          <Accordion.Body style={{ padding: '2px' }}>
                            {loading == true && showModal == index ?
                              <ClipLoader color="#0D2F92" loading={loading} size={50} />
                              : ""}
                            {showTable == 'Travel' && showModal == index ?
                              <table className="table table-bordered striped">
                                <thead>
                                  <tr>
                                    <th><strong>Travel For</strong></th>
                                    <th><strong>No Of Days</strong></th>
                                    <th><strong>Premium</strong></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {modalData?.map((item, index) => (
                                    <tr key={index}>
                                      <td>{item._id}</td>
                                      <td>
                                        <table className='table'>
                                          {item?.primium?.map((itm, indx) => (

                                            <tr key={indx}>
                                              <td>{itm?.noOfDays?.length ? itm?.noOfDays : ''}</td>
                                            </tr>
                                          ))}
                                        </table>
                                      </td>
                                      <td>
                                        <table className='table'>
                                          {item?.primium?.map((itm, indx) => (

                                            <tr key={indx}>
                                              <td>{itm?.total?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                            </tr>
                                          ))}
                                        </table>
                                      </td>
                                    </tr>
                                  ))
                                  }
                                </tbody>
                              </table> : showTable == 'Motor' && showModal == index ?
                                <table className="table table-bordered striped">
                                  <thead>
                                    <tr>
                                      <th><strong>Body Type</strong></th>
                                      <th><strong>Type</strong></th>
                                      <th><strong>Premium</strong></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {modalData?.map((item, index) => (
                                      <tr key={index}>
                                        <td>{item._id}</td>
                                        <td>
                                          <table className='table'>
                                            {item?.primium?.map((itm, indx) => (

                                              <tr key={indx}>
                                                <td>{itm?.policyType ? itm?.policyType : ''}</td>
                                              </tr>
                                            ))}
                                          </table>
                                        </td>
                                        <td>
                                          <table className='table'>
                                            {item?.primium?.map((itm, indx) => (
                                              <tr key={indx}>
                                                <td>{itm?.total?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                              </tr>
                                            ))}
                                          </table>
                                        </td>
                                      </tr>
                                    ))
                                    }
                                  </tbody>
                                </table> : showTable == 'Medical' && showModal == index ?
                                  <table className="table table-bordered striped">
                                    <thead>
                                      <tr>
                                        <th><strong>TPA</strong></th>
                                        <th><strong>Network</strong></th>
                                        <th><strong>Premium</strong></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {modalData?.map((item, index) => (
                                        <tr key={index}>
                                          <td>{item._id}</td>
                                          <td>
                                            <table className='table'>
                                              {item?.primium?.map((itm, indx) => (

                                                <tr key={indx}>
                                                  <td>{itm?.network?.length ? itm?.network : ''}</td>
                                                </tr>
                                              ))}
                                            </table>
                                          </td>
                                          <td>
                                            <table className='table'>
                                              {item?.primium?.map((itm, indx) => (
                                                <tr key={indx}>
                                                  <td>{itm?.total?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                                </tr>
                                              ))}
                                            </table>
                                          </td>
                                        </tr>
                                      ))
                                      }
                                    </tbody>
                                  </table> : showTable == "Home" && showModal == index ?
                                    <table className="table table-bordered striped">
                                      <thead>
                                        <tr>
                                          <th><strong>Plan Type</strong></th>
                                          <th><strong>Plan Category</strong></th>
                                          <th><strong>Premium</strong></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {modalData?.map((item, index) => (
                                          <tr key={index}>
                                            <td>{item._id}</td>
                                            <td>
                                              <table className='table'>
                                                {item?.primium?.map((itm, indx) => (

                                                  <tr key={indx}>
                                                    <td>{itm?.categori}</td>
                                                  </tr>
                                                ))}
                                              </table>
                                            </td>
                                            <td>
                                              <table className='table'>
                                                {item?.primium?.map((itm, indx) => (

                                                  <tr key={indx}>
                                                    <td>{itm?.total?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                                  </tr>
                                                ))}
                                              </table>
                                            </td>
                                          </tr>
                                        ))
                                        }
                                      </tbody>
                                    </table> : showTable == "Yacht" && showModal == index ?
                                      <table className="table table-bordered striped">
                                        <thead>
                                          <tr>
                                            <th><strong>Body Type</strong></th>
                                            <th><strong>Type</strong></th>
                                            <th><strong>Premium</strong></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {modalData?.map((item, index) => (
                                            <tr key={index}>
                                              <td>{item._id}</td>
                                              <td>
                                                <table className='table'>
                                                  {item?.primium?.map((itm, indx) => (

                                                    <tr key={indx}>
                                                      <td>{itm?.policyType?.length ? itm?.policyType : ''}</td>
                                                    </tr>
                                                  ))}
                                                </table>
                                              </td>
                                              <td>
                                                <table className='table'>
                                                  {item?.primium?.map((itm, indx) => (

                                                    <tr key={indx}>
                                                      <td>{itm?.total?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                                    </tr>
                                                  ))}
                                                </table>
                                              </td>
                                            </tr>
                                          ))
                                          }
                                        </tbody>
                                      </table> : ''
                            }
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </td>
                    <td>{item.total?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>

                  </tr>

                ))
                }
              </tbody>
            </table>

          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default PremiumEarned;