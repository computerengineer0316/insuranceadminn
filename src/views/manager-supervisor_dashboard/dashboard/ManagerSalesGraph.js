import { CCard, CRow, CCol, CCardBody, CCardHeader } from '@coreui/react';
import { CChartBar, CChartLine, CChartPie } from '@coreui/react-chartjs';
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'
import { Container, Col, Row, Modal, Button, Accordion } from 'react-bootstrap';


ManagerSalesGraph.propTypes =
{
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes
    })
};

ManagerSalesGraph.propTypes = {
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

ManagerSalesGraph.propTypes = {
    lobdata: PropTypes.string,
};

function ManagerSalesGraph({ filterOptions, defaultOptions, lobdata }) {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            getdata()
        }
    }, [lobdata]);

    // useEffect(() => {
    //    getdata()
    // }, [lobdata])

    const random1 = () => Math.round(Math.random() * 100)

    const [graphvalues, setGraphvalues] = useState()

    const getdata = async () => {

        let newlob = lobdata.map((item) => item.value)

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ lob: newlob }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch('https://insuranceapi-3o5t.onrender.com/api/get_new_leads_count', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setGraphvalues(data)

            }
            );


    }

    // let chartData = {
    //   labels: [],
    //   datasets: [],
    // };

    // if (graphvalues && Array.isArray(graphvalues.data)) {
    //   // chartData = {
    //   //   labels: Array.from(new Set(graphvalues.data.flatMap(item => item.monthlydata.map(data => data.month)))),
    //   //   datasets: graphvalues.data.map(item => ({
    //   //     label: item.line_of_business_name,
    //   //     backgroundColor: item.line_of_business_name === 'Motor' ? '#0D2F92' : 'Travel' ? '#007500' : 'Home' ? '#FFCE56' : 'Medical' ? '#36A2EB' : 'Yacht' ? '#5742f5' : 'other' ? '#da42f5' : '#FFCE56',
    //   //     hoverBackgroundColor: item.line_of_business_name === 'Motor' ? '#0D2F92' : 'Travel' ? '#007500' : 'Home' ? '#FFCE56' : 'Medical' ? '#36A2EB' : 'Yacht' ? '#5742f5' : 'other' ? '#da42f5' : '#FFCE56',
    //   //     data: item.monthlydata.map(data => data.count),
    //   //   })),
    //   // };

    //   chartData = {
    //     labels: Array.from(new Set(graphvalues.data.flatMap(item => item.monthlydata.map(data => data.month)))),
    //     datasets: graphvalues.data.map(item => ({
    //       label: item.line_of_business_name,
    //       backgroundColor: getBackgroundColor(item.line_of_business_name),
    //       hoverBackgroundColor: getHoverBackgroundColor(item.line_of_business_name),
    //       data: item.monthlydata.map(data => data.count),
    //     })),
    //   };

    //   function getBackgroundColor(line_of_business_name) {
    //     switch (line_of_business_name) {
    //       case 'Motor':
    //         return '#FF6384';
    //       case 'Travel':
    //         return '#007500';
    //       case 'Home':
    //         return '#FFCE56';
    //       case 'Medical':
    //         return '#36A2EB';
    //       case 'Yacht':
    //         return '#5742f5';
    //       case 'other':
    //         return '#da42f5';
    //       default:
    //         return '#da42f5'; // Default color
    //     }
    //   }


    //   function getHoverBackgroundColor(line_of_business_name) {
    //     // Use the same logic as getBackgroundColor to determine hover color if needed.
    //     return getBackgroundColor(line_of_business_name);
    //   }
    // }


    let piechartData = {
        labels: [],
        datasets: [],
    };

    if (graphvalues && Array.isArray(graphvalues.data)) {
        piechartData = {
            labels: graphvalues.data.map(item => item.line_of_business_name),
            datasets: graphvalues.data.map(item => ({
                label: item.line_of_business_name,
                data: [item.total],
                backgroundColor: item.line_of_business_name === 'Motor' ? '#0D2F92' : 'Travel' ? '#007500' : 'Home' ? '#FFCE56' : 'Medical' ? '#36A2EB' : 'Yacht' ? '#5742f5' : 'other' ? '#da42f5' : '#FFCE56',
                hoverBackgroundColor: item.line_of_business_name === 'Motor' ? '#0D2F92' : 'Travel' ? '#007500' : 'Home' ? '#FFCE56' : 'Medical' ? '#36A2EB' : 'Yacht' ? '#5742f5' : 'other' ? '#da42f5' : '#FFCE56',

            })),
        };
    }


    const [motorTotalCount, setMotorTotalCount] = useState(0);
    const [travelTotalCount, setTravelTotalCount] = useState(0);
    const [hometotalCount, setHometotalCount] = useState(0);
    const [medicalTotalCount, setMedicalTotalCount] = useState(0);
    const [yachtTotalCount, setYachtTotalCount] = useState(0);
    const [otherTotalCount, setOtherTotalCount] = useState(0);



    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getTotalCount();
            getTotaldata();
        }
    }, [filterOptions]);


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
        let usertype = defaultOptions.userType

        if (newlocation == null || newlocation == undefined || !Array.isArray(newlocation) || newlocation.length === 0) {
            newlocation = defaultOptions.defaultlocation.map((item) => item.value);
            //   newlocation = [];
        }
        else {
            newlocation = newlocation.map((item) => item.value);
        }

        if (newlob == null || newlob == undefined || !Array.isArray(newlob) || newlob.length === 0) {
            newlob = defaultOptions.defaultlob.map((item) => item.value);
            //   newlob = [];
        }
        else {
            newlob = newlob.map((item) => item.value);
        }

        if (newbusinessType == null || newbusinessType == undefined || !Array.isArray(newbusinessType) || newbusinessType.length === 0) {
            newbusinessType = defaultOptions.defaultbusinessType.map((item) => item.value);
            //   newbusinessType = [];

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


        if (loginusertype == "646224deb201a6f07b2dff32") {
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/topLeagentCount`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("data", data.data);
                    setMotorTotalCount(data.data.motorCount)
                    setTravelTotalCount(data.data.travelCount)
                    setHometotalCount(data.data.homeCount)
                    setMedicalTotalCount(data.data.medicalCount)
                    setYachtTotalCount(data.data.yatchCount)
                    setOtherTotalCount(data.data.ortherInsuranceCount)
                })
                .catch((error) => {
                    console.log(error)
                })


        }
        if (loginusertype == "64622470b201a6f07b2dff22") {
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/topLeagentCount?dashboardType=supervisorDashboard`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("data", data.data);
                    setMotorTotalCount(data.data.motorCount)
                    setTravelTotalCount(data.data.travelCount)
                    setHometotalCount(data.data.homeCount)
                    setMedicalTotalCount(data.data.medicalCount)
                    setYachtTotalCount(data.data.yatchCount)
                    setOtherTotalCount(data.data.ortherInsuranceCount)
                }
                )
                .catch((error) => {
                    console.log(error)
                }
                )

        }
    }


    const [janmotorCount, setJanmotorCount] = useState(0);
    const [febmotorCount, setFebmotorCount] = useState(0);
    const [marmotorCount, setMarmotorCount] = useState(0);
    const [aprmotorCount, setAprmotorCount] = useState(0);
    const [maymotorCount, setMaymotorCount] = useState(0);
    const [junmotorCount, setJunmotorCount] = useState(0);
    const [julmotorCount, setJulmotorCount] = useState(0);
    const [augmotorCount, setAugmotorCount] = useState(0);
    const [sepmotorCount, setSepmotorCount] = useState(0);
    const [octmotorCount, setOctmotorCount] = useState(0);
    const [novmotorCount, setNovmotorCount] = useState(0);
    const [decmotorCount, setDecmotorCount] = useState(0);

    const [jantravelCount, setJantravelCount] = useState(0);
    const [febtravelCount, setFebtravelCount] = useState(0);
    const [martravelCount, setMartravelCount] = useState(0);
    const [aprtravelCount, setAprtravelCount] = useState(0);
    const [maytravelCount, setMaytravelCount] = useState(0);
    const [juntravelCount, setJuntravelCount] = useState(0);
    const [jultravelCount, setJultravelCount] = useState(0);
    const [augtravelCount, setAugtravelCount] = useState(0);
    const [septravelCount, setSeptravelCount] = useState(0);
    const [octtravelCount, setOcttravelCount] = useState(0);
    const [novtravelCount, setNovtravelCount] = useState(0);
    const [dectravelCount, setDectravelCount] = useState(0);

    const [janhomeCount, setJanhomeCount] = useState(0);
    const [febhomeCount, setFebhomeCount] = useState(0);
    const [marhomeCount, setMarhomeCount] = useState(0);
    const [aprhomeCount, setAprhomeCount] = useState(0);
    const [mayhomeCount, setMayhomeCount] = useState(0);
    const [junhomeCount, setJunhomeCount] = useState(0);
    const [julhomeCount, setJulhomeCount] = useState(0);
    const [aughomeCount, setAughomeCount] = useState(0);
    const [sephomeCount, setSehomeCount] = useState(0);
    const [octhomeCount, setOcthomeCount] = useState(0);
    const [novhomeCount, setNovhomeCount] = useState(0);
    const [dechomeCount, setDechomeCount] = useState(0);

    const [janmedicalCount, setJanmedicalCount] = useState(0);
    const [febmedicalCount, setFebmedicalCount] = useState(0);
    const [marmedicalCount, setMarmedicalCount] = useState(0);
    const [aprmedicalCount, setAprmedicalCount] = useState(0);
    const [maymedicalCount, setMaymedicalCount] = useState(0);
    const [junmedicalCount, setJunmedicalCount] = useState(0);
    const [julmedicalCount, setJulmedicalCount] = useState(0);
    const [augmedicalCount, setAugmedicalCount] = useState(0);
    const [sepmedicalCount, setSepmedicalCount] = useState(0);
    const [octmedicalCount, setOctmedicalCount] = useState(0);
    const [novmedicalCount, setNovmedicalCount] = useState(0);
    const [decmedicalCount, setDecmedicalCount] = useState(0);

    const [janyachtCount, setJanyachtCount] = useState(0);
    const [febyachtCount, setFebyachtCount] = useState(0);
    const [maryachtCount, setMaryachtCount] = useState(0);
    const [apryachtCount, setApryachtCount] = useState(0);
    const [mayyachtCount, setMayyachtCount] = useState(0);
    const [junyachtCount, setJunyachtCount] = useState(0);
    const [julyachtCount, setJulyachtCount] = useState(0);
    const [augyachtCount, setAugyachtCount] = useState(0);
    const [sepyachtCount, setSepyachtCount] = useState(0);
    const [octyachtCount, setOctyachtCount] = useState(0);
    const [novyachtCount, setNovyachtCount] = useState(0);
    const [decyachtCount, setDecyachtCount] = useState(0);

    const [janotherCount, setJanotherCount] = useState(0);
    const [febotherCount, setFebotherCount] = useState(0);
    const [marotherCount, setMarotherCount] = useState(0);
    const [aprotherCount, setAprotherCount] = useState(0);
    const [mayotherCount, setMayotherCount] = useState(0);
    const [junotherCount, setJunotherCount] = useState(0);
    const [julotherCount, setJulotherCount] = useState(0);
    const [augotherCount, setAugotherCount] = useState(0);
    const [sepotherCount, setSepotherCount] = useState(0);
    const [octotherCount, setOctotherCount] = useState(0);
    const [novotherCount, setNovotherCount] = useState(0);
    const [decotherCount, setDecotherCount] = useState(0);



    const getTotaldata = async () => {

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


        if (loginusertype == "646224deb201a6f07b2dff32") {
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/getAllGraphCount`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("data", data.data.sepmotorCount);
                    setJanmotorCount(data.data.janmotorCount);
                    setFebmotorCount(data.data.febmotorCount);
                    setMarmotorCount(data.data.marmotorCount);
                    setAprmotorCount(data.data.aprmotorCount);
                    setMaymotorCount(data.data.maymotorCount);
                    setJunmotorCount(data.data.junmotorCount);
                    setJulmotorCount(data.data.julmotorCount);
                    setAugmotorCount(data.data.augmotorCount);
                    setSepmotorCount(data.data.sepmotorCount);
                    setOctmotorCount(data.data.octmotorCount);
                    setNovmotorCount(data.data.novmotorCount);
                    setDecmotorCount(data.data.decmotorCount);

                    setJantravelCount(data.data.jantravelCount);
                    setFebtravelCount(data.data.febtravelCount);
                    setMartravelCount(data.data.martravelCount);
                    setAprtravelCount(data.data.aprtravelCount);
                    setMaytravelCount(data.data.maytravelCount);
                    setJuntravelCount(data.data.juntravelCount);
                    setJultravelCount(data.data.jultravelCount);
                    setAugtravelCount(data.data.augtravelCount);
                    setSeptravelCount(data.data.septravelCount);
                    setOcttravelCount(data.data.octtravelCount);
                    setNovtravelCount(data.data.novtravelCount);
                    setDectravelCount(data.data.dectravelCount);

                    setJanhomeCount(data.data.janhomeCount);
                    setFebhomeCount(data.data.febhomeCount);
                    setMarhomeCount(data.data.marhomeCount);
                    setAprhomeCount(data.data.aprhomeCount);
                    setMayhomeCount(data.data.mayhomeCount);
                    setJunhomeCount(data.data.junhomeCount);
                    setJulhomeCount(data.data.julhomeCount);
                    setAughomeCount(data.data.aughomeCount);
                    setSehomeCount(data.data.sephomeCount);
                    setOcthomeCount(data.data.octhomeCount);
                    setNovhomeCount(data.data.novhomeCount);
                    setDechomeCount(data.data.dechomeCount);

                    setJanmedicalCount(data.data.janmedicalCount);
                    setFebmedicalCount(data.data.febmedicalCount);
                    setMarmedicalCount(data.data.marmedicalCount);
                    setAprmedicalCount(data.data.aprmedicalCount);
                    setMaymedicalCount(data.data.maymedicalCount);
                    setJunmedicalCount(data.data.junmedicalCount);
                    setJulmedicalCount(data.data.julmedicalCount);
                    setAugmedicalCount(data.data.augmedicalCount);
                    setSepmedicalCount(data.data.sepmedicalCount);
                    setOctmedicalCount(data.data.octmedicalCount);
                    setNovmedicalCount(data.data.novmedicalCount);
                    setDecmedicalCount(data.data.decmedicalCount);

                    setJanyachtCount(data.data.janyachtCount);
                    setFebyachtCount(data.data.febyachtCount);
                    setMaryachtCount(data.data.maryachtCount);
                    setApryachtCount(data.data.apryachtCount);
                    setMayyachtCount(data.data.mayyachtCount);
                    setJunyachtCount(data.data.junyachtCount);
                    setJulyachtCount(data.data.julyachtCount);
                    setAugyachtCount(data.data.augyachtCount);
                    setSepyachtCount(data.data.sepyachtCount);
                    setOctyachtCount(data.data.octyachtCount);
                    setNovyachtCount(data.data.novyachtCount);
                    setDecyachtCount(data.data.decyachtCount);

                    setJanotherCount(data.data.janotherCount);
                    setFebotherCount(data.data.febotherCount);
                    setMarotherCount(data.data.marotherCount);
                    setAprotherCount(data.data.aprotherCount);
                    setMayotherCount(data.data.mayotherCount);
                    setJunotherCount(data.data.junotherCount);
                    setJulotherCount(data.data.julotherCount);
                    setAugotherCount(data.data.augotherCount);
                    setSepotherCount(data.data.sepotherCount);
                    setOctotherCount(data.data.octotherCount);
                    setNovotherCount(data.data.novotherCount);
                    setDecotherCount(data.data.decotherCount);

                }
                )
                .catch((error) => {
                    console.log(error)
                })


        }
        if (loginusertype == "64622470b201a6f07b2dff22") {
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/getAllGraphCount?dashboardType=supervisorDashboard`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("data", data.data.sepmotorCount);
                    setJanmotorCount(data.data.janmotorCount);
                    setFebmotorCount(data.data.febmotorCount);
                    setMarmotorCount(data.data.marmotorCount);
                    setAprmotorCount(data.data.aprmotorCount);
                    setMaymotorCount(data.data.maymotorCount);
                    setJunmotorCount(data.data.junmotorCount);
                    setJulmotorCount(data.data.julmotorCount);
                    setAugmotorCount(data.data.augmotorCount);
                    setSepmotorCount(data.data.sepmotorCount);
                    setOctmotorCount(data.data.octmotorCount);
                    setNovmotorCount(data.data.novmotorCount);
                    setDecmotorCount(data.data.decmotorCount);

                    setJantravelCount(data.data.jantravelCount);
                    setFebtravelCount(data.data.febtravelCount);
                    setMartravelCount(data.data.martravelCount);
                    setAprtravelCount(data.data.aprtravelCount);
                    setMaytravelCount(data.data.maytravelCount);
                    setJuntravelCount(data.data.juntravelCount);
                    setJultravelCount(data.data.jultravelCount);
                    setAugtravelCount(data.data.augtravelCount);
                    setSeptravelCount(data.data.septravelCount);
                    setOcttravelCount(data.data.octtravelCount);
                    setNovtravelCount(data.data.novtravelCount);
                    setDectravelCount(data.data.dectravelCount);

                    setJanhomeCount(data.data.janhomeCount);
                    setFebhomeCount(data.data.febhomeCount);
                    setMarhomeCount(data.data.marhomeCount);
                    setAprhomeCount(data.data.aprhomeCount);
                    setMayhomeCount(data.data.mayhomeCount);
                    setJunhomeCount(data.data.junhomeCount);
                    setJulhomeCount(data.data.julhomeCount);
                    setAughomeCount(data.data.aughomeCount);
                    setSehomeCount(data.data.sephomeCount);
                    setOcthomeCount(data.data.octhomeCount);
                    setNovhomeCount(data.data.novhomeCount);
                    setDechomeCount(data.data.dechomeCount);

                    setJanmedicalCount(data.data.janmedicalCount);
                    setFebmedicalCount(data.data.febmedicalCount);
                    setMarmedicalCount(data.data.marmedicalCount);
                    setAprmedicalCount(data.data.aprmedicalCount);
                    setMaymedicalCount(data.data.maymedicalCount);
                    setJunmedicalCount(data.data.junmedicalCount);
                    setJulmedicalCount(data.data.julmedicalCount);
                    setAugmedicalCount(data.data.augmedicalCount);
                    setSepmedicalCount(data.data.sepmedicalCount);
                    setOctmedicalCount(data.data.octmedicalCount);
                    setNovmedicalCount(data.data.novmedicalCount);
                    setDecmedicalCount(data.data.decmedicalCount);

                    setJanyachtCount(data.data.janyachtCount);
                    setFebyachtCount(data.data.febyachtCount);
                    setMaryachtCount(data.data.maryachtCount);
                    setApryachtCount(data.data.apryachtCount);
                    setMayyachtCount(data.data.mayyachtCount);
                    setJunyachtCount(data.data.junyachtCount);
                    setJulyachtCount(data.data.julyachtCount);
                    setAugyachtCount(data.data.augyachtCount);
                    setSepyachtCount(data.data.sepyachtCount);
                    setOctyachtCount(data.data.octyachtCount);
                    setNovyachtCount(data.data.novyachtCount);
                    setDecyachtCount(data.data.decyachtCount);

                    setJanotherCount(data.data.janotherCount);
                    setFebotherCount(data.data.febotherCount);
                    setMarotherCount(data.data.marotherCount);
                    setAprotherCount(data.data.aprotherCount);
                    setMayotherCount(data.data.mayotherCount);
                    setJunotherCount(data.data.junotherCount);
                    setJulotherCount(data.data.julotherCount);
                    setAugotherCount(data.data.augotherCount);
                    setSepotherCount(data.data.sepotherCount);
                    setOctotherCount(data.data.octotherCount);
                    setNovotherCount(data.data.novotherCount);
                    setDecotherCount(data.data.decotherCount);

                }
                )
                .catch((error) => {
                    console.log(error)
                }
                )

        }
    }

    const data = [
        {
            line_of_business_name: "Motor",
            monthlydata: [
                {
                    "month": "January",
                    "count": janmotorCount
                },
                {
                    "month": "February",
                    "count": febmotorCount
                },
                {
                    "month": "March",
                    "count": marmotorCount
                },
                {
                    "month": "April",
                    "count": aprmotorCount
                },
                {
                    "month": "May",
                    "count": maymotorCount
                },
                {
                    "month": "June",
                    "count": junmotorCount
                },
                {
                    "month": "July",
                    "count": julmotorCount
                },
                {
                    "month": "August",
                    "count": augmotorCount
                },
                {
                    "month": "September",
                    "count": sepmotorCount
                },
                {
                    "month": "October",
                    "count": octmotorCount
                },
                {
                    "month": "November",
                    "count": novmotorCount
                },
                {
                    "month": "December",
                    "count": decmotorCount
                }
            ],
        },
        {
            line_of_business_name: "Travel",
            "monthlydata": [
                {
                    "month": "January",
                    "count": jantravelCount
                },
                {
                    "month": "February",
                    "count": febtravelCount
                },
                {
                    "month": "March",
                    "count": martravelCount
                },
                {
                    "month": "April",
                    "count": aprtravelCount
                },
                {
                    "month": "May",
                    "count": maytravelCount
                },
                {
                    "month": "June",
                    "count": juntravelCount
                },
                {
                    "month": "July",
                    "count": jultravelCount
                },
                {
                    "month": "August",
                    "count": augtravelCount
                },
                {
                    "month": "September",
                    "count": septravelCount
                },
                {
                    "month": "October",
                    "count": octtravelCount
                },
                {
                    "month": "November",
                    "count": novtravelCount
                },
                {
                    "month": "December",
                    "count": dectravelCount
                }
            ],
        },
        {
            line_of_business_name: "Home",
            "monthlydata": [
                {
                    "month": "January",
                    "count": janhomeCount
                },
                {
                    "month": "February",
                    "count": febhomeCount
                },
                {
                    "month": "March",
                    "count": marhomeCount
                },
                {
                    "month": "April",
                    "count": aprhomeCount
                },
                {
                    "month": "May",
                    "count": mayhomeCount
                },
                {
                    "month": "June",
                    "count": junhomeCount
                },
                {
                    "month": "July",
                    "count": julhomeCount
                },
                {
                    "month": "August",
                    "count": aughomeCount
                },
                {
                    "month": "September",
                    "count": sephomeCount
                },
                {
                    "month": "October",
                    "count": octhomeCount
                },
                {
                    "month": "November",
                    "count": novhomeCount
                },
                {
                    "month": "December",
                    "count": dechomeCount
                }
            ],
        },
        {
            line_of_business_name: "Medical",
            "monthlydata": [
                {
                    "month": "January",
                    "count": janmedicalCount
                },
                {
                    "month": "February",
                    "count": febmedicalCount
                },
                {
                    "month": "March",
                    "count": marmedicalCount
                },
                {
                    "month": "April",
                    "count": aprmedicalCount
                },
                {
                    "month": "May",
                    "count": maymedicalCount
                },
                {
                    "month": "June",
                    "count": junmedicalCount
                },
                {
                    "month": "July",
                    "count": julmedicalCount
                },
                {
                    "month": "August",
                    "count": augmedicalCount
                },
                {
                    "month": "September",
                    "count": sepmedicalCount
                },
                {
                    "month": "October",
                    "count": octmedicalCount
                },
                {
                    "month": "November",
                    "count": novmedicalCount
                },
                {
                    "month": "December",
                    "count": decmedicalCount
                }
            ],
        },
        {
            line_of_business_name: "Yacht",
            "monthlydata": [
                {
                    "month": "January",
                    "count": janyachtCount
                },
                {
                    "month": "February",
                    "count": febyachtCount
                },
                {
                    "month": "March",
                    "count": maryachtCount
                },
                {
                    "month": "April",
                    "count": apryachtCount
                },
                {
                    "month": "May",
                    "count": mayyachtCount
                },
                {
                    "month": "June",
                    "count": junyachtCount
                },
                {
                    "month": "July",
                    "count": julyachtCount
                },
                {
                    "month": "August",
                    "count": augyachtCount
                },
                {
                    "month": "September",
                    "count": sepyachtCount
                },
                {
                    "month": "October",
                    "count": octyachtCount
                },
                {
                    "month": "November",
                    "count": novyachtCount
                },
                {
                    "month": "December",
                    "count": decyachtCount
                }
            ],

        },
        {
            line_of_business_name: "Other Insurance",
            "monthlydata": [
                {
                    "month": "January",
                    "count": janotherCount
                },
                {
                    "month": "February",
                    "count": febotherCount
                },
                {
                    "month": "March",
                    "count": marotherCount
                },
                {
                    "month": "April",
                    "count": aprotherCount
                },
                {
                    "month": "May",
                    "count": mayotherCount
                },
                {
                    "month": "June",
                    "count": junotherCount
                },
                {
                    "month": "July",
                    "count": julotherCount
                },
                {
                    "month": "August",
                    "count": augotherCount
                },
                {
                    "month": "September",
                    "count": sepotherCount
                },
                {
                    "month": "October",
                    "count": octotherCount
                },
                {
                    "month": "November",
                    "count": novotherCount
                },
                {
                    "month": "December",
                    "count": decotherCount
                }
            ],
        }
    ]

    console.log("data", data);

    let chartData = {
        labels: [],
        datasets: [],
    };

    chartData = {
        labels: Array.from(new Set(data.flatMap(item => item.monthlydata.map(data => data.month)))),
        datasets: data.map(item => ({
            label: item.line_of_business_name,
            backgroundColor: item.line_of_business_name === 'Motor' ? '#FF6384' :
                item.line_of_business_name === 'Travel' ? '#007500' :
                    item.line_of_business_name === 'Home' ? '#FFCE56' :
                        item.line_of_business_name === 'Medical' ? '#36A2EB' :
                            item.line_of_business_name === 'Yacht' ? '#5742f5' :
                                '#da42f5',
            data: item.monthlydata.map(data => data.count),
        })),
    };






    return (
        <>
            <Accordion >
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        <div className="card-header new_leads">
                            <strong>Graphical View </strong>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body style={{ padding: '2px' }}>
                        <CCard className="mb-4">
                            <CRow>
                                <CCol lg={8}>
                                    <CCard className="mb-4">
                                        <CCardHeader>Bar Chart</CCardHeader>
                                        <CCardBody>
                                            <CChartBar data={chartData} />
                                        </CCardBody>
                                    </CCard>
                                </CCol>

                                {/* <CCol lg={4} >
        <CCard className="mb-4 ">
          <CCardHeader>Pie Chart</CCardHeader>
          <CCardBody>
            <CChartPie
              data={{
                labels: piechartData.labels,
                datasets: [
                  {
                    data: piechartData.datasets.map(item => item.data[0]),
                    backgroundColor: ['#0D2F92', '#f87979', '#FFCE56'],
                    hoverBackgroundColor: ['#0D2F92', '#f87979', '#FFCE56'],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol> */}
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


                            </CRow>
                        </CCard>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    )
}

export default ManagerSalesGraph;
