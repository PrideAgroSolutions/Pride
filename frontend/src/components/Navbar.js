import React from 'react'
import AdminNavbar from './AdminNavbar';
import UserNavbar from './UserNavbar'
function Navbar() {
    const userRole = sessionStorage.getItem('role');  // Get role from storage or state
  return (
    <nav>
      {userRole === 'admin' ? (
        <AdminNavbar />
      ) : (
        <UserNavbar />
      )}
    </nav>
  )
}

export default Navbar
