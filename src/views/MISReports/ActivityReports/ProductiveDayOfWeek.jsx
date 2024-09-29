import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import PolicyTypeName from '../PolicyTypeName';
import { handlePdfDownload, handlePrint } from 'src/utils/PdfDownloader';
import { MISExcelDownload } from 'src/utils/ExcelDownloader';

function ProductiveDayOfWeek({ filterOptions, defaultOptions, activeKey }) {
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


        const query = `https://insuranceapi-3o5t.onrender.com/api/productiveDayOfTheWeek?page=${page}&limit=${perPage}&location=${newlocation}&lob=${newlob}&businessType=${newbusinessType}&agent=${newagent}&dateRange=${dateRange}&startdate=${startdate}&enddate=${enddate}&userType=${userType}&selectedSupervisor=${selectedSupervisor}`;
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
        if (!token) {
            navigate('/login');
        } else {
            activeKey == "7" && getLeadsList(state.page, state.perPage);
        }
    }, [filterOptions, state.page]); // Include state.page in dependencies
    const startFrom = (state.page - 1) * state.perPage;

    return (
        <>

            <Accordion.Item eventKey="7">
                <Accordion.Header>
                    <div className="card-header new_leads">
                        <strong>Most productive day of the week (business closed) </strong>
                    </div>
                </Accordion.Header>
                <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
                    {state.newleaddata.length > 0 && (
                        <div className='export-texcel-mis'>
                            <div >
                                <button onClick={async () => await MISExcelDownload['MostProductiveDayOFtheWeek'](state.newleaddata)} className="btn btn-primary">Download</button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePdfDownload(state.query, "ProductiveDayOfWeek")}
                                >
                                    Export to PDF
                                </button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePrint(state.query, "ProductiveDayOfWeek")}
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
                                <th scope="col">Day & Date</th>
                                <th scope="col">Deal Closed Count</th>
                                {/* <th scope="col">Line of Business</th>
                                <th scope="col">Policy Type</th>
                                <th scope="col">Column Wise Total</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {state.newleaddata.length > 0 ? (
                                state.newleaddata.map((item, index) => (
                                    <tr role='button' key={index} onClick={() => handleShowTable(index)}>
                                        <td>{startFrom + index + 1}</td>
                                        <td>{item._id}</td>
                                        <td>{item.count}</td>
                                        {/* Render other fields based on your data structure */}
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
            <div className={`modal fade ${state.indexnumberOfSupervisor.show ? 'show' : ''}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: state.indexnumberOfSupervisor.show ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Most productive day of the week (business closed)</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleShowTable()}></button>
                        </div>
                        <div className="modal-body">
                            {state.newleaddata.length > 0 && state.indexnumberOfSupervisor.show && state.indexnumberOfSupervisor.index !== undefined && (
                                <>
                                    <table className="table table-bordered">

                                        <thead className="thead-dark">
                                            <tr className="table-info">
                                                <th>Sr. No.</th>
                                                <th scope="col" colSpan={2}>Deal Closing Time</th>
                                                <th scope="col">Line of Busines</th>
                                                <th scope="col">Policy Type</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {state.newleaddata[state.indexnumberOfSupervisor.index].plan_name.length > 0 ? (
                                                state.newleaddata[state.indexnumberOfSupervisor.index].plan_name.map((item, index) => {
                                                    console.log("item", item)
                                                    return <tr key={index}>
                                                        {/* {JSON.stringify(item)} */}
                                                        {<td>{index + 1}</td>}
                                                        <td colSpan={2}>
                                                            {item.policy_issued_date ? (new Date(item.policy_issued_date).toLocaleDateString()) : "-"}
                                                        </td>
                                                        <td>

                                                            {item.lob}
                                                        </td>
                                                        <td>

                                                            <PolicyTypeName data={item.plan ? item.plan : null} type={item.lob} />
                                                        </td>



                                                    </tr>
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">
                                                        <strong>No Records Found</strong>
                                                    </td>
                                                </tr>
                                            )}

                                        </tbody>

                                    </table>



                                    {/* 
                                    <div className='text-end'>

                                        <strong>Total Commission </strong>: {state.newleaddata[state.indexnumberOfSupervisor.index].totalJDVCommission.toFixed(2)}

                                        <strong>Total Premium </strong>: {state.newleaddata[state.indexnumberOfSupervisor.index].totalPremium.toFixed(2)}
                                    </div> */}

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

ProductiveDayOfWeek.propTypes = {
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

export default ProductiveDayOfWeek;
