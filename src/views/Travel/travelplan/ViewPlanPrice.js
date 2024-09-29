import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';

const ViewPlanPrice = () => {
    const navigate = useNavigate();
    const [planprice, setPlanPrice] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [travel_plan_id, setTravelPlanId] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            const url = window.location.href;
            const url1 = url.split("/")[3];
            const url2 = url1.split("?")[1];
            const id = url2.split("=")[1];
            setTravelPlanId(id);
            getPlanPrice(page, perPage, id);
        }
    }, []);

    const getPlanPrice = (page, perPage, id) => {
        setPlanPrice([]);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page: page,
                perPage: perPage,
                travel_plan_id: id
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/travelplanprice`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;

                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                console.log("price total>>>>>>>>>>>>>>", total)
                setPlanPrice(data.data);
            }
            );
    }
    const updatestatus = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/UpdateTravelPlanPriceStatus?id=${id}&status=${status}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal("Success!", data.message, {
                        icon: "success",
                    });
                    getPlanPrice(page, perPage, travel_plan_id);
                }
                else {
                    swal("Error !", data.message, {
                        icon: "error",
                    });
                }
            }
            );
    }

    const deletePlanPrice = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteplanprice?id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal("Poof! Your plan price has been deleted!", {
                        icon: "success",
                        button: false,
                    })
                    getPlanPrice(page, perPage, travel_plan_id);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);

                }
                else {
                    swal("Oops! Something went wrong.", {
                        icon: "error",
                        button: false,
                    })
                    getPlanPrice(page, perPage, travel_plan_id);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);

                }
            }
            );
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getPlanPrice(selectedPage + 1, perPage, travel_plan_id);
    };
    const startFrom = (page - 1) * perPage;
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-4">
                                    <h4 className="card-title">Plan Price</h4>
                                </div>
                                <div className="col-md-8">
                                    <a href={`/AddPlanPrice?id=${travel_plan_id}`} className="btn btn-primary" style={{ float: 'right' }}>Add Plan Price</a>
                                    <a href="/travel-plan" className="btn btn-primary" style={{ float: 'right', marginRight: '4px' }}>Back</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr className="table-info">
                                        <th>Sr No.</th>
                                        <th>Price Name</th>
                                        <th>Plan Type</th>
                                        <th>Region</th>
                                        <th>Cover Type</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        planprice.length > 0 ? planprice.map((item, index) => (
                                            <tr key={index}>
                                                <td>{startFrom + index + 1}</td>
                                                <td>{item['price_name']}</td>
                                                <td>{item.plan_type[0]['travel_plan_type']}</td>
                                                <td>
                                                    {item.regions.map((result) => result.travel_region).join(', ')}
                                                </td>
                                                <td>{item.cover_type[0]?.travel_cover_type}</td>
                                                <td>
                                                    <a href={`/EditPlanPrice?id=${item._id}`} className="btn btn-primary mx-1">Edit</a>
                                                    {
                                                        item.status === true ?
                                                            <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, false) }}>Deactivate</button> :
                                                            <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, true) }}>Activate</button>
                                                    }
                                                    <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deletePlanPrice(item._id) }}>Delete</button>

                                                </td>
                                            </tr>
                                        )) : <tr><td colSpan="5" className="text-center">No Data Found</td></tr>
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
    )
}

export default ViewPlanPrice
