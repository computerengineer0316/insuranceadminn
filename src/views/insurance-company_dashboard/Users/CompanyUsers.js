import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { Modal, Button } from 'react-bootstrap';
import Multiselect from "multiselect-react-dropdown";

const CompanyUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [perPage] = useState(15);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [visibleedit, setVisibleedit] = useState(false);
  const [details, setDetails] = useState([]);
  const [lineOfBusiness, setLineOfBusiness] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [lob, setlob] = useState([]);

  useEffect(() => {
    getUsers(page, perPage);
    getlistLineOfBusiness();

  }, []);

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
        console.log(data)
        const line_of_businessdt = data?.data
        const line_of_business_list = line_of_businessdt?.map((item) => {
          return {
            label: item?.line_of_business_name,
            value: item?._id,
          }
        }
        )
        setLineOfBusiness(line_of_business_list)
      })
  }

  const getUsers = async (page, perPage) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
      }
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/getRequestForUserCreate?page=${page}&limit=${perPage}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data.data);
        const total = data.total;
        const slice = total / perPage;
        const pages = Math.ceil(slice);
        setPageCount(pages);
        setUsers(data.data);

        let request = 0;
        const requestdata = data.data;
        console.log(requestdata.filter((item) => item.agentApprovalStatus == false));
        request = requestdata?.length;
        console.log(request);
        localStorage.setItem('request', request);

      });
  }

  const handlePageClick = (e) => {
    const selectedPage = e.selected + 1;
    setPage(selectedPage);
    getUsers(selectedPage, perPage);
  };

  const startFrom = (page - 1) * perPage;

  const updateStatus = async (id) => {
    const requestOptions = {
      method: 'put',
      headers: {
        'Content-Type': 'application'
      },
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/editRequestForUserCreate/${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.status == 200) {
          swal("Success", "User Status Updated Successfully", "success");
          getUsers(page, perPage);
        } else {
          swal("Error", "Failed to Update User Status", "error");
        }
      });
  }

  const deleteCompanyUser = async (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
      }
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteRequestForUserCreate/${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.status == 200) {
          swal("Success", "User Deleted Successfully", "success");
          getUsers(page, perPage);
        } else {
          swal("Error", "Failed to Delete User", "error");
        }
      });
  }

  const detailsbyid = async (id) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
      }
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/getRequestForUserCreatebyid/${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data.data);
        setDetails(data.data);
        setVisibleedit(true);
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const namedt = !name ? details.name : name;
    const emaildt = !email ? details.email : email;
    const mobiledt = !mobile ? details.mobile : mobile;
    const line_of_businessdt = !lob.length ? details.line_of_business : lob;
    console.log(namedt, emaildt, mobiledt, line_of_businessdt);

    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: namedt, email: emaildt, mobile: mobiledt, line_of_business: line_of_businessdt })
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/editRequestForUserCreate/${details._id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.status == 200) {
          swal("Success", "User Updated Successfully", "success");
          setVisibleedit(false);
          getUsers(page, perPage);
        } else {
          swal("Error", "Failed to Update User", "error");
        }
      });

  }







  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-6">
                  <h4 className="card-title">Users List</h4>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr No.</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Line Of Business</th>
                          <th>Company Name</th>
                          <th>Approval Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={index}>
                            <td>{startFrom + index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.mobile}</td>
                            <td>{user?.line_of_business?.map((val) => val.label).join(', ')}</td>
                            <td>{user?.insurance_companys?.map((val) => val.company_name)}</td>
                            <td>
                              {user.agentApprovalStatus == false ? (
                                <>
                                  <span className=" badge-success badge-table" onClick={() => updateStatus(user._id)} >Approve</span>&nbsp;
                                  <span className=" badge-danger badge-table" onClick={() => deleteCompanyUser(user._id)}>Reject</span>
                                </>
                              ) : (
                                <span className="badge badge-success">Active</span>
                              )}
                            </td>
                            <td>
                              <button className="btn btn-primary" onClick={() => { detailsbyid(user._id) }}>Edit</button>&nbsp;
                            </td>
                          </tr>
                        ))}
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

              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label"><strong>Name</strong></label>
                          <input type='text' className="form-control" name='business_type_name' placeholder='Name' autoComplete='off' required defaultValue={details.name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label"><strong>Email</strong></label>
                          <input type="email" className="form-control" name="staff_email" placeholder="Enter Email" autoComplete="off" required defaultValue={details.email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form-group mb-3">
                            <label><strong>Mobile</strong></label>
                            <input type="text" className="form-control" name="staff_mobile" placeholder="Enter Mobile" autoComplete="off" required defaultValue={details.mobile} onChange={(e) => setMobile(e.target.value)} />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form-group mb-3">
                            <label><strong>Line Of Business</strong></label>
                            <Multiselect
                              options={lineOfBusiness}
                              displayValue="label"
                              selectedValues={details?.line_of_business?.map((val) => {
                                return {
                                  label: val.label,
                                  value: val.value
                                }
                              })}
                              onSelect={setlob}
                              onRemove={setlob}
                              placeholder="Select LOB"
                              showCheckbox={true}
                              showArrow={true}
                            />
                          </div>
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
          <Button variant="primary" onClick={handleSubmit}>
            Update
          </Button>
          <Button variant="secondary" onClick={() => setVisibleedit(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CompanyUsers