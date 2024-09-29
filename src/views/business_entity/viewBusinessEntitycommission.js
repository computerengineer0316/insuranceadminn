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

const ViewBusinessEntitycommission = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(20);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [be_id, setBeId] = useState('');
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [masterpermission, setMasterPermission] = useState([]);
    const [nodata, setNodata] = useState('');
    const [lob, setLob] = useState([]);
    const [selectedlob, setSelectedlob] = useState();
    const [be_description, setBeDescription] = useState('');
    const [be_rate, setBeRate] = useState('');


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getlistBecommission(page, perPage);
            lobList();
            locationList();
            const userdata = JSON.parse(localStorage.getItem('user'));
            const master_permission = userdata?.master_permission?.[0] || {};
            setMasterPermission(master_permission);
        }
    }, [])

    // useEffect(() => {
    //     getlistBecommission(page, perPage);
    // }, [searchvalue, statusvalue])

    const getlistBecommission = (page, perPage) => {

        setData([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getAllBusinessEntityComissions?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                // console.log("data???????????????????????????????????????????",data.data)
                setNodata(data.message)
                const total = data.count;
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
                    if (locationdt[i].location_name != 'Head Office') {
                        const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
                        location_list.push(location_obj);
                    }
                }
                setLocation(location_list);
                setSelectedOption(location_list);
            });
    }

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            const data = new FormData(e.target);
            const description = data.get('description');
            const lob = data.get('lob');
            const rate = data.get('rate');
            const location = selectedOption;
            const splitRate = rate.includes(",") ?
                rate.split(",") : [rate];

            console.log(location.length, " : ", splitRate.length)

            if (location.length == 0 || location == [] || location == undefined) {
                swal("Please select location", "", "warning");
            }
            else if (location.length != splitRate.length) {
                swal("rate must be equal to Locations selected", "", "warning");
            } else {
                console.log('ready to submit')
                // return false;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        desciption: description,
                        rate: rate,
                        lob: lob,
                        location_rate: location?.map((item) => ({ id: item.value, location_name: item.label }))
                    })
                };
                fetch(`https://insuranceapi-3o5t.onrender.com/api/addBusinessEntityComission`, requestOptions)
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
                            getlistBecommission(page, perPage);
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
                            getlistBecommission(page, perPage);
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

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getlistBecommission(selectedPage + 1, perPage);
    };

    const UpdateStatus = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ be_status: status, id: id })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/UpdateBusinessEntityComissionStatus`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getlistBecommission(page, perPage);
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
                    getlistBecommission(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, "1000");
                }
            });
    }


    const becommissiondetails = (id) => {
        setBeId(id);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch(`https://insuranceapi-3o5t.onrender.com/api/getSingleBusinessEntityComission?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const be_commission_details = data.data;
                console.log(be_commission_details, ">>>>>>>>>>>>>>>>>>")
                // Populate the input fields with data from the API response
                setBeDescription(be_commission_details.desciption);
                setBeRate(be_commission_details.rate);

                const location_id = be_commission_details.location_rate.map(data => ({
                    label: data.location_name,
                    value: data.location_id,
                }));
                setSelectedOption(location_id);
                setEditlocation(location_id);

                // const lob_id = be_commission_details.lobDetails.map(data => ({
                //   label: data.line_of_business_name,
                //   value: data._id,
                // }));
                setSelectedlob(be_commission_details.lob);


                // Now, set the visibleedit state to true
                setVisibleedit(true);
            });
    };

    const [editlocation, setEditlocation] = useState([]);

    const handleChange = (selectedOption) => {
        setEditlocation(selectedOption);
    };



    const updateSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const be_desc = data.get('be_desc');
        const be_rate = data.get('be_rate');
        const lob = data.get('lob');

        const locationdata = editlocation;

        const splitRate = be_rate.includes(",") ?
            be_rate.split(",") : [be_rate];
        console.log(locationdata.length, " : ", splitRate.length)
        if (locationdata.length == 0 || locationdata == [] || locationdata == undefined) {
            swal("Please select location", "", "warning");
        }
        else if (splitRate.length != locationdata.length) {
            swal("rate must be equal to Locations selected", "", "warning");
        } else {

            const requestOptions = {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    desciption: be_desc,
                    rate: be_rate,
                    location_rate: locationdata?.map((item) => ({ id: item.value, location_name: item.label })),
                    lob: lob,

                })
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/UpdateBusinessEntityComission?id=${be_id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        setVisibleedit(false);
                        swal({
                            text: data.message,
                            icon: "success",
                            button: false,
                        })
                        getlistBecommission(page, perPage);
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
                        getlistBecommission(page, perPage);
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }
                });
        }
    }
    const Addbecommission = () => {
        locationList()
        setShowModal(true);
    }
    const deleteItem = async (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMasterData?id=${id}&type=becommission`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getlistBecommission(page, perPage);
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
                    getlistBecommission(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }

    const startFrom = (page - 1) * perPage;


    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="card-title">BE Commission</h4>
                                    </div>
                                    <div className="col-md-6">
                                        {masterpermission.be_commission?.includes('create') ?
                                            <button className='btn btn-primary' style={{ float: "right" }} onClick={() => Addbecommission()}>Add BE Commission</button>
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
                                                <th>LOB</th>
                                                <th>Description</th>
                                                <th>Location</th>
                                                <th>Rate</th>
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
                                                                <td>{item.lobDetails?.map((data) => data.line_of_business_name).join(", ")}</td>
                                                                <td>{item.desciption}</td>
                                                                <td>{item.location_rate?.map((data) => data.location_name).join(", ")}</td>
                                                                <td>{item.rate}</td>
                                                                <td>
                                                                    {masterpermission.be_commission?.includes('edit') && (
                                                                        <button className="btn btn-primary" onClick={() => becommissiondetails(item._id)}>Edit</button>
                                                                    )}
                                                                    {' '}
                                                                    {masterpermission.be_commission?.includes('delete') && (
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

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add BE Commission</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Select Line Of Business</label>

                                                        <select
                                                            className='form-control'
                                                            name='lob'
                                                            required
                                                        >
                                                            <option value="">Select Line Of Buisness</option>
                                                            {
                                                                lob?.map((item, index) => (
                                                                    <option key={index} value={item.value}>{item.label}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Description</label>
                                                        <input type="text" className="form-control" name="description" placeholder="Description" autoComplete="off" required />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Location</label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={location}
                                                            displayValue="label"
                                                            onSelect={setSelectedOption}
                                                            onRemove={setSelectedOption}
                                                            placeholder="Select Location"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>

                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Rate(%)</label>
                                                        <input type="text" className="form-control" name="rate" placeholder="Rate" autoComplete="off" required />
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Line Of Business</label>
                                                        <Multiselect
                                                            options={lob}
                                                            // selectedValues={selectedlob}
                                                            displayValue="label"
                                                            onSelect={setSelectedlob}
                                                            onRemove={setSelectedlob}
                                                            placeholder="Select line of business"
                                                            showArrow={true}
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
                                                </div> */}
                                            </div>
                                            {/* <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                    <label className="form-label">Status</label>
                                                        <select className="form-control" name="status" required>
                                                            <option value="">Select Status</option>
                                                            <option value="1">Active</option>
                                                            <option value="0">Inactive</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div> */}
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
                    <Modal.Title>Edit BE Commission</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={updateSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">

                                                        <label className="form-label">Line Of Business</label>
                                                        <select
                                                            className='form-control'
                                                            name='lob'
                                                            required
                                                        >
                                                            <option value="">Select Line Of Buisness</option>
                                                            {
                                                                lob?.map((item, index) => (
                                                                    <option key={index} selected={item.value == selectedlob ? true : false} value={item.value}>{item.label}</option>
                                                                ))
                                                            }
                                                        </select>


                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Description</label>
                                                        <input type="text" className="form-control" name="be_desc" placeholder="Description" defaultValue={be_description} autoComplete="off" required />


                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Location</label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={selectedOption}
                                                            displayValue="label"
                                                            onSelect={handleChange}
                                                            onRemove={handleChange}
                                                            placeholder="Select Location"
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Rate(%)</label>
                                                        <input type="text" className="form-control" name="be_rate" placeholder="Rate" defaultValue={be_rate} autoComplete="off" required />
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

export default ViewBusinessEntitycommission;
