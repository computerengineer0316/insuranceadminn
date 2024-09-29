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


Operationgraph.propTypes =
{
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes
    })
};

Operationgraph.propTypes = {
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





function Operationgraph({ filterOptions, defaultOptions }) {
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

    const [graphData, setGraphData] = useState({})



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
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/getOprationsCount`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("operation data >>>>", data.data);
                    setGraphData(data.data)

                })
                .catch((error) => {
                    console.log(error)
                })


        }
        if (loginusertype == "64622470b201a6f07b2dff22") {
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/getOprationsCount?dashboardType=oprationDashboard`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("operation data>>>>>><<<>>>>>>>", data.data);
                    setGraphData(data.data)

                }
                )
                .catch((error) => {
                    console.log(error)
                }
                )
        }
    }


    const options2 = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time taken by DC',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'No. Of Leads',
                },
            },
        },
    };

    const options3 = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'No. Of Policies pending with DC',
                },
            },

        },
    };

    return (
        <div>
            <Row>
                <Col className='' lg={6}>
                    <CCard className="mb-4">
                        <CCardHeader>No. of policies rec`d by DC</CCardHeader>
                        <CCardBody>
                            <CChart
                                type="line"
                                options={
                                    {
                                        scales: {
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: 'No. Of Policies per hour',
                                                },
                                            },

                                        },
                                    }
                                }
                                data={{
                                    labels: ['Before 8', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', 'After 6'],
                                    datasets: [
                                        {
                                            label: "No. of policies rec`d by dc",
                                            label: "No. of policies rec`d by dc",
                                            backgroundColor: "rgba(151, 187, 205, 0.2)",
                                            backgroundColor: "rgba(151, 187, 205, 0.2)",
                                            borderColor: "rgba(151, 187, 205, 1)",
                                            pointBackgroundColor: "rgba(151, 187, 205, 1)",
                                            pointBorderColor: "#fff",
                                            data: [graphData.dcrecievedsevencount, graphData.dcrecievedeightcount,
                                            graphData.dcrecievedninecount, graphData.dcrecievedtencount,
                                            graphData.dcrecievedelevencount, graphData.dcrecievedtwelvecount,
                                            graphData.dcrecievedthirteencount, graphData.dcrecievedfourteencount,
                                            graphData.dcrecievedfifteencount, graphData.dcrecievedsixteencount,
                                            graphData.dcrecievedseventeencount, graphData.dcrecievedeighteencount,
                                            graphData.dcrecievednineteencount]
                                        },
                                    ],
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </Col>
                <Col className='' lg={6}>
                    <CCard className="mb-4">
                        <CCardHeader>No. of policies rec`d by PI</CCardHeader>
                        <CCardBody>
                            <CChart
                                type="line"
                                options={
                                    {
                                        scales: {
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: 'No. Of Policies per hour',
                                                },
                                            },

                                        },
                                    }
                                }
                                data={{
                                    labels: ['Before 8', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', 'After 6'],
                                    datasets: [
                                        {
                                            label: "No. of policies rec`d by PI",
                                            backgroundColor: "rgba(151, 187, 205, 0.2)",
                                            borderColor: "rgba(151, 187, 205, 1)",
                                            pointBackgroundColor: "rgba(151, 187, 205, 1)",
                                            pointBorderColor: "#fff",
                                            data: [graphData.pirecievedsevencount, graphData.pirecievedeightcount,
                                            graphData.pirecievedninecount, graphData.pirecievedtencount,
                                            graphData.pirecievedelevencount, graphData.pirecievedtwelvecount,
                                            graphData.pirecievedthirteencount, graphData.pirecievedfourteencount,
                                            graphData.pirecievedfifteencount, graphData.pirecievedsixteencount,
                                            graphData.pirecievedseventeencount, graphData.pirecievedeighteencount,
                                            graphData.pirecievednineteencount]
                                        },
                                    ],
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </Col>
            </Row>
            <Row>
                <Col className='' lg={6}>
                    <CCard className="mb-4">
                        <CCardHeader>Time Taken By DC for Doc Collection</CCardHeader>
                        <CCardBody>
                            <CChartBar
                                options={{
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Minutes',
                                            },
                                        },
                                        y: {
                                            title: {
                                                display: true,
                                                text: 'No. Of Leads',
                                            },
                                        },
                                    },
                                }}
                                data={{
                                    labels: ['10', '20', '30', '40', '50', '60'],
                                    datasets: [
                                        {
                                            label: 'No. of Leads',
                                            backgroundColor: '#f87979',
                                            data: [graphData?.timeTakenByDCTen, graphData?.timeTakenByDCTwenty,
                                            graphData?.timeTakenByDCThirty, graphData?.timeTakenByDCForty,
                                            graphData?.timeTakenByDCFifty, graphData?.timeTakenByDCTSixty],
                                        },
                                    ],
                                }}
                                labels="months"
                            />
                        </CCardBody>
                    </CCard>
                </Col>
                <Col className='' lg={6}>
                    <CCard className="mb-4">
                        <CCardHeader>Time Taken By PI To Issue Policies</CCardHeader>
                        <CCardBody>
                            <CChartBar
                                options={{
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Minutes',
                                            },
                                        },
                                        y: {
                                            title: {
                                                display: true,
                                                text: 'No. Of Leads',
                                            },
                                        },
                                    },
                                }}
                                data={{
                                    labels: ['10', '20', '30', '40', '50', '60'],
                                    datasets: [
                                        {
                                            label: 'No. of Leads',
                                            backgroundColor: '#f87979',
                                            data: [graphData?.timeTakenByPITen, graphData?.timeTakenByDCTwenty,
                                            graphData?.timeTakenByDCThirty, graphData?.timeTakenByDCForty,
                                            graphData?.timeTakenByDCFifty, graphData?.timeTakenByDCTSixty],
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
                <Col className='' lg={6}>
                    <CCard className="mb-4">
                        <CCardHeader>No. of policies Pending by DC</CCardHeader>
                        <CCardBody>
                            <CChart
                                type="line"
                                options={{
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'No. Of Policies pending with DC',
                                            },
                                        },

                                    },
                                }}
                                data={{
                                    labels: ['8', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '6'],
                                    datasets: [
                                        {
                                            label: "No. of policies Pendingby dc",
                                            backgroundColor: "rgba(151, 187, 205, 0.2)",
                                            backgroundColor: "rgba(151, 187, 205, 0.2)",
                                            borderColor: "rgba(151, 187, 205, 1)",
                                            pointBackgroundColor: "rgba(151, 187, 205, 1)",
                                            pointBorderColor: "#fff",
                                            data: [graphData?.pendingDCSeven, graphData?.pendingDCEight, graphData?.pendingDCNine,
                                            graphData?.pendingDCTen, graphData?.pendingDCEleven,
                                            graphData?.pendingDCTwelve, graphData?.pendingDCThirteen,
                                            graphData?.pendingDCFourteen, graphData?.pendingDCFifteen,
                                            graphData?.pendingDCSixteen, graphData?.pendingDCSeventeen,
                                            graphData?.pendingDCEighteen, graphData?.pendingDCNineteen]
                                        },
                                    ],
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </Col>
                <Col className='' lg={6}>
                    <CCard className="mb-4">
                        <CCardHeader>No. of policies Pending by PI</CCardHeader>
                        <CCardBody>
                            <CChart
                                type="line"
                                options={{
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'No. Of Policies pending with PI',
                                            },
                                        },

                                    },
                                }}
                                data={{
                                    labels: ['8', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '6'],
                                    datasets: [
                                        {
                                            label: "No. of policies Pending by PI",
                                            backgroundColor: "rgba(151, 187, 205, 0.2)",
                                            borderColor: "rgba(151, 187, 205, 1)",
                                            pointBackgroundColor: "rgba(151, 187, 205, 1)",
                                            pointBorderColor: "#fff",
                                            data: [graphData?.pendingPISeven, graphData?.pendingPIEight,
                                            graphData?.pendingPINine, graphData?.pendingPITen,
                                            graphData?.pendingPIEleven, graphData?.pendingPITwelve,
                                            graphData?.pendingPIThirteen, graphData?.pendingPIFourteen,
                                            graphData?.pendingPIFifteen, graphData?.pendingPISixteen,
                                            graphData?.pendingPISeventeen, graphData?.pendingPIEighteen,
                                            graphData?.pendingPINineteen]
                                        },
                                    ],
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </Col>
            </Row>
            <Row>
                <Col className='' lg={6}>
                    <CCard className="mb-4">
                        <CCardHeader>No. of policies pending with Dc per LOB</CCardHeader>
                        <CCardBody>
                            <CChartBar
                                options={{
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Line Of Business',
                                            },
                                        },

                                    },
                                }}
                                data={{
                                    labels: ['Motor', 'Travel', 'Home', 'Medical', 'Yacht', 'Others'],
                                    datasets: [
                                        {
                                            label: 'No. of Leads',
                                            backgroundColor: '#f87979',
                                            data: [graphData.DCpendingMotorCount, graphData.DCpendingTravelCount,
                                            graphData.DCpendingMYedicalCount, graphData.DCpendingHomeCount,
                                            graphData.DCpendingYatchCount],
                                        },
                                    ],
                                }}
                            />



                        </CCardBody>
                    </CCard>
                </Col>
                <Col className='' lg={6}>
                    <CCard className="mb-4">
                        <CCardHeader>No. of policies pending with Pi per LOB</CCardHeader>
                        <CCardBody>
                            <CChartBar
                                options={{
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Line Of Business',
                                            },
                                        },

                                    },
                                }}
                                data={{
                                    labels: ['Motor', 'Travel', 'Home', 'Medical', 'Yacht', 'Others'],
                                    datasets: [
                                        {
                                            label: 'No. of Leads',
                                            backgroundColor: '#f87979',
                                            data: [graphData.PIpendingMotorCount, graphData.PIpendingTravelCount,
                                            graphData.PIpendingMYedicalCount, graphData.PIpendingHomeCount,
                                            graphData.pipendingYachtCount],
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

export default Operationgraph