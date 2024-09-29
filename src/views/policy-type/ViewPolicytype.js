import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import filePath from '../../webroot/sample-files/policy-type.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";

const ViewPolicytype = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [excelfile, setExcelfile] = useState("")
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [policy_type_name, setPolicytypename] = useState('');
  const [policy_type_status, setPolicytypestatus] = useState('')
  const [policy_type_id, setPolicytypeid] = useState('')
  const [visible, setVisible] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [visibleedit, setVisibleedit] = useState(false);
  const [masterpermission, setMasterpermission] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getpolicytypelist(page, perPage);
      locationList();
      const userdata = JSON.parse(localStorage.getItem('user'));
      const master_permission = userdata?.master_permission?.[0] || {};
      setMasterpermission(master_permission);
    }
  }, [])


  const getpolicytypelist = async (page, perPage) => {
    setData([]);

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_policiy_type?page=${page}&limit=${perPage}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const total = data.total;
        const slice = total / perPage;
        const pages = Math.ceil(slice);
        setPageCount(pages);
        const list = data.data;
        console.log(list, ">>>>>>>>>>>")
        setData(list);
      });
  }

  const fileType = 'xlsx'
  const exporttocsv = () => {
    console.log(data)
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
    const newdata = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(newdata, "Policy-Type" + ".xlsx")
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getpolicytypelist(selectedPage + 1, perPage);
  };

  const updatestatus = async (id, policy_type_status) => {

    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_policiy_type_status', {
      method: 'post',
      body: JSON.stringify({ id, policy_type_status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    swal("Updated Succesfully", "", "success");
    getpolicytypelist(page, perPage)

  }


  const collectExceldata = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('file', excelfile)
    await fetch("https://insuranceapi-3o5t.onrender.com/api/read_policiy_type_excel ",
      {
        method: "post",
        body: fd,
      })
      .then(response => response.json())
      .then(data => {
        if (data.success === true) {
          setVisible(!visible)
          swal({
            title: "Wow!",
            text: data.message,
            type: "success",
            icon: "success"
          }).then(function () {
            getpolicytypelist(page, perPage);
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
            getpolicytypelist(page, perPage);
          });
        }
      });
  }

  const locationList = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
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
        setLocation(location_list);
        handleChange(location_list);
      });
  }

  const addpolicytype = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const policy_type_name = data.get('policy_type_name');
    const policy_type_location = selectedOption;
    const policy_type_location_len = policy_type_location.length;
    const policy_type_location_str = [];
    for (let i = 0; i < policy_type_location_len; i++) {
      policy_type_location_str.push(policy_type_location[i].value);
    }
    await fetch('https://insuranceapi-3o5t.onrender.com/api/add_policiy_type', {
      method: 'post',
      body: JSON.stringify({
        policy_type_name: policy_type_name,
        policy_type_location: policy_type_location_str,
      }),
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
            getpolicytypelist(page, perPage);
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
            getpolicytypelist(page, perPage);
          });
        }
      });
  }

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const detailsbyid = async (ParamValue) => {
    setPolicytypeid(ParamValue);
    const requestOptions = {
      method: "post",
      body: JSON.stringify({ ParamValue }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_policiy_type_detailsbyid`, requestOptions);
    result = await result.json();
    setPolicytypename(result.data[0].policy_type_name);
    console.log(result.data[0], ">>>>>>>>>>>>>>>>>>>")
    setPolicytypestatus(result.data[0].policy_type_status);
    const locationid = result.data[0].policy_type_location;

    const location_name_arr_obj = [];
    for (let i = 0; i < locationid?.length; i++) {
      const location_name_arr_obj_obj = { label: locationid[i].location_name, value: locationid[i]._id };
      location_name_arr_obj.push(location_name_arr_obj_obj);
    }
    setSelectedOption(location_name_arr_obj);
    setVisibleedit(true);
  }

  const updatePolicytype = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const policy_type_name = data.get('policy_type_name');
    const policy_type_location = selectedOption;
    const policy_type_location_len = policy_type_location.length;
    const policy_type_location_str = [];
    for (let i = 0; i < policy_type_location_len; i++) {
      policy_type_location_str.push(policy_type_location[i].value);
    }
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/update_policiy_type_details`, {
      method: "POST",
      body: JSON.stringify({
        ParamValue: policy_type_id, policy_type_name: policy_type_name,
        policy_type_location: policy_type_location_str,
      }),
      headers: {
        "Content-Type": "application/json",
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
            getpolicytypelist(page, perPage);
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
            getpolicytypelist(page, perPage);
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
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMasterData/?id=${id}&type=PolicyType`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            title: "Success!",
            text: data.message,
            icon: "success",
            button: false,
          })
          getpolicytypelist(page, perPage);

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
          getpolicytypelist(page, perPage);

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
                <h4 className="card-title">Policy Type Details</h4>
              </div>
              <div className="col-md-6">
                {masterpermission.policy_type?.includes('create') ?
                  <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add Policy Type</button>
                  : ''}
              </div>
            </div>
          </div>
          <div className="card-header" style={{ textAlign: 'right' }}>
            {masterpermission.policy_type?.includes('download') ?
              <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
              : ''}
            {masterpermission.policy_type?.includes('upload') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
              : ''}
            {masterpermission.policy_type?.includes('export') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
              : ''}
          </div>
          <div className="card-body">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>
                  <th scope="col">Policy Type</th>
                  <th scope="col">Location</th>
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
                        <td>{item.policy_type_name}</td>
                        <td>{item.policy_type_location?.map((val) => val.location_name).join(", ")}</td>
                        <td>{item.policy_type_status == 1 ? 'Active' : 'Inactive'}</td>
                        <td>
                          {masterpermission.policy_type?.includes('edit') && (
                            <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>
                          )}
                          {' '}
                          {masterpermission.policy_type?.includes('delete') && (
                            <>
                              {
                                item.policy_type_status === 1 ?
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
      <CModal alignment='center' visible={visible} onClose={() => setVisible(false)}>
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
          <Modal.Title>Add Policy Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">

                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={addpolicytype}>
                      <div className="row">
                        <div className="col-md-6">

                          <label className="form-label"><strong>Add Policy Type</strong></label>
                          <input type='text' className="form-control"
                            name='policy_type_name'
                            placeholder="Enter Repair Type"
                            defaultValue=""
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label"><strong>Select Location</strong></label>

                          <Multiselect
                            options={location}
                            selectedValues={location}
                            displayValue="label"
                            onSelect={setSelectedOption}
                            onRemove={setSelectedOption}
                            placeholder="Select Location"
                            showCheckbox={true}
                            required
                          />
                        </div>
                        {/* <div className="col-md-6">
                  <label className="form-label"><strong>Status</strong></label>.
                  <select className="form-control" name="policy_type_status">
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
          <Modal.Title>Edit Policy Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">

                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={updatePolicytype}>
                      <div className="row">
                        <div className="col-md-6">

                          <label className="form-label"><strong>Edit Policy Type</strong></label>
                          <input type='text' className="form-control"
                            name='policy_type_name'
                            placeholder='Name'
                            defaultValue={policy_type_name}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label"><strong>Select Location</strong></label>

                          <Multiselect
                            options={location}
                            selectedValues={selectedOption}
                            onSelect={handleChange}
                            onRemove={handleChange}
                            displayValue="label"
                            placeholder="Select Location"
                            closeOnSelect={false}
                            avoidHighlightFirstOption={true}
                            showCheckbox={true}
                            style={{ chips: { background: "#007bff" } }}
                            required
                          />
                        </div>
                        {/* <div className="col-md-6">
                      <label className="form-label"><strong>Status</strong></label>.
                      <select className="form-control" name="policy_type_status" required>
                            <option value="">Select Status</option>
                            <option value="1" selected={policy_type_status == 1 ? true : false}>Active</option>
                            <option value="0" selected={policy_type_status == 0 ? true : false}>InActive</option>
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

export default ViewPolicytype