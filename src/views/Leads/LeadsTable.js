import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Modal, Button, Accordion } from 'react-bootstrap';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { CWidgetStatsC } from '@coreui/react';
import { CCol } from '@coreui/react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';

LeadsTable.propTypes = {
    filterOptions: PropTypes.shape({
        location: PropTypes.string,
        lob: PropTypes.string,
        businessType: PropTypes.string,
        dateRange: PropTypes
    })
};

LeadsTable.propTypes = {
    defaultOptions: PropTypes.shape({
        defaultlocation: PropTypes.string,
        defaultlob: PropTypes.string,
        defaultbusinessType: PropTypes.string,
        defaultdateRange: PropTypes,
        startdate: PropTypes,
        enddate: PropTypes,
        userType: PropTypes
    })
};

function LeadsTable({ filterOptions, defaultOptions }) {
    const navigate = useNavigate();


    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 6
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 6
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [newleaddata, setNewleadData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [perPage] = useState(10);
    const [make_motor, setMakeMotor] = useState([]);
    const [lob, setLob] = useState([]);
    const [modelmotor, setModelMotor] = useState([]);
    const [motormodel, setMotorModel] = useState([]);
    const [page, setPage] = useState(1);
    const [leaddetails, setLeadDetails] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getAllLeadslist(page, perPage);
            getlistMakeMotor();
            getLineOfBuisness();
        }
    }, [filterOptions]);

    const getAllLeadslist = async (page, perPage) => {
        const userdata = JSON.parse(localStorage.getItem('user'));
        let newlocation = filterOptions.location;
        let newlob = filterOptions.lob;
        let newbusinessType = filterOptions.businessType;
        let dateRange = filterOptions.dateRange;
        let startdate = defaultOptions.startdate;
        let enddate = defaultOptions.enddate;


        if (newlocation == null || newlocation == undefined || !Array.isArray(newlocation) || newlocation.length === 0) {
            newlocation = defaultOptions.defaultlocation.map((item) => item.value);
            // newlocation = [];
        }
        else {
            newlocation = newlocation.map((item) => item.value);
        }

        if (newlob == null || newlob == undefined || !Array.isArray(newlob) || newlob.length === 0) {
            newlob = defaultOptions.defaultlob.map((item) => item.value);
            // newlob = [];
        }
        else {
            newlob = newlob.map((item) => item.value);
        }

        if (newbusinessType == null || newbusinessType == undefined || !Array.isArray(newbusinessType) || newbusinessType.length === 0) {
            newbusinessType = defaultOptions.defaultbusinessType.map((item) => item.value);
            // newbusinessType = [];

        }
        else {
            newbusinessType = newbusinessType.map((item) => item.value);
        }
        const token = localStorage.getItem('token');
        const loginuser = JSON.parse(localStorage.getItem('user'));
        const loginusertype = loginuser.usertype;
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({
                page: page,
                limit: perPage,
                location: newlocation,
                lob: newlob,
                business_type: newbusinessType,
                dateRange: dateRange,
                startdate: startdate,
                enddate: enddate
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (loginusertype == "64622470b201a6f07b2dff22") {
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/getallleads`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data.data, ">>>>>>>>>>>>>>>>>>>>>>>>>data")
                    const total = data.total;
                    const slice = total / perPage;
                    const pages = Math.ceil(slice);
                    setPageCount(pages);
                    const list = data.data;
                    setNewleadData(list)
                })
                .catch((error) => {
                    console.log(error)
                });
        }
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        console.log(selectedPage, ">>>>>>>>>>>>>>>selectedPage")
        setPage(selectedPage + 1);
        getAllLeadslist(selectedPage + 1, perPage);

    };

    const SendToEdit = (item) => {
        setShowModal(true);
        setLeadDetails(item)
    }
    console.log(leaddetails, ">>>>>>>>>>>>>>>item")
    const getlistMakeMotor = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/getlistMakeMotor', requestOptions)
            .then(response => response.json())
            .then(data => {
                setMakeMotor(data.data);
            });
    }
    const getLineOfBuisness = () => {
        const requestOptions =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const lobdt = data.data;
                const lob_len = lobdt.length;

                setLob(lobdt);
            });
    }
    const getmodelmotor = () => {
        return (e) => {
            const make_motor = e.target.value;
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/modelmotor/${make_motor}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const modelmotordt = data.data;
                    const modelmotor_len = modelmotordt.length;
                    const modelmotor_list = [];
                    for (let i = 0; i < modelmotor_len; i++) {
                        const modelmotor_obj = { label: modelmotordt[i].motor_model_name, value: modelmotordt[i]._id };
                        modelmotor_list.push(modelmotor_obj);
                    }
                    setModelMotor(modelmotor_list);
                });
        }
    }

    const getmotormodel = () => {
        return (e) => {
            const modelmotor = e.target.value;
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/motormodel/${modelmotor}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const motormodeldt = data.data;
                    const motormodel_len = motormodeldt.length;
                    const motormodel_list = [];
                    for (let i = 0; i < motormodel_len; i++) {
                        const motormodel_obj = { label: motormodeldt[i].motor_model_detail_name, value: motormodeldt[i]._id };
                        motormodel_list.push(motormodel_obj);
                    }
                    setMotorModel(motormodel_list);
                });
        }
    }
    const startFrom = (page - 1) * perPage;






    return (
        <>
            <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <div className="card-header new_leads">
                            <strong>All Leads</strong>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr className="table-info">
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Nationality</th>
                                    <th scope="col">Phone No</th>
                                    <th scope="col">Line Of Business</th>
                                    <th scope="col">Business Type</th>
                                    <th scope="col">Policy Type</th>
                                    <th scope="col">Car Maker</th>
                                    <th scope="col">Car Model</th>
                                    <th scope="col">Car Varient</th>
                                    <th scope="col">Model Year</th>
                                    <th scope="col">Time Stamp</th>
                                    <th scope="col">Action</th>
                                    {/* <th scope="col">Payment Status</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    newleaddata?.length > 0 ?
                                        newleaddata.map((item, index) =>
                                            <tr key={index}>
                                                <td>{startFrom + index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.email}</td>
                                                <td>{item.nationality}</td>
                                                <td>{item.phoneno}</td>
                                                <td>{item.policy_type[0].line_of_business_name}</td>
                                                <td>{item.business_type}</td>
                                                <td>{item.polcy_type}</td>
                                                <td>{item.car_maker}</td>
                                                <td>{item.car_model}</td>
                                                <td>{item.car_variant}</td>
                                                <td>{item.model_year}</td>
                                                <td>{item.new_lead_timestamp.slice(0, 10)}</td>
                                                <td className='buttons_icons'>
                                                    <button className="btn btn-primary btn-sm" onClick={() => SendToEdit(item)}><i className="fa-solid fa-pencil"></i></button>
                                                </td>
                                                {/* <td>{item.paymentStatus}</td> */}
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
                        <section>
                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                breakLabel={"..."}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
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
            </Accordion>
            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Lead details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <div className="card-body">

                            <form action="/" method="POST"
                            // onSubmit={handleSubmit}
                            >
                                <div className="row">

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Name</label>
                                            <input required type="text" className="form-control" placeholder="Enter Plan Name" name="plan_name" autoComplete="off" defaultValue={leaddetails.name} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Email</label>
                                            <input required type="text" className="form-control" placeholder="Enter Plan Name" name="plan_name" autoComplete="off" defaultValue={leaddetails.email} />
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Phone No</label>
                                            <input required type="text" className="form-control" placeholder="Enter Plan Name" name="plan_name" autoComplete="off" defaultValue={leaddetails.phoneno} />
                                        </div>
                                    </div>


                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Plan Label</label>
                                            <input required type="text" className="form-control" placeholder="Enter Plan Label" name="plan_label" autoComplete="off" defaultValue={" "} />
                                        </div>
                                    </div>


                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Line Of Buisness</label>
                                            <select className="form-control" name="make_motor">
                                                <option value="">Select Line Of Buisness</option>
                                                {lob?.map((item, index) => (
                                                    <option key={index} value={item._id}>{item.line_of_business_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4" >
                                        <div className="form-group mb-3">
                                            <label>Buisness Type</label>
                                            <input required type="text" className="form-control" placeholder="Enter Plan Name" name="plan_name" autoComplete="off" defaultValue={" "} />
                                        </div>
                                    </div>
                                    <div className="col-md-4" >
                                        <div className="form-group mb-3">
                                            <label>Policy Type</label>
                                            <input required type="text" className="form-control" placeholder="Enter Plan Name" name="plan_name" autoComplete="off" defaultValue={" "} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Model Year</label>
                                            <input required type="text" name="car_value" className="form-control" placeholder="Enter Car Value" autoComplete="off" defaultValue={" "} />

                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Car Model</label>
                                            <select className="form-control" name="make_motor">
                                                <option value="">Select Car Model</option>
                                                {make_motor?.map((item, index) => (
                                                    <option key={index} value={item._id}>{item.make_motor_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Car Maker</label>
                                            <select className="form-control" name="make_motor" onChange={getmodelmotor()}>
                                                <option value="">Select Make Motor</option>
                                                {make_motor?.map((item, index) => (
                                                    <option key={index} value={item._id}>{item.make_motor_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Car Varient</label>
                                            <select className="form-control" name="make_motor">
                                                <option value="">Select Make Motor</option>
                                                {make_motor?.map((item, index) => (
                                                    <option key={index} value={item._id}>{item.make_motor_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Electric Vehicle</label>
                                            <select required className="form-control" name="electric_vehicle">
                                                <option value="0">Select</option>
                                                <option value="1" >Yes</option>
                                                <option value="0" >No</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Vehicle Specification</label>
                                            <input required type="text" name="min_premium" className="form-control" placeholder="Enter Vehicle Specification" autoComplete="off" defaultValue={""} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label>Payment Status</label>
                                            <input required type="text" name="min_premium" className="form-control" placeholder="Enter Vehicle Specification" autoComplete="off" defaultValue={""} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <button type="submit" className="btn btn-primary mt-2" style={{ float: "right" }}>Update</button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </Container>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default LeadsTable