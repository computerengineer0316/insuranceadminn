import React, { useState, useEffect } from 'react'
import { Container, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
import swal from 'sweetalert';

const Usersmail = () => {
    const navigate = useNavigate();

    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [mails, setMails] = useState([]);



    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getuserspecificmail(page, perPage);

        }
    }, [])

    const getuserspecificmail = async (page, perPage) => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
                },
            }
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/getUserEmail?page=${page}&limit=${perPage}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    const total = data?.total;
                    const slice = total / perPage;
                    const pages = Math.ceil(slice);
                    setPageCount(pages);
                    const list = data.data;
                    console.log(list, "list");
                    setMails(list);
                })
        }
        catch (error) {
            console.log(error)
        }
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getuserspecificmail(selectedPage + 1, perPage);
    };


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
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Count</th>
                                    <th scope="col">Action</th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    mails?.length > 0 ?
                                        mails.map((item, index) =>
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.email}</td>
                                                <td>{item.emailCount}</td>


                                                <td>
                                                    <button className="btn btn-primary"
                                                        onClick={() => {
                                                            if (item.emails.length > 0) {
                                                                navigate('/Mailslist', { state: { emails: item.emails } });
                                                            } else {
                                                                swal("No emails found", "This user has no emails.", "warning");
                                                            }
                                                        }}
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
        </>
    )
}

export default Usersmail