import React, { useCallback } from 'react'
import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import { Form, useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion, Col, Table } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';


BestRateComparison.propTypes =
{
  filterOptions: PropTypes.shape({
    location: PropTypes.string,
    lob: PropTypes.string,
    businessType: PropTypes.string,
    agent: PropTypes.string,
    dateRange: PropTypes
  })
};

BestRateComparison.propTypes = {
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
function BestRateComparison({ filterOptions, defaultOptions }) {
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
      setLoader(true)
      setModalData([])
      const reqOption = {
        method: 'POST',
        body: JSON.stringify({
          location: filterOptions.location?.map((val) => val.value),
          lob: filterOptions.lob?.map((val) => val.value),
          business_type: filterOptions.businessType,
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
        url = 'getMotorBestRate'
      } else if (LOB == 'Travel') {
        url = 'getTravelBestrate'
      } else if (LOB == 'Yacht') {
        url = 'getYachtBestrate'
      } else if (LOB == 'Home') {
        url = 'getHomeBestRate'
      } else if (LOB == 'Medical') {
        url = 'getIndivialMedicalBestRate'
      }
      fetch(`https://insuranceapi-3o5t.onrender.com/api/${url}`, reqOption)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.data, "api data")
          setLoader(false)
          if (LOB == 'Motor' || LOB == 'Yacht') {
            const motordata = data.data?.map((itm) => {
              let compvalue
              let compAllValue
              let tplValue
              let tplAllValue
              itm.rate?.map((comp) => {
                if (comp.hasOwnProperty('comprehenshivRate')) {
                  compvalue = comp.comprehenshivRate
                }
              })
              itm.rate?.map((val) => {
                if (val.hasOwnProperty('comprehenshivRateAll')) {
                  compAllValue = val.comprehenshivRateAll
                }
              })
              itm.rate?.map((val) => {
                if (val.hasOwnProperty('tplRate')) {
                  tplValue = val.tplRate
                }
              })
              itm.rate?.map((val) => {
                if (val.hasOwnProperty('tplRateAll')) {
                  tplAllValue = val.tplRateAll
                }
              })
              return (
                {
                  body_type: itm._id,
                  rate: {
                    comprehenshivRate: compvalue ? compvalue : 0,
                    tplRate: tplValue ? tplValue : 0,
                    comprehenshivRateAll: compAllValue ? compAllValue : 0,
                    tplRateAll: tplAllValue ? tplAllValue : 0
                  }
                }
              )
            })
            console.log(motordata, ">>>>>> generated data")
            setModalData(motordata)

          } else if (LOB == 'Travel') {

            setModalData(data.data)

          } else if (LOB == 'Home') {

            setModalData(data.data)

          } else if (LOB == 'Medical') {
            setModalData(data.data)

          }
          setShowModal(indx)
          setShowTable(LOB)
        })
    }
  }

  return (
    <>
      <Accordion className='neww'>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <div className="card-header new_leads">
              <strong>Best Rate Comparison</strong>
            </div>
          </Accordion.Header>
          <Accordion.Body style={{ padding: '2px' }}>
            <table className="table table-bordered striped ">
              <tbody>
                {premiumData?.map((item, index) => (
                  <tr key={index}>

                    <td style={{ borderLeft: 'hidden', borderRight: 'hidden' }} >
                      <Accordion className='col-md-8'>
                        <Accordion.Item eventKey={index + 1}>
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
                                    <th><strong>Your Rate</strong></th>
                                    <th><strong>Best Rate on LMP</strong></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {modalData?.map((item, index) => (
                                    <tr key={index}>
                                      <td>{item._id}</td>
                                      <td>
                                        <table className='table'>
                                          {item?.primiumAll[0]?.rate?.map((itm, indx) => (

                                            <tr key={indx}>
                                              <td>{itm?.noOdDays}</td>
                                            </tr>

                                          ))}
                                        </table>
                                      </td>
                                      <td>
                                        <table className='table'>
                                          {item?.primiumAll[0]?.rate?.map((itm, indx) => (

                                            <tr key={indx}>
                                              <td>{itm?.total.toLocaleString('en-US', {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 2,
                                                useGrouping: true
                                              })}</td>
                                            </tr>
                                          ))}
                                        </table>
                                      </td>
                                      <td>
                                        <table className='table'>
                                          {item?.primiumAll[0]?.rate?.map((itm, indx) => (

                                            <tr key={indx}>
                                              <td>{item?.primiumAll[1]?.rateAll?.find((rateval) => rateval.noOdDays == itm.noOdDays)
                                                ?.totalAll.toLocaleString('en-US',
                                                  {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 2,
                                                    useGrouping: true
                                                  })}</td>
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
                                      <th><strong>Your Rate</strong></th>
                                      <th><strong>Best Rate on LMP</strong></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {modalData?.map((item, index) => (
                                      <tr key={index}>
                                        <td>{item.body_type}</td>
                                        <td>
                                          {item.rate?.comprehenshivRate == 0 && item.rate?.comprehenshivRateAll == 0 ? "" :
                                            <tr>
                                              <td>Comprehensivee</td>
                                            </tr>
                                          }
                                          {(item.rate?.tplRate == 0 && item.rate?.tplRateAll == 0) || (item.rate?.comprehenshivRate == 0 && item.rate?.comprehenshivRateAll == 0) ?
                                            '' :
                                            <hr></hr>
                                          }
                                          {item.rate?.tplRate == 0 && item.rate?.tplRateAll == 0 ? '' :
                                            <tr>
                                              <td>Third Party Liability (TPL)</td>
                                            </tr>
                                          }
                                        </td>
                                        <td>
                                          {item.rate?.comprehenshivRate == 0 && item.rate?.comprehenshivRateAll == 0 ? "" :
                                            <tr>
                                              <td>{item.rate?.comprehenshivRate?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                            </tr>}
                                          {(item.rate?.tplRate == 0 && item.rate?.tplRateAll == 0) || (item.rate?.comprehenshivRate == 0 && item.rate?.comprehenshivRateAll == 0) ?
                                            '' :
                                            <hr></hr>
                                          }
                                          {item.rate?.tplRate == 0 && item.rate?.tplRateAll == 0 ? '' :
                                            <tr>
                                              <td>{item.rate?.tplRate?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                            </tr>
                                          }
                                        </td>
                                        <td>
                                          {item.rate?.comprehenshivRate == 0 && item.rate?.comprehenshivRateAll == 0 ? "" :
                                            <tr>
                                              <td>{item.rate?.comprehenshivRateAll?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                            </tr>
                                          }
                                          {(item.rate?.tplRate == 0 && item.rate?.tplRateAll == 0) || (item.rate?.comprehenshivRate == 0 && item.rate?.comprehenshivRateAll == 0) ?
                                            '' :
                                            <hr></hr>
                                          }
                                          {item.rate?.tplRate == 0 && item.rate?.tplRateAll == 0 ? '' :
                                            <tr>
                                              <td>{item.rate?.tplRateAll?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                            </tr>
                                          }
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
                                        <th><strong>Your Rate</strong></th>
                                        <th><strong>Best Rate on LMP</strong></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {modalData?.map((item, index) => (
                                        <tr key={index}>
                                          <td>{item._id}</td>
                                          <td>
                                            <table className='table'>
                                              {item?.primiumAll[0].rate?.map((itm, indx) => (

                                                <tr key={indx}>
                                                  <td>{itm?.network}</td>
                                                </tr>
                                              ))}
                                            </table>
                                          </td>
                                          <td>
                                            <table className='table'>
                                              {item?.primiumAll[0]?.rate?.map((itm, indx) => (

                                                <tr key={indx}>
                                                  <td>{itm?.total?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                                </tr>
                                              ))}
                                            </table>
                                          </td>
                                          <td>
                                            <table className='table'>
                                              {item?.primiumAll[0]?.rate?.map((itm, indx) => (

                                                <tr key={indx}>
                                                  <td>{item?.primiumAll[1]?.rateAll?.find((rateval) => rateval.network[0] == itm.network[0])
                                                    ?.totalAll.toLocaleString('en-US',
                                                      {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 2,
                                                        useGrouping: true
                                                      })}</td>
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
                                          <th><strong>Your Rate</strong></th>
                                          <th><strong>Best Rate on LMP</strong></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {modalData?.map((item, index) => (
                                          item?.primiumAll[0]?.rate ? <tr key={index}>
                                            <td>{item._id}</td>
                                            <td>
                                              <table className='table'>
                                                {item?.primiumAll[0]?.rate?.map((itm, indx) => (

                                                  <tr key={indx}>
                                                    <td>{itm?.categori}</td>
                                                  </tr>

                                                ))}
                                              </table>
                                            </td>
                                            <td>
                                              <table className='table'>
                                                {item?.primiumAll[0]?.rate?.map((itm, indx) => (

                                                  <tr key={indx}>
                                                    <td>{itm?.total.toLocaleString('en-US', {
                                                      minimumFractionDigits: 0,
                                                      maximumFractionDigits: 2,
                                                      useGrouping: true
                                                    })}</td>
                                                  </tr>
                                                ))}
                                              </table>
                                            </td>
                                            <td>
                                              <table className='table'>
                                                {item?.primiumAll[0]?.rate?.map((itm, indx) => (

                                                  <tr key={indx}>
                                                    <td>{item?.primiumAll[1]?.rateAll?.find((rateval) => rateval.categori == itm.categori)
                                                      ?.totalAll.toLocaleString('en-US',
                                                        {
                                                          minimumFractionDigits: 0,
                                                          maximumFractionDigits: 2,
                                                          useGrouping: true
                                                        })}</td>
                                                  </tr>
                                                ))}
                                              </table>
                                            </td>
                                          </tr> : ''
                                        ))
                                        }
                                      </tbody>
                                    </table> : showTable == "Yacht" && showModal == index ?
                                      <table className="table table-bordered striped">
                                        <thead>
                                          <tr>
                                            <th><strong>Body Type</strong></th>
                                            <th><strong>Type</strong></th>
                                            <th><strong>Your Rate</strong></th>
                                            <th><strong>Best Rate on LMP</strong></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {modalData?.map((item, index) => (
                                            <tr key={index}>
                                              <td>{item.body_type}</td>
                                              <td>
                                                {item.rate?.comprehenshivRate == 0 && item.rate?.comprehenshivRateAll == 0 ? "" :
                                                  <tr>
                                                    <td>Comprehensivee</td>
                                                  </tr>
                                                }
                                                {(item.rate?.tplRate == 0 && item.rate?.tplRateAll == 0) || (item.rate?.comprehenshivRate == 0 && item.rate?.comprehenshivRateAll == 0) ?
                                                  '' :
                                                  <hr></hr>
                                                }
                                                {item.rate?.tplRate == 0 && item.rate?.tplRateAll == 0 ? '' :
                                                  <tr>
                                                    <td>TPL</td>
                                                  </tr>
                                                }
                                              </td>
                                              <td>
                                                {item.rate?.comprehenshivRate == 0 && item.rate?.comprehenshivRateAll == 0 ? "" :
                                                  <tr>
                                                    <td>{item.rate?.comprehenshivRate?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                                  </tr>}
                                                {(item.rate?.tplRate == 0 && item.rate?.tplRateAll == 0) || (item.rate?.comprehenshivRate == 0 && item.rate?.comprehenshivRateAll == 0) ?
                                                  '' :
                                                  <hr></hr>
                                                }
                                                {item.rate?.tplRate == 0 && item.rate?.tplRateAll == 0 ? '' :
                                                  <tr>
                                                    <td>{item.rate?.tplRate?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                                  </tr>
                                                }
                                              </td>
                                              <td>
                                                {item.rate?.comprehenshivRate == 0 && item.rate?.comprehenshivRateAll == 0 ? "" :
                                                  <tr>
                                                    <td>{item.rate?.comprehenshivRateAll?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                                  </tr>
                                                }
                                                {(item.rate?.tplRate == 0 && item.rate?.tplRateAll == 0) || (item.rate?.comprehenshivRate == 0 && item.rate?.comprehenshivRateAll == 0) ?
                                                  '' :
                                                  <hr></hr>
                                                }
                                                {item.rate?.tplRate == 0 && item.rate?.tplRateAll == 0 ? '' :
                                                  <tr>
                                                    <td>{item.rate?.tplRateAll?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                                  </tr>
                                                }
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

export default BestRateComparison;