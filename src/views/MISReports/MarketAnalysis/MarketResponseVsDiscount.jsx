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

MarketResponseVsDiscount.propTypes =
{
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes

    })
};

MarketResponseVsDiscount.propTypes = {
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
    }),
    activeKey: PropTypes.string
};

function MarketResponseVsDiscount({ filterOptions, defaultOptions, activeKey }) {
    const navigate = useNavigate();
    const [state, setState] = useState({
        newleaddata: [],
        perPage: 5,
        pageCount: 0,
        page: 1,
        indexnumberOfSupervisor: {
            index: null,
            show: false
        },
        query: ""
    });
    const getLeadsList = async (page, perPage) => {
        const userdata = JSON.parse(localStorage.getItem('user'));
        let { location, lob, businessType, agent, dateRange } = filterOptions;
        const { startdate, enddate, userType, selectedSupervisor } = defaultOptions;
        console.log("location : ", location);
        console.log("lob : ", lob);
        console.log("businessType : ", businessType);
        console.log("agent : ", agent);

        lob = lob.length > 0 ? lob.map((item) => item.value) : "";
        businessType = businessType.length > 0 ? businessType.map((item) => item.value) : "";
        agent = agent.length > 0 ? agent.map((item) => item.value) : "";
        location = location.length > 0 ? location.map((item) => item.value) : "";

        let query = `https://insuranceapi-3o5t.onrender.com/api/marketVSdiscount?page=${page}&limit=${perPage}&location=${location}&lob=${lob}&business_type=${businessType}&newagent=${agent}&dateRange=${dateRange}&startdate=${startdate}&enddate=${enddate}&assign_staff=${userdata.assign_staff ? userdata.assign_staff : ""}&userType=${userType ? userType : ""}&selectedSupervisor=${selectedSupervisor}`;
        setState(prevState => ({
            ...prevState,
            query: query
        }));
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
            const total = data.total;
            const pages = Math.ceil(total / perPage);
            setState(prevState => ({
                ...prevState,
                pageCount: pages,
                newleaddata: data.data
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handlePageClick = selected => {
        const newPage = selected.selected + 1;
        setState(prevState => ({
            ...prevState,
            page: newPage
        }));
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            activeKey == "8" && getLeadsList(state.page, state.perPage);
        }
    }, [filterOptions, state.page]); // Include state.page in dependencies

    const startFrom = (state.page - 1) * state.perPage;


    return (
        <>
            <Accordion.Item eventKey="8">
                <Accordion.Header>
                    <div className="card-header new_leads">
                        <strong>Market response vs. discount offered (business closed above average) </strong>
                    </div>
                </Accordion.Header>
                <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
                    {state.newleaddata.length > 0 && (
                        <div className='export-texcel-mis'>
                            <div >
                                <button onClick={async () => await MISExcelDownload['MarketResponseVsDiscount'](state.newleaddata)} className="btn btn-primary">Download</button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePdfDownload(state.query, "MarketResponseVsDiscount")}
                                >
                                    Export to PDF
                                </button>

                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePrint(state.query, "MarketResponseVsDiscount")}
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
                                <th scope="col">Sr. No.</th>
                                <th scope="col">Promotional Code No</th>
                                <th scope="col">Type of Promotion </th>
                                <th scope="col">Line of Business</th>
                                <th scope="col">Promotion Start Date</th>
                                <th scope="col">First policy closed with Promotional Code</th>
                                <th scope="col">Avg. Business Closing (No. of Policies)</th>
                                <th scope="col">Avg. Business Closing (Total Premium)</th>
                                <th scope="col">Policies generated through promotion(No. of policies)</th>
                                <th scope="col">Premium generated through promotion (Total Premium)</th>
                                <th scope="col">Market Response Time </th>
                                <th scope="col">Incremental Policies</th>
                                <th scope="col">Incremental Premium</th>
                            </tr>

                        </thead>
                        <tbody>

                            {state.newleaddata.length > 0 ? (
                                state.newleaddata.map((item, index) => (

                                    <tr key={index}>
                                        <td>{startFrom + index + 1}</td>
                                        <td>{item.code}</td>
                                        <td>{item.discount.includes("%") ? `Percentage- ${item.discount}` : `Value- ${item.discount} AED`}</td>
                                        <td>{item.lob.map((item) => item.line_of_business_name).join(",")}</td>
                                        <td>{item.startdate ? new Date(item.startdate).toLocaleDateString() : "-"}</td>
                                        <td>{item.firstPolicyClosed ? new Date(item.firstPolicyClosed).toLocaleDateString() : "-"}</td>
                                        <td>{item.leadWithoutDiscount}</td>
                                        <td>{item.premiumWithoutDiscount ? item.premiumWithoutDiscount.toFixed(2) : "-"}</td>
                                        <td>{item.leadWithDiscount}</td>
                                        <td>{item.premiumWithDiscount ? item.premiumWithDiscount.toFixed(2) : "-"}</td>
                                        <td>{item.marketResponseTime ? new Date(item.marketResponseTime).toLocaleDateString() : "-"}</td>
                                        <td>{item.incrementalPolicies}</td>
                                        <td>{item.incrementalPremium}</td>

                                    </tr>

                                ))
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
                    <section>
                        {/* <button className='save-btn' onClick={handleassignedsubmit}>Save </button> */}
                        <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            pageCount={state.pageCount}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={1}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination justify-content-end"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active"}
                        />
                    </section>
                </Accordion.Body>
            </Accordion.Item>

        </>
    )
}

export default MarketResponseVsDiscount;