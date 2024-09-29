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

const ViewVat = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [vat_percentage, setVatPercentage] = useState('');
  const [vat_id, setVatid] = useState('')
  const [showModal, setShowModal] = useState(false);
  const [visibleedit, setVisibleedit] = useState(false);
  const [masterpermission, setMasterpermission] = useState([]);
  const [LineOfBusiness, setLineOfBusiness] = useState([]);
  const [defaultLOB, setDefaultLob] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getVat(page, perPage);
      locationList();
      getlistLineOfBusiness();
      const userdata = JSON.parse(localStorage.getItem('user'));
      const master_permission = userdata?.master_permission?.[0] || {};
      console.log(master_permission, "master_permission")
      setMasterpermission(master_permission);
    }
  }, [])



  const getVat = async (page, perPage) => {
    setData([]);

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_vat?page=${page}&limit=${perPage}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const total = data.total;
        const slice = total / perPage;
        const pages = Math.ceil(slice);
        setPageCount(pages);
        const list = data.data;
        console.log(data.data, ">>>>>>>>>>>>> list")
        setData(list)

      });
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getVat(selectedPage + 1, perPage);
  };

  const updatestatus = async (id, vat_status) => {

    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_vat_status', {
      method: 'post',
      body: JSON.stringify({ id, vat_status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    swal({
      text: result.message,
      type: "success",
      icon: "success",
      button: false
    })
    getVat(page, perPage);
    setTimeout(() => {
      swal.close()
    }, 1000);

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
        setLocation(locationdt);
        handleChange(locationdt);
      });
  }

  const addVat = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const policy_type_name = data.get('vat_percentage');
    const lob = data.get('line_of_buisness')
    const policy_type_location = selectedOption;
    const policy_type_location_len = policy_type_location.length;
    const policy_type_location_str = [];
    const lob_arr = [];
    for (let j = 0; j < lob.length; j++) {
      lob_arr.push(lob[j]._id)
    }
    for (let i = 0; i < policy_type_location_len; i++) {
      policy_type_location_str.push(policy_type_location[i]._id);
    }
    await fetch('https://insuranceapi-3o5t.onrender.com/api/add_vat', {
      method: 'post',
      body: JSON.stringify({
        vat_percentage: policy_type_name,
        vat_location: policy_type_location_str,
        vat_lob: lob
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
            text: data.message,
            type: "success",
            icon: "success",
            button: false
          })
          getVat(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
        else {
          setShowModal(false);
          swal({
            title: "Error!",
            text: data.message,
            type: "error",
            icon: "error",
            button: false
          })
          getVat(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
      });
  }

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const detailsbyid = async (ParamValue) => {
    setVatid(ParamValue);
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ ParamValue }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_vat_detailsbyid`, requestOptions);
    result = await result.json();
    setVatPercentage(result.data[0]?.vat_percentage);
    const locationid = result.data[0]?.vat_location;
    const lobs = result.data[0]?.vat_lob
    console.log(result.data[0], ">>>>>>>>>>>>>>>>>>>>>>>>>> asdfsafsf")
    setSelectedOption(locationid);
    setVisibleedit(true);
    setDefaultLob(lobs)
  }

  const updateVat = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const vat_percentage = data.get('vat_percentage');
    const lob = data.get('line_of_buisness')
    const policy_type_location = selectedOption;
    const policy_type_location_len = policy_type_location.length;
    const vat_location_str = [];
    const lob_arr = [];
    for (let j = 0; j < lob.length; j++) {
      lob_arr.push(lob[j]._id)
    }
    for (let i = 0; i < policy_type_location_len; i++) {
      vat_location_str.push(policy_type_location[i]._id);
    }
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/update_vat_details`, {
      method: "POST",
      body: JSON.stringify({
        ParamValue: vat_id,
        vat_percentage: vat_percentage,
        vat_location: vat_location_str,
        vat_lob: lob
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
            type: "success",
            icon: "success",
            button: false
          })
          getVat(page, perPage);
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
            icon: "error",
            button: false
          })
          getVat(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
      });
  }
  const getlistLineOfBusiness = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const line_of_businessdt = data.data
        console.log(line_of_businessdt, ">>>>>>>>>>>>>>> lobs")
        // const line_of_business_len = line_of_businessdt.length
        // const line_of_business_list = []
        // for (let i = 0; i < line_of_business_len; i++) 
        // {
        //   const line_of_business_obj = {
        //     label: line_of_businessdt[i].line_of_business_name,
        //     value: line_of_businessdt[i]._id,
        //   }
        //   line_of_business_list.push(line_of_business_obj)
        // }
        setLineOfBusiness(line_of_businessdt)
      })
  }
  const deleteItem = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMotorMaster/?id=${id}&type=vat`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            title: "Success!",
            text: data.message,
            icon: "success",
            button: false,
          })
          getVat(page, perPage);
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
          getVat(page, perPage);

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
                <h4 className="card-title">Vat</h4>
              </div>
              <div className="col-md-6">
                {masterpermission.vat?.includes('create') ?
                  <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add Vat</button>
                  : ''}
              </div>
            </div>
          </div>
          <div className="card-body">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>
                  <th scope="col">Percentage</th>
                  <th scope="col">Line Of Business</th>
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
                        <td>{item.vat_percentage}</td>
                        <td>{item.vat_lobs.map((val) => val.line_of_business_name).join(", ")}</td>
                        <td>{item.locations?.map((val) => (val.location_name)).join(", ")}</td>
                        <td>
                          {masterpermission.vat?.includes('edit') && (
                            <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>
                          )}
                          {' '}
                          {/* { masterpermission.vat?.includes('delete') && ( */}
                          {masterpermission.vat?.includes('delete') ? (
                            <>

                              {
                                item.vat_status == 1 ?
                                  <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                  <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>

                              }
                              <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                            </>
                          ) : ''
                          }
                          {/* )} */}
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
      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Vat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">

                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={addVat}>
                      <div className="row">
                        <div className="col-md-6">

                          <label className="form-label"><strong>Add Vat Percentage</strong></label>
                          <input type='text' className="form-control"
                            name='vat_percentage'
                            placeholder="Enter Vat Percentage"
                            defaultValue=""
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label"><strong>Select Location</strong></label>

                          <Multiselect
                            options={location}
                            selectedValues={location}
                            displayValue="location_name"
                            onSelect={setSelectedOption}
                            onRemove={setSelectedOption}
                            placeholder="Select Location"
                            showCheckbox={true}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label>Line Of Business</label>
                            <select className="form-control" name="line_of_buisness" >
                              <option value="" hidden>Select Line Of Buisness</option>
                              {LineOfBusiness.map((item, index) => (
                                <option key={index} value={item._id}>{item.line_of_business_name}</option>
                              ))}
                            </select>
                            {/* <Multiselect
                            options={LineOfBusiness}
                            displayValue="line_of_business_name"
                            onSelect={setlob}
                            onRemove={setlob}
                            placeholder="Select LOB"
                            showCheckbox={true}
                          /> */}
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Vat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">

                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={updateVat}>
                      <div className="row">
                        <div className="col-md-6">

                          <label className="form-label"><strong>Edit Policy Type</strong></label>
                          <input type='text' className="form-control"
                            name='vat_percentage'
                            placeholder='Name'
                            defaultValue={vat_percentage}
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
                            displayValue="location_name"
                            placeholder="Select Location"
                            closeOnSelect={false}
                            avoidHighlightFirstOption={true}
                            showCheckbox={true}
                            style={{ chips: { background: "#007bff" } }}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label>Line Of Business</label>
                            <select className="form-control" name="line_of_buisness" >
                              <option value="" hidden>Select Line Of Buisness</option>
                              {LineOfBusiness.map((item, index) => (
                                <option key={index} value={item._id} selected={defaultLOB == item._id ? true : false}>{item.line_of_business_name}</option>
                              ))}
                            </select>
                            {/* <Multiselect
                            options={LineOfBusiness}
                            displayValue="line_of_business_name"
                            selectedValues={defaultLOB}
                            onSelect={setlob}
                            onRemove={setlob}
                            placeholder="Select LOB"
                            showCheckbox={true}
                          /> */}
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
          <Button variant="secondary" onClick={() => setVisibleedit(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ViewVat