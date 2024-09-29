import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import filePath from '../../webroot/sample-files/plan-category.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Multiselect from "multiselect-react-dropdown";
import { Modal, Button } from 'react-bootstrap';

const PlanCategory = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [excelfile, setExcelfile] = useState("");
    const [location, setLocation] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [plan_category_name, setPlanCategoryName] = useState('');
    const [plan_category_status, setPlanCategoryStatus] = useState('');
    const [plan_category_id, setPlanCategoryId] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [masterpermission, setMasterpermission] = useState([]);
    const [editlocation, setEditlocation] = useState(null);
    const [selectedlocation, setSelectedlocation] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getlistPlanCategory(page, perPage);
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
                setSelectedOption(location_list)
                // handleChange(location_list)
            });
    }

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const handleChange1 = (selectedOption) => {
        setEditlocation(selectedOption);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const plan_category_name = data.get('plan_category_name');
        const plan_category_location = selectedOption.map((data) => data.value);
        console.log(plan_category_location)
        // return false;
        // const plan_category_location_len = plan_category_location.length;
        // const plan_category_location_str = [];
        // for(let i = 0; i < plan_category_location_len; i++)
        // {
        //     plan_category_location_str.push(plan_category_location[i].value);
        // }

        if (plan_category_location.length === 0) {
            swal({
                title: "Error!",
                text: "Please select location",
                type: "error",
                icon: "error"
            });
        } else {

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    plan_category_name: plan_category_name,
                    plan_category_location: plan_category_location,
                })
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/add_plan_category`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        setShowModal(false);
                        swal({
                            title: "Success!",
                            text: data.message,
                            type: "success",
                            icon: "success"
                        })
                        getlistPlanCategory(page, perPage);

                    }
                    else {
                        setShowModal(false);
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error"
                        })
                        getlistPlanCategory(page, perPage);

                    }
                });
        }
    }

    const planCategoryDetails = (id) => {
        setPlanCategoryId(id);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_plan_category_details/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const plan_category_details = data.data[0];
                setPlanCategoryName(plan_category_details.plan_category_name);
                const locationid = plan_category_details.plan_category_location.map((data) => ({ label: data.location_name, value: data._id }))
                setSelectedlocation(locationid);
                handleChange1(locationid);
                setPlanCategoryStatus(plan_category_details.plan_category_status);
                setVisibleedit(true);
            });
    }

    const updateSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const plan_category_name = data.get('plan_category_name');
        const plan_category_location = editlocation;
        const plan_category_location_len = plan_category_location.length;
        const plan_category_location_id = [];
        for (let i = 0; i < plan_category_location_len; i++) {
            plan_category_location_id.push(plan_category_location[i].value);
        }

        if (plan_category_location_id.length === 0) {
            swal({
                title: "Error!",
                text: "Please select location",
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
                    plan_category_name: plan_category_name,
                    plan_category_location: plan_category_location_id,
                    plan_category_id: plan_category_id
                })
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/update_plan_category`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        setVisibleedit(false);
                        swal({
                            title: "Success!",
                            text: data.message,
                            type: "success",
                            icon: "success"
                        }).then(function () {
                            getlistPlanCategory(page, perPage);
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
                            getlistPlanCategory(page, perPage);
                        });
                    }
                });
        }
    }

    const getlistPlanCategory = (page, perPage) => {
        setData([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_plan_category/${page}/${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                console.log(list)
                setData(list)
            });
    }

    const fileType = 'xlsx'
    const exporttocsv = () => {
        console.log(data)
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
        const newdata = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(newdata, "Plan Category" + ".xlsx")
    }

    const locationdata = (item) => {
        const locationid = item.plan_category_location;
        const location_id = locationid.split(',');
        const location_id_len = location_id.length;
        const location_name = [];
        for (let i = 0; i < location_id_len; i++) {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location_by_id/${location_id[i]}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    location_name.push(data.data.location_name);
                    const location_name_len = location_name.length;
                    if (location_name_len === location_id_len) {
                        const location_name_str = location_name.join(',');
                        const newitem = { ...item, plan_category_location: location_name_str };
                        setData(data => [...data, newitem]);
                    }
                });
        }
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getlistPlanCategory(selectedPage + 1, perPage);
    };

    const deletePlanCategory = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ plan_category_status: status })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_plan_category_status/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "Ok",
                    }).then(() => {
                        getlistPlanCategory(page, perPage);
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "Ok",
                    }).then(() => {
                        getlistPlanCategory(page, perPage);
                    });
                }
            });
    }

    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_plan_category_excel ",
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
        getlistPlanCategory(page, perPage)
    }

    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMasterData/?id=${id}&type=PlanCategory`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getlistPlanCategory(page, perPage);



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
                    getlistPlanCategory(page, perPage);

                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }

    const startFrom = (page - 1) * perPage;

    const openaddmodal = () => {
        setShowModal(true);
        setSelectedOption(location);
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
                                        <h4 className="card-title">Plan Category</h4>
                                    </div>
                                    <div className="col-md-6">
                                        {masterpermission.plan_category?.includes('create') ?
                                            <button className='btn btn-primary' style={{ float: "right" }} onClick={() => openaddmodal()}>Add Plan Category</button>
                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="card-header" style={{ textAlign: 'right' }}>
                                {masterpermission.plan_category?.includes('download') ?
                                    <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                                    : ''}
                                {masterpermission.plan_category?.includes('upload') ?
                                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                                    : ''}
                                {masterpermission.plan_category?.includes('export') ?
                                    <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                                    : ''}
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered">
                                    <thead className=" text-primary">
                                        <tr>
                                            <th>#</th>
                                            <th>Plan Category Name</th>
                                            <th>Plan Category Location</th>
                                            <th>Plan Category Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={index}>
                                                <td>{startFrom + index + 1}</td>
                                                <td>{item.plan_category_name}</td>
                                                <td>{item.plan_category_location?.map((val) => val.location_name).join(", ")}</td>
                                                <td>{item.plan_category_status === 1 ? 'Active' : 'Inactive'}</td>
                                                <td>
                                                    {masterpermission.plan_category?.includes('edit') && (
                                                        <button className="btn btn-primary" onClick={() => { planCategoryDetails(item._id); }}>Edit</button>
                                                    )}
                                                    {' '}
                                                    {masterpermission.plan_category?.includes('delete') && (
                                                        <>
                                                            {
                                                                item.plan_category_status === 1 ?
                                                                    <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deletePlanCategory(item._id, 0) }}>Deactivate</button> :
                                                                    <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deletePlanCategory(item._id, 1) }}>Activate</button>
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
                    <CButton color="primary" onClick={collectExceldata} href={'/Viewtraveltype'}>Upload</CButton>
                </CModalFooter>
            </CModal>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Plan Category</Modal.Title>
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
                                                        <label className="form-label">Plan Category Name</label>
                                                        <input type="text" className="form-control" placeholder="Plan Category Name" name="plan_category_name" autoComplete="off" required />
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
                                                        <label className="form-label">Plan Category Name</label>
                                                        <input type="text" className="form-control" placeholder="Plan Category Name" name="plan_category_name" autoComplete="off" defaultValue={plan_category_name} required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Location</label>
                                                        <Multiselect
                                                            options={location}
                                                            selectedValues={selectedlocation}
                                                            onSelect={handleChange1}
                                                            onRemove={handleChange1}
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
                                                    <option value="1" selected={plan_category_status == 1 ? true : false}>Active</option>
                                                    <option value="0" selected={plan_category_status == 0 ? true : false}>Inactive</option>
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

export default PlanCategory
