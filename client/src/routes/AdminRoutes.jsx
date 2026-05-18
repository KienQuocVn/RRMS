import { lazy } from 'react'
import { Route } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'

const AdminStatis = lazy(() => import('../pages/admin/ManagerOverallReport/overallReport'))
const DetailRoom = lazy(() => import('../pages/admin/ManagerHome/DetailRoom/DetailRoom'))
const DashboardIndex = lazy(() => import('../pages/admin/ManagerHome/DashboardIndex'))
const ManagerMyAccount = lazy(() => import('../pages/admin/ManagerMyAccount/ManagerMyAccount'))
const ManagerCompanyAT = lazy(() => import('../pages/admin/ManagerCompanyAT/ManagerCompanyAT'))
const ManagerSettings = lazy(() => import('../pages/admin/ManagerSettings/ManagerSettings'))
const AdminManagerGroup = lazy(() => import('../pages/admin/AdminManagerGroup'))
const AdminManagerBoard = lazy(() => import('../pages/admin/AdminManageBoard'))
const AdminManageBoker = lazy(() => import('../pages/admin/ManagerBroker/AdminManageBoker'))
const PostRooms = lazy(() => import('../pages/admin/ManagerBulletinBoards/PostBulletinBoards'))
const AdminManage = lazy(() => import('../pages/admin/AdminManage/AdminManage'))
const RoomManagement = lazy(() => import('../pages/admin/AdminManage/RoomManagement'))
const InvoiceManager = lazy(() => import('../pages/admin/NavContentAdmin/InvoiceManager/InvoiceManager'))
const ServiceManager = lazy(() => import('../pages/admin/NavContentAdmin/ServiceManager/ServiceManager'))
const AssetManager = lazy(() => import('../pages/admin/NavContentAdmin/AssetManager'))
const ContractManager = lazy(() => import('../pages/admin/NavContentAdmin/ContractManage/ContractManager'))
const ContractPreview = lazy(() => import('../pages/admin/NavContentAdmin/ContractManage/ContractPreview'))
const TenantManager = lazy(() => import('../pages/admin/NavContentAdmin/TenantManager'))
const IncomeSummary = lazy(() => import('../pages/admin/NavContentAdmin/IncomeSummary/IncomeSummary'))
const Zalo_history = lazy(() => import('../pages/admin/NavContentAdmin/Zalo_history'))
const SettingMotel = lazy(() => import('../pages/admin/NavContentAdmin/SettingMotel/SettingMotel'))
const ImportFileExcel = lazy(() => import('../pages/admin/NavContentAdmin/ImportFileExcel/ImportFileExcel'))
const MotelSetting = lazy(() => import('../pages/admin/MotelSettings/MotelSetting'))
const ResidenceForm = lazy(() => import('../pages/admin/NavContentAdmin/ResidenceForm'))
const AppPromo = lazy(() => import('../pages/admin/NavContentAdmin/AppPromo'))
const VehicleManager = lazy(() => import('../pages/admin/NavContentAdmin/VehicleManagement/VehicleManager'))

const AdminRoutes = ({ auth, motel }) => {
  const { username, setUsername, setIsAdmin } = auth
  const { motels, setMotels, isNavAdmin, setIsNavAdmin } = motel

  return (
    <>
      <Route
        path="/quanlytro"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <DashboardIndex
              motels={motels}
              setmotels={setMotels}
              setIsAdmin={setIsAdmin}
              isNavAdmin={isNavAdmin}
              setIsNavAdmin={setIsNavAdmin}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quanlytro/:motelId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <DashboardIndex
              motels={motels}
              setmotels={setMotels}
              setIsAdmin={setIsAdmin}
              isNavAdmin={isNavAdmin}
              setIsNavAdmin={setIsNavAdmin}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/moi-gioi"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <AdminManageBoker setIsAdmin={setIsAdmin} />
          </ProtectedRoute>
        }
      />
      <Route path="/moi-gioi/:motelId" element={<AdminManageBoker setIsAdmin={setIsAdmin} motels={motels} setmotels={setMotels} />} />
      <Route
        path="/adminManage"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <AdminManage setIsAdmin={setIsAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adminManage/*"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <AdminManage setIsAdmin={setIsAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bao-cao"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <AdminStatis
              motels={motels}
              setmotels={setMotels}
              setIsAdmin={setIsAdmin}
              isNavAdmin={isNavAdmin}
              setIsNavAdmin={setIsNavAdmin}
              setUsername={setUsername}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bao-cao/:motelId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <AdminStatis
              motels={motels}
              setmotels={setMotels}
              setIsAdmin={setIsAdmin}
              isNavAdmin={isNavAdmin}
              setIsNavAdmin={setIsNavAdmin}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/AdminManagerBoard"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <AdminManagerBoard
              motels={motels}
              setmotels={setMotels}
              setIsAdmin={setIsAdmin}
              isNavAdmin={isNavAdmin}
              setIsNavAdmin={setIsNavAdmin}
            />
          </ProtectedRoute>
        }
      />
      <Route path="/AppPromo" element={<AppPromo />} />
      <Route
        path="/residenceForm/:tenantId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <ResidenceForm setIsAdmin={setIsAdmin} isNavAdmin={isNavAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/AdminStatis"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <AdminStatis setIsAdmin={setIsAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roomManagement"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <RoomManagement setIsAdmin={setIsAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/AdminManagerGroup"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <AdminManagerGroup setIsAdmin={setIsAdmin} />
          </ProtectedRoute>
        }
      />
      <Route path="/dang-tin" element={<PostRooms setIsAdmin={setIsAdmin} />} />
      <Route path="/dang-tin/:motelId" element={<PostRooms setIsAdmin={setIsAdmin} />} />
      <Route path="/tai-khoan" element={<ManagerMyAccount TaiKhoan={username} setIsAdmin={setIsAdmin} />} />
      <Route path="/phan-quyen" element={<ManagerCompanyAT setIsAdmin={setIsAdmin} />} />
      <Route path="/phan-quyen/:motelId" element={<ManagerCompanyAT setIsAdmin={setIsAdmin} motels={motels} setmotels={setMotels} />} />
      <Route
        path="/cai-dat"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <ManagerSettings setIsAdmin={setIsAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/motelsetting"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <MotelSetting setIsAdmin={setIsAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cai-dat/:motelId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <ManagerSettings setIsAdmin={setIsAdmin} motels={motels} setmotels={setMotels} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quanlytro/:motelId/quan-ly-hoa-don"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <InvoiceManager motels={motels} setmotels={setMotels} setIsAdmin={setIsAdmin} isNavAdmin={isNavAdmin} setIsNavAdmin={setIsNavAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quanlytro/:motelId/quan-ly-dich-vu"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <ServiceManager motels={motels} setmotels={setMotels} setIsAdmin={setIsAdmin} isNavAdmin={isNavAdmin} setIsNavAdmin={setIsNavAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quanlytro/:motelId/quan-ly-tai-san"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <AssetManager motels={motels} setmotels={setMotels} setIsAdmin={setIsAdmin} isNavAdmin={isNavAdmin} setIsNavAdmin={setIsNavAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quanlytro/:motelId/tat-ca-hop-dong"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <ContractManager motels={motels} setmotels={setMotels} setIsAdmin={setIsAdmin} isNavAdmin={isNavAdmin} setIsNavAdmin={setIsNavAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quanlytro/:motelId/tat-ca-khach-thue"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <TenantManager motels={motels} setmotels={setMotels} setIsAdmin={setIsAdmin} isNavAdmin={isNavAdmin} setIsNavAdmin={setIsNavAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quanlytro/:motelId/thu-chi-tong-ket"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <IncomeSummary motels={motels} setmotels={setMotels} setIsAdmin={setIsAdmin} isNavAdmin={isNavAdmin} setIsNavAdmin={setIsNavAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quanlytro/:motelId/cai-dat-nha-tro"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <SettingMotel motels={motels} setmotels={setMotels} setIsAdmin={setIsAdmin} isNavAdmin={isNavAdmin} setIsNavAdmin={setIsNavAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quanlytro/:motelId/lich-su-gui-zalo"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <Zalo_history motels={motels} setmotels={setMotels} setIsAdmin={setIsAdmin} isNavAdmin={isNavAdmin} setIsNavAdmin={setIsNavAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quanlytro/:motelId/import-data-from-file"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <ImportFileExcel motels={motels} setmotels={setMotels} setIsAdmin={setIsAdmin} isNavAdmin={isNavAdmin} setIsNavAdmin={setIsNavAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quanlytro/:motelId/Chi-tiet-phong/:roomId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <DetailRoom motels={motels} setmotels={setMotels} setIsAdmin={setIsAdmin} isNavAdmin={isNavAdmin} setIsNavAdmin={setIsNavAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quanlytro/:motelId/Contract-Preview/:contractId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <ContractPreview setIsAdmin={setIsAdmin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quanlytro/:motelId/phuong-tien"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'HOST']}>
            <VehicleManager motels={motels} setmotels={setMotels} setIsAdmin={setIsAdmin} isNavAdmin={isNavAdmin} setIsNavAdmin={setIsNavAdmin} />
          </ProtectedRoute>
        }
      />
    </>
  )
}

export default AdminRoutes
