import React, { useEffect, useState } from 'react'

import { CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'
import { useDispatch, useSelector } from 'react-redux'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldabledata = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.changeState)
  const [sideshow, setSideShow] = useState(sidebarShow)


  console.log("sidebarShow", sidebarShow)
  return (
    <CSidebar
      position="fixed"
      //  unfoldable={sidebarShow?.sidebarShow}
      visible={sidebarShow?.sidebarShow}

    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        {/* <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} /> */}
        <img src="https://iili.io/dpHytp9.jpg" alt="" height={45} /><label> <b>Last Minute Policy</b></label>
        {/* <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} /> */}
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
