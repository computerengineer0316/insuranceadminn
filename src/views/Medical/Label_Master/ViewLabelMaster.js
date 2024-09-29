import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import Multiselect from 'multiselect-react-dropdown';
import "react-datepicker/dist/react-datepicker.css";
const ViewLabelMaster = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [masterpermission, setMasterpermission] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [location, setLocation] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [visibleedit, setVisibleedit] = useState(false);
    const [updateData, setUpdateData] = useState({});
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            MedicalLabel(page, perPage);
            const userdata = JSON.parse(localStorage.getItem('user'));
            const master_permission = userdata?.medical_permission?.[0] || {};
            setMasterpermission(master_permission);
            locationList();
        }
    }, [])
    const MedicalLabel = (page, perPage) => {
        setData([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/medicalLevel?limit=${perPage}&page=${page}`, requestOptions)
            .then(response => response.json())
            .then(
                data => {
                    const total = data.count;
                    const slice = total / perPage;
                    const pages = Math.ceil(slice);
                    setPageCount(pages);
                    const list = data.data;
                    setData(list)
                }
            );
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
                setLocation(locationdt);
                handleChange(locationdt);
            });
    }
    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    }
    const add_Boat_Breadth = (e) => {
        try {
            e.preventDefault();
            const formdata = new FormData(e.target);
            const name = formdata.get('boat_breadth');
            const location = selectedOption.map((val) => val._id);
            const data = { name, location };
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            };
            fetch('https://insuranceapi-3o5t.onrender.com/api/medicalLevel', requestOptions)
                .then(response => response.json())
                .then(data => {
                    setShowModal(false);
                    if (data.status === 201) {
                        swal({
                            title: "Success!",
                            text: data.message,
                            icon: "success",
                            button: false,
                        })
                        MedicalLabel(page, perPage);
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
                        MedicalLabel(page, perPage);
                        setTimeout(() => {
                            swal.close()
                        }, 1000);
                    }

                })

        } catch (error) {
            console.log(error)
        }
    }
    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMedicalMaster?id=${id}&type=medicalLabel`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    MedicalLabel(page, perPage);
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
                    MedicalLabel(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }
    const GetBoatBreadthById = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/medicalLevelBYId?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const medlabeldata = data.data[0];
                setUpdateData(medlabeldata);
                handleChange(medlabeldata?.locations);
                setVisibleedit(true);
            });

    }
    const updateBoatBreadth = (e) => {
        e.preventDefault();
        const formdata = new FormData(e.target);
        const name = formdata.get('name');
        const location = selectedOption.map((val) => val._id);
        const id = updateData._id;
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, location }),
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/medicalLevel?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setVisibleedit(false);
                if (data.status === 200) {

                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    MedicalLabel(page, perPage);
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
                    MedicalLabel(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }
            });
    }
    const updatestatus = (id, status) => {
        const data = { status };
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/medicalLevel?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    MedicalLabel(page, perPage);
                    setTimeout(() => { swal.close() }, 1000);
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false,
                    })
                    MedicalLabel(page, perPage);
                    setTimeout(() => { swal.close() }, 1000);
                }
            })
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        MedicalLabel(selectedPage + 1, perPage);
    };
    const startFrom = (page - 1) * perPage;
    return (
        <>
            <Container>
                <div className="card mb-4">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className="card-title">Label</h4>
                            </div>
                            <div className="col-md-6">
                                {masterpermission.medical_labels?.includes('create') ?
                                    <button className='btn btn-primary' style={{ float: "right" }}
                                        onClick={() => setShowModal(true)}
                                    >Add Label</button>
                                    : ''}
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr className="table-info">
                                        <th scope="col">#</th>

                                        <th scope="col">name</th>
                                        <th scope="col">location</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.length > 0 ?
                                            data.map((item, index) =>
                                                <tr key={index}>
                                                    <td>{startFrom + index + 1}</td>
                                                    {/* <td>{item.userId}</td> */}
                                                    <td className="text-wrap">{item.name}</td>
                                                    {/* <td>{new Date(item.startDate).toLocaleString()}</td> */}
                                                    <td>{item.locations.map((val) => val.location_name).join(", ")}</td>
                                                    <td>
                                                        {masterpermission.medical_labels?.includes('edit') && (
                                                            <button className="btn btn-primary"
                                                                onClick={() => GetBoatBreadthById(item._id)}
                                                            >Edit</button>
                                                        )}
                                                        {' '}
                                                        {masterpermission.medical_labels?.includes('delete') && (
                                                            <>
                                                                {
                                                                    item.status == 1 ?
                                                                        <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                                                        <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                                                                }
                                                                <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ) : <tr>
                                                <td colSpan="6">No Data Found</td>
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

            </Container>

            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add label</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">

                                    <div className="card-body">
                                        <form onSubmit={add_Boat_Breadth}>
                                            <div className="row">

                                                <div className="col-md-12">
                                                    <label className="form-label"><strong>Add Label</strong></label>

                                                    <textarea className="form-control" rows="3" cols="10" name="boat_breadth" placeholder="Enter Boat Breadth " />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label"><strong>Select Location</strong></label>

                                                    <Multiselect
                                                        options={location}
                                                        selectedValues={location}
                                                        onSelect={handleChange}
                                                        onRemove={handleChange}
                                                        displayValue="location_name"
                                                        placeholder="Select Location"
                                                        closeOnSelect={false}
                                                        avoidHighlightFirstOption={true}
                                                        showCheckbox={true}
                                                        style={{ chips: { background: "#007bff" } }}
                                                        required
                                                    />
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Label</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="/" method="PUT"
                                            onSubmit={updateBoatBreadth}
                                        >
                                            <div className="row">
                                                <div className="col-md-12">

                                                    <label className="form-label"><strong>Edit Label</strong></label>
                                                    <textarea type='text' className="form-control"
                                                        name='name'
                                                        placeholder='Name'
                                                        defaultValue={updateData?.name}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label"><strong>Select Location</strong></label>

                                                    <Multiselect
                                                        options={location}
                                                        selectedValues={selectedOption}
                                                        onSelect={handleChange}
                                                        onRemove={handleChange}
                                                        displayValue="location_name"
                                                        placeholder="Select Location"
                                                        closeOnSelect={false}
                                                        avoidHighlightFirstOption={true}
                                                        showCheckbox={true}
                                                        style={{ chips: { background: "#007bff" } }}
                                                        required
                                                    />
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
                    <Button variant="secondary" onClick={() => setVisibleedit(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ViewLabelMaster
