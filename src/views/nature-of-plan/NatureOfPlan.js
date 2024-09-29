import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import filePath from '../../webroot/sample-files/nature-of-plan.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Multiselect from "multiselect-react-dropdown";
import { Modal, Button } from 'react-bootstrap';

const NatureOfPlan = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [editlocation, setEditLocation] = useState(null);
    const [nature_of_plan_name, setNatureOfPlanName] = useState('');
    const [nature_of_plan_status, setNatureOfPlanStatus] = useState('');
    const [nature_of_plan_id, setNatureOfPlanId] = useState('');
    const [excelfile, setExcelfile] = useState("");
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
            getlistNatureOfPlan(page, perPage);
            locationList();
            const userdata = JSON.parse(localStorage.getItem('user'));
            const master_permission = userdata?.master_permission?.[0] || {};
            setMasterpermission(master_permission);
        }
    }, [])

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
        const nature_of_plan_name = data.get('nature_of_plan_name');
        const nature_of_plan_location = selectedOption;
        const nature_of_plan_location_len = nature_of_plan_location.length;
        const nature_of_plan_location_str = [];
        for (let i = 0; i < nature_of_plan_location_len; i++) {
            nature_of_plan_location_str.push(nature_of_plan_location[i].value);
        }
        if (nature_of_plan_location_str.length === 0) {
            swal({
                title: "Error!",
                text: "Please Select Location",
                type: "error",
                icon: "error"
            });
            return false;
        }
        else {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nature_of_plan_name: nature_of_plan_name,
                    nature_of_plan_location: nature_of_plan_location_str,
                })
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/add_nature_of_plan`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        setShowModal(false);
                        swal({
                            title: "Success!",
                            text: "Nature Of Plan Added Successfully!",
                            icon: "success",
                            button: "Ok",
                        }).then(function () {
                            getlistNatureOfPlan(page, perPage);
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
                            getlistNatureOfPlan(page, perPage);
                        });
                    }
                });
        }
    }

    const natureOfPlanDetails = (id) => {
        setNatureOfPlanId(id);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_nature_of_plan_details/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const nature_of_plan_details = data.data[0];
                console.log(nature_of_plan_details, 'nature_of_plan_details');
                setNatureOfPlanName(nature_of_plan_details.nature_of_plan_name);
                const locationid = nature_of_plan_details.nature_of_plan_location;
                const location_name_arr_obj = [];
                for (let i = 0; i < locationid?.length; i++) {
                    const location_name_arr_obj_obj = { label: locationid[i].location_name, value: locationid[i]._id };
                    location_name_arr_obj.push(location_name_arr_obj_obj);
                }
                setSelectedOption(location_name_arr_obj);
                handleChange(location_name_arr_obj);

                setNatureOfPlanStatus(nature_of_plan_details.nature_of_plan_status);
                setVisibleedit(true);


            });
    }

    const getlistNatureOfPlan = (page, perPage) => {
        setData([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_nature_of_plan/${page}/${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                console.log(list)
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
        FileSaver.saveAs(newdata, "NatureOfPlan" + ".xlsx")
    }


    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getlistNatureOfPlan(selectedPage + 1, perPage);
    };

    const deleteNatureOfPlan = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nature_of_plan_status: status })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_nature_of_plan_status/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "Ok",
                    }).then(() => {
                        getlistNatureOfPlan(page, perPage);
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "Ok",
                    }).then(() => {
                        getlistNatureOfPlan(page, perPage);
                    });
                }
            });
    }


    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_nature_of_plan_excel ",
            {
                method: "post",
                body: fd,
            });
        result = await result.json();
        setVisible(!visible)
        if (result.success === true) {
            swal("Uploaded Succesfully", "", "success");
        } else {
            swal("Something went wrong", "", "failed");
        }
        getlistNatureOfPlan(page, perPage)
    }

    const updateSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const nature_of_plan_name = data.get('nature_of_plan_name');
        const nature_of_plan_location = selectedOption;
        const nature_of_plan_location_len = nature_of_plan_location.length;
        const nature_of_plan_location_id = [];
        for (let i = 0; i < nature_of_plan_location_len; i++) {
            nature_of_plan_location_id.push(nature_of_plan_location[i].value);
        }
        if (nature_of_plan_location_id.length === 0) {
            swal({
                title: "Error!",
                text: "Please Select Location",
                icon: "error",
                button: "Ok",
            });
            return false;
        }
        else {

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nature_of_plan_name: nature_of_plan_name,
                    nature_of_plan_location: nature_of_plan_location_id,
                    nature_of_plan_id: nature_of_plan_id
                })
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/update_nature_of_plan`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        setVisibleedit(false);
                        swal({
                            title: "Success!",
                            text: data.message,
                            icon: "success",
                            button: "Ok",
                        }).then(() => {
                            getlistNatureOfPlan(page, perPage);
                        });
                    }
                    else {
                        setVisibleedit(false);
                        swal({
                            title: "Error!",
                            text: data.message,
                            icon: "error",
                            button: "Ok",
                        }).then(() => {
                            getlistNatureOfPlan(page, perPage);
                        });
                    }
                });
        }
    };
    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMasterData/?id=${id}&type=NatureOfPlan`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getlistNatureOfPlan(page, perPage);


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
                    getlistNatureOfPlan(page, perPage);

                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }


    const openaddmodal = () => {
        setShowModal(true);
        setSelectedOption(location);
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
                                        <h4 className="card-title">Nature Of Plan</h4>
                                    </div>
                                    <div className="col-md-6">
                                        {masterpermission.nature_of_plan?.includes('create') ?
                                            <button className='btn btn-primary' style={{ float: "right" }} onClick={() => openaddmodal()}>Add Nature Of Plan</button>
                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="card-header" style={{ textAlign: 'right' }}>
                                {masterpermission.nature_of_plan?.includes('download') ?
                                    <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                                    : ''}
                                {masterpermission.nature_of_plan?.includes('upload') ?
                                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                                    : ''}
                                {masterpermission.nature_of_plan?.includes('export') ?
                                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                                    : ''}
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Nature Of Plan Name</th>
                                            <th>Nature Of Plan Location</th>
                                            {/* <th>Nature Of Plan Status</th> */}
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={index}>
                                                <td>{startFrom + index + 1}</td>
                                                <td>{item.nature_of_plan_name}</td>
                                                <td>{item.nature_of_plan_location?.map((val) => val.location_name).join(", ")}</td>
                                                {/* <td>{item.nature_of_plan_status === 1 ? 'Active' : 'Inactive'}</td> */}
                                                <td>
                                                    {masterpermission.nature_of_plan?.includes('edit') && (
                                                        <button className="btn btn-primary" onClick={() => { natureOfPlanDetails(item._id); }}>Edit</button>
                                                    )}
                                                    {' '}
                                                    {masterpermission.nature_of_plan?.includes('delete') && (
                                                        <>
                                                            {
                                                                item.nature_of_plan_status === 1 ?
                                                                    <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deleteNatureOfPlan(item._id, 0) }}>Deactivate</button> :
                                                                    <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deleteNatureOfPlan(item._id, 1) }}>Activate</button>
                                                            }
                                                            <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
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
            <CModal alignment='center' visible={visible} onClose={() => setVisible(false)}>
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
                    <CButton color="primary" onClick={collectExceldata} href={'/Viewtravelinsurancefor'}>Upload</CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Nature Of Plan</Modal.Title>
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
                                                        <label className="form-label">Nature Of Plan Name</label>
                                                        <input type="text" className="form-control" placeholder="Nature Of Plan Name" name="nature_of_plan_name" autoComplete="off" required />
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
                    <Modal.Title>Edit Nature Of Plan</Modal.Title>
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
                                                        <label className="form-label">Nature Of Plan Name</label>
                                                        <input type="text" className="form-control" placeholder="Nature Of Plan Name" name="nature_of_plan_name" autoComplete="off" defaultValue={nature_of_plan_name} required />
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
                                                        <option value="1" selected={nature_of_plan_status == 1 ? true : false}>Active</option>
                                                        <option value="0" selected={nature_of_plan_status == 0 ? true : false}>Inactive</option>
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
                    <Button variant="secondary" onClick={() => setVisibleedit(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default NatureOfPlan
