import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import filePath from '../../../webroot/sample-files/home-plan-type.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";

const Viewhomeplanytypelist = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [excelfile, setExcelfile] = useState("")
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [home_plan_type, setHomeplantype] = useState('');
  const [home_plan_type_status, setHomeplantypestatus] = useState()
  const [home_plan_type_id, setHomeplantypeid] = useState('');
  const [visible, setVisible] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [visibleedit, setVisibleedit] = useState(false);
  const [homepermission, setHomepermission] = useState([]);
  const [editLocation, setEditLocation] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      gethomeplantype(page, perPage);
      locationList();
      const userdata = JSON.parse(localStorage.getItem('user'));
      const home_permission = userdata?.home_permission?.[0] || {};
      setHomepermission(home_permission);
      exportlistdata();
    }
  }, [])

  const locationdata = (item) => {
    const locationid = item.home_plan_type_location;
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
            const newitem = { ...item, home_plan_type_location: location_name_str };
            setData(data => [...data, newitem]);
          }
        });
    }
  }


  const gethomeplantype = async (page, perPage) => {
    setData([]);

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_home_plan_type?page=${page}&limit=${perPage}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const total = data.total;
        const slice = total / perPage;
        const pages = Math.ceil(slice);
        setPageCount(pages);
        const list = data.data;
        setData(list);
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
    fetch('https://insuranceapi-3o5t.onrender.com/api/get_home_plan_type', requestOptions)
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

        'home_plan_type': item.home_plan_type,
        'home_plan_type_location': item.home_plan_type_location.map((data) => data.location_name).join(", "),
      }
    })
    const ws = XLSX.utils.json_to_sheet(updatedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
    const newdata = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(newdata, "Home-Plan-Type" + ".xlsx")
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    gethomeplantype(selectedPage + 1, perPage);
  };


  const updatestatus = async (id, home_plan_type_status) => {
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_home_plan_type_status', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, home_plan_type_status })
    })
    result = await result.json();
    swal("Success!", "Status Updated Successfully!", "success");
    gethomeplantype(page, perPage);
  }

  const collectExceldata = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('file', excelfile)
    await fetch("https://insuranceapi-3o5t.onrender.com/api/read_home_plan_type_excel ",
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
          gethomeplantype(page, perPage);
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
            gethomeplantype(page, perPage);
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
        // handleChange(location_list);
      });
  }

  const addplantype = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const home_plan_type = data.get('home_plan_type');
    const home_plan_type_location = selectedOption;
    const home_plan_type_location_len = home_plan_type_location.length;
    const home_plan_type_location_str = [];
    for (let i = 0; i < home_plan_type_location_len; i++) {
      home_plan_type_location_str.push(home_plan_type_location[i].value);
    }
    console.log(home_plan_type)
    console.log(home_plan_type_location_str.toString());

    await fetch('https://insuranceapi-3o5t.onrender.com/api/add_home_plan_type', {
      method: 'post',
      body: JSON.stringify({
        home_plan_type: home_plan_type,
        home_plan_type_location: home_plan_type_location_str.toString()
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
            gethomeplantype(page, perPage);
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
            gethomeplantype(page, perPage);
          });
        }
      });
  }

  const handleChange = (selectedOption) => {
    setEditLocation(selectedOption);
  }

  const detailsbyid = async (ParamValue) => {
    setHomeplantypeid(ParamValue);
    const requestOptions = {
      method: "post",
      body: JSON.stringify({ ParamValue }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_home_plan_type_detailsbyid`, requestOptions);
    result = await result.json();
    setHomeplantype(result.data[0].home_plan_type);
    setHomeplantypestatus(result.data[0].home_plan_type_status);
    const location = result.data[0].home_plan_type_location;
    const locationid = location.map((data) => ({ label: data.location_name, value: data._id }));
    setSelectedOption(locationid);
    handleChange(locationid);
    setVisibleedit(true);

  }



  const updateHomeplantypelist = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const home_plan_type = data.get('home_plan_type');
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

    await fetch(`https://insuranceapi-3o5t.onrender.com/api/update_home_plan_type_details`, {
      method: "POST",
      body: JSON.stringify({
        ParamValue: home_plan_type_id,
        home_plan_type: home_plan_type,
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
            type: "success",
            icon: "success",
            button: false
          })
          gethomeplantype(page, perPage);
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
            gethomeplantype(page, perPage);
          });
        }
      });

  }

  const Addhomeplantype = () => {
    navigate("/Addhomeplantypelist")
  }

  const deleteItem = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteHomeMaster/?id=${id}&type=homeplantype`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          gethomeplantype(page, perPage);
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
          gethomeplantype(page, perPage);
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
                <h4 className="card-title">Home Plan Type Details</h4>
              </div>
              <div className="col-md-6">
                {homepermission.home_plan_type?.includes('create') ?
                  <button className='btn btn-primary' style={{ float: "right" }} onClick={() => Addhomeplantype()}>Add Plan Type</button>
                  : ''}
              </div>
            </div>
          </div>
          <div className="card-header" style={{ textAlign: 'right' }}>
            {homepermission.home_plan_type?.includes('download') ?
              <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
              : ''}
            {homepermission.home_plan_type?.includes('upload') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
              : ''}
            {homepermission.home_plan_type?.includes('export') ?
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
                        <td>{item.home_plan_type}</td>
                        <td>{item.home_plan_type_location.map((data) => data.location_name).join(", ")}</td>
                        {/* <td>{item.home_plan_type_status == 1 ? 'Active' : 'Inactive'}</td> */}
                        <td>
                          {homepermission.home_plan_type?.includes('edit') && (
                            <button className="btn btn-primary" onClick={() => detailsbyid(item._id)}>Edit</button>
                          )}
                          {' '}
                          {homepermission.home_plan_type?.includes('delete') && (
                            <>
                              {
                                item.home_plan_type_status === 1 ?
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
          <CButton color="primary" onClick={collectExceldata} href={'/Viewhomeplantype'}>Upload</CButton>
        </CModalFooter>
      </CModal>

      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Plan Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={addplantype}>
                      <div className="row">
                        <div className="col-md-6">

                          <label className="form-label"><strong>Add Plan Type</strong></label>
                          <input type='text' className="form-control"
                            name='home_plan_type'
                            placeholder="Enter Plan Type"
                            defaultValue=""
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
          <Modal.Title>Edit Plan Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={updateHomeplantypelist}>
                      <div className="row">
                        <div className="col-md-6">

                          <label className="form-label"><strong>Edit Plan Type</strong></label>
                          <input type='text' className="form-control"
                            name='home_plan_type'
                            placeholder='Name'
                            defaultValue={home_plan_type}
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

export default Viewhomeplanytypelist