import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import swal from 'sweetalert';

const ViewClaimProcedure = () => {
  const navigate = useNavigate()
  const [proceduredata, setProcedureData] = useState([])
  const [showEditModal, SetShowEditModal] = useState(false)
  const [ShowImageModal, setShowImageModal] = useState(false)
  const [editData, setEditData] = useState({})
  const [image, setImage] = useState('')
  const [descriptions, AddDescription] = useState([{
    description: '',
    link: '',
    point_no: ''
  }])
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getClaimProcedure();

    }
  }, [])
  const getClaimProcedure = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    const response = await fetch('https://insuranceapi-3o5t.onrender.com/api/getClaimProcedure', requestOptions)
    const data = await response.json()
    console.log("procedure data", data)
    setProcedureData(data.data)
  }
  const getClaimProcedureById = async (id) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    const response = await fetch(`https://insuranceapi-3o5t.onrender.com/api/getClaimProcedureById?id=${id}`, requestOptions)
    const data = await response.json()
    console.log(data.data, "edit data")
    setEditData(data.data[0])
    SetShowEditModal(true)
  }
  const UpdateClaimProcedure = async (e) => {
    e.preventDefault()
    const targetdata = new FormData(e.target)
    const claim_procedure = targetdata.get('claim_procedure')
    const link = targetdata.get('link')
    const heading = targetdata.get('heading')

    const response = await fetch(`https://insuranceapi-3o5t.onrender.com/api/updateClaimProcedure?id=${editData._id}`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          claim_procedure: claim_procedure,
          link: link,
          heading: heading
        }),
      })
    const data = await response.json()
    if (data.status === 200) {
      SetShowEditModal(false)
      swal({
        title: "Success!",
        text: data.message,
        type: "success",
        icon: "success",
        button: false
      })

      getClaimProcedure()
      setTimeout(() => {
        swal.close()
      }, 2000);
    }
  }
  const gotoSeefile = (file) => {
    setImage(file)
    // window.open(`https://insuranceapi-3o5t.onrender.com/uploads/${file}`)
    setShowImageModal(true)

  }
  const DeleteDescription = (id) => {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },

      }
      fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteGroupMedicalMaster?id=${id}&type=ClaimProcedure`, requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.status == 200) {
            swal({
              title: "Success!",
              text: data.message,
              type: "success",
              icon: "success",
              button: false
            })

            getClaimProcedure()
            setTimeout(() => {
              swal.close()
            }, 2000);
          }
          else {
            swal({
              title: "Error!",
              text: data.message,
              type: "error",
              icon: "error",
              button: false
            })
            getClaimProcedure()
            setTimeout(() => {
              swal.close()
            }, 2000);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
  const goToEdit = (item) => {
    setEditData(item)
    SetShowEditModal(true)
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-4">
                  <h4 className="card-title">Claim Procedure</h4>
                </div>
                <div className='col-md-8'>
                  <button className='btn btn-primary' onClick={() => navigate('/AddGroupMedicalClaim')} style={{ float: 'right' }}>Add Claim Procesude</button>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="thead-dark">
                    <tr className="table-info" >
                      {/* <th>Company</th> */}
                      {/* <th>Claim Procedure</th> */}
                      {/* <th>View</th> */}
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {
                      proceduredata && proceduredata.length > 0 ?
                        proceduredata.map((item, index) => (

                          <tr key={index}>
                            {/* <td>{index + 1}</td> */}
                            {/* <td className='col-md-6'><p style={{ width: '400px', overflow: 'clip' }}>{item.companydata?.company_name}</p></td>  */}
                            {/* <td> <button className='btn btn-info mx-2' onClick={() => swal({ text: item.procedure_description })}> Description</button>
                                <button className='btn btn-warning' onClick={() => gotoSeefile(item.file)}> File</button></td> */}

                            <td>
                              <th><h5 className='text-danger'><b>{item.companydata?.company_name}</b></h5></th>
                              <table className="table table-bordered">
                                <thead className="thead-dark">
                                  <tr className="table-info" >
                                    <th><strong>Heading</strong></th>
                                    <th><strong>Description</strong></th>
                                    <th><strong>Link </strong></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    item.documents?.map((item2, index1) => (
                                      <tr key={index1}>
                                        <td>{item2.heading}</td>
                                        <td><p className='text-wrap'>{item2.procedure_description}</p></td>
                                        <td>{item2.link}</td>
                                        <td>
                                          <button onClick={() => swal({ text: item2.procedure_description })} className='btn btn-info mx-1'><i className="fa fa-eye" aria-hidden="true"></i></button>
                                          <button onClick={() => goToEdit(item2)} className='btn btn-primary mx-1'><i className="fa fa-edit" aria-hidden="true"></i></button>
                                          <button onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) DeleteDescription(item2._id) }} className='btn btn-danger mx-1'><i className="fa fa-trash" aria-hidden="true"></i></button>
                                        </td>
                                      </tr>
                                    ))
                                  }
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )) : <tr><td colSpan="5">No data found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            <Modal size='lg'
              show={showAddModal}
              onHide={() => setShowAddModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Add Group Medical Claim Status</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className='container'>
                  <div className='row'>
                    <div className='col-md-12'>
                      <div className='card'>
                        <div className='card-body'>
                          <form method='POST' >
                            <div className='row'>
                              <div className='col-lg-12'>
                                {/* <table>
                                  <thead>
                                    <th>Point No.</th>
                                    <th>Description</th>
                                    <th>Link</th>
                                  </thead>
                                  <tbody>
                              
                                  </tbody>
                                </table> */}
                                {descriptions?.map((item, index) => (
                                  <div key={index} className='container col-lg-12'>
                                    <div className='row'>
                                      <div className='col-md-4'>
                                        <div className='form-group'>
                                          <label><strong>Heading</strong></label>
                                          <input type='text' name='point_no' className='form-control' />
                                        </div>
                                      </div>
                                      <div className='col-md-8'>
                                        <div className='form-group'>
                                          <label><strong>Link</strong></label>
                                          <input type='text' name='link' className='form-control' />
                                        </div>
                                      </div>
                                    </div>

                                    <div className='col-md-12'>
                                      <label><strong>Description</strong></label>
                                      <textarea rows={4} type='text' className='form-control' name='description' />
                                    </div>
                                    {/* <div className='form-group'></div> */}
                                    {/* <div className='form-group'></div> */}
                                  </div>
                                ))
                                }
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
                <Button variant='secondary' onHide={() => setShowAddModal(false)}>Close</Button>
              </Modal.Footer>
            </Modal>
            <Modal size='lg' show={showEditModal} onHide={() => SetShowEditModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Group Medical Claim Status</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card">

                        <div className="card-body">
                          <form method='POST' onSubmit={UpdateClaimProcedure}>
                            <div className="row">
                              <div className='col-lg-12'>
                                <label><strong>Description</strong></label><br />
                                <textarea type='text' className='form-control' rows="4" cols="10" defaultValue={editData?.procedure_description} name='claim_procedure' />
                              </div>
                              <div className='col-lg-6'>
                                <label><strong>Heading</strong></label><br />
                                <input type='text' className='form-control' defaultValue={editData?.heading} name='heading' />
                              </div>
                              <div className='col-lg-6'>
                                <label><strong>Link</strong></label><br />
                                <input type='text' className='form-control' defaultValue={editData?.link} name='link' />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-12">
                                <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }} >Submit</button>
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
                <Button variant="secondary" onClick={() => SetShowEditModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal size='lg' show={ShowImageModal} onHide={() => setShowImageModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>View File</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-12">
                              <img src={`https://insuranceapi-3o5t.onrender.com/uploads/${image}`} style={{ width: '100%', height: '100%' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowImageModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewClaimProcedure
