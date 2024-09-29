import React from 'react'
import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import { Form, useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion, Col, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

import PolicyTypeName from '../PolicyTypeName';
import { handlePdfDownload, handlePrint } from 'src/utils/PdfDownloader';
import { AgentrowsPanHook } from 'src/hooks';
import { MISExcelDownload } from 'src/utils/ExcelDownloader';



function WithSAIntervention({ filterOptions, defaultOptions, activeKey }) {
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
        lob = lob.length > 0 ? lob.map((item) => item.value) : "";
        businessType = businessType.length > 0 ? businessType.map((item) => item.value) : "";
        agent = agent.length > 0 ? agent.map((item) => item.value) : "";
        location = location.length > 0 ? location.map((item) => item.value) : "";

        let query = `https://insuranceapi-3o5t.onrender.com/api/siToCustomerWithSA?page=${page}&limit=${perPage}&location=${location}&lob=${lob}&business_type=${businessType}&newagent=${agent}&dateRange=${dateRange}&startdate=${startdate}&enddate=${enddate}&assign_staff=${userdata.assign_staff ? userdata.assign_staff : ""}&userType=${userType ? userType : ""}&selectedSupervisor=${selectedSupervisor}`;
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
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            activeKey == "4" && getLeadsList(state.page, state.perPage);
        }
    }, [filterOptions, state.page]);
    const startFrom = (state.page - 1) * state.perPage;
    return (
        <>

            <Accordion.Item eventKey="4">
                <Accordion.Header>
                    <div className="card-header new_leads">
                        <strong>With/Without Special incentive to customers – with SA intervention </strong>
                    </div>
                </Accordion.Header>
                <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
                    {state.newleaddata.length > 0 && (
                        <div className='export-texcel-mis'>
                            <div >

                                <div >
                                    <button onClick={async () => await MISExcelDownload['SpecialIncentiveToCustomerWith'](state.newleaddata)} className="btn btn-primary">Download</button>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePdfDownload(state.query, "SpecialIncentiveToCustomersWithSA")}
                                >
                                    Export to PDF
                                </button>

                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePrint(state.query, "SpecialIncentiveToCustomersWithSA")}
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
                            {/* {state.newleaddata.length > 0 && (
                                <div className='row'>
                                    <div className='col-md-6'>Total JDV Commission: {totalJdvCommissionAllData(state.newleaddata).toFixed(2)}</div>
                                    <div className='col-md-6'>Total Premium: {totalPremiumAllData(state.newleaddata).toFixed(2)}</div>
                                </div>
                            )
                            } */}
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

            <div className={`modal fade ${state.indexnumberOfSupervisor.show ? 'show' : ''}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: state.indexnumberOfSupervisor.show ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">

                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleShowTable()}></button>
                        </div>
                        <div className="modal-body">
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


                                                                    <table className="table table-bordered">
                                                                        <thead className="thead-dark">
                                                                            <tr className="table-info">
                                                                                <th>Sr. No.</th>
                                                                                <th>Promotional Code No</th>
                                                                                <th scope="col">SA Name</th>
                                                                                <th scope="col">Policy Type</th>
                                                                                <th scope="col">Premium</th>
                                                                                <th scope="col">JDV Comm</th>

                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {lob.plans.length > 0 ? (
                                                                                lob.plans.map((plan, pIndex, arr) => {
                                                                                    return <tr key={pIndex}>
                                                                                        <td>{pIndex + 1}</td>

                                                                                        <td>{plan.discountId && plan.discountId.description ? plan.discountId.description : "-"}</td>
                                                                                        <AgentrowsPanHook lead={lob.plans} name='agent_name' pIndex={pIndex} arr={arr} />
                                                                                        <td>
                                                                                            <PolicyTypeName data={plan.planDetails ? plan.planDetails : null} type={lob.lob_name} />
                                                                                        </td>
                                                                                        <td>{plan.premium ? plan.premium.toFixed(2) : 0}</td>
                                                                                        <td>{plan.jdvCommission ? plan.jdvCommission.toFixed(2) : "-"}</td>   </tr>
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

                                                                                    <td colSpan={4}>
                                                                                        {"Total"}
                                                                                    </td>
                                                                                    <td>
                                                                                        {lob.totalPremium ? lob.totalPremium.toFixed(2) : 0}
                                                                                    </td>
                                                                                    <td>
                                                                                        {lob.totalJdvCommission ? lob.totalJdvCommission.toFixed(2) : 0}
                                                                                    </td>
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
    )
}
WithSAIntervention.propTypes =
{
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes

    })
};

WithSAIntervention.propTypes = {
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
export default WithSAIntervention;