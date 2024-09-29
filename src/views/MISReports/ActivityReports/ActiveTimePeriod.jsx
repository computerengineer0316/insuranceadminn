import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import PolicyTypeName from '../PolicyTypeName';
import { handlePdfDownload, handlePrint } from 'src/utils/PdfDownloader';
import { MISExcelDownload } from 'src/utils/ExcelDownloader';
function ActiveTimePeriod({ filterOptions, defaultOptions, activeKey }) {
    const navigate = useNavigate();
    const [state, setState] = useState({
        newleaddata: [],
        perPage: 5,
        pageCount: 0,
        page: 1,
        start: 5,
        end: 6,
        query: ""
    });



    const getLeadsList = async (page, perPage) => {
        const query = `https://insuranceapi-3o5t.onrender.com/api/mostActiveTimePeriod?page=${page}&limit=${perPage}&dateRange=${filterOptions.dateRange}&start=${state.start}&end=${state.end}`;
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
    const handlechange = (name, value) => {
        if (name === "start") {
            value = parseInt(value);
            if (value >= state.end && state.end !== 0) {
                alert("Start time should be less than end time");
                return;
            }
        }
        if (name === "end") {
            value = parseInt(value);
            if (value <= state.start && state.start !== 0) {
                alert("End time should be greater than start time");
                return;
            }
        }

        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            activeKey == "6" && state.start !== 0 && state.end !== 0 && getLeadsList(state.page, state.perPage);
        }
    }, [filterOptions, state.page, state.start, state.end]); // Include state.page in dependencies
    const startFrom = (state.page - 1) * state.perPage;

    return (
        <>

            <Accordion.Item eventKey="6">
                <Accordion.Header>
                    <div className="card-header new_leads">
                        <strong>Most active time period in a day (number of quote requests received)</strong>
                    </div>
                </Accordion.Header>
                <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
                    <div className='row'>
                        <div className='col-md-6'>

                            <select value={state.start} onChange={(e) => handlechange("start", e.target.value)}>
                                <option value={0}>Select Start Time</option>
                                {
                                    // Creating an array from 1 to 23 (23 elements, removing the first index which is 0)

                                    Array.from({ length: 23 }, (_, index) => index + 1).map((item) => (
                                        <option key={item} disabled={
                                            state.end > 0 ? item >= state.end : false
                                        } value={item}>{item} hour</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='col-md-6'>
                            <select value={state.end} onChange={(e) => handlechange("end", e.target.value)}>
                                <option value={0}>Select End Time</option>
                                {
                                    // Creating an array from 1 to 23 (23 elements, removing the first index which is 0)
                                    Array.from({ length: 24 }, (_, index) => index + 1).map((item) => (
                                        <option key={item} disabled={
                                            state.start > 0 ? item <= state.start : false
                                        } value={item}>{item} hour</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    {state.newleaddata.length > 0 && (
                        <div className='export-texcel-mis'>
                            <div >
                                <button onClick={async () => await MISExcelDownload['MostActiveTimePeriod'](state.newleaddata)} className="btn btn-primary">Download</button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePdfDownload(state.query, "MostActiveTimePeriod")}
                                >
                                    Export to PDF
                                </button>

                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handlePrint(state.query, "MostActiveTimePeriod")}
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
                                <th scope="col">Date</th>
                                <th scope="col">Hourly Time</th>
                                <th scope="col">Customer Name</th>
                                <th scope="col">Contact No.</th>
                                <th scope="col">Customer Email</th>
                                <th scope="col">Line of Business</th>
                                <th scope="col">Policy Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.newleaddata.length > 0 ? (
                                state.newleaddata.map((item, index) => (
                                    <tr key={index}>
                                        <td>{startFrom + index + 1}</td>
                                        <td>{item.new_lead_timestamp ? new Date(item.new_lead_timestamp).toLocaleDateString("en-UK") : "-"}</td>
                                        <td>{item.hours + ":00"}</td>
                                        <td>{item.name}</td>
                                        <td>{item.phoneno}</td>
                                        <td>{item.email}</td>
                                        <td>{item.lob_name}</td>
                                        <td><PolicyTypeName data={item.plan_detail ? item.plan_detail : ""} type={item.lob_name} /></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="12" className="text-center">
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

ActiveTimePeriod.propTypes = {
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

export default ActiveTimePeriod;
