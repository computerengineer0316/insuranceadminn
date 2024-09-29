import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';

const InsuranceCompany = () => {
    const navigate = useNavigate();
    const [listCompany, setListCompany] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getlistCompany(page, perPage);
        }
    }, []);

    const getlistCompany = async (page, perPage) => {
        setListCompany([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        await fetch(`https://insuranceapi-3o5t.onrender.com/api/getCompany?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                const list_len = list.length;
                for (let i = 0; i < list_len; i++) {
                    lobdata(list[i]);
                }
            });
    }

    const lobdata = (item) => {
        const lobid = item.company_line_of_business_id;
        const lob_id = lobid?.split(',');
        const lob_id_len = lob_id?.length;
        const lob_name = [];
        for (let i = 0; i < lob_id_len; i++) {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_by_id/${lob_id[i]}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(">>>>>>>>>>>data>>>>>>>>", data.data)
                    lob_name.push(data.data[0]?.line_of_business_name);
                    const lob_name_len = lob_name.length;
                    if (lob_name_len === lob_id_len) {
                        const lob_name_str = lob_name.join(',');
                        const newitem = { ...item, company_line_of_business_id: lob_name_str };
                        setListCompany(data => [...data, newitem]);
                    }
                });
        }
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getlistCompany(selectedPage + 1, perPage);
    };

    const UpdateCompanyStatus = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_status: status })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_company_status/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: "Ok",
                    }).then(() => {
                        getlistCompany(page, perPage);
                    });
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: "Ok",
                    }).then(() => {
                        getlistCompany(page, perPage);
                    });
                }
            });
    }
    const deleteCompany = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMasterData/?id=${id}&type=insurance_company`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getlistCompany(page, perPage);
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
                    getlistCompany(page, perPage);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }
    const startFrom = (page - 1) * perPage;

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Insurance Company</h4>
                                </div>
                                <div className="col-md-6">
                                    <a href="/AddCompany" className="btn btn-primary" style={{ float: 'right' }}>Add Insurance Company</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered yatchplanss123">
                                <thead className="thead-dark">
                                    <tr className="table-info">
                                        <th>#</th>
                                        <th>Company Logo</th>
                                        <th>Company Name</th>
                                        <th>Line Of Business</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listCompany.map((item, index) =>
                                        <tr key={index}>
                                            <td>{startFrom + index + 1}</td>
                                            <td><img src={`https://insuranceapi-3o5t.onrender.com/uploads/${item.company_logo[0].filename}`} height={50} width={200} alt="logo" /></td>
                                            <td>{item.company_name}</td>
                                            <td>{item.company_line_of_business_id}</td>
                                            <td>
                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                    <a href={`/ViewPlans?id=${item._id}`} className="btn btn-info">Plans</a>
                                                </div>&nbsp;&nbsp;
                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                    <a href={`/ViewBlackListedVehicle?id=${item._id}`} className="btn btn-secondary">Black Listed Vehicle</a>
                                                </div>&nbsp;&nbsp;
                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                    <a href={`/ViewBlackListedYacht?id=${item._id}`} className="btn btn-secondary">Black Listed Yacht</a>
                                                </div>&nbsp;&nbsp;
                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                    <a href={`/ViewLob?id=${item._id}`} className="btn btn-warning">Line Of Business</a>
                                                </div>&nbsp;&nbsp;
                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                    <a href={`/ViewBank?id=${item._id}`} className="btn btn-success">Bank</a>
                                                </div>&nbsp;&nbsp;
                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                    <a href={`/EditCompany?id=${item._id}`} className="btn btn-primary">Edit</a>&nbsp;&nbsp;
                                                    {
                                                        item.company_status === 1 ?
                                                            <button className="btn btn-danger mx-1" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) UpdateCompanyStatus(item._id, 0) }}>Deactivate</button> :
                                                            <button className="btn btn-success mx-1" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) UpdateCompanyStatus(item._id, 1) }}>Activate</button>

                                                    }
                                                </div>
                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                    <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to Delete this item?')) deleteCompany(item._id) }}>Delete</button>
                                                </div>
                                            </td>
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
                </div>
            </div>
        </div>
    )
}

export default InsuranceCompany
