import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';

const ViewBusinessEntity = () => {
    const navigate = useNavigate();
    const [businessentity, setBusinessentity] = useState([]);
    const [perPage] = useState(5);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [masterpermission, setMasterpermission] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getBusinessEntity(page, perPage);
            const userdata = JSON.parse(localStorage.getItem('user'));
            const master_permission = userdata?.master_permission?.[0] || {};
            setMasterpermission(master_permission);
        }
    }, []);

    const getBusinessEntity = (page, perPage) => {
        setBusinessentity([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/businessEntity?page=' + page + '&limit=' + perPage, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                const list_dt = list.length;
                const list_obj = [];
                for (let i = 0; i < list_dt; i++) {
                    const lob = list[i]['lob'];
                    const lob_dt = lob.length;
                    const lob_obj = [];
                    for (let i = 0; i < lob_dt; i++) {
                        const lob_obj1 = lob[i]['label'];
                        lob_obj.push(lob_obj1);
                    }
                    var lobValues = lob_obj.join(', ');

                    const list_obj1 = {
                        id: list[i]['_id'],
                        business_entity_name: list[i]['location_name'],
                        lob: lobValues,
                        business_entity_status: list[i]['location_status'],
                    };
                    list_obj.push(list_obj1);
                }
                setBusinessentity(list_obj);
            });
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected + 1;
        setPage(selectedPage);
        getBusinessEntity(selectedPage, perPage);
    };

    const deactivatebusinessentity = (id, status) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('https://insuranceapi-3o5t.onrender.com/api/businessEntity?id=' + id + '&status=' + status, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 200) {
                    swal({
                        title: "Success",
                        text: data.message,
                        type: "success",
                        icon: "success"
                    }).then(function () {
                        getBusinessEntity(page, perPage);
                    });
                }
                else {
                    swal({
                        title: "Error",
                        text: data.message,
                        type: "error",
                        icon: "error"
                    }).then(function () {
                        getBusinessEntity(page, perPage);
                    });
                }
            });
    }

    const startFrom = (page - 1) * perPage;

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4 className="card-title">Location List</h4>
                                        </div>
                                        {masterpermission.location?.includes('create') ?
                                            <div className="col-md-6">
                                                <a href="/AddBusinessEntity" className="btn btn-primary" style={{ float: 'right' }}>Add Location</a>
                                            </div>
                                            : ""
                                        }
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Sr No.</th>
                                                        <th>Location Name</th>
                                                        <th>Line Of Business</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        businessentity.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{startFrom + index + 1}</td>
                                                                <td>{item.business_entity_name}</td>
                                                                <td>{item.lob}</td>
                                                                <td>
                                                                    {masterpermission.location?.includes('edit') ?
                                                                        <div className="btn-group" role="group" aria-label="Basic example">
                                                                            <a href={`/ViewBusinessEntityBank?id=${item.id}`} className="btn btn-success">Bank</a>
                                                                        </div>
                                                                        : ""
                                                                    }
                                                                    &nbsp;&nbsp;

                                                                    {masterpermission.location?.includes('edit') ?
                                                                        <div className="btn-group" role="group" aria-label="Basic example">
                                                                            <a href={`/EditBusinessEntity?id=${item.id}`} className="btn btn-primary">Edit</a>&nbsp;&nbsp;
                                                                        </div>
                                                                        : ""
                                                                    }
                                                                    {masterpermission.location?.includes('delete') ?
                                                                        item.business_entity_status
                                                                            === 1 ?
                                                                            <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) deactivatebusinessentity(item.id, 0) }}>Deactivate</button></div> :
                                                                            <div className="btn-group" role="group" aria-label="Basic example"><button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) deactivatebusinessentity(item.id, 1) }}>Activate</button></div>
                                                                        : ""
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ))
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewBusinessEntity
