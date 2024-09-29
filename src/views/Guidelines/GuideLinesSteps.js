import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { json, useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'
import Multiselect from 'multiselect-react-dropdown'
import axios from 'axios'


const GuidelinesSteps = () => {
    const navigate = useNavigate()
    const [editLOB, setEditLOB] = useState([])
    const [limit, setLimit] = useState(10)
    const [pageCount, setPageCount] = useState(0)
    const [perPage] = useState(5);
    const [page, setPage] = useState(1)
    const [masterPermission, setMasterpermission] = useState([])
    const [showModal, setShowModal] = useState(false)

    const [visibleedit, setVisibleedit] = useState(false)
    const [editSingleLOB, setEditSingleLOB] = useState()

    const [file, setFile] = useState('')
    const [formData, setFormData] = useState({
        form_type: '',
        steps: [],
    });
    const [stepData, setStepData] = useState([])
    const [updateData, setUpdateData] = useState([])
    const API = 'https://insuranceapi-3o5t.onrender.com/api'

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            getLobDetails()
            const userdata = JSON.parse(localStorage.getItem('user'))
            const master_permission = userdata?.master_permission?.[0] || {}
            setMasterpermission(master_permission)
        }
        getAllFromsSteps(page, perPage)

    }, [])



    const handlePageClick = (e) => {
        const selectedPage = e.selected
        setPage(selectedPage + 1)
        getAllFromsSteps(selectedPage + 1, perPage)
    }

    const getLobDetails = async () => {
        await fetch(`${API}/get_line_of_business_list`)
            .then((res) => res.json())
            .then((res) => {
                const value = res.data.map((val) => val.line_of_business_name)
                setEditLOB(res.data)
            })
            .catch((e) => console.log(e))
    }


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        data.get('form_type')
        data.get('step_no')
        data.get('description')
        data.get('message');
        data.append('file', file)

        data.append('lob', editSingleLOB);

        axios.post(`https://insuranceapi-3o5t.onrender.com/api/addFormSteps`, data)
            .then((data) => {
                if (data.status == 201) {
                    setShowModal(false)
                    swal({
                        title: 'Wow!',
                        text: data.message,
                        type: 'success',
                        icon: 'success',
                    }).then(function () {
                    })
                } else {
                    setShowModal(false)
                    swal({
                        title: 'Error!',
                        text: data.message,
                        type: 'error',
                        icon: 'error',
                    }).then(function () {
                    })
                }
            })

    }
    const updatestatus = async (id, status) => {
        const data = {
            id: id,
            status: status
        }
        axios.post('https://insuranceapi-3o5t.onrender.com/api/updateStepStatus', data)
            .then((data) => {
                if (data.status == 200) {
                    setShowModal(false)
                    getAllFromsSteps(page, perPage)
                    swal({
                        title: 'Wow!',
                        text: data.message,
                        type: 'success',
                        icon: 'success',
                    }).then(function () {
                    })
                } else {
                    setShowModal(false)
                    swal({
                        title: 'Error!',
                        text: data.message,
                        type: 'error',
                        icon: 'error',
                    }).then(function () {
                    })
                }
            })
        // gettestimonials(page, perPage)
    }
    const getAllFromsSteps = (page, perPage) => {

        try {
            axios.get(`https://insuranceapi-3o5t.onrender.com/api/getFormStepsList?page=${page}&perPage=${perPage}`)
                // .then((res) => res.json())
                .then((data) => {
                    if (data.status == 200) {
                        const total = data.data.count;
                        const slice = total / perPage;
                        const pages = Math.ceil(slice);
                        setPageCount(pages);
                        setStepData(data.data.data)
                        console.log(data.data.data)
                        setShowModal(false)
                    } else {
                        setShowModal(false)
                        swal({
                            title: 'Error!',
                            text: data.message,
                            type: 'error',
                            icon: 'error',
                        }).then(function () {
                        })
                    }
                })

        } catch (error) {
            console.log(error.message)
        }
    }
    const getSingleStep = (id, lob) => {
        try {
            setEditSingleLOB(lob)
            axios.get(`https://insuranceapi-3o5t.onrender.com/api/getFormSingle/${id}`)
                // .then((res) => res.json())
                .then((data) => {
                    if (data.status == 200) {
                        console.log(data.data.data)
                        setUpdateData(data.data.data)

                        setVisibleedit(true)
                    } else {
                        setShowModal(false)
                        swal({
                            title: 'Error!',
                            text: data.message,
                            type: 'error',
                            icon: 'error',
                        }).then(function () {
                        })
                    }
                })

        } catch (error) {
            console.log(error.message)
        }
    }
    const handleUpdate = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const formtype = data.get('form_type')
        const stepno = data.get('step_no')
        const desc = data.get('description')
        const msg = data.get('message');
        data.append("lob", editSingleLOB)
        data.append("file", file)

        const updateId = updateData._id

        axios.post(`https://insuranceapi-3o5t.onrender.com/api/updateStepDetails/${updateId}`, data)
            // .then((res) => res.json())
            .then((data) => {
                if (data.status == 200) {
                    setVisibleedit(false)
                    getAllFromsSteps(page, perPage)
                    swal({
                        title: 'Wow!',
                        text: data.message,
                        type: 'success',
                        icon: 'success',
                    })
                } else {
                    setVisibleedit(false)
                    swal({
                        title: 'Error!',
                        text: data.message,
                        type: 'error',
                        icon: 'error',
                    }).then(function () {
                    })
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
                                <h4 className="card-title">Add Guideline Steps</h4>
                            </div>
                            <div className="col-md-6">
                                {masterPermission?.guidelines?.includes('create') ? (
                                    <button
                                        className="btn btn-primary"
                                        style={{ float: 'right' }}
                                        onClick={() => setShowModal(true)}
                                    >
                                        Add Guideline Steps
                                    </button>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr className="table-info">
                                    <th scope="col">#</th>
                                    <th scope="col">Step No</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Message</th>
                                    <th scope="col">Line Of Buisness</th>
                                    <th scope="col">image</th>
                                    <th scope="col">Form Type</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    stepData?.length > 0 ?
                                        stepData.map((item, index) =>
                                            <tr key={index}>
                                                <td>{startFrom + index + 1}</td>
                                                <td>{item.step_no}</td>
                                                <td>{item.description}</td>
                                                <td>{item.message}</td>
                                                <td>{item.lobDetails.map((element) => element.line_of_business_name + " ")}</td>
                                                <td>{<img src={`https://insuranceapi-3o5t.onrender.com/StepLogos/${item.logo[0]?.filename}`} alt='image' height={100} width={100} />}</td>
                                                <td>{item.form_type}</td>
                                                <td>
                                                    {masterPermission?.guidelines?.includes('edit') && (
                                                        <button className="btn btn-primary" onClick={() => getSingleStep(item._id, item.lob)} >Edit</button>
                                                    )}
                                                    {' '}
                                                    {masterPermission?.guidelines?.includes('delete') && (
                                                        <>
                                                            {
                                                                item.status === true ?
                                                                    <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, false) }}>Deactivate</button> :
                                                                    <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, true) }}>Activate</button>
                                                            }
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

            <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Guideline Steps</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div>
                                        <form
                                            onSubmit={handleSubmit}
                                        >
                                            <div className='col-md-6'>
                                                <h4><strong>Form Type:</strong></h4>
                                                <div className="form-group ">
                                                    <select
                                                        className="form-control"
                                                        name="form_type"
                                                    >
                                                        <option value='' hidden>Select Form Type</option>
                                                        <option value={'Steps for Claim Policy'}>
                                                            Steps for Claim Policy
                                                        </option>
                                                        <option value={'Steps for Cancel Policy'}>
                                                            Steps for Cancel Policy
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className="form-group ">
                                                    <label className="form-label">
                                                        <strong>Select LOB</strong>
                                                    </label>
                                                    <Multiselect
                                                        options={editLOB}
                                                        displayValue="line_of_business_name"
                                                        // selectedValues={editSingleLOB}
                                                        onSelect={(e) => {
                                                            setEditSingleLOB(e.map((val) => val._id))
                                                        }}
                                                        onRemove={(e) => {
                                                            setEditSingleLOB(e.map((val) => val._id))
                                                        }}
                                                        placeholder="Select LOB"
                                                        showCheckbox={true}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <h4><strong>Add Step:</strong></h4>
                                                <div className='d-flex'>
                                                    <div className="col-md-2 mx-1">
                                                        <strong>Step No:</strong>
                                                        <input
                                                            className="form-control "
                                                            name='step_no'
                                                            type="text"
                                                            // value={step.step}
                                                            // onChange={(e) => handleStepChange( e)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mx-1">
                                                        <strong>Description:</strong>
                                                        <input
                                                            className="form-control "
                                                            type="text"
                                                            name='description'
                                                            // value={step.description}
                                                            // onChange={(e) => handleStepChange(e)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mx-1">
                                                        <strong>Message:</strong>
                                                        <input
                                                            className="form-control "
                                                            name='message'
                                                            type="text"
                                                            // value={step.message}
                                                            // onChange={(e) => handleStepChange(e)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mx-1">
                                                        <strong>Logo:</strong>
                                                        <input
                                                            className="form-control "
                                                            type="file"
                                                            onChange={(e) => handleFileChange(e)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <button className='btn btn-primary my-2 mx-2' type="submit">Submit</button>
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

            <Modal size="lg" show={visibleedit} onHide={() => setVisibleedit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Step</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form method="PUT"
                                            onSubmit={handleUpdate}
                                        >
                                            <div className="row">
                                                <h4><strong>Edit Form Type:</strong></h4>
                                                <div className="form-group ">
                                                    <select
                                                        className="form-control"
                                                        name="form_type"
                                                        defaultValue={updateData.form_type}
                                                    >
                                                        <option hidden>Select Form Type</option>
                                                        <option value={'Steps for Claim Policy'}>
                                                            Steps for Claim Policy
                                                        </option>
                                                        <option value={'Steps for Cancel Policy'}>
                                                            Steps for Cancel Policy
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">
                                                            <strong>Edit LOB</strong>
                                                        </label>
                                                        <Multiselect
                                                            options={editLOB}
                                                            displayValue="line_of_business_name"
                                                            selectedValues={updateData.lob && updateData.lob.map((id) =>
                                                                editLOB.find((item) => item._id === id),
                                                            )}
                                                            onSelect={(e) => {
                                                                setEditSingleLOB(e.map((val) => val._id))
                                                            }}
                                                            onRemove={(e) => {
                                                                setEditSingleLOB(e.map((val) => val._id))
                                                            }}
                                                            placeholder="Select LOB"
                                                            showCheckbox={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4><strong>Edit Step:</strong></h4>
                                                <div className='d-flex'>
                                                    <div className="col-md-2 mx-1">
                                                        <strong>Step No:</strong>
                                                        <input
                                                            className="form-control "
                                                            name='step_no'
                                                            type="text"
                                                            defaultValue={updateData.step_no}
                                                            // value={step.step}
                                                            // onChange={(e) => handleStepChange( e)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mx-1">
                                                        <strong>Description:</strong>
                                                        <input
                                                            className="form-control "
                                                            defaultValue={updateData.description}
                                                            type="text"
                                                            name='description'
                                                            // value={step.description}
                                                            // onChange={(e) => handleStepChange(e)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mx-1">
                                                        <strong>Message:</strong>
                                                        <input
                                                            className="form-control "
                                                            name='message'
                                                            type="text"
                                                            defaultValue={updateData.message}

                                                            // value={step.message}
                                                            // onChange={(e) => handleStepChange(e)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mx-1">
                                                        <strong>Logo:</strong>
                                                        <input
                                                            className="form-control "
                                                            type="file"
                                                            onChange={(e) => handleFileChange(e)}

                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary mt-2 submit_all"
                                                        style={{ float: 'right' }}
                                                    >
                                                        Submit
                                                    </button>
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

export default GuidelinesSteps
