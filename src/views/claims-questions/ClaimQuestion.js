import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'
import Multiselect from 'multiselect-react-dropdown'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

const ClaimQuestion = () => {
  const navigate = useNavigate()
  const [claimQuestionData, setClaimQuestionData] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(1)
  const [perPage] = useState(10);
  const [masterPermission, setMasterpermission] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [getWillUpdateData, setGetWillUpdateData] = useState([])
  const [visibleedit, setVisibleedit] = useState(false)
  const [editClaimQuestionYear, setEditClaimQuestionYear] = useState('')
  const [claimQuestionId, setClaimQuestionId] = useState('')

  const API = 'https://insuranceapi-3o5t.onrender.com/api'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    } else {
      getMotorClaimsYearsLink(perPage, page)
      const userdata = JSON.parse(localStorage.getItem('user'))
      const master_permission = userdata?.master_permission?.[0] || {}
      setMasterpermission(master_permission)
    }
  }, [])

  const getMotorClaimsYearsLink = async (limit, page) => {
    await fetch(`${API}/motorClaimsYears?limit=${limit}&page=${page}`)
      .then((res) => res.json())
      .then((res) => {
        const total = res.count
        const slice = total / perPage
        const pages = Math.ceil(slice)
        setPageCount(pages)
        // console.log(res.data)
        setClaimQuestionData(res.data)
      })
      .catch((e) => console.log(e))
  }

  const editMotorClaimsYearsLink = async (id) => {
    await fetch(`${API}/motorClaimsYears?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res.data)
        setClaimQuestionId(id)
        setGetWillUpdateData(res.data)
        setEditClaimQuestionYear(res.data.year)
        setVisibleedit(true)
      })
      .catch((e) => console.log(e))
  }

  const updateMotorClaimsYearsLink = async (id, e) => {
    e.preventDefault()

    await fetch(`${API}/motorClaimsYears?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        year: editClaimQuestionYear,
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
            getMotorClaimsYearsLink(perPage, page)
          })
        } else {
          setVisibleedit(false)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            getMotorClaimsYearsLink(perPage, page)
          })
        }
      })
  }

  // const addSocialMediaLink = async (e) => {
  //   e.preventDefault()
  //   await fetch(`${API}/motorClaimsYears`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       socialMediaName: editSocialMediaName,
  //       contants: editSocialContent,
  //       status: status,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.status == 201) {
  //         setShowModal(false)
  //         swal({
  //           title: 'Wow!',
  //           text: data.message,
  //           type: 'success',
  //           icon: 'success',
  //         }).then(function () {
  //           getSocialMediaLink(limit, page)
  //         })
  //       } else {
  //         setShowModal(false)
  //         swal({
  //           title: 'Error!',
  //           text: data.message,
  //           type: 'error',
  //           icon: 'error',
  //         }).then(function () {
  //           getSocialMediaLink(limit, page)
  //         })
  //       }
  //     })
  // }
  //  const updatestatus = async (id, status) => {
  //    let result = await fetch(`${API}/socialMediaLink?id=${id}`, {
  //      method: 'put',
  //      body: JSON.stringify({ id: id, status: status }),
  //      headers: {
  //        'Content-Type': 'application/json',
  //      },
  //    })
  //    result = await result.json()
  //    swal('Updated Succesfully', '', 'success')
  //    getSocialMediaLink(limit, page)
  //  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected
    setPage(selectedPage + 1)
    getMotorClaimsYearsLink(perPage, selectedPage + 1)
  }
  const startFrom = (page - 1) * perPage;
  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Claim Questions</h4>
              </div>
              {/* <div className="col-md-6">
                {masterPermission.usertype?.includes('create') ? (
                  <button
                    className="btn btn-primary"
                    style={{ float: 'right' }}
                    onClick={() => setShowModal(true)}
                  >
                    Add Claim Questions
                  </button>
                ) : (
                  ''
                )}
              </div> */}
            </div>
          </div>

          <div className="card-body">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>

                  <th scope="col">Questions</th>
                  <th scope="col">Years</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {claimQuestionData?.length > 0 ? (
                  claimQuestionData.map((item, index) => (
                    <tr key={index}>
                      <td>{startFrom + index + 1}</td>
                      <td>{item.questions}</td>
                      <td>{item.year}</td>

                      <td>{item.status == true ? 'Active' : 'Inactive'}</td>
                      <td>
                        {masterPermission.motor_claim_question?.includes('edit') && (
                          <button
                            className="btn btn-primary"
                            onClick={() => editMotorClaimsYearsLink(item._id)}
                          >
                            Edit
                          </button>
                        )}{' '}
                        {/* {masterPermission.usertype?.includes('delete') && (
                          <>
                            {item.status === true ? (
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  if (
                                    window.confirm('Are you sure you wish to deactivate this item?')
                                  )
                                    // updatestatus(item._id, false)
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
                                    // updatestatus(item._id, true)
                                    console.log('hha')
                                }}
                              >
                                Activate
                              </button>
                            )}
                          </>
                        )} */}
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
          <Modal.Title>Edit Claim Questions </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form
                      method="PUT"
                      onSubmit={(e) => updateMotorClaimsYearsLink(claimQuestionId, e)}
                    >
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Claim Question Year</strong>
                          </label>
                          <input
                            className="form-control"
                            name="year"
                            type="number"
                            defaultValue={getWillUpdateData?.year}
                            onChange={(e) => setEditClaimQuestionYear(e.target.value)}
                            required
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

export default ClaimQuestion
