import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import PolicyTypeName from '../PolicyTypeName';

import { handlePdfDownload, handlePrint } from 'src/utils/PdfDownloader';
import { MISExcelDownload } from 'src/utils/ExcelDownloader';
function ClosingRatio({ filterOptions, defaultOptions, activeKey }) {
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

        let query = `https://insuranceapi-3o5t.onrender.com/api/closingRatio?page=${page}&limit=${perPage}&location=${location}&lob=${lob}&business_type=${businessType}&newagent=${agent}&dateRange=${dateRange}&startdate=${startdate}&enddate=${enddate}&assign_staff=${userdata.assign_staff ? userdata.assign_staff : ""}&userType=${userType ? userType : ""}&selectedSupervisor=${selectedSupervisor}`;
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
        } else {
            activeKey == "1" && getLeadsList(state.page, state.perPage);
        }
    }, [filterOptions, state.page]); // Include state.page in dependencies

    const startFrom = (state.page - 1) * state.perPage;
    return (
        <>
            <Accordion.Item eventKey="1">
                <Accordion.Header>
                    <div className="card-header new_leads">
                        <strong>New Business/ Renewal Business(Closing Ratio by SA/Supervisor)</strong>
                    </div>
                </Accordion.Header>
                <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
                    {state.newleaddata.length > 0 && (
                        <div className='export-texcel-mis'>
                            <div >
                                <button onClick={async () => await MISExcelDownload['ClosingrationReport'](state.newleaddata)} className="btn btn-primary">Download</button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePdfDownload(state.query, "ClosingRatioGraph")}
                                >
                                    Export to PDF
                                </button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePrint(state.query, "ClosingRatioGraph")}
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
            <div className={`modal fade ${state.indexnumberOfSupervisor.show ? 'show' : ''}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: state.indexnumberOfSupervisor.show ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">

                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleShowTable()}></button>
                        </div>

                        <div className="modal-body  body-table-lobs">
                            {state.newleaddata.length > 0 && state.indexnumberOfSupervisor.show && state.indexnumberOfSupervisor.index !== undefined && (
                                <>
                                    <table className="table table-bordered">
                                        <tbody>
                                            {state.newleaddata[state.indexnumberOfSupervisor.index].lobs.length > 0 ? (
                                                state.newleaddata[state.indexnumberOfSupervisor.index].lobs.map((lob, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div style={{ textAlign: "left" }}>
                                                                <strong>Line Of Business</strong> :{lob.lob_name}
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-md-12' style={{ display: "grid" }}>
                                                                    <table className="table table-bordered table-lobs">
                                                                        <thead className="thead-dark">
                                                                            <tr className="table-info">
                                                                                <th>Sr. No.</th>
                                                                                <th scope="col">SA Name</th>
                                                                                <th scope="col">Policy Type</th>
                                                                                <th scope="col">Premium</th>
                                                                                <th scope="col">JDV Comm</th>
                                                                                <th scope="col">Closing Ratio</th>

                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {lob.plans.length > 0 ? (
                                                                                lob.plans.map((plan, pIndex) => {
                                                                                    let assignedAgent = plan.assigned_agent;
                                                                                    return <tr key={pIndex}>
                                                                                        <td>{pIndex + 1}</td>
                                                                                        <td>

                                                                                            <p>
                                                                                                {plan.assigned_agent && plan.assigned_agent.length > 0 ? plan.assigned_agent.map((agent, ind) => (
                                                                                                    <div key={ind}>
                                                                                                        <span>{agent?.name}{ind < plan.assigned_agent.length - 1 ? ', ' : ''}</span>
                                                                                                    </div>
                                                                                                ))
                                                                                                    : ("-")}
                                                                                            </p>
                                                                                        </td>
                                                                                        <td>
                                                                                            <PolicyTypeName data={plan.planDetails ? plan.planDetails : null} type={lob.lob_name} />
                                                                                        </td>
                                                                                        <td>{plan.premium ? plan.premium : 0}</td>
                                                                                        <td>{plan.jdvCommission ? plan.jdvCommission : 0}</td>
                                                                                        <td>
                                                                                            <ol>
                                                                                                <li style={{ listStyleType: "lower-roman" }}>{plan.newVsClosedPercentage.toFixed(2) + "%"}. New: {plan.lead_status_count.new}, Closed: {plan.lead_status_count.closed}</li>
                                                                                                <li style={{ listStyleType: "lower-roman" }}> {plan.renewalVsClosedPercentage.toFixed(2) + "%"}. Renewal: {plan.business_type_count.renewal}, Closed: {plan.business_type_count.closed}</li>
                                                                                            </ol>
                                                                                        </td>
                                                                                    </tr>
                                                                                }

                                                                                )


                                                                            ) : (
                                                                                <tr>
                                                                                    <td colSpan="5" className="text-center">
                                                                                        <strong>No Records Found</strong>
                                                                                    </td>
                                                                                </tr>
                                                                            )}

                                                                        </tbody>
                                                                        {lob.plans.length > 0 && (
                                                                            <>
                                                                                <tr>

                                                                                    <td colSpan={3}>
                                                                                        {"Total"}
                                                                                    </td>
                                                                                    <td>
                                                                                        {lob.totalPremium.toFixed(2)}
                                                                                    </td>
                                                                                    <td>
                                                                                        {lob.totalJdvCommission.toFixed(2)}
                                                                                    </td>
                                                                                    <td></td>
                                                                                </tr>
                                                                            </>
                                                                        )}
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </td>
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



                                </>

                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleShowTable()}>Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
ClosingRatio.propTypes = {
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes.any
    }),
    defaultOptions: PropTypes.shape({
        defaultlocation: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })),
        defaultlob: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })),
        defaultbusinessType: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })),
        defaultagent: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })),
        startdate: PropTypes.any,
        enddate: PropTypes.any,
        userType: PropTypes.any,
        selectedSupervisor: PropTypes.any
    }),
    activeKey: PropTypes.string
};
export default ClosingRatio;
