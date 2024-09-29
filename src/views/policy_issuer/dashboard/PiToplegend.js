import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { CWidgetStatsC } from '@coreui/react';
import { CCol } from '@coreui/react';
import PropTypes from 'prop-types';

PiToplegend.propTypes =
{
  filterOptions: PropTypes.shape({
    location: PropTypes.string,
    lob: PropTypes.string,
    businessType: PropTypes.string,
    agent: PropTypes.string,
    dateRange: PropTypes
  })
};

PiToplegend.propTypes = {
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


function PiToplegend({ filterOptions, defaultOptions }) {

  console.log("filterOptions", filterOptions);
  console.log("defaultOptions", defaultOptions);

  const navigate = useNavigate();

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 6
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const [lob, setLob] = useState([]);

  useEffect(() => {
    lobList();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getTotalCount();
    }
  }, [filterOptions]);

  const lobList = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const lob = userdata.line_of_business;
    if (lob.length > 0) {
      const lobdt = lob;
      const lob_len = lobdt.length;
      const lob_list = [];
      for (let i = 0; i < lob_len; i++) {
        const lob_obj = { label: lobdt[i].lob_name, value: lobdt[i].lob_id };
        lob_list.push(lob_obj);
      }
      setLob(lob_list);
    }
    else {
      const requestOptions =
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const lobdt = data.data;
          const lob_len = lobdt.length;
          const lob_list = [];
          for (let i = 0; i < lob_len; i++) {
            const lob_obj = { label: lobdt[i].line_of_business_name, value: lobdt[i]._id };
            lob_list.push(lob_obj);
          }
          setLob(lob_list);
        });
    }
  }

  const [motorcount, setMotorcount] = useState(0);
  const [travelcount, setTravelcount] = useState(0);
  const [homecount, setHomecount] = useState(0);
  const [yachtcount, setYachtcount] = useState(0);
  const [medicalcount, setMedicalcount] = useState(0);
  const [othercount, setOthercount] = useState(0);


  const getTotalCount = async () => {

    console.log("inside filterOptions", filterOptions);
    console.log("inside defaultOptions", defaultOptions);

    const userdata = JSON.parse(localStorage.getItem('user'));
    let newlocation = filterOptions.location;
    let newlob = filterOptions.lob;
    let newbusinessType = filterOptions.businessType;
    let newagent = filterOptions.agent;
    let dateRange = filterOptions.dateRange;
    let startdate = defaultOptions.startdate;
    let enddate = defaultOptions.enddate;
    let assign_staff = userdata.assign_staff;
    let usertype = defaultOptions.userType

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
    console.log("loginusertype", loginusertype);

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        location: newlocation,
        lob: newlob,
        business_type: newbusinessType,
        newagent: newagent,
        dateRange: dateRange,
        startdate: startdate,
        enddate: enddate,
        assign_staff: assign_staff,
        userType: usertype
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    };


    if (loginusertype == "64622526b201a6f07b2dff3e") {
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/topLeagentCount`, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log("data", data.data);
          setMotorcount(data.data.motorCount);
          setTravelcount(data.data.travelCount);
          setHomecount(data.data.homeCount);
          setYachtcount(data.data.yatchCount);
          setMedicalcount(data.data.medicalCount);
          setOthercount(data.data.ortherInsuranceCount);
        })
        .catch((error) => {
          console.log(error)
        })


    }
    if (loginusertype == "64622470b201a6f07b2dff22") {
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/topLeagentCount?dashboardType=policyIssuerDashbord`, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log("data", data.data);
          setMotorcount(data.data.motorCount);
          setTravelcount(data.data.travelCount);
          setHomecount(data.data.homeCount);
          setYachtcount(data.data.yatchCount);
          setMedicalcount(data.data.medicalCount);
          setOthercount(data.data.ortherInsuranceCount);
        }
        )
        .catch((error) => {
          console.log(error)
        }
        )

    }
  }

  console.log("lob", lob.map((item) => item.label));

  console.log("motorcount", motorcount);
  console.log("travelcount", travelcount);
  console.log("homecount", homecount);
  console.log("yachtcount", yachtcount);
  console.log("medicalcount", medicalcount);
  console.log("othercount", othercount);


  return (
    <div>
      <Carousel className='carousel_abcds' margin={30} swipeable={false}
        draggable={true}
        showDots={true}
        responsive={responsive}
      >
        {/* <CRow className='custom_abcd'> */}
        {lob ?
          lob.map((item, index) => (
            item.label == "Motor" ?
              <CCol xs={2} class='item' key={index}>
                <CWidgetStatsC
                  className="mb-3"
                  progress={{ color: 'primary', value: 100 }}
                  text="Widget helper text"
                  title={item.label}
                  value={motorcount != null ? motorcount?.toString() : "0"}
                />
              </CCol>
              : item.label == "Travel" ?
                <CCol xs={2} class='item' key={index}>
                  <CWidgetStatsC
                    className="mb-3"
                    progress={{ color: 'danger', value: 100 }}
                    text="Widget helper text"
                    title={item.label}
                    value={travelcount != null ? travelcount?.toString() : "0"}
                  />
                </CCol>
                : item.label == "Home" ?
                  <CCol xs={2} class='item' key={index}>
                    <CWidgetStatsC
                      className="mb-3"
                      progress={{ color: 'primary', value: 100 }}
                      text="Widget helper text"
                      title={item.label}
                      value={homecount != null ? homecount?.toString() : "0"}
                    />
                  </CCol>
                  : item.label == "Yacht" ?
                    <CCol xs={2} class='item' key={index}>
                      <CWidgetStatsC
                        className="mb-3"
                        progress={{ color: 'danger', value: 100 }}
                        text="Widget helper text"
                        title={item.label}
                        value={yachtcount != null ? yachtcount?.toString() : "0"}
                      />
                    </CCol>
                    : item.label == "Medical" ?
                      <CCol xs={2} class='item' key={index}>
                        <CWidgetStatsC
                          className="mb-3"
                          progress={{ color: 'primary', value: 100 }}
                          text="Widget helper text"
                          title={item.label}
                          value={medicalcount != null ? medicalcount?.toString() : "0"}
                        />
                      </CCol>
                      : item.label == "Other Insurance" ?
                        <CCol xs={2} class='item' key={index}>
                          <CWidgetStatsC
                            className="mb-3"
                            progress={{ color: 'danger', value: 100 }}
                            text="Widget helper text"
                            title={item.label}
                            value={othercount != null ? othercount?.toString() : "0"}
                          />
                        </CCol>
                        : null
          ))
          : null
        }
        {/* </CRow> */}
      </Carousel>

    </div>
  )
}

export default PiToplegend