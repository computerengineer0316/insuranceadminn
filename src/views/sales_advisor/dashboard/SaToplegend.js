import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { CWidgetStatsC } from '@coreui/react';
import { CCol } from '@coreui/react';
import PropTypes from 'prop-types';


SaToplegend.propTypes =
{
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes
    })
};

SaToplegend.propTypes = {
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


function SaToplegend({ filterOptions, defaultOptions }) {

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

    const [totalcount, setTotalcount] = useState(0);
    const [closeLeadCount, setCloseLeadCount] = useState(0);
    const [totalPremiumEarned, setTotalPremiumEarned] = useState(0);
    const [pending, setPending] = useState(0);
    const [lost, setLost] = useState(0);




    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getTotalCount();
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


        if (loginusertype == "646224eab201a6f07b2dff36") {
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/topLeagentCount`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("data", data.data);
                    setTotalcount(data.data.totalCount)
                    setCloseLeadCount(data.data.closeLeadCount)
                    setTotalPremiumEarned(data.data.totalPremiumEarned)
                    setLost(data.data.lostCount)
                    setPending(data.data.saleAdvisorPendingCount)

                })
                .catch((error) => {
                    console.log(error)
                })


        }
        if (loginusertype == "64622470b201a6f07b2dff22") {
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/topLeagentCount?dashboardType=salesAdvisorDashboard`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("data", data.data);
                    setTotalcount(data.data.totalCount)
                    setCloseLeadCount(data.data.closeLeadCount)
                    setTotalPremiumEarned(data.data.totalPremiumEarned)
                    setLost(data.data.lostCount)
                    setPending(data.data.saleAdvisorPendingCount)
                }
                )
                .catch((error) => {
                    console.log(error)
                }
                )

        }
    }

    console.log("totalcount", totalcount);
    console.log("closeLeadCount", closeLeadCount);
    console.log("totalPremiumEarned", totalPremiumEarned);
    console.log("lost", lost);
    console.log("pending", pending);


    function formatAmount(amount) {
        if (amount !== null) {
            const numericValue = parseFloat(amount.toString().replace(/,/g, ''));
            if (!isNaN(numericValue)) {
                // Use toLocaleString with custom options for grouping
                return numericValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true });
            }
            return ''; // Return an empty string if the input is not a valid number
        }
    }





    return (
        <div>
            <Carousel className='carousel_abcds' margin={30} swipeable={false}
                draggable={true}
                showDots={true}
                responsive={responsive}
            >
                {/* <CRow className='custom_abcd'> */}
                <CCol xs={2} class='item'>
                    <CWidgetStatsC
                        className="mb-3"
                        progress={{ color: 'primary', value: 100 }}
                        text="Widget helper text"
                        title="Assigned Leads"
                        value={totalcount != null ? totalcount.toString() : "0"}
                    />
                </CCol>
                <CCol xs={2} class='item'>
                    <CWidgetStatsC
                        className="mb-3"
                        progress={{ color: 'danger', value: 100 }}
                        text="Widget helper text"
                        title="Closed"
                        value={closeLeadCount != null ? closeLeadCount.toString() : "0"}
                    />
                </CCol>
                <CCol xs={2} class='item' >
                    <CWidgetStatsC
                        className="mb-3"
                        progress={{ color: 'primary', value: 100 }}
                        text="Widget helper text"
                        title="Premium earned"
                        value={formatAmount(totalPremiumEarned != null ? totalPremiumEarned : "0")}
                    />
                </CCol>

                <CCol xs={2} class='item'>
                    <CWidgetStatsC
                        className="mb-3"
                        progress={{ color: 'primary', value: 100 }}
                        text="Widget helper text"
                        title="Pending"
                        value={pending != null ? pending.toString() : "0"}
                    />
                </CCol>
                <CCol xs={2} class='item'>
                    <CWidgetStatsC
                        width={36}
                        className="mb-3"
                        progress={{ color: 'danger', value: 100 }}
                        text="Widget helper text"
                        title="Lost"
                        value={lost != null ? lost.toString() : "0"}
                    />
                </CCol>

                {/* </CRow> */}
            </Carousel>

        </div>
    )
}

export default SaToplegend