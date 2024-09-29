import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import filePath from '../../webroot/sample-files/repair-type.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Multiselect from "multiselect-react-dropdown";
import { Modal, Button } from 'react-bootstrap';

const ViewRepairtype = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [excelfile, setExcelfile] = useState("");
  const [location, setLocation] = useState([]);
  const [repair_type_name, setRepairtypename] = useState('');
  const [repair_type_status, setRepairtypestatus] = useState('');
  const [repair_type_id, setRepairTypeId] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [visibleedit, setVisibleedit] = useState(false);
  const [motorpermission, setMotorPermission] = useState([]);
  const [editlocation, setEditlocation] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getrepairtypelist(page, perPage);
      locationList();
      exportlistdata();
      const userdata = JSON.parse(localStorage.getItem('user'));
      const motor_permission = userdata?.motor_permission?.[0] || {};
      setMotorPermission(motor_permission);
    }
  }, [])

  const addtravelcovertypelist = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const repair_type_name = data.get('repair_type_name');
    // const repair_type_status = data.get('status');
    const repair_type_location = selectedOption;
    const repair_type_location_len = repair_type_location.length;
    const repair_type_location_str = [];
    for (let i = 0; i < repair_type_location_len; i++) {
      repair_type_location_str.push(repair_type_location[i].value);
    }
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/add_repair_type', {
      method: 'post',
      body: JSON.stringify({
        repair_type_name: repair_type_name,
        repair_type_location: repair_type_location_str.toString(),
        // repair_type_status: repair_type_status 
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    if (result.status === 200) {
      setShowModal(false);
      swal({
        title: "Success!",
        text: result.message,
        type: "success",
        icon: "success",
        button: false
      })
      getrepairtypelist(page, perPage);
      setTimeout(() => {
        swal.close()
      }, 1000);
    }
    else {
      setShowModal(false);
      swal({
        title: "Error!",
        text: result.message,
        type: "error",
        icon: "error",
        button: false
      })
      getrepairtypelist(page, perPage);
      setTimeout(() => {
        swal.close()
      }, 1000);

    }
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
        setLocation(location_list);
        // handleChange(location_list);
      });
  }

  const handleChange = (selectedOption) => {
    setEditlocation(selectedOption);
  };

  const getrepairtypelist = async (page, perPage) => {
    setData([]);
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_repair_type?page=${page}&limit=${perPage}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const total = data.total;
        const slice = total / perPage;
        const pages = Math.ceil(slice);
        setPageCount(pages);
        const list = data.data;
        setData(list)

      });
  }
  const [exportlist, setExportlist] = useState([]);
  const exportlistdata = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('https://insuranceapi-3o5t.onrender.com/api/get_repair_type', requestOptions)
      .then(response => response.json())
      .then(data => {
        setExportlist(data.data);
        console.log(data.data, ">>>>>export data")
      });
  }
  const fileType = 'xlsx'
  const exporttocsv = () => {
    const updatedData = exportlist.map((item, index) => {
      return {

        'repair_type_name': item.repair_type_name,
        'repair_type_location': item.repair_type_location.map((item) => item.location_name).join(", "),
      }
    })
    const ws = XLSX.utils.json_to_sheet(updatedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
    const newdata = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(newdata, "Repair-type" + ".xlsx")
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getrepairtypelist(selectedPage + 1, perPage);
  };

  const updatestatus = async (id, repair_type_status) => {
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_repair_type_status', {
      method: 'post',
      body: JSON.stringify({ id, repair_type_status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    if (result.status === 200) {
      swal({
        text: result.message,
        type: "success",
        icon: "success",
        button: false
      })
      getrepairtypelist(page, perPage);
      setTimeout(() => {
        swal.close()
      }, 1000);
    }
    else {
      swal({
        title: "Error!",
        text: result.message,
        type: "error",
        icon: "error",
        button: false
      })
      getrepairtypelist(page, perPage);
      setTimeout(() => {
        swal.close()
      }, 1000);

    }
  }

  const collectExceldata = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('file', excelfile)
    let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_repair_type_excel ",
      {
        method: "post",
        body: fd,
      });
    result = await result.json();
    setVisible(!visible)
    if (result.status === 200) {
      swal("Uploaded Succesfully", "", "success")
      setTimeout(() => {
        swal.close()
      }, 1000);
    } else {
      swal("Something went wrong", "", "failed")
      setTimeout(() => {
        swal.close()
      }, 1000);
    }
    getrepairtypelist(page, perPage)
  }

  const detailsbyid = async (ParamValue) => {
    setRepairTypeId(ParamValue);
    const requestOptions = {
      method: "post",
      body: JSON.stringify({ ParamValue }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_repair_type_detailsbyid`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data.data, ">>>>>>data")
        const repair_type_details = data.data[0];
        setRepairtypename(repair_type_details?.repair_type_name);
        const locationid = repair_type_details?.repair_type_location;
        const location_id = locationid.map((data) => ({ label: data.location_name, value: data._id }));
        setSelectedOption(location_id);
        handleChange(location_id);
        setVisibleedit(true);
      });
  }

  const updateRepairtype = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const repair_type_name = data.get('repair_type_name');
    const repair_type_location = editlocation;
    const repair_type_location_id = repair_type_location?.map((val) => val.value);

    if (repair_type_location_id.length === 0) {
      swal({
        title: "Warning!",
        text: "Please select location",
        type: "warning",
        icon: "warning",
      })
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repair_type_name: repair_type_name,
        repair_type_location: repair_type_location_id,
        repair_type_id: repair_type_id
      })
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/update_repair_type_details`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          setVisibleedit(false);
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          getrepairtypelist(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
        else {
          setVisibleedit(false);
          swal({
            title: "Error!",
            text: data.message,
            icon: "error",
            button: false,
          })
          getrepairtypelist(page, perPage);
          setTimeout(() => {
            swal.close()
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
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMotorMaster/?id=${id}&type=repairType`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          getrepairtypelist(page, perPage);
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
          getrepairtypelist(page, perPage);
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
                <h4 className="card-title">Repair Type Details</h4>
              </div>
              <div className="col-md-6">
                {motorpermission.repair_type?.includes('create') ?
                  // <button className='btn btn-primary' style={ { float : "right" } } onClick={() => setShowModal(true)}>Add Repair Type</button>
                  <button className='btn btn-primary' style={{ float: "right" }} onClick={() => navigate('/AddRepairtype')}>Add Repair Type</button>

                  : ''}
              </div>
            </div>
          </div>
          <div className="card-header" style={{ textAlign: 'right' }}>
            {motorpermission.repair_type?.includes('download') ?
              <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
              : ''}
            {motorpermission.repair_type?.includes('upload') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
              : ''}
            {motorpermission.repair_type?.includes('export') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
              : ''}
          </div>
          <div className="card-body">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>
                  <th scope="col">Repair Type</th>
                  <th scope="col">Location</th>

                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  data?.length > 0 ?
                    data.map((item, index) =>
                      <tr key={index}>
                        <td>{startFrom + index + 1}</td>
                        <td>{item.repair_type_name}</td>
                        <td>{item.repair_type_location?.map((val) => val.location_name).join(", ")}</td>
                        <td>
                          {motorpermission.repair_type?.includes('edit') && (
                            <button className="btn btn-primary" onClick={() => { detailsbyid(item._id); }}>Edit</button>
                          )}
                          {' '}
                          {motorpermission.repair_type?.includes('delete') && (
                            <>
                              {
                                item.repair_type_status === 1 ?
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
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Upload Excel File</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>
            <input type="file" className="form-control" id="DHA" defaultValue="" required
              onChange={(e) => setExcelfile(e.target.files[0])} />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
          <CButton color="primary" onClick={collectExceldata} href={'/Viewtraveltype'}>Upload</CButton>
        </CModalFooter>
      </CModal>

      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Repair Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={addtravelcovertypelist}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label"><strong>Repair Type</strong></label>
                          <input type='text' className="form-control"
                            name='repair_type_name'
                            placeholder="Enter Repair Type"
                            autoComplete='off'
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
                          <select className="form-control" name="status" required>
                            <option value="">Select Status</option>
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
          <Modal.Title>Edit Repair Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={updateRepairtype}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label"><strong>Repair Type</strong></label>
                          <input type='text' className="form-control" name='repair_type_name' placeholder='Name' defaultValue={repair_type_name} required />
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
                        <label className="form-label"><strong>Status</strong></label>
                        <select className="form-control" name="status" required>
                          <option value="">Select Status</option>
                          <option value="1" selected={repair_type_status == 1 ? true : false}>Active</option>
                          <option value="0" selected={repair_type_status == 0 ? true : false}>InActive</option>
                        </select>
                      </div> */}
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Update</button>
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

export default ViewRepairtype