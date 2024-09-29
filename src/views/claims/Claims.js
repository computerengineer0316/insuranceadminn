import React, { useState, useEffect } from 'react'
import { Container, Row, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { ColorRing } from 'react-loader-spinner';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Claims = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [usertype_status, setUsertypestatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [masterpermission, setMasterpermission] = useState([]);
  const [email, setEmail] = useState('');
  const [addcc, setAddCC] = useState([])
  const [item, setItem] = useState({})
  const [templetId, setTempletId] = useState('')
  const customConfig = {
    toolbar: {
      items: [
        'heading', '|',
        'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
        'indent', 'outdent', '|',
        'blockQuote', '|',
        'undo', 'redo'
      ]
    },
    placeholder: 'Start typing here...'
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getclaims(page, perPage);
      // getEmailTemplate()
      const userdata = JSON.parse(localStorage.getItem('user'));
      const master_permission = userdata?.master_permission?.[0] || {};
      setMasterpermission(master_permission);

    }
  }, [])

  const getclaims = (page, perPage) => {
    setData([]);
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getAllClaims/${perPage}/${page}`, requestOptions)
      .then(response => response.json())
      .then(
        data => {
          const total = data.data[0]?.count[0]?.total;
          console.log("total", total)
          const slice = total / perPage;
          const pages = Math.ceil(slice);
          setPageCount(pages);
          const list = data.data[0]?.data;
          setData(list)
        }
      );
  }



  const [subject, setSubject] = useState('')
  const [attatchment, setAttatchment] = useState([])
  const [status, setStatus] = useState({
    index: null,
    status: null,
    name: '',
    email: null
  })
  const handlePageClick = (e) => {
    setStatus({
      index: null,
      status: null,
      name: '',
      email: null
    })
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getclaims(selectedPage + 1, perPage);
  };
  useEffect(() => {
    getEmailTemplate()

  }, [status])

  const [loader, setLoader] = useState(false)
  const getEmailTemplate = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`https://insuranceapi-3o5t.onrender.com/api/getSpecificEmailTemplates?type=claim`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.message == 'Email template fetched') {
          let tempEmail = data.data?.body
          let repw = `policy_number`
          let neww = status.policy_number
          let newtext = tempEmail?.replace(new RegExp(repw, 'g'), neww)
          let claimrepw = `claim_status`
          let claimneww = status.status
          let updatednewtext = newtext?.replace(new RegExp(claimrepw, 'g'), claimneww)

          setEmail(updatednewtext)
          setSubject(data.data?.subject)
          setTempletId(data.data?._id)
        }
        else {
          setSubject('Update to Your complaint')
          setEmail(`<p>Dear  ${status.name},</p><p> Your Application for claim with Policy Number ${status.policy_number} is ${status.status}.

                          Thank you for choosing our services for your insurance needs.
                          We appreciate your trust in us to safeguard your future. </p>`)
        }
      });
  }
  const UpdateClaim = async (item) => {
    setItem(item)
    setShowModal(true)
  }

  const startFrom = (page - 1) * perPage;

  const handledocuments = (data) => {
    try {
      window.open(`https://insuranceapi-3o5t.onrender.com/claims/${data}`, '_blank');
    } catch (error) {
      console.error("Error while opening new window:", error);
    }

  }

  const addCC = () => {
    const prevCC = [...addcc]
    prevCC.push({ email: '', index: prevCC.length + 1 })
    setAddCC(prevCC)
  }
  const removeCC = (indx) => {
    const prevCC = [...addcc]
    prevCC.splice(indx, 1)
    setAddCC(prevCC)
  }

  const sendEmail = () => {
    const fd = new FormData()
    fd.append('id', item._id)
    fd.append('email', item.email)
    fd.append('status', item.status)
    fd.append('remark', usertype_status)
    fd.append('name', item.full_name)
    fd.append('policy_number', item.policy_number)
    fd.append('subject', subject)
    fd.append('text', email)
    fd.append('cc', addcc?.length > 0 ? JSON.stringify(addcc.map((item) => item.email)) : JSON.stringify([]))
    fd.append('templetId', templetId)
    attatchment?.forEach((itm) => fd.append("files", itm.file[0]))

    // fd.append('files', files)
    // return false;
    fetch('https://insuranceapi-3o5t.onrender.com/api/UpdateClaimStatus', {
      method: 'put',
      body: fd,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((response => response.json()))
      .then(data => {
        swal(data.message, "", data.type);
        getclaims(page, perPage)
        setLoader(false)
      })
  }
  const addFile = () => {
    const prevFiles = [...attatchment]
    prevFiles.push({ file: '', index: prevFiles.length + 1 })
    setAttatchment(prevFiles)
  }
  const removeFile = (indx) => {
    const preFiles = [...attatchment]
    preFiles.splice(indx, 1)
    setAttatchment(preFiles)
  }

  const handleFilesChange = (e, index) => {
    console.log(e.target.files, "file")
    const prevFiles = [...attatchment]
    prevFiles[index].file = e.target.files
    setAttatchment(prevFiles)
  }
  const handleCCChange = (e, index) => {
    const prevCC = [...addcc]
    prevCC[index].email = e.target.value
    setAddCC(prevCC)
  }
  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Claims</h4>
              </div>
              {/* <div className="col-md-6">
                { masterpermission?.claims?.includes('create') ?
                <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add Testimonials</button>
                : '' }
              </div> */}
            </div>
          </div>
          {/* <div className="card-header" style={{ textAlign: 'right' }}>
            { masterpermission?.claims?.includes('download') ?
            <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>
            : '' }
            { masterpermission?.claims?.includes('upload') ?
            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} onClick={() => setVisible(!visible)}><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>
            : '' }
            { masterpermission?.claims?.includes('export') ?
            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={exporttocsv}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>
            : '' }
          </div> */}
          <div className="card-body">
            {loader ? <div className='row d-flex justify-content-center'>
              <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#e70808', '#003399', '#e70808', '#e70808', '#fff']}
              />
            </div> : ""}
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>
                  <th scope="col">Policy Number</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  {/* <th scope="col">Phone Number</th> */}
                  <th scope="col">Comments</th>
                  <th scope="col">Documents</th>
                  <th scope="col">CreatedAt</th>
                  <th scope="col">Status</th>
                  <th scope="col">Remark</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  data?.length > 0 ?
                    data.map((item, index) =>
                      <tr key={index}>
                        <td>{startFrom + index + 1}</td>
                        <td>{item.policy_number}</td>
                        <td>{item.full_name}</td>
                        <td>{item.email}</td>
                        {/* <td>{item.phone_number}</td> */}
                        <td>{item.comments}</td>
                        <td><button className='btn btn-warning' onClick={() => handledocuments(item.documents?.map((data) => data?.filename))}>View</button></td>
                        <td>{new Date(item.createdAt).toLocaleString()}</td>
                        <td>
                          <select defaultValue={item?.policy_claim_status}
                            onChange={(e) => setStatus({ index: index, status: e.target.value, name: item.full_name, email: item.email, policy_number: item.policy_number })}>
                            <option hidden value="">Select Status </option>
                            <option value="In Progress">In Progress</option>
                            <option value="Partially Done">Partially Done</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td>
                          <input type='text' placeholder='Add Remark'
                            className="form-control"
                            onChange={(e) => setUsertypestatus(e.target.value)} /></td>


                        <td>
                          <button disabled={status.index == index ? false : true}
                            onClick={() => UpdateClaim(item)}
                            className='btn btn-primary'>Send Email</button>
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
          <Modal.Title>Send Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">

                  <div className="card-body">
                    <form action="/" method="PUT">
                      <div className="row">
                        <div className='col-md-6'>
                          <label className='form-label'><strong>Reciever</strong></label>
                          <input className='form-control' type='text' defaultValue={status.email} />
                        </div>
                        <div className='col-md-6'>
                          <label className='form-label'>
                            <div className='btn btn-success mx-1' onClick={() => addCC()}>+</div>
                            <strong>Add CC</strong>
                          </label>
                          {
                            addcc?.map((itm, indx) => {
                              return (
                                <div className='d-flex my-1' key={indx}>
                                  <input onChange={(e) => handleCCChange(e, indx)} className='form-control' type='text' />
                                  <div onClick={() => removeCC(indx)} className='btn btn-danger mx-1'>x</div>
                                </div>
                              )
                            })
                          }
                        </div>
                        <div className="col-md-6">
                          <label className="form-label"><strong>Add Subject</strong></label>
                          <input type='text' className="form-control"
                            name='name'
                            placeholder='Enter Subject'
                            defaultValue={subject}
                            required
                            autoComplete="off"
                            onChange={(e) => setSubject(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">
                            <div className='btn btn-success mx-1' onClick={() => addFile()}>+</div>
                            <strong>Add Attatchment</strong>
                          </label>
                          {
                            attatchment?.map((itm, indx) => {
                              return (
                                <div className='d-flex my-1' key={indx}>
                                  <input onChange={(e) => handleFilesChange(e, indx)} className='form-control' type='file' />
                                  <div onClick={() => removeFile(indx)} className='btn btn-danger mx-1'>x</div>
                                </div>
                              )
                            })
                          }
                          {/* <input type='file' className="form-control"
                            name='image'
                            placeholder='Select Image'
                            required
                            autoComplete="off"
                            onChange={(e) => setAttatchment(e.target.files[0])}
                          /> */}
                        </div>

                        <div className="col-md-12">
                          <div className="form-group mb-3">
                            <label><strong>Email</strong></label>
                            <CKEditor
                              editor={ClassicEditor}
                              data={email}
                              config={customConfig}
                              onReady={editor => {
                                // You can store the "editor" and use when it is needed.
                                console.log('Editor is ready to use!', editor);
                              }}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                console.log(data, ">>>>>>>data")
                                setEmail(data);
                              }}
                              onBlur={(event, editor) => {
                                console.log('Blur.', editor);
                              }}
                              onFocus={(event, editor) => {
                                console.log('Focus.', editor);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div type="submit"
                            className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}
                            onClick={() => sendEmail()}>Send Email</div>
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
    </>
  )
}

export default Claims;