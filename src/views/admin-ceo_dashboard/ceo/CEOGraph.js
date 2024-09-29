import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { CWidgetStatsC } from '@coreui/react'
import { Row, Col } from 'react-bootstrap'
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
    CChart,
    CChartBar,
    CChartPie,
} from '@coreui/react-chartjs'

import PropTypes from 'prop-types';

CEOGraph.propTypes =
{
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes
    })
};

CEOGraph.propTypes = {
    defaultOptions: PropTypes.shape({
        defaultlocation: PropTypes.string,
        defaultlob: PropTypes.string,
        defaultbusinessType: PropTypes.string,
        defaultagent: PropTypes.string,
        defaultdateRange: PropTypes,
        startdate: PropTypes,
        enddate: PropTypes,
        userType: PropTypes,
        selectedSupervisor: PropTypes

    })
};


function CEOGraph({ filterOptions, defaultOptions }) {

    const state = {
        lazyLoad: true,
        responsive: {
            0: {
                items: 1,
            },
            450: {
                items: 1,
            },
            600: {
                items: 1,
            },
            1000: {
                items: 4,
            },
        },
    }

    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getTotalCount();
        }
    }, [filterOptions]);

    const [earnedCommission, setEarnedCommission] = useState({})


    const getTotalCount = async () => {
        const userdata = JSON.parse(localStorage.getItem('user'));
        let newlocation = filterOptions.location;
        let newlob = filterOptions.lob;
        let newbusinessType = filterOptions.businessType;
        let newagent = filterOptions.agent;
        let dateRange = filterOptions.dateRange;
        let startdate = defaultOptions.startdate;
        let enddate = defaultOptions.enddate;
        let assign_staff = userdata.assign_staff;
        let usertype = defaultOptions.userType;
        let selectedsupervisor = defaultOptions.selectedSupervisor;


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
                userType: usertype != null ? usertype : "supervisor",
                selectedSupervisor: selectedsupervisor
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        };

        if (loginusertype == "650029a2df69a4033408903d") {
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/businessDashboard`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("data", data.data);
                })
                .catch((error) => {
                    console.log(error)
                })


        }
        if (loginusertype == "64622470b201a6f07b2dff22") {
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/businessDashboard`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("data>>>><><><><><>> now", data.data);
                    setEarnedCommission(data.data)
                }
                )
                .catch((error) => {
                    console.log(error)
                }
                )
        }
    }
    return (
        <div>

            <Row>
                <Col className='' lg={4}>
                    <CCard className="mb-4">
                        <CCardHeader>Total Leads</CCardHeader>
                        <CCardBody>
                            <CChartPie
                                data={{
                                    labels: ['Motor', 'Travel', 'Individual Medical', 'Other LOB'],
                                    datasets: [
                                        {
                                            data: [earnedCommission.motorCount, earnedCommission.travelCount,
                                            earnedCommission.homeCount, earnedCommission.medicalCount,
                                            earnedCommission.yatchCount, earnedCommission.ortherInsuranceCount],
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
                                    labels: ['Motor', 'Travel', 'Individual Medical', 'Other LOB'],
                                    datasets: [
                                        {
                                            data: [earnedCommission.closeMotorCount, earnedCommission.closeMotorCount,
                                            earnedCommission.closeHomeCount, earnedCommission.closeMedicalCount,
                                            earnedCommission.closeYatchCount, earnedCommission.closeOrtherInsuranceCount],
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
                                    labels: ['Motor', 'Travel', 'Individual Medical', 'Other LOB'],
                                    datasets: [
                                        {
                                            data: [earnedCommission.pendingMotorCount, earnedCommission.pendingTravelCount,
                                            earnedCommission.pendingHomeCount, earnedCommission.pendingMYedicalCount,
                                            earnedCommission.pendingYatchCount, earnedCommission.pendingOrtherInsuranceCount],
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
                                            data: [earnedCommission.sevencount, earnedCommission.eightcount,
                                            earnedCommission.ninecount, earnedCommission.tencount,
                                            earnedCommission.elevencount, earnedCommission.twelvecount,
                                            earnedCommission.thirteencount, earnedCommission.fourteencount,
                                            earnedCommission.fifteencount, earnedCommission.sixteencount,
                                            earnedCommission.seventeencount, earnedCommission.eighteencount,
                                            earnedCommission.nineteencount],
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
                                            data: [earnedCommission.closedsevenCount, earnedCommission.closedeightCount,
                                            earnedCommission.closednineCount, earnedCommission.closedtenCount,
                                            earnedCommission.closedelevenCount, earnedCommission.closedtwelveCount,
                                            earnedCommission.closedthirteenCount, earnedCommission.closedfourteenCount,
                                            earnedCommission.closedfifteenCount, earnedCommission.closedsixteenCount,
                                            earnedCommission.closedseventeenCount, earnedCommission.closedeighteenCount, earnedCommission.closednineteenCount],
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
                                            data: [earnedCommission.pendingsevenCount, earnedCommission.pendingeightCount,
                                            earnedCommission.pendingnineCount, earnedCommission.pendingtenCount,
                                            earnedCommission.pendingelevenCount, earnedCommission.pendingtwelveCount,
                                            earnedCommission.pendingthirteenCount, earnedCommission.pendingfourteenCount,
                                            earnedCommission.pendingfifteenCount, earnedCommission.pendingsixteenCount,
                                            earnedCommission.pendingseventeenCount, earnedCommission.pendingeighteenCount,
                                            earnedCommission.pendingninteenCount],
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
                                            data: [earnedCommission.hotleadsCount, earnedCommission.warmleadsCount,
                                            earnedCommission.coldleadsCount],
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
                                            data: [earnedCommission.totalsevenPremium, earnedCommission.totaleightPremium,
                                            earnedCommission.totalninePremium, earnedCommission.totaltenPremium,
                                            earnedCommission.totalelevenPremium, earnedCommission.totaltwelvePremium,
                                            earnedCommission.totalthirteenPremium, earnedCommission.totalfourteenPremium,
                                            earnedCommission.totalfifteenPremium, earnedCommission.totalsixteenPremium,
                                            earnedCommission.totalseventeenPremium, earnedCommission.totaleighteenPremium, earnedCommission.totalninteenPremium],

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
                                            data: [earnedCommission.totalsevenEarnedCommission,
                                            earnedCommission.totaleightEarnedCommission,
                                            earnedCommission.totalnineEarnedCommission,
                                            earnedCommission.totaltenEarnedCommission,
                                            earnedCommission.totalelevenEarnedCommission,
                                            earnedCommission.totaltwelveEarnedCommission,
                                            earnedCommission.totalthirteenEarnedCommission,
                                            earnedCommission.totalfourteenEarnedCommission,
                                            earnedCommission.totalfifteenEarnedCommission,
                                            earnedCommission.totalsixteenEarnedCommission,
                                            earnedCommission.totalseventeenEarnedCommission,
                                            earnedCommission.totaleighteenEarnedCommission,
                                            earnedCommission.totalnineteenEarnedCommission],
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
                </Col>
            </Row>
        </div>
    )
}

export default CEOGraph