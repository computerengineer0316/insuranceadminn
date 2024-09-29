import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'

const BankDetails = () => {
  const navigate = useNavigate()
  const [bankDetails, setBankDetails] = useState([])
  const [editLOB, setEditLOB] = useState([])
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(1)
  const [masterPermission, setMasterpermission] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [readMore, setReadMore] = useState(false)
  const [getWillUpdateData, setGetWillUpdateData] = useState([])
  const [visibleedit, setVisibleedit] = useState(false)
  const [editBankName, setEditBankName] = useState('')
  const [editAccountNumber, setEditAccountNumber] = useState('')
  const [editIBNNumber, setEditIBNNumber] = useState('')
  const [editSwiftCode, setEditSwiftCode] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editSingleLOB, setEditSingleLOB] = useState('')

  const [socialId, setSocialId] = useState('')
  const [status, setStatus] = useState(null)

  const API = 'https://insuranceapi-3o5t.onrender.com/api'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    } else {
      getBankDetails(perPage, page)
      getLobDetails()
      const userdata = JSON.parse(localStorage.getItem('user'))
      const master_permission = userdata?.master_permission?.[0] || {}
      setMasterpermission(master_permission)
    }
  }, [])

  const getBankDetails = async (limit, page) => {
    await fetch(`${API}/lmpBankDetails?limit=${limit}&page=${page}`)
      .then((res) => res.json())
      .then((res) => {
        const total = res.count
        const slice = total / perPage
        const pages = Math.ceil(slice)
        setPageCount(pages)
        // console.log(res.data)
        setBankDetails(res.data)
      })
      .catch((e) => console.log(e))
  }

  const updatestatus = async (id, status) => {
    let result = await fetch(`${API}/lmpBankDetail?id=${id}`, {
      method: 'put',
      body: JSON.stringify({ id: id, bankstatus: status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json()
    swal('Updated Succesfully', '', 'success')
    getBankDetails(perPage, page)
  }

  const editBankDetails = async (id) => {
    await fetch(`${API}/lmpBankDetail?id=${id}`, {
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
        setEditBankName(res.data.bankName)
        setEditAccountNumber(res.data.accountNumber)
        setEditIBNNumber(res.data.ibanNumber)
        setEditSwiftCode(res.data.swiftCode)
        setEditAddress(res.data.address)
        setEditSingleLOB(res.data.lob)
        setStatus(res.data.bankstatus)
        setVisibleedit(true)
      })
      .catch((e) => console.log(e))
  }

  const updateBankDetails = async (id, e) => {
    e.preventDefault()
    await fetch(`${API}/lmpBankDetail?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        bankName: editBankName,
        accountNumber: editAccountNumber,
        bankstatus: status,
        ibanNumber: editIBNNumber,
        swiftCode: editSwiftCode,
        address: editAddress,
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
            getBankDetails(perPage, page)
          })
        } else {
          setVisibleedit(false)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            getBankDetails(perPage, page)
          })
        }
      })
  }

  const addBankDetails = async (e) => {
    e.preventDefault()
    await fetch(`${API}/lmpBankDetail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bankName: editBankName,
        accountNumber: editAccountNumber,
        bankstatus: status,
        lob: editSingleLOB,
        ibanNumber: editIBNNumber,
        swiftCode: editSwiftCode,
        address: editAddress,
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
            getBankDetails(perPage, page)
          })
        } else {
          setShowModal(false)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            getBankDetails(perPage, page)
          })
        }
      })
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected
    setPage(selectedPage + 1)
    getBankDetails(perPage, selectedPage + 1)
  }

  const getLobDetails = async () => {
    await fetch(`${API}/get_line_of_business_list`)
      .then((res) => res.json())
      .then((res) => setEditLOB(res.data))
      .catch((e) => console.log(e))
  }

  const findLOB = (id) => {
    const value = editLOB.length > 0 && editLOB.filter((val) => val._id === id)
    return value[0]?.line_of_business_name ? value[0]?.line_of_business_name : ''
  }
  const startFrom = (page - 1) * perPage;
  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Bank Details</h4>
              </div>
              <div className="col-md-6">
                {masterPermission.bank_details?.includes('create') ? (
                  <button
                    className="btn btn-primary"
                    style={{ float: 'right' }}
                    onClick={() => setShowModal(true)}
                  >
                    Add Bank Details
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
                  <th scope="col">Bank Name</th>
                  <th scope="col">Account Number</th>
                  <th scope="col">IBN Number</th>
                  <th scope="col">Swift Code</th>
                  <th scope="col">LOB</th>
                  <th scope="col">Address</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {bankDetails?.length > 0 ? (
                  bankDetails.map((item, index) => (
                    <tr key={index}>
                      <td>{startFrom + index + 1}</td>
                      <td>{item.bankName}</td>
                      <td>{item.accountNumber}</td>
                      <td>{item.ibanNumber}</td>
                      <td>{item.swiftCode}</td>
                      <td>{findLOB(item.lob) || ''}</td>
                      <td className='text-wrap'>{item.address}</td>
                      <td>{item.bankstatus == true ? 'Active' : 'Inactive'}</td>
                      <td>
                        {masterPermission.bank_details?.includes('edit') && (
                          <button
                            className="btn btn-primary"
                            onClick={() => editBankDetails(item._id)}
                          >
                            Edit
                          </button>
                        )}{' '}
                        {masterPermission.bank_details?.includes('delete') && (
                          <>
                            {item.bankstatus === true ? (
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
          <Modal.Title>Add Bank Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form method="POST" onSubmit={(e) => addBankDetails(e)}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong> Bank Name</strong>
                          </label>
                          <input
                            className="form-control"
                            name="bankName"
                            type="text"
                            onChange={(e) => setEditBankName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong> Account Number</strong>
                          </label>
                          <input
                            className="form-control"
                            name="accountNumber"
                            type="text"
                            onChange={(e) => setEditAccountNumber(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong> IBN Number</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="ibanNumber"
                            onChange={(e) => setEditIBNNumber(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong> Swift Code</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="swiftCode"
                            onChange={(e) => setEditSwiftCode(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong> Address</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="address"
                            onChange={(e) => setEditAddress(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">
                              <strong> LOB</strong>
                            </label>
                            <select
                              className="form-control"
                              name="status"
                              onChange={(e) => setEditSingleLOB(e.target.value)}
                            >
                              <option hidden>Select LOB</option>
                              {editLOB.map((val) => (
                                <option key={val._id} value={val._id}>
                                  {val.line_of_business_name}
                                </option>
                              ))}
                            </select>
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
          <Modal.Title>Edit Bank Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form method="PUT" onSubmit={(e) => updateBankDetails(socialId, e)}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Bank Name</strong>
                          </label>
                          <input
                            className="form-control"
                            name="bankName"
                            type="text"
                            defaultValue={getWillUpdateData?.bankName}
                            onChange={(e) => setEditBankName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Account Number</strong>
                          </label>
                          <input
                            className="form-control"
                            name="accountNumber"
                            type="text"
                            defaultValue={getWillUpdateData?.accountNumber}
                            onChange={(e) => setEditAccountNumber(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit IBN Number</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="ibanNumber"
                            defaultValue={getWillUpdateData?.ibanNumber}
                            onChange={(e) => setEditIBNNumber(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Swift Code</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="swiftCode"
                            defaultValue={getWillUpdateData?.swiftCode}
                            onChange={(e) => setEditSwiftCode(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Edit Address</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="address"
                            defaultValue={getWillUpdateData?.address}
                            onChange={(e) => setEditAddress(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">
                              <strong>Edit LOB</strong>
                            </label>
                            <select
                              className="form-control"
                              name="status"
                              // defaultValue={
                              //   getWillUpdateData.lob && editLOB && findLOB(getWillUpdateData?.lob)
                              // }
                              onChange={(e) => setEditSingleLOB(e.target.value)}
                            >
                              <option hidden>Select Status</option>
                              {editLOB.map((val) => (
                                <option
                                  key={val._id}
                                  value={val._id}
                                  selected={getWillUpdateData?.lob === val._id}
                                >
                                  {val.line_of_business_name}
                                </option>
                              ))}
                            </select>
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

export default BankDetails
