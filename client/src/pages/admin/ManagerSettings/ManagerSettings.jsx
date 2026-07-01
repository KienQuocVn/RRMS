import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import ModelDeposit from './ModelDeposit'

import { CreateTRC, getTRCByMotelId, updateTRCById } from '~/apis/TRCAPI'
import { deleteContractTemplate, getContractTemplatesByMotelId } from '~/apis/contractTemplateAPI'
import { getMotelById } from '~/apis/motelAPI'
import { getProfileByUsername } from '~/apis/accountAPI'

import { Box, Container, Grid, Typography, Paper } from '@mui/material'
import SettingsSidebar from './components/SettingsSidebar'
import GeneralInfoTab from './components/GeneralInfoTab'
import ContractTemplateTab from './components/ContractTemplateTab'
import ResidenceTemplateTab from './components/ResidenceTemplateTab'

const ManagerSettings = ({ setIsAdmin, motels, setmotels }) => {
  const { motelId } = useParams()
  const username = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).username : null
  
  const [activeTab, setActiveTab] = useState(0)
  
  const [isExistingData, setIsExistingData] = useState(false)
  const [TRCID, setTRCID] = useState('')
  const [templatecontracts, setTemplatecontracts] = useState([])
  const [motel, setmotel] = useState()
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  
  const [formData, setFormData] = useState({
    householdhead: 'ktlhp',
    representativename: '',
    phone: '',
    birth: '',
    permanentaddress: '',
    job: '',
    identifier: '',
    placeofissue: '',
    dateofissue: '',
    motelId: motelId ? String(motelId) : '',
    tenantUsername: username
  })

  useEffect(() => {
    fetchDataTrc()
    fetchDataTemlateContract()
    fetchDataMotel()
    setIsAdmin(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchDataTrc = async () => {
    if (motelId) {
      try {
        const response = await getTRCByMotelId(motelId)
        const temporaryContract = response?.data?.result
        
        let profile = null
        if (username) {
          try {
            profile = await getProfileByUsername(username)
          } catch (e) {
            console.error('Error fetching host profile:', e)
          }
        }

        if (temporaryContract) {
          setFormData((prevData) => ({
            ...prevData,
            householdhead: temporaryContract.householdhead || prevData.householdhead,
            representativename: temporaryContract.representativename || '',
            phone: temporaryContract.phone || '',
            birth: temporaryContract.birth || '',
            permanentaddress: temporaryContract.permanentaddress || '',
            job: temporaryContract.job || '',
            identifier: temporaryContract.identifier || '',
            placeofissue: temporaryContract.placeofissue || '',
            dateofissue: temporaryContract.dateofissue || ''
          }))
          setTRCID(temporaryContract.temporaryrcontractId)
          setIsExistingData(true)
        } else {
          setIsExistingData(false)
          setTRCID('')
          if (profile) {
            setFormData((prevData) => ({
              ...prevData,
              representativename: profile.fullName || '',
              phone: profile.phone || '',
              birth: profile.birthday || '',
              permanentaddress: profile.address || '',
              job: profile.job || '',
              identifier: profile.cccd || '',
              placeofissue: profile.placeOfIssue || '',
              dateofissue: profile.dateOfIssue || ''
            }))
          }
        }
      } catch (error) {
        console.error('Error fetching temporary contract by motel:', error)
      }
    }
  }

  const fetchDataTemlateContract = async () => {
    if (username && motelId) {
      try {
        const dataContactTemplate = await getContractTemplatesByMotelId(motelId)
        setTemplatecontracts(dataContactTemplate)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const fetchDataMotel = async () => {
    if (username && motelId) {
      try {
        const dataMotel = await getMotelById(motelId)
        setmotel(dataMotel.data.result)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleSave = async () => {
    if (!formData.representativename || !formData.phone || !formData.birth || !formData.permanentaddress || !formData.job || !formData.identifier || !formData.placeofissue || !formData.dateofissue) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng điền đầy đủ các thông tin bắt buộc (*)'
      })
      return
    }
    
    try {
      let response
      if (isExistingData && TRCID) {
        response = await updateTRCById(TRCID, formData)
      } else {
        response = await CreateTRC(formData)
      }

      if ([200, 201].includes(response.status)) {
        Swal.fire({
          icon: 'success',
          title: 'Thông báo',
          text: isExistingData ? 'Cập nhật thông tin thành công.' : 'Lưu thông tin thành công.'
        })
        setTimeout(() => {
          window.location.reload()
        }, 1400)
      } else {
        console.error('Lỗi khi lưu thông tin:', response.message)
      }
    } catch (error) {
      console.error('Lỗi khi gọi API CreateTRC hoặc UpdateTRC:', error)
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleDateChange = (name, date) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: date[0]
    }))
  }

  const handleDelete = async (templateId) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc muốn xóa không?',
      text: 'Bạn sẽ không thể hoàn tác hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa'
    })

    if (result.isConfirmed) {
      try {
        await deleteContractTemplate(templateId)
        Swal.fire('Đã xóa!', 'Mẫu hợp đồng đã được xóa.', 'success')
        fetchDataTemlateContract()
      } catch (error) {
        console.error('Lỗi khi xóa mẫu hợp đồng:', error)
        Swal.fire('Lỗi', 'Không thể xóa mẫu hợp đồng.', 'error')
      }
    }
  }

  return (
    <Box sx={{ bgcolor: '#eff3f6', minHeight: '100vh', pb: 5 }}>
      <NavAdmin setIsAdmin={setIsAdmin} setmotels={setmotels} motels={motels} />
      
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ mb: 3, borderLeft: '3px solid #20a9e7', pl: 2 }}>
          <Typography variant="h5" fontWeight="bold">Cài đặt</Typography>
          <Typography variant="body2" color="text.secondary">Các thiết lập cài đặt cho tài khoản</Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, minHeight: '600px' }}>
              {activeTab === 0 && (
                <GeneralInfoTab 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                  handleDateChange={handleDateChange} 
                  handleSave={handleSave} 
                  isExistingData={isExistingData} 
                />
              )}
              {activeTab === 1 && (
                <ContractTemplateTab 
                  templatecontracts={templatecontracts} 
                  motel={motel} 
                  setSelectedTemplateId={setSelectedTemplateId} 
                  handleDelete={handleDelete} 
                />
              )}
              {activeTab === 2 && (
                <ResidenceTemplateTab motel={motel} />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {selectedTemplateId && (
        <ModelDeposit
          motel={motel}
          username={username}
          templatecontractRouteId={selectedTemplateId}
          fetchDataTemlateContract={fetchDataTemlateContract}
          onClose={() => setSelectedTemplateId(null)}
        />
      )}
    </Box>
  )
}

export default ManagerSettings
