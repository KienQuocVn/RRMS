import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children, requiredRoles }) => {
  const location = useLocation()
  const storedUser = sessionStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  if (!user || !user.roles) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: 'Vui lòng đăng nhập để tiếp tục.' }}
        replace
      />
    )
  }

  const userRoles = user.roles

  if (!Array.isArray(userRoles)) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.' }}
        replace
      />
    )
  }

  if (userRoles.includes('CUSTOMER') && location.pathname.startsWith('/quanlytro')) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: 'Vai trò CUSTOMER không được phép truy cập trang này.' }}
        replace
      />
    )
  }


  if (requiredRoles && !requiredRoles.some((role) => userRoles.includes(role))) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: 'Bạn không có quyền truy cập trang này.' }}
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute
