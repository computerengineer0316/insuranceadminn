import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { CWidgetStatsC } from '@coreui/react'
import { Row, Col } from 'react-bootstrap'
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
} from '@coreui/react'
import {
  CChart,
  CChartBar,
  CChartPie,
} from '@coreui/react-chartjs'
import Multiselect from 'multiselect-react-dropdown';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Operationtoplegend from './Operationtoplegend';
import Operationgraph from './Operationgraph';
import Select from 'react-select';
import swal from 'sweetalert';

function OperationsDashboard() {

  const state = {
    lazyLoad: true,
    responsive: {
      0: {
        items: 1,
      },
      450: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 4,
      },
    },
  }

  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const navigate = useNavigate();
  const [location, setLocation] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [lob, setLob] = useState([]);
  const [selectedlob, setSelectedLOB] = useState();
  const [businessType, setBusinessType] = useState([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState();
  const [agenttype, setAgenttype] = useState([])
  const [agent, setAgent] = useState([]);
  const [supervisor, setSupervisor] = useState([]);
  const [selectedSupervisor, setselectedSupervisor] = useState([]);
  const [adminagentlist, setAdminagentlist] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState();
  const [dateRange, setDateRange] = useState('daily');
  const [showModal, setShowModal] = useState(false);
  const [fromdateValue, onFromDateChange] = useState(new Date());
  const [todateValue, onToDateChange] = useState(new Date());


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined || token === '') {
      navigate('/login')
    }
    else {
      const userdata = JSON.parse(localStorage.getItem('user'));
      const business_type = userdata.admin_business_type;
      if (business_type?.length > 0) {
        const businessdt = business_type;
        const business_len = businessdt?.length;
        const business_list = [];
        for (let i = 0; i < business_len; i++) {
          let btype;
          btype = businessdt[i].type;
          btype = btype.split(' ');
          const business_obj = { label: businessdt[i].type, value: btype[0] };
          business_list.push(business_obj);
        }
        setBusinessType(business_list);
      }
      else {
        const Business_type = [
          { label: "New Business", value: "New" },
          { label: "Renewal Business", value: "Renewal" }
        ];
        setBusinessType(Business_type);
      }
      locationList();
      lobList();
      usertypelist();
      supervisorlist();
      // adminagent();

    }
  }, []);

  useEffect(() => {
    agentList();

  }, [agenttype])

  const locationList = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const loc = userdata.location;
    if (loc?.length > 0) {
      const locationdt = loc;
      const location_len = locationdt?.length;
      const location_list = [];
      for (let i = 0; i < location_len; i++) {
        const location_obj = { label: locationdt[i].loc_name, value: locationdt[i].loc_id };
        location_list.push(location_obj);
      }
      setLocation(location_list);
    }
    else {
      const requestOptions =
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      fetch(`https://insuranceapi-3o5t.onrender.com/api/get_location`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const locationdt = data.data;
          const location_len = locationdt?.length;
          const location_list = [];
          for (let i = 0; i < location_len; i++) {
            const location_obj = { label: locationdt[i].location_name, value: locationdt[i]._id };
            location_list.push(location_obj);
          }
          setLocation(location_list);
        });
    }
  }

  const lobList = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const lob = userdata.line_of_business;
    if (lob?.length > 0) {
      const lobdt = lob;
      const lob_len = lobdt?.length;
      const lob_list = [];
      for (let i = 0; i < lob_len; i++) {
        const lob_obj = { label: lobdt[i].lob_name, value: lobdt[i].lob_id };
        lob_list.push(lob_obj);
      }
      setLob(lob_list);
    }
    else {
      const requestOptions =
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      fetch(`https://insuranceapi-3o5t.onrender.com/api/get_line_of_business_list`, requestOptions)
        .then(response => response.json())
        .then(data => {
          const lobdt = data.data;
          const lob_len = lobdt?.length;
          const lob_list = [];
          for (let i = 0; i < lob_len; i++) {
            const lob_obj = { label: lobdt[i].line_of_business_name, value: lobdt[i]._id };
            lob_list.push(lob_obj);
          }
          setLob(lob_list);
        });
    }
  }

  useEffect(() => {
    usertypelist();
  }, [selectedSupervisor])

  const usertypelist = async (agenttype) => {
    setAgenttype(agenttype);

  }

  console.log(agenttype);


  const loginuser = JSON.parse(localStorage.getItem('user'));
  const loginusertype = loginuser.usertype;

  const agentList = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    const id = selectedSupervisor ? selectedSupervisor : userdata._id;

    fetch(`https://insuranceapi-3o5t.onrender.com/api/getStaffDetailsbyid/${id}`)
      .then(response => response.json())
      .then(data => {
        if (agenttype == 'salesAdvisor') {
          // console.log("staff>>>>>>>>>>",data.data[0].assignSalesAdvisor)


          const agentdt = data?.data[0]?.assignSalesAdvisor;
          if (agentdt != undefined && agentdt?.length > 0) {
            const agent_len = agentdt?.length;
            const agent_list = [];
            for (let i = 0; i < agent_len; i++) {
              const agent_obj = { label: agentdt[i].name, value: agentdt[i]._id };
              agent_list.push(agent_obj);
            }
            setAgent(agent_list);

          } else {
            setAgent([]);
            return 'No Options Available';
          }
        }
        else if (agenttype == 'documentChaser') {
          // console.log("staff>>>>>>>>>>",data.data[0].assignDocumentChaser)


          const agentdt = data?.data[0]?.assignDacumentChaser;
          if (agentdt != undefined && agentdt?.length > 0) {
            const agent_len = agentdt?.length;
            const agent_list = [];
            for (let i = 0; i < agent_len; i++) {
              const agent_obj = { label: agentdt[i].name, value: agentdt[i]?._id };
              agent_list.push(agent_obj);
            }
            setAgent(agent_list);
          } else {
            setAgent([]);
            return 'No Options Available';
          }
        }
        else if (agenttype == 'policyIssuer') {
          // console.log("staff>>>>>>>>>>",data.data[0].assignPolicyIssuer)


          const agentdt = data?.data[0].assignPolicyIssuer;
          if (agentdt != undefined && agentdt?.length > 0) {
            const agent_len = agentdt?.length;
            const agent_list = [];
            for (let i = 0; i < agent_len; i++) {
              const agent_obj = { label: agentdt[i].name, value: agentdt[i]._id };
              agent_list.push(agent_obj);
            }
            setAgent(agent_list);
          }
          else {
            setAgent([]);
            return 'No Options Available';
          }
        }
        else {
          setAgent([]);
          return 'No Options Available';
        }
      });



  }

  const supervisorlist = () => {
    const requestOptions =
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
    };

    fetch(`https://insuranceapi-3o5t.onrender.com/api/getUserAccordingUserType?userType=supervisor`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log("adminagent>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data.data);
        setSupervisor(data.data);
      });
  }


  const handleDateRangeChange = (dateRange) => {
    setDateRange(dateRange);
  };

  const handlecustomized = () => {
    setShowModal(true);
    setDateRange('customized');
  }

  const defaultFilterOptions =
  {
    defaultlocation: location,
    defaultlob: lob,
    defaultbusinessType: businessType,
    defaultagent: agent,
    defaultdateRange: dateRange,
    startdate: fromdateValue,
    enddate: todateValue,
    userType: agenttype,
    selectedSupervisor: selectedSupervisor

  };

  const handleFilterChange = (filterName, selectedValue) => {
    switch (filterName) {
      case 'location':
        setSelectedOption(selectedValue);
        break;
      case 'lob':
        setSelectedLOB(selectedValue);
        break;
      case 'businessType':
        setSelectedBusinessType(selectedValue);
        break;
      case 'agent':
        setSelectedAgent(selectedValue);
        break;
      default:
        break;
    }
  };

  const combinedFilterOptions =
  {
    location: selectedOption,
    lob: selectedlob,
    businessType: selectedBusinessType,
    agent: selectedAgent,
    dateRange: dateRange,
  }

  // useEffect(() => {
  //   // Reset agent type when selectedSupervisor changes
  //   setAgenttype("");
  // }, [selectedSupervisor]);

  const handlesupervisor = (value) => {
    const supervisorArray = value == "" ? [] : Array.isArray(value) ? value : [value];
    console.log("supervisorArray>>>>>>>>>>>>>>>>>>>>", supervisorArray);
    setselectedSupervisor(supervisorArray);
    setAgenttype("");
  }

  console.log("selectedSupervisor>>>>>>>>>>>>>>>>>>>>", selectedSupervisor);
  console.log("agenttype>>>>>>>>>>>>>>>>>>>>", agenttype);
  console.log("selectedAgent>>>>>>>>>>>>>>>>>>>>", selectedAgent);

  return (
    <>
      <section className='mb-2'>
        <Row>
          <Col className='' sm={5}>
            <h4 id="dashboard" className="card-title mb-0">Dashboard</h4>
          </Col>
          <Col sm={7} className="d-none d-md-block">
            <div className='float-end me-3'>
              <button onClick={() => handleDateRangeChange('daily')}
                className={`${dateRange === 'daily' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Daily</button>
              <button onClick={() => handleDateRangeChange('weekly')}
                className={`${dateRange === 'weekly' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Weekly</button>
              <button onClick={() => handleDateRangeChange('monthly')}
                className={`${dateRange === 'monthly' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Monthly</button>
              <button onClick={() => handleDateRangeChange('yearly')}
                className={`${dateRange === 'yearly' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Yearly</button>
              <button onClick={handlecustomized}
                className={`${dateRange === 'customized' ? 'btn btn-selected' : 'btn btn-light'}`}
              >Customized</button>

            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              <Multiselect
                options={defaultFilterOptions.defaultlocation}
                displayValue="label"
                onSelect={(selectedValue) => handleFilterChange('location', selectedValue)}
                onRemove={(selectedValue) => handleFilterChange('location', selectedValue)}
                placeholder="Select location"
                selectedValues={selectedOption}
                showArrow={true}
              />
            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              <Multiselect
                options={defaultFilterOptions.defaultbusinessType}
                displayValue="label"
                onSelect={(selectedValue) => handleFilterChange('businessType', selectedValue)}
                onRemove={(selectedValue) => handleFilterChange('businessType', selectedValue)}
                placeholder="Select business type"
                selectedValues={selectedBusinessType}
                showArrow={true}
              />
            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              <Multiselect
                options={defaultFilterOptions.defaultlob}
                displayValue="label"
                onSelect={(selectedValue) => handleFilterChange('lob', selectedValue)}
                onRemove={(selectedValue) => handleFilterChange('lob', selectedValue)}
                placeholder="Select line of business"
                selectedValues={selectedlob}
                showArrow={true}
              />
            </div>
          </Col>
          <Col className='mb-3' sm={3}>
            <div>

              <select className='form-control transparentclass' onChange={(e) => handlesupervisor(e.target.value)} >
                <option hidden>Select Supervisor</option>
                <option value="">All</option>
                {supervisor?.map((item, index) => (
                  <option key={index} value={item._id}>{item.name}</option>
                ))}
              </select>

            </div>
          </Col>

          <Col className='mb-3' sm={3}>
            <div>
              <select
                className='form-control transparentclass'
                onChange={(e) => usertypelist(e.target.value)}
                value={agenttype}
                placeholder="Select User Type"
              >
                <option hidden>Select User Type</option>
                <option value={[]}>All</option>
                <option value="salesAdvisor">Sales Advisor</option>
                <option value="documentChaser">Document Chaser</option>
                <option value="policyIssuer">Policy Issuer</option>
              </select>
            </div>
          </Col>


          <Col className='mb-3' sm={3}>
            <div>
              {defaultFilterOptions.defaultagent?.length < 2
                ?
                <Multiselect
                  options={defaultFilterOptions.defaultagent}
                  displayValue="label"
                  selectedValues={defaultFilterOptions.defaultagent}
                  showArrow={false}
                />

                :
                <Multiselect
                  options={defaultFilterOptions.defaultagent}
                  displayValue="label"
                  onSelect={(selectedValue) => handleFilterChange('agent', selectedValue)}
                  onRemove={(selectedValue) => handleFilterChange('agent', selectedValue)}
                  placeholder="Select Agents"
                  selectedValues={selectedAgent}
                  showArrow={true}
                />
              }
            </div>
          </Col>


        </Row>
      </section>

      <section className='mb-3'>
        <Operationtoplegend
          defaultOptions={defaultFilterOptions}
          filterOptions={combinedFilterOptions}
        />
      </section>
      <section className='tables'>
        <Operationgraph
          defaultOptions={defaultFilterOptions}
          filterOptions={combinedFilterOptions}
        />
      </section>
    </>
  )
}
export default OperationsDashboard;
