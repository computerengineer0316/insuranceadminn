import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useState } from 'react'
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import swal from 'sweetalert';
const ViewProducerDiscount = () => {
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [showAddModal, SetShowAddModal] = useState(false);
    const [locationlist, setLocation] = useState([]);
    const [defaultLob, setDefaultLOB] = useState([]);
    const [producerDicsount, setProducerDiscouts] = useState([]);
    const [showEditModal, SetShowEditModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [claimType, setClaimType] = useState([]);
    const [lob, setLob] = useState([]);
    const [selectedlob, setSelectedlob] = useState([]);
    const [discountType] = useState([{ name: 'New', Value: "New" }, { name: 'Renewal', Value: "Renewal" }]);
    const [selectedType, setSelectedType] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token == null || token == undefined || token == '') {
            window.location = '/login';
        } else {
            GetProducerDiscount(page, perPage);
            getlocationlist();
            getClaimType()
            lobList();
        }

    }, []);
    const getClaimType = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getActiveGroupMedicalClaimType`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const claimType = data.data;
                console.log(claimType, "claim Type")
                setClaimType(claimType);
            })
    }

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
    const GetProducerDiscount = async (page, perpage) => {
        const reqOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getProducerDiscount?page=${page}&limit=${perpage}`, reqOptions)
            .then(response => response.json())
            .then(data => {
                setProducerDiscouts(data.data)
                console.log(data.data, ">>>> discount data")
            })
    }
    const AddProducerDiscount = async (e) => {
        e.preventDefault();
        // const token = localStorage.getItem('token');
        const data = new FormData(e.target);

        const description = data.get('description');
        const location = data.get('location');
        const rate = data.get('pd_rate');
        const dicsount_type = data.get('business_type')
        const effective_date = data.get("effective_date")
        const splitrate = rate.split(",")
        if (splitrate.length != selectedlob.length) {
            swal({
                text: "Number of Rates and selected LOBs must be equal",
                icon: "warning"
            })
            return false;
        }
        const reqOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                description: description,
                location: location,
                lob: selectedlob,
                rate: rate,
                discount_type: dicsount_type,
                effective_date: effective_date
            })
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/addProducerDiscount', reqOptions)
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
                    setTimeout(() => {
                        GetProducerDiscount(page, perPage);

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
                    setTimeout(() => {
                        GetProducerDiscount(page, perPage);

                        swal.close();
                    }, 1000);
                }
            })
    }
    const handlePageClick = (data) => {
        const selected = data.selected;
        setPage(selected + 1);
        GetProducerDiscount(selected + 1, perPage);
    };
    const ActivateDeactivate = (id, status) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateProducerDiscount?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 201) {
                    swal("Success", data.message, "success")
                    GetProducerDiscount(page, perPage)
                } else {
                    swal("Error", data.message, "error")
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
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMasterData?id=${id}&type=producerDiscount`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    swal("Success", data.message, "success")
                    GetProducerDiscount(page, perPage)
                } else {
                    swal("Error", data.message, "error")
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
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getProducerDiscountById?id=${id}`, reqOptions)
            .then(response => response.json())
            .then(data => {
                const editdata = data.data;
                console.log(editdata, 'edit data>>>>')
                setEditData(editdata[0])
                const loc = editdata[0]?.line_of_business?.map((item) => {
                    return {
                        label: item.line_of_business_name,
                        value: item._id
                    }
                })
                setDefaultLOB(loc);



                SetShowEditModal(true);
            })
    }
    const EditCategory = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        const description = data.get('description');
        const location = data.get('location');
        const rate = data.get('pd_rate');
        const discount_type = data.get('discount_type')
        const effective_date = data.get('effective_date')
        const splitrate = rate.split(",")
        if (splitrate.length != defaultLob.length) {
            swal({
                text: "Number of Rates and selected LOBs must be equal",
                icon: "warning"
            })
            return false;
        }
        const reqOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, location, rate, lob: defaultLob, discount_type: discount_type, effective_date: effective_date })
        };

        fetch(`https://insuranceapi-3o5t.onrender.com/api/updateProducerDiscount?id=${editData?._id}`, reqOptions)
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
                    setTimeout(() => {
                        GetProducerDiscount(page, perPage);
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
                    setTimeout(() => {
                        GetProducerDiscount(page, perPage);
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
                                    <h4>Producer Commission</h4>
                                </div>
                                <div className='col-md-8' >
                                    <button className='btn btn-primary' onClick={() => SetShowAddModal(true)} style={{ float: 'right' }}>Add Commission</button>
                                </div>

                            </div>
                        </div>
                        <div className='card-body'>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead className="thead-dark">
                                        <tr className="table-info">
                                            <th>Sr No.</th>
                                            <th>Location</th>
                                            <th>Description</th>
                                            <th>Rate</th>
                                            <th>LOB</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {producerDicsount?.length ? producerDicsount?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.location[0]?.location_name}</td>
                                                    <td>{item.description}</td>
                                                    <td>{item.rate}</td>
                                                    <td>{item.line_of_business?.map((item) => item.line_of_business_name).join(', ')}</td>
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
                                <Modal.Title>Add Producer Commission</Modal.Title>
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
                                                                <label><strong>Location</strong></label><br />
                                                                <select className='form-control' name='location'>
                                                                    <option value=''>Select Location</option>
                                                                    {
                                                                        locationlist?.map((item, index) => {
                                                                            return (
                                                                                <option key={index} value={item.value}>{item.label}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Description</strong></label><br />
                                                                <input type='text' className='form-control' placeholder='Add Description' name='description' />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Business Type</strong></label><br />
                                                                <select className='form-control' name='business_type'>
                                                                    <option value=''>Select Business Type</option>
                                                                    <option value='New'>New</option>
                                                                    <option value='Renewal'>Renewal</option>
                                                                </select>


                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className='col-lg-4'>
                                                                <label><strong>Line Of Business</strong></label><br />
                                                                <Multiselect
                                                                    options={lob}
                                                                    displayValue="label"
                                                                    onSelect={setSelectedlob}
                                                                    onRemove={setSelectedlob}
                                                                    placeholder="Select line of business"
                                                                    showArrow={true}
                                                                    showCheckbox={true}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label><strong>Rate(%)</strong></label><br />
                                                                    <input type="text" className="form-control" name="pd_rate" placeholder="Rate" autoComplete="off" required />
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <div className='form-group'>
                                                                    <label><strong>Effective Date</strong></label>
                                                                    <input type='date' className='form-control' name='effective_date' />
                                                                </div>
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
                                <Modal.Title>Edit Producer Commission</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card">

                                                <div className="card-body">
                                                    <form method='POST' onSubmit={EditCategory}>
                                                        <div className="row">
                                                            <div className='col-lg-4'>
                                                                <label><strong>Location</strong></label><br />
                                                                <select className='form-control' defaultValue={editData?.location} name='location'>
                                                                    <option value=''>Select Location</option>
                                                                    {
                                                                        locationlist?.map((item, index) => {
                                                                            return (
                                                                                <option key={index} value={item.value}>{item.label}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Description</strong></label><br />
                                                                <input type='text' className='form-control' name='description' defaultValue={editData?.description} />
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                <label><strong>Business Type</strong></label><br />
                                                                <select className='form-control' defaultValue={editData?.discount_type} name='discount_type'>
                                                                    <option value=''>Select Business Type</option>
                                                                    <option value='New'>New</option>
                                                                    <option value='Renewal'>Renewal</option>
                                                                </select>

                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className='col-lg-4'>
                                                                <label><strong>Line Of Business</strong></label><br />
                                                                <Multiselect
                                                                    options={lob}
                                                                    displayValue="label"
                                                                    selectedValues={defaultLob}
                                                                    onSelect={setDefaultLOB}
                                                                    onRemove={setDefaultLOB}
                                                                    placeholder="Select line of business"
                                                                    showArrow={true}
                                                                    showCheckbox={true}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label><strong>Rate(%)</strong></label><br />
                                                                    <input type="text" className="form-control" name="pd_rate" defaultValue={editData?.rate} placeholder="Rate" autoComplete="off" required />
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <div className='form-group'>
                                                                    <label><strong>Effective Date</strong></label>
                                                                    <input defaultValue={editData?.effective_date?.slice(0, 10)} type='date' className='form-control' name='effective_date' />
                                                                </div>
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


export default ViewProducerDiscount
