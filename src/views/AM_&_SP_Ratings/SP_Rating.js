import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { json, useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'
import Multiselect from 'multiselect-react-dropdown'
import axios from 'axios'


const SP_Ratings = () => {
    const navigate = useNavigate()
    const [limit, setLimit] = useState(10)
    const [pageCount, setPageCount] = useState(0)
    const [perPage] = useState(5);
    const [page, setPage] = useState(1)
    const [masterPermission, setMasterpermission] = useState([])
    const [showModal, setShowModal] = useState(false)

    const [visibleedit, setVisibleedit] = useState(false)
    const [ratingData, setRatings] = useState([])
    const [updateData, setUpdateData] = useState([])
    const API = 'https://insuranceapi-3o5t.onrender.com/api'

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        } else {
            const userdata = JSON.parse(localStorage.getItem('user'))
            const master_permission = userdata?.master_permission?.[0] || {}
            setMasterpermission(master_permission)
        }
        getAll_AM_Ratings(page, perPage)

    }, [])



    const handlePageClick = (e) => {
        const selectedPage = e.selected
        setPage(selectedPage + 1)
        getAll_AM_Ratings(selectedPage + 1, perPage)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const symbol = data.get('rating_symbol')
        const definition = data.get('definition')
        console.log(symbol, definition)
        const reqdata = {
            ratingSymbol: symbol,
            ratingDefinition: definition
        }
        axios.post(`https://insuranceapi-3o5t.onrender.com/api/addspRating`, reqdata)
            .then((data) => {
                if (data.status == 201) {
                    setShowModal(false)
                    swal({
                        title: 'Wow!',
                        text: data.message,
                        type: 'success',
                        icon: 'success',
                    }).then(function () {
                        getAll_AM_Ratings(page, perPage)
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
        axios.post('https://insuranceapi-3o5t.onrender.com/api/updatespRatingStatus', data)
            .then((data) => {
                if (data.status == 200) {
                    setShowModal(false)
                    getAll_AM_Ratings(page, perPage)
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
    const getAll_AM_Ratings = (page, perPage) => {

        try {
            axios.get(`https://insuranceapi-3o5t.onrender.com/api/getAllspRatings?page=${page}&perPage=${perPage}`)
                // .then((res) => res.json())
                .then((data) => {
                    if (data.status == 200) {
                        const total = data.data.count;
                        const slice = total / perPage;
                        const pages = Math.ceil(slice);
                        setPageCount(pages);
                        setRatings(data.data.data)
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
    const getSingleRating = (id) => {
        try {
            axios.get(`https://insuranceapi-3o5t.onrender.com/api/getSingleSpRating/${id}`)
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
        const symbol = data.get('rating_symbol')
        const definition = data.get('definition')
        const reqdata = {
            ratingSymbol: symbol,
            ratingDefinition: definition
        }
        console.log(symbol, definition, "update data")
        // return false;
        const updateId = updateData._id

        axios.put(`https://insuranceapi-3o5t.onrender.com/api/UpdateSpRating/?id=${updateId}`, reqdata)
            // .then((res) => res.json())
            .then((data) => {
                if (data.status == 200) {
                    setVisibleedit(false)
                    getAll_AM_Ratings(page, perPage)
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
                                <h4 className="card-title">S&P Ratings</h4>
                            </div>
                            <div className="col-md-6">
                                {masterPermission?.sp_rating?.includes('create') ? (
                                    <button
                                        className="btn btn-primary"
                                        style={{ float: 'right' }}
                                        onClick={() => setShowModal(true)}
                                    >
                                        Add S&P Ratings
                                    </button>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <table className="table table-bordered yatchplanss123">
                            <thead className="thead-dark">
                                <tr className="table-info">
                                    <th scope="col">#</th>
                                    <th scope="col">Rating Symbol</th>
                                    <th scope="col">Definition</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ratingData?.length > 0 ?
                                        ratingData.map((item, index) =>
                                            <tr key={index}>
                                                <td>{startFrom + index + 1}</td>
                                                <td>{item.ratingSymbol}</td>
                                                <td className='text-wrap'>{item.ratingDefinition}</td>
                                                <td>
                                                    {masterPermission?.sp_rating?.includes('edit') && (
                                                        <button className="btn btn-primary" onClick={() => getSingleRating(item._id)} >Edit</button>
                                                    )}
                                                    {' '}
                                                    {masterPermission?.sp_rating?.includes('edit') && (
                                                        <>
                                                            {
                                                                item.status == true ?
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
                    <Modal.Title>Add S&P Rating</Modal.Title>
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
                                            <div className='d-flex'>
                                                <div className="col-md-3 mx-2">
                                                    <strong>Rating Symbol</strong>
                                                    <input
                                                        className="form-control "
                                                        name='rating_symbol'
                                                        type="text"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6 mx-2">
                                                    <strong>Definition</strong>
                                                    <textarea
                                                        className="form-control "
                                                        type="text"
                                                        name='definition'
                                                        required
                                                    />
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
                    <Modal.Title>Edit S&P Rating</Modal.Title>
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
                                                <div className="form-group ">
                                                    <div className='col-md-6'>
                                                        <div className="form-group ">
                                                            <strong>Rating Symbol</strong>
                                                            <input
                                                                className="form-control "
                                                                name='rating_symbol'
                                                                type="text"
                                                                defaultValue={updateData.ratingSymbol}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row'>

                                                <div className="col-md-6 mx-1">
                                                    <strong>Definition</strong>
                                                    <textarea
                                                        className="form-control "
                                                        type="text"
                                                        name='definition'
                                                        defaultValue={updateData.ratingDefinition}

                                                    />
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

export default SP_Ratings
