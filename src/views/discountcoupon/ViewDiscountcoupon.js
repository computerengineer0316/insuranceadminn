import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import filePath from '../../webroot/sample-files/motor-make.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Multiselect from "multiselect-react-dropdown";
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ViewDiscountcoupon = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [excelfile, setExcelfile] = useState("");
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [dc_id, setDcId] = useState('');
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [masterpermission, setMasterPermission] = useState([]);
    const [nodata, setNodata] = useState('');
    const [lob, setLob] = useState([]);
    const [selectedlob, setSelectedlob] = useState([]);
    const [agent, setAgent] = useState([]);
    const [selectedagent, setSelectedAgent] = useState([]);
    const [description, setDescription] = useState('');
    const [discount, setDiscount] = useState('');
    const [startdate, setStartdate] = useState('');
    const [enddate, setEnddate] = useState('');
    const [editlob, setEditlob] = useState([]);
    const [editlocation, setEditlocation] = useState([]);
    const [editagent, setEditagent] = useState([]);
    const [agenteditlist, setAgenteditlist] = useState([]);



    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            lobList();
            locationList();
            getagentlist();
            getdiscountcoupon(page, perPage);
            const userdata = JSON.parse(localStorage.getItem('user'));
            const master_permission = userdata?.master_permission?.[0] || {};
            setMasterPermission(master_permission);
        }
    }, [])


    useEffect(() => {
        getagentlist();

    }, [selectedlob, selectedOption])

    useEffect(() => {
        geteditagentlist();

    }, [editlob, editlocation])



    const handleChange1 = (filterName, selectedValue) => {
        switch (filterName) {
            case 'location':
                setSelectedOption(selectedValue);
                break;
            case 'lob':
                setSelectedlob(selectedValue);
                break;
            default:
                break;
        }
        getagentlist();
    };

    const handleChange2 = (filterName, selectedValue) => {
        switch (filterName) {

            case 'editlob':
                setEditlob(selectedValue);
                break;
            case 'editlocation':
                setEditlocation(selectedValue);
                break;

            default:
                break;
        }
        geteditagentlist();
    };




    const getagentlist = async () => {
        console.log(selectedlob, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>selectedlob")
        console.log(selectedOption, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>selectedOption")

        const requestOptions = {
            method: 'post',
            body: JSON.stringify({ lobId: selectedlob.map((data) => data.value), locationId: selectedOption.map((data) => data.value) }),
            headers: {
                'Content-Type': 'application/json',
            },
        }
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getallagentlist`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    const agentdata = data.data;
                    console.log(agentdata, ">>>>>>>>>>>>>>>>>>")
                    const agent_list = agentdata.map((item) => ({ label: item.name, value: item._id }));
                    setAgent(agent_list);
                }
                else {
                    setAgent([]);
                }

            });
    }

    console.log(agent, ">>>>>>>>>>>>>>>>>>>>>>>>>>>")

    const geteditagentlist = async () => {
        console.log(editlob, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>editlob")
        console.log(editlocation, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>editlocation")

        const requestOptions = {
            method: 'post',
            body: JSON.stringify({ lobId: editlob.map((data) => data.value), locationId: editlocation.map((data) => data.value) }),
            headers: {
                'Content-Type': 'application/json',
            },
        }
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getallagentlist`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    const agentdata = data.data;
                    console.log(agentdata, ">>>>>>>>>>>>>>>>>>")
                    const agent_list = agentdata.map((item) => ({ label: item.name, value: item._id }));
                    setAgenteditlist(agent_list);
                }
                else {
                    setAgenteditlist([]);
                }

            });
    }





    const getdiscountcoupon = async (page, perPage) => {
        const requestOptions = {
            method: 'GET',
        }
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getdiscountcoupons?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNodata(data.message)
                const total = data.total;
                console.log(total, ">>>>>>>>>>>>>>>>>>>>>>>>")
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                console.log(list, ">>>>> list")
                setData(list);
            });
    }


    const lobList = () => {
        const userdata = JSON.parse(localStorage.getItem('user'));
        const lob = userdata.line_of_business;
        if (lob.length > 0) {
            const lobdt = lob;
            const lob_len = lobdt.length;
            const lob_list = [];
            for (let i = 0; i < lob_len; i++) {
                const lob_obj = { label: lobdt[i].lob_name, value: lobdt[i].lob_id };
                lob_list.push(lob_obj);
            }
            setLob(lob_list);
        }
        else {
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
                    const lob_list = [];
                    for (let i = 0; i < lob_len; i++) {
                        const lob_obj = { label: lobdt[i].line_of_business_name, value: lobdt[i]._id };
                        lob_list.push(lob_obj);
                    }
                    setLob(lob_list);
                });
        }
    }
    const [selectedStartDateTime, setSelectedStartDateTime] = useState(null);

    const handleStartDateChange = (date) => {
        setSelectedStartDateTime(date);
    };
    const [selectedEndDateTime, setSelectedEndDateTime] = useState(null);

    const handleEndDateChange = (date) => {
        setSelectedEndDateTime(date);
    };

    const locationList = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const locationdt = data.data;
                const location_len = locationdt.length;
                const location_list = [];
                for (let i = 0; i < location_len; i++) {
                    const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
                    location_list.push(location_obj);
                }
                setLocation(location_list);
            });
    }

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            const data = new FormData(e.target);
            const lob = selectedlob;
            const loc = selectedOption;
            const agent = selectedagent;
            const description = data.get('description');
            const discount = data.get('discount');
            const startdate = data.get('startdate');
            const enddate = data.get('enddate');



            if (lob.length == 0 || lob == [] || lob == undefined) {
                swal("Please select Line Of Business", "", "warning");
            }
            else if (loc.length == 0 || loc == [] || loc == undefined) {
                swal("Please select location", "", "warning");
            }
            else if (agent.length == 0 || agent == [] || agent == undefined) {
                swal("Please select agent", "", "warning");
            }
            else {
                console.log('ready to submit')
                // return false;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    body: JSON.stringify({

                        lob: lob.map((item) => item.value),
                        location: loc.map((item) => item.value),
                        agent: agent.map((item) => item.value),
                        description: description,
                        discount: discount,
                        startdate: startdate,
                        enddate: enddate,
                    })
                };
                fetch(`https://insuranceapi-3o5t.onrender.com/api/addDiscountcoupon`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status == 201) {
                            setShowModal(false);
                            swal({
                                text: data.message,
                                type: "success",
                                icon: "success",
                                button: false
                            })
                            getdiscountcoupon(page, perPage);
                            setTimeout(() => {
                                swal.close()
                            }, 1000);

                        }
                        else {
                            setShowModal(false);
                            swal({
                                text: data.message,
                                type: "error",
                                icon: "error",
                                button: false
                            })
                            getdiscountcoupon(page, perPage);
                            setTimeout(() => {
                                swal.close()
                            }, 1000);
                        }
                    });
            }
        } catch (error) {
            console.log(error)
        }

    }



    const UpdateStatus = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: status, id: id })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateDiscountcouponstatus`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getdiscountcoupon(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, "1000");
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false,
                    })
                    getdiscountcoupon(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, "1000");
                }
            });
    }

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_make_motor_excel ",
            {
                method: "post",
                body: fd,
            });
        result = await result.json();
        setVisible(!visible)
        console.log(result.success)
        if (result.success === true) {
            swal("Uploaded Succesfully", "", "success");
        } else {
            swal("Something went wrong", "", "failed");
        }
    }

    const discountcoupondetails = (id) => {
        setDcId(id);
        setSelectedlob([])
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch(`https://insuranceapi-3o5t.onrender.com/api/getdiscountcoupon?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const discount_coupon_details = data.data[0];
                console.log(discount_coupon_details, ">>>>>>>>>>>>>>>>>>")
                const lob = discount_coupon_details.lob;
                const lob_list = lob.map((item) => ({ label: item.line_of_business_name, value: item._id }));
                setSelectedlob(lob_list);
                setEditlob(lob_list);
                const location = discount_coupon_details.location;
                const location_list = location.map((item) => ({ label: item.location_name, value: item._id }));
                setSelectedOption(location_list);
                setEditlocation(location_list);
                const agent = discount_coupon_details.agent;
                const agent_list = agent.map((item) => ({ label: item.name, value: item._id }));
                setSelectedAgent(agent_list);
                setEditagent(agent_list);
                setDescription(discount_coupon_details.description);
                setDiscount(discount_coupon_details.discount);

                const date1 = new Date(discount_coupon_details?.startdate);
                setSelectedStartDateTime(date1)
                const date2 = new Date(discount_coupon_details?.enddate)
                setSelectedEndDateTime(date2);

                setVisibleedit(true);
            });
    };


    const [editlobs, setEditlobs] = useState([]);

    const handleChange = (selectedOption) => {
        setEditlobs(selectedOption);
    };





    const updateSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const lob = editlob;
        const loc = editlocation;
        const agent = editagent;
        const description = data.get('description');
        const discount = data.get('discount');
        const startdate = data.get('startdate');
        const enddate = data.get('enddate');

        console.log(lob, loc, agent, description, discount, startdate, enddate,)



        if (lob.length == 0 || lob == [] || lob == undefined) {
            swal("Please select Line of business", "", "warning");
        }
        else if (loc.length == 0 || loc == [] || loc == undefined) {
            swal("Please select location", "", "warning");
        }
        else if (agent.length == 0 || agent == [] || agent == undefined) {
            swal("Please select agent", "", "warning");
        }
        else {

            const requestOptions = {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lob: lob.map((item) => item.value),
                    location: loc.map((item) => item.value),
                    agent: agent.map((item) => item.value),
                    description: description,
                    discount: discount,
                    startdate: startdate,
                    enddate: enddate,

                })
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/updateDiscountcoupon?id=${dc_id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        setVisibleedit(false);
                        swal({
                            text: data.message,
                            icon: "success",
                            button: false,
                        })
                        getdiscountcoupon(page, perPage);
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                    else {
                        setVisibleedit(false);
                        swal({
                            title: "Error!",
                            text: data.message,
                            icon: "error",
                            button: false,
                        })
                        getdiscountcoupon(page, perPage);
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                });
        }
    }
    const Addbecommission = () => {
        setSelectedlob([])
        setShowModal(true);
    }
    const deleteItem = async (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteDiscountcoupon?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getdiscountcoupon(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false,
                    })
                    getdiscountcoupon(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }

    const startFrom = (page - 1) * perPage;



    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getdiscountcoupon(selectedPage + 1, perPage);
    };


    function formatDate(dateString) {
        const parts = dateString.split('-');

        if (parts.length === 3) {
            const [day, month, year] = parts;
            const isoDateString = `${year}-${month}-${day}`;

            // Check if the formatted string is a valid date
            if (!isNaN(new Date(isoDateString).getTime())) {
                return isoDateString;
            }
        }

        return ''; // Invalid date string
    }




    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="card-title">Discount Coupons</h4>
                                    </div>
                                    <div className="col-md-6">
                                        {masterpermission.discount_coupon?.includes('create') ?
                                            <button className='btn btn-primary' style={{ float: "right" }} onClick={() => Addbecommission()}>Add Discount Coupon</button>
                                            : ''}
                                    </div>

                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className=" text-primary">
                                            <tr>
                                                <th>#</th>
                                                <th>Code</th>
                                                <th>Description</th>
                                                <th>LOB</th>
                                                <th>Location</th>
                                                <th>Agent</th>
                                                <th>Discount Amount</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data && data.length > 0 ?
                                                <>
                                                    {
                                                        data?.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{startFrom + index + 1}</td>
                                                                <td>{item.code}</td>
                                                                <td>{item.description}</td>
                                                                <td>{item.lob?.map((data) => data.line_of_business_name).join(", ")}</td>
                                                                <td>{item.location?.map((data) => data.location_name).join(", ")}</td>
                                                                <td>{item.agent?.map((data) => data.name).join(", ")}</td>
                                                                <td>{item.discount}</td>
                                                                <td>{item.startdate?.slice(0, 10)}</td>
                                                                <td>{item.enddate?.slice(0, 10)}</td>
                                                                <td>
                                                                    {masterpermission.discount_coupon?.includes('edit') && (
                                                                        <button className="btn btn-primary" onClick={() => discountcoupondetails(item._id)}>Edit</button>
                                                                    )}
                                                                    {' '}
                                                                    {masterpermission.discount_coupon?.includes('delete') && (
                                                                        <>
                                                                            {item.status === true ? (
                                                                                <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) UpdateStatus(item._id, false); }}>Deactivate</button>
                                                                            ) : (
                                                                                <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) UpdateStatus(item._id, true); }}>Activate</button>
                                                                            )}
                                                                            <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                                        </>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </>
                                                :
                                                <tr><td colSpan="17" style={{ textAlign: 'center' }}><strong>{nodata}</strong></td></tr>
                                            }
                                        </tbody>
                                    </table>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Upload Excel File</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div >
                        <input type="file" className="form-control" id="DHA" defaultValue="" required
                            onChange={(e) => setExcelfile(e.target.files[0])} />
                    </div>

                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Close
                    </CButton>
                    <CButton color="primary" onClick={collectExceldata} href={'/motor-make'}>Upload</CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Discount Coupon</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={handleSubmit}>
                                            <div className="row">

                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label className="form-label"><strong>Select Line Of Business</strong></label>
                                                        <Multiselect
                                                            options={lob}
                                                            displayValue="label"
                                                            onSelect={(selectedValue) => handleChange1('lob', selectedValue)}
                                                            onRemove={(selectedValue) => handleChange1('lob', selectedValue)}
                                                            placeholder="Select line of business"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>

                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label className="form-label"><strong>Select Location</strong></label>
                                                        {/* <select
                                                            className='form-control'
                                                            name='loc'
                                                            required
                                                        >
                                                            <option value="" hidden>Select Location</option>
                                                            {
                                                                location?.map((item, index) => (
                                                                    <option key={index} value={item.value}>{item.label}</option>
                                                                ))
                                                            }
                                                        </select> */}
                                                        <Multiselect
                                                            options={location}
                                                            displayValue="label"
                                                            onSelect={(selectedValue) => handleChange1('location', selectedValue)}
                                                            onRemove={(selectedValue) => handleChange1('location', selectedValue)}
                                                            placeholder="Select Location"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />

                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label className="form-label"><strong>Select Agent</strong></label>
                                                        <Multiselect
                                                            options={agent}
                                                            displayValue="label"
                                                            onSelect={setSelectedAgent}
                                                            onRemove={setSelectedAgent}
                                                            placeholder="Select Agent"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>



                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label className="form-label"><strong>Discount Amount</strong></label>
                                                        <input type="text" className="form-control" name="discount" placeholder="Discount" autoComplete="off" required />
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label"><strong>Start Date</strong></label>
                                                    <div className="form-group">
                                                        {/* <input type="date" className="form-control" name="startdate" required /> */}
                                                        <DatePicker
                                                            name='startdate'
                                                            selected={selectedStartDateTime}
                                                            onChange={handleStartDateChange}
                                                            className='form-control'
                                                            showTimeSelect
                                                            timeFormat="HH:mm"
                                                            timeIntervals={10}
                                                            timeCaption="Time"
                                                            dateFormat="MMMM d, yyyy h:mm aa"
                                                            placeholderText="Select Date and Time"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label"><strong>End Date</strong></label>
                                                    <div className="form-group">
                                                        {/* <input type="date" className="form-control" name="enddate" required /> */}
                                                        <DatePicker
                                                            selected={selectedEndDateTime}
                                                            onChange={handleEndDateChange}
                                                            className='form-control'
                                                            name='enddate'
                                                            showTimeSelect
                                                            timeFormat="HH:mm"
                                                            timeIntervals={10}
                                                            timeCaption="Time"
                                                            dateFormat="MMMM d, yyyy h:mm aa"
                                                            placeholderText="Select Date and Time"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label className="form-label"><strong>Description</strong></label>
                                                        <textarea
                                                            className="form-control"
                                                            name="description"
                                                            placeholder="Description"
                                                            autoComplete="off"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Submit</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Discount Coupon</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={updateSubmit}>

                                            <div className="row">

                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label className="form-label"><strong>Select Line Of Business</strong></label>
                                                        <Multiselect
                                                            options={lob}
                                                            displayValue="label"
                                                            selectedValues={selectedlob}
                                                            onSelect={(selectedValue) => handleChange2('editlob', selectedValue)}
                                                            onRemove={(selectedValue) => handleChange2('editlob', selectedValue)}
                                                            placeholder="Select line of business"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>

                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label className="form-label"><strong>Select Location</strong></label>
                                                        {/* <select
                                                            className='form-control'
                                                            name='loc'
                                                            required
                                                        >
                                                            <option value="" hidden>Select Location</option>
                                                            {
                                                                location?.map((item, index) => (
                                                                    <option key={index} value={item.value}>{item.label}</option>
                                                                ))
                                                            }
                                                        </select> */}
                                                        <Multiselect
                                                            options={location}
                                                            displayValue="label"
                                                            selectedValues={selectedOption}
                                                            onSelect={(selectedValue) => handleChange2('editlocation', selectedValue)}
                                                            onRemove={(selectedValue) => handleChange2('editlocation', selectedValue)}
                                                            placeholder="Select Location"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />

                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label className="form-label"><strong>Select Agent</strong></label>
                                                        <Multiselect
                                                            options={agenteditlist}
                                                            displayValue="label"
                                                            selectedValues={selectedagent}
                                                            onSelect={setEditagent}
                                                            onRemove={setEditagent}
                                                            placeholder="Select Agent"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label className="form-label"><strong>Discount Amount</strong></label>
                                                        <input type="text" className="form-control" name="discount" placeholder="discount" autoComplete="off" defaultValue={discount} required />
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label"><strong>Start Date</strong></label>
                                                    <div className="form-group">
                                                        {/* <input type="date" className="form-control" name="startdate" defaultValue={startdate.split('T')[0]} required /> */}
                                                        <DatePicker
                                                            name='startdate'
                                                            selected={selectedStartDateTime}
                                                            onChange={handleStartDateChange}
                                                            className='form-control'
                                                            showTimeSelect
                                                            timeFormat="HH:mm"
                                                            timeIntervals={10}
                                                            timeCaption="Time"
                                                            dateFormat="MMMM d, yyyy h:mm aa"
                                                            placeholderText="Select Date and Time"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label"><strong>End Date</strong></label>
                                                    <div className="form-group">
                                                        {/* <input type="date" className="form-control" name="enddate" defaultValue={enddate.split('T')[0]} required /> */}
                                                        <DatePicker
                                                            selected={selectedEndDateTime}
                                                            onChange={handleEndDateChange}
                                                            className='form-control'
                                                            name='enddate'
                                                            showTimeSelect
                                                            timeFormat="HH:mm"
                                                            timeIntervals={10}
                                                            timeCaption="Time"
                                                            dateFormat="MMMM d, yyyy h:mm aa"
                                                            placeholderText="Select Date and Time"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label className="form-label"><strong>Description</strong></label>
                                                        <textarea
                                                            className="form-control"
                                                            name="description"
                                                            placeholder="Description"
                                                            autoComplete="off"
                                                            required
                                                            defaultValue={description}
                                                        />
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Update</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setVisibleedit(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default ViewDiscountcoupon;
