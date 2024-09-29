import React, { useCallback } from 'react'
import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import { Form, useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion, Col, Table } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import PolicyTypeName from '../PolicyTypeName';
import { handlePdfDownload, handlePrint } from 'src/utils/PdfDownloader';
import SpecialIncentiveModal from '../modals/SpecialIncentiveModal';
import { MISExcelDownload } from 'src/utils/ExcelDownloader';

SpecialIncentive.propTypes =
{
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes

    })
};

SpecialIncentive.propTypes = {
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

function SpecialIncentive({ filterOptions, defaultOptions, activeKey }) {

    const navigate = useNavigate();
    const [state, setState] = useState({
        newleaddata: [],
        perPage: 5,
        pageCount: 0,
        page: 1,
        indexnumberOfSupervisor: {
            index: null,
            completed_by: null,
            show: false
        },
        query: ''
    });
    const getLeadsList = async (page, perPage) => {
        const userdata = JSON.parse(localStorage.getItem('user'));
        let { location, lob, businessType, agent, dateRange } = filterOptions;
        const { startdate, enddate, userType, selectedSupervisor } = defaultOptions;
        lob = lob.length > 0 ? lob.map((item) => item.value) : "";
        businessType = businessType.length > 0 ? businessType.map((item) => item.value) : "";
        agent = agent.length > 0 ? agent.map((item) => item.value) : "";
        location = location.length > 0 ? location.map((item) => item.value) : "";

        let query = `https://insuranceapi-3o5t.onrender.com/api/siToAgent?page=${page}&limit=${perPage}&location=${location}&lob=${lob}&business_type=${businessType}&newagent=${agent}&dateRange=${dateRange}&startdate=${startdate}&enddate=${enddate}&assign_staff=${userdata.assign_staff ? userdata.assign_staff : ""}&userType=${userType ? userType : ""}&selectedSupervisor=${selectedSupervisor}`;
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
    const handleShowTable = (index) => {
        setState(prevState => ({
            ...prevState,
            indexnumberOfSupervisor: {
                index: index,
                show: !prevState.indexnumberOfSupervisor.show
            }
        }));
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            activeKey == "2" && getLeadsList(state.page, state.perPage);
        }
    }, [filterOptions, state.page]);
    const startFrom = (state.page - 1) * state.perPage;

    return (
        <>
            <Accordion.Item eventKey="2">
                <Accordion.Header>
                    <div className="card-header new_leads">
                        <strong>Special incentive to the agents & teams on basis of deal closing</strong>
                    </div>
                </Accordion.Header>
                <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
                    {state.newleaddata.length > 0 && (
                        <div className='export-texcel-mis'>
                            <div >
                                <button onClick={async () => await MISExcelDownload['SpecialIncentive'](state.newleaddata)} className="btn btn-primary">Download</button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePdfDownload(state.query, "SpecialIncentive")}
                                >
                                    Export to PDF
                                </button>

                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePrint(state.query, "SpecialIncentive")}
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
                                <th scope="col">Promotional Code No.</th>

                                <th scope="col">Completed By</th>
                            </tr>

                        </thead>
                        <tbody>
                            {state.newleaddata.length > 0 ? (
                                state.newleaddata.map((item, ind) => (
                                    <tr key={ind} role='button' onClick={() => handleShowTable(ind)} >
                                        <td>{startFrom + ind + 1}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            {item.completed_by && item.completed_by.length > 0 && item.completed_by.map((cb, index) => (
                                                <div key={index} >
                                                    <div>{cb.user.name}{index < item.completed_by.length - 1 ? ', ' : ''}</div>
                                                </div>
                                            ))}
                                        </td>
                                        {/* <td>
                                            {item.supervisor.line_of_business && item.supervisor.line_of_business.length > 0 && item.supervisor.line_of_business.map((lob, index) => (
                                                <div key={index}>
                                                    <span>{lob.lob_name}{index < item.supervisor.line_of_business.length - 1 ? ', ' : ''}</span>
                                                </div>
                                            ))}
                                        </td> */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        <strong>No Records Found</strong>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <section>
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
            <div className={`modal fade ${state.indexnumberOfSupervisor.show ? 'show' : ''}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: state.indexnumberOfSupervisor.show ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">

                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleShowTable()}></button>
                        </div>

                        <div className="modal-body body-table-lobs">
                            <>
                                <SpecialIncentiveModal state={state} />
                            </>

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleShowTable()}>Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default SpecialIncentive;