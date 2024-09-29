import React, { useEffect, useState } from 'react';
import AppBreadcrumb from './AppBreadcrumb'
import AppContent from './AppContent'
import AppFooter from './AppFooter'
import AppHeader from './AppHeader'
import AppHeaderDropdown from './header/AppHeaderDropdown'
import DocsCallout from './DocsCallout'
import DocsLink from './DocsLink'
import DocsExample from './DocsExample'
const AppSidebar = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import('./AppSidebar'));
    }, 1000);
  });
});

export {
  AppBreadcrumb,
  AppContent,
  AppFooter,
  AppHeader,
  AppHeaderDropdown,
  AppSidebar,
  DocsCallout,
  DocsLink,
  DocsExample,
}
