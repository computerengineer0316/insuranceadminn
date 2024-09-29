import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import filePath from '../../webroot/sample-files/user-type.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';

const ViewTestimonials = () => {
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
      gettestimonials(page, perPage);
      const userdata = JSON.parse(localStorage.getItem('user'));
      const master_permission = userdata?.master_permission?.[0] || {};
      setMasterpermission(master_permission);

    }
  }, [])

  const gettestimonials = (page, perPage) => {
    setData([]);
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/testimonials/${perPage}/${page}`, requestOptions)
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
    gettestimonials(selectedPage + 1, perPage);
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
            title: "Wow!",
            text: data.message,
            type: "success",
            icon: "success"
          }).then(function () {
            gettestimonials(page, perPage);
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
            gettestimonials(page, perPage);
          });
        }
      });
  }

  const [name, setName] = useState('')
  const [designation, setDesignation] = useState('')
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState('')
  const [image, setImage] = useState({})
  const [status, setStatus] = useState('')

  const addtestimonials = async (e) => {
    e.preventDefault();

    const fd = new FormData()
    fd.append('name', name)
    fd.append('designation', designation)
    fd.append('description', description)
    fd.append('rating', rating)
    fd.append('image', image)
    console.log(Array.from(fd))

    await fetch('https://insuranceapi-3o5t.onrender.com/api/testimonials', {
      method: 'post',
      body: fd,
    })
      .then(response => response.json())
      .then(data => {
        if (data.status == 201) {
          setShowModal(false);
          swal({
            title: "Wow!",
            text: data.message,
            type: "success",
            icon: "success"
          }).then(function () {
            gettestimonials(page, perPage);
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
            gettestimonials(page, perPage);
          });
        }
      });
  }



  const [detailsbyid, setDetailsbyid] = useState([])


  const getdetailsbyid = async (ParamValue) => {
    setId(ParamValue)
    console.log(ParamValue)
    var requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ParamValue: ParamValue }),
      redirect: 'follow'
    };
    await fetch("https://insuranceapi-3o5t.onrender.com/api/testimonialsbyid", requestOptions)
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

  const [editname, setEditname] = useState('')
  const [editdesignation, setEditdesignation] = useState('')
  const [editdescription, setEditdescription] = useState('')
  const [editrating, setEditrating] = useState('')
  const [editimage, setEditimage] = useState({})
  const [editstatus, setEditstatus] = useState('')

  const updatetestimonial = async (e) => {
    e.preventDefault();

    const fd = new FormData()
    fd.append('id', id)
    fd.append('name', editname == '' ? detailsbyid.name : editname)
    fd.append('designation', editdesignation == '' ? detailsbyid.designation : editdesignation)
    fd.append('description', editdescription == '' ? detailsbyid.description : editdescription)
    fd.append('rating', editrating == '' ? detailsbyid.rating : editrating)
    fd.append('image', editimage == {} ? detailsbyid.image.forEach(data => data) : editimage)
    console.log(Array.from(fd))
    console.log("editimage", editimage)
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/testimonials`, {
      method: 'PUT',
      body: fd,
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
            gettestimonials(page, perPage);
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
            gettestimonials(page, perPage);
          });
        }
      });
  }

  const updatestatus = async (id, status) => {

    let result = await fetch('https://insuranceapi-3o5t.onrender.com/api/testimonials', {
      method: 'put',
      body: JSON.stringify({ id, status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    swal("Updated Succesfully", "", "success");
    gettestimonials(page, perPage)
  }

  const startFrom = (page - 1) * perPage;


  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Testimonials</h4>
              </div>
              <div className="col-md-6">
                {masterpermission?.testimonials?.includes('create') ?
                  <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add Testimonials</button>
                  : ''}
              </div>
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
            <table className="table table-bordered yatchplanss123">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">designation</th>
                  <th scope="col">description</th>
                  <th scope="col">rating</th>
                  <th scope="col">image</th>
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
                        <td>{item.name}</td>
                        <td>{item.designation}</td>
                        <td className='text-wrap'>{item.description}</td>
                        <td>{item.rating}</td>
                        <td>{<img src={`https://insuranceapi-3o5t.onrender.com/testimonials/${item.image?.map((data) => data?.filename)}`} alt='image' height={100} width={100} />}</td>

                        <td>{item.status == true ? 'Active' : 'Inactive'}</td>
                        <td>
                          {masterpermission.testimonials?.includes('edit') && (
                            <button className="btn btn-primary" onClick={() => getdetailsbyid(item._id)}>Edit</button>
                          )}
                          {' '}
                          {masterpermission.testimonials?.includes('delete') && (
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
          <Modal.Title>Add Testimonials</Modal.Title>
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
                          <label className="form-label"><strong>Add name</strong></label>
                          <input type='text' className="form-control"
                            name='name'
                            placeholder='Enter Name'

                            required
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Add Designation</strong></label>
                          <input type='text' className="form-control"
                            name='designation'
                            placeholder='Enter Designation'

                            required
                            autoComplete="off"
                            onChange={(e) => setDesignation(e.target.value)}

                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Add Description</strong></label>
                          <input type='text' className="form-control"
                            name='description'
                            placeholder='Enter Description'

                            required
                            autoComplete="off"
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Add Rating</strong></label>
                          <input type='number' className="form-control"
                            name='rating'
                            placeholder='Enter Rating'

                            required
                            autoComplete="off"
                            onChange={(e) => setRating(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Add Image</strong></label>
                          <input type='file' className="form-control"
                            name='image'
                            placeholder='Select Image'
                            required
                            autoComplete="off"
                            onChange={(e) => setImage(e.target.files[0])}
                          />
                        </div>


                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }} onClick={addtestimonials}>Submit</button>
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
          <Modal.Title>Edit Testimonials</Modal.Title>
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
                          <label className="form-label"><strong>Edit name</strong></label>
                          <input type='text' className="form-control"
                            name='name'
                            placeholder='Enter Name'
                            defaultValue={detailsbyid.name}
                            required
                            autoComplete="off"
                            onChange={(e) => setEditname(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit Designation</strong></label>
                          <input type='text' className="form-control"
                            name='designation'
                            placeholder='Enter Designation'
                            defaultValue={detailsbyid.designation}
                            required
                            autoComplete="off"
                            onChange={(e) => setEditdesignation(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit Description</strong></label>
                          <input type='text' className="form-control"
                            name='description'
                            placeholder='Enter Description'
                            defaultValue={detailsbyid.description}
                            required
                            autoComplete="off"
                            onChange={(e) => setEditdescription(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit Rating</strong></label>
                          <input type='text' className="form-control"
                            name='rating'
                            placeholder='Enter Rating'
                            defaultValue={detailsbyid.rating}
                            required
                            autoComplete="off"
                            onChange={(e) => setEditrating(e.target.value)}
                          />
                        </div>
                        {/* { detailsbyid.image?.map((data)=> data?.filename) ? (
                          <> */}
                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit Image</strong></label>
                          <input type='file' className="form-control mb-4"
                            name='image'
                            placeholder='Select Image'
                            defaultValue=""
                            required
                            autoComplete="off"
                            onChange={(e) => setEditimage(e.target.files[0])}
                          />
                          <img src={`https://insuranceapi-3o5t.onrender.com/testimonials/${detailsbyid.image?.map(data => data.filename)}`} alt="image" height={200} width={350} />
                        </div>
                        {/* <span><i className="fa fa-eye" onClick={() => handleImagePreview(detailsbyid.image?.map(data => data?.filename))}></i></span>
                          {imageurl &&  (
                            <div className="col-md-6">
                              <img src={`https://insuranceapi-3o5t.onrender.com/testimonials/${imageurl}`} alt="image" height={200} width={400}/>
                            </div>
                          )} */}

                        {/* </>
                        )
                        : 
                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit Image</strong></label>
                          <input type='file' className="form-control"
                            name='image'
                            placeholder='Select Image'
                            required
                            autoComplete="off"
                            onChange={(e) => setEditimage(e.target.files[0])}
                          />
                        </div>
                        } */}

                        {/* <div className="col-md-6">
                          <label className="form-label"><strong>Edit Description</strong></label>
                          <select className="form-control" onChange={(e)=>setEditstatus(e.target.value)}>
                            <option hidden defaultValue={detailsbyid.status}>{detailsbyid.status == true ? 'Active' : 'InActive'} </option>
                            <option value={true}>Active</option>
                            <option value={false}>InActive</option>
                          </select>
                        </div> */}

                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }} onClick={updatetestimonial}>Submit</button>
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

export default ViewTestimonials