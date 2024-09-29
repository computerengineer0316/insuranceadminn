import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import filePath from '../../webroot/sample-files/user-type.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';
import Multiselect from 'multiselect-react-dropdown';
import DatePicker from "react-datepicker";  //https://www.npmjs.com/package/react-datepicker
import "react-datepicker/dist/react-datepicker.css";

const ViewSpecialoffer = () => {
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
      getspecialoffers(page, perPage);
      const userdata = JSON.parse(localStorage.getItem('user'));
      const master_permission = userdata?.master_permission?.[0] || {};
      setMasterpermission(master_permission);
      customerslist();
      loblist();
    }
  }, [])

  const [customerslistdata, setCustomerslistdata] = useState([])
  const [selectedcustomer, setSelectedcustomer] = useState([])
  const [loblistdata, setLoblistdata] = useState([])
  const [selectedlob, setSelectedlob] = useState([])
  const [discount_amount, setDiscount_amount] = useState('');
  const [discount_code, setDiscount_code] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [status, setStatus] = useState('');

  const customerslist = () => {
    var requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('https://insuranceapi-3o5t.onrender.com/api/getCustomerlist', requestOptions)
      .then(response => response.json())
      .then(data => {
        // console.log("all  costomer list",data.data)
        const formattedOptions = data?.data
        const costomerArr = []
        for (let i = 0; i < formattedOptions?.length; i++) {
          if (formattedOptions[i]?.email != null) {
            costomerArr.push({
              label: formattedOptions[i].email,
              value: formattedOptions[i]._id,
            })
          }

        }
        setCustomerslistdata(costomerArr);
      });
  };


  const loblist = () => {
    var requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list', requestOptions)
      .then(response => response.json())
      .then(data => {
        const formattedOptions = data.data.map(lob => ({
          label: lob.line_of_business_name, // Displayed name in the dropdown
          value: lob._id,   // Value to be associated with the selected option
        }));
        setLoblistdata(formattedOptions);
      });
  };
  console.log(loblistdata)






  const handleSelect = (selectedItems) => {
    console.log(">>>>>>>>>>selectedItems", selectedItems)
    setSelectedcustomer(selectedItems);
  };
  const handleUpdateSelect = (values) => {

  }

  const handleLobSelect = (selectedItems) => {
    setSelectedlob(selectedItems);
  };








  const getspecialoffers = (page, perPage) => {
    setData([]);
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/get_special_offer/${perPage}/${page}`, requestOptions)
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
    getspecialoffers(selectedPage + 1, perPage);
  };


  const updatestatus = async (id, status) => {

    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/update_special_offer', {
      method: 'put',
      body: JSON.stringify({ ParamValue: id, status: status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    swal("Updated Succesfully", "", "success");
    getspecialoffers(page, perPage)
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
            getspecialoffers(page, perPage);
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
            getspecialoffers(page, perPage);
          });
        }
      });
  }


  const addspecialoffers = async (e) => {
    e.preventDefault();

    console.log(">>>>>>>>>>selectedcustomer", selectedcustomer.map(data => data.value))
    console.log(">>>>>>>>>>selectedlob", selectedlob.map(data => data.value))
    console.log(">>>>>>>>>>discount_type", discount_amount)
    console.log(">>>>>>>>>>discount_code", discount_code)
    console.log(">>>>>>>>>>description", description)
    console.log(">>>>>>>>>>startDate", startDate)
    console.log(">>>>>>>>>>endDate", endDate)

    await fetch('https://insuranceapi-3o5t.onrender.com/api/add_special_offer', {
      method: 'post',
      body: JSON.stringify({ userId: selectedcustomer.map(data => data.value), policy_type: selectedlob.map(data => data.value), discount_amount: discount_amount, discount_code: discount_code, description: description, startDate: startDate, endDate: endDate }),
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
            getspecialoffers(page, perPage);
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
            getspecialoffers(page, perPage);
          });
        }
      });
  }


  const [specialoffers, setSpecialoffers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedLobdata, setSelectedLobdata] = useState();

  const getdetails = async (ParamValue) => {
    // alert("getdetails")
    setId(ParamValue)
    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/get_special_offer_by_id', {
      method: 'post',
      body: JSON.stringify({ ParamValue }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    result = await result.json();
    setSpecialoffers(result.data);
    const selectedUserIds = result.data?.userId;
    const selectedUserNames = customerslistdata
      .filter(user => selectedUserIds.includes(user.value))
      .map(user => ({ label: user.label, value: user.value }));
    setSelectedcustomer(selectedUserNames);
    const selectedLobIds = result.data.policy_type;
    const selectedLobNames = loblistdata
      .filter(lob => selectedLobIds.includes(lob.value))
      .map(lob => ({ label: lob.label, value: lob.value }));
    setSelectedlob(selectedLobNames);
    setEditstartDate(result.data.startDate);
    setEditendDate(result.data.endDate);
    setVisibleedit(true);

  }



  const [editdiscount_amount, setEditdiscount_amount] = useState('');
  const [editdiscount_code, setEditdiscount_code] = useState('');
  const [editdescription, setEditdescription] = useState('');
  const [editstartDate, setEditstartDate] = useState(new Date());
  const [editendDate, setEditendDate] = useState(new Date());
  const [editstatus, setEditstatus] = useState('');

  const updatespecialoffer = async (e) => {
    e.preventDefault();

    console.log(">>>>>>>>>>selectedcustomer", selectedcustomer?.map(data => data.value))
    console.log(">>>>>>>>>>selectedlob", selectedlob?.map(data => data.value))
    console.log(">>>>>>>>>>discount_type", editdiscount_amount || specialoffers.discount_amount)
    console.log(">>>>>>>>>>discount_code", editdiscount_code || specialoffers.discount_code)
    console.log(">>>>>>>>>>description", editdescription || specialoffers.description)
    console.log(">>>>>>>>>>startDate", editstartDate || specialoffers.startDate)
    console.log(">>>>>>>>>>endDate", editendDate || specialoffers.endDate)


    await fetch('https://insuranceapi-3o5t.onrender.com/api/update_special_offer', {
      method: 'put',
      body: JSON.stringify(
        {
          ParamValue: id,
          userId: selectedcustomer?.map(data => data.value) || specialoffers.userId,
          policy_type: selectedlob?.map(data => data.value) || specialoffers.policy_type,
          discount_amount: editdiscount_amount || specialoffers.discount_amount,
          discount_code: editdiscount_code || specialoffers.discount_code,
          description: editdescription || specialoffers.description,
          startDate: editstartDate || specialoffers.startDate,
          endDate: editendDate || specialoffers.endDate,
        }
      ),
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
            getspecialoffers(page, perPage);
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
            getspecialoffers(page, perPage);
          });
        }
      });
  }


  const startFrom = (page - 1) * perPage;

  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Special Offers</h4>
              </div>
              <div className="col-md-6">
                {masterpermission?.special_offers?.includes('create') ?
                  <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add Special Offers</button>
                  : ''}
              </div>
            </div>
          </div>
          {/* <div className="card-header" style={{ textAlign: 'right' }}>
            { masterpermission?.special_offers?.includes('download') ?
            <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
            : '' }
            { masterpermission?.special_offers?.includes('upload') ?
            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
            : '' }
            { masterpermission?.special_offers?.includes('export') ?
            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
            : '' }
          </div> */}
          <div className="card-body">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>
                  {/* <th scope="col">userId</th> */}
                  <th scope="col">policy_type</th>
                  <th scope="col">discount_amount</th>
                  <th scope="col">discount_code</th>
                  <th scope="col">description</th>
                  <th scope="col">startDate</th>
                  <th scope="col">endDate</th>

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
                        {/* <td>{item.userId}</td> */}
                        <td>{item.policy_type?.map(data => data.line_of_business_name)}</td>
                        <td>{item.discount_amount}</td>
                        <td>{item.discount_code}</td>
                        <td>{item.description}</td>
                        <td>{new Date(item.startDate).toLocaleString()}</td>
                        <td>{new Date(item.endDate).toLocaleString()}</td>
                        <td>{item.status == true ? 'Active' : 'Inactive'}</td>
                        <td>
                          {masterpermission?.special_offers?.includes('edit') && (
                            <button className="btn btn-primary" onClick={() => getdetails(item._id)}>Edit</button>
                          )}
                          {' '}
                          {masterpermission?.special_offers?.includes('delete') && (
                            <>
                              {
                                item.status === true ?
                                  <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, false) }}>Deactivate</button> :
                                  <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, true) }}>Activate</button>
                              }
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
          <Modal.Title>Add Special Offers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">

                  <div className="card-body">
                    <form>
                      <div className="row">

                        <div className="col-md-6">
                          <label className="form-label"><strong>Add User</strong></label>
                          <Multiselect
                            options={customerslistdata}
                            // selectedValues={selectedcustomer}
                            displayValue='label'
                            onSelect={setSelectedcustomer}
                            onRemove={setSelectedcustomer}
                            placeholder='Select Customer'
                            showCheckbox={true}
                            avoidHighlightFirstOption={true}
                            style={{ chips: { background: "#007bff" } }}
                            showArrow={true}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Add Policy Type</strong></label>
                          <Multiselect
                            options={loblistdata}
                            displayValue="label"
                            selectedValues={selectedlob}
                            onSelect={setSelectedlob}
                            onRemove={setSelectedlob}
                            placeholder='Select Policy Type'
                            showCheckbox={true}
                            avoidHighlightFirstOption={true}
                            style={{ chips: { background: "#007bff" } }}
                            showArrow={true}
                          />

                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Add Discount Amount</strong></label>
                          <input type='text' className="form-control"
                            name='usertype'
                            placeholder='Enter Discount Amount'
                            defaultValue=""
                            required
                            autoComplete="off"
                            onChange={(e) => setDiscount_amount(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Add Discount Code</strong></label>
                          <input type='text' className="form-control"
                            name='usertype'
                            placeholder='Discount Code'
                            defaultValue=""
                            required
                            autoComplete="off"
                            onChange={(e) => setDiscount_code(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Add Description</strong></label>
                          <input type='text' className="form-control"
                            name='usertype'
                            placeholder='Enter Description'
                            defaultValue=""
                            required
                            autoComplete="off"
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>

                        {/* <div className="col-md-6">
                          <label className="form-label" ><strong>Status</strong></label>
                          <select className="form-control" name="usertype_status" onChange={(e) => setStatus(e.target.value)} >
                            <option value="" hidden>Select Status</option>
                            <option value={true}>Active</option>
                            <option value={false}>InActive</option>
                          </select>
                        </div> */}

                        <div className="col-md-6">
                          <label className="form-label"><strong>Add Start Date</strong></label><br />
                          <DatePicker
                            className='form-control'
                            selected={startDate}
                            format="dd/MM/yyyy"
                            onChange={(date) => setStartDate(date)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Add End Date</strong></label><br />
                          <DatePicker
                            className='form-control'
                            selected={endDate}
                            format="dd/MM/yyyy"
                            onChange={(date) => setEndDate(date)}
                          />
                        </div>


                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }} onClick={addspecialoffers}>Submit</button>
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
          <Modal.Title>Edit Special Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form >
                      <div className="row">

                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit User</strong></label>
                          <Multiselect
                            options={customerslistdata}
                            displayValue="label"
                            selectedValues={selectedcustomer}
                            onSelect={handleSelect}
                            onRemove={handleSelect}
                            placeholder='Select Customer'
                            showCheckbox={true}
                            avoidHighlightFirstOption={true}
                            style={{ chips: { background: "#007bff" } }}
                            showArrow={true}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit Policy Type</strong></label>
                          <Multiselect
                            options={loblistdata}
                            displayValue="label"
                            selectedValues={selectedlob}
                            onSelect={handleLobSelect}
                            onRemove={handleLobSelect}
                            placeholder='Select Policy Type'
                            showCheckbox={true}
                            avoidHighlightFirstOption={true}
                            style={{ chips: { background: "#007bff" } }}
                            showArrow={true}
                          />

                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit Discount Amount</strong></label>
                          <input type='text' className="form-control"
                            name='usertype'
                            placeholder='Enter Discount Amount'
                            defaultValue={specialoffers.discount_amount}
                            required
                            autoComplete="off"
                            onChange={(e) => setEditdiscount_amount(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit Discount Code</strong></label>
                          <input type='text' className="form-control"
                            name='usertype'
                            placeholder='Discount Code'
                            defaultValue={specialoffers.discount_code}
                            required
                            autoComplete="off"
                            onChange={(e) => setEditdiscount_code(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit Description</strong></label>
                          <input type='text' className="form-control"
                            name='usertype'
                            placeholder='Enter Description'
                            defaultValue={specialoffers.description}
                            required
                            autoComplete="off"
                            onChange={(e) => setEditdescription(e.target.value)}
                          />
                        </div>

                        {/* <div className="col-md-6">
                          <label className="form-label" ><strong>Status</strong></label>
                          <select className="form-control" name="usertype_status" onChange={(e) => setEditstatus(e.target.value)} >
                            <option hidden defaultValue={specialoffers.status}>{specialoffers.status == true ? 'Active' : 'InActive'}</option>
                            <option value={true}>Active</option>
                            <option value={false}>InActive</option>
                          </select>
                        </div> */}

                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit Start Date</strong></label><br />
                          <DatePicker
                            className='form-control'
                            selected={editstartDate && !isNaN(new Date(editstartDate))
                              ? new Date(editstartDate)
                              : null}
                            format="dd/MM/yyyy"
                            onChange={(date) => setEditstartDate(date)}
                          />

                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit End Date</strong></label><br />
                          <DatePicker
                            className='form-control'
                            selected={editendDate && !isNaN(new Date(editendDate))
                              ? new Date(editendDate)
                              : null}
                            format="dd/MM/yyyy"
                            onChange={(date) => setEditendDate(date)}
                          />
                        </div>


                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }} onClick={updatespecialoffer}>Submit</button>
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

export default ViewSpecialoffer