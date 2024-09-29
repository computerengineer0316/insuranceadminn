import React from 'react'
import { Tabs, Tab } from 'react-bootstrap';
import MotorToolTips from './MotorToolTips';
import YachtTooltips from './YachtTooltips';
import TravelToolTips from './TravelToolTips';
import HomeToolTips from './HomeToolTips';
import MedicalToolTips from './MedicalToolTips';
import OtherIsurancesToolTips from './OtherIsurancesToolTips';

const ViewToolTips = () => {

  return (
      <div className="container mb-5">
          <div className="row">
              <div className="col-md-12">
                  <div className="card">
                      <div className="card-header">
                          <div className="row">
                              <div className="col-md-6">
                                  <h4 className="card-title">Tool Tips</h4>
                              </div>
                          </div>
                      </div>
                      <div className="card-body addmotorplans " style={{ overflowX: 'scroll' }}>
                          <Tabs variant='tabs' defaultActiveKey={'Motor'} id="uncontrolled-tab-example" className="bg-light mb-3">
                              <Tab eventKey={'Motor'} title={<h5>Motor</h5>}>
                                  <MotorToolTips />
                              </Tab>
                              <Tab eventKey={'Yacht'} title={<h5>Yacht</h5>}>
                                  <YachtTooltips/>
                              </Tab>
                              <Tab eventKey={'Travel'} title={<h5>Travel</h5>}>
                                  <TravelToolTips />
                              </Tab>
                              <Tab eventKey={'Home'} title={<h5>Home</h5>}>
                                  <HomeToolTips />
                              </Tab>
                              <Tab eventKey={'Medical'} title={<h5>Medical</h5>}>
                                  <MedicalToolTips />
                              </Tab>
                              <Tab eventKey={'OtherInsurances'} title={<h5>Other Insurances</h5>}>
                                  <OtherIsurancesToolTips />
                              </Tab>
                          </Tabs>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default ViewToolTips
