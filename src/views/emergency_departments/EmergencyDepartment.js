import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'
import Multiselect from 'multiselect-react-dropdown'

const EmergencyDepartment = () => {
  const navigate = useNavigate()
  const [emergencyDepartmentData, setEmergencyDepartmentData] = useState([])
  const [editLOB, setEditLOB] = useState([])
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(1)
  const [masterPermission, setMasterpermission] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [getWillUpdateData, setGetWillUpdateData] = useState([])
  const [visibleedit, setVisibleedit] = useState(false)
  const [editName, setEditName] = useState('')
  const [editNumber, setEditNumber] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editDepartment, setEditDepartment] = useState('')
  const [editSingleLOB, setEditSingleLOB] = useState()
  const [socialId, setSocialId] = useState('')
  const [status, setStatus] = useState(null)

  const API = 'https://insuranceapi-3o5t.onrender.com/api'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    } else {
      getEmergencyDepartment(perPage, page)
      getLobDetails()
      const userdata = JSON.parse(localStorage.getItem('user'))
      const master_permission = userdata?.master_permission?.[0] || {}
      setMasterpermission(master_permission)
    }
  }, [])

  // console.log('check again')

  const getEmergencyDepartment = async (limit, page) => {
    await fetch(`${API}/emergencyDepartments?limit=${limit}&page=${page}`)
      .then((res) => res.json())
      .then((res) => {
        const total = res.count
        console.log('total', total)
        const slice = total / perPage
        const pages = Math.ceil(slice)
        setPageCount(pages)
        // console.log(res.data)
        setEmergencyDepartmentData(res.data)
      })
      .catch((e) => console.log(e))
  }

  const updatestatus = async (id, status) => {
    let result = await fetch(`${API}/emergencyDepartment?id=${id}`, {
      method: 'put',
      body: JSON.stringify({ id: id, status: status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json()
    swal('Updated Succesfully', '', 'success')
    getEmergencyDepartment(perPage, page)
  }

  const editEmergencyDepartment = async (id) => {
    await fetch(`${API}/emergencyDepartment?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res.data)
        setSocialId(id)
        setGetWillUpdateData(res.data)
        setEditName(res.data.Name)
        setEditNumber(res.data.number)
        setEditEmail(res.data.email)
        setEditDepartment(res.data.departments)
        setEditSingleLOB(res.data.lob)
        setStatus(res.data.status)
        setVisibleedit(true)
      })
      .catch((e) => console.log(e))
  }

  const updateEmergencyDepartment = async (id, e) => {
    e.preventDefault()
    await fetch(`${API}/emergencyDepartment?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        Name: editName,
        number: editNumber,
        email: editEmail,
        departments: editDepartment,
        status: status,
        lob: editSingleLOB,
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
            getEmergencyDepartment(perPage, page)
          })
        } else {
          setVisibleedit(false)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            getEmergencyDepartment(perPage, page)
          })
        }
      })
  }

  const addEmergencyDepartment = async (e) => {
    e.preventDefault()
    await fetch(`${API}/emergencyDepartment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Name: editName,
        number: editNumber,
        email: editEmail,
        departments: editDepartment,
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
            getEmergencyDepartment(perPage, page)
          })
        } else {
          setShowModal(false)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            getEmergencyDepartment(perPage, page)
          })
        }
      })
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected
    setPage(selectedPage + 1)
    getEmergencyDepartment(perPage, selectedPage + 1)
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

  const findLOB = (loop) => {
    const value =
      editLOB.length > 0 &&
      editLOB.filter((val) => {
        return loop.some((va1) => va1 === val._id)
      })
    return value.length > 0 && value.map((val) => val.line_of_business_name).join(',')
  }
  const startFrom = (page - 1) * perPage;
  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Emergency Department</h4>
              </div>
              <div className="col-md-6">
                {masterPermission?.emergency_departments?.includes('create') ? (
                  <button
                    className="btn btn-primary"
                    style={{ float: 'right' }}
                    onClick={() => setShowModal(true)}
                  >
                    Add Emergency Department
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
                  <th scope="col">Number</th>
                  <th scope="col">Email</th>
                  <th scope="col">Department</th>
                  <th scope="col">LOB</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {emergencyDepartmentData?.length > 0 ? (
                  emergencyDepartmentData.map((item, index) => (
                    <tr key={index}>
                      <td>{startFrom + index + 1}</td>
                      <td>{item.Name}</td>
                      <td>{item.number}</td>
                      <td>{item.email}</td>
                      <td>{item.departments}</td>
                      <td>{findLOB(item.lob) || ''}</td>
                      <td>{item.status == true ? 'Active' : 'Inactive'}</td>
                      <td>
                        {masterPermission?.emergency_departments?.includes('edit') && (
                          <button
                            className="btn btn-primary"
                            onClick={() => editEmergencyDepartment(item._id)}
                          >
                            Edit
                          </button>
                        )}{' '}
                        {masterPermission?.emergency_departments?.includes('delete') && (
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

      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Emergency Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form method="PUT" onSubmit={(e) => addEmergencyDepartment(e)}>
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
                            <strong>Number</strong>
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
                            <strong>Department</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="departments"
                            onChange={(e) => setEditDepartment(e.target.value)}
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

      <Modal size="lg" show={visibleedit} onHide={() => setVisibleedit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Emergency Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form method="PUT" onSubmit={(e) => updateEmergencyDepartment(socialId, e)}>
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
                            onChange={(e) => setEditDepartment(e.target.value)}
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
      </Modal>
    </>
  )
}

export default EmergencyDepartment
