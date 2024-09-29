import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import filePath from '../../webroot/sample-files/user-type.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';

const ViewUsertype = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [excelfile, setExcelfile] = useState("");
  const [usertype, setUsertype] = useState('');
  const [usertype_status, setUsertypestatus] = useState('');
  const [id, setId] = useState('');
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [visibleedit, setVisibleedit] = useState(false);
  const [masterpermission, setMasterpermission] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getusertypelist(page, perPage);
      const userdata = JSON.parse(localStorage.getItem('user'));
      const master_permission = userdata?.master_permission?.[0] || {};
      setMasterpermission(master_permission);
    }
  }, [])

  const getusertypelist = (page, perPage) => {
    try {
      setData([]);
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      fetch(`https://insuranceapi-3o5t.onrender.com/api/get_user_type/${page}/${perPage}`, requestOptions)
        .then(response => response.json())
        .then(
          data => {
            const total = data.total;
            const slice = total / perPage;
            const pages = Math.ceil(slice);
            setPageCount(pages);
            const list = data.data;
            setData(list)
          }
        );
    } catch (error) {
      console.log(error)
    }
  }

  const fileType = 'xlsx'
  const exporttocsv = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
    const newdata = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(newdata, "User-type" + ".xlsx")
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getusertypelist(selectedPage + 1, perPage);
  };


  const updatestatus = async (id, usertype_status) => {

    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_user_type_status', {
      method: 'post',
      body: JSON.stringify({ id, usertype_status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    swal("Updated Succesfully", "", "success");
    getusertypelist(page, perPage)
  }

  const collectExceldata = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('file', excelfile)
    let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_user_type_excel ",
      {
        method: "post",
        body: fd,
      })
      .then(response => response.json())
      .then(data => {
        if (data.status == 200) {
          setVisible(!visible)
          swal({
            title: "Wow!",
            text: data.message,
            type: "success",
            icon: "success"
          }).then(function () {
            getusertypelist(page, perPage);
          });
        }
        else {
          setVisible(!visible)
          swal({
            title: "Error!",
            text: data.message,
            type: "error",
            icon: "error"
          }).then(function () {
            getusertypelist(page, perPage);
          });
        }
      });
  }


  const addusertype = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const usertype = data.get('usertype');
    const usertype_status = data.get('usertype_status');
    await fetch('https://insuranceapi-3o5t.onrender.com/api/add_user_type', {
      method: 'post',
      body: JSON.stringify({ usertype: usertype }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status == 200) {
          setShowModal(false);
          swal({
            title: "Wow!",
            text: data.message,
            type: "success",
            icon: "success"
          }).then(function () {
            getusertypelist(page, perPage);
          });
        }
        else {
          setShowModal(false);
          swal({
            title: "Error!",
            text: data.message,
            type: "error",
            icon: "error"
          }).then(function () {
            getusertypelist(page, perPage);
          });
        }
      });
  }

  const getdetails = async (ParamValue) => {
    setId(ParamValue)
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_user_type_detailsbyid', {
      method: 'post',
      body: JSON.stringify({ ParamValue }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    result = await result.json();
    setUsertype(result.data.usertype)
    setUsertypestatus(result.data.usertype_status)
    setVisibleedit(true);

  }

  const updateusertype = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const usertype = data.get('usertype');
    const usertype_status = data.get('usertype_status');

    await fetch('https://insuranceapi-3o5t.onrender.com/api/update_user_type_details', {
      method: 'post',
      body: JSON.stringify({ ParamValue: id, usertype: usertype }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status == 200) {
          setVisibleedit(false)
          swal({
            title: "Wow!",
            text: data.message,
            type: "success",
            icon: "success"
          }).then(function () {
            getusertypelist(page, perPage);
          });
        }
        else {
          setVisibleedit(false)
          swal({
            title: "Error!",
            text: data.message,
            type: "error",
            icon: "error"
          }).then(function () {
            getusertypelist(page, perPage);

          });
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
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMasterData/?id=${id}&type=userType`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            title: "Success!",
            text: data.message,
            icon: "success",
            button: false,
          })
          getusertypelist(page, perPage);

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
          getusertypelist(page, perPage);

          setTimeout(() => {
            swal.close()
          }, 1000);
        }

      })
  }
  const startFrom = (page - 1) * perPage;

  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Usertype</h4>
              </div>
              <div className="col-md-6">
                {masterpermission.usertype?.includes('create') ?
                  <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add Usertype</button>
                  : ''}
              </div>
            </div>
          </div>
          <div className="card-header" style={{ textAlign: 'right' }}>
            {masterpermission.usertype?.includes('download') ?
              <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
              : ''}
            {masterpermission.usertype?.includes('upload') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
              : ''}
            {masterpermission.usertype?.includes('export') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
              : ''}
          </div>
          <div className="card-body">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>
                  <th scope="col">User Type</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  data?.length > 0 ?
                    data.map((item, index) =>
                      <tr key={index}>
                        <td>{startFrom + index + 1}</td>
                        <td>{item.usertype}</td>
                        <td>{item.usertype_status == 1 ? 'Active' : 'Inactive'}</td>
                        <td>
                          {masterpermission.usertype?.includes('edit') && (
                            <button className="btn btn-primary" onClick={() => getdetails(item._id)}>Edit</button>
                          )}
                          {' '}
                          {masterpermission.usertype?.includes('delete') && (
                            <>
                              {
                                item.usertype_status === 1 ?
                                  <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                  <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                              }
                              <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
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
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Upload Excel File</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div >
            {/* <label className="form-label"><strong>Upload Excel File</strong></label> */}
            <input type="file" className="form-control" id="DHA" defaultValue="" required
              onChange={(e) => setExcelfile(e.target.files[0])} />
          </div>

        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={collectExceldata} href={'/Viewtraveltype'}>Upload</CButton>
        </CModalFooter>
      </CModal>

      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add User Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">

                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={addusertype}>
                      <div className="row">
                        <div className="col-md-6">

                          <label className="form-label"><strong>Add User Type</strong></label>
                          <input type='text' className="form-control"
                            name='usertype'
                            placeholder='Enter User Type'
                            defaultValue=""
                            required
                            autoComplete="off"
                          />
                        </div>

                        {/* <div className="col-md-6">
                          <label className="form-label"><strong>Status</strong></label>.
                          <select className="form-control" name="usertype_status" >
                            <option value="" hidden>Select Status</option>
                            <option value="1">Active</option>
                            <option value="0">InActive</option>
                          </select>
                        </div> */}
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={updateusertype}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit user type</strong></label>
                          <input type='text' className="form-control"
                            name='usertype'
                            placeholder='Enter user type'
                            defaultValue={usertype}
                            autoComplete="off"
                            required
                          />
                        </div>
                        {/* <div className="col-md-6">

                          <label className="form-label"><strong>Status</strong></label>
                          <select className="form-control" name="usertype_status" required>
                            <option value="">Select Status</option>
                            <option value="1" selected={usertype_status == 1 ? true : false}>Active</option>
                            <option value="0" selected={usertype_status == 0 ? true : false}>InActive</option>
                          </select>
                        </div> */}
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
          <Button variant="secondary" onClick={() => setVisibleedit(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ViewUsertype