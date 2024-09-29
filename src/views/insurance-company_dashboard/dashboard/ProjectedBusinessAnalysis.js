import React, { useCallback } from 'react'
import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import { Form, useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion, Col, Table } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { ClipLoader } from 'react-spinners';

ProjectedBusinessAnalysis.propTypes =
{
  filterOptions: PropTypes.shape({
    location: PropTypes.string,
    lob: PropTypes.string,
    businessType: PropTypes.string,
    agent: PropTypes.string,
    dateRange: PropTypes
  })
};
ProjectedBusinessAnalysis.propTypes =
{
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
}
function ProjectedBusinessAnalysis({ filterOptions, defaultOptions }) {
  const navigate = useNavigate()
  const [premiumData, setPremiumData] = useState([])
  const [showModal, setShowModal] = useState(null);
  const [modalData, setModalData] = useState([])
  const [showTable, setShowTable] = useState(null)
  const [loading, setLoader] = useState(false);
  const [projectedData, setProjectedData] = useState([])
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
      setProjectedData([])
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
        url = 'getMotorProjectBusiness'
      } else if (LOB == 'Travel') {
        url = 'getTravelProjectBusiness'
      } else if (LOB == 'Yacht') {
        url = 'getYachtProjectBusiness'
      } else if (LOB == 'Home') {
        url = 'getHomeProjectBusiness'
      } else if (LOB == 'Medical') {
        url = 'getMedicalProjectBusiness'
      }
      fetch(`https://insuranceapi-3o5t.onrender.com/api/${url}`, reqOption)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.data, "api data")
          setLoader(false)
          if (LOB == 'Motor' || LOB == 'Yacht') {
            const motorData = data.data
            console.log(motorData, " yacht projection data ><><><>>>>>>>><<<<<<<>")
            const motordataArr = []
            const motorelProjectedDataArr = []
            for (let i = 0; i < motorData.length; i++) {
              const primArr = motorData[i].rate

              for (let j = 0; j < primArr.length; j++) {
                let type
                let val
                let primval
                if (primArr[j].hasOwnProperty('comprehenshivRate')) {
                  type = 'Comprehensive'
                  val = primArr[j].comprehenshivRate
                  primval = primArr[j].primiumCom
                } else {
                  type = 'Third Party Liability (TPL)'
                  val = primArr[j]?.tplRate
                  primval = primArr[j].primiumTpl
                }
                const element = {
                  body_type: j == 0 ? motorData[i]._id : '',
                  _id: motorData[i]._id,
                  len: primArr.length,
                  type: type,
                  value: val,
                  primium: primval
                };
                let element2 = { first: '', second: '', third: '', fourth: '', fifth: '', total: '' }
                motorelProjectedDataArr.push(element2)
                motordataArr.push(element)
              }

            }
            setProjectedData(motorelProjectedDataArr)
            setModalData(motordataArr)

          } else if (LOB == 'Travel') {
            const travData = data.data
            const travdataArr = []
            const travelProjectedDataArr = []
            for (let i = 0; i < travData.length; i++) {
              const primArr = travData[i].primium

              for (let j = 0; j < primArr.length; j++) {
                const element = {
                  ...primArr[j],
                  travel_for: j == 0 ? travData[i]._id[0] : '',
                  _id: travData[i]._id[0],
                  len: primArr.length
                };
                let element2 = { first: '', second: '', third: '', fourth: '', fifth: '', total: '' }
                travelProjectedDataArr.push(element2)
                travdataArr.push(element)
              }

            }
            setProjectedData(travelProjectedDataArr)
            setModalData(travdataArr)

          } else if (LOB == 'Home') {
            const homeData = data.data
            const homedataArr = []
            const homeProjectedDataArr = []
            for (let i = 0; i < homeData.length; i++) {
              const primArr = homeData[i]?.primium

              for (let j = 0; j < primArr.length; j++) {
                const element = {
                  ...primArr[j],
                  home_type: j == 0 ? homeData[i]._id : '',
                  _id: homeData[i]._id,
                  len: primArr.length
                };
                let element2 = { first: '', second: '', third: '', fourth: '', fifth: '', total: '' }
                homeProjectedDataArr.push(element2)
                homedataArr.push(element)
              }

            }
            console.log(homedataArr, "home rate comparision data")
            setProjectedData(homeProjectedDataArr)
            setModalData(homedataArr)

          } else if (LOB == 'Medical') {
            const medicalData = data.data
            console.log(medicalData, ">>>>>>>>>><<<<<<<<<<>>>>>>>>>><<<<<<<<<<>>>>>>>>>")
            const medicaldataArr = []
            const medicalProjectedDataArr = []
            for (let i = 0; i < medicalData.length; i++) {
              const primArr = medicalData[i]?.primium

              for (let j = 0; j < primArr.length; j++) {
                const element = {
                  ...primArr[j],
                  medical_type: j == 0 ? medicalData[i]._id[0] : '',
                  _id: medicalData[i]._id[0],
                  len: primArr.length
                };
                let element2 = { first: '', second: '', third: '', fourth: '', fifth: '', total: '' }
                medicalProjectedDataArr.push(element2)
                medicaldataArr.push(element)
              }

            }
            console.log(medicaldataArr, "medical rate comparision data")
            setProjectedData(medicalProjectedDataArr)
            setModalData(medicaldataArr)

          }
          setShowModal(indx)
          setShowTable(LOB)
        })
    }
  }
  const TravelProjectedRateChange = (rate, item, index) => {
    const reqOption = {
      method: 'POST',
      body: JSON.stringify({
        rate: rate,
        noOfDays: item.noOdDays,
        travelFor: item._id,
        location: filterOptions.location?.map((val) => val.value),
        business_type: filterOptions.businessType
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getTravelHypothitcalBusiness`, reqOption)
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          let resData = data.data
          let prevArr = [...projectedData]
          prevArr[index].first = resData['1-90']
          prevArr[index].second = resData['91-180']
          prevArr[index].third = resData['181-270']
          prevArr[index].fourth = resData['271-360']
          prevArr[index].fifth = resData['360+']
          prevArr[index].total = resData['1-90'] + resData['91-180'] + resData['181-270'] + resData['271-360'] + resData['360+']
          setProjectedData(prevArr)
        }
        console.log(data, " >>>>>>>>>>>projected input rate")
      })

  }
  const HomeProjectedRateChange = (rate, item, index) => {
    const reqOption = {
      method: 'POST',
      body: JSON.stringify({
        rate: rate,
        planCategory: item.categori,
        buldingType: item._id,
        location: filterOptions.location?.map((val) => val.value),
        business_type: filterOptions.businessType
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getHomeHypothitcalBusiness`, reqOption)
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          let resData = data.data
          let prevArr = [...projectedData]
          prevArr[index].first = resData['1-90']
          prevArr[index].second = resData['91-180']
          prevArr[index].third = resData['181-270']
          prevArr[index].fourth = resData['271-360']
          prevArr[index].fifth = resData['360+']
          prevArr[index].total = resData['1-90'] + resData['91-180'] + resData['181-270'] + resData['271-360'] + resData['360+']
          setProjectedData(prevArr)
        }
        console.log(data, " >>>>>>>>>>>projected input rate")
      })

  }
  const MedicalProjectedRateChange = (rate, item, index) => {
    // console.log("this is item",item)
    // return false;
    const reqOption = {
      method: 'POST',
      body: JSON.stringify({
        rate: rate,
        TPA: item.medical_type,
        network: item.network[0],
        location: filterOptions.location?.map((val) => val.value),
        business_type: filterOptions.businessType
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getMedicalHypothitcalBusiness`, reqOption)
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          let resData = data.data
          let prevArr = [...projectedData]
          prevArr[index].first = resData['1-90']
          prevArr[index].second = resData['91-180']
          prevArr[index].third = resData['181-270']
          prevArr[index].fourth = resData['271-360']
          prevArr[index].fifth = resData['360+']
          prevArr[index].total = resData['1-90'] + resData['91-180'] + resData['181-270'] + resData['271-360'] + resData['360+']
          setProjectedData(prevArr)
        }
        console.log(data, " >>>>>>>>>>>projected input rate")
      })

  }
  const MotorProjectedRateChange = (rate, item, index) => {
    const reqOption = {
      method: 'POST',
      body: JSON.stringify({
        rate: rate,
        policyType: item.type,
        bodyName: item._id,
        location: filterOptions.location?.map((val) => val.value),
        business_type: filterOptions.businessType
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getMotorHypothitcalBusiness`, reqOption)
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          let resData = data.data
          let prevArr = [...projectedData]
          prevArr[index].first = resData['1-90']
          prevArr[index].second = resData['91-180']
          prevArr[index].third = resData['181-270']
          prevArr[index].fourth = resData['271-360']
          prevArr[index].fifth = resData['360+']
          prevArr[index].total = resData['1-90'] + resData['91-180'] + resData['181-270'] + resData['271-360'] + resData['360+']
          setProjectedData(prevArr)
        }
        console.log(data, " >>>>>>>>>>>projected input rate")
      })

  }
  const YachtProjectedRateChange = (rate, item, index) => {
    const reqOption = {
      method: 'POST',
      body: JSON.stringify({
        rate: rate,
        policyType: item.type,
        bodyName: item._id,
        location: filterOptions.location?.map((val) => val.value),
        business_type: filterOptions.businessType
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getYachtHypothitcalBusiness`, reqOption)
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          let resData = data.data
          console.log(resData, " yatch response data ")
          let prevArr = [...projectedData]
          prevArr[index].first = resData['1-90']
          prevArr[index].second = resData['91-180']
          prevArr[index].third = resData['181-270']
          prevArr[index].fourth = resData['271-360']
          prevArr[index].fifth = resData['360+']
          prevArr[index].total = resData['1-90'] + resData['91-180'] + resData['181-270'] + resData['271-360'] + resData['360+']
          setProjectedData(prevArr)
        }
        console.log(data, " >>>>>>>>>>>projected input rate")
      })

  }
  return (
    <>
      <Accordion className='neww'>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <div className="card-header new_leads">
              <strong>Projected Business Analysis</strong>
            </div>
          </Accordion.Header>
          <Accordion.Body style={{ padding: '2px' }}>
            <table className="table table-bordered striped ">
              <thead className="thead-dark">
                <tr className="table-info">
                  {/* <th scope="col" style={{ width: '70%' }}><strong>Line Of Business</strong></th> */}
                  {/* <th scope="col"><strong>Premium</strong></th> */}
                </tr>
              </thead>
              <tbody>
                {premiumData?.map((item, index) => (
                  <tr key={index}>

                    <td style={{ borderLeft: 'hidden', borderRight: 'hidden' }} >
                      <Accordion className='col-md-12'>
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
                                    <th><strong>Existing Premium</strong></th>
                                    <th><strong>Projected Rate</strong></th>
                                    <th><strong>1-90 Days</strong></th>
                                    <th><strong>91-180 Days</strong></th>
                                    <th><strong>181-270 Days</strong></th>
                                    <th><strong>271-360 Days</strong></th>
                                    <th><strong>360+ Days</strong></th>
                                    <th><strong>Total</strong></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {modalData?.map((item, index) => (
                                    <tr key={index}>
                                      {item.travel_for != '' ? <td rowSpan={item.len} >{item.travel_for}</td> : ''}
                                      <td >{item.noOdDays}</td>
                                      <td >{item.total?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                      <td >{item.primium}</td>
                                      <td ><input onChange={(e) => TravelProjectedRateChange(e.target.value, item, index)} type='text' className='form-control' /></td>
                                      <td >{projectedData[index]?.first}</td>
                                      <td >{projectedData[index]?.second}</td>
                                      <td >{projectedData[index]?.third}</td>
                                      <td >{projectedData[index]?.fourth}</td>
                                      <td >{projectedData[index]?.fifth}</td>
                                      <td >{projectedData[index]?.total}</td>

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
                                      <th><strong>Existing Premium</strong></th>
                                      <th><strong>Project Rate</strong></th>
                                      <th><strong>1-90 Days</strong></th>
                                      <th><strong>91-180 Days</strong></th>
                                      <th><strong>181-270 Days</strong></th>
                                      <th><strong>271-360 Days</strong></th>
                                      <th><strong>360+ Days</strong></th>
                                      <th><strong>Total</strong></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {modalData?.map((item, index) => (
                                      <tr key={index}>
                                        {item.body_type != '' ? <td rowSpan={item.len} >{item.body_type}</td> : ''}
                                        <td >{item.type}</td>
                                        <td >{item.value}</td>
                                        <td >{item.primium}</td>
                                        <td ><input onChange={(e) => MotorProjectedRateChange(e.target.value, item, index)} type='text' className='form-control' /></td>
                                        <td >{projectedData[index]?.first}</td>
                                        <td >{projectedData[index]?.second}</td>
                                        <td >{projectedData[index]?.third}</td>
                                        <td >{projectedData[index]?.fourth}</td>
                                        <td >{projectedData[index]?.fifth}</td>
                                        <td >{projectedData[index]?.total}</td>

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
                                        <th><strong>Existing Premium</strong></th>
                                        <th><strong>Projected Rate</strong></th>
                                        <th><strong>1-90 Days</strong></th>
                                        <th><strong>91-180 Days</strong></th>
                                        <th><strong>181-270 Days</strong></th>
                                        <th><strong>271-360 Days</strong></th>
                                        <th><strong>360+ Days</strong></th>
                                        <th><strong>Total</strong></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {modalData?.map((item, index) => (
                                        <tr key={index}>
                                          {item.medical_type != '' ? <td rowSpan={item.len} >{item.medical_type}</td> : ''}
                                          <td >{item.network[0]}</td>
                                          <td >{item.total}</td>
                                          <td >{item.primium}</td>
                                          <td ><input onChange={(e) => MedicalProjectedRateChange(e.target.value, item, index)} type='text' className='form-control' /></td>
                                          <td >{projectedData[index]?.first}</td>
                                          <td >{projectedData[index]?.second}</td>
                                          <td >{projectedData[index]?.third}</td>
                                          <td >{projectedData[index]?.fourth}</td>
                                          <td >{projectedData[index]?.fifth}</td>
                                          <td >{projectedData[index]?.total}</td>

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
                                          <th><strong>Existing Premium</strong></th>
                                          <th><strong>Project Rate</strong></th>
                                          <th><strong>1-90 Days</strong></th>
                                          <th><strong>91-180 Days</strong></th>
                                          <th><strong>181-270 Days</strong></th>
                                          <th><strong>271-360 Days</strong></th>
                                          <th><strong>360+ Days</strong></th>
                                          <th><strong>Total</strong></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {modalData?.map((item, index) => (
                                          <tr key={index}>
                                            {item.home_type != '' ? <td rowSpan={item.len} >{item.home_type}</td> : ''}
                                            <td >{item.categori}</td>
                                            <td >{item.rate}</td>
                                            <td >{item.primium}</td>
                                            <td ><input onChange={(e) => HomeProjectedRateChange(e.target.value, item, index)} type='text' className='form-control' /></td>
                                            <td >{projectedData[index]?.first}</td>
                                            <td >{projectedData[index]?.second}</td>
                                            <td >{projectedData[index]?.third}</td>
                                            <td >{projectedData[index]?.fourth}</td>
                                            <td >{projectedData[index]?.fifth}</td>
                                            <td >{projectedData[index]?.total}</td>

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
                                            <th><strong>Your Rate</strong></th>
                                            <th><strong>Existing Premium</strong></th>
                                            <th><strong>Project Rate</strong></th>
                                            <th><strong>1-90 Days</strong></th>
                                            <th><strong>91-180 Days</strong></th>
                                            <th><strong>181-270 Days</strong></th>
                                            <th><strong>271-360 Days</strong></th>
                                            <th><strong>360+ Days</strong></th>
                                            <th><strong>Total</strong></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {modalData?.map((item, index) => (
                                            <tr key={index}>
                                              {item.body_type != '' ? <td rowSpan={item.len} >{item.body_type}</td> : ''}
                                              <td >{item.type}</td>
                                              <td >{item.value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true })}</td>
                                              <td >{item.primium}</td>
                                              <td ><input onChange={(e) => YachtProjectedRateChange(e.target.value, item, index)} type='text' className='form-control' /></td>
                                              <td >{projectedData[index]?.first}</td>
                                              <td >{projectedData[index]?.second}</td>
                                              <td >{projectedData[index]?.third}</td>
                                              <td >{projectedData[index]?.fourth}</td>
                                              <td >{projectedData[index]?.fifth}</td>
                                              <td >{projectedData[index]?.total}</td>

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

export default ProjectedBusinessAnalysis;