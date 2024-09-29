import { CCard, CRow, CCol, CCardBody, CCardHeader } from '@coreui/react';
import { CChartBar, CChartLine, CChartPie } from '@coreui/react-chartjs';
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'
import { Container, Col, Row, Modal, Button, Accordion } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';


ProducerGraph.propTypes =
{
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes
    })
};

ProducerGraph.propTypes = {
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

ProducerGraph.propTypes =
{
    lobdata: PropTypes.array,

};

function ProducerGraph({ filterOptions, defaultOptions, lobdata }) {
    const navigate = useNavigate();

    let [selectedValue, setSelectedValue] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            getdata()
        }
    }, [lobdata]);





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
    //   chartData = {
    //     labels: Array.from(new Set(graphvalues.data.flatMap(item => item.monthlydata.map(data => data.month)))),
    //     datasets: graphvalues.data.map(item => ({
    //       label: item.line_of_business_name,
    //       backgroundColor: item.line_of_business_name=='Motor'? '#0D2F92' : '#f87979',
    //       data: item.monthlydata.map(data => data.count),
    //     })),
    //   };
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
                backgroundColor: item.line_of_business_name === 'Motor' ? '#0D2F92' : '#f87979',
                hoverBackgroundColor: item.line_of_business_name === 'Motor' ? '#0D2F92' : '#f87979',
            })),
        };
    }


    /**********/

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
            // getTotalCount();
            getTotaldata();
        }
    }, [filterOptions, selectedValue]);


    const selectedoptions = (selectedValue) => {
        setSelectedValue(selectedValue.map(item => item.id))
    }

    console.log('i m down', selectedValue)

    const [range, setRange] = useState("daily")

    // const getTotalCount = async () => {

    //     const userdata = JSON.parse(localStorage.getItem('user'));
    //     let newlocation = filterOptions.location;
    //     let newlob = filterOptions.lob;
    //     let newbusinessType = filterOptions.businessType;
    //     let newagent = filterOptions.agent;
    //     let dateRange = filterOptions.dateRange;
    //     let startdate = defaultOptions.startdate;
    //     let enddate = defaultOptions.enddate;
    //     let assign_staff = userdata.assign_staff;
    //     let usertype = defaultOptions.userType


    //     if (newlocation == null || newlocation == undefined || !Array.isArray(newlocation) || newlocation.length === 0) {
    //         newlocation = defaultOptions.defaultlocation.map((item) => item.value);
    //         // newlocation = [];
    //     }
    //     else {
    //         newlocation = newlocation.map((item) => item.value);
    //     }

    //     if (newlob == null || newlob == undefined || !Array.isArray(newlob) || newlob.length === 0) {
    //         newlob = defaultOptions.defaultlob.map((item) => item.value);
    //         // newlob = [];
    //     }
    //     else {
    //         newlob = newlob.map((item) => item.value);
    //     }

    //     if (newbusinessType == null || newbusinessType == undefined || !Array.isArray(newbusinessType) || newbusinessType.length === 0) {
    //         newbusinessType = defaultOptions.defaultbusinessType.map((item) => item.value);
    //         // newbusinessType = [];

    //     }
    //     else {
    //         newbusinessType = newbusinessType.map((item) => item.value);
    //     }
    //     if (newagent == null || newagent == undefined || !Array.isArray(newagent) || newagent.length === 0) {
    //         newagent = defaultOptions.defaultagent.map((item) => item.value);
    //     }
    //     else {
    //         newagent = newagent.map((item) => item.value);
    //     }

    //     if (selectedValue == null || selectedValue == undefined || !Array.isArray(selectedValue) || selectedValue.length === 0) {
    //         selectedValue = leadStatus.map((item) => item.lead_status);
    //     }
    //     else {
    //         selectedValue = selectedValue;
    //     }

    //     console.log('i m up', selectedValue)

    //     // console.log(newlocation)
    //     // console.log(newlob)
    //     // console.log(newbusinessType)
    //     // console.log(newagent)
    //     // console.log(dateRange)
    //     // console.log(startdate)
    //     // console.log(enddate)

    //     // return false 




    //     const token = localStorage.getItem('token');
    //     const loginuser = JSON.parse(localStorage.getItem('user'));
    //     const loginusertype = loginuser.usertype;

    //     const requestOptions = {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             location: newlocation,
    //             lob: newlob,
    //             business_type: newbusinessType,
    //             newagent: newagent,
    //             dateRange: dateRange,
    //             startdate: startdate,
    //             enddate: enddate,
    //             assign_staff: assign_staff,
    //             userType: usertype,
    //             selectedValue: selectedValue
    //         }),
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + token
    //         },
    //     };


    //     if (loginusertype == "646224eab201a6f07b2dff36") {
    //         await fetch(`https://insuranceapi-3o5t.onrender.com/api/topLeagentCount`, requestOptions)
    //             .then(response => response.json())
    //             .then(data => {
    //                 console.log("data", data.data);
    //                 setMotorTotalCount(data.data.motorCount)
    //                 setTravelTotalCount(data.data.travelCount)
    //                 setHometotalCount(data.data.homeCount)
    //                 setMedicalTotalCount(data.data.medicalCount)
    //                 setYachtTotalCount(data.data.yatchCount)
    //                 setOtherTotalCount(data.data.ortherInsuranceCount)

    //             })
    //             .catch((error) => {
    //                 console.log(error)
    //             })


    //     }
    //     if (loginusertype == "64622470b201a6f07b2dff22") {
    //         await fetch(`https://insuranceapi-3o5t.onrender.com/api/topLeagentCount?dashboardType=salesAdvisorDashboard`, requestOptions)
    //             .then(response => response.json())
    //             .then(data => {
    //                 console.log("data", data.data);
    //                 setMotorTotalCount(data.data.motorCount)
    //                 setTravelTotalCount(data.data.travelCount)
    //                 setHometotalCount(data.data.homeCount)
    //                 setMedicalTotalCount(data.data.medicalCount)
    //                 setYachtTotalCount(data.data.yatchCount)
    //                 setOtherTotalCount(data.data.ortherInsuranceCount)

    //             }
    //             )
    //             .catch((error) => {
    //                 console.log(error)
    //             }
    //             )

    //     }
    // }

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

    const [janmotorclosedCount, setJanmotorclosedCount] = useState(0);
    const [febmotorclosedCount, setFebmotorclosedCount] = useState(0);
    const [marmotorclosedCount, setMarmotorclosedCount] = useState(0);
    const [aprmotorclosedCount, setAprmotorclosedCount] = useState(0);
    const [maymotorclosedCount, setMaymotorclosedCount] = useState(0);
    const [junmotorclosedCount, setJunmotorclosedCount] = useState(0);
    const [julmotorclosedCount, setJulmotorclosedCount] = useState(0);
    const [augmotorclosedCount, setAugmotorclosedCount] = useState(0);
    const [sepmotorclosedCount, setSepmotorclosedCount] = useState(0);
    const [octmotorclosedCount, setOctmotorclosedCount] = useState(0);
    const [novmotorclosedCount, setNovmotorclosedCount] = useState(0);
    const [decmotorclosedCount, setDecmotorclosedCount] = useState(0);

    const [jantravelclosedcount, setJantravelClosedCount] = useState(0);
    const [febtravelclosedcount, setFebtravelclosedCount] = useState(0);
    const [martravelclosedcount, setMartravelclosedCount] = useState(0);
    const [aprtravelclosedcount, setAprtravelclosedCount] = useState(0);
    const [maytravelclosedcount, setMaytravelclosedCount] = useState(0);
    const [juntravelclosedcount, setJuntravelclosedCount] = useState(0);
    const [jultravelclosedcount, setJultravelclosedCount] = useState(0);
    const [augtravelclosedcount, setAugtravelclosedCount] = useState(0);
    const [septravelclosedcount, setSeptravelclosedCount] = useState(0);
    const [octtravelclosedcount, setOcttravelclosedCount] = useState(0);
    const [novtravelclosedcount, setNovtravelclosedCount] = useState(0);
    const [dectravelclosedcount, setDectravelclosedCount] = useState(0);

    const [janhomeclosedcount, setJanhomeclosedCount] = useState(0);
    const [febhomeclosedcount, setFebhomeclosedCount] = useState(0);
    const [marhomeclosedcount, setMarhomeclosedCount] = useState(0);
    const [aprhomeclosedcount, setAprhomeclosedCount] = useState(0);
    const [mayhomeclosedcount, setMayhomeclosedCount] = useState(0);
    const [junhomeclosedcount, setJunhomeclosedCount] = useState(0);
    const [julhomeclosedcount, setJulhomeclosedCount] = useState(0);
    const [aughomeclosedcount, setAughomeclosedCount] = useState(0);
    const [sephomeclosedcount, setSehomeclosedCount] = useState(0);
    const [octhomeclosedcount, setOcthomeclosedCount] = useState(0);
    const [novhomeclosedcount, setNovhomeclosedCount] = useState(0);
    const [dechomeclosedcount, setDechomeclosedCount] = useState(0);

    const [janmedicalclosedcount, setJanmedicalclosedCount] = useState(0);
    const [febmedicalclosedcount, setFebmedicalclosedCount] = useState(0);
    const [marmedicalclosedcount, setMarmedicalclosedCount] = useState(0);
    const [aprmedicalclosedcount, setAprmedicalclosedCount] = useState(0);
    const [maymedicalclosedcount, setMaymedicalclosedCount] = useState(0);
    const [junmedicalclosedcount, setJunmedicalclosedCount] = useState(0);
    const [julmedicalclosedcount, setJulmedicalclosedCount] = useState(0);
    const [augmedicalclosedcount, setAugmedicalclosedCount] = useState(0);
    const [sepmedicalclosedcount, setSepmedicalclosedCount] = useState(0);
    const [octmedicalclosedcount, setOctmedicalclosedCount] = useState(0);
    const [novmedicalclosedcount, setNovmedicalclosedCount] = useState(0);
    const [decmedicalclosedcount, setDecmedicalclosedCount] = useState(0);

    const [janyachtclosedcount, setJanyachtclosedCount] = useState(0);
    const [febyachtclosedcount, setFebyachtclosedCount] = useState(0);
    const [maryachtclosedcount, setMaryachtclosedCount] = useState(0);
    const [apryachtclosedcount, setApryachtclosedCount] = useState(0);
    const [mayyachtclosedcount, setMayyachtclosedCount] = useState(0);
    const [junyachtclosedcount, setJunyachtclosedCount] = useState(0);
    const [julyachtclosedcount, setJulyachtclosedCount] = useState(0);
    const [augyachtclosedcount, setAugyachtclosedCount] = useState(0);
    const [sepyachtclosedcount, setSepyachtclosedCount] = useState(0);
    const [octyachtclosedcount, setOctyachtclosedCount] = useState(0);
    const [novyachtclosedcount, setNovyachtclosedCount] = useState(0);
    const [decyachtclosedcount, setDecyachtclosedCount] = useState(0);

    const [janotherclosedcount, setJanotherclosedCount] = useState(0);
    const [febotherclosedcount, setFebotherclosedCount] = useState(0);
    const [marotherclosedcount, setMarotherclosedCount] = useState(0);
    const [aprotherclosedcount, setAprotherclosedCount] = useState(0);
    const [mayotherclosedcount, setMayotherclosedCount] = useState(0);
    const [junotherclosedcount, setJunotherclosedCount] = useState(0);
    const [julotherclosedcount, setJulotherclosedCount] = useState(0);
    const [augotherclosedcount, setAugotherclosedCount] = useState(0);
    const [sepotherclosedcount, setSepotherclosedCount] = useState(0);
    const [octotherclosedcount, setOctotherclosedCount] = useState(0);
    const [novotherclosedcount, setNovotherclosedCount] = useState(0);
    const [decotherclosedcount, setDecotherclosedCount] = useState(0);








    const getTotaldata = async () => {

        // console.log("inside filterOptions", filterOptions);
        // console.log("inside defaultOptions", defaultOptions);



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
        setRange(dateRange)

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


        if (loginusertype == "66068569e8f96a29286c956e") {
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/getAllGraphCount`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("data", data.data.sepmotorCount);
                    setJanmotorCount(data.data.janmotorCount);
                    setFebmotorCount(data.data.febmotorCount);
                    setMarmotorCount(data.data.marmotorCount);
                    setAprmotorCount(data.data.aprimotorCount);
                    setMaymotorCount(data.data.maymotorCount);
                    setJunmotorCount(data.data.junmotorCount);
                    setJulmotorCount(data.data.julmotorCount);
                    setAugmotorCount(data.data.agumotorCount);
                    setSepmotorCount(data.data.sepmotorCount);
                    setOctmotorCount(data.data.octmotorCount);
                    setNovmotorCount(data.data.novmotorCount);
                    setDecmotorCount(data.data.despmotorCount);

                    setJantravelCount(data.data.jantravelCount);
                    setFebtravelCount(data.data.beftravelCount);
                    setMartravelCount(data.data.martravelCount);
                    setAprtravelCount(data.data.apritravelCount);
                    setMaytravelCount(data.data.maytravelCount);
                    setJuntravelCount(data.data.juntravelCount);
                    setJultravelCount(data.data.jultravelCount);
                    setAugtravelCount(data.data.agutravelCount);
                    setSeptravelCount(data.data.septravelCount);
                    setOcttravelCount(data.data.octtravelCount);
                    setNovtravelCount(data.data.novtravelCount);
                    setDectravelCount(data.data.desptravelCount);

                    setJanhomeCount(data.data.janhomeCount);
                    setFebhomeCount(data.data.febhomeCount);
                    setMarhomeCount(data.data.marhomeCount);
                    setAprhomeCount(data.data.aprihomeCount);
                    setMayhomeCount(data.data.mayhomeCount);
                    setJunhomeCount(data.data.junhomeCount);
                    setJulhomeCount(data.data.julhomeCount);
                    setAughomeCount(data.data.aguhomeCount);
                    setSehomeCount(data.data.sephomeCount);
                    setOcthomeCount(data.data.octhomeCount);
                    setNovhomeCount(data.data.novhomeCount);
                    setDechomeCount(data.data.desphomeCount);

                    setJanmedicalCount(data.data.janmedicalCount);
                    setFebmedicalCount(data.data.febmedicalCount);
                    setMarmedicalCount(data.data.marmedicalCount);
                    setAprmedicalCount(data.data.aprimedicalCount);
                    setMaymedicalCount(data.data.maymedicalCount);
                    setJunmedicalCount(data.data.junmedicalCount);
                    setJulmedicalCount(data.data.julmedicalCount);
                    setAugmedicalCount(data.data.agumedicalCount);
                    setSepmedicalCount(data.data.sepmedicalCount);
                    setOctmedicalCount(data.data.octmedicalCount);
                    setNovmedicalCount(data.data.novmedicalCount);
                    setDecmedicalCount(data.data.despmedicalCount);

                    setJanyachtCount(data.data.janyatchCount);
                    setFebyachtCount(data.data.febyatchCount);
                    setMaryachtCount(data.data.maryatchCount);
                    setApryachtCount(data.data.apriyatchCount);
                    setMayyachtCount(data.data.mayyatchCount);
                    setJunyachtCount(data.data.junyatchCount);
                    setJulyachtCount(data.data.julyatchCount);
                    setAugyachtCount(data.data.aguyatchCount);
                    setSepyachtCount(data.data.sepyatchCount);
                    setOctyachtCount(data.data.octyatchCount);
                    setNovyachtCount(data.data.novyatchCount);
                    setDecyachtCount(data.data.despyatchCount);

                    setJanotherCount(data.data.janortherInsuranceCount);
                    setFebotherCount(data.data.febortherInsuranceCount);
                    setMarotherCount(data.data.marortherInsuranceCount);
                    setAprotherCount(data.data.apriortherInsuranceCount);
                    setMayotherCount(data.data.mayortherInsuranceCount);
                    setJunotherCount(data.data.junortherInsuranceCount);
                    setJulotherCount(data.data.julortherInsuranceCount);
                    setAugotherCount(data.data.aguortherInsuranceCount);
                    setSepotherCount(data.data.seportherInsuranceCount);
                    setOctotherCount(data.data.octortherInsuranceCount);
                    setNovotherCount(data.data.novortherInsuranceCount);
                    setDecotherCount(data.data.desportherInsuranceCount);

                    setJanmotorclosedCount(data.data.janmotorclosedCount);
                    setFebmotorclosedCount(data.data.febmotorclosedCount);
                    setMarmotorclosedCount(data.data.marmotorclosedCount);
                    setAprmotorclosedCount(data.data.aprimotorclosedCount);
                    setMaymotorclosedCount(data.data.maymotorclosedCount);
                    setJunmotorclosedCount(data.data.junmotorclosedCount);
                    setJulmotorclosedCount(data.data.julmotorclosedCount);
                    setAugmotorclosedCount(data.data.agumotorclosedCount);
                    setSepmotorclosedCount(data.data.sepmotorclosedCount);
                    setOctmotorclosedCount(data.data.octmotorclosedCount);
                    setNovmotorclosedCount(data.data.novmotorclosedCount);
                    setDecmotorclosedCount(data.data.despmotorclosedCount);

                    setJantravelClosedCount(data.data.jantravelclosedCount);
                    setFebtravelclosedCount(data.data.beftravelclosedCount);
                    setMartravelclosedCount(data.data.martravelclosedCount);
                    setAprtravelclosedCount(data.data.apritravelclosedCount);
                    setMaytravelclosedCount(data.data.maytravelclosedCount);
                    setJuntravelclosedCount(data.data.juntravelclosedCount);
                    setJultravelclosedCount(data.data.jultravelclosedCount);
                    setAugtravelclosedCount(data.data.agutravelclosedCount);
                    setSeptravelclosedCount(data.data.septravelclosedCount);
                    setOcttravelclosedCount(data.data.octtravelclosedCount);
                    setNovtravelclosedCount(data.data.novtravelclosedCount);
                    setDectravelclosedCount(data.data.desptravelclosedCount);

                    setJanhomeclosedCount(data.data.janhomeclosedCount);
                    setFebhomeclosedCount(data.data.febhomeclosedCount);
                    setMarhomeclosedCount(data.data.marhomeclosedCount);
                    setAprhomeclosedCount(data.data.aprihomeclosedCount);
                    setMayhomeclosedCount(data.data.mayhomeclosedCount);
                    setJunhomeclosedCount(data.data.junhomeclosedCount);
                    setJulhomeclosedCount(data.data.julhomeclosedCount);
                    setAughomeclosedCount(data.data.aguhomeclosedCount);
                    setSehomeclosedCount(data.data.sephomeclosedCount);
                    setOcthomeclosedCount(data.data.octhomeclosedCount);
                    setNovhomeclosedCount(data.data.novhomeclosedCount);
                    setDechomeclosedCount(data.data.desphomeclosedCount);

                    setJanmedicalclosedCount(data.data.janmedicalclosedCount);
                    setFebmedicalclosedCount(data.data.febmedicalclosedCount);
                    setMarmedicalclosedCount(data.data.marmedicalclosedCount);
                    setAprmedicalclosedCount(data.data.aprimedicalclosedCount);
                    setMaymedicalclosedCount(data.data.maymedicalclosedCount);
                    setJunmedicalclosedCount(data.data.junmedicalclosedCount);
                    setJulmedicalclosedCount(data.data.julmedicalclosedCount);
                    setAugmedicalclosedCount(data.data.agumedicalclosedCount);
                    setSepmedicalclosedCount(data.data.sepmedicalclosedCount);
                    setOctmedicalclosedCount(data.data.octmedicalclosedCount);
                    setNovmedicalclosedCount(data.data.novmedicalclosedCount);
                    setDecmedicalclosedCount(data.data.despmedicalclosedCount);

                    setJanyachtclosedCount(data.data.janyatchclosedCount);
                    setFebyachtclosedCount(data.data.febyatchclosedCount);
                    setMaryachtclosedCount(data.data.maryatchclosedCount);
                    setApryachtclosedCount(data.data.apriyatchclosedCount);
                    setMayyachtclosedCount(data.data.mayyatchclosedCount);
                    setJunyachtclosedCount(data.data.junyatchclosedCount);
                    setJulyachtclosedCount(data.data.julyatchclosedCount);
                    setAugyachtclosedCount(data.data.aguyatchclosedCount);
                    setSepyachtclosedCount(data.data.sepyatchclosedCount);
                    setOctyachtclosedCount(data.data.octyatchclosedCount);
                    setNovyachtclosedCount(data.data.novyatchclosedCount);
                    setDecyachtclosedCount(data.data.despyatchclosedCount);

                    setJanotherclosedCount(data.data.janortherInsuranceclosedCount);
                    setFebotherclosedCount(data.data.febortherInsuranceclosedCount);
                    setMarotherclosedCount(data.data.marortherInsuranceclosedCount);
                    setAprotherclosedCount(data.data.apriortherInsuranceclosedCount);
                    setMayotherclosedCount(data.data.mayortherInsuranceclosedCount);
                    setJunotherclosedCount(data.data.junortherInsuranceclosedCount);
                    setJulotherclosedCount(data.data.julortherInsuranceclosedCount);
                    setAugotherclosedCount(data.data.aguortherInsuranceclosedCount);
                    setSepotherclosedCount(data.data.seportherInsuranceclosedCount);
                    setOctotherclosedCount(data.data.octortherInsuranceclosedCount);
                    setNovotherclosedCount(data.data.novortherInsuranceclosedCount);
                    setDecotherclosedCount(data.data.desportherInsuranceclosedCount);

                }
                )
                .catch((error) => {
                    console.log(error)
                })


        }
        if (loginusertype == "64622470b201a6f07b2dff22") {
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/getAllGraphCount?dashboardType=producerDashboard`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("data", data.data);
                    setJanmotorCount(data.data.janmotorCount);
                    setFebmotorCount(data.data.febmotorCount);
                    setMarmotorCount(data.data.marmotorCount);
                    setAprmotorCount(data.data.aprimotorCount);
                    setMaymotorCount(data.data.maymotorCount);
                    setJunmotorCount(data.data.junmotorCount);
                    setJulmotorCount(data.data.julmotorCount);
                    setAugmotorCount(data.data.agumotorCount);
                    setSepmotorCount(data.data.sepmotorCount);
                    setOctmotorCount(data.data.octmotorCount);
                    setNovmotorCount(data.data.novmotorCount);
                    setDecmotorCount(data.data.despmotorCount);

                    setJantravelCount(data.data.jantravelCount);
                    setFebtravelCount(data.data.beftravelCount);
                    setMartravelCount(data.data.martravelCount);
                    setAprtravelCount(data.data.apritravelCount);
                    setMaytravelCount(data.data.maytravelCount);
                    setJuntravelCount(data.data.juntravelCount);
                    setJultravelCount(data.data.jultravelCount);
                    setAugtravelCount(data.data.agutravelCount);
                    setSeptravelCount(data.data.septravelCount);
                    setOcttravelCount(data.data.octtravelCount);
                    setNovtravelCount(data.data.novtravelCount);
                    setDectravelCount(data.data.desptravelCount);

                    setJanhomeCount(data.data.janhomeCount);
                    setFebhomeCount(data.data.febhomeCount);
                    setMarhomeCount(data.data.marhomeCount);
                    setAprhomeCount(data.data.aprihomeCount);
                    setMayhomeCount(data.data.mayhomeCount);
                    setJunhomeCount(data.data.junhomeCount);
                    setJulhomeCount(data.data.julhomeCount);
                    setAughomeCount(data.data.aguhomeCount);
                    setSehomeCount(data.data.sephomeCount);
                    setOcthomeCount(data.data.octhomeCount);
                    setNovhomeCount(data.data.novhomeCount);
                    setDechomeCount(data.data.desphomeCount);

                    setJanmedicalCount(data.data.janmedicalCount);
                    setFebmedicalCount(data.data.febmedicalCount);
                    setMarmedicalCount(data.data.marmedicalCount);
                    setAprmedicalCount(data.data.aprimedicalCount);
                    setMaymedicalCount(data.data.maymedicalCount);
                    setJunmedicalCount(data.data.junmedicalCount);
                    setJulmedicalCount(data.data.julmedicalCount);
                    setAugmedicalCount(data.data.agumedicalCount);
                    setSepmedicalCount(data.data.sepmedicalCount);
                    setOctmedicalCount(data.data.octmedicalCount);
                    setNovmedicalCount(data.data.novmedicalCount);
                    setDecmedicalCount(data.data.despmedicalCount);

                    setJanyachtCount(data.data.janyatchCount);
                    setFebyachtCount(data.data.febyatchCount);
                    setMaryachtCount(data.data.maryatchCount);
                    setApryachtCount(data.data.apriyatchCount);
                    setMayyachtCount(data.data.mayyatchCount);
                    setJunyachtCount(data.data.junyatchCount);
                    setJulyachtCount(data.data.julyatchCount);
                    setAugyachtCount(data.data.aguyatchCount);
                    setSepyachtCount(data.data.sepyatchCount);
                    setOctyachtCount(data.data.octyatchCount);
                    setNovyachtCount(data.data.novyatchCount);
                    setDecyachtCount(data.data.despyatchCount);

                    setJanotherCount(data.data.janortherInsuranceCount);
                    setFebotherCount(data.data.febortherInsuranceCount);
                    setMarotherCount(data.data.marortherInsuranceCount);
                    setAprotherCount(data.data.apriortherInsuranceCount);
                    setMayotherCount(data.data.mayortherInsuranceCount);
                    setJunotherCount(data.data.junortherInsuranceCount);
                    setJulotherCount(data.data.julortherInsuranceCount);
                    setAugotherCount(data.data.aguortherInsuranceCount);
                    setSepotherCount(data.data.seportherInsuranceCount);
                    setOctotherCount(data.data.octortherInsuranceCount);
                    setNovotherCount(data.data.novortherInsuranceCount);
                    setDecotherCount(data.data.desportherInsuranceCount);

                    setJanmotorclosedCount(data.data.janmotorclosedCount);
                    setFebmotorclosedCount(data.data.febmotorclosedCount);
                    setMarmotorclosedCount(data.data.marmotorclosedCount);
                    setAprmotorclosedCount(data.data.aprimotorclosedCount);
                    setMaymotorclosedCount(data.data.maymotorclosedCount);
                    setJunmotorclosedCount(data.data.junmotorclosedCount);
                    setJulmotorclosedCount(data.data.julmotorclosedCount);
                    setAugmotorclosedCount(data.data.agumotorclosedCount);
                    setSepmotorclosedCount(data.data.sepmotorclosedCount);
                    setOctmotorclosedCount(data.data.octmotorclosedCount);
                    setNovmotorclosedCount(data.data.novmotorclosedCount);
                    setDecmotorclosedCount(data.data.despmotorclosedCount);

                    setJantravelClosedCount(data.data.jantravelclosedCount);
                    setFebtravelclosedCount(data.data.beftravelclosedCount);
                    setMartravelclosedCount(data.data.martravelclosedCount);
                    setAprtravelclosedCount(data.data.apritravelclosedCount);
                    setMaytravelclosedCount(data.data.maytravelclosedCount);
                    setJuntravelclosedCount(data.data.juntravelclosedCount);
                    setJultravelclosedCount(data.data.jultravelclosedCount);
                    setAugtravelclosedCount(data.data.agutravelclosedCount);
                    setSeptravelclosedCount(data.data.septravelclosedCount);
                    setOcttravelclosedCount(data.data.octtravelclosedCount);
                    setNovtravelclosedCount(data.data.novtravelclosedCount);
                    setDectravelclosedCount(data.data.desptravelclosedCount);

                    setJanhomeclosedCount(data.data.janhomeclosedCount);
                    setFebhomeclosedCount(data.data.febhomeclosedCount);
                    setMarhomeclosedCount(data.data.marhomeclosedCount);
                    setAprhomeclosedCount(data.data.aprihomeclosedCount);
                    setMayhomeclosedCount(data.data.mayhomeclosedCount);
                    setJunhomeclosedCount(data.data.junhomeclosedCount);
                    setJulhomeclosedCount(data.data.julhomeclosedCount);
                    setAughomeclosedCount(data.data.aguhomeclosedCount);
                    setSehomeclosedCount(data.data.sephomeclosedCount);
                    setOcthomeclosedCount(data.data.octhomeclosedCount);
                    setNovhomeclosedCount(data.data.novhomeclosedCount);
                    setDechomeclosedCount(data.data.desphomeclosedCount);

                    setJanmedicalclosedCount(data.data.janmedicalclosedCount);
                    setFebmedicalclosedCount(data.data.febmedicalclosedCount);
                    setMarmedicalclosedCount(data.data.marmedicalclosedCount);
                    setAprmedicalclosedCount(data.data.aprimedicalclosedCount);
                    setMaymedicalclosedCount(data.data.maymedicalclosedCount);
                    setJunmedicalclosedCount(data.data.junmedicalclosedCount);
                    setJulmedicalclosedCount(data.data.julmedicalclosedCount);
                    setAugmedicalclosedCount(data.data.agumedicalclosedCount);
                    setSepmedicalclosedCount(data.data.sepmedicalclosedCount);
                    setOctmedicalclosedCount(data.data.octmedicalclosedCount);
                    setNovmedicalclosedCount(data.data.novmedicalclosedCount);
                    setDecmedicalclosedCount(data.data.despmedicalclosedCount);

                    setJanyachtclosedCount(data.data.janyatchclosedCount);
                    setFebyachtclosedCount(data.data.febyatchclosedCount);
                    setMaryachtclosedCount(data.data.maryatchclosedCount);
                    setApryachtclosedCount(data.data.apriyatchclosedCount);
                    setMayyachtclosedCount(data.data.mayyatchclosedCount);
                    setJunyachtclosedCount(data.data.junyatchclosedCount);
                    setJulyachtclosedCount(data.data.julyatchclosedCount);
                    setAugyachtclosedCount(data.data.aguyatchclosedCount);
                    setSepyachtclosedCount(data.data.sepyatchclosedCount);
                    setOctyachtclosedCount(data.data.octyatchclosedCount);
                    setNovyachtclosedCount(data.data.novyatchclosedCount);
                    setDecyachtclosedCount(data.data.despyatchclosedCount);

                    setJanotherclosedCount(data.data.janortherInsuranceclosedCount);
                    setFebotherclosedCount(data.data.febortherInsuranceclosedCount);
                    setMarotherclosedCount(data.data.marortherInsuranceclosedCount);
                    setAprotherclosedCount(data.data.apriortherInsuranceclosedCount);
                    setMayotherclosedCount(data.data.mayortherInsuranceclosedCount);
                    setJunotherclosedCount(data.data.junortherInsuranceclosedCount);
                    setJulotherclosedCount(data.data.julortherInsuranceclosedCount);
                    setAugotherclosedCount(data.data.aguortherInsuranceclosedCount);
                    setSepotherclosedCount(data.data.seportherInsuranceclosedCount);
                    setOctotherclosedCount(data.data.octortherInsuranceclosedCount);
                    setNovotherclosedCount(data.data.novortherInsuranceclosedCount);
                    setDecotherclosedCount(data.data.desportherInsuranceclosedCount);




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
            line_of_business_name: "Motor New Leads",
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
            line_of_business_name: "Motor Issued Policies",
            monthlydata: [
                {
                    "month": "January",
                    "count": janmotorclosedCount
                },
                {
                    "month": "February",
                    "count": febmotorclosedCount
                },
                {
                    "month": "March",
                    "count": marmotorclosedCount
                },
                {
                    "month": "April",
                    "count": aprmotorclosedCount
                },
                {
                    "month": "May",
                    "count": maymotorclosedCount
                },
                {
                    "month": "June",
                    "count": junmotorclosedCount
                },
                {
                    "month": "July",
                    "count": julmotorclosedCount
                },
                {
                    "month": "August",
                    "count": augmotorclosedCount
                },
                {
                    "month": "September",
                    "count": sepmotorclosedCount
                },
                {
                    "month": "October",
                    "count": octmotorclosedCount
                },
                {
                    "month": "November",
                    "count": novmotorclosedCount
                },
                {
                    "month": "December",
                    "count": decmotorclosedCount
                }
            ],
        },
        {
            line_of_business_name: "Travel New Leads",
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
            line_of_business_name: "Travel Issued Policies",
            "monthlydata": [
                {
                    "month": "January",
                    "count": jantravelclosedcount
                },
                {
                    "month": "February",
                    "count": febtravelclosedcount
                },
                {
                    "month": "March",
                    "count": martravelclosedcount
                },
                {
                    "month": "April",
                    "count": aprtravelclosedcount
                },
                {
                    "month": "May",
                    "count": maytravelclosedcount
                },
                {
                    "month": "June",
                    "count": juntravelclosedcount
                },
                {
                    "month": "July",
                    "count": jultravelclosedcount
                },
                {
                    "month": "August",
                    "count": augtravelclosedcount
                },
                {
                    "month": "September",
                    "count": septravelclosedcount
                },
                {
                    "month": "October",
                    "count": octtravelclosedcount
                },
                {
                    "month": "November",
                    "count": novtravelclosedcount
                },
                {
                    "month": "December",
                    "count": dectravelclosedcount
                }
            ],
        },
        {
            line_of_business_name: "Home New Leads",
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
            line_of_business_name: "Home Issued Policies",
            "monthlydata": [
                {
                    "month": "January",
                    "count": janhomeclosedcount
                },
                {
                    "month": "February",
                    "count": febhomeclosedcount
                },
                {
                    "month": "March",
                    "count": marhomeclosedcount
                },
                {
                    "month": "April",
                    "count": aprhomeclosedcount
                },
                {
                    "month": "May",
                    "count": mayhomeclosedcount
                },
                {
                    "month": "June",
                    "count": junhomeclosedcount
                },
                {
                    "month": "July",
                    "count": julhomeclosedcount
                },
                {
                    "month": "August",
                    "count": aughomeclosedcount
                },
                {
                    "month": "September",
                    "count": sephomeclosedcount
                },
                {
                    "month": "October",
                    "count": octhomeclosedcount
                },
                {
                    "month": "November",
                    "count": novhomeclosedcount
                },
                {
                    "month": "December",
                    "count": dechomeclosedcount
                }
            ],
        },
        {
            line_of_business_name: "Medical New Leads",
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
            line_of_business_name: "Medical Issued Policies",
            "monthlydata": [
                {
                    "month": "January",
                    "count": janmedicalclosedcount
                },
                {
                    "month": "February",
                    "count": febmedicalclosedcount
                },
                {
                    "month": "March",
                    "count": marmedicalclosedcount
                },
                {
                    "month": "April",
                    "count": aprmedicalclosedcount
                },
                {
                    "month": "May",
                    "count": maymedicalclosedcount
                },
                {
                    "month": "June",
                    "count": junmedicalclosedcount
                },
                {
                    "month": "July",
                    "count": julmedicalclosedcount
                },
                {
                    "month": "August",
                    "count": augmedicalclosedcount
                },
                {
                    "month": "September",
                    "count": sepmedicalclosedcount
                },
                {
                    "month": "October",
                    "count": octmedicalclosedcount
                },
                {
                    "month": "November",
                    "count": novmedicalclosedcount
                },
                {
                    "month": "December",
                    "count": decmedicalclosedcount
                }
            ],
        },
        {
            line_of_business_name: "Yacht New Leads",
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
            line_of_business_name: "Yacht Issued Policies",
            "monthlydata": [
                {
                    "month": "January",
                    "count": janyachtclosedcount
                },
                {
                    "month": "February",
                    "count": febyachtclosedcount
                },
                {
                    "month": "March",
                    "count": maryachtclosedcount
                },
                {
                    "month": "April",
                    "count": apryachtclosedcount
                },
                {
                    "month": "May",
                    "count": mayyachtclosedcount
                },
                {
                    "month": "June",
                    "count": junyachtclosedcount
                },
                {
                    "month": "July",
                    "count": julyachtclosedcount
                },
                {
                    "month": "August",
                    "count": augyachtclosedcount
                },
                {
                    "month": "September",
                    "count": sepyachtclosedcount
                },
                {
                    "month": "October",
                    "count": octyachtclosedcount
                },
                {
                    "month": "November",
                    "count": novyachtclosedcount
                },
                {
                    "month": "December",
                    "count": decyachtclosedcount
                }
            ],

        },
        {
            line_of_business_name: "Other Insurance New Leads",
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
        },
        {
            line_of_business_name: "Other Insurance Issued Policies",
            "monthlydata": [
                {
                    "month": "January",
                    "count": janotherclosedcount
                },
                {
                    "month": "February",
                    "count": febotherclosedcount
                },
                {
                    "month": "March",
                    "count": marotherclosedcount
                },
                {
                    "month": "April",
                    "count": aprotherclosedcount
                },
                {
                    "month": "May",
                    "count": mayotherclosedcount
                },
                {
                    "month": "June",
                    "count": junotherclosedcount
                },
                {
                    "month": "July",
                    "count": julotherclosedcount
                },
                {
                    "month": "August",
                    "count": augotherclosedcount
                },
                {
                    "month": "September",
                    "count": sepotherclosedcount
                },
                {
                    "month": "October",
                    "count": octotherclosedcount
                },
                {
                    "month": "November",
                    "count": novotherclosedcount
                },
                {
                    "month": "December",
                    "count": decotherclosedcount
                }
            ],
        },

    ]



    let chartData = {
        labels: [],
        datasets: [],
    };

    chartData = {
        labels: Array.from(new Set(data.flatMap(item => item.monthlydata.map(data => data.month)))),
        datasets: data.map(item => ({
            label: item.line_of_business_name,
            backgroundColor: item.line_of_business_name === 'Motor New Leads' ? '#FF6384' :
                item.line_of_business_name === 'Motor Issued Policies' ? '#b82544' :
                    item.line_of_business_name === 'Travel New Leads' ? '#007500' :
                        item.line_of_business_name === 'Travel Issued Policies' ? '#0a400a' :
                            item.line_of_business_name === 'Home New Leads' ? '#FFCE56' :
                                item.line_of_business_name === 'Home Issued Policies' ? '#80621b' :
                                    item.line_of_business_name === 'Medical New Leads' ? '#36A2EB' :
                                        item.line_of_business_name === 'Medical Issued Policies' ? '#144566' :
                                            item.line_of_business_name === 'Yacht New Leads' ? '#5742f5' :
                                                item.line_of_business_name === 'Yacht Issued Policies' ? '#191154' :
                                                    item.line_of_business_name === 'Other Insurance New Leads' ? '#e02828' :
                                                        item.line_of_business_name === 'Other Insurance Issued Policies' ? '#780b0b' :

                                                            '#da42f5',
            data: item.monthlydata.map(data => data.count),
        })),
    };






    const leadStatus = [
        { id: 'New', label: 'New Leads' },
        { id: 'Pending', label: 'Pending Leads' },
        { id: 'Issued', label: 'Issued Policies' },
    ];





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
                                <CCol lg={12}>
                                    <CCard className="mb-4">
                                        <CCardHeader>Bar Chart</CCardHeader>
                                        <CCardBody>
                                            {/* <CChartBar data={chartData} /> */}

                                            <CChartBar
                                                data={chartData}
                                                options={{
                                                    scales: {
                                                        x: {
                                                            grid: {
                                                                drawBorder: false,
                                                                drawTicks: false,
                                                            },
                                                            ticks: {
                                                                padding: 5, // Adjust the padding here
                                                            },
                                                        },
                                                        y: {
                                                            beginAtZero: true,
                                                            grid: {
                                                                drawBorder: false,
                                                                drawOnChartArea: false,
                                                                drawTicks: false,
                                                            },
                                                            ticks: {
                                                                padding: 5, // Adjust the padding here
                                                            },
                                                        },
                                                    },
                                                }}

                                            />
                                        </CCardBody>
                                    </CCard>
                                </CCol>

                                {/* <Col className='' lg={4}>
                                    <CCard className="mb-4">
                                        <CCardHeader>Pie chart</CCardHeader>
                                        <CCardBody>
                                            <Multiselect
                                                options={leadStatus} // Options to display in the dropdown
                                                onSelect={selectedoptions}
                                                onRemove={selectedoptions}
                                                displayValue="label" // Property name to display in the dropdown options
                                                showArrow={true}
                                            />
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
                                </Col> */}
                            </CRow>
                        </CCard>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    )
}

export default ProducerGraph;
