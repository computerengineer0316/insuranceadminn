import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useState } from 'react'
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import swal from 'sweetalert';
const ViewUsefulLinks = () => {
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [showAddModal, SetShowAddModal] = useState(false);
    const [locationlist, setLocation] = useState([]);
    const [defaultLob, setDefaultLOB] = useState([]);
    const [ViewUsefulLinks, setUsefullLink] = useState([]);
    const [showEditModal, SetShowEditModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [claimType, setClaimType] = useState([]);
    const [lob, setLob] = useState([]);
    const [selectedlob, setSelectedlob] = useState([]);
    const [discountType] = useState([{ name: 'New', Value: "New" }, { name: 'Renewal', Value: "Renewal" }]);
    const [selectedLocations, setselectedLocations] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token == null || token == undefined || token == '') {
            window.location = '/login';
        } else {
            getusefulLinks(page, perPage);
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

            })
    }

    const getusefulLinks = async (page, perpage) => {
        const reqOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getUsefullLinks?page=${page}&limit=${perpage}`, reqOptions)
            .then(response => response.json())
            .then(data => {
                setUsefullLink(data.data)
                console.log(data.data, ">>>> usefullinks data")
            })
    }
    const AddProducerDiscount = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        const hospital_name = data.get('hospital_name');
        const website = data.get('website');
        const direction = data.get('direction');
        const address = data.get('address')
        const contact = data.get('contact');
        const file = data.get('file');
        const payloadData = new FormData();
        const locs = selectedLocations?.map((item) => item.value).join(',')
        payloadData.append('hospital_name', hospital_name);
        payloadData.append('website', website);
        payloadData.append('address', address);
        payloadData.append('direction', direction);
        payloadData.append('contact', contact);
        payloadData.append('file', file);
        payloadData.append('location', locs);

        const reqOptions = {
            method: 'POST',
            body: payloadData
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/addUsefullLink', reqOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 201) {
                    SetShowAddModal(false);
                    swal({
                        type: "Success",
                        message: data.message,
                        icon: "success",
                        button: false
                    });
                    getusefulLinks(page, perPage);
                    setTimeout(() => {
                        swal.close();
                    }, 1000);

                } else {
                    SetShowAddModal(false);
                    swal({
                        type: "Error",
                        message: data.message,
                        icon: "error",
                        button: false
                    });
                    getusefulLinks(page, perPage);
                    setTimeout(() => {
                        swal.close();
                    }, 1000);
                }
            })
    }
    const handlePageClick = (data) => {
        const selected = data.selected;
        setPage(selected + 1);
        getusefulLinks(selected + 1, perPage);
    };
    const ActivateDeactivate = (id, status) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateUsefullLink?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 201) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false
                    })
                    getusefulLinks(page, perPage)
                    setTimeout(() => {
                        swal.close()
                    }, 2000);
                } else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error",
                        button: false
                    })
                    setTimeout(() => {
                        swal.close()
                    }, 2000);
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
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteGroupMedicalMaster?id=${id}&type=usefulLinks`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false
                    })
                    getusefulLinks(page, perPage)
                    setTimeout(() => {
                        swal.close()
                    }, 2000);
                } else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error",
                        button: false
                    })
                    setTimeout(() => {
                        swal.close()
                    }, 2000);
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
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getUsefullLinkById?id=${id}`, reqOptions)
            .then(response => response.json())
            .then(data => {
                const editdata = data.data;
                console.log(editdata, 'edit data>>>>')
                const selLocation = editdata[0]?.locationData?.map((item) => {
                    return {
                        label: item.location_name,
                        value: item._id
                    }
                })
                setselectedLocations(selLocation)
                setEditData(editdata[0])
                SetShowEditModal(true);
            })
    }
    const EditUsefullinks = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        const hospital_name = data.get('hospital_name');
        const website = data.get('website');
        const direction = data.get('direction');
        const contact = data.get('contact');
        const file = data.get('file');
        const address = data.get('address')
        const payloadData = new FormData();
        payloadData.append('hospital_name', hospital_name);
        payloadData.append('website', website);
        payloadData.append('direction', direction);
        payloadData.append('contact', contact);
        payloadData.append('file', file);
        payloadData.append('address', address);
        const locs = selectedLocations?.map((item) => item.value).join(',')
        payloadData.append('location', locs);

        const reqOptions = {
            method: 'PUT',
            body: payloadData
        };

        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateUsefullLink?id=${editData?._id}`, reqOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 201) {
                    SetShowEditModal(false);
                    swal({
                        type: "Success",
                        message: data.message,
                        icon: "success",
                        button: false
                    });
                    getusefulLinks(page, perPage);
                    setTimeout(() => {
                        swal.close();
                    }, 1000);
                } else {
                    SetShowEditModal(false);
                    swal({
                        type: "Error",
                        message: data.message,
                        icon: "error",
                        button: false
                    });
                    getusefulLinks(page, perPage);
                    setTimeout(() => {
                        swal.close();
                    }, 1000);
                }
            })
    }
    const ViewFile = (file) => {
        window.open(`https://insuranceapi-3o5t.onrender.com/UsefulLinks/${file}`)
    }
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <h4>Useful Links</h4>
                                </div>
                                <div className='col-md-8' >
                                    <button className='btn btn-primary' onClick={() => SetShowAddModal(true)} style={{ float: 'right' }}>Add Useful Link</button>
                                </div>

                            </div>
                        </div>
                        <div className='card-body'>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead className="thead-dark">
                                        <tr className="table-info">
                                            <th>Sr No.</th>
                                            <th>Hospital Name</th>
                                            <th>Website</th>
                                            <th>Address</th>
                                            <th>Call</th>
                                            <th>Direction</th>
                                            <th>View File</th>
                                            <th>Location</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ViewUsefulLinks?.length ? ViewUsefulLinks?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.hospital_name}</td>
                                                    <td className='text-wrap'>{item.website}</td>
                                                    <td >{item.address}</td>
                                                    <td>{item.call}</td>
                                                    <td><p className='text-wrap'>{item.direction}</p></td>
                                                    <td><button onClick={() => ViewFile(item.file)} className='btn btn-warning'><i className='fa fa-eye'></i></button></td>
                                                    <td>{item.locationData?.map((Val) => Val.location_name)?.join(", ")}</td>
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
                                <Modal.Title>Add Producer Discount</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card">

                                                <div className="card-body">
                                                    <form method='POST' onSubmit={AddProducerDiscount}>
                                                        <div className="row">
                                                            <div className='col-lg-4'>
                                                                <label><strong>Hospital Name</strong></label><br />
                                                                <input type='text' className='form-control' placeholder='Enter Hospital Name' name='hospital_name' />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Website</strong></label><br />
                                                                <input type='text' className='form-control' placeholder='Enter Website' name='website' />
                                                            </div>

                                                            <div className='col-lg-4'>
                                                                <label><strong>Direction</strong></label><br />
                                                                <input type='text' className='form-control' placeholder='Enter Direction' name='direction' />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className='col-lg-4'>
                                                                <label><strong>Address</strong></label><br />
                                                                <input type='text' className='form-control' placeholder='Enter Direction' name='address' />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Contact</strong></label><br />
                                                                <input type='text' className='form-control' placeholder='Enter Direction' name='contact' />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Location</strong></label><br />
                                                                <Multiselect
                                                                    options={locationlist}
                                                                    displayValue="label"
                                                                    onSelect={setselectedLocations}
                                                                    onRemove={setselectedLocations}
                                                                    placeholder="Select Type"
                                                                    showArrow={true}
                                                                    showCheckbox={true}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">

                                                            <div className='col-lg-4'>
                                                                <label><strong>File</strong></label><br />
                                                                <input type='file' className='form-control' name='file' />
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
                                <Modal.Title>Edit Useful Links</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card">

                                                <div className="card-body">
                                                    <form method='POST' onSubmit={EditUsefullinks}>
                                                        <div className="row">
                                                            <div className='col-lg-4'>
                                                                <label><strong>Hospital Name</strong></label><br />
                                                                <input type='text' className='form-control' defaultValue={editData?.hospital_name} placeholder='Enter Hospital Name' name='hospital_name' />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Website</strong></label><br />
                                                                <input type='text' className='form-control' defaultValue={editData?.website} placeholder='Enter Website' name='website' />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Direction</strong></label><br />
                                                                <input type='text' className='form-control' defaultValue={editData?.direction} placeholder='Enter Direction' name='direction' />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className='col-lg-4'>
                                                                <label><strong>Address</strong></label><br />
                                                                <input type='text' className='form-control' defaultValue={editData?.address} placeholder='Enter Direction' name='address' />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Contact</strong></label><br />
                                                                <input type='text' className='form-control' defaultValue={editData?.call} placeholder='Enter Direction' name='contact' />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Location</strong></label><br />
                                                                <Multiselect
                                                                    options={locationlist}
                                                                    selectedValues={selectedLocations}
                                                                    displayValue="label"
                                                                    onSelect={setselectedLocations}
                                                                    onRemove={setselectedLocations}
                                                                    placeholder="Select Type"
                                                                    showArrow={true}
                                                                    showCheckbox={true}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>File</strong></label><br />
                                                                <input type='file' className='form-control' name='file' />
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

export default ViewUsefulLinks
