import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { CWidgetStatsC } from '@coreui/react';
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
} from '@coreui/react'
import {
  CChartBar,
  CChartPie,
} from '@coreui/react-chartjs'
import PropTypes from 'prop-types';


AdminGraph.propTypes =
{
  filterOptions: PropTypes.shape({
    location: PropTypes.string,
    lob: PropTypes.string,
    businessType: PropTypes.string,
    agent: PropTypes.string,
    dateRange: PropTypes
  })
};

AdminGraph.propTypes = {
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



function AdminGraph({ filterOptions, defaultOptions }) {
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

  const [motorTotalCount, setMotorTotalCount] = useState(0);
  const [travelTotalCount, setTravelTotalCount] = useState(0);
  const [hometotalCount, setHometotalCount] = useState(0);
  const [medicalTotalCount, setMedicalTotalCount] = useState(0);
  const [yachtTotalCount, setYachtTotalCount] = useState(0);
  const [otherTotalCount, setOtherTotalCount] = useState(0);

  const [motorClosedCount, setMotorClosedCount] = useState(0);
  const [travelClosedCount, setTravelClosedCount] = useState(0);
  const [hometotalClosedCount, setHometotalClosedCount] = useState(0);
  const [medicalClosedCount, setMedicalClosedCount] = useState(0);
  const [yachtClosedCount, setYachtClosedCount] = useState(0);
  const [otherClosedCount, setOtherClosedCount] = useState(0);

  const [motorPendingCount, setMotorPendingCount] = useState(0);
  const [travelPendingCount, setTravelPendingCount] = useState(0);
  const [hometotalPendingCount, setHometotalPendingCount] = useState(0);
  const [medicalPendingCount, setMedicalPendingCount] = useState(0);
  const [yachtPendingCount, setYachtPendingCount] = useState(0);
  const [otherPendingCount, setOtherPendingCount] = useState(0);

  const [totalsevencount, setSevenCount] = useState(0);
  const [totaleightcount, setEightCount] = useState(0);
  const [totalninecount, setNineCount] = useState(0);
  const [totaltencount, setTenCount] = useState(0);
  const [totalelevencount, setElevenCount] = useState(0);
  const [totaltwelvecount, setTwelveCount] = useState(0);
  const [totalthirteencount, setThirteenCount] = useState(0);
  const [totalfourteencount, setFourteenCount] = useState(0);
  const [totalfifteencount, setFifteenCount] = useState(0);
  const [totalsixteencount, setSixteenCount] = useState(0);
  const [totalseventeencount, setSeventeenCount] = useState(0);
  const [totaleighteencount, setEighteenCount] = useState(0);
  const [totalnineteencount, setNineteenCount] = useState(0);

  const [closedsevencount, setClosedSevenCount] = useState(0);
  const [closedeightcount, setClosedEightCount] = useState(0);
  const [closedninecount, setClosedNineCount] = useState(0);
  const [closedtencount, setClosedTenCount] = useState(0);
  const [closedelevencount, setClosedElevenCount] = useState(0);
  const [closedtwelvecount, setClosedTwelveCount] = useState(0);
  const [closedthirteencount, setClosedThirteenCount] = useState(0);
  const [closedfourteencount, setClosedFourteenCount] = useState(0);
  const [closedfifteencount, setClosedFifteenCount] = useState(0);
  const [closedsixteencount, setClosedSixteenCount] = useState(0);
  const [closedseventeencount, setClosedSeventeenCount] = useState(0);
  const [closedeighteencount, setClosedEighteenCount] = useState(0);
  const [closednineteencount, setClosedNineteenCount] = useState(0);

  const [pendingsevencount, setPendingSevenCount] = useState(0);
  const [pendingeightcount, setPendingEightCount] = useState(0);
  const [pendingninecount, setPendingNineCount] = useState(0);
  const [pendingtencount, setPendingTenCount] = useState(0);
  const [pendingelevencount, setPendingElevenCount] = useState(0);
  const [pendingtwelvecount, setPendingTwelveCount] = useState(0);
  const [pendingthirteencount, setPendingThirteenCount] = useState(0);
  const [pendingfourteencount, setPendingFourteenCount] = useState(0);
  const [pendingfifteencount, setPendingFifteenCount] = useState(0);
  const [pendingsixteencount, setPendingSixteenCount] = useState(0);
  const [pendingseventeencount, setPendingSeventeenCount] = useState(0);
  const [pendingeighteencount, setPendingEighteenCount] = useState(0);
  const [pendingnineteencount, setPendingNineteenCount] = useState(0);

  const [totalhotcount, setTotalHotCount] = useState(0);
  const [totalwarmcount, setTotalWarmCount] = useState(0);
  const [totalcoldcount, setTotalColdCount] = useState(0);

  const [totalsevenpremium, setTotalSevenPremium] = useState(0);
  const [totaleightpremium, setTotalEightPremium] = useState(0);
  const [totalninepremium, setTotalNinePremium] = useState(0);
  const [totaltenpremium, setTotalTenPremium] = useState(0);
  const [totalelevenpremium, setTotalElevenPremium] = useState(0);
  const [totaltwelvepremium, setTotalTwelvePremium] = useState(0);
  const [totalthirteenpremium, setTotalThirteenPremium] = useState(0);
  const [totalfourteenpremium, setTotalFourteenPremium] = useState(0);
  const [totalfifteenpremium, setTotalFifteenPremium] = useState(0);
  const [totalsixteenpremium, setTotalSixteenPremium] = useState(0);
  const [totalseventeenpremium, setTotalSeventeenPremium] = useState(0);
  const [totaleighteenpremium, setTotalEighteenPremium] = useState(0);
  const [totalnineteenpremium, setTotalNineteenPremium] = useState(0);






  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getTotalCount();
      getTotalleadcounts();
    }
  }, [filterOptions]);








  const getTotalCount = async () => {
    try {

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

      await fetch(`https://insuranceapi-3o5t.onrender.com/api/SuperAdmintopLeagentCount`, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log("data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>dfdsfdsfdsfdfdss", data.data);
          setMotorTotalCount(data.data.motorCount);
          setTravelTotalCount(data.data.travelCount);
          setHometotalCount(data.data.homeCount);
          setMedicalTotalCount(data.data.medicalCount);
          setYachtTotalCount(data.data.yatchCount);
          setOtherTotalCount(data.data.ortherInsuranceCount);
          setMotorClosedCount(data.data.closeMotorCount);
          setTravelClosedCount(data.data.closeTravelCount);
          setHometotalClosedCount(data.data.closeHomeCount);
          setMedicalClosedCount(data.data.closeMedicalCount);
          setYachtClosedCount(data.data.closeYatchCount);
          setOtherClosedCount(data.data.closeOrtherInsuranceCount);
          setMotorPendingCount(data.data.pendingMotorCount);
          setTravelPendingCount(data.data.pendingTravelCount);
          setHometotalPendingCount(data.data.pendingHomeCount);
          setMedicalPendingCount(data.data.pendingMYedicalCount);
          setYachtPendingCount(data.data.pendingYatchCount);
          setOtherPendingCount(data.data.pendingOrtherInsuranceCount);

        }
        )
        .catch((error) => {
          console.log(error)
        }
        )

    } catch (error) {
      console.log(error)
    }
  }

  const getTotalleadcounts = async () => {
    try {

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

      await fetch(`https://insuranceapi-3o5t.onrender.com/api/getsuperadmingraphcount`, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log("data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>dfdsfdsfdsfdfdss", data.data.eightcount
          );
          setSevenCount(data.data.sevencount);
          setEightCount(data.data.eightcount);
          setNineCount(data.data.ninecount);
          setTenCount(data.data.tencount);
          setElevenCount(data.data.elevencount);
          setTwelveCount(data.data.twelvecount);
          setThirteenCount(data.data.thirteencount);
          setFourteenCount(data.data.fourteencount);
          setFifteenCount(data.data.fifteencount);
          setSixteenCount(data.data.sixteencount);
          setSeventeenCount(data.data.seventeencount);
          setEighteenCount(data.data.eighteencount);
          setNineteenCount(data.data.nineteencount);

          setClosedSevenCount(data.data.closedsevenCount);
          setClosedEightCount(data.data.closedeightCount);
          setClosedNineCount(data.data.closednineCount);
          setClosedTenCount(data.data.closedtenCount);
          setClosedElevenCount(data.data.closedelevenCount);
          setClosedTwelveCount(data.data.closedtwelveCount);
          setClosedThirteenCount(data.data.closedthirteenCount);
          setClosedFourteenCount(data.data.closedfourteenCount);
          setClosedFifteenCount(data.data.closedfifteenCount);
          setClosedSixteenCount(data.data.closedsixteenCount);
          setClosedSeventeenCount(data.data.closedseventeenCount);
          setClosedEighteenCount(data.data.closedeighteenCount);
          setClosedNineteenCount(data.data.closedninteenCount);

          setPendingSevenCount(data.data.pendingsevenCount);
          setPendingEightCount(data.data.pendingeightCount);
          setPendingNineCount(data.data.pendingnineCount);
          setPendingTenCount(data.data.pendingtenCount);
          setPendingElevenCount(data.data.pendingelevenCount);
          setPendingTwelveCount(data.data.pendingtwelveCount);
          setPendingThirteenCount(data.data.pendingthirteenCount);
          setPendingFourteenCount(data.data.pendingfourteenCount);
          setPendingFifteenCount(data.data.pendingfifteenCount);
          setPendingSixteenCount(data.data.pendingsixteenCount);
          setPendingSeventeenCount(data.data.pendingseventeenCount);
          setPendingEighteenCount(data.data.pendingeighteenCount);
          setPendingNineteenCount(data.data.pendingninteenCount);

          setTotalHotCount(data.data.hotleadsCount);
          setTotalWarmCount(data.data.warmleadsCount);
          setTotalColdCount(data.data.coldleadsCount);

          setTotalSevenPremium(data.data.totalsevenPremium);
          setTotalEightPremium(data.data.totaleightPremium);
          setTotalNinePremium(data.data.totalninePremium);
          setTotalTenPremium(data.data.totaltenPremium);
          setTotalElevenPremium(data.data.totalelevenPremium);
          setTotalTwelvePremium(data.data.totaltwelvePremium);
          setTotalThirteenPremium(data.data.totalthirteenPremium);
          setTotalFourteenPremium(data.data.totalfourteenPremium);
          setTotalFifteenPremium(data.data.totalfifteenPremium);
          setTotalSixteenPremium(data.data.totalsixteenPremium);
          setTotalSeventeenPremium(data.data.totalseventeenPremium);
          setTotalEighteenPremium(data.data.totaleighteenPremium);
          setTotalNineteenPremium(data.data.totalninteenPremium);


        }
        )
        .catch((error) => {
          console.log(error)
        }
        )

    }
    catch (error) {
      console.log(error)
    }
  }


  //    console.log("motorTotalCount",motorTotalCount);
  //     console.log("travelTotalCount",travelTotalCount);
  //     console.log("hometotalCount",hometotalCount);
  //     console.log("medicalTotalCount",medicalTotalCount);
  //     console.log("yachtTotalCount",yachtTotalCount);
  //     console.log("otherTotalCount",otherTotalCount);

  // console.log("motorClosedCount",motorClosedCount);
  // console.log("travelClosedCount",travelClosedCount);
  // console.log("hometotalClosedCount",hometotalClosedCount);
  // console.log("medicalClosedCount",medicalClosedCount);
  // console.log("yachtClosedCount",yachtClosedCount);
  // console.log("otherClosedCount",otherClosedCount);

  // console.log("motorPendingCount",motorPendingCount);
  // console.log("travelPendingCount",travelPendingCount);
  // console.log("hometotalPendingCount",hometotalPendingCount);
  // console.log("medicalPendingCount",medicalPendingCount);
  // console.log("yachtPendingCount",yachtPendingCount);
  // console.log("otherPendingCount",otherPendingCount);

  //  console.log("totalsevencount",totalsevencount);
  //   console.log("totaleightcount",totaleightcount);
  //   console.log("totalninecount",totalninecount);
  //   console.log("totaltencount",totaltencount);
  //   console.log("totalelevencount",totalelevencount);
  //   console.log("totaltwelvecount",totaltwelvecount);
  //   console.log("totalthirteencount",totalthirteencount);
  //   console.log("totalfourteencount",totalfourteencount);
  //   console.log("totalfifteencount",totalfifteencount);
  //   console.log("totalsixteencount",totalsixteencount);
  //   console.log("totalseventeencount",totalseventeencount);
  //   console.log("totaleighteencount",totaleighteencount);
  //   console.log("totalnineteencount",totalnineteencount);

  // console.log("closedsevencount",closedsevencount);
  // console.log("closedeightcount",closedeightcount);
  // console.log("closedninecount",closedninecount);
  // console.log("closedtencount",closedtencount);
  // console.log("closedelevencount",closedelevencount);
  // console.log("closedtwelvecount",closedtwelvecount);
  // console.log("closedthirteencount",closedthirteencount);
  // console.log("closedfourteencount",closedfourteencount);
  // console.log("closedfifteencount",closedfifteencount);
  // console.log("closedsixteencount",closedsixteencount);
  // console.log("closedseventeencount",closedseventeencount);
  // console.log("closedeighteencount",closedeighteencount);
  // console.log("closednineteencount",closednineteencount);

  // console.log("pendingsevencount",pendingsevencount);
  // console.log("pendingeightcount",pendingeightcount);
  // console.log("pendingninecount",pendingninecount);
  // console.log("pendingtencount",pendingtencount);
  // console.log("pendingelevencount",pendingelevencount);
  // console.log("pendingtwelvecount",pendingtwelvecount);
  // console.log("pendingthirteencount",pendingthirteencount);
  // console.log("pendingfourteencount",pendingfourteencount);
  // console.log("pendingfifteencount",pendingfifteencount);
  // console.log("pendingsixteencount",pendingsixteencount);
  // console.log("pendingseventeencount",pendingseventeencount);
  // console.log("pendingeighteencount",pendingeighteencount); `
  // console.log("pendingnineteencount",pendingnineteencount);





  return (
    <div>
      <Row>
        <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Total Leads</CCardHeader>
            <CCardBody>
              <CChartPie
                data={{
                  labels: ['Motor', 'Travel', 'Home', 'Medical', 'Yacht', 'Other LOB'],
                  datasets: [
                    {
                      data: [motorTotalCount, travelTotalCount, hometotalCount, medicalTotalCount, yachtTotalCount, otherTotalCount],
                      backgroundColor: ['#FF6384', '#007500', '#FFCE56', '#36A2EB', '#5742f5', '#da42f5'],
                      hoverBackgroundColor: ['#FF6384', '#007500', '#FFCE56', '#36A2EB', '#5742f5', '#da42f5'],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </Col>
        <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Closed Leads</CCardHeader>
            <CCardBody>
              <CChartPie
                data={{
                  labels: ['Motor', 'Travel', 'Home', 'Medical', 'Yacht', 'Other LOB'],
                  datasets: [
                    {
                      data: [motorClosedCount, travelClosedCount, hometotalClosedCount, medicalClosedCount, yachtClosedCount, otherClosedCount],
                      backgroundColor: ['#FF6384', '#007500', '#FFCE56', '#36A2EB', '#5742f5', '#da42f5'],
                      hoverBackgroundColor: ['#FF6384', '#007500', '#FFCE56', '#36A2EB', '#5742f5', '#da42f5'],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </Col>
        <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Pending Leads</CCardHeader>
            <CCardBody>
              <CChartPie
                data={{
                  labels: ['Motor', 'Travel', 'Home', 'Medical', 'Yacht', 'Other LOB'],
                  datasets: [
                    {
                      data: [motorPendingCount, travelPendingCount, hometotalPendingCount, medicalPendingCount, yachtPendingCount, otherPendingCount],
                      backgroundColor: ['#FF6384', '#007500', '#FFCE56', '#36A2EB', '#5742f5', '#da42f5'],
                      hoverBackgroundColor: ['#FF6384', '#007500', '#FFCE56', '#36A2EB', '#5742f5', '#da42f5'],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </Col>
      </Row>
      <Row>
        <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Total Leads</CCardHeader>
            <CCardBody>
              <CChartBar
                options={{
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Hours'
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'No. of Leads'
                      }
                    }
                  }
                }}
                data={{
                  labels: ['Before 8', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', 'After 6'],
                  datasets: [
                    {
                      label: 'No. of Leads',
                      backgroundColor: '#f87979',
                      data: [totalsevencount, totaleightcount, totalninecount, totaltencount, totalelevencount, totaltwelvecount, totalthirteencount, totalfourteencount, totalfifteencount, totalsixteencount, totalseventeencount, totaleighteencount, totalnineteencount],
                    },
                  ],
                }}

              />
            </CCardBody>
          </CCard>
        </Col>
        <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Closed Leads</CCardHeader>
            <CCardBody>
              <CChartBar
                options={{
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Hours'
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'No. of Leads'
                      }
                    }
                  }
                }}
                data={{
                  labels: ['Before 8', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', 'After 6'],
                  datasets: [
                    {
                      label: 'No. of Leads',
                      backgroundColor: '#f87979',
                      data: [closedsevencount, closedeightcount, closedninecount, closedtencount, closedelevencount, closedtwelvecount, closedthirteencount, closedfourteencount, closedfifteencount, closedsixteencount, closedseventeencount, closedeighteencount, closednineteencount],
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
        </Col>
        <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Pending Leads</CCardHeader>
            <CCardBody>
              <CChartBar
                options={{
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Hours'
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'No. of Leads'
                      }
                    }
                  }
                }}
                data={{
                  labels: ['Before 8', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', 'After 6'],
                  datasets: [
                    {
                      label: 'No. of Leads',
                      backgroundColor: '#f87979',
                      data: [pendingsevencount, pendingeightcount, pendingninecount, pendingtencount, pendingelevencount, pendingtwelvecount, pendingthirteencount, pendingfourteencount, pendingfifteencount, pendingsixteencount, pendingseventeencount, pendingeighteencount, pendingnineteencount],
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
        </Col>
      </Row>

      <Row>
        <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Classification of Total Leads</CCardHeader>
            <CCardBody>
              <CChartBar
                options={{
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Classification'
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'No. of Leads'
                      }
                    }
                  },
                }}
                data={{
                  labels: ['Hot', 'Warm', 'Cold'],
                  datasets: [
                    {
                      label: 'No. of Leads',
                      backgroundColor: '#1848A4',
                      data: [totalhotcount, totalwarmcount, totalcoldcount],
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
        </Col>
        <Col className='' lg={4}>
          <CCard className="mb-4">
            <CCardHeader>Booked Premium</CCardHeader>
            <CCardBody>
              <CChartBar
                options={{
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Hours'
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Amount in AED 0,000'
                      }
                    }
                  }
                }}
                data={{
                  labels: ['Before 8', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', 'After 6'],
                  datasets: [
                    {
                      label: 'Booked Premium',
                      backgroundColor: '#1848A4',
                      data: [totalsevenpremium, totaleightpremium, totalninepremium, totaltenpremium, totalelevenpremium, totaltwelvepremium, totalthirteenpremium, totalfourteenpremium, totalfifteenpremium, totalsixteenpremium, totalseventeenpremium, totaleighteenpremium, totalnineteenpremium],

                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
        </Col>
        <Col className='' lg={4}>
          <CCard className="mb-4" >
            <CCardHeader>Earned Commission</CCardHeader>
            <CCardBody >

              <CChartBar
                options={{
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Hours'
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Amount in AED 0,000'
                      }
                    }
                  }
                }}
                data={{
                  labels: ['Before 8', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', 'After 6'],
                  datasets: [
                    {
                      label: 'Earned Commission',
                      backgroundColor: '#1848A4',
                      data: [0, 5, 10, 15, 20, 3, 6, 9, 12, 15, 16, 17, 18],
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
        </Col>
      </Row>
    </div>
  )
}

export default AdminGraph;