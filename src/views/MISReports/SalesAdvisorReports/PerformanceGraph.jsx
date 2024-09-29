import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import PolicyTypeName from '../PolicyTypeName';
import { exportDataPerformanceReportToExcel, HandleDataToExcel } from 'src/utils/ExcelDownloader';
import { handlePdfDownload, handlePrint } from 'src/utils/PdfDownloader';
import PerformanceGraphModal from '../modals/PerformanceGraphModal';
import { MISExcelDownload } from 'src/utils/ExcelDownloader';

function PerformanceGraph({ filterOptions, defaultOptions, activeKey }) {
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
        query: ''
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

        let query = `https://insuranceapi-3o5t.onrender.com/api/performanceBasedGraph?page=${page}&limit=${perPage}&location=${location}&lob=${lob}&business_type=${businessType}&newagent=${agent}&dateRange=${dateRange}&startdate=${startdate}&enddate=${enddate}&assign_staff=${userdata.assign_staff ? userdata.assign_staff : ""}&userType=${userType ? userType : ""}&selectedSupervisor=${selectedSupervisor}`;
        setState(prevState => ({
            ...prevState,
            query: query
        }));
        try {
            const response = await fetch(query, {
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

    const handleShowTable = index => {
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
        if (!token) {
            navigate('/login');
        }
    }, []); // Run once on mount

    useEffect(() => {
        if (activeKey === '0') {
            getLeadsList(state.page, state.perPage);
        }
    }, [filterOptions, state.page, activeKey]);
    const startFrom = (state.page - 1) * state.perPage;


    return (
        <>
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    <div className="card-header new_leads">
                        <strong>New Business/ Renewal Business(Performance based Reports- Sales Advisor (SA)/Supervisor)</strong>
                    </div>
                </Accordion.Header>
                <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
                    {state.newleaddata.length > 0 && (
                        <div className='export-texcel-mis'>
                            <div >
                                <button onClick={async () => await MISExcelDownload['performanceReport'](state.newleaddata)} className="btn btn-primary">Download</button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePdfDownload(state.query, "PerformanceGraph")}
                                >
                                    Export to PDF
                                </button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePrint(state.query, "PerformanceGraph")}
                                >
                                    Print
                                </button>
                            </div>
                        </div>
                    )}
                    <table className="table table-bordered">
                        <thead className="thead-dark">
                            <tr className="table-info">
                                <th>Sr. No.</th>
                                <th scope="col">Supervisor/Team</th>
                                <th scope="col">SA Name</th>
                                <th scope="col">Line of Business</th>
                                <th scope="col">Total Premium</th>
                                <th scope="col">Total Commission</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.newleaddata.length > 0 ? (
                                state.newleaddata.map((item, ind) => (
                                    <tr role='button' key={ind} onClick={() => handleShowTable(ind)}>
                                        <td>{startFrom + ind + 1}</td>
                                        <td>{item.supervisor.name}</td>
                                        <td>
                                            {item.salesAdvisors && item.salesAdvisors.length > 0 && item.salesAdvisors.map((sa, index) => (
                                                <div key={index}>
                                                    <span>{sa.name}{index < item.salesAdvisors.length - 1 ? ', ' : ''}</span>
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            {item.supervisor.line_of_business && item.supervisor.line_of_business.length > 0 && item.supervisor.line_of_business.map((lob, index) => (
                                                <div key={index}>
                                                    <span>{lob.lob_name}{index < item.supervisor.line_of_business.length - 1 ? ', ' : ''}</span>
                                                </div>
                                            ))}
                                        </td>
                                        <td>{item.totalPremium ? item.totalPremium.toFixed(2) : "-"}</td>
                                        <td>{item.totalJDVCommission ? item.totalJDVCommission.toFixed(2) : "-"}</td>
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
            {/* Model open  */}

            <div className={`modal fade ${state.indexnumberOfSupervisor.show ? 'show' : ''}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: state.indexnumberOfSupervisor.show ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleShowTable()}></button>
                        </div>
                        <PerformanceGraphModal state={state} />
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleShowTable()}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

PerformanceGraph.propTypes = {
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes.string
    }),
    defaultOptions: PropTypes.shape({
        defaultlocation: PropTypes.string,
        defaultlob: PropTypes.string,
        defaultbusinessType: PropTypes.string,
        defaultagent: PropTypes.string,
        startdate: PropTypes.string,
        enddate: PropTypes.string,
        userType: PropTypes.string,
        selectedSupervisor: PropTypes.string
    }),
    activeKey: PropTypes.string,
    data: PropTypes.array,
    id: PropTypes.string
};

export default PerformanceGraph;
