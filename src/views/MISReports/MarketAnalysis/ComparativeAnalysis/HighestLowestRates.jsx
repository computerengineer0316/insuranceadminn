import React, { useCallback } from 'react';
import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { handlePdfDownload, handlePrint } from 'src/utils/PdfDownloader';
import { MISExcelDownload } from 'src/utils/ExcelDownloader';
import { RateCalculator, TotalLeadCount } from 'src/utils';
import { AllRowsAndTable, RenderHighestRateRows, Tablehaders } from './RenderHighestRateRows';

HighestLowestRates.propTypes = {
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        agent: PropTypes.string,
        dateRange: PropTypes.string,
    }),
    defaultOptions: PropTypes.shape({
        defaultlocation: PropTypes.string,
        defaultlob: PropTypes.string,
        defaultbusinessType: PropTypes.string,
        defaultagent: PropTypes.string,
        defaultdateRange: PropTypes.string,
        startdate: PropTypes.string,
        enddate: PropTypes.string,
        userType: PropTypes.string,
        selectedSupervisor: PropTypes.string,
    }),
    activeKey: PropTypes.string,
};

function HighestLowestRates({ filterOptions, defaultOptions, activeKey }) {
    const navigate = useNavigate();
    const [state, setState] = useState({
        newleaddata: [],
        perPage: 5,
        pageCount: 0,
        page: 1,
        query: '',
        lobname: 'all',
        isLoading: false
    });
    const handleCHange = (name, value) => {
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const getleadslist = async (page, perPage) => {
        try {
            const userdata = JSON.parse(localStorage.getItem('user'));
            let { location, lob, businessType, agent, dateRange } = filterOptions;
            const { startdate, enddate, userType, selectedSupervisor } = defaultOptions;

            lob = lob.length > 0 ? lob.map((item) => item.value) : "";
            businessType = businessType.length > 0 ? businessType.map((item) => item.value) : "";
            agent = agent.length > 0 ? agent.map((item) => item.value) : "";
            location = location.length > 0 ? location.map((item) => item.value) : "";

            const query = `http://localhost:8000/api/highestLowestRates?page=${page}&lobname=${state.lobname}&limit=${perPage}&location=${location}&lob=${lob}&business_type=${businessType}&newagent=${agent}&dateRange=${dateRange}&startdate=${startdate}&enddate=${enddate}&assign_staff=${userdata.assign_staff || ""}&userType=${userType || ""}&selectedSupervisor=${selectedSupervisor || ""}`;

            setState(prevState => ({ ...prevState, query, isLoading: true }));

            const response = await fetch(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });

            const data = await response.json();

            if (data.data && Array.isArray(data.data)) {
                setState(prevState => ({
                    ...prevState,
                    newleaddata: data.data,
                    isLoading: false,
                }));
            } else {
                setState(prevState => ({
                    ...prevState,
                    newleaddata: [],
                    isLoading: false,
                }));
            }
        } catch (error) {
            console.log(error);
            setState(prevState => ({
                ...prevState,
                newleaddata: [],
                isLoading: false,
            }));
        }
    };


    const handlePageClick = (e) => {
        const selectedPage = e.selected + 1;
        setState(prevState => ({ ...prevState, page: selectedPage }));
        getleadslist(selectedPage, state.perPage);
    };



    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            activeKey === "14" && getleadslist(state.page, state.perPage);
        }
    }, [filterOptions, state.lobname]);

    const startFrom = (state.page - 1) * state.perPage;
    console.log("state.lobname", state.lobname)
    return (
        <Accordion.Item eventKey="14">
            <Accordion.Header>
                <div className="card-header new_leads">
                    <strong>Comparative Analysis (Highest & Lowest rates offered in the market for each type of vehicle)</strong>
                </div>
            </Accordion.Header>
            <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
                <div className='export-texcel-mis'>
                    <div >
                        <Form.Group className="mb-3 d-flex ">
                            <Form.Label className='form-label'>Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="lobname"
                                value={state.lobname}
                                onChange={(e) => handleCHange(e.target.name, e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="motor">motor</option>
                                <option value="travel">travel</option>
                                <option value="yacht">yacht</option>
                                <option value="medical">medical</option>
                                <option value="home">home</option>
                            </Form.Control>
                        </Form.Group>
                    </div>
                    <div>
                        {state.newleaddata.length > 0 && (
                            <div className='export-texcel-mis'>
                                <div>
                                    <button onClick={async () => await MISExcelDownload['HighestLowestRate'](state.newleaddata)} className="btn btn-primary">Download</button>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handlePdfDownload(state.query, "HighestLowestRate")}
                                    >
                                        Export to PDF
                                    </button>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handlePrint(state.query, "HighestLowestRate")}
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
                        <Tablehaders lobname={state.lobname} />
                    </thead>
                    <tbody>
                        {
                            state.isLoading ? <div className="spinner">
                                ...loading
                            </div> :
                                state.newleaddata && state.newleaddata.length > 0 ? (
                                    state.newleaddata.map((item, index) => (
                                        Object.keys(item).length === 1
                                            ? <RenderHighestRateRows item={item[state.lobname]} lobanme={state.lobname} />
                                            : <RenderHighestRateRows data={item} lobanme={state.lobname} />
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
                {/* <section>
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
                </section> */}
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default HighestLowestRates;
