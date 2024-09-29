import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CContainer, CHeader, CHeaderBrand, CHeaderNav, CHeaderToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'
import { SetSidebar } from 'src/redux/reducers/changeStateReducer'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.changeState)

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => {
            if (sidebarShow?.sidebarShow) {
              dispatch(SetSidebar({ sidebarShow: !sidebarShow, sidebarUnfoldable: !sidebarShow }))
            } else {
              dispatch(
                SetSidebar({ sidebarShow: sidebarShow, sidebarUnfoldable: sidebarShow }))
            }

          }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      {/* <CHeaderDivider /> */}
      {/* <CContainer fluid>
        <AppBreadcrumb />
      </CContainer> */}
    </CHeader>
  )
}

export default AppHeader
