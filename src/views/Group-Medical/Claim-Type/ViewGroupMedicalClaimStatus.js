import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useState } from 'react'
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import swal from 'sweetalert';

const ViewGroupMedicalClaimStatus = () => {
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [showAddModal, SetShowAddModal] = useState(false);
    const [locationlist, setLocation] = useState([]);
    const [defaultLocation, setDefaultLication] = useState([]);
    const [claimStatuslist, setClaimStatusList] = useState([]);
    const [showEditModal, SetShowEditModal] = useState(false);
    const [editData, setEditData] = useState({});
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token == null || token == undefined || token == '') {
            window.location = '/login';
        } else {
            GetGroupMedicalClaimStatus(page, perPage);
            getlocationlist();
        }

    }, []);
    const getlocationlist = async () => {
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
                const locData = [];
                for (let i = 0; i < locationdt.length; i++) {
                    locData.push({
                        label: locationdt[i].location_name,
                        value: locationdt[i]._id
                    })

                }
                setLocation(locData);
                setDefaultLication(locData);

            })
    }
    const GetGroupMedicalClaimStatus = async (page, perpage) => {
        const reqOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getGroupMedicalClaimStatus?page=${page}&limit=${perpage}`, reqOptions)
            .then(response => response.json())
            .then(data => {
                setClaimStatusList(data.data)
                console.log(data.data)
            })
    }
    const AddGroupMedicalCategory = async (e) => {
        e.preventDefault();
        // const token = localStorage.getItem('token');
        const status_name = e.target?.claim_status?.value;
        const location = defaultLocation.map((item) => item.value);
        const reqOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status_name, location })
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/addgroupmedicalClaimStatus', reqOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 201) {
                    SetShowAddModal(false);
                    swal({
                        type: "Success",
                        text: data.message,
                        icon: "success",
                        button: false
                    });
                    setTimeout(() => {
                        GetGroupMedicalClaimStatus(page, perPage);

                        swal.close();
                    }, 1000);

                } else {
                    SetShowAddModal(false);
                    swal({
                        type: "Error",
                        text: data.message,
                        icon: "error",
                        button: false
                    });
                    setTimeout(() => {
                        GetGroupMedicalClaimStatus(page, perPage);

                        swal.close();
                    }, 1000);
                }
            })
    }
    const handlePageClick = (data) => {
        const selected = data.selected;
        setPage(selected + 1);
        GetGroupMedicalClaimStatus(selected + 1, perPage);
    };
    const ActivateDeactivate = (id, status) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateGroupMedicalClaimStatus?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    swal({
                        type: "Success",
                        text: data.message,
                        icon: "success",
                        button: false
                    });
                    setTimeout(() => {
                        GetGroupMedicalClaimStatus(page, perPage);

                        swal.close();
                    }, 1000);
                } else {
                    swal({
                        type: "Error",
                        text: data.message,
                        icon: "error",
                        button: false
                    });
                    setTimeout(() => {
                        GetGroupMedicalClaimStatus(page, perPage);
                        swal.close();
                    }, 1000);
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
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteGroupMedicalMaster?id=${id}&type=groupmedicalClaimStatus`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    swal({
                        type: "Success",
                        text: data.message,
                        icon: "success",
                        button: false
                    });
                    setTimeout(() => {
                        GetGroupMedicalClaimStatus(page, perPage);
                        swal.close();
                    }, 1000);
                } else {
                    swal({
                        type: "Error",
                        text: data.message,
                        icon: "error",
                        button: false
                    });
                    setTimeout(() => {
                        GetGroupMedicalClaimStatus(page, perPage);
                        swal.close();
                    }, 1000);
                }
            });
    }
    const goTosetShowEditModal = (id) => {
        const reqOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getGroupMedicalClaimStatusById?id=${id}`, reqOptions)
            .then(response => response.json())
            .then(data => {
                const category = data.data;
                setEditData(category[0])
                const loc = category[0]?.locationData?.map((item) => {
                    return {
                        label: item.location_name,
                        value: item._id
                    }
                })
                setDefaultLication(loc);
                SetShowEditModal(true);
            })
    }
    const EditCategory = async (e) => {
        e.preventDefault();
        const status_name = e.target?.claim_status?.value;
        const location = defaultLocation.map((item) => item.value);
        const reqOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status_name, location })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateGroupMedicalClaimStatus?id=${editData?._id}`, reqOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    SetShowEditModal(false);
                    swal({
                        type: "Success",
                        text: data.message,
                        icon: "success",
                        button: false
                    });
                    GetGroupMedicalClaimStatus(page, perPage);
                    setTimeout(() => {
                        swal.close();
                    }, 1000);
                } else {
                    SetShowEditModal(false);
                    swal({
                        type: "Error",
                        text: data.message,
                        icon: "error",
                        button: false
                    });
                    GetGroupMedicalClaimStatus(page, perPage);
                    setTimeout(() => {
                        swal.close();
                    }, 1000);
                }
            })
    }
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <h4>Group Medical Claim Status</h4>
                                </div>
                                <div className='col-md-8' >
                                    <button className='btn btn-primary' onClick={() => SetShowAddModal(true)} style={{ float: 'right' }}>Add Plan Type</button>
                                </div>

                            </div>
                        </div>
                        <div className='card-body'>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead className="thead-dark">
                                        <tr className="table-info">
                                            <th>Sr No.</th>
                                            <th>Claim Status Name</th>
                                            <th>Location</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {claimStatuslist.length ? claimStatuslist.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.status_name}</td>
                                                    <td>{item.locationData?.map((item) => item.location_name).join(',')}</td>
                                                    <td>
                                                        <div className="btn-group" role="group" aria-label="Basic example">
                                                            <button className="btn btn-info" onClick={() => goTosetShowEditModal(item._id)}>Edit</button>
                                                        </div>&nbsp;&nbsp;
                                                        {
                                                            item.status == 1 ?
                                                                <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger"
                                                                    onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) ActivateDeactivate(item._id, 0) }}
                                                                >Deactivate</button></div> :
                                                                <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success"
                                                                    onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) ActivateDeactivate(item._id, 1) }}
                                                                >Activate</button></div>
                                                        }&nbsp;&nbsp;
                                                        <div className="btn-group" role="group" aria-label="Basic example">
                                                            <button className="btn btn-warning" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }) : <tr><td colSpan='5'>No Data Found</td></tr>
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
                        <Modal size='lg' show={showAddModal} onHide={() => SetShowAddModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add Group Medical Claim Status</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card">

                                                <div className="card-body">
                                                    <form method='POST' onSubmit={AddGroupMedicalCategory}>
                                                        <div className="row">
                                                            <div className='col-lg-6'>
                                                                <label><strong>Claim Status</strong></label><br />
                                                                <input type='text' className='form-control' name='claim_status' />
                                                            </div>
                                                            <div className='col-lg-6'>
                                                                <label><strong>Location</strong></label><br />
                                                                <Multiselect
                                                                    options={locationlist}
                                                                    selectedValues={locationlist}
                                                                    onSelect={(event) => setDefaultLication(event)}
                                                                    onRemove={(event) => setDefaultLication(event)}
                                                                    displayValue="label"
                                                                    placeholder="Select Location"
                                                                    closeOnSelect={false}
                                                                    avoidHighlightFirstOption={true}
                                                                    showCheckbox={true}
                                                                    style={{ chips: { background: "#007bff" } }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }} >Submit</button>
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
                                <Button variant="secondary" onClick={() => SetShowAddModal(false)}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal size='lg' show={showEditModal} onHide={() => SetShowEditModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Group Medical Claim Status</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card">

                                                <div className="card-body">
                                                    <form method='POST' onSubmit={EditCategory}>
                                                        <div className="row">
                                                            <div className='col-lg-6'>
                                                                <label><strong>Group Medical Claim Status</strong></label><br />
                                                                <input type='text' className='form-control' defaultValue={editData?.status_name} name='claim_status' />
                                                            </div>
                                                            <div className='col-lg-6'>
                                                                <label><strong>Location</strong></label><br />
                                                                <Multiselect
                                                                    options={locationlist}
                                                                    selectedValues={defaultLocation}
                                                                    onSelect={(event) => setDefaultLication(event)}
                                                                    onRemove={(event) => setDefaultLication(event)}
                                                                    displayValue="label"
                                                                    placeholder="Select Location"
                                                                    closeOnSelect={false}
                                                                    avoidHighlightFirstOption={true}
                                                                    showCheckbox={true}
                                                                    style={{ chips: { background: "#007bff" } }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }} >Submit</button>
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
                                <Button variant="secondary" onClick={() => SetShowEditModal(false)}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ViewGroupMedicalClaimStatus
