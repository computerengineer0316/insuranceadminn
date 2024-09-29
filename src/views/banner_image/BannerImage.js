import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'
import Multiselect from 'multiselect-react-dropdown'

const BannerImage = () => {
  const navigate = useNavigate()
  const [bannerImageData, setBannerImageData] = useState([])
  const [editLOB, setEditLOB] = useState([])
  const [limit] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(1)
  const [masterPermission, setMasterpermission] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [getWillUpdateData, setGetWillUpdateData] = useState([])
  const [visibleedit, setVisibleedit] = useState(false)
  const [editAlt, setEditAlt] = useState('')
  const [editCompanyName, setEditCompanyName] = useState('')
  const [editRating, setEditRating] = useState('')
  const [editImage, setEditImage] = useState('')
  const [socialId, setSocialId] = useState('')
  const [status, setStatus] = useState(null)

  const API = 'https://insuranceapi-3o5t.onrender.com/api'
  const image_url = 'https://insuranceapi-3o5t.onrender.com/uploads'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    } else {
      getBannerImage(page, limit)
      const userdata = JSON.parse(localStorage.getItem('user'))
      const master_permission = userdata?.master_permission?.[0] || {}
      setMasterpermission(master_permission)
    }
  }, [])

  // console.log('check again')

  const getBannerImage = async (page, limit) => {

    const requestOptions =
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/banerImages?page=${page}&limit=${limit}`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const total = res.count
        const slice = total / limit
        const pages = Math.ceil(slice)
        setPageCount(pages)
        console.log(res)
        setBannerImageData(res.data)
      })

  }

  const updatestatus = async (id, status) => {
    let result = await fetch(`${API}/banerImage?id=${id}`, {
      method: 'put',
      body: JSON.stringify({ id: id, status: status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json()
    swal('Updated Succesfully', '', 'success')
    getBannerImage(page, limit)
  }

  const editBannerImage = async (id) => {
    await fetch(`${API}/banerImage?id=${id}`, {
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
        setEditAlt(res.data.alt)
        setEditCompanyName(res.data.company_name)
        setEditRating(res.data.rating)
        setEditImage(res.data.image)
        setStatus(res.data.status)
        setVisibleedit(true)
      })
      .catch((e) => console.log(e))
  }

  const updateBannerImage = async (id, e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('image', editImage[0])
    formData.append('alt', editAlt)

    formData.append('company_name', editCompanyName)
    formData.append('rating', editRating)

    console.log(editImage, 'check')

    await fetch(`${API}/banerImage?id=${id}`, {
      method: 'PUT',
      body: formData,
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
            getBannerImage(page, limit)
          })
        } else {
          setVisibleedit(false)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            getBannerImage(page, limit)
          })
        }
      })
  }

  const addBannerImage = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('image', editImage[0])
    formData.append('alt', editAlt)

    formData.append('company_name', editCompanyName)
    formData.append('rating', editRating)

    console.log(editImage, 'check')

    console.log(formData, 'check')

    if (formData.alt == '') {
      swal({
        title: 'Error!',
        text: 'Please enter alt',
        type: 'error',
        icon: 'error',
      })
      return false
    }
    if (formData.company_name == '') {
      swal({
        title: 'Error!',
        text: 'Please enter company name',
        type: 'error',
        icon: 'error',
      })
      return false
    }
    if (formData.rating == '') {
      swal({
        title: 'Error!',
        text: 'Please enter rating',
        type: 'error',
        icon: 'error',
      })
      return false
    }


    await fetch(`${API}/BannerImage`, {
      method: 'POST',

      body: formData,
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
            getBannerImage(page, limit)
          })
        } else {
          setShowModal(false)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            getBannerImage(page, limit)
          })
        }
      })
  }



  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getBannerImage(selectedPage + 1, limit);
  };

  console.log(getWillUpdateData, 'check value')

  const startFrom = (page - 1) * limit;


  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Banner Image</h4>
              </div>
              <div className="col-md-6">
                {masterPermission?.bannerimage?.includes('create') ? (
                  <button
                    className="btn btn-primary"
                    style={{ float: 'right' }}
                    onClick={() => setShowModal(true)}
                  >
                    Add Banner Image
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
                  <th scope="col">Image</th>
                  <th scope="col">Alt</th>
                  <th scope="col">Company name</th>
                  <th scope="col">Rating</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {bannerImageData?.length > 0 ? (
                  bannerImageData.map((item, index) => (
                    <tr key={index}>
                      <td>{startFrom + index + 1}</td>
                      <td>
                        <img src={`${image_url}/${item.image}`} />
                      </td>
                      <td>{item.alt}</td>
                      <td>{item.company_name}</td>
                      <td>{item.rating}</td>
                      <td>{item.status == true ? 'Active' : 'Inactive'}</td>
                      <td>
                        {masterPermission?.bannerimage?.includes('edit') && (
                          <button
                            className="btn btn-primary"
                            onClick={() => editBannerImage(item._id)}
                          >
                            Edit
                          </button>
                        )}{' '}
                        {masterPermission?.bannerimage?.includes('delete') && (
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
          <Modal.Title>Add Banner Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form method="POST" onSubmit={(e) => addBannerImage(e)}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Alt</strong>
                          </label>
                          <input
                            className="form-control"
                            name="alt"
                            type="text"
                            onChange={(e) => setEditAlt(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Company name</strong>
                          </label>
                          <input
                            className="form-control"
                            name="company_name"
                            type="text"
                            onChange={(e) => setEditCompanyName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Rating</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="rating"
                            onChange={(e) => setEditRating(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Image</strong>
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="image"
                            onChange={(e) => setEditImage(e.target.files)}
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
          <Modal.Title>Edit Banner Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form method="PUT" onSubmit={(e) => updateBannerImage(socialId, e)}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Alt</strong>
                          </label>
                          <input
                            className="form-control"
                            name="alt"
                            type="text"
                            defaultValue={getWillUpdateData?.alt}
                            onChange={(e) => setEditAlt(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Company name</strong>
                          </label>
                          <input
                            className="form-control"
                            name="company_name"
                            type="text"
                            defaultValue={getWillUpdateData?.company_name}
                            onChange={(e) => setEditCompanyName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Rating</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="rating"
                            defaultValue={getWillUpdateData?.rating}
                            onChange={(e) => setEditRating(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Image</strong>
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="image"
                            // defaultValue={getWillUpdateData?.image}
                            onChange={(e) => setEditImage(e.target.files)}
                          />
                          <img src={`${image_url}/${getWillUpdateData?.image}`} />
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

export default BannerImage
