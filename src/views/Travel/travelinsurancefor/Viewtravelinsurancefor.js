import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import ReactPaginate from "react-paginate";
import swal from 'sweetalert'
import filePath from '../../../webroot/sample-files/travel-insurance-for.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx'
import Multiselect from "multiselect-react-dropdown";


const Viewtravelinsurancefor = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [excelfile, setExcelfile] = useState("")
  const [travel_insurance_for, setTravelinsurancefor] = useState('')
  const [travel_insurance_for_status, setTravelinsuranceforstatus] = useState()
  const [travel_insurance_for_id, setTravelinsuranceforid] = useState()
  const [visible, setVisible] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [visibleedit, setVisibleedit] = useState(false);
  const [travelpermission, setTravelpermission] = useState([]);
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [editLocation, setEditLocation] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      gettravelinsurancefor(page, perPage)
      exportlistdata();
      const userdata = JSON.parse(localStorage.getItem('user'));
      const travel_permission = userdata?.travel_permission?.[0] || {};
      setTravelpermission(travel_permission);
      locationList()
    }
  }, [])



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

  console.log(location)

  const gettravelinsurancefor = (page, perPage) => {
    setData([]);
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },

    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_travel_insurance_for?page=${page}&limit=${perPage}`, requestOptions)
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
  }

  console.log(data)

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    gettravelinsurancefor(selectedPage + 1, perPage);
  };

  const [exportlist, setExportlist] = useState([]);
  const exportlistdata = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('https://insuranceapi-3o5t.onrender.com/api/get_travel_insurance_for', requestOptions)
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

        'travel_insurance_for': item.travel_insurance_for,
        'travel_insurance_location': item.travel_insurance_location.map((data) => data.location_name).join(", "),
      }
    })
    const ws = XLSX.utils.json_to_sheet(updatedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { booktype: "xlsx", type: "array" });
    const newdata = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(newdata, "Travel-Insurance-For" + ".xlsx")
  }

  const updatestatus = async (id, travel_insurance_for_status) => {
    await fetch('https://insuranceapi-3o5t.onrender.com/api/update_travel_insurance_for_status', {
      method: 'post',
      body: JSON.stringify({ id, travel_insurance_for_status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {

        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          gettravelinsurancefor(page, perPage)
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
        else {
          swal({
            text: data.message,
            type: "error",
            icon: "error"
          })
          gettravelinsurancefor(page, perPage)
        }
      });
  }

  const collectExceldata = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('file', excelfile)
    await fetch("https://insuranceapi-3o5t.onrender.com/api/read_travel_insurance_for_excel ",
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
          gettravelinsurancefor(page, perPage);
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
            gettravelinsurancefor(page, perPage);
          });
        }
      });
  }

  const addtravelinsurancefor = async (e) => {
    e.preventDefault()
    if (e.target.name.value === '') {
      swal({
        title: "warning!",
        text: "Please Enter Travel Insurance For",
        icon: "warning",
        button: "OK",
      });
      return false;
    }

    if (selectedOption.length === 0) {
      swal({
        title: "warning!",
        text: "Please Select Location",
        icon: "warning",
        button: "OK",
      });
      return false;
    }

    else {
      const data = new FormData(e.target)
      const travel_insurance_for = data.get('name')

      await fetch('https://insuranceapi-3o5t.onrender.com/api/travelinsurancefor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          travel_insurance_for: travel_insurance_for,
          location: selectedOption

        }),
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
              gettravelinsurancefor(page, perPage);
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
              gettravelinsurancefor(page, perPage);
            });
          }
        });
    }
  }

  const detailsbyid = async (ParamValue) => {
    setTravelinsuranceforid(ParamValue)
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_travel_insurance_for_detailsbyid', {
      method: 'post',
      body: JSON.stringify({ ParamValue }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    setTravelinsurancefor(result.data[0].travel_insurance_for)
    const location = result.data[0].travel_insurance_location;
    const locationid = location.map((data) => ({ label: data.location_name, value: data._id }));
    setSelectedOption(locationid);
    handleChange(locationid);
    setVisibleedit(true);
  }


  const updatetravelinsurancefor = async (e) => {

    try {
      e.preventDefault()
      const data = new FormData(e.target);
      const travel_insurance_for = data.get('travel_insurance_for');
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

      await fetch(`https://insuranceapi-3o5t.onrender.com/api/update_travel_insurance_for_details`, {
        method: "POST",
        body: JSON.stringify(
          {
            ParamValue: travel_insurance_for_id,
            travel_insurance_for: travel_insurance_for,
            location: location_id
          }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.status == 200) {
            setShowModal(false);
            swal({
              text: data.message,
              icon: "success",
              button: false,
            })
            gettravelinsurancefor(page, perPage);
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
              icon: "error"
            }).then(function () {
              gettravelinsurancefor(page, perPage);
            });
          }
        });
      setVisibleedit(false);
    } catch (error) {
      console.log(error)
    }
  }

  const startFrom = (page - 1) * perPage;

  const Addtravelinsurancefor = () => {
    navigate("/addtravelinsurancefor")
  }

  const deleteItem = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteTravelMaster/?id=${id}&type=travelinsurance`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          swal({
            text: data.message,
            icon: "success",
            button: false,
          })
          gettravelinsurancefor(page, perPage);
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
          gettravelinsurancefor(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }

      })
  }

  const handleChange = (selectedOption) => {
    setEditLocation(selectedOption);
  };


  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Travel Insurance For</h4>
              </div>
              <div className="col-md-6">
                {travelpermission.travel_insurance_for?.includes('create') ?
                  <button className='btn btn-primary' style={{ float: "right" }} onClick={() => Addtravelinsurancefor()}>Add Travel Insurance For</button>
                  : ''}
              </div>
            </div>
          </div>
          <div className="card-header" style={{ textAlign: 'right' }}>
            {travelpermission.travel_insurance_for?.includes('download') ?
              <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
              : ''}
            {travelpermission.travel_insurance_for?.includes('upload') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
              : ''}
            {travelpermission.travel_insurance_for?.includes('export') ?
              <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
              : ''}
          </div>
          <div className="card-body">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>
                  <th scope="col">Insurance For</th>
                  <th scope="col">Location</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td>{startFrom + index + 1}</td>
                      <td>{item.travel_insurance_for}</td>
                      <td>{item.travel_insurance_location.map((data) => data.location_name).join(", ")}</td>
                      <td>
                        {travelpermission.travel_insurance_for?.includes('edit') && (
                          <button className="btn btn-primary" onClick={() => { detailsbyid(item._id); }}>Edit</button>
                        )}
                        {' '}
                        {travelpermission.travel_insurance_for?.includes('delete') && (
                          <>
                            {
                              item.travel_insurance_for_status === 1 ?
                                <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                                <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>
                            }
                            <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>

                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No Data Found</td>
                  </tr>
                )}
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
          <CButton color="primary" onClick={collectExceldata} href={'/Viewtravelinsurancefor'}>Upload</CButton>
        </CModalFooter>
      </CModal>


      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Travel Insurance For</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={addtravelinsurancefor}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label"><strong>Add Insurance For</strong></label>
                          <input type="text"
                            className="form-control"
                            name="name"
                            placeholder="Add Insurance For"
                            autoComplete="off"
                            required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label"><strong>Select location</strong></label>
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
          <Modal.Title>Edit Insurance For</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={updatetravelinsurancefor}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit Insurance For</strong></label>
                          <input type='text' className="form-control"
                            name='travel_insurance_for'
                            placeholder='Name'
                            defaultValue={travel_insurance_for}
                            autoComplete="off"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label"><strong>Location</strong></label>.
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
                        </div>
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

export default Viewtravelinsurancefor
