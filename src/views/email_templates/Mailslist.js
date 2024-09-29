import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import ReactPaginate from "react-paginate";
import { Container } from 'react-bootstrap';
const Mailslist = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const { emails } = location.state || {};

    // Now you can use the `emails` array as needed
    console.log(emails);


  return (
        <>
          <Container>
              <div className="card mb-4">
                  <div className="card-header">
                      <div className="row">
                          <div className="col-md-6">
                              <h4 className="card-title">Mails</h4>
                          </div>
                          <div className="col-md-6">

                              {/* <button className='btn btn-primary' style={{ float: "right" }} onClick={() => setShowModal(true)}>Add Types</button> */}

                          </div>
                      </div>
                  </div>
                  <div className="card-header" style={{ textAlign: 'right' }}>

                  </div>
                  <div className="card-body">
                      <table className="table table-bordered">
                          <thead className="thead-dark">
                              <tr className="table-info">
                                  <th scope="col">#</th>
                                  <th scope="col">Subject</th>
                                  {/* <th scope="col">Received By</th> */}
                                  <th scope="col">Action</th>

                              </tr>
                          </thead>
                          <tbody>
                              {
                                  emails?.length > 0 ?
                                      emails.map((item, index) =>
                                          <tr key={index}>
                                              <td>{index + 1}</td>
                                              <td>{item.subject}</td>
                                              {/* <td>{received_by?.map((val) => val.email).join(', ')}</td> */}
                                           


                                              <td>
                                                  <button className="btn btn-primary"
                                                    onClick={() => navigate(`/ViewMail?id=${item?._id}`)}
                                                  >
                                                      View
                                                  </button>{' '}
                                              </td>
                                          </tr>
                                      ) : <tr>
                                          <td colSpan="7">No Data Found</td>
                                      </tr>
                              }
                          </tbody>
                      </table>
                  </div>
              </div>
          </Container>
        </>
    );

}

export default Mailslist