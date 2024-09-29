import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import filePath from '../../webroot/sample-files/location.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const Location = () => {

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [excelfile, setExcelfile] = useState("");
    const [locationid, setLocationid] = useState("");
    const [locationname, setLocationname] = useState("");
    const [locationstatus, setLocationstatus] = useState("");
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [masterpermission, setMasterpermission] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            locationList(page, perPage);
            const userdata = JSON.parse(localStorage.getItem('user'));
            const master_permission = userdata?.master_permission?.[0] || {};
            setMasterpermission(master_permission);
        }
    }, [])

    const locationList = (page, perPage) => {
        setData([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_locations/${page}/${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                setData(data.data);
            });
    }

    const fileType = 'xlsx'
    const exporttocsv = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "location" + ".xlsx")
    }

    const deleteLocation = (id, status) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/delete_location/${id}/${status}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "Ok",
                    }).then(() => {
                        locationList();
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "Ok",
                    }).then(() => {
                        locationList();
                    });
                }
            });
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        locationList(selectedPage + 1, perPage);
    };


    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_location_excel ",
            {
                method: "post",
                body: fd,
            });
        result = await result.json();
        setVisible(!visible)
        swal("Uploaded Succesfully", "", "success");
        locationList(page, perPage);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const location_name = data.get('location_name');
        const location_status = data.get('location_status');
        const locationdata = { location_name, location_status };
        const response = await axios.post('https://insuranceapi-3o5t.onrender.com/api/add_location', locationdata);
        if (response.data.status === 200) {
            setShowModal(false);
            swal({
                title: "Success!",
                text: response.data.message,
                icon: "success",
                button: "OK",
            }).then(function () {
                locationList(page, perPage);
            });
        }
        else {
            setShowModal(false);
            swal({
                title: "Error!",
                text: response.data.message,
                icon: "error",
                button: "OK",
            }).then(function () {
                locationList(page, perPage);
            });
        }
    }

    const LocationDetails = (id) => {
        setLocationid(id);
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location_by_id/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                const locationdt = data.data;
                setLocationname(locationdt.location_name);
                setLocationstatus(locationdt.location_status);
                setVisibleedit(true);
            });
    }

    const updateSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const location_name = data.get("location_name");
        const location_status = data.get("status");
        const locationdata = { location_name: location_name, location_status: location_status, location_id: locationid };
        const response = await axios.post(`https://insuranceapi-3o5t.onrender.com/api/update_location`, locationdata);
        if (response.data.status == 200) {
            setVisibleedit(false);
            swal({
                title: "Success",
                text: response.data.message,
                icon: "success",
                button: "OK",
            }).then(() => {
                locationList(page, perPage);
            });
        }
        else {
            setVisibleedit(false);
            swal({
                title: "Error",
                text: response.data.message,
                icon: "error",
                button: "OK",
            }).then(() => {
                locationList(page, perPage);
            });
        }
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
                                        <h4 className="card-title">Location</h4>
                                    </div>
                                    <div className="col-md-6">
                                        {masterpermission.location?.includes('create') ?
                                            <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add Location</button>
                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="card-header" style={{ textAlign: 'right' }}>
                                {masterpermission.location?.includes('download') ?
                                    <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                                    : ''}
                                {masterpermission.location?.includes('upload') ?
                                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                                    : ''}
                                {masterpermission.location?.includes('export') ?
                                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                                    : ''}
                            </div>

                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className=" text-primary">
                                            <tr>
                                                <th>#</th>
                                                <th>Location</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (data.length > 0) ?
                                                    data.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                {item.location_name}
                                                            </td>
                                                            <td>
                                                                {item.location_status === 1 ? 'Active' : 'Inactive'}
                                                            </td>
                                                            <td>
                                                                {masterpermission.location?.includes('edit') && (
                                                                    <button className="btn btn-primary" onClick={() => { LocationDetails(item._id); }}>Edit</button>
                                                                )}
                                                                {' '}
                                                                {masterpermission.location?.includes('delete') && (
                                                                    <>
                                                                        {
                                                                            item.location_status === 1 ?
                                                                                <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deleteLocation(item._id, 0) }}>Deactivate</button> :
                                                                                <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deleteLocation(item._id, 1) }}>Activate</button>
                                                                        }
                                                                    </>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )) : <tr><td colSpan="5" style={{ textAlign: "center" }}>No Data Found</td></tr>
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
                    <div>
                        <input type="file" className="form-control" id="DHA" defaultValue="" required
                            onChange={(e) => setExcelfile(e.target.files[0])} />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                    <CButton color="primary" onClick={collectExceldata} href={'/Viewtraveltype'}>Upload</CButton>
                </CModalFooter>
            </CModal>
            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Location</Modal.Title>
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
                                                        <label className="form-label">Location Name</label>
                                                        <input type="text" className="form-control" placeholder="Location Name" name="location_name" autoComplete="off" required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Status</label>
                                                        <select className="form-control" name="location_status" required>
                                                            <option value="">Select Status</option>
                                                            <option value="1">Active</option>
                                                            <option value="0">Inactive</option>
                                                        </select>
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Location</Modal.Title>
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
                                                        <label className="form-label">Location Name</label>
                                                        <input type="text" className="form-control" name="location_name" placeholder="Location Name" defaultValue={locationname} autoComplete="off" required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Status</label>
                                                        <select className="form-control" name="status" required>
                                                            <option value="">Select Status</option>
                                                            <option value="1" selected={locationstatus == 1 ? true : false}>Active</option>
                                                            <option value="0" selected={locationstatus == 0 ? true : false}>Inactive</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Update</button>
                                                    </div>
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
                    <Button variant="secondary" onClick={() => setVisibleedit(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Location
