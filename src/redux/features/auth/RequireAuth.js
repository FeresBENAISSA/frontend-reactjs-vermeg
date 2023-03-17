import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import DashboardLayout from "../../../layouts/dashboard/ManagerDashboardLayout"
import { selectCurrentRoles, selectCurrentToken } from "./authSlice"

const RequireAuth = ({allowedRoles}) => {
    const token = useSelector(selectCurrentToken)
    const roles = useSelector(selectCurrentRoles);
    const location = useLocation()
   
    return (
        !token 
            ? <Navigate to="/login" state={{ from: location }} replace />
            : roles.find(role=>allowedRoles?.includes(role))
                ?  <Outlet />
                : <Navigate to="/404" state={{ from: location }} replace />
            
    )
}
export default RequireAuth
