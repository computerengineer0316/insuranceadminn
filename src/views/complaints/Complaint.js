import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'
import Multiselect from 'multiselect-react-dropdown'

const Complaint = () => {
  const navigate = useNavigate()
  const [comaplaintData, setcomaplaintData] = useState([])
  const [editLOB, setEditLOB] = useState([])
  const [limit, setLimit] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(1)
  const [masterPermission, setMasterpermission] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [getWillUpdateData, setGetWillUpdateData] = useState([])
  const [visibleedit, setVisibleedit] = useState(false)
  const [editName, setEditName] = useState('')
  const [editNumber, setEditNumber] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editMessage, setEditMessage] = useState('')
  const [editSingleLOB, setEditSingleLOB] = useState()
  const [socialId, setSocialId] = useState('')
  const [status, setStatus] = useState(true)

  const API = 'https://insuranceapi-3o5t.onrender.com/api'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    } else {
      getComplaintData(limit, page)
      getLobDetails()
      const userdata = JSON.parse(localStorage.getItem('user'))
      const master_permission = userdata?.master_permission?.[0] || {}
      setMasterpermission(master_permission)
    }
  }, [])

  // console.log('check again')

  const getComplaintData = async (limit, page) => {
    await fetch(`${API}/customerComplaints?limit=${limit}&page=${page}`)
      .then((res) => res.json())
      .then((res) => {
        const total = res.count
        const slice = total / limit
        const pages = Math.ceil(slice)
        setPageCount(pages)
        // console.log(res.data)
        setcomaplaintData(res.data)
      })
      .catch((e) => console.log(e))
  }

  const addComplaintData = async (e) => {
    e.preventDefault()
    await fetch(`${API}/customerComplaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: editName,
        phone_number: editNumber,
        email: editEmail,
        message: editMessage,
        status: status,
        lob: editSingleLOB,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 201) {
          setShowModal(false)
          swal({
            title: 'Wow!',
            text: data.message,
            type: 'success',
            icon: 'success',
          }).then(function () {
            getComplaintData(limit, page)
          })
        } else {
          setShowModal(false)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            getComplaintData(limit, page)
          })
        }
      })
  }

  const handlePageClick = (e) => {
    console.log(e, 'check')
    const selectedPage = e.selected
    setPage(selectedPage + 1)
    getComplaintData(limit, selectedPage + 1)
  }

  const getLobDetails = async () => {
    await fetch(`${API}/get_line_of_business_list`)
      .then((res) => res.json())
      .then((res) => {
        // const value = res.data.map((val) => val.line_of_business_name)
        setEditLOB(res.data)
      })
      .catch((e) => console.log(e))
  }

  const findLOB = (loop) => {
    // console.log(loop, editLOB, 'check')
    const value =
      editLOB.length > 0 &&
      editLOB.filter((val) => {
        return loop.some((va1) => va1 === val._id)
      })
    return value.length > 0 && value.map((val) => val.line_of_business_name).join(',')
  }

  const startFrom = (page - 1) * limit;


  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Complaint</h4>
              </div>
              <div className="col-md-6">
                {masterPermission.bank_details?.includes('create') ? (
                  <button
                    className="btn btn-primary"
                    style={{ float: 'right' }}
                    onClick={() => setShowModal(true)}
                  >
                    Add Complaint
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
                  <th scope="col">Name</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Email</th>
                  <th scope="col">Message</th>
                  <th scope="col">LOB</th>
                  <th scope="col">Status</th>
                  {/* <th scope="col">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {comaplaintData?.length > 0 ? (
                  comaplaintData.map((item, index) => (
                    <tr key={index}>
                      <td>{startFrom + index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.phone_number}</td>
                      <td>{item.email}</td>
                      <td>{item.message}</td>
                      <td>{findLOB(item.lob) || ''}</td>
                      <td>{item.status == true ? 'Active' : 'Inactive'}</td>
                      {/* <td>
                        {masterPermission.bank_details?.includes('edit') && (
                          <button
                            className="btn btn-primary"
                            onClick={() => editComplaintData(item._id)}
                          >
                            Edit
                          </button>
                        )}{' '}
                        {masterPermission.bank_details?.includes('delete') && (
                          <>
                            {item.status === true ? (
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  if (
                                    window.confirm('Are you sure you wish to deactivate this item?')
                                  )
                                    updatestatus(item._id, false)
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
                                }}
                              >
                                Activate
                              </button>
                            )}
                          </>
                        )}
                      </td> */}
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

      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form method="PUT" onSubmit={(e) => addComplaintData(e)}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Name</strong>
                          </label>
                          <input
                            className="form-control"
                            name="Name"
                            type="text"
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Phone Number</strong>
                          </label>
                          <input
                            className="form-control"
                            name="number"
                            type="text"
                            onChange={(e) => setEditNumber(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Email</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="email"
                            onChange={(e) => setEditEmail(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Message</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="message"
                            onChange={(e) => setEditMessage(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">
                              <strong>LOB</strong>
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

      {/* <Modal size="lg" show={visibleedit} onHide={() => setVisibleedit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form method="PUT" onSubmit={(e) => updateComplaintData(socialId, e)}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Name</strong>
                          </label>
                          <input
                            className="form-control"
                            name="Name"
                            type="text"
                            defaultValue={getWillUpdateData?.Name}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Number</strong>
                          </label>
                          <input
                            className="form-control"
                            name="number"
                            type="text"
                            defaultValue={getWillUpdateData?.number}
                            onChange={(e) => setEditNumber(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Email</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="email"
                            defaultValue={getWillUpdateData?.email}
                            onChange={(e) => setEditEmail(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Department</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="departments"
                            defaultValue={getWillUpdateData?.departments}
                            onChange={(e) => setEditMessage(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">
                              <strong>Edit LOB</strong>
                            </label>
                            <Multiselect
                              options={editLOB}
                              displayValue="line_of_business_name"
                              selectedValues={
                                editSingleLOB &&
                                editSingleLOB.map((id) => editLOB.find((item) => item._id === id))
                              }
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
      </Modal> */}
    </>
  )
}

export default Complaint
