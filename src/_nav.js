import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilPuzzle,
  cilSpeedometer,
  cibUnrealEngine,
  cilAirplaneMode,
  cilHouse,
  cilBoatAlt,
  cilBed,
  cilGroup,
  cilBuilding,
  cilUserPlus,
  cilChatBubble,
  cilCarAlt
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { Badge } from 'react-bootstrap'

const userdata = JSON.parse(localStorage.getItem('user'))
const motor_permission = userdata?.motor_permission?.[0] || {}
const travel_permission = userdata?.travel_permission?.[0] || {}
const home_permission = userdata?.home_permission?.[0] || {}
const medical_permission = userdata?.medical_permission?.[0] || {}
const yacht_permission = userdata?.yacht_permission?.[0] || {}
const master_permission = userdata?.master_permission?.[0] || {}
const dashboard_permission = userdata?.dashboard_permission?.[0] || {}
const group_medical_permission = userdata?.group_medical_permission?.[0] || {}

const usertype = userdata?.usertype || ''




const request = localStorage?.getItem('request')

let type = ''
if (
  window.location.pathname === '/ViewStandardCover' ||
  window.location.pathname === '/ViewAdditionalCover'
) {
  const url = window.location.href
  const url1 = url.split('/')[3]
  const url2 = url1.split('?')[1]
  const url3 = url2.split('&')
  type = url3[1].split('=')[1]
}

const motorNavItems = [
  motor_permission.motor_claim_years?.includes('view') && {
    component: CNavItem,
    name: 'Year Code',
    to: '/ViewYearCode',
  },
  motor_permission.make_motor?.includes('view') && {
    component: CNavItem,
    name: 'Make Motor',
    to: '/motor-make',
  },
  motor_permission.model_motor?.includes('view') && {
    component: CNavItem,
    name: 'Model Motor',
    to: '/motor-model',
  },
  motor_permission.motor_model_details?.includes('view') && {
    component: CNavItem,
    name: 'Motor Model details',
    to: '/ViewMotormodeldetails',
  },
  motor_permission.body_type?.includes('view') && {
    component: CNavItem,
    name: 'Body Type',
    to: '/body-type',
  },
  motor_permission.area_of_registration?.includes('view') && {
    component: CNavItem,
    name: 'Area Of Registration',
    to: '/area-of-registration',
  },
  motor_permission.repair_type?.includes('view') && {
    component: CNavItem,
    name: 'Repair Type',
    to: '/ViewRepairtype',
  },
  motor_permission.business_type?.includes('view') && {
    component: CNavItem,
    name: 'Business Type',
    to: '/ViewBusinesstype',
  },
  motor_permission.motor_plan?.includes('view') && {
    component: CNavItem,
    name: 'Motor Plan',
    to: '/motor-plan',
    active:
      window.location.pathname === '/AddMotorPlan' ||
      window.location.pathname === '/AddThirdPartyPlan' ||
      window.location.pathname === '/EditMotorPlan' ||
      window.location.pathname === '/EditTPLMotorPlan' ||
      type === 'motor' ||
      window.location.pathname === '/Nonapplicablenationality' ||
      window.location.pathname === '/blacklistvehicle',
  },
  // motor_permission.motor_claim_years?.includes('view') && {
  //   component: CNavItem,
  //   name: 'Motor Claim Years',
  //   to: '/motorclaimyears',
  // },
].filter(Boolean)

const motorNavGroup =
  motorNavItems.length > 0
    ? {
      component: CNavGroup,
      name: 'Motor',
      icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
      items: motorNavItems,
    }
    : null

const travelNavItems = [
  travel_permission.travel_insurance_for?.includes('view') && {
    component: CNavItem,
    name: 'Travel Insurance For',
    to: '/Viewtravelinsurancefor',
  },
  travel_permission.travel_type?.includes('view') && {
    component: CNavItem,
    name: 'Travel Type',
    to: '/Viewtraveltype',
  },
  travel_permission.travel_plan_type?.includes('view') && {
    component: CNavItem,
    name: 'Travel Plan Type',
    to: '/Viewtravelplantype',
  },
  travel_permission.travel_region_list?.includes('view') && {
    component: CNavItem,
    name: 'Travel Region List',
    to: '/Viewtravelregionlist',
  },
  travel_permission.travel_cover_type?.includes('view') && {
    component: CNavItem,
    name: 'Travel Cover Type',
    to: '/Viewtravelcovertypelist',
  },
  travel_permission.travel_plan?.includes('view') && {
    component: CNavItem,
    name: 'Travel Plan',
    to: '/travel-plan',
    active:
      window.location.pathname === '/AddTravelPlan' ||
      window.location.pathname === '/EditTravelPlan' ||
      type === 'travel' ||
      window.location.pathname === '/ViewPlanPrice' ||
      window.location.pathname === '/AddPlanPrice' ||
      window.location.pathname === '/EditPlanPrice',
  },
].filter(Boolean)

const travelNavGroup =
  travelNavItems.length > 0
    ? {
      component: CNavGroup,
      name: 'Travel',
      to: '/Travel',
      icon: <CIcon icon={cilAirplaneMode} customClassName="nav-icon" />,
      items: travelNavItems,
    }
    : null

const homeNavItems = [
  home_permission.property_type?.includes('view') && {
    component: CNavItem,
    name: 'Property Type',
    to: '/Viewpropertytypelist',
  },
  home_permission.home_plan_type?.includes('view') && {
    component: CNavItem,
    name: 'Home Plan Type',
    to: '/Viewhomeplantypelist',
  },
  home_permission.home_ownership_type?.includes('view') && {
    component: CNavItem,
    name: 'Home Ownership Type',
    to: '/Viewhomeownership',
  },
  home_permission.home_condition?.includes('view') && {
    component: CNavItem,
    name: 'Home Conditions',
    to: '/Viewhomecondition',
  },
  home_permission.additional_home_condition?.includes('view') && {
    component: CNavItem,
    name: 'Additional Home Conditions',
    to: '/ViewHomeAdditionalConditions',
  },
  home_permission.home_plan?.includes('view') && {
    component: CNavItem,
    name: 'Home Plan',
    to: '/homeplan',
    active:
      window.location.pathname === '/AddHomePlan' ||
      window.location.pathname === '/EditHomePlan' ||
      window.location.pathname === '/HomeCondition',
  },
].filter(Boolean)

const homeNavGroup =
  homeNavItems.length > 0
    ? {
      component: CNavGroup,
      name: 'Home',
      to: '/home',
      icon: <CIcon icon={cilHouse} customClassName="nav-icon" />,
      items: homeNavItems,
    }
    : null

const yachtNavItems = [
  yacht_permission.year_code?.includes('view') && {
    component: CNavItem,
    name: 'Year Code',
    to: '/ViewYachtYearCode',
  },
  yacht_permission.yacht_make?.includes('view') && {
    component: CNavItem,
    name: 'Yacht Make',
    to: '/ViewYachtMake',
  },
  yacht_permission.yacht_model?.includes('view') && {
    component: CNavItem,
    name: 'Yacht Model',
    to: '/ViewYachtModel',
  },
  yacht_permission.yacht_engine?.includes('view') && {
    component: CNavItem,
    name: 'Yacht Engine',
    to: '/ViewYachtEngine',
  },
  yacht_permission.yacht_body_type?.includes('view') && {
    component: CNavItem,
    name: 'Body Type',
    to: '/Viewyachtbodytype',
  },
  yacht_permission.boat_breadth?.includes('view') && {
    component: CNavItem,
    name: 'Boat Breadth',
    to: '/ViewBoatBreadth',
  },
  yacht_permission.hull_material?.includes('view') && {
    component: CNavItem,
    name: 'Hull Material',
    to: '/Viewyachthullmaterial',
  },
  // yacht_permission.horse_power_list?.includes('view') && {
  //   component: CNavItem,
  //   name: 'Horse Power List',
  //   to: '/Viewyachthorsepowerlist',
  // },
  yacht_permission.engine_list?.includes('view') && {
    component: CNavItem,
    name: 'Engine Type',
    to: '/Viewyachtenginelist',
  },
  yacht_permission.speed_knots_list?.includes('view') && {
    component: CNavItem,
    name: 'Speed Knots List',
    to: '/Viewyachtspeedknotlist',
  },
  yacht_permission.yacht_condition?.includes('view') && {
    component: CNavItem,
    name: 'Yacht Conditions',
    to: '/Viewyachtcondition',
  },
  yacht_permission.yacht_experience?.includes('view') && {
    component: CNavItem,
    name: 'Yacht Experience',
    to: '/YachtExperience',
  },
  yacht_permission.yacht_questionnaire?.includes('view') && {
    component: CNavItem,
    name: 'Yacht Questionnaire',
    to: '/YachtQuestions',
  },
  yacht_permission.yacht_plan?.includes('view') && {
    component: CNavItem,
    name: 'Yacht Plan',
    to: '/yachtplan',
    active:
      window.location.pathname === '/Addyachtplan' ||
      window.location.pathname === '/AddTPLyachtplan' ||
      window.location.pathname === '/EditYachtPlan' ||
      window.location.pathname === '/YachtCondition',
  },
].filter(Boolean)

const yachtNavGroup =
  yachtNavItems.length > 0
    ? {
      component: CNavGroup,
      name: 'Yacht',
      to: '/Yacht',
      icon: <CIcon icon={cilBoatAlt} customClassName="nav-icon" />,
      items: yachtNavItems,
    }
    : null

const medicalNavItems = [
  medical_permission.plan_type?.includes('view') && {
    component: CNavItem,
    name: 'Plan Type',
    to: '/Viewmedicalplantype',
  },
  // medical_permission.visa_countries?.includes('view') && {
  //   component: CNavItem,
  //   name: 'Emirates issue visa',
  //   to: '/Viewmedicalvisacountries',
  // },
  medical_permission.visa_type?.includes('view') && {
    component: CNavItem,
    name: 'Visa Type',
    to: '/Viewmedicalplancondition',
  },
  medical_permission.salary_range?.includes('view') && {
    component: CNavItem,
    name: 'Salary Range',
    to: '/Viewmedicalsalaryange',
  },
  medical_permission.weight_type?.includes('view') && {
    component: CNavItem,
    name: 'Weight Type',
    to: '/Viewmedicalweighttype',
  },

  medical_permission.health_questionnaire?.includes('view') && {
    component: CNavItem,
    name: 'Health Questionnaire',
    to: '/ViewGeneralwritingConditions',
  },
  medical_permission.additional_conditions?.includes('view') && {
    component: CNavItem,
    name: 'Additional Conditions',
    to: '/StandardConditions',
  },
  // medical_permission.co_payments?.includes('view') && {
  //   component: CNavItem,
  //   name: 'Co-payments',
  //   to: '/AdditionalConditions',
  // },
  medical_permission.underwriting_conditions?.includes('view') && {
    component: CNavItem,
    name: 'Underwriting Conditions',
    to: '/UnderwritingConditions',
  },
  medical_permission.maternity_conditions?.includes('view') && {
    component: CNavItem,
    name: 'Maternity Condition',
    to: '/maternitycondition',
  },
  medical_permission.declaration?.includes('view') && {
    component: CNavItem,
    name: 'Declaration',
    to: '/Viewmedicaldeclaration',
  },
  medical_permission.tpa?.includes('view') && {
    component: CNavItem,
    name: 'TPA',
    to: '/ViewmedicalTPA',
  },
  medical_permission.network?.includes('view') && {
    component: CNavItem,
    name: 'Network',
    to: '/ViewmedicalNetwork',
  },
  medical_permission.networklist?.includes('view') && {
    component: CNavItem,
    name: 'Network List',
    to: '/ViewmedicalNetworkList',
  },
  medical_permission.medical_labels?.includes('view') && {
    component: CNavItem,
    name: 'Labels',
    to: '/ViewMedicalLabel',
  },
  medical_permission.medical_labels?.includes('view') && {
    component: CNavItem,
    name: 'Indicative Quote',
    to: '/ShowInquotespage',
  },
  medical_permission.medical_plan?.includes('view') && {
    component: CNavItem,
    name: 'Medical Plan',
    to: '/medicalplan',
  },
].filter(Boolean)

const medicalNavGroup =
  medicalNavItems.length > 0
    ? {
      component: CNavGroup,
      name: 'Medical',
      to: '/Medical',
      icon: <CIcon icon={cilBed} customClassName="nav-icon" />,
      items: medicalNavItems,
    }
    : null

const GroupMedicalNavItems = [
  group_medical_permission.group_medical_plan?.includes('view') && {
    component: CNavItem,
    name: 'Group Medical Plan',
    to: '/ViewGroupMedicalPlans',
  },
  // medical_permission.visa_countries?.includes('view') && {
  //   component: CNavItem,
  //   name: 'Member Requests',
  //   to: '/ViewMemberRequests',
  // },
  group_medical_permission.claim_request?.includes('view') && {
    component: CNavItem,
    name: 'Claim Request',
    to: '/ViewClaimRequest',
  },
  // medical_permission.visa_countries?.includes('view') && {
  //   component: CNavItem,
  //   name: 'Active Members',
  //   to: '/ViewActiveMembers',
  // },
  // medical_permission.visa_countries?.includes('view') && {
  //   component: CNavItem,
  //   name: 'Deleted Members',
  //   to: '/ViewDeletedMembers',
  // },
  group_medical_permission.category?.includes('view') && {
    component: CNavItem,
    name: 'Category',
    to: '/ViewGroupMedicalCategory',
  },
  group_medical_permission.claim_type?.includes('view') && {
    component: CNavItem,
    name: 'Claim Type',
    to: '/ViewGroupMedicalClaimType',
  },
  group_medical_permission.claim_status?.includes('view') && {
    component: CNavItem,
    name: 'Claim Status',
    to: '/ViewGroupMedicalClaimStatus',
  },
  group_medical_permission.claim_descriptions?.includes('view') && {
    component: CNavItem,
    name: 'Claim Descriptions',
    to: '/ViewGroupMedicalClaimDescription',
  },

  group_medical_permission.claim_procedure?.includes('view') && {
    component: CNavItem,
    name: 'Claim Procedure',
    to: '/ViewClaimProcedure',
  },
  group_medical_permission.useful_links?.includes('view') && {
    component: CNavItem,
    name: 'Useful Links',
    to: '/ViewUsefulLinks',
  },
  group_medical_permission.tat_days?.includes('view') && {
    component: CNavItem,
    name: 'Tat Days',
    to: '/TatView',
  },
  group_medical_permission.marital_status?.includes('view') && {
    component: CNavItem,
    name: 'Marital Status',
    to: '/ViewMaritalStatus',
  },
  group_medical_permission.gender?.includes('view') && {
    component: CNavItem,
    name: 'Gender',
    to: '/ViewGender',
  },
  group_medical_permission.relation?.includes('view') && {
    component: CNavItem,
    name: 'Relation',
    to: '/ViewRelation',
  },
  group_medical_permission.sponsor_type?.includes('view') && {
    component: CNavItem,
    name: 'Sponsor Type',
    to: '/SponsortypeView',
  },
  group_medical_permission.work_location?.includes('view') && {
    component: CNavItem,
    name: 'Work Location',
    to: '/ViewWorkLocation',
  },
  group_medical_permission.work_location?.includes('view') && {
    component: CNavItem,
    name: 'Actual Salary Band',
    to: '/ViewActualSalaryBand',
  },


].filter(Boolean)

const GroupMedicalNavGroup =
  homeNavItems.length > 0
    ? {
      component: CNavGroup,
      name: 'Group Medical',
      to: '/GroupMedical',
      icon: <CIcon icon={cilHouse} customClassName="nav-icon" />,
      items: GroupMedicalNavItems,
    }
    : null


const masterNavItems = [
  master_permission.line_of_business?.includes('view') && {
    component: CNavItem,
    name: 'Line Of Business',
    to: '/line-of-business',
  },
  master_permission.location?.includes('view') && {
    component: CNavItem,
    name: 'Location',
    to: '/ViewBusinessEntity',
    active:
      window.location.pathname === '/AddBusinessEntity' ||
      window.location.pathname === '/EditBusinessEntity' ||
      window.location.pathname === '/ViewBusinessEntityBank',
  },
  master_permission.plan_category?.includes('view') && {
    component: CNavItem,
    name: 'Plan Category',
    to: '/plan-category',
  },
  master_permission.nature_of_plan?.includes('view') && {
    component: CNavItem,
    name: 'Nature Of Plan',
    to: '/nature-of-plan',
  },
  master_permission.nationality?.includes('view') && {
    component: CNavItem,
    name: 'Nationality',
    to: '/ViewNationality',
  },
  master_permission.standard_cover?.includes('view') && {
    component: CNavItem,
    name: 'Standard Cover',
    to: '/GetStandardCovers',
  },
  master_permission.additional_cover?.includes('view') && {
    component: CNavItem,
    name: 'Additional Cover',
    to: '/GetAdditionalCovers',
  },
  master_permission.usertype?.includes('view') && {
    component: CNavItem,
    name: 'Usertype',
    to: '/ViewUserType',
  },

  master_permission.policy_type?.includes('view') && {
    component: CNavItem,
    name: 'Policy Type',
    to: '/ViewPolicytype',
  },
  master_permission.lead_status?.includes('view') && {
    component: CNavItem,
    name: 'Lead Status',
    to: '/ViewLeadStatus',
  },
  master_permission.vat?.includes('view') && {
    component: CNavItem,
    name: 'Vat',
    to: '/vat',
  },
  master_permission.staff?.includes('view') && {
    component: CNavItem,
    name: 'Staff',
    to: '/ViewStaff',
    active:
      window.location.pathname === '/AddStaff' ||
      window.location.pathname === '/EditStaff' ||
      window.location.pathname === '/User_management',
  },
  master_permission.documents?.includes('view') && {
    component: CNavItem,
    name: 'Documents',
    to: '/ViewDocumentsList',
  },
  master_permission.testimonials?.includes('view') && {
    component: CNavItem,
    name: 'Testimonials',
    to: '/ViewTestimonials',
  },
  master_permission.compliance?.includes('view') && {
    component: CNavItem,
    name: 'Compliance & IT',
    to: '/ViewCompliance',
  },
  master_permission.special_offers?.includes('view') && {
    component: CNavItem,
    name: 'Special Offers',
    to: '/ViewSpecialOffer',
  },
  master_permission.claims?.includes('view') && {
    component: CNavItem,
    name: 'Claims',
    to: '/claims',
  },
  master_permission.terms_conditions?.includes('view') && {
    component: CNavItem,
    name: 'Terms & Conditions',
    to: '/Termscondition',
  },
  master_permission.social_media_link?.includes('view') && {
    component: CNavItem,
    name: 'Social Media',
    to: '/Socialmedia',
  },
  master_permission.motor_claim_question?.includes('view') && {
    component: CNavItem,
    name: 'Claim Questions',
    to: '/ClaimQuestions',
  },
  master_permission.bank_details?.includes('view') && {
    component: CNavItem,
    name: 'Bank Details',
    to: '/BankDetails',
  },
  master_permission.emergency_departments?.includes('view') && {
    component: CNavItem,
    name: 'Emergency Department',
    to: '/EmergencyDepartment',
  },
  master_permission.guidelines?.includes('view') && {
    component: CNavItem,
    name: 'Guidelines',
    to: '/StepsGuidelines',
  },
  master_permission.banner_image?.includes('view') && {
    component: CNavItem,
    name: 'Banner Image',
    to: '/BannerImage',
  },
  master_permission.am_rating?.includes('view') && {
    component: CNavItem,
    name: 'AM Rating',
    to: '/AMRating',
  },
  master_permission.sp_rating?.includes('view') && {
    component: CNavItem,
    name: 'S&P Rating',
    to: '/SPRating',
  },
  master_permission.be_commission?.includes('view') && {
    component: CNavItem,
    name: 'BE Commission',
    to: '/ViewBusinessEntitycommission',
  },
  master_permission.be_discount?.includes('view') && {
    component: CNavItem,
    name: 'BE Discount',
    to: '/ViewBusinessEntityDiscount',
  },
  master_permission.be_discount?.includes('view') && {
    component: CNavItem,
    name: 'BE Topup',
    to: '/ViewBusinessEntityTopup',
  },
  master_permission.be_discount?.includes('view') && { // master permission key to be changed  
    component: CNavItem,
    name: 'Producer Discount',
    to: '/ViewProducerDiscount',
  },
  master_permission.discount_coupon?.includes('view') && {
    component: CNavItem,
    name: 'Discount Coupon',
    to: '/ViewDiscountcoupon',
  },
  master_permission.best_plan?.includes('view') && {
    component: CNavItem,
    name: 'Best Plan',
    to: '/ViewBestPlan',
  },
  master_permission.best_plan?.includes('view') && {
    component: CNavItem,
    name: 'Preferred Days',
    to: '/preferredDays',
  },
  master_permission.reason_type?.includes('view') && {
    component: CNavItem,
    name: 'Reason Type',
    to: '/ViewReasonType',
  },
  master_permission.reason_type?.includes('view') && {
    component: CNavItem,
    name: 'Email Templates',
    to: '/ViewEmailTemplates',
  },
  master_permission.reason_type?.includes('view') && {
    component: CNavItem,
    name: 'Template Types',
    to: '/ViewTemplateTypes',
  },
  master_permission.reason_type?.includes('view') && {
    component: CNavItem,
    name: 'Mails',
    to: '/ViewAllMail',
  },
  master_permission.reason_type?.includes('view') && {
    component: CNavItem,
    name: 'Users Mails',
    to: '/Usersmail',
  },
  master_permission.reason_type?.includes('view') && {
    component: CNavItem,
    name: 'Tool Tips',
    to: '/tooltips',
  },
  master_permission.reason_type?.includes('view') && {
    component: CNavItem,
    name: 'CMS',
    to: '/ViewCms',
  },


].filter(Boolean)

const masterNavGroup =
  masterNavItems.length > 0
    ? {
      component: CNavGroup,
      name: 'Master',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: masterNavItems,
    }
    : null

const globalUserManagementPermissionsMenu =
  usertype === '64622470b201a6f07b2dff22'
    ? {
      component: CNavItem,
      name: 'Global User Management Permissions',
      to: '/global-user-management-permissions',
      icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    }
    : null


const ceoNavItems = [
  dashboard_permission.ceo_dashboard?.includes('view') && {
    component: CNavItem,
    name: 'Business Development',
    to: '/sales',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    active: window.location.pathname === '/ceo',
  },
  dashboard_permission.operations_dashboard?.includes('view') && {
    component: CNavItem,
    name: 'Operations Dashboard',
    to: '/operations',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
].filter(Boolean)

const ceoNavGroup =
  ceoNavItems.length > 0
    ? {
      component: CNavGroup,
      name: 'CEO Dashboard',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: ceoNavItems,
    }
    : null


const _nav = [

  dashboard_permission.admin_dashboard?.includes('view') && {
    component: CNavItem,
    name: 'SuperAdmin Dashboard',
    to: '/admin',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    active: window.location.pathname === '/admin',
  },
  dashboard_permission.supervisor_dashboard?.includes('view') && {
    component: CNavItem,
    name: 'Supervisor Dashboard',
    to: '/ManageSupervisorDashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  ceoNavGroup,

  // dashboard_permission.ceo_dashboard?.includes('view') && {
  //   component: CNavItem,
  //   name: 'Business Development',
  //   to: '/ceo',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   active: window.location.pathname === '/ceo',
  // },
  // dashboard_permission.operations_dashboard?.includes('view') && {
  //   component: CNavItem,
  //   name: 'Operations Dashboard',
  //   to: '/operations',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  // },
  // dashboard_permission.be_dashboard?.includes('view') && {
  //   component: CNavItem,
  //   name: 'BE Dashboard',
  //   to: '/BEdashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  // },
  dashboard_permission.producer_dashboard?.includes('view') && {
    component: CNavItem,
    name: 'Producer Dashboard',
    to: '/ProducerDashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    active: window.location.pathname === '/producer',
  },
  dashboard_permission.sa_dashboard?.includes('view') && {
    component: CNavItem,
    name: 'SA Dashboard',
    to: '/salesDashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  dashboard_permission.dc_dashboard?.includes('view') && {
    component: CNavItem,
    name: 'DC Dashboard',
    to: '/documentchaserDashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  dashboard_permission.policy_issuer_dashboard?.includes('view') && {
    component: CNavItem,
    name: 'PI Dashboard',
    to: '/policyissuerdashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  dashboard_permission.insurance_company?.includes('view') && {
    component: CNavItem,
    name: 'Insurance Company',
    to: '/insurance-company',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    active:
      window.location.pathname === '/AddCompany' ||
      window.location.pathname === '/ViewBlackListedVehicle' ||
      window.location.pathname === '/ViewLob' ||
      window.location.pathname === '/ViewBank' ||
      window.location.pathname === '/EditCompany' ||
      window.location.pathname === '/ViewPlans',
  },
  dashboard_permission.insurance_company_dashboard?.includes('view') && {
    component: CNavItem,
    name: 'Insurance Company Dashboard',
    to: '/insurancecompanydashboard',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
  },
  dashboard_permission.insurance_company_dashboard?.includes('view') && {
    component: CNavItem,
    name: 'Insurance Company Users',
    to: '/CompanyUsers',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //     text: request,
    // },
  },
  dashboard_permission.leads?.includes('view') && {
    component: CNavItem,
    name: 'Leads',
    to: '/AllLeads',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
  },
  dashboard_permission.newsletter?.includes('view') && {
    component: CNavItem,
    name: 'News Letter',
    to: '/Newsletter',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
  },
  dashboard_permission.advertise_with_us?.includes('view') && {
    component: CNavItem,
    name: 'Advertise With Us',
    to: '/GetThirdPartyBuisness',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
  },
  dashboard_permission.complaint?.includes('view') && {
    component: CNavItem,
    name: 'Complaint',
    to: '/Complaint',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
  },
  // dashboard_permission.chats?.includes('view') && {
  //   component: CNavItem,
  //   name: 'Chats',
  //   to: '/chat',
  //   icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,

  // },
  // MIS Reports WE HAVE TO ADD PERMISSION
  dashboard_permission.chats?.includes('view') && {
    component: CNavItem,
    name: 'MIS Reports',
    to: '/MISReports',
    icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,
  },
  // Special Incentives WE HAVE TO ADD PERMISSION
  dashboard_permission.chats?.includes('view') && {
    component: CNavItem,
    name: 'Special Incetives',
    to: '/SpecialIncetive',
    icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,
  },

  masterNavItems.length > 0 && {
    component: CNavTitle,
    name: 'Master',
  },

  motorNavGroup,
  travelNavGroup,
  homeNavGroup,
  yachtNavGroup,
  medicalNavGroup,
  GroupMedicalNavGroup,
  masterNavGroup,
  globalUserManagementPermissionsMenu,
].filter(Boolean)
export default _nav
