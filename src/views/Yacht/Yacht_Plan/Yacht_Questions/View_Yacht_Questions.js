import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'
import Multiselect from 'multiselect-react-dropdown'

const View_Yacht_Questions = () => {
    const navigate = useNavigate()
    const [YachtQuestions, setYachtQuestions] = useState([])
    const [visibleedit, setVisibleedit] = useState(false)
    const [visibleAdd, setVisibleAdd] = useState(false)
    const [masterPermission, setMasterpermission] = useState([])
    const [location, setLocation] = useState([])
    const [editData, setEditData] = useState([])
    const [formdata, setFormdata] = useState({})
    const [pageCount, setPageCount] = useState(0)
    const [page, setPage] = useState(1)
    const [perPage] = useState(10);
    const [defaultLocation, setDefaultLocation] = useState([])
    const [editClaimQuestionYear, setEditClaimQuestionYear] = useState('')
    const [experianceType, setExperianceType] = useState('')

    const API = 'https://insuranceapi-3o5t.onrender.com/api'
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            getYacht_Questions_List()
            locationList()
            const userdata = JSON.parse(localStorage.getItem('user'))
            const master_permission = userdata?.master_permission?.[0] || {}
            setMasterpermission(master_permission)
        }
    }, [])
    const getYacht_Questions_List = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch(`${API}/getAllYachtQuestions?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    const total = data.count;
                    const slice = total / perPage;
                    const pages = Math.ceil(slice);
                    setPageCount(pages);
                    setYachtQuestions(data.data)
                }
            })
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
                const location_len = locationdt.length;
                const location_list = [];
                for (let i = 0; i < location_len; i++) {
                    const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
                    location_list.push(location_obj);
                }
                setLocation(location_list);
                handleChange1(location_list, 'location');
            });
    }
    const HandleInputChange = (e) => {
        const { name, value } = e.target
        setFormdata({ ...formdata, [name]: value })
    }
    const handleChange1 = (selectedOption, name) => {
        setFormdata({ ...formdata, ["location"]: selectedOption })
    }
    const AddYachtQuestions = () => {
        console.log("sadfsfsfsf >>>>>>>> ", formdata)
        const requestOptions = {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formdata),
        }
        fetch(`${API}/addYachtQuestion`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 201) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "OK",
                    });
                    setVisibleAdd(false)
                    getYacht_Questions_List(page, perPage)
                } else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "OK",
                    });
                }
            });
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected
        setPage(selectedPage + 1)
        // getMotorClaimsYearsLink(perPage, selectedPage + 1)
    }
    const editYachtQuestions = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch(`${API}/getYachtQuestionbyid?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    setEditData(data.data[0])
                    console.log("edit data >>>>>>>> hiii", data.data)
                    const locationdt = data.data[0].location;
                    const location_list = [];
                    for (let i = 0; i < locationdt.length; i++) {
                        const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
                        location_list.push(location_obj);
                    }
                    setDefaultLocation(location_list);
                    setEditClaimQuestionYear(data.data[0]?.name)
                    setExperianceType(data.data[0]?.claim_experience === true ? "1" : "2")
                    setVisibleedit(true)
                }
            })
    }
    const updateYachtStatus = (id, status) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: status }),
        }
        fetch(`${API}/UpdateYachtQuestion?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 201) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "OK",
                    });
                    getYacht_Questions_List(page, perPage)
                } else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "OK",
                    });
                }
            })
    }
    const UpdateYachtQuestions = () => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: editClaimQuestionYear,
                claim_experience: experianceType,
                location: defaultLocation
            }),
        }
        fetch(`${API}/UpdateYachtQuestion?id=${editData?._id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 201) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "OK",
                    });
                    setVisibleedit(false)
                    getYacht_Questions_List(page, perPage)
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "OK",
                    });
                }
            })
    }
    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        fetch(`${API}/deleteYachtMaster?id=${id}&type=YachtQuestions`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "OK",
                    });
                    getYacht_Questions_List(page, perPage)
                } else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "OK",
                    });
                }
            })
    }

    const startFrom = (page - 1) * perPage;
    return (
        <>
            <Container>
                <div className="card mb-4">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className="card-title">Yacht Questions</h4>
                            </div>
                            <div className="col-md-6" style={{ textAlign: 'right' }}>
                                <div className="text-right">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setVisibleAdd(true)}
                                    >
                                        Add Yacht Questions
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="card-body" style={{ overflow: 'scroll' }}>
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr className="table-info">
                                    <th scope="col">#</th>

                                    <th scope="col">Question</th>
                                    <th scope="col">Experience Type</th>
                                    <th scope="col">Location</th>
                                    {/* <th scope="col">Status</th> */}
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {YachtQuestions?.length > 0 ? (
                                    YachtQuestions.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td className='text-wrap'>{item.name}</td>
                                            <td>{item.claim_experience == true ? "Claims Experience" : "Operators Experience"}</td>
                                            <td>{item.location?.map((Val) => Val.location_name).join(", ")}</td>

                                            {/* <td>{item.status == true ? 'Active' : 'Inactive'}</td> */}
                                            <td>
                                                {/* {masterPermission.motor_claim_question?.includes('edit') && ( */}
                                                {item.status === true ? (
                                                    <button className="btn btn-danger mx-1" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updateYachtStatus(item._id, 0); }}>Deactivate</button>
                                                ) : (
                                                    <button className="btn btn-success mx-1" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updateYachtStatus(item._id, 1); }}>Activate</button>
                                                )}

                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => editYachtQuestions(item._id)}
                                                >
                                                    Edit
                                                </button>
                                                {/* )} */}
                                                <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No Data Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination justify-content-end'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                            activeClassName={'active'}
                        />
                    </div>
                </div>
            </Container>

            <Modal size="lg" show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Yacht Questions </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form
                                        //   method="PUT"
                                        // onSubmit={(e) => UpdateYachtQuestions(editData?._id, e)}
                                        >
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label className="form-label">
                                                        <strong>Edit Yacht Questions</strong>
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        name="name"
                                                        type="text"
                                                        defaultValue={editData?.name}
                                                        onChange={(e) => setEditClaimQuestionYear(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        <strong>Experience Type</strong>
                                                    </label>
                                                    <select
                                                        className="form-control"
                                                        name="experience_type"
                                                        required
                                                        onChange={(e) => setExperianceType(e.target.value)}
                                                    >
                                                        <option value="" hidden>Select Experience Type</option>
                                                        <option selected={editData?.claim_experience === true} value="1">Claims Experience</option>
                                                        <option selected={editData?.claim_experience === false} value="2">Operators Experience</option>
                                                        {/* <option value="3">Expert</option> */}
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        <strong>Locations</strong>
                                                    </label>
                                                    <Multiselect
                                                        options={location}
                                                        selectedValues={defaultLocation}
                                                        displayValue="label"
                                                        onSelect={(evnt) => (setDefaultLocation(evnt))}
                                                        onRemove={(evnt) => (setDefaultLocation(evnt))}
                                                        placeholder="Select Location"
                                                        showCheckbox={true}
                                                        closeOnSelect={false}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div
                                                        type="submit"
                                                        onClick={() => UpdateYachtQuestions()}
                                                        className="btn btn-primary mt-2 submit_all"
                                                        style={{ float: 'right' }}
                                                    >
                                                        Submit
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
                    <Button variant="secondary" onClick={() => setVisibleedit(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal size="lg" show={visibleAdd} onHide={() => setVisibleAdd(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Yacht Questions </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form
                                        //   method="PUT"
                                        // onSubmit={(e) => UpdateYachtQuestions(editData?._id, e)}
                                        >
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label className="form-label">
                                                        <strong>Add Yacht Questions</strong>
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        name="question"
                                                        type="text"
                                                        onChange={(e) => HandleInputChange(e)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">
                                                        <strong>Experience Type</strong>
                                                    </label>
                                                    <select
                                                        className="form-control"
                                                        name="experience_type"
                                                        required
                                                        onChange={(e) => HandleInputChange(e)}
                                                    >
                                                        <option value="" hidden>Select Experience Type</option>
                                                        <option value="1">Claims Experience</option>
                                                        <option value="2">Operators Experience</option>
                                                        {/* <option value="3">Expert</option> */}
                                                    </select>
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">
                                                        <strong>Locations</strong>
                                                    </label>
                                                    <Multiselect
                                                        options={location}
                                                        selectedValues={location}
                                                        displayValue="label"
                                                        onSelect={(evnt) => (handleChange1(evnt, 'location'))}
                                                        onRemove={(evnt) => (handleChange1(evnt, 'location'))}
                                                        placeholder="Select Location"
                                                        showCheckbox={true}
                                                        closeOnSelect={false}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div
                                                        type="submit"
                                                        onClick={() => AddYachtQuestions()}
                                                        className="btn btn-primary mt-2 submit_all"
                                                        style={{ float: 'right' }}
                                                    >
                                                        Submit
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
                    <Button variant="secondary" onClick={() => setVisibleedit(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default View_Yacht_Questions
