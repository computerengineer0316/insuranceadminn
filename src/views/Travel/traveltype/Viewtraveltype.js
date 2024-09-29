import React, { useState, useEffect } from 'react'
import { Container, Row } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import filePath from '../../../webroot/sample-files/travel-type-details.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';
import Multiselect from "multiselect-react-dropdown";
import { Modal, Button } from 'react-bootstrap';

const Viewtraveltype = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [excelfile, setExcelfile] = useState("");
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [travel_type, setTraveltype] = useState('');
  const [travel_type_status, setTraveltypestatus] = useState('');
  const [travel_type_id, setTravelTypeId] = useState('');
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [visibleedit, setVisibleedit] = useState(false);
  const [travelpermission, setTravelpermission] = useState([]);
  const [editLocation, setEditLocation] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      gettraveltype(page, perPage);
      locationList();
      exportlistdata();
      const userdata = JSON.parse(localStorage.getItem('user'));
      const travel_permission = userdata?.travel_permission?.[0] || {};
      setTravelpermission(travel_permission);
    }
  }, [])

  const gettraveltype = async (page, perPage) => {
    setData([]);
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_travel_type/?page=${page}&limit=${perPage}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const total = data.total;
        const slice = total / perPage;
        const pages = Math.ceil(slice);
        setPageCount(pages);
        const list = data.data;
        setData(list)
        console.log(list, ">>>>>>>>>>>>>>>travel type data")
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
    fetch('https://insuranceapi-3o5t.onrender.com/api/get_travel_type', requestOptions)
      .then(response => response.json())
      .then(data => {
        setExportlist(data.data);
        console.log(data.data, ">>>>>>>>>>>export list")
      });
  }

  const fileType = 'xlsx'
  const exporttocsv = () => {
    const updatedData = exportlist.map((item, index) => {
      return {

        'travel_type': item.travel_type,
        'travel_type_location': item.travel_type_location?.map((val) => val.location_name).join(", "),
      }
    })
    console.log(updatedData, '>>>>>this is updated data')
    const ws = XLSX.utils.json_to_sheet(updatedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
    const newdata = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(newdata, "Travel-Type" + ".xlsx")
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    gettraveltype(selectedPage + 1, perPage);
  };

  const updatestatus = async (id, travel_type_status) => {
    await fetch('https://insuranceapi-3o5t.onrender.com/api/update_travel_type_status', {
      method: 'post',
      body: JSON.stringify({ id, travel_type_status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status == 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          gettraveltype(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);

        }
        else {
          swal({
            text: data.message,
            type: "error",
            icon: "error"
          }).then(function () {
            gettraveltype(page, perPage);
          });
        }
      });
  }

  const collectExceldata = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('file', excelfile)
    await fetch("https://insuranceapi-3o5t.onrender.com/api/read_travel_type_excel ",
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
          gettraveltype(page, perPage);
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
            gettraveltype(page, perPage);
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

  const addtraveltype = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const travel_type = data.get('travel_type');
    const travel_type_location = selectedOption;
    const travel_type_location_len = travel_type_location.length;
    const travel_type_location_str = [];
    for (let i = 0; i < travel_type_location_len; i++) {
      travel_type_location_str.push(travel_type_location[i].value);
    }
    await fetch('https://insuranceapi-3o5t.onrender.com/api/add_travel_type', {
      method: 'post',
      body: JSON.stringify({ travel_type: travel_type, travel_type_location: travel_type_location_str }),
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
            gettraveltype(page, perPage);
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
            gettraveltype(page, perPage);
          });
        }
      });
  }

  const detailsbyid = async (ParamValue) => {
    setTravelTypeId(ParamValue);
    const requestOptions = {
      method: "post",
      body: JSON.stringify({ ParamValue }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_travel_type_by_id`, requestOptions);
    result = await result.json();
    console.log(result.data)
    const traveldata = result.data[0];
    setTraveltype(traveldata.travel_type)
    setTraveltypestatus(traveldata.travel_type_status)
    const location = traveldata.travel_type_location;
    const locationid = location.map((data) => ({ label: data.location_name, value: data._id }));
    setSelectedOption(locationid);
    handleChange(locationid);
    setVisibleedit(true);
  }


  const handleChange = (selectedOption) => {
    setEditLocation(selectedOption);
  };



  const updateTravelType = async (e) => {
    try {
      e.preventDefault();
      const data = new FormData(e.target);
      const travel_type = data.get('travel_type');
      const location = editLocation;
      const location_id = location.map((data) => data.value);


      if (editLocation.length == 0) {
        swal({
          title: "Warning!",
          text: "Please select location",
          type: "warning",
          icon: "warning"
        });
        return false;
      }


      await fetch(`https://insuranceapi-3o5t.onrender.com/api/update_travel_type_details`, {
        method: "POST",
        body: JSON.stringify(
          {
            ParamValue: travel_type_id,
            travel_type: travel_type,
            location: location_id
          }
        ),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.status == 200) {
            swal({
              text: data.message,
              icon: "success",
              button: false,
            })
            gettraveltype(page, perPage);
            setTimeout(() => {
              swal.close()
            }, 1000);
          }
          else {
            swal({
              title: "Error!",
              text: data.message,
              type: "error",
              icon: "error"
            }).then(function () {
              gettraveltype(page, perPage);
            });
          }
        });
      setVisibleedit(false);
      gettraveltype(page, perPage)
    } catch (err) {
      console.log(err)
    }
  }

  const startFrom = (page - 1) * perPage;

  const Addtraveltype = () => {
    navigate("/Addtravelplantype")
  }


  const deleteItem = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteTravelMaster/?id=${id}&type=traveltype`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          gettraveltype(page, perPage);
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
          gettraveltype(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }

      })
  }




  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Travel Type Details</h4>
              </div>
              <div className="col-md-6">
                {travelpermission.travel_type?.includes('create') ?
                  <button className='btn btn-primary' style={{ float: "right" }} onClick={() => Addtraveltype()}>Add Travel Type</button>
                  : ''}
              </div>
            </div>
          </div>
          <div className="card-header" style={{ textAlign: 'right' }}>
            {travelpermission.travel_type?.includes('download') ?
              <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
              : ''}
            {travelpermission.travel_type?.includes('upload') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
              : ''}
            {travelpermission.travel_type?.includes('export') ?
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
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  data?.length > 0 ?
                    data.map((item, index) =>
                      <tr key={index}>
                        <td>{startFrom + index + 1}</td>
                        <td>{item.travel_type}</td>
                        <td>{item.travel_type_location?.map((val) => val.location_name).join(", ")}</td>
                        <td>
                          {travelpermission.travel_type?.includes('edit') && (
                            <button className="btn btn-primary" onClick={() => { detailsbyid(item._id); }}>Edit</button>
                          )}
                          {' '}
                          {travelpermission.travel_type?.includes('delete') && (
                            <>
                              {
                                item.travel_type_status === 1 ?
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
          <Modal.Title>Add Travel Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={addtraveltype}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label"><strong>Travel Type</strong></label>
                          <input type='text' className="form-control"
                            name='travel_type'
                            placeholder='Enter Travel Type'
                            defaultValue=""
                            autoComplete="off"
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
                          />
                        </div>
                        {/* <div className="col-md-6">
                          <label className="form-label"><strong>Status</strong></label>.
                          <select className="form-control" name="status" required>
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
          <Modal.Title>Edit Travel Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={updateTravelType}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label"><strong>Travel Type</strong></label>
                          <input type='text' className="form-control"
                            name='travel_type'
                            placeholder='Enter Travel Type'
                            autoComplete="off"
                            defaultValue={travel_type}
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
                          />
                        </div>
                        {/* <div className="col-md-6">
                          <label className="form-label"><strong>Status</strong></label>.
                          <select className="form-control" name="status" required>
                            <option value="">Select Status</option>
                            <option value="1" selected={travel_type_status == 1 ? true : false}>Active</option>
                            <option value="0" selected={travel_type_status == 0 ? true : false}>InActive</option>
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

export default Viewtraveltype