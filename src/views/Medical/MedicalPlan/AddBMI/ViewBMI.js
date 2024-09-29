import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';

const ViewBMI = () => {
    const navigate = useNavigate();
    const [medicalBMI, setMedicalBMI] = useState([]);
    const [perPage] = useState(5);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [medical_plan_id, setMedicalPlanId] = useState('');

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
            setMedicalPlanId(id);
            getMedicalBMI(page, perPage, id);
        }
    }, []);

    const getMedicalBMI = (page, perPage, id) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page: page,
                perPage: perPage,
                medical_plan_id: id
            })
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_medicalplan_bmi`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                setMedicalBMI(data.data);
            }
            );
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
    };

    const deleteItem = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteMedicalMaster/?id=${id}&type=medicalbmi`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getMedicalBMI(page, perPage, medical_plan_id);
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
                    getMedicalBMI(page, perPage, medical_plan_id);
                    setTimeout(() => {
                        swal.close()
                    }, 1000);
                }

            })
    }
    const ActivateDeactivate = (id, status) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/update_medicalplan_bmi_status?id=${id}&status=${status}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    swal({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        button: false,
                    })
                    getMedicalBMI(page, perPage, medical_plan_id);
                }
                else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error",
                        button: false,
                    })
                }
                getMedicalBMI(page, perPage, medical_plan_id);
                setTimeout(() => {
                    swal.close()
                }, 1000);
            });
    }
    const startFrom = (page - 1) * perPage;
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-4">
                                    <h4 className="card-title">Add BMI</h4>
                                </div>
                                <div className="col-md-8">
                                    <a href={`/addBMI?id=${medical_plan_id}`} className="btn btn-primary" style={{ float: 'right' }}>Add BMI</a>
                                    <a href="/medicalplan" className="btn btn-primary" style={{ float: 'right', marginRight: '4px' }}>Back</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr className="table-info">
                                        <th>Sr No.</th>
                                        <th>Weight Type</th>
                                        <th>Age Range</th>
                                        <th>BMI Range</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        medicalBMI.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{startFrom + index + 1}</td>
                                                    <td>{item.weight_type[0]['medical_weight_type']}</td>
                                                    <td>{(item.BMIArray?.map((obj) => (obj?.minAge + "-" + obj?.maxAge))?.join(","))}</td>
                                                    <td>{(item.BMIArray?.map((obj) => (obj?.minBmi + "-" + obj?.maxBmi))?.join(","))}</td>
                                                    {/* <td>{item.gender}</td>
                                                    <td>{item.value}</td> */}
                                                    <td>
                                                        <a href={`/editBMI?id=${item._id}&plan_id=${medical_plan_id}`} className="btn btn-primary mx-1">Edit</a>
                                                        {
                                                            item.status === 1 ?
                                                                <button className="btn btn-danger mx-1"
                                                                    onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) ActivateDeactivate(item._id, 0) }}
                                                                >Deactivate</button> :
                                                                <button className="btn btn-success mx-1"
                                                                    onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) ActivateDeactivate(item._id, 1) }}
                                                                >Activate</button>
                                                        }
                                                        <button className="btn btn-danger mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }} >Delete</button>
                                                    </td>
                                                </tr>
                                            )
                                        })
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

export default ViewBMI
