import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import filePath from '../../webroot/sample-files/user-type.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import swal from 'sweetalert'
import Multiselect from 'multiselect-react-dropdown'
import DatePicker from 'react-datepicker' //https://www.npmjs.com/package/react-datepicker
import 'react-datepicker/dist/react-datepicker.css'

const Termscondition = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [perPage] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(1)
  const [excelfile, setExcelfile] = useState('')
  const [usertype, setUsertype] = useState('')
  const [usertype_status, setUsertypestatus] = useState('')
  const [id, setId] = useState('')
  const [visible, setVisible] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [visibleedit, setVisibleedit] = useState(false)
  const [masterpermission, setMasterpermission] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    } else {
      gettermscondition(page, perPage)
      const userdata = JSON.parse(localStorage.getItem('user'))
      const master_permission = userdata?.master_permission?.[0] || {}
      console.log('master_permission', master_permission)
      setMasterpermission(master_permission)
      loblist()
    }
  }, [])

  const [customerslistdata, setCustomerslistdata] = useState([])
  const [selectedcustomer, setSelectedcustomer] = useState([])
  const [loblistdata, setLoblistdata] = useState([])
  const [selectedlob, setSelectedlob] = useState([])
  const [selectedlobdata, setSelectedlobdata] = useState('')
  const [termscondition, setTermscondition] = useState('')
  const [details, setDetails] = useState([])

  const loblist = () => {
    var requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch('https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.data.map((lob) => ({
          label: lob.line_of_business_name, // Displayed name in the dropdown
          value: lob._id, // Value to be associated with the selected option
        }))
        setLoblistdata(formattedOptions)
      })
  }
  console.log(loblistdata)

  const gettermscondition = (page, perPage) => {
    setData([])
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getAllTermsCondition/${perPage}/${page}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const total = data.data[0]?.count[0]?.total;
        console.log('data', total)
        const slice = total / perPage
        const pages = Math.ceil(slice)
        setPageCount(pages)
        const list = data.data[0]?.data
        setData(list)
      })
  }

  console.log(data)

  const fileType = 'xlsx'
  const exporttocsv = () => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { booktype: 'xlsx', type: 'array' })
    const newdata = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(newdata, 'User-type' + '.xlsx')
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected
    setPage(selectedPage + 1)
    gettermscondition(selectedPage + 1, perPage)
  }

  const updatestatus = async (id, status) => {
    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/termsAndCondition?id=${id}`, {
      method: 'put',
      body: JSON.stringify({ status: status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json()
    swal('Updated Succesfully', '', 'success')
    gettermscondition(page, perPage)
  }

  const collectExceldata = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('file', excelfile)
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/read_user_type_excel ', {
      method: 'post',
      body: fd,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setVisible(!visible)
          swal({
            title: 'Wow!',
            text: data.message,
            type: 'success',
            icon: 'success',
          }).then(function () {
            gettermscondition(page, perPage)
          })
        } else {
          setVisible(!visible)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            gettermscondition(page, perPage)
          })
        }
      })
  }

  const addtermscondition = async (e) => {
    e.preventDefault()

    await fetch('https://insuranceapi-3o5t.onrender.com/api/termsAndCondition', {
      method: 'post',
      body: JSON.stringify({ lob: selectedlobdata, terms_constions: termscondition }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 201) {
          setShowModal(false)
          swal({
            title: 'Wow!',
            text: data.message,
            type: 'success',
            icon: 'success',
          }).then(function () {
            gettermscondition(page, perPage)
          })
        } else {
          setShowModal(false)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            gettermscondition(page, perPage)
          })
        }
      })
  }

  const [selectedLobdata, setSelectedLobdata] = useState()

  const getdetails = async (ParamValue) => {
    setId(ParamValue)
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/gettermsconditionbyid', {
      method: 'post',
      body: JSON.stringify({ ParamValue: ParamValue }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    result = await result.json()
    setDetails(result.data)
    setVisibleedit(true)
  }
  console.log(details)

  const [editlob, setEditlob] = useState()
  const [edittermscondition, setEdittermscondition] = useState()

  const updatetermsconditions = async (e) => {
    e.preventDefault()

    await fetch(`https://insuranceapi-3o5t.onrender.com/api/termsAndCondition?id=${id}`, {
      method: 'put',
      body: JSON.stringify({
        id: id,
        lob: editlob,
        terms_constions: edittermscondition,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setVisibleedit(false)
          swal({
            title: 'Wow!',
            text: data.message,
            type: 'success',
            icon: 'success',
          }).then(function () {
            gettermscondition(page, perPage)
          })
        } else {
          setVisibleedit(false)
          swal({
            title: 'Error!',
            text: data.message,
            type: 'error',
            icon: 'error',
          }).then(function () {
            gettermscondition(page, perPage)
          })
        }
      })
  }
  const ViewTermsCoditions = (terms_constions) => {
    swal({
      text: terms_constions,
      button: "Close"
    })
  }
  const startFrom = (page - 1) * perPage

  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Terms & Conditions</h4>
              </div>
              <div className="col-md-6">
                {masterpermission.usertype?.includes('create') ? (
                  <button
                    className="btn btn-primary"
                    style={{ float: 'right' }}
                    onClick={() => setShowModal(true)}
                  >
                    Add Terms & Conditions
                  </button>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
          {/* <div className="card-header" style={{ textAlign: 'right' }}>
            { masterpermission?.terms_conditions?.includes('download') ?
            <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
            : '' }
            { masterpermission?.terms_conditions?.includes('upload') ?
            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
            : '' }
            { masterpermission?.terms_conditions?.includes('export') ?
            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
            : '' }
          </div> */}
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="thead-dark">
                  <tr className="table-info">
                    <th scope="col">#</th>
                    {/* <th scope="col">userId</th> */}
                    <th scope="col">Line Of Business</th>
                    <th scope="col">Read</th>
                    {/* <th scope="col">Terms & Conditions</th> */}
                    <th scope="col">Status</th>
                    {/* <th scope="col">Date</th> */}
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={index}>
                        <td>{startFrom + index + 1}</td>
                        {/* <td>{item.userId}</td> */}
                        <td>{item.lobdetails?.map((data) => data.line_of_business_name)}</td>
                        <td className='text-wrap' onClick={() => ViewTermsCoditions(item.terms_constions)} >
                          <button className='btn btn-warning'>View</button>
                        </td>
                        {/* <td >
                          {item.terms_constions}
                        </td> */}

                        <td>{item.status == true ? 'Active' : 'Inactive'}</td>
                        {/* <td>{new Date(item.startDate).toLocaleString()}</td> */}
                        <td>
                          {masterpermission?.terms_conditions?.includes('edit') && (
                            <button className="btn btn-primary" onClick={() => getdetails(item._id)}>
                              Edit
                            </button>
                          )}{' '}
                          {masterpermission?.terms_conditions?.includes('delete') && (
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
        </div>
      </Container>
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Upload Excel File</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>
            {/* <label className="form-label"><strong>Upload Excel File</strong></label> */}
            <input
              type="file"
              className="form-control"
              id="DHA"
              defaultValue=""
              required
              onChange={(e) => setExcelfile(e.target.files[0])}
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={collectExceldata} href={'/Viewtraveltype'}>
            Upload
          </CButton>
        </CModalFooter>
      </CModal>

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
                    <form>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Add Line Of Business</strong>
                          </label>

                          <select
                            className="form-control"
                            name="usertype_status"
                            onChange={(e) => setSelectedlobdata(e.target.value)}
                          >
                            <option hidden defaultValue="">
                              Select Line Of Business
                            </option>
                            {loblistdata?.map((item, index) => (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">
                            <strong>Add Terms & Condition</strong>
                          </label>

                          <textarea
                            className="form-control"
                            rows="3"
                            name="terms_constions"
                            placeholder="Enter Terms & Condition"
                            onChange={(e) => setTermscondition(e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button
                            type="submit"
                            className="btn btn-primary mt-2 submit_all"
                            style={{ float: 'right' }}
                            onClick={addtermscondition}
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
                    <form>
                      {details?.map((data, index1) => (
                        <div className="row" key={index1}>
                          <div className="col-md-6">
                            <label className="form-label">
                              <strong>Edit User</strong>
                            </label>
                            <select
                              className="form-control"
                              name="usertype_status"
                              onChange={(e) => setEditlob(e.target.value)}
                            >
                              <option hidden defaultValue={data.lobdetails}>
                                {data.lobdetails[0]?.line_of_business_name}
                              </option>
                              {loblistdata?.map((item, index) => (
                                <option key={index} value={item.value}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">
                              <strong>Edit Terms & Condition</strong>
                            </label>
                            <textarea
                              className="form-control"
                              rows="3"
                              name="terms_constions"
                              placeholder="Enter Terms & Condition"
                              defaultValue={data.terms_constions}
                              onChange={(e) => setEdittermscondition(e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="row">
                        <div className="col-md-12">
                          <button
                            type="submit"
                            className="btn btn-primary mt-2 submit_all"
                            style={{ float: 'right' }}
                            onClick={updatetermsconditions}
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

export default Termscondition
