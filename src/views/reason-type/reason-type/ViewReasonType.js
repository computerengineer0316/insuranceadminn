import React, { useState, useEffect } from 'react'
import { Container, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";
import axios from 'axios';

const ViewReasonType = () => {
  const navigate = useNavigate();
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [reason_type, setReasonType] = useState([]);
  const [reson_details, setReasonDetails] = useState([]);
  const [id, setId] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState([]);
  const [defaultlocation, setDefaultLocation] = useState([]);
  const [masterpermission, setMasterPermission] = useState([]);
  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const master_permission = userdata?.master_permission?.[0] || {};
    setMasterPermission(master_permission);
    getReasons(page, perPage);
    locationList();
  }, [])



  const getReasons = async (page, perPage) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Reason_Type/${page}/${perPage}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data, "result");
        const total = data.total;
        const slice = total / perPage;
        const pages = Math.ceil(slice);
        setPageCount(pages);
        const list = data.data;
        console.log(list, "list");
        setReasonType(list);
        // const list_len = list.length;
        // for (let i = 0; i < list_len; i++) {
        //   setReasonType(list[i]);
        // }
      });
  }

  const handlesubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const reason_type = data.get('reason_type');
    await fetch('https://insuranceapi-3o5t.onrender.com/api/add_Reason_Type', {
      method: 'POST',
      body: JSON.stringify({
        reason_type: reason_type,
        location: defaultlocation,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.status === 200) {

          swal({
            title: "Reason Type Updated Successfully!",
            type: "success",
            icon: "success",
            button: false,
          });
          setShowModal(false);
          getReasons(page, perPage);
          setTimeout(() => {
            swal.close();
          }, 2000);
        } else {
          swal("Oops!", "Something went wrong!", "error");
        }
      })

  }

  const detailsbyid = (ParamValue) => {
    setId(ParamValue);
    const requestOptions = {
      method: "post",
      body: JSON.stringify({ ParamValue }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Reason_Type_byid`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data, "result by id");
        setReasonDetails(data.data[0]);
        const locationdt = data.data[0]?.location;
        const location_list = [];
        for (let i = 0; i < locationdt.length; i++) {
          const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
          location_list.push(location_obj);
        }
        setDefaultLocation(location_list)
        setVisible(true);
      });
  }

  const locationList = () => {
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
        const location_len = locationdt.length;
        const location_list = [];
        for (let i = 0; i < location_len; i++) {
          const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
          location_list.push(location_obj);
        }
        setDefaultLocation(location_list)
        setLocation(location_list);
      });
  }

  const updateReasonType = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const reason_type = data.get('reason_type');

    console.log(reason_type);
    console.log(id);
    await fetch('https://insuranceapi-3o5t.onrender.com/api/update_Reason_Type', {
      method: 'POST',
      body: JSON.stringify({
        reason_type: reason_type,
        location: defaultlocation,
        ParamValue: id,
      }),
      headers: {

        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.status === 200) {
          swal({
            title: "Reason Type Updated Successfully!",
            type: "success",
            icon: "success",
            button: false,
          });
          setVisible(false);
          getReasons(page, perPage);
          setTimeout(() => {
            swal.close();
          }
            , 1000);
        } else {
          swal({
            title: "Error!",
            text: "Something went wrong!",
            type: "error",
            icon: "error",
            button: false,
          });
          setTimeout(() => {
            swal.close();
          }
            , 1000);
        }
      })
  }


  const updatestatus = async (id, status) => {
    try {
      await fetch('https://insuranceapi-3o5t.onrender.com/api/update_Reason_Type', {
        method: 'POST',
        body: JSON.stringify({
          reason_status: status,
          ParamValue: id,
        }),
        headers: {

          "Content-Type": "application/json"
        }
      }).then((data) => {
        if (data.status == 200) {
          console.log(data, "response data>>>>>>>>>>")
          setShowModal(false)
          swal({
            title: "Status Updated Successfully!",
            type: 'success',
            icon: 'success',
            button: false,
          })
          getReasons(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        } else {
          setShowModal(false)
          swal({
            title: "Something went wrong!",
            type: 'error',
            icon: 'error',
            button: false,
          })
          getReasons(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  const deleteItem = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMasterData/?id=${id}&type=reasons_type`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          getReasons(page, perPage);
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
          getReasons(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }

      })
  }
  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getReasons(selectedPage + 1, perPage);
  };
  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Reason Type Details</h4>
              </div>
              <div className="col-md-6">
                {masterpermission?.reason_type?.includes('create') ?
                  <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add Reasons</button>
                  : ""}
              </div>
            </div>
          </div>
          <div className="card-header" style={{ textAlign: 'right' }}>
            {/* <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a> */}
            {/* <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button> */}
            {/* <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button> */}
          </div>
          <div className="card-body">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>
                  <th scope="col">Reasons</th>
                  <th scope="col">Location</th>
                  <th scope="col">Action</th>


                </tr>
              </thead>
              <tbody>
                {
                  reason_type?.length > 0 ?
                    reason_type.map((item, index) =>
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.reason_type}</td>
                        <td>{item.location?.map((Val) => Val.location_name)?.join(", ")}</td>
                        <td>
                          {masterpermission?.reason_type.includes('edit') ?
                            <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>
                            : ""}
                          {' '}
                          {masterpermission?.reason_type?.includes('delete') && (
                            <>
                              {
                                item.status == 1 ?
                                  <button className="btn btn-danger mx-1" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                  <button className="btn btn-success mx-1" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                              }
                              <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to Delete this item?')) deleteItem(item._id) }}>Delete</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ) : <tr>
                      <td colSpan="6">No Data Found</td>
                    </tr>
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
      </Container>
      <CModal size='lg' visible={showModal} onHide={() => setShowModal(false)}>
        <CModalHeader onClose={() => setShowModal(false)} >
          <CModalTitle>Add Reason Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={handlesubmit}>
                      <div className="row">
                        <div className="col-md-6">

                          <label className="form-label"><strong>Add Reason Type</strong></label>
                          <input type='text' className="form-control"
                            name='reason_type'
                            placeholder="Enter Reason Type"
                            defaultValue=""
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Location</label>
                            <Multiselect
                              options={location}
                              selectedValues={location}
                              onSelect={(evnt) => (setDefaultLocation(evnt))}
                              onRemove={(evnt) => (setDefaultLocation(evnt))}
                              displayValue="label"
                              placeholder="Select Location"
                              closeOnSelect={false}
                              avoidHighlightFirstOption={true}
                              showCheckbox={true}
                              style={{ chips: { background: "#007bff" } }}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Submit</button>

                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <Modal size='lg' show={visible} onHide={() => setVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Reason Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={updateReasonType}>
                      <div className="row">
                        <div className="col-md-6">

                          <label className="form-label"><strong>Edit Reason Type</strong></label>
                          <input type='text' className="form-control"
                            name='reason_type'
                            placeholder='Reason'
                            defaultValue={reson_details?.reason_type}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Location</label>
                            <Multiselect
                              options={location}
                              selectedValues={defaultlocation}
                              onSelect={(evnt) => (setDefaultLocation(evnt))}
                              onRemove={(evnt) => (setDefaultLocation(evnt))}
                              displayValue="label"
                              placeholder="Select Location"
                              closeOnSelect={false}
                              avoidHighlightFirstOption={true}
                              showCheckbox={true}
                              style={{ chips: { background: "#007bff" } }}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Submit</button>
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
          <Button variant="secondary" onClick={() => setVisible(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ViewReasonType