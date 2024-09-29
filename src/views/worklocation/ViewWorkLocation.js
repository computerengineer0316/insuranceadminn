import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import ReactPaginate from "react-paginate";
import swal from 'sweetalert'
import Multiselect from "multiselect-react-dropdown";

const ViewWorkLocation = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [id, setId] = useState('');
  const [visibleedit, setVisibleedit] = useState(false);
  const [worklocation, setWorklocation] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      getWorkLocation(page, perPage);
      locationList()
    }
  }, [])


  const locationList = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const locationdt = data.data;
        const location_len = locationdt.length;
        const location_list = [];
        for (let i = 0; i < location_len; i++) {
          const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
          location_list.push(location_obj);
        }
        setLocation(location_list);
        // handleChange(location_list);
      });
  }

  console.log(location)


  const getWorkLocation = async (page, perPage) => {
    try {
      const response = await fetch(`https://insuranceapi-3o5t.onrender.com/api/getWorkLocation?page=${page}&limit=${perPage}`)
        .then(response => response.json())
        .then(data => {
          const total = data.total;
          const slice = total / perPage;
          const pages = Math.ceil(slice);
          setPageCount(pages);
          const list = data.data;
          setData(list)

        }
        )
    }
    catch (error) {
      console.log(error);
    }
  };

  console.log(data)


  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
    getWorkLocation(selectedPage + 1, perPage);
  };

  const startFrom = (page - 1) * perPage;

  const handleeditmodal = async (id) => {
    console.log(id)
    console.log("i was clicked")
    setId(id);
    let result = await fetch(`https://insuranceapi-3o5t.onrender.com/api/getWorkLocationId?id=${id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    result = await result.json();
    setWorklocation(result.data[0].worklocation)
    const location = result.data[0].location;
    const locationid = location.map((data) => ({ label: data.location_name, value: data._id }));
    setSelectedOption(locationid);
    handleChange(locationid);
    setVisibleedit(true);
  }


  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };



  const updateWorkLocation = async (e) => {
    e.preventDefault();
    try {
      const worklocation = e.target.worklocation.value;
      const location = selectedOption.map((data) => data.value);
      if (worklocation === '') {
        swal({
          text: "Please enter sponsor type",
          icon: "warning",
        });
        return;
      }
      if (selectedOption.length === 0) {
        swal({
          text: "Please select location",
          icon: "warning",
        });
        return;
      }

      const response = await fetch(`https://insuranceapi-3o5t.onrender.com/api/updateWorkLocation?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ worklocation, location })
      })
      const data = await response.json()
      if (data.status == 200) {
        swal({
          text: data.message,
          icon: "success",
          button: false
        });
        setTimeout(() => {
          swal.close();
        }, 1000);
        setVisibleedit(false);
        getWorkLocation(page, perPage);
      }
    } catch (error) {
      console.log(error)
    }
  }


  const updatestatus = async (id, status) => {
    try {
      const response = await fetch(`https://insuranceapi-3o5t.onrender.com/api/updateWorkLocationstatus?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      const data = await response.json()
      if (data.status == 200) {
        swal({
          text: data.message,
          icon: "success",
          button: false
        });
        setTimeout(() => {
          swal.close();
        }, 1000);
        getWorkLocation(page, perPage);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteSponsortype = async (id) => {
    try {
      const response = await fetch(`https://insuranceapi-3o5t.onrender.com/api/deleteWorkLocation?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const data = await response.json()
      if (data.status == 200) {
        swal({
          text: data.message,
          icon: "success",
          button: false
        });
        setTimeout(() => {
          swal.close();
        }, 1000);
        getWorkLocation(page, perPage);
      }
    } catch (error) {
      console.log(error)
    }
  }




  return (
    <>
      <Container>
        <div className="card mb-4">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h4 className="card-title">Work Location</h4>
              </div>
              <div className="col-md-6">

                <button className='btn btn-primary' style={{ float: "right" }} onClick={() => navigate('/AddWorklocation')}>Add Work Location</button>

              </div>
            </div>
          </div>
          <div className="card-body">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr className="table-info">
                  <th scope="col">#</th>
                  <th scope="col">Work Location</th>
                  <th scope="col">Location</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 ? (
                  data?.map((item, index) => (
                    <tr key={index}>
                      <td>{startFrom + index + 1}</td>
                      <td>{item.worklocation}</td>
                      <td>{item.location?.map((data) => data.location_name).join(", ")}</td>
                      <td>
                        <button className='btn btn-primary' onClick={() => handleeditmodal(item._id)}>Edit</button>
                        {' '}
                        {
                          item.status == 1 ?
                            <button className="btn btn-danger" onClick={() => { if (window.confirm('Are you sure you wish to deactivate this item?')) updatestatus(item._id, 0) }}>Deactivate</button> :
                            <button className="btn btn-success" onClick={() => { if (window.confirm('Are you sure you wish to activate this item?')) updatestatus(item._id, 1) }}>Activate</button>

                        }
                        {' '}
                        <button className='btn btn-warning' onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteSponsortype(item._id) }}>Delete</button>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No Data Found</td>
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
      </Container>
      <Modal size='lg' show={visibleedit} onHide={() => setVisibleedit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Work Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <form action="/" method="POST" onSubmit={updateWorkLocation}>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label"><strong>Edit Work Location</strong></label>
                          <input type='text' className="form-control"
                            name='worklocation'
                            placeholder='Sponsor Type'
                            defaultValue={worklocation}
                            autoComplete="off"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label"><strong>Location</strong></label>
                          <Multiselect
                            options={location}
                            selectedValues={selectedOption}
                            onSelect={handleChange}
                            onRemove={handleChange}
                            displayValue="label"
                            placeholder="Select Location"
                            closeOnSelect={false}
                            avoidHighlightFirstOption={true}
                            showCheckbox={true}
                            style={{ chips: { background: "#007bff" } }}
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                        </div>
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary mt-2 submit_all" style={{ float: "right" }}>Submit</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setVisibleedit(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}


export default ViewWorkLocation
