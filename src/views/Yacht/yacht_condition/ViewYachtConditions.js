import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import filePath from '../../../webroot/sample-files/yacht-condition-sample-sheet.xlsx';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';

const ViewYachtConditions = () => {
    const navigate = useNavigate();
    const [excelfile, setExcelfile] = useState("");
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [yachtcondition, setYachtCondition] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editshowModal, setEditShowModal] = useState(false);
    const [yachtconditionid, setYachtconditionid] = useState('');
    const [yacht_condition_label, setYacht_condition_label] = useState('');
    const [home_condition_description, sethome_condition_description] = useState('');
    const [home_condition_status, sethome_condition_status] = useState('');
    const [yachtpermission, setYachtpermission] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            gethomecondition(page, perPage);
            const userdata = JSON.parse(localStorage.getItem('user'));
            const yacht_permission = userdata?.yacht_permission?.[0] || {};
            setYachtpermission(yacht_permission);
        }
    }, []);

    const gethomecondition = async (page, perPage) => {
        setYachtCondition([]);
        const requestOptions =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_yacht_condition/${page}/${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                setYachtCondition(data.data);
            });
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        gethomecondition(selectedPage + 1, perPage);
    };

    const updatestatus = async (id, yacht_condition_status) => {
        let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_yacht_condition_status', {
            method: 'post',
            body: JSON.stringify({ id, yacht_condition_status }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        result = await result.json();
        swal("Updated Succesfully", "", "success");
        gethomecondition(page, perPage)
    }

    const addhomecondition = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const yacht_condition_label = formData.get('condition_label');
        const yacht_condition_description = formData.get('condition_description');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ yacht_condition_label, yacht_condition_description }),
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/add_yacht_condition`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    setShowModal(false);
                    swal({
                        title: "Success!",
                        text: data.message,
                        type: "success",
                        icon: "success"
                    }).then(function () {
                        gethomecondition(page, perPage);
                    });
                }
                else {
                    setShowModal(false);
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error"
                    }).then(function () {
                        gethomecondition(page, perPage);
                    });
                }
            });
    }

    const updateSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const yacht_condition_label = formData.get('condition_label');
        const yacht_condition_description = formData.get('condition_description');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ yacht_condition_label, yacht_condition_description, yachtconditionid }),
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_yacht_condition`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    setEditShowModal(false);
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "Ok",
                    }).then(() => {
                        gethomecondition(page, perPage);
                    });
                }
                else {
                    setEditShowModal(false);
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "Ok",
                    }).then(() => {
                        gethomecondition(page, perPage);
                    });
                }
            });
    }

    const fileType = 'xlsx'
    const exporttocsv = () => {
        const ws = XLSX.utils.json_to_sheet(yachtcondition);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "Yacht-Conditions" + ".xlsx")
    }

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_yacht_condition_excel",
            {
                method: "POST",
                body: fd,
            });
        result = await result.json();
        setVisible(!visible)
        swal("Uploaded Succesfully", "", "success");
        gethomecondition(page, perPage)
    }

    const detailsbyid = async (ParamValue) => {
        setYachtconditionid(ParamValue)
        const requestOptions = {
            method: "post",
            body: JSON.stringify({ ParamValue }),
            headers: {
                "Content-Type": "application/json",
            },
        };

        let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_yacht_conditionbyid`, requestOptions);
        result = await result.json();
        setYacht_condition_label(result.data.yacht_condition_label);
        sethome_condition_description(result.data.yacht_condition_description);
        sethome_condition_status(result.data.yacht_condition_status);
        setEditShowModal(true);
    };

    const startFrom = (page - 1) * perPage;

    const AddyachtConditions = () => {
        navigate("/AddYachtConditions")
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card ">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Yacht Conditions</h4>
                                </div>
                                <div className="col-md-6">
                                    {yachtpermission.yacht_condition?.includes('create') ?
                                        <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add Yacht Condition</button>
                                        : ''}
                                </div>
                            </div>
                        </div>
                        <div className="card-header" style={{ textAlign: 'right' }}>
                            {yachtpermission.yacht_condition?.includes('download') ?
                                <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                                : ''}
                            {yachtpermission.yacht_condition?.includes('upload') ?
                                <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                                : ''}
                            {yachtpermission.yacht_condition?.includes('export') ?
                                <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                                : ''}
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th><strong>#</strong></th>
                                        <th><strong>Condition</strong></th>
                                        <th><strong>Description</strong></th>
                                        <th><strong>Status</strong></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {yachtcondition?.length > 0 ?
                                        yachtcondition?.map((item, index) =>
                                            <tr key={index}>
                                                <td>{startFrom + index + 1}</td>
                                                <td>{item.yacht_condition_label}</td>
                                                {/* <td>{item.yacht_condition_description == 1 ? "Yes" : "No"}</td> */}
                                                <td>
                                                    {yachtpermission.yacht_condition?.includes('edit') && (
                                                        <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>
                                                    )}
                                                    {' '}
                                                    {yachtpermission.yacht_condition?.includes('delete') && (
                                                        <>
                                                            {
                                                                item.yacht_condition_status === 1 ?
                                                                    <button className="btn btn-danger mr-5" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                                                    <button className="btn btn-success mr-5" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                                                            }
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ) : <tr>
                                            <td colSpan="4">No Data Found</td>
                                        </tr>
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

            <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Upload Excel File</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <input type="file" className="form-control" onChange={(e) => setExcelfile(e.target.files[0])} required />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                    <CButton color="primary" onClick={collectExceldata}>Upload</CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Yacht Condition</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="POST" onSubmit={addhomecondition}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Condition Label</strong></label>
                                                        <input type='text' className="form-control" name='condition_label' placeholder="Enter Condition Label" autoComplete='off' required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Condition Description</strong></label>
                                                        <select className="form-control" name="condition_description" required>
                                                            <option value="" hidden>Select Condition Description</option>
                                                            <option value="1">Yes</option>
                                                            <option value="0">No</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary submit_all" style={{ float: "right" }}>Submit</button>
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

            <Modal size='lg' show={editshowModal} onHide={() => setEditShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Home Condition</Modal.Title>
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
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Condition Label</strong></label>
                                                        <input type='text' className="form-control" name='condition_label' placeholder='Enter Condition Label' defaultValue={yacht_condition_label} autoComplete='off' required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label"><strong>Condition Description</strong></label>
                                                        <select className="form-control" name="condition_description" required>
                                                            <option value="">Select Condition Description</option>
                                                            <option value="1" selected={home_condition_description == 1 ? true : false}>Yes</option>
                                                            <option value="0" selected={home_condition_description == 0 ? true : false}>No</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary submit_all" style={{ float: "right" }}>Update</button>
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
                    <Button variant="secondary" onClick={() => setEditShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default ViewYachtConditions
