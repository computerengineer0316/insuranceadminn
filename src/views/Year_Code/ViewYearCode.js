import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
import { CProgress } from '@coreui/react';


const ViewYearCode = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [motorpermission, setMotorPermission] = useState([]);
    const [nodata, setNodata] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getlistYearCode(page, perPage);
            const userdata = JSON.parse(localStorage.getItem('user'));
            const motor_permission = userdata?.motor_permission?.[0] || {};
            setMotorPermission(motor_permission);
        }
    }, [])





    const UpdateYearCode = () => {
        setLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/addKatarMotorYearData`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setLoading(false)
                if (data.status === 200) {

                    swal({

                        text: data.message,
                        type: "success",
                        icon: "success",
                        button: false

                    })
                    getlistYearCode(page, perPage);
                    setTimeout(() => {
                        swal.close();
                    }, 1000);
                }
                else {

                    swal({
                        title: "Error!",
                        text: data.message,
                        type: "error",
                        icon: "error",
                        button: false

                    })
                    getlistYearCode(page, perPage);
                    setTimeout(() => {
                        swal.close();
                    }, 1000);
                }
            });
    }

    const getlistYearCode = (page, perPage) => {
        setData([]);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/getYearData?page=${page}&limit=${perPage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setNodata(data.message)
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                const list = data.data;
                console.log(list, ">>>>>>>>>this is list")
                setData(list);

            });
    }





    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getlistYearCode(selectedPage + 1, perPage);
    };


    const startFrom = (page - 1) * perPage;

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="card-title">Year Code</h4>
                                    </div>
                                    <div className="col-md-6">
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className='row card-header' style={{ marginLeft: '10px', marginRight: '10px', alignItems: 'center', paddingTop: '5px', paddingBottom: '5px' }}>


                                    <div className="col-lg-6" style={{ textAlign: 'right' }}>
                                        {motorpermission.body_type?.includes('upload') ?
                                            <button className="btn btn-primary btn-sm btn-icon-text m-r-10" onClick={() => UpdateYearCode()}>Upload Year Code</button>
                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">

                                {loading && (
                                    <div className="overlay">
                                        <div className="loader-container">
                                            <CProgress color="primary" variant="striped" animated value={100} />
                                            <div>Uploading, please wait...</div>
                                            <div className="loader-text">Do Not Refresh The Page</div>
                                            {/* <ClipLoader color="green" loading={loading} size={100} /> */}
                                        </div>
                                    </div>
                                )}
                                <table className="table table-bordered">
                                    <thead className="thead-dark">
                                        <tr className="table-info">
                                            <th>#</th>
                                            <th>Year Code</th>
                                            <th>QIC Code</th>
                                            {/* <th>JDV Code</th> */}
                                            <th>Location</th>
                                            {/* <th>Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data && data.length > 0 ?
                                            <>

                                                {data?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{startFrom + index + 1}</td>
                                                        <td>{item.yearDesc}</td>
                                                        <td>{item.qic_Code}</td>
                                                        {/* <td>{item.body_type_name}</td> */}
                                                        <td>{item.locations?.map((data) => data.location_name).join(", ")}</td>
                                                    </tr>
                                                ))}

                                            </>
                                            :
                                            <tr><td colSpan="17" style={{ textAlign: 'center' }}><strong>{nodata}</strong></td></tr>
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
        </>
    )
}

export default ViewYearCode
