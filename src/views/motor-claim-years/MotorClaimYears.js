import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import filePath from '../../webroot/sample-files/user-type.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';

const MotorClaimYears = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [perPage] = useState(5);
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
      getclaimyear(page, perPage);
      const userdata = JSON.parse(localStorage.getItem('user'));
      const master_permission = userdata?.master_permission?.[0] || {};
      setMasterpermission(master_permission);

    }
  }, [])

  const getclaimyear = (page, perPage) => {
    setData([]);
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/motorClaimsYears?limit=${perPage}&page=${page}`, requestOptions)
      .then(response => response.json())
      .then(
        data => {
          const total = data.count;
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
    getclaimyear(selectedPage + 1, perPage);
  };




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

            text: data.message,
            type: "success",
            icon: "success",
            button: false
          })

          getclaimyear(page, perPage);

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
          })
          getclaimyear(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
      });
  }

  const [questions, setQuestions] = useState('');
  const [year, setYear] = useState('');

  const addclaimyears = async (e) => {
    e.preventDefault();
    console.log(questions, year)

    await fetch('https://insuranceapi-3o5t.onrender.com/api/motorClaimsYears', {
      method: 'POST',
      body: JSON.stringify({ questions: questions, year: year }),
      headers: {
        'Content-Type': 'application/json',
      },

    })
      .then(response => response.json())
      .then(data => {
        if (data.status == 201) {
          setShowModal(false);
          swal({
            text: data.message,
            type: "success",
            icon: "success",
            button: false
          })
          getclaimyear(page, perPage);
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
          getclaimyear(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
      });
  }



  const [detailsbyid, setDetailsbyid] = useState([])


  const getdetailsbyid = async (ParamValue) => {
    setId(ParamValue)
    console.log(ParamValue)
    var requestOptions = {
      method: 'GET',
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/motorClaimsYearssById?id=${ParamValue}`, requestOptions)
      .then(response => response.json())
      .then(result =>
        setDetailsbyid(result.data)

      )
      .catch(error => console.log('error', error));

    setVisibleedit(true);
  }

  const [imageurl, setImageurl] = useState(null);
  const handleImagePreview = async (data) => {
    setImageurl(data);
  }

  const [editquestions, setEditquestions] = useState('');
  const [edityear, setEdityear] = useState('');


  const updateclaimyears = async (e) => {
    e.preventDefault();



    await fetch(`https://insuranceapi-3o5t.onrender.com/api/motorClaimsYears?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ questions: editquestions, year: edityear }),
      headers: {
        'Content-Type': 'application/json',
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
          getclaimyear(page, perPage);
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
          getclaimyear(page, perPage);
          setTimeout(() => {
            swal.close()
          }, 1000);
        }
      });
  }

  const updatestatus = async (id, status) => {

    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/motorClaimsYears?id=${id}`, {
      method: 'put',
      body: JSON.stringify({ status: status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    swal("Updated Succesfully", "", "success");
    getclaimyear(page, perPage)
  }

  const startFrom = (page - 1) * perPage;


  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Claim years</h4>
              </div>
              {/* <div className="col-md-6">
                { masterpermission.usertype?.includes('create') ?
                <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add Claim years</button>
                : '' }
              </div> */}
            </div>
          </div>
          {/* <div className="card-header" style={{ textAlign: 'right' }}>
            { masterpermission.usertype?.includes('download') ?
            <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
            : '' }
            { masterpermission.usertype?.includes('upload') ?
            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
            : '' }
            { masterpermission.usertype?.includes('export') ?
            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
            : '' }
          </div> */}
          <div className="card-body">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>
                  <th scope="col">Questions</th>
                  <th scope="col">Year</th>

                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  data?.length > 0 ?
                    data.map((item, index) =>
                      <tr key={index}>
                        <td>{startFrom + index + 1}</td>
                        <td>{item.questions}</td>
                        <td>{item.year}</td>
                        <td>
                          {masterpermission.usertype?.includes('edit') && (
                            <button className="btn btn-primary" onClick={() => getdetailsbyid(item._id)}>Edit</button>
                          )}
                          {' '}
                          {/* { masterpermission.usertype?.includes('delete') && (
                            <>
                            {
                              item.status === true ?
                                <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, false) }}>Deactivate</button> :
                                <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, true) }}>Activate</button>
                            }
                            </>
                          )} */}
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
          <Modal.Title>Add claim years</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">

                  <div className="card-body">
                    <form action="/" method="POST">
                      <div className="row">

                        <div className="col-md-6">
                          <label className="form-label"><strong>Add Question</strong></label>
                          <input type='text' className="form-control"
                            name='question'
                            placeholder='Enter Question'

                            required
                            autoComplete="off"
                            onChange={(e) => setQuestions(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Add year</strong></label>
                          <input type='number' className="form-control"
                            name='year'
                            placeholder='Enter year'

                            required
                            autoComplete="off"
                            onChange={(e) => setYear(e.target.value)}

                          />
                        </div>

                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }} onClick={addclaimyears}>Submit</button>
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
          <Modal.Title>Edit Claim Years</Modal.Title>
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
                          <label className="form-label"><strong>Edit Question</strong></label>
                          <input type='text' className="form-control"
                            name='question'
                            placeholder='Enter Name'
                            defaultValue={detailsbyid.questions}
                            required
                            autoComplete="off"
                            onChange={(e) => setEditquestions(e.target.value)}
                            readOnly
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit Year</strong></label>
                          <input type='number' className="form-control"
                            name='year'
                            placeholder='Enter Designation'
                            defaultValue={detailsbyid.year}
                            required
                            autoComplete="off"
                            onChange={(e) => setEdityear(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }} onClick={updateclaimyears}>Submit</button>
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

export default MotorClaimYears;