import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion, Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import { handlePdfDownload, handlePrint } from 'src/utils/PdfDownloader';
import { MISExcelDownload } from 'src/utils/ExcelDownloader';

function PendingLeadsPolicies({ filterOptions, defaultOptions, activeKey }) {
    const navigate = useNavigate();
    const [state, setState] = useState({
        newleaddata: [],
        perPage: 5,
        pageCount: 0,
        page: 1,
        query: '',
        status: 'both'
    });
    const handleCHange = (name, value) => {
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const getLeadsList = async (page, perPage) => {
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


        const query = `https://insuranceapi-3o5t.onrender.com/api/tatForPolicies?status=${state.status}&page=${page}&limit=${perPage}&location=${newlocation}&lob=${newlob}&businessType=${newbusinessType}&agent=${newagent}&dateRange=${dateRange}&startdate=${startdate}&enddate=${enddate}&userType=${userType}&selectedSupervisor=${selectedSupervisor}`;
        handleCHange('query', query);
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
            handleCHange('pageCount', pages);
            handleCHange('newleaddata', data.data);


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePageClick = selected => {
        const newPage = selected.selected + 1;
        handleCHange('page', newPage);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            activeKey == "9" && getLeadsList(state.page, state.perPage);
        }
    }, [filterOptions, state.page, state.status]); // Include state.page in dependencies
    const startFrom = (state.page - 1) * state.perPage;
    const handledays = (minutes) => {
        let days = Math.floor(minutes / 1440);
        let hours = Math.floor((minutes % 1440) / 60);
        let min = Math.floor((minutes % 1440) % 60);
        console.log({ days, hours, min });
        return `${days}d ${hours}h ${min}m`;
    }
    return (
        <>
            <Accordion.Item eventKey="9">
                <Accordion.Header>
                    <div className="card-header new_leads">
                        <strong>Performance end to end TAT, aging analysis </strong>
                    </div>
                </Accordion.Header>
                <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>


                    <div className='export-texcel-mis'>
                        <div >
                            <Form.Group className="mb-3 d-flex ">
                                <Form.Label className='form-label'>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="status"
                                    value={state.status}
                                    onChange={(e) => handleCHange(e.target.name, e.target.value)}
                                >
                                    <option value="Both">Both</option>
                                    <option value="New">Pending</option>
                                    <option value="Closed">Completed</option>
                                </Form.Control>
                            </Form.Group>
                        </div>
                        <div>
                            {state.newleaddata.length > 0 && (
                                <div className='export-texcel-mis'>
                                    <div >
                                        <button onClick={async () => await MISExcelDownload['PendingLeadsPolicies'](state.newleaddata)} className="btn btn-primary">Download</button>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => handlePdfDownload(state.query, "PendingLeadsPolicies")}
                                        >
                                            Export to PDF
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => handlePrint(state.query, "PendingLeadsPolicies")}
                                        >
                                            Print
                                        </button>
                                    </div>
                                </div>

                            )
                            }

                        </div>
                    </div>


                    <table className="table table-bordered">
                        <thead className="thead-dark">
                            <tr className="table-info">
                                <th scope="col">Sr. No.</th>
                                <th scope="col">Aging Period</th>
                                <th scope="col">Aging Period for  Super Visor To Salse Advisor </th>
                                <th scope="col">Aging Period for  Salse Advisor To Salse Advisor </th>
                                <th scope="col">Aging Period for  Document Chaser To Policy Issuer </th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.newleaddata.length > 0 ? (
                                state.newleaddata.map((item, index) => (
                                    <tr role='button' key={index} >
                                        <td>{startFrom + index + 1}</td>
                                        <td>{item.agingPeriodInDay > 30 ? "30+ days " : item.agingPeriodInDay + " days"}</td>
                                        <td>{item.agingPeriodForSupervisorToSA ? handledays(item.agingPeriodForSupervisorToSA) : "-"}</td>
                                        {/* <td>{item.agingPeriodForSupervisorToSA ? item.agingPeriodForSupervisorToSA : "-"}</td> */}
                                        <td>{item.agingPeriodForSAtoDC ? handledays(item.agingPeriodForSAtoDC) : "-"}</td>
                                        <td>{item.agingPeriodForDCtoPI ? handledays(item.agingPeriodForDCtoPI) : "-"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
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

        </>
    );
}

PendingLeadsPolicies.propTypes = {
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes.string
    }),
    defaultOptions: PropTypes.shape({
        defaultlocation: PropTypes.arrayOf(PropTypes.object),
        defaultlob: PropTypes.arrayOf(PropTypes.object),
        defaultbusinessType: PropTypes.arrayOf(PropTypes.object),
        defaultagent: PropTypes.arrayOf(PropTypes.object),
        startdate: PropTypes.string,
        enddate: PropTypes.string,
        userType: PropTypes.string,
        selectedSupervisor: PropTypes.string
    }),
    activeKey: PropTypes.string
};

export default PendingLeadsPolicies;
