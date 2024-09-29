import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom'

const AdvertiseWithUs = () => {
    const navigate = useNavigate();
    const [AdData, setAdData] = useState();
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined || token === '') {
            navigate('/login')
        }
        else {
            getAdvertiseData(page, perPage);
        }
    }, []);

    const getAdvertiseData = (Page, perpage) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        };

        fetch(`https://insuranceapi-3o5t.onrender.com/api/GetThirdPartyBuisness/${Page}/${perpage}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const total = data.total;
                const slice = total / perPage;
                const pages = Math.ceil(slice);
                setPageCount(pages);
                setAdData(data.data);
            });

    };

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1);
        getAdvertiseData(selectedPage + 1, perPage);
    };

    const startFrom = (page - 1) * perPage;

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="card-title">Advertise With Us</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr className="table-info">
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Brief Information</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {AdData?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{startFrom + index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.phone}</td>
                                                <td>{item.email}</td>
                                                <td>
                                                    {item.briefinfo}
                                                </td>
                                            </tr>
                                        )
                                    }
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

export default AdvertiseWithUs
