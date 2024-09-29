import React, { useCallback } from 'react'
import ReactPaginate from "react-paginate";
import { useState, useEffect } from 'react';
import { Form, useNavigate } from 'react-router-dom'
import { Container, Row, Modal, Button, Accordion, Col, Table } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import swal from 'sweetalert';

function RTAPending() {
  const [notificationCount, setNotificationCount] = useState(0)


  return (
    <>
    <Accordion>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <div style={{position:'relative'}} className="card-header new_leads">
              <strong>RTA Pending</strong>
              {notificationCount > 0 ? <div className='dashboardNotify'><h6>{notificationCount}</h6></div> : ''}
            </div>
          </Accordion.Header>
          <Accordion.Body className='scrollavcds' style={{ padding: '2px' }}>
          <table  className="table table-bordered">
            <thead className="thead-dark">
              <tr className="table-info">
                <th scope="col">Sr#</th>
                <th scope="col">Client Name</th>
                <th scope="col">Contact Number</th>
                <th scope="col">Email Address</th>
                {/* <th scope="col">Nationality</th> */}
                <th scope="col">LOB</th>
                <th scope="col">Received From</th>
                <th scope="col">Assign Date & Time</th>
                <th scope="col">Aging in minutes</th>
                <th scope="col">Instant Policy</th>
                <th scope="col">Direct Payment</th>
                <th scope="col">Action</th>



              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>hari</td>
                <td>9876543210</td>
                <td>hari@acb.com</td>
                <td>Motor</td>
                <td>Document Chaser</td>
                <td>12/12/2020 12:12</td>
                <td>2 Days ago</td>
                <td>No</td>
                <td>Yes</td>
                <td><button className="btn btn-primary btn-sm">action</button></td>

              </tr>
              <tr>
                <td>1</td>
                <td>hari</td>
                <td>9876543210</td>
                <td>hari@acb.com</td>
                <td>Motor</td>
                <td>Document Chaser</td>
                <td>12/12/2020 12:12</td>
                <td>2 Days ago</td>
                <td>No</td>
                <td>Yes</td>
                <td><button className="btn btn-primary btn-sm">action</button></td>
              </tr>
              <tr>
                <td>1</td>
                <td>hari</td>
                <td>9876543210</td>
                <td>hari@acb.com</td>
                <td>Motor</td>
                <td>Document Chaser</td>
                <td>12/12/2020 12:12</td>
                <td>2 Days ago</td>
                <td>No</td>
                <td>Yes</td>
                <td><button className="btn btn-primary btn-sm">action</button></td>

              </tr>
              <tr>
                <td>1</td>
                <td>hari</td>
                <td>9876543210</td>
                <td>hari@acb.com</td>
                <td>Motor</td>
                <td>Document Chaser</td>
                <td>12/12/2020 12:12</td>
                <td>2 Days ago</td>
                <td>No</td>
                <td>Yes</td>
                <td><button className="btn btn-primary btn-sm">action</button></td>

              </tr>
              <tr>
                <td>1</td>
                <td>hari</td>
                <td>9876543210</td>
                <td>hari@acb.com</td>
                <td>Motor</td>
                <td>Document Chaser</td>
                <td>12/12/2020 12:12</td>
                <td>2 Days ago</td>
                <td>No</td>
                <td>Yes</td>
                <td><button className="btn btn-primary btn-sm">action</button></td>

              </tr>
            </tbody>
          </table>
          {/* <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={1}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          /> */}
         </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default RTAPending;