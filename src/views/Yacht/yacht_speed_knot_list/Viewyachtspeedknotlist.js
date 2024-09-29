import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import filePath from '../../../webroot/sample-files/yacht-speed-knots-type.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";

const Viewyachtspeedknotlist = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [excelfile, setExcelfile] = useState("")
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [yacht_speed_knot_type, setYachtspeedknottype] = useState('');
  const [yacht_speed_knot_type_status, setYachtspeedknottypestatus] = useState();
  const [yacht_speed_knot_type_id, setYachtspeedknottypeid] = useState();
  const [visible, setVisible] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [visibleedit, setVisibleedit] = useState(false);
  const [yachtpermission, setYachtpermission] = useState([]);
  const [editLocation, setEditLocation] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getspeedknotdetails(page, perPage);
      locationList();
      const userdata = JSON.parse(localStorage.getItem('user'));
      const yacht_permission = userdata?.yacht_permission?.[0] || {};
      setYachtpermission(yacht_permission);
      exportlistdata();
    }
  }, [])


  const getspeedknotdetails = async (page, perPage) => {
    setData([]);

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Yacht_speed_knot_type?page=${page}&limit=${perPage}`, requestOptions)
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
  console.log(data)

  const [exportlist, setExportlist] = useState([]);
  const exportlistdata = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('https://insuranceapi-3o5t.onrender.com/api/get_Yacht_speed_knot_type', requestOptions)
      .then(response => response.json())
      .then(data => {
        setExportlist(data.data);
      });
  }

  console.log(exportlist)

  const fileType = 'xlsx'
  const exporttocsv = () => {
    const updatedData = exportlist.map((item, index) => {
      return {

        'yacht_speed_knot_type': item.yacht_speed_knot_type,
        'yacht_speed_knot_type_location': item.yacht_speed_knot_type_location.map((data) => data.location_name).join(", "),
      }
    })
    const ws = XLSX.utils.json_to_sheet(updatedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
    const newdata = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(newdata, "Yacht-Speed-Knot" + ".xlsx")
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getspeedknotdetails(selectedPage + 1, perPage);
  };

  const updatestatus = async (id, yacht_speed_knot_type_status) => {
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_Yacht_speed_knot_type_status', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, yacht_speed_knot_type_status })
    })
    result = await result.json();
    swal("Success!", "Status Updated Successfully!", "success");
    getspeedknotdetails(page, perPage);
  }


  const collectExceldata = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('file', excelfile)
    await fetch("https://insuranceapi-3o5t.onrender.com/api/read_Yacht_speed_knot_type_excel ",
      {
        method: "post",
        body: fd,
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          setVisible(!visible)
          swal({
            text: data.message,
            type: "success",
            icon: "success",
            button: false
          })
          getspeedknotdetails(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
        else {
          setVisible(!visible)
          swal({
            title: "Error!",
            text: data.message,
            type: "error",
            icon: "error"
          }).then(function () {
            getspeedknotdetails(page, perPage);
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
        handleChange(location_list);
      });
  }

  const addyachtspeedknottype = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const yacht_speed_knot_type = data.get('yacht_speed_knot_type');
    const yacht_speed_knot_type_location = selectedOption;
    const yacht_speed_knot_type_location_len = yacht_speed_knot_type_location.length;
    const yacht_speed_knot_type_location_str = [];
    for (let i = 0; i < yacht_speed_knot_type_location_len; i++) {
      yacht_speed_knot_type_location_str.push(yacht_speed_knot_type_location[i].value);
    }

    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/add_Yacht_speed_knot_type', {
      method: 'post',
      body: JSON.stringify({ yacht_speed_knot_type: yacht_speed_knot_type, yacht_speed_knot_type_location: yacht_speed_knot_type_location_str.toString() }),
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
            getspeedknotdetails(page, perPage);
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
            getspeedknotdetails(page, perPage);
          });
        }
      });
  }

  const handleChange = (selectedOption) => {
    setEditLocation(selectedOption);
  }

  const detailsbyid = async (ParamValue) => {
    setYachtspeedknottypeid(ParamValue);
    const requestOptions = {
      method: "post",
      body: JSON.stringify({ ParamValue }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_Yacht_speed_knot_type_detailsbyid`, requestOptions);
    result = await result.json();
    const details = result.data[0];
    setYachtspeedknottype(details.yacht_speed_knot_type);
    setYachtspeedknottypestatus(details.yacht_speed_knot_type_status);
    const location = details.yacht_speed_knot_type_location;
    const locationid = location.map((data) => ({ label: data.location_name, value: data._id }));
    setSelectedOption(locationid);
    setVisibleedit(true);
  }



  const updateyachtspeedknot = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const yacht_speed_knot_type = data.get('yacht_speed_knot_type');
    const location = editLocation;
    const location_id = location.map((data) => data.value);

    if (editLocation.length === 0) {
      swal({
        title: "warning!",
        text: "Please Select Location",
        icon: "warning",
        button: "OK",
      });
      return false;
    }
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/update_Yacht_speed_knot_type_details`, {
      method: "POST",
      body: JSON.stringify({
        ParamValue: yacht_speed_knot_type_id,
        yacht_speed_knot_type: yacht_speed_knot_type,
        location: location_id,
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
            text: data.message,
            icon: "success",
            button: false,
          })
          getspeedknotdetails(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
        else {
          setVisibleedit(false)
          swal({
            title: "Error!",
            text: data.message,
            type: "error",
            icon: "error"
          }).then(function () {
            getspeedknotdetails(page, perPage);
          });
        }
      });
  }


  const Addyachtspeedknot = () => {
    navigate("/Addyachtspeedknotlist")
  }


  const deleteItem = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteYachtMaster/?id=${id}&type=yachtspeedknots`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          getspeedknotdetails(page, perPage);
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
          getspeedknotdetails(page, perPage);
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
                <h4 className="card-title">Speed Knot Details</h4>
              </div>
              <div className="col-md-6">
                {yachtpermission.speed_knots_list?.includes('create') ?
                  <button className='btn btn-primary' style={{ float: "right" }} onClick={() => Addyachtspeedknot()}>Add Speed Knot</button>
                  : ''}
              </div>
            </div>
          </div>
          <div className="card-header" style={{ textAlign: 'right' }}>
            {yachtpermission.speed_knots_list?.includes('download') ?
              <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
              : ''}
            {yachtpermission.speed_knots_list?.includes('upload') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
              : ''}
            {yachtpermission.speed_knots_list?.includes('export') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
              : ''}
          </div>
          <div className="card-body">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>
                  <th scope="col">Type</th>
                  <th scope="col">Location</th>
                  {/* <th scope="col">Status</th> */}
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  data?.length > 0 ?
                    data.map((item, index) =>
                      <tr key={index}>
                        <td>{startFrom + index + 1}</td>
                        <td>{item.yacht_speed_knot_type}</td>
                        <td>{item.yacht_speed_knot_type_location.map((data) => data.location_name).join(", ")}</td>
                        {/* <td>{item.yacht_speed_knot_type_status == 1 ? 'Active' : 'Inactive'}</td> */}
                        <td>
                          {yachtpermission.speed_knots_list?.includes('edit') && (
                            <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>
                          )}
                          {' '}
                          {yachtpermission.speed_knots_list?.includes('delete') && (
                            <>
                              {
                                item.yacht_speed_knot_type_status === 1 ?
                                  <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                  <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                              }
                              {' '}
                              <button className="btn btn-warning" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
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
          <Modal.Title>Speed Knot Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">

                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={addyachtspeedknottype}>
                      <div className="row">
                        <div className="col-md-6">

                          <label className="form-label"><strong>Add Speed Knot Type</strong></label>
                          <input type='text' className="form-control"
                            name='yacht_speed_knot_type'
                            placeholder="Enter Speed Knot Type"
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
          <Modal.Title>Edit Speed knot Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">

                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={updateyachtspeedknot}>
                      <div className="row">
                        <div className="col-md-6">

                          <label className="form-label"><strong>Edit Speed knot</strong></label>
                          <input type='text' className="form-control"
                            name='yacht_speed_knot_type'
                            placeholder='Name'
                            defaultValue={yacht_speed_knot_type}
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

export default Viewyachtspeedknotlist