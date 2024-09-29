import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import filePath from '../../webroot/sample-files/motor-body-type.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Multiselect from "multiselect-react-dropdown";
import { Modal, Button } from 'react-bootstrap';

const BodyType = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [excelfile, setExcelfile] = useState("");
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [body_type_name, setBodyTypeName] = useState('');
    const [body_type_status, setBodyTypeStatus] = useState('');
    const [body_type_id, setBodyTypeId] = useState('');
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [motorpermission, setMotorPermission] = useState([]);
    const [searchvalue, setSearchvalue] = useState('');
    const [nodata, setNodata] = useState('');
    const [statusvalue, setStatusvalue] = useState(2);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getlistBodyType(page, perPage);
            locationList();
            const userdata = JSON.parse(localStorage.getItem('user'));
            const motor_permission = userdata?.motor_permission?.[0] || {};
            setMotorPermission(motor_permission);
            exportlistdata();
        }
    }, [])

    useEffect(() => {
        getlistBodyType(page, perPage);
    }, [searchvalue, statusvalue])

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const body_type_name = data.get('body_type_name');
        const body_type_location = selectedOption;
        const body_type_location_len = body_type_location.length;
        const body_type_location_str = [];
        for (let i = 0; i < body_type_location_len; i++) {
            body_type_location_str.push(body_type_location[i].value);
        }
        const body_type_status = data.get('status');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                body_type_name: body_type_name,
                body_type_location: body_type_location_str,
                // body_type_status: body_type_status
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/add_body_type`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    setShowModal(false);
                    swal({

                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false

                    })
                    getlistBodyType(page, perPage);
                    setTimeout(() => {
                        swal.close();
                    }, 1000);
                }
                else {
                    setShowModal(false);
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error",
                        button: false

                    })
                    getlistBodyType(page, perPage);
                    setTimeout(() => {
                        swal.close();
                    }, 1000);
                }
            });
    }

    const getlistBodyType = (page, perPage) => {
        setData([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_body_type?page=${page}&limit=${perPage}&name=${searchvalue}&status=${statusvalue}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNodata(data.message)
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                console.log(list, ">>>>>>>>>this is list")
                setData(list);
                // const list_len = list.length;
                // for (let i = 0; i < list_len; i++)
                // {
                //     locationdata(list[i]);
                // }
            });
    }

    const [exportlist, setExportlist] = useState([]);
    const exportlistdata = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/get_body_type', requestOptions)
            .then(response => response.json())
            .then(data => {
                setExportlist(data.data);
            });
    }
    console.log(exportlist)

    const fileType = 'xlsx'
    const exporttocsv = () => {

        const updatedData = exportlist.map((item, index) => {
            return {
                'body_type_name': item.body_type_name,
                'body_type_location': item.body_type_location.map((data) => data.location_name).join(", "),
            }
        })

        console.log(updatedData)




        const ws = XLSX.utils.json_to_sheet(updatedData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "Body-Type" + ".xlsx")
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getlistBodyType(selectedPage + 1, perPage);
    };

    const deleteBodyType = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body_type_status: status })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_body_type_status/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getlistBodyType(page, perPage);
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
                    getlistBodyType(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
            });
    }

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_body_type_excel ",
            {
                method: "post",
                body: fd,
            });
        result = await result.json();
        setVisible(!visible)
        swal("Uploaded Succesfully", "", "success");
        getlistBodyType(page, perPage)
    }

    const BodyTypeDetails = (id) => {
        setBodyTypeId(id);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_body_type_details/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const body_type_details = data.data;
                console.log(body_type_details, ">>>>>>>>>>>>>>>> data")
                setBodyTypeName(body_type_details[0]?.body_type_name);
                const locationid = body_type_details[0]?.body_type_location;
                console.log(locationid)
                const location_id = locationid.map((data) => ({ label: data.location_name, value: data._id }));
                setSelectedOption(location_id);
                setVisibleedit(true);
            });
    }

    const updateSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const body_type_name = data.get('body_type_name');
        const body_type_location = selectedOption;
        const body_type_location_len = body_type_location.length;
        const body_type_location_id = [];
        for (let i = 0; i < body_type_location_len; i++) {
            body_type_location_id.push(body_type_location[i].value);
        }
        const body_type_status = data.get('status');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                body_type_name: body_type_name,
                body_type_location: body_type_location_id,
                // body_type_status: body_type_status,
                body_type_id: body_type_id
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_body_type`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    setVisibleedit(false);
                    swal({

                        text: data.message,
                        icon: "success",
                        button: false
                    })
                    getlistBodyType(page, perPage);
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
                        button: false
                    }).then(() => {
                        getlistBodyType(page, perPage);
                    });
                }
            });
    }
    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMotorMaster/?id=${id}&type=BodyType`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getlistBodyType(page, perPage);


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
                    getlistBodyType(page, perPage);


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
                                        <h4 className="card-title">Body Type</h4>
                                    </div>
                                    <div className="col-md-6">
                                        {motorpermission.body_type?.includes('create') ?
                                            // <button className='btn btn-primary' style={ { float : "right" } } onClick={() => setShowModal(true)}>Add Body Type</button>
                                            <button className='btn btn-primary' style={{ float: "right" }} onClick={() => navigate('/AddBodyType')}>Add Body Type</button>

                                            : ''}
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className='row card-header' style={{ marginLeft: '10px', marginRight: '10px', alignItems: 'center', paddingTop: '5px', paddingBottom: '5px' }}>
                                    <div className='col-lg-3'>
                                        <label><strong>Search</strong></label><br />
                                        <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearchvalue(e.target.value)} />

                                    </div>
                                    <div className='col-lg-3'>
                                        <label><strong>Status</strong></label><br />
                                        <select className='form-control'
                                            value={statusvalue}
                                            onChange={(e) => setStatusvalue(e.target.value)}
                                        >
                                            <option value={2}>-- All --</option>
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>
                                    </div>

                                    <div className="col-lg-6" style={{ textAlign: 'right' }}>
                                        {motorpermission.body_type?.includes('download') ?
                                            <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                                            : ''}
                                        {motorpermission.body_type?.includes('upload') ?
                                            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                                            : ''}
                                        {motorpermission.body_type?.includes('export') ?
                                            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered">
                                    <thead className="thead-dark">
                                        <tr className="table-info">
                                            <th>#</th>
                                            <th>Body Type Name</th>
                                            <th>Body Type Location</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data && data.length > 0 ?
                                            <>

                                                {data?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{startFrom + index + 1}</td>
                                                        <td>{item.body_type_name}</td>
                                                        <td>{item.body_type_location.map((data) => data.location_name).join(", ")}</td>
                                                        <td>
                                                            {motorpermission.body_type?.includes('edit') && (
                                                                <button className="btn btn-primary" onClick={() => { BodyTypeDetails(item._id); }}>Edit</button>
                                                            )}
                                                            {' '}
                                                            {motorpermission.body_type?.includes('delete') && (
                                                                <>
                                                                    {
                                                                        item.body_type_status === 1 ?
                                                                            <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deleteBodyType(item._id, 0) }}>Deactivate</button> :
                                                                            <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deleteBodyType(item._id, 1) }}>Activate</button>
                                                                    }
                                                                    <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}

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
                    <Modal.Title>Add Body Type</Modal.Title>
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
                                                        <label className="form-label">Body Type Name</label>
                                                        <input type="text" className="form-control" placeholder="Body Type Name" name="body_type_name" autoComplete="off" required />
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
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
                                                        <label className="form-label">Body Type Name</label>
                                                        <input type="text" className="form-control" placeholder="Body Type Name" name="body_type_name" autoComplete="off" defaultValue={body_type_name} required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Location</label>
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
                                                <label className="form-label">Status</label>
                                                <select className="form-control" name="status" required>
                                                    <option value="">Select Status</option>
                                                    <option value="1" selected={body_type_status == 1 ? true : false}>Active</option>
                                                    <option value="0" selected={body_type_status == 0 ? true : false}>Inactive</option>
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

export default BodyType
