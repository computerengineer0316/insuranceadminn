import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'

const NewsLetter = () => {
  const navigate = useNavigate()
  const [newsLetterData, setNewsLetterData] = useState([])
  const [limit, setLimit] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(1)
  const [masterPermission, setMasterpermission] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [getWillUpdateData, setGetWillUpdateData] = useState([])
  const [visibleedit, setVisibleedit] = useState(false)
  const [editEmail, setEditEmail] = useState('')
  const [newsId, setNewsId] = useState('')
  const [status, setStatus] = useState('')

  const API = 'https://insuranceapi-3o5t.onrender.com/api'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    } else {
      getNewsLetter(limit, page)
      const userdata = JSON.parse(localStorage.getItem('user'))
      const master_permission = userdata?.master_permission?.[0] || {}
      setMasterpermission(master_permission)
    }
  }, [])

  const getNewsLetter = async (limit, page) => {
    await fetch(`${API}/newsLetters?limit=${limit}&page=${page}`)
      .then((res) => res.json())
      .then((res) => {
        const total = res.count
        const slice = total / limit
        const pages = Math.ceil(slice)
        setPageCount(pages)
        setNewsLetterData(res.data)
      })
      .catch((e) => console.log(e))
  }

  const editNewsLetter = async (id) => {
    await fetch(`${API}/newsLetter?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res.data)
        setNewsId(id)
        setGetWillUpdateData(res.data)
        setEditEmail(res.data.email)
        setStatus(res.data.status)
        setVisibleedit(true)
      })
      .catch((e) => console.log(e))
  }

  const updateNewsletter = async (id, e) => {
    e.preventDefault()
    await fetch(`${API}/newsLetter?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        email: editEmail,
        status: status,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          setVisibleedit(false)
          swal({
            title: 'Wow!',
            text: data.message,
            type: 'success',
            icon: 'success',
          }).then(function () {
            getNewsLetter(limit, page)
          })
        } else {
          setVisibleedit(false)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            getNewsLetter(limit, page)
          })
        }
      })
  }

  const addNewsletter = async (e) => {
    e.preventDefault()
    await fetch(`${API}/newsLetter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: editEmail,
        status: true,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 201) {
          setShowModal(false)
          swal({
            title: "Subscribed!",
            text: data.message,
            icon: 'success',
          }).then(function () {
            getNewsLetter(limit, page)
          })
        } else if (data.status == 409) {
          setShowModal(false)
          swal({
            title: "Already Subscribed!",
            text: data.message,
            icon: 'warning',
          }).then(function () {
            getNewsLetter(limit, page)
          })
        }
        else {
          setShowModal(false)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            getNewsLetter(limit, page)
          })
        }
      })
  }

  const updatestatus = async (id, status) => {
    let result = await fetch(`${API}/newsLetter?id=${id}`, {
      method: 'put',
      body: JSON.stringify({ id: id, status: status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json()
    swal('Updated Succesfully', '', 'success')
    getNewsLetter(limit, page)
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected
    setPage(selectedPage + 1)
    getNewsLetter(limit, selectedPage + 1)
  }

  const startFrom = (page - 1) * limit;


  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">News Letter</h4>
              </div>
              <div className="col-md-6">
                {masterPermission.usertype?.includes('create') ? (
                  <button
                    className="btn btn-primary"
                    style={{ float: 'right' }}
                    onClick={() => setShowModal(true)}
                  >
                    Add News letter
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

                  <th scope="col">Email</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {newsLetterData?.length > 0 ? (
                  newsLetterData.map((item, index) => (
                    <tr key={index}>
                      <td>{startFrom + index + 1}</td>
                      <td>{item.email}</td>

                      <td>{item.status == true ? 'Active' : 'Inactive'}</td>
                      <td>
                        {masterPermission.motor_claim_question?.includes('edit') && (
                          <button
                            className="btn btn-primary"
                            onClick={() => editNewsLetter(item._id)}
                          >
                            Edit
                          </button>
                        )}{' '}
                        {masterPermission.usertype?.includes('delete') && (
                          <>
                            {item.status === true ? (
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  if (
                                    window.confirm('Are you sure you wish to deactivate this item?')
                                  )
                                    updatestatus(item._id, false)
                                  console.log('hha')
                                }}
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                className="btn btn-success"
                                onClick={() => {
                                  if (
                                    window.confirm('Are you sure you wish to activate this item?')
                                  )
                                    updatestatus(item._id, true)
                                  console.log('hha')
                                }}
                              >
                                Activate
                              </button>
                            )}
                          </>
                        )}
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
      </Container>

      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add News letter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form method="POST" onSubmit={(e) => addNewsletter(e)}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Email</strong>
                          </label>
                          <input
                            className="form-control"
                            name="email"
                            type="email"
                            onChange={(e) => setEditEmail(e.target.value)}
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size="lg" show={visibleedit} onHide={() => setVisibleedit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit News letter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form method="PUT" onSubmit={(e) => updateNewsletter(newsId, e)}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit email</strong>
                          </label>
                          <input
                            className="form-control"
                            name="email"
                            type="email"
                            defaultValue={getWillUpdateData?.email}
                            onChange={(e) => setEditEmail(e.target.value)}
                          />
                        </div>
                        {/* <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                              className="form-control"
                              name="status"
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option hidden>Select Status</option>
                              <option
                                value={'1'}
                                selected={getWillUpdateData?.status == 1 ? true : false}
                              >
                                Active
                              </option>
                              <option
                                value={'0'}
                                selected={getWillUpdateData?.status == 0 ? true : false}
                              >
                                Inactive
                              </option>
                            </select>
                          </div>
                        </div> */}
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

export default NewsLetter
