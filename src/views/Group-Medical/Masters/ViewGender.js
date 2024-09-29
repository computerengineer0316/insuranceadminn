import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useState } from 'react'
import { Container, Row, Modal, Button, Accordion } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import swal from 'sweetalert';


const ViewGender = () => {

  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [showAddModal, SetShowAddModal] = useState(false);
  const [locationlist, setLocation] = useState([]);
  const [defaultLocation, setDefaultLication] = useState([]);
  const [showEditModal, SetShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [gender, setGender] = useState([])
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token == null || token == undefined || token == '') {
      window.location = '/login';
    } else {
      getGender(page, perPage);
      getlocationlist();
      // getClaimType()
    }

  }, []);
  const getlocationlist = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const locationdt = data.data;
        const locData = [];
        for (let i = 0; i < locationdt.length; i++) {
          locData.push({
            label: locationdt[i].location_name,
            value: locationdt[i]._id
          })

        }
        setLocation(locData);
        setDefaultLication(locData);

      })
  }
  const getGender = (page, limit) => {
    const reqOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getGender?page=${page}&limit=${limit}`, reqOptions)
      .then(response => response.json())
      .then(data => {
        setGender(data.data)
        console.log(data.data, "gender data")
      })

  }
  const AddGender = (e) => {
    e.preventDefault(e)
    const data = new FormData(e.target)
    const name = data.get("gender")
    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        location: defaultLocation
      })
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/addGender`, reqOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status == 201) {
          getGender(page, perPage);

          SetShowAddModal(false)
          swal({
            type: 'success',
            text: 'Data Added Successful',
            icon: 'success',
            button: false
          })
          setTimeout(() => {
            swal.close()
          }, 1000);
        } else {
          getGender(page, perPage);
          SetShowAddModal(false)

          swal({
            type: 'error',
            text: 'Something went wrong',
            icon: "error",
            button: false
          })
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
      })

  }
  const goTosetShowEditModal = (id) => {
    const reqOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getGenderbyid?id=${id}`, reqOptions)
      .then(response => response.json())
      .then(data => {
        const category = data.data;
        console.log(category, 'edit data>>>>')
        setEditData(category[0])
        const loc = category[0]?.location?.map((item) => {
          return {
            label: item.location_name,
            value: item._id
          }
        })
        setDefaultLication(loc);
        SetShowEditModal(true);
      })
  }
  const EditGender = (e) => {
    e.preventDefault();
    const data = new FormData(e.target)
    const name = data.get('gender')
    const reqOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, location: defaultLocation })
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/updateGender?id=${editData?._id}`, reqOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status == 200) {
          SetShowEditModal(false);
          swal({
            type: "Success",
            text: data.message,
            icon: "success",
            button: false
          });
          getGender(page, perPage);
          setTimeout(() => {
            swal.close();
          }, 1000);
        } else {
          SetShowEditModal(false);
          swal({
            type: "Error",
            text: data.message,
            icon: "error",
            button: false
          });
          getGender(page, perPage);
          setTimeout(() => {
            swal.close();
          }, 1000);
        }
      })
  }
  const ActivateDeactivate = (id, status) => {
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/updateGender?id=${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status == 200) {
          swal({
            type: "Success",
            text: data.message,
            icon: "success",
            button: false
          });
          getGender(page, perPage);
          setTimeout(() => {
            swal.close();
          }, 1000);
        } else {
          swal({
            type: "Error",
            text: data.message,
            icon: "error",
            button: false
          });
          getGender(page, perPage);
          setTimeout(() => {
            swal.close();
          }, 1000);
        }
      });

  }
  const deleteItem = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteGroupMedicalMaster?id=${id}&type=Gender`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          getGender(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
        else {
          swal({
            title: "Error!",
            text: data.message,
            icon: "error",
            button: false,
          })
          setTimeout(() => {
            swal.close()
          }, 1000);
        }

      })
  }
  const handlePageClick = (data) => {
    const selected = data.selected;
    setPage(selected + 1);
    getGender(selected + 1, perPage);
  };
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <div className='card'>
            <div className='card-header'>
              <div className='row'>
                <div className='col-md-4'>
                  <h4>Gender</h4>
                </div>
                <div className='col-md-8' >
                  <button className='btn btn-primary' onClick={() => SetShowAddModal(true)} style={{ float: 'right' }}>Add Gender</button>
                </div>

              </div>
            </div>
            <div className='card-body'>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="thead-dark">
                    <tr className="table-info">
                      <th>Sr No.</th>
                      <th>Gender</th>
                      <th>Location</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gender?.length ? gender?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td><p className='text-wrap'>{item.name}</p></td>
                          <td>{item.location?.map((item) => item.location_name).join(',')}</td>
                          <td>
                            <div className="btn-group" role="group" aria-label="Basic example">
                              <button className="btn btn-info"
                                onClick={() => goTosetShowEditModal(item._id)}
                              >Edit</button>
                            </div>&nbsp;&nbsp;
                            {
                              item.status == 1 ?
                                <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger"
                                  onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) ActivateDeactivate(item._id, 0) }}
                                >Deactivate</button></div> :
                                <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success"
                                  onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) ActivateDeactivate(item._id, 1) }}
                                >Activate</button></div>
                            }&nbsp;&nbsp;
                            <div className="btn-group" role="group" aria-label="Basic example">
                              <button className="btn btn-warning"
                                onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}
                              >Delete</button>
                            </div>
                          </td>
                        </tr>
                      )
                    }) : <tr><td colSpan='5'>No Data Found</td></tr>
                    }
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
            <Modal size='lg' show={showAddModal} onHide={() => SetShowAddModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Add Gender</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card">

                        <div className="card-body">
                          <form method='POST' onSubmit={AddGender}>
                            <div className="row">
                              <div className='col-lg-6'>
                                <label><strong>Gender</strong></label><br />
                                <input type='text' name='gender' className='form-control' />
                              </div>
                              {/* </div> */}
                              {/* <div className="row"> */}
                              <div className='col-lg-6'>
                                <label><strong>Location</strong></label><br />
                                <Multiselect
                                  options={locationlist}
                                  selectedValues={locationlist}
                                  onSelect={(event) => setDefaultLication(event)}
                                  onRemove={(event) => setDefaultLication(event)}
                                  displayValue="label"
                                  placeholder="Select Location"
                                  closeOnSelect={false}
                                  avoidHighlightFirstOption={true}
                                  showCheckbox={true}
                                  style={{ chips: { background: "#007bff" } }}
                                />
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
                <Button variant="secondary" onClick={() => SetShowAddModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal size='lg' show={showEditModal} onHide={() => SetShowEditModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Gender</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card">

                        <div className="card-body">
                          <form method='POST'
                            onSubmit={EditGender}
                          >
                            <div className="row">
                              <div className='col-lg-12'>
                                <label><strong>Gender</strong></label><br />
                                <input type='text' className='form-control' defaultValue={editData?.name} name='gender' />
                              </div>
                            </div>
                            <div className="row">
                              <div className='col-lg-6'>
                                <label><strong>Location</strong></label><br />
                                <Multiselect
                                  options={locationlist}
                                  selectedValues={defaultLocation}
                                  onSelect={(event) => setDefaultLication(event)}
                                  onRemove={(event) => setDefaultLication(event)}
                                  displayValue="label"
                                  placeholder="Select Location"
                                  closeOnSelect={false}
                                  avoidHighlightFirstOption={true}
                                  showCheckbox={true}
                                  style={{ chips: { background: "#007bff" } }}
                                />
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
          </div>
        </div>
      </div>

    </div>
  )
}


export default ViewGender
