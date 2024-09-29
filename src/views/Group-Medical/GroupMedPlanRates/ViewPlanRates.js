import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from 'sweetalert';
// import filePath from '../../../../webroot/sample-files/Medica-rates-based-on-age.xlsx'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';

const ViewPlanRates = () => {
    const navigate = useNavigate();
    const [medicalRates, setMedicalRates] = useState([]);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [medical_plan_id, setMedicalPlanId] = useState('');
    const [visible, setVisible] = useState(false);
    const [excelfile, setExcelfile] = useState("");
    const [medicalPermission, setMedicalPermission] = useState([])


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
            getGroupMedicalPlanRates(page, perPage, id);
            const userdata = JSON.parse(localStorage.getItem('user'));
            const permission = userdata?.medical_permission?.[0] || {};
            setMedicalPermission(permission)
        }
    }, []);

    const getGroupMedicalPlanRates = (page, perPage, id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://insuranceapi-3o5t.onrender.com/api/get_group_medical_rates?page=${page}&limit=${perPage}&id=${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {

                const total = data.data[0]?.total;
                console.log(data, ">>>>>>>>>>>>>>>>data")
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                setMedicalRates(data.data[0].data);
                console.log(data.data, ">>>>>>>>>>data.data");
            }
            );
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getGroupMedicalPlanRates(selectedPage + 1, perPage, medical_plan_id)
    };
    const collectExceldata = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('file', excelfile)
        let result = await fetch("https://insuranceapi-3o5t.onrender.com/api/read_medical_plan_type_excel ",
            {
                method: "post",
                body: fd,
            })
        result = await result.json()

        if (result.status === 200) {
            setVisible(!visible)
            swal({
                text: result.message,
                type: "success",
                icon: "success",
                button: false,
            })
            getGroupMedicalPlanRates(page, perPage, medical_plan_id)
            setTimeout(() => {
                swal.close()
            }, 1000);
        }
        else {
            setVisible(!visible)
            swal({
                title: "Error!",
                text: result.message,
                type: "error",
                icon: "error",
                button: "ok",
            })
            getGroupMedicalPlanRates(page, perPage, medical_plan_id)
            setTimeout(() => {
                swal.close()
            }, 1000);
        }

    }
    const setStaus = (id, status) => {
        try {
            console.log("staus,,,,,,,,,,,,,,,,,,,,", { status, id })
            const requestOptions = {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: +status,
                })
            }
            fetch(`https://insuranceapi-3o5t.onrender.com/api/update_group_medical_planRates_status/${id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        swal({
                            title: "Success!",
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false
                        })
                        getGroupMedicalPlanRates(page, perPage, medical_plan_id)
                        setTimeout(() => {
                            swal.close()
                        }, 2000);
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error",
                            button: false
                        })
                        getGroupMedicalPlanRates(page, perPage, medical_plan_id)
                        setTimeout(() => {
                            swal.close()
                        }, 2000);
                    }
                });
        } catch (error) {

        }
    };
    const deleteItem = (id) => {
        try {
            const requestOptions = {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },

            }
            fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteGroupMedicalMaster?id=${id}&type=groupmedicalPlanRates`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.status == 200) {
                        swal({
                            title: "Success!",
                            text: data.message,
                            type: "success",
                            icon: "success",
                            button: false
                        })

                        getGroupMedicalPlanRates(page, perPage, medical_plan_id)
                        setTimeout(() => {
                            swal.close()
                        }, 2000);
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: data.message,
                            type: "error",
                            icon: "error",
                            button: false
                        })
                        getGroupMedicalPlanRates(page, perPage, medical_plan_id)
                        setTimeout(() => {
                            swal.close()
                        }, 2000);
                    }
                });
        } catch (error) {
            console.log(error);
        }
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
                                    <h4 className="card-title">TPA/Network</h4>
                                </div>
                                <div className="col-md-8">
                                    <a href={`/AddGroupMedicalPlanRates?id=${medical_plan_id}`} className="btn btn-primary" style={{ float: 'right' }}>Add TPA/Network</a>
                                    <a href="/ViewGroupMedicalPlans" className="btn btn-primary" style={{ float: 'right', marginRight: '4px' }}>Back</a>
                                </div>
                            </div>
                        </div>
                        {/* <div className="card-header" style={{ textAlign: 'right' }}>

                            <a className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }} href={filePath} download><i className="fa fa-cloud-download" aria-hidden="true"></i> Download Sample File</a>


                            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green", marginRight: '15px' }}
                                onClick={() => setVisible(!visible)}
                            ><i className="fa fa-file-excel" aria-hidden="true"></i> Upload Excel</button>

                            <button className="btn btn-dark btn-sm btn-icon-text m-r-10" style={{ backgroundColor: "green" }} onClick={"exporttocsv"}><i className="fa fa-file-excel" aria-hidden="true"></i> Export Data to excel</button>

                        </div> */}
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr className="table-info">
                                        <th>Sr No.</th>
                                        <th>name</th>
                                        <th>TPA</th>
                                        <th>Network</th>
                                        <th>Location</th>

                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        medicalRates.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{startFrom + index + 1}</td>
                                                    <td>{item.policy_name}</td>
                                                    <td>{item.TPAs[0]?.name}</td>
                                                    <td>{item.networks[0]?.name}</td>

                                                    <td>
                                                        {item.locationData
                                                            ?.map((obj) =>
                                                                obj.location_name ? obj.location_name : '',
                                                            )
                                                            .join(',')}
                                                    </td>

                                                    <td>
                                                        <a
                                                            href={`/EditGroupMedicalPlanPrice?id=${item._id}&planId=${medical_plan_id}`}
                                                            className="btn btn-success mx-1"
                                                        >
                                                            Edit
                                                        </a>
                                                        {medicalPermission.plan_condition?.includes(
                                                            'delete',
                                                        ) && (
                                                                <>
                                                                    {item.status == 1 ? (
                                                                        <button
                                                                            className="btn btn-danger mx-1"
                                                                            onClick={() => {
                                                                                if (
                                                                                    window.confirm(
                                                                                        'Are you sure you wish to deactivate this item?',
                                                                                    )
                                                                                )
                                                                                    setStaus(item._id, 0)
                                                                            }}
                                                                        >
                                                                            Deactivate
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="btn btn-success mx-1"
                                                                            onClick={() => {
                                                                                if (
                                                                                    window.confirm(
                                                                                        'Are you sure you wish to activate this item?',
                                                                                    )
                                                                                )
                                                                                    setStaus(item._id, 1)
                                                                            }}
                                                                        >
                                                                            Activate
                                                                        </button>
                                                                    )}
                                                                    <button className="btn btn-warning mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteItem(item._id) }}>Delete</button>
                                                                </>
                                                            )}
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
            <CModal alignment='center' visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Upload Excel File</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div >
                        {/* <label className="form-label"><strong>Upload Excel File</strong></label> */}
                        <input type="file" className="form-control" id="DHA" defaultValue="" required
                            onChange={(e) => setExcelfile(e.target.files[0])} />
                    </div>

                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Close
                    </CButton>
                    <CButton color="primary" onClick={collectExceldata} href={'/Viewtraveltype'}>Upload</CButton>
                </CModalFooter>
            </CModal>
        </div>

    )
}


export default ViewPlanRates
