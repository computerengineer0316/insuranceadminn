import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'
import Multiselect from 'multiselect-react-dropdown'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

const SocialMedia = () => {
  const navigate = useNavigate()
  const [socialMediaData, setSocialMediaData] = useState([])
  // const [limit, setLimit] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [perPage] = useState(5);
  const [page, setPage] = useState(1)
  const [masterPermission, setMasterpermission] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [readMore, setReadMore] = useState(false)
  const [getWillUpdateData, setGetWillUpdateData] = useState([])
  const [visibleedit, setVisibleedit] = useState(false)
  const [editSocialMediaName, setEditSocialMediaName] = useState('')
  const [editSocialContent, setEditSocialContent] = useState('')
  const [socialId, setSocialId] = useState('')
  const [status, setStatus] = useState(null)

  const API = 'https://insuranceapi-3o5t.onrender.com/api'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    } else {
      getSocialMediaLink(perPage, page)
      const userdata = JSON.parse(localStorage.getItem('user'))
      const master_permission = userdata?.master_permission?.[0] || {}
      setMasterpermission(master_permission)
    }
  }, [])

  const getSocialMediaLink = async (limit, page) => {
    await fetch(`${API}/socialMediaLinks?limit=${limit}&page=${page}`)
      .then((res) => res.json())
      .then((res) => {
        const total = res.count

        const slice = total / perPage
        const pages = Math.ceil(slice)
        console.log(pages, 'pages')
        setPageCount(pages)
        // console.log(res.data)
        setSocialMediaData(res.data)
      })
      .catch((e) => console.log(e))
  }

  const editSocialMediaLink = async (id) => {
    await fetch(`${API}/socialMediaLink?id=${id}`, {
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
        setEditSocialMediaName(res.data.socialMediaName) // Set only if data is available
        setEditSocialContent(res.data.contants) // Set only if data is available
        setVisibleedit(true)
      })
      .catch((e) => console.log(e))
  }

  const updateSocialMediaLink = async (id, e) => {
    e.preventDefault()
    await fetch(`${API}/socialMediaLink?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        socialMediaName: editSocialMediaName,
        contants: editSocialContent,
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
            getSocialMediaLink(perPage, page)
          })
        } else {
          setVisibleedit(false)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            getSocialMediaLink(perPage, page)
          })
        }
      })
  }

  const updatestatus = async (id, status) => {
    let result = await fetch(`${API}/socialMediaLink?id=${id}`, {
      method: 'put',
      body: JSON.stringify({ id: id, status: status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json()
    swal('Updated Succesfully', '', 'success')
    getSocialMediaLink(perPage, page)
  }

  const addSocialMediaLink = async (e) => {
    e.preventDefault()
    console.log(editSocialContent, editSocialMediaName, status, 'check')
    await fetch(`${API}/socialMediaLink`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        socialMediaName: editSocialMediaName,
        contants: editSocialContent,
        status: status,
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
            getSocialMediaLink(perPage, page)
          })
        } else {
          setShowModal(false)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            getSocialMediaLink(perPage, page)
          })
        }
      })
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected
    setPage(selectedPage + 1)
    getSocialMediaLink(perPage, selectedPage + 1)
  }
  const startFrom = (page - 1) * perPage;
  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Social Media</h4>
              </div>
              <div className="col-md-6">
                {masterPermission.social_media_link?.includes('create') ? (
                  <button
                    className="btn btn-primary"
                    style={{ float: 'right' }}
                    onClick={() => setShowModal(true)}
                  >
                    Add Social Media
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

                  <th scope="col">Social Media Name</th>
                  <th scope="col">Content</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {socialMediaData?.length > 0 ? (
                  socialMediaData.map((item, index) => (
                    <tr key={index}>
                      <td>{startFrom + index + 1}</td>
                      <td>{item.socialMediaName}</td>
                      {/* <td>
                        {readMore ? (
                          <>{item.contants} </>
                        ) : (
                          <>{item.contants.substring(0, 1000)} </>
                        )}
                        <Button className="btn" onClick={() => setReadMore(!readMore)}>
                          {readMore ? 'show less' : '  read more'}
                        </Button>
                      </td> */}
                      <td className='text-wrap'>
                        {readMore === index ? (
                          <>
                            {item.contants}{' '}
                            <Button className="btn" onClick={() => setReadMore(null)}>
                              show less
                            </Button>
                          </>
                        ) : (
                          <>
                            {item.contants.length > 1000
                              ? item.contants.substring(0, 1000) + '...'
                              : item.contants}{' '}
                            {item.contants.length > 1000 && (
                              <Button className="btn" onClick={() => setReadMore(index)}>
                                read more
                              </Button>
                            )}
                          </>
                        )}
                      </td>
                      <td>{item.status == true ? 'Active' : 'Inactive'}</td>
                      <td>
                        {masterPermission.social_media_link?.includes('edit') && (
                          <button
                            className="btn btn-primary"
                            onClick={() => editSocialMediaLink(item._id)}
                          >
                            Edit
                          </button>
                        )}{' '}
                        {masterPermission.social_media_link?.includes('delete') && (
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
          <Modal.Title>Add Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form method="post" onSubmit={(e) => addSocialMediaLink(e)}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Add Social Media</strong>
                          </label>
                          <input
                            className="form-control"
                            name="name"
                            type="text"
                            onChange={(e) => setEditSocialMediaName(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Add Social Content</strong>
                          </label>
                          <textarea
                            className="form-control"
                            rows="3"
                            name="terms_constions"
                            placeholder="Enter Social Content"
                            onChange={(e) => setEditSocialContent(e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button
                            type="submit"
                            className="btn btn-primary mt-2 submit_all"
                            style={{ float: 'right' }}
                          // onClick={addtermscondition}
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
          <Modal.Title>Edit Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form method="PUT" onSubmit={(e) => updateSocialMediaLink(socialId, e)}>
                      {/* {getWillUpdateData.length > 0 &&
                        getWillUpdateData?.map((data, index1) => ( */}
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Social Media Name</strong>
                          </label>
                          <input
                            className="form-control"
                            name="name"
                            type="text"
                            defaultValue={getWillUpdateData?.socialMediaName}
                            onChange={(e) => setEditSocialMediaName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Social Content</strong>
                          </label>
                          <textarea
                            className="form-control"
                            rows="3"
                            name="content"
                            placeholder="Enter Terms & Condition"
                            defaultValue={getWillUpdateData?.contants}
                            onChange={(e) => setEditSocialContent(e.target.value)}
                          />
                        </div>
                      </div>
                      {/* ))} */}
                      <div className="row">
                        <div className="col-md-12">
                          {/* {socialId.length > 0 && ( */}
                          <button
                            type="submit"
                            className="btn btn-primary mt-2 submit_all"
                            style={{ float: 'right' }}
                          // onClick={(e) => updateSocialMediaLink(socialId,e)}
                          >
                            Submit
                          </button>
                          {/* )} */}
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

export default SocialMedia
