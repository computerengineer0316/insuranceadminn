import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import filePath from '../../webroot/sample-files/nationality-name.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CProgress } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";

const ViewNationality = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [excelfile, setExcelfile] = useState("")
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [nationality_name, setNationalityname] = useState('');
  const [nationality_status, setNationalitystatus] = useState('');
  const [nationality_id, setNationalityid] = useState('');
  const [visible, setVisible] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [visibleedit, setVisibleedit] = useState(false);
  const [masterpermission, setMasterpermission] = useState([]);
  const [searchvalue, setSearchvalue] = useState('');
  const [statusvalue, setStatusvalue] = useState(2);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getnationalitylist(page, perPage);
      locationList();
      const userdata = JSON.parse(localStorage.getItem('user'));
      const master_permission = userdata?.master_permission?.[0] || {};
      setMasterpermission(master_permission);
      exportlistdata();
    }
  }, [])

  useEffect(() => {
    getnationalitylist(page, perPage);
  }, [searchvalue, statusvalue])

  const locationdata = (item) => {
    const locationid = item.nationality_location;
    const location_id = locationid.toString().split(',');
    const location_id_len = location_id.length;
    const location_name = [];
    for (let i = 0; i < location_id_len; i++) {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location_by_id/${location_id[i]}`, requestOptions)
        .then(response => response.json())
        .then(data => {
          location_name.push(data.data.location_name);
          const location_name_len = location_name.length;
          if (location_name_len === location_id_len) {
            const location_name_str = location_name.join(',');
            const newitem = { ...item, nationality_location: location_name_str };
            setData(data => [...data, newitem]);
          }
        });
    }
  }


  const getnationalitylist = async (page, perPage) => {
    setData([]);
    console.log(searchvalue, statusvalue)
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_nationality_list?page=${page}&limit=${perPage}&name=${searchvalue}&status=${statusvalue}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data.data, "data");
        const total = data.total;
        const slice = total / perPage;
        const pages = Math.ceil(slice);
        setPageCount(pages);
        const list = data.data;
        setData(list);
      });
  }

  const [exportlist, setExportlist] = useState([]);
  const exportlistdata = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch('https://insuranceapi-3o5t.onrender.com/api/get_nationality_list', requestOptions)
      .then(response => response.json())
      .then(data => {
        setExportlist(data.data);
      });
  }
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", exportlist)


  const fileType = 'xlsx'
  const exporttocsv = () => {

    const updatedData = exportlist?.map((item, index) => {
      return {
        'nationality_name': item.nationality_name,
        'location': item.nationality_location.map((item) => item.location_name).join(", "),
      }
    })
    console.log('updatedData', updatedData)


    const ws = XLSX.utils.json_to_sheet(updatedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
    const newdata = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(newdata, "Nationality" + ".xlsx")
  }
  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getnationalitylist(selectedPage + 1, perPage);
  };

  const updatestatus = async (id, nationality_status) => {

    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_nationality_list_status', {
      method: 'post',
      body: JSON.stringify({ id, nationality_status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    swal("Updated Succesfully", "", "success");
    getnationalitylist(page, perPage)

  }


  const collectExceldata = async (e) => {
    e.preventDefault()
    setVisible(!visible)
    setLoading(true)
    const fd = new FormData()
    fd.append('file', excelfile)
    let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_nationality_list_excel ",
      {
        method: "post",
        body: fd,
      })
    result = await result.json();
    setLoading(false)
    if (result.status == 200) {
      swal({
        text: result.message,
        type: "success",
        icon: "success",
        button: false
      })
      getnationalitylist(page, perPage);
      setTimeout(() => {
        swal.close();
      }, 1000);
    } else {
      swal({
        text: result.message,
        type: "error",
        icon: "error"
      })
    }
    getnationalitylist(page, perPage)
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


  const addnationalitylist = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const nationality_name = data.get('nationality_name');
    const nationality_location = selectedOption;
    const nationality_location_len = nationality_location.length;
    const nationality_location_str = [];
    for (let i = 0; i < nationality_location_len; i++) {
      nationality_location_str.push(nationality_location[i].value);
    }
    if (nationality_location_str.length == 0) {
      swal({
        text: "Please select location",
        type: "error",
        icon: "error"
      })
      return false;
    }
    else {
      await fetch('https://insuranceapi-3o5t.onrender.com/api/add_nationality_list', {
        method: 'post',
        body: JSON.stringify({
          nationality_name: nationality_name,
          nationality_location: nationality_location_str,
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
            getnationalitylist(page, perPage);
            setTimeout(() => {
              swal.close();
            }, 1000);
          }
          else {
            setShowModal(false);
            swal({
              text: data.message,
              type: "error",
              icon: "error"
            })
            getnationalitylist(page, perPage);
            setTimeout(() => {
              swal.close();
            }, 1000);
          }
        });
    }
  }


  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const detailsbyid = async (ParamValue) => {
    setNationalityid(ParamValue);
    const requestOptions = {
      method: "post",
      body: JSON.stringify({ ParamValue }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_nationality_list_id`, requestOptions);
    result = await result.json();
    setNationalityname(result.data.nationality_name);
    setNationalitystatus(result.data.nationality_status);
    const locationid = result.data.nationality_location;
    const location_id = locationid.toString().split(",");
    const location_id_len = location_id.length;
    const location_name = [];
    for (let i = 0; i < location_id_len; i++) {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location_by_id/${location_id[i]}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          location_name.push(data.data.location_name);
          const location_name_len = location_name.length;
          if (location_name_len === location_id_len) {
            const location_name_str = location_name.join(",");
            const location_name_arr = location_name_str.split(",");
            const location_name_arr_len = location_name_arr.length;
            const location_name_arr_obj = [];
            for (let i = 0; i < location_name_arr_len; i++) {
              const location_name_arr_obj_obj = { label: location_name_arr[i], value: location_id[i] };
              location_name_arr_obj.push(location_name_arr_obj_obj);
            }
            setSelectedOption(location_name_arr_obj);
            setVisibleedit(true);
          }
        });
    }
  }

  const updatenationality = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const nationality_name = data.get('nationality_name');
    const nationality_location = selectedOption;
    const nationality_location_len = nationality_location.length;
    const nationality_location_str = [];
    for (let i = 0; i < nationality_location_len; i++) {
      nationality_location_str.push(nationality_location[i].value);
    }
    if (nationality_location_str.length == 0) {
      swal({
        text: "Please select location",
        type: "error",
        icon: "error"
      })
      return false;
    }
    else {
      await fetch(`https://insuranceapi-3o5t.onrender.com/api/update_nationality_list_details`, {
        method: "POST",
        body: JSON.stringify({
          ParamValue: nationality_id, nationality_name: nationality_name,
          nationality_location: nationality_location_str.toString(),
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
            getnationalitylist(page, perPage);
            setTimeout(() => {
              swal.close();
            }, 1000);
          }
          else {
            setVisibleedit(false)
            swal({
              text: data.message,
              type: "error",
              icon: "error"
            })
            getnationalitylist(page, perPage);
            setTimeout(() => {
              swal.close();
            }, 1000);
          }
        });
    }
  }

  const startFrom = (page - 1) * perPage;


  const deletedata = async (id) => {
    try {
      const requestOptions = {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
      };

      await fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMasterData?type=nattionality&id=${id}`, requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.status == 200) {
            swal({
              text: data.message,
              type: "success",
              icon: "success",
              button: false
            })
            getnationalitylist(page, perPage);
            setTimeout(() => {
              swal.close();
            }, 1000);
          }
          else {
            swal({
              text: data.message,
              type: "error",
              icon: "error"
            })
            getnationalitylist(page, perPage);
            setTimeout(() => {
              swal.close();
            }, 1000);
          }
        });
    }
    catch (err) {
      console.log(err);
    }

  }

  const openaddmodal = () => {
    setShowModal(true);
    setSelectedOption(location);
  }


  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Nationality List</h4>
              </div>
              <div className="col-md-6">
                {masterpermission.nationality?.includes('create') ?
                  <button className='btn btn-primary' style={{ float: "right" }} onClick={() => openaddmodal()}>Add Nationality name</button>
                  : ''}
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className='row card-header' style={{ marginLeft: '10px', marginRight: '10px', alignItems: 'center', paddingTop: '5px', paddingBottom: '5px' }}>
              <div className='col-lg-3'>
                <label><strong>Search</strong></label><br />
                <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearchvalue(e.target.value)} />

              </div>
              <div className='col-lg-3'>
                <label><strong>Status</strong></label><br />
                <select className='form-control'
                  value={statusvalue}
                  onChange={(e) => setStatusvalue(e.target.value)}
                >
                  <option value={2}>-- All --</option>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
              <div className="col-lg-6" style={{ textAlign: 'right' }}>
                {masterpermission.nationality?.includes('download') ?
                  <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
                  : ''}
                {masterpermission.nationality?.includes('upload') ?
                  <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
                  : ''}
                {masterpermission.nationality?.includes('export') ?
                  <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
                  : ''}
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {loading && (
                <div className="overlay">
                  <div className="loader-container">
                    <CProgress color="info" variant="striped" animated value={100} />
                    <div>Uploading, please wait...</div>
                    <div className="loader-text">Do Not Refresh The Page</div>
                    {/* <ClipLoader color="green" loading={loading} size={100} /> */}
                  </div>
                </div>
              )}
              <table className="table table-bordered">
                <thead className="thead-dark">
                  <tr className="table-info">
                    <th scope="col">#</th>
                    <th scope="col">Nationality Name</th>
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
                          <td>{item.nationality_name}</td>
                          <td>{item.nationality_location.map((val) => val.location_name).join(", ")}</td>
                          {/* <td>{item.nationality_status == 1 ? 'Active' : 'Inactive'}</td> */}
                          <td>
                            {masterpermission.nationality?.includes('edit') && (
                              <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>
                            )}
                            {' '}
                            {masterpermission.nationality?.includes('delete') && (
                              <>
                                {
                                  item.nationality_status === 1 ?
                                    <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                    <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                                }
                              </>
                            )}
                            {' '}
                            {masterpermission.nationality?.includes('delete') && (
                              <button className="btn btn-warning" onClick={() => { if (window.confirm('Are you sure you want to delete this item?')) deletedata(item._id) }}>Delete</button>
                            )}
                          </td>
                        </tr>
                      ) : <tr>
                        <td colSpan="6">No Data Found</td>
                      </tr>
                  }
                </tbody>
              </table>
            </div>
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
          <Modal.Title>Add Nationality</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={addnationalitylist}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label className="form-label"><strong>Add Nationality</strong></label>
                            <input type='text' className="form-control"
                              name='nationality_name'
                              placeholder="Enter Nationality Name"
                              defaultValue=""
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group mb-3">
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
                        {/* <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label"><strong>Status</strong></label>.
                      <select className="form-control" name="nationality_status" >
                        <option value="" hidden>Select Status</option>
                        <option value="1">Active</option>
                        <option value="0">InActive</option>
                      </select>
                    </div>
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
          <Modal.Title>Edit Nationality</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={updatenationality}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label className="form-label"><strong>Edit Nationality Name</strong></label>
                            <input type='text' className="form-control"
                              name='nationality_name'
                              placeholder='Name'
                              defaultValue={nationality_name}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group mb-3">
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
                        {/* <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label"><strong>Status</strong></label>
                        <select className="form-control" name="nationality_status" required>
                          <option value="">Select Status</option>
                          <option value="1" selected={nationality_status == 1 ? true : false}>Active</option>
                          <option value="0" selected={nationality_status == 0 ? true : false}>InActive</option>
                        </select>
                      </div>
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

export default ViewNationality