import React, { useState, useEffect } from 'react'
import { Container, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";


const ViewEmailTemplates = () => {
    const navigate = useNavigate();
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [emailTemplates, setEmailTemplates] = useState([]);

    useEffect(() => {
        getEmailTemplates(page, perPage);
    }, []);

    const getEmailTemplates = async (page, limit) => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
                },
            }
            await fetch(`https://insuranceapi-3o5t.onrender.com/api/getEmailTemplates?page=${page}&limit=${limit}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    const total = data?.total;
                    const slice = total / perPage;
                    const pages = Math.ceil(slice);
                    setPageCount(pages);
                    const list = data.data;
                    console.log(list, "list");
                    setEmailTemplates(list);
                })
        } catch (error) {
            console.log(error)
        }
    };

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getEmailTemplates(selectedPage + 1, perPage);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [day, month, year].join('/');
    }




    return (
        <>
            <Container>
                <div className="card mb-4">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className="card-title">Email Templates</h4>
                            </div>
                            <div className="col-md-6 text-right" style={{ textAlign: 'right' }}>
                                <Button size="md" className="btn btn-success" onClick={() => navigate('/AddEmailTemplate')}>Add Email Template</Button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr className="table-info">
                                        <th scope="col">#</th>
                                        <th scope="col">Subject</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">LOB</th>
                                        <th scope="col">Business Type</th>
                                        <th scope="col">Plan Type</th>
                                        <th scope="col">Added By</th>
                                        <th scope="col">Added Date</th>
                                        <th scope="col">Action</th>


                                    </tr>
                                </thead>
                                <tbody>
                                    {emailTemplates.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.subject}</td>
                                            <td dangerouslySetInnerHTML={{ __html: item.body }}></td>
                                            <td>{item?.LOB?.line_of_business_name}</td>
                                            <td>{item?.business_type}</td>
                                            <td>{item?.LOB?._id == '6418643bf42eaf5ba1c9e0ef' || item?.LOB?._id == '641bf0bbcbfce023c8c76739' ? item?.plan_type?.policy_type_name : '-'}</td>
                                            <td>{item.created_by.name}</td>
                                            <td>{formatDate(item.createdAt)}</td>
                                            <td>
                                                <a href={`/EditEmailTemplate?id=${item._id}`} className="btn btn-primary">Edit</a>&nbsp;
                                                <a href={`/DeleteEmailTemplate/${item.id}`} className="btn btn-danger">Delete</a>
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
            </Container>
        </>
    )
}

export default ViewEmailTemplates