import React, { useCallback } from 'react'
import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import { Form, useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion, Col, Table } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { handlePdfDownload, handlePrint } from 'src/utils/PdfDownloader';
import { MISExcelDownload } from 'src/utils/ExcelDownloader';

AutoVsManualDealClose.propTypes =
{
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes

    })
};

AutoVsManualDealClose.propTypes = {
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
    }), activeKey: PropTypes.string
};

function AutoVsManualDealClose({ filterOptions, defaultOptions, activeKey }) {

    const navigate = useNavigate();
    const [newleaddata, setNewleadData] = useState({});
    const [query, setQuery] = useState('');
    const getLeadsList = async () => {
        const { location, lob, businessType, agent, dateRange } = filterOptions;
        const { startdate, enddate, userType, selectedSupervisor } = defaultOptions;

        let newlocation = Array.isArray(location) && location.length > 0 ?
            location.map(item => item.value) :
            defaultOptions.defaultlocation.map(item => item.value);

        let newlob = Array.isArray(lob) && lob.length > 0 ?
            lob.map(item => item.value) :
            defaultOptions.defaultlob.map(item => item.value);

        let newbusinessType = Array.isArray(businessType) && businessType.length > 0 ?
            businessType.map(item => item.value) :
            defaultOptions.defaultbusinessType.map(item => item.value);

        let newagent = Array.isArray(agent) && agent.length > 0 ?
            agent.map(item => item.value) :
            defaultOptions.defaultagent.map(item => item.value);


        const query = `https://insuranceapi-3o5t.onrender.com/api/autoVSmanual?location=${newlocation}&lob=${newlob}&businessType=${newbusinessType}&agent=${newagent}&dateRange=${dateRange}&startdate=${startdate}&enddate=${enddate}&userType=${userType}&selectedSupervisor=${selectedSupervisor}`;
        setQuery(query);
        try {
            const response = await fetch(`${query}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setNewleadData(data.data)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            activeKey == "12" && getLeadsList();
        }
    }, [filterOptions]);
    return (
        <>
            <Accordion.Item eventKey="12">
                <Accordion.Header>
                    <div className="card-header new_leads">
                        <strong>Auto Deal close vs. Manual Deal close</strong>
                    </div>
                </Accordion.Header>
                <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
                    {Object.keys(newleaddata).length > 0 && (
                        <div className='export-texcel-mis'>
                            <div >
                                <button onClick={async () => await MISExcelDownload['AutoVsManualDealClose'](newleaddata)} className="btn btn-primary">Download</button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePdfDownload(query, "AutoVsManualDealClose")}
                                >
                                    Export to PDF
                                </button>

                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePrint(query, "AutoVsManualDealClose")}
                                >
                                    Print
                                </button>
                            </div>
                        </div>
                    )
                    }
                    <table className="table table-bordered">
                        <thead className="thead-dark">
                            <tr className="table-info">
                                <th scope="col"> Total Number of Closed Deals </th>
                                <th scope="col">Policies issued through Auto (No SA Intervention)</th>
                                <th scope="col">Policies issued Manually (SA Intervention) </th>
                                <th scope="col">Auto vs. Manual</th>
                            </tr>
                        </thead>
                        <tbody>

                            {Object.keys(newleaddata).length > 0 ? (

                                <tr>
                                    <td>{newleaddata?.totalLeadClosed ? newleaddata.totalLeadClosed.toFixed() : "-"}</td>
                                    <td>{newleaddata?.autoLeadClosed ? newleaddata.autoLeadClosed.toFixed() : "-"}</td>
                                    <td>{newleaddata?.manualLeadClosed ? newleaddata.manualLeadClosed.toFixed() : "-"}</td>
                                    <td>{newleaddata.autoVsManualRatio ? newleaddata.autoVsManualRatio.toFixed() + "%" : "-"}</td>
                                </tr>


                            ) : (
                                <tr>
                                    <td colSpan="12" className="text-center">
                                        <strong>No Records Found</strong>
                                    </td>
                                </tr>
                            )
                            }
                        </tbody>
                    </table>
                </Accordion.Body>
            </Accordion.Item>
        </>
    )
}

export default AutoVsManualDealClose;