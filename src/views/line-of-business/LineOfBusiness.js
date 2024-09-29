import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import filePath from '../../webroot/sample-files/line-of-bussiness.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Multiselect from "multiselect-react-dropdown";
import { Modal, Button } from 'react-bootstrap';
import { Loader } from "rsuite";

const LineOfBusiness = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [excelfile, setExcelfile] = useState("");
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [line_of_business_name, setLineOfBusinessName] = useState("");
    const [line_of_business_status, setLineOfBusinessStatus] = useState("");
    const [line_of_business_id, setLineOfBusinessId] = useState("");
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [masterpermission, setMasterpermission] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getlistLineOfBusiness(page, perPage);
            locationList();
            const userdata = JSON.parse(localStorage.getItem('user'));
            const master_permission = userdata?.master_permission?.[0] || {};
            setMasterpermission(master_permission);
        }
    }, []);

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
                handleChange(location_list);
            });
    }

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const getlistLineOfBusiness = (page, perPage) => {
        setLoading(true);
        setData([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);

                setPageCount(pages);
                const list = data.data;

                setData(list);
            });
    }

    const fileType = 'xlsx'
    const exporttocsv = () => {
        console.log(data)
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "LineOfBusiness" + ".xlsx")
    }

    const deleteLineOfBusiness = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/delete_line_of_business/${id}/${status}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "Ok",
                    }).then(() => {
                        getlistLineOfBusiness(page, perPage);
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "Ok",
                    }).then(() => {
                        getlistLineOfBusiness(page, perPage);
                    });
                }
            });
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getlistLineOfBusiness(selectedPage + 1, perPage);
    };

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        await fetch("https://insuranceapi-3o5t.onrender.com/api/read_line_of_business_excel ",
            {
                method: "post",
                body: fd,
            })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    setVisible(!visible)
                    swal({
                        title: "Wow!",
                        text: data.message,
                        type: "success",
                        icon: "success"
                    }).then(function () {
                        getlistLineOfBusiness(page, perPage)
                    });
                } else {
                    setVisible(!visible)
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error"
                    }).then(function () {
                        getlistLineOfBusiness(page, perPage)

                    });
                }
            });

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const line_of_business_name = data.get('line_of_business_name');
        const line_of_business_location = selectedOption;
        const line_of_business_location_len = line_of_business_location.length;
        const line_of_business_location_str = [];
        for (let i = 0; i < line_of_business_location_len; i++) {
            line_of_business_location_str.push(line_of_business_location[i].value);
        }


        console.log(line_of_business_location_str);
        // return false;



        if (line_of_business_location_str.length == 0) {
            swal({
                title: "Error!",
                text: "Please select location",
                type: "error",
                icon: "error"
            })
        } else {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    line_of_business_name: line_of_business_name,
                    line_of_business_location: line_of_business_location_str,
                    // line_of_business_status: line_of_business_status
                })
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/add_line_of_business`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status == 200) {
                        setShowModal(false);
                        swal({
                            title: "Wow!",
                            text: data.message,
                            type: "success",
                            icon: "success"
                        }).then(function () {
                            getlistLineOfBusiness(page, perPage);
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
                            getlistLineOfBusiness(page, perPage);
                        });
                    }
                });
        }
    }

    const LineOfBusinessDetails = (id) => {
        setLineOfBusinessId(id);
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_by_id/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                const line_of_business = data.data;
                setLineOfBusinessName(line_of_business[0].line_of_business_name);
                const locationid = line_of_business[0].lob_location;
                const location_name_arr_obj = [];
                for (let i = 0; i < locationid.length; i++) {
                    const location_name_arr_obj_obj = { label: locationid[i].location_name, value: locationid[i]._id };
                    location_name_arr_obj.push(location_name_arr_obj_obj);
                }
                setSelectedOption(location_name_arr_obj);
                setLineOfBusinessStatus(line_of_business.line_of_business_status);
                setVisibleedit(true);
            });
    }

    const updateSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const line_of_business_name = data.get("line_of_business_name");
        const line_of_business_location = selectedOption;
        const line_of_business_location_len = line_of_business_location.length;
        const line_of_business_location_str = [];
        for (let i = 0; i < line_of_business_location_len; i++) {
            line_of_business_location_str.push(line_of_business_location[i].value);
        }
        // const line_of_business_status = data.get("status");
        if (line_of_business_location_str.length == 0) {
            swal({
                title: "Error!",
                text: "Please select location",
                type: "error",
                icon: "error"
            })
        } else {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    line_of_business_name: line_of_business_name,
                    line_of_business_location: line_of_business_location_str,
                    line_of_business_id: line_of_business_id,
                }),
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/update_line_of_business`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        setVisibleedit(false);
                        swal({
                            title: "Wow!",
                            text: data.message,
                            type: "success",
                            icon: "success"
                        }).then(function () {
                            getlistLineOfBusiness(page, perPage);
                        });
                    }
                    else {
                        setVisibleedit(false);
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error"
                        }).then(function () {
                            getlistLineOfBusiness(page, perPage);
                        });
                    }
                });
        }
    };

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
                                        <h4 className="card-title"> Line Of Business</h4>
                                    </div>
                                    <div className="col-md-6">
                                        {masterpermission.line_of_business?.includes('create') ?
                                            <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add Line Of Business</button>
                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="card-header" style={{ textAlign: 'right' }}>
                                {masterpermission.line_of_business?.includes('download') ?
                                    <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                                    : ''}
                                {masterpermission.line_of_business?.includes('upload') ?
                                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                                    : ''}
                                {masterpermission.line_of_business?.includes('export') ?
                                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                                    : ''}
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className=" text-primary">
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Location</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (data.length > 0) ?
                                                    data.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{startFrom + index + 1}</td>
                                                            <td>
                                                                {item.line_of_business_name}
                                                            </td>
                                                            <td>
                                                                {item.line_of_business_location?.map((item) => item.location_name).join(', ')}
                                                            </td>
                                                            <td>
                                                                {masterpermission.line_of_business?.includes('edit') && (
                                                                    <button className="btn btn-primary" onClick={() => { LineOfBusinessDetails(item._id); }}>Edit</button>
                                                                )}
                                                                {' '}
                                                                {masterpermission.line_of_business?.includes('delete') && (
                                                                    <>
                                                                        {
                                                                            item.line_of_business_status === 1 ?
                                                                                <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deleteLineOfBusiness(item._id, 0) }}>Deactivate</button> :
                                                                                <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deleteLineOfBusiness(item._id, 1) }}>Activate</button>
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
                    <div >
                        <input type="file" className="form-control" id="DHA" defaultValue="" required onChange={(e) => setExcelfile(e.target.files[0])} />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Close
                    </CButton>
                    <CButton color="primary" onClick={collectExceldata} href={'/Viewtraveltype'}>Upload</CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Line Of Business</Modal.Title>
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
                                                        <label className="form-label">Line Of Business Name</label>
                                                        <input type="text" className="form-control" name="line_of_business_name" placeholder="Line Of Business Name" autoComplete="off" required />
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
                                                            showCheckbox={true}
                                                            required
                                                        />
                                                    </div>
                                                </div>
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Body Type</Modal.Title>
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
                                                        <label>Line Of Business Name</label>
                                                        <input type="text" className="form-control" name="line_of_business_name" defaultValue={line_of_business_name} autoComplete="off" required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Line Of Business Location</label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={selectedOption}
                                                            onSelect={handleChange}
                                                            onRemove={handleChange}
                                                            displayValue="label"
                                                            placeholder="Select Location"
                                                            closeOnSelect={false}
                                                            avoidHighlightFirstOption={true}
                                                            showCheckbox={true}
                                                            style={{ chips: { background: "#007bff" } }}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Status</label>
                                                    <select className="form-control" name="status" required>
                                                        <option value="">Select Status</option>
                                                        <option value="1" selected={line_of_business_status == 1 ? true : false}>Active</option>
                                                        <option value="0" selected={line_of_business_status == 0 ? true : false}>Inactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div> */}
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
export default LineOfBusiness