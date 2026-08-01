/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Typography, IconButton, Box,
  FormControlLabel, Checkbox, Divider, Stack, Tooltip, MenuItem
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import Swal from 'sweetalert2'
import {
  createResidenceTemplate,
  getResidenceTemplateById,
  updateResidenceTemplate
} from '~/apis/residenceTemplateAPI'
import { getDefaultResidenceContent, DEFAULT_RESIDENCE_TEMPLATE_NAME } from '~/utils/templateDefaults'

// ======================== Merge Tags ========================
const mergeTags = [
  { label: 'Tên người khai', value: '{{tenNguoiKhai}}' },
  { label: 'Ngày sinh', value: '{{ngaySinh}}' },
  { label: 'Giới tính', value: '{{gioiTinh}}' },
  { label: 'Số định danh', value: '{{soDinhDanh}}' },
  { label: 'Số điện thoại', value: '{{soDienThoai}}' },
  { label: 'Email', value: '{{email}}' },
  { label: 'Tên chủ hộ', value: '{{tenChuHo}}' },
  { label: 'Quan hệ chủ hộ', value: '{{quanHeChuHo}}' },
  { label: 'SĐD chủ hộ', value: '{{sddChuHo}}' },
  { label: 'Tên nhà trọ', value: '{{tenNhaTro}}' },
  { label: 'Địa chỉ', value: '{{diaChi}}' },
  { label: 'Ngày lập', value: '{{ngayLap}}' },
]


// ======================== Toolbar Sx ========================
const toolbarButtonSx = {
  minWidth: 36,
  width: 36,
  height: 34,
  p: 0,
  color: '#374151',
  borderColor: '#dbe3ea'
}

// ======================== Rich Text Editor ========================
const ResidenceWordEditor = ({ value, onChange }) => {
  const editableRef = useRef(null)

  useEffect(() => {
    if (editableRef.current && editableRef.current.innerHTML !== value) {
      editableRef.current.innerHTML = value || ''
    }
  }, [value])

  const syncContent = () => {
    onChange(editableRef.current?.innerHTML || '')
  }

  const runCommand = (command, commandValue = null) => {
    editableRef.current?.focus()
    document.execCommand(command, false, commandValue)
    syncContent()
  }

  const insertHtml = (html) => {
    editableRef.current?.focus()
    document.execCommand('insertHTML', false, html)
    syncContent()
  }

  return (
    <Box sx={{ border: '1px solid #dfe5ea', borderRadius: 2, overflow: 'hidden', bgcolor: '#f4f6f8' }}>
      <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #dfe5ea', px: 2, py: 1.25 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Tooltip title="In đậm"><Button variant="outlined" sx={toolbarButtonSx} onClick={() => runCommand('bold')}><FormatBoldIcon fontSize="small" /></Button></Tooltip>
          <Tooltip title="In nghiêng"><Button variant="outlined" sx={toolbarButtonSx} onClick={() => runCommand('italic')}><FormatItalicIcon fontSize="small" /></Button></Tooltip>
          <Tooltip title="Gạch chân"><Button variant="outlined" sx={toolbarButtonSx} onClick={() => runCommand('underline')}><FormatUnderlinedIcon fontSize="small" /></Button></Tooltip>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="Căn trái"><Button variant="outlined" sx={toolbarButtonSx} onClick={() => runCommand('justifyLeft')}><FormatAlignLeftIcon fontSize="small" /></Button></Tooltip>
          <Tooltip title="Căn giữa"><Button variant="outlined" sx={toolbarButtonSx} onClick={() => runCommand('justifyCenter')}><FormatAlignCenterIcon fontSize="small" /></Button></Tooltip>
          <Tooltip title="Căn phải"><Button variant="outlined" sx={toolbarButtonSx} onClick={() => runCommand('justifyRight')}><FormatAlignRightIcon fontSize="small" /></Button></Tooltip>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="Danh sách chấm"><Button variant="outlined" sx={toolbarButtonSx} onClick={() => runCommand('insertUnorderedList')}><FormatListBulletedIcon fontSize="small" /></Button></Tooltip>
          <Tooltip title="Danh sách số"><Button variant="outlined" sx={toolbarButtonSx} onClick={() => runCommand('insertOrderedList')}><FormatListNumberedIcon fontSize="small" /></Button></Tooltip>
          <Tooltip title="Chèn bảng">
            <Button variant="outlined" sx={toolbarButtonSx} onClick={() => insertHtml('<table style="width:100%;border-collapse:collapse;margin:12px 0;"><tbody><tr><td style="border:1px solid #111;padding:8px;">Nội dung</td><td style="border:1px solid #111;padding:8px;">Nội dung</td></tr><tr><td style="border:1px solid #111;padding:8px;">Nội dung</td><td style="border:1px solid #111;padding:8px;">Nội dung</td></tr></tbody></table><p><br/></p>')}>
              <TableChartOutlinedIcon fontSize="small" />
            </Button>
          </Tooltip>
          <TextField
            select
            size="small"
            label="Chèn biến"
            value=""
            sx={{ minWidth: 180 }}
            onChange={(e) => insertHtml(e.target.value)}
          >
            {mergeTags.map((tag) => (
              <MenuItem key={tag.value} value={tag.value}>{tag.label}</MenuItem>
            ))}
          </TextField>
        </Stack>
      </Box>
      <Box sx={{ maxHeight: '58vh', overflow: 'auto', p: 3 }}>
        <Box
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          onInput={syncContent}
          sx={{
            width: '21cm',
            minHeight: '29.7cm',
            mx: 'auto',
            p: '2cm 1.5cm',
            bgcolor: '#fff',
            color: '#111827',
            boxShadow: '0 4px 18px rgba(15,23,42,.12)',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: '"Times New Roman", serif',
            fontSize: 16,
            lineHeight: 1.65,
            '& table': { borderCollapse: 'collapse' },
            '& td, & th': { minWidth: 80 },
            '&:empty:before': {
              content: '"Nhập nội dung mẫu tờ khai tạm trú..."',
              color: '#9ca3af'
            }
          }}
        />
      </Box>
    </Box>
  )
}

// ======================== Main Modal Component ========================
const ModelResidenceTemplate = ({ motel, username, templateId, fetchData, onClose }) => {
  const [formData, setFormData] = useState({
    residenceTemplateId: '',
    motelId: '',
    templatename: '',
    sortOrder: '',
    content: ''
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (templateId && templateId !== 'Create') {
      fetchDataWhenEdit(templateId)
    } else {
      setFormData({
        residenceTemplateId: '',
        motelId: '',
        templatename: '',
        sortOrder: '',
        content: getDefaultResidenceContent()
      })
    }
  }, [templateId])

  const fetchDataWhenEdit = async (id) => {
    try {
      const response = await getResidenceTemplateById(id)
      if (response) {
        const contentCleaned = (response.content || '').replace(/<[^>]*>/g, '').trim()
        if (contentCleaned === 'Mẫu mặc định' || !contentCleaned || contentCleaned.length < 50) {
          response.content = getDefaultResidenceContent()
        }
        setFormData({
          residenceTemplateId: response.residenceTemplateId || '',
          motelId: response.motelId || '',
          templatename: response.templatename || '',
          sortOrder: response.sortOrder || '',
          content: response.content || ''
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  // ---- File upload (docx, html, txt) ----
  const loadMammoth = () => {
    return new Promise((resolve, reject) => {
      if (window.mammoth) { resolve(window.mammoth); return }
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js'
      script.onload = () => resolve(window.mammoth)
      script.onerror = (err) => reject(err)
      document.head.appendChild(script)
    })
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()

    if (ext === 'docx') {
      try {
        const mammothInstance = await loadMammoth()
        const reader = new FileReader()
        reader.onload = async (e) => {
          const result = await mammothInstance.convertToHtml({ arrayBuffer: e.target.result })
          setFormData((prev) => ({ ...prev, content: result.value }))
          Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã tải nội dung file Word lên editor!', timer: 1500, showConfirmButton: false })
        }
        reader.readAsArrayBuffer(file)
      } catch (err) {
        console.error(err)
        Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể đọc file Word (.docx).' })
      }
    } else if (ext === 'html' || ext === 'htm') {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, content: e.target.result }))
        Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã tải file HTML thành công!', timer: 1500, showConfirmButton: false })
      }
      reader.readAsText(file)
    } else if (ext === 'txt') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const html = e.target.result.split('\n').map(line => `<p>${line}</p>`).join('')
        setFormData((prev) => ({ ...prev, content: html }))
        Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã tải file Text thành công!', timer: 1500, showConfirmButton: false })
      }
      reader.readAsText(file)
    } else {
      Swal.fire({ icon: 'warning', title: 'Không hỗ trợ', text: 'Chỉ hỗ trợ file .docx, .html, .txt' })
    }
    event.target.value = ''
  }

  // ---- Validate ----
  const validateForm = () => {
    const errors = {}
    if (!formData.templatename?.trim()) errors.templatename = true
    if (!formData.sortOrder || parseInt(formData.sortOrder, 10) < 1) errors.sortOrder = true
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ---- Save ----
  const handleSave = async () => {
    if (!validateForm() || !username) return

    const payload = {
      motelId: motel?.motelId,
      templatename: formData.templatename,
      sortOrder: parseInt(formData.sortOrder, 10),
      content: formData.content || ''
    }

    try {
      if (templateId === 'Create') {
        await createResidenceTemplate(payload)
        Swal.fire({ icon: 'success', title: 'Thông báo', text: 'Tạo mẫu tờ khai tạm trú thành công!' })
      } else {
        await updateResidenceTemplate(templateId, payload)
        Swal.fire({ icon: 'success', title: 'Thông báo', text: 'Cập nhật mẫu tờ khai tạm trú thành công!' })
      }
      fetchData()
      onClose()
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: templateId === 'Create' ? 'Lỗi tạo mẫu tờ khai tạm trú.' : 'Lỗi cập nhật mẫu tờ khai tạm trú.'
      })
    }
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      PaperProps={{ sx: { minHeight: '90vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2, borderBottom: '1px solid #eee' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ bgcolor: '#fff3e0', color: '#f57c00', p: 1, borderRadius: '50%', display: 'flex' }}>
            <DescriptionOutlinedIcon />
          </Box>
          <Typography variant="h6" fontWeight="bold">
            {templateId === 'Create' ? 'Tạo mẫu tờ khai tạm trú mới' : 'Chỉnh sửa mẫu tờ khai tạm trú'}
          </Typography>
        </Box>
        <IconButton onClick={() => onClose && onClose()} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {templateId === 'Create' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Áp dụng cho nhà trọ</Typography>
            <FormControlLabel
              control={<Checkbox checked={true} disabled color="primary" />}
              label={motel ? motel.motelName : 'Đang tải...'}
              sx={{ '& .MuiFormControlLabel-label': { fontWeight: 'bold' } }}
            />
          </Box>
        )}

        <Grid container spacing={3} sx={{ mt: 0, mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tên mẫu tờ khai"
              name="templatename"
              value={formData.templatename || ''}
              onChange={handleInputChange}
              placeholder="vd: Mẫu CT01, Mẫu tạm trú 2024..."
              required
              error={formErrors.templatename}
              helperText={formErrors.templatename ? 'Vui lòng nhập tên mẫu tờ khai' : ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Số thứ tự ưu tiên"
              name="sortOrder"
              value={formData.sortOrder || ''}
              onChange={handleInputChange}
              placeholder="vd: 1, 2, 3..."
              required
              error={formErrors.sortOrder}
              helperText={formErrors.sortOrder ? 'Vui lòng nhập số thứ tự hợp lệ (≥ 1)' : ''}
              inputProps={{ min: 1 }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">Nội dung tờ khai tạm trú</Typography>
          <Button
            variant="outlined"
            component="label"
            size="small"
            startIcon={<UploadFileIcon />}
            sx={{ textTransform: 'none' }}
          >
            Tải file từ máy tính (.docx, .txt, .html)
            <input
              type="file"
              hidden
              accept=".docx,.txt,.html,.htm"
              onChange={handleFileUpload}
            />
          </Button>
        </Box>

        <ResidenceWordEditor
          value={formData.content || ''}
          onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Button onClick={() => onClose && onClose()} variant="outlined" color="inherit" sx={{ mr: 1 }}>
          Đóng
        </Button>
        <Button onClick={handleSave} variant="contained" color="warning" sx={{ color: '#fff' }}>
          {templateId === 'Create' ? 'Tạo mẫu' : 'Lưu cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModelResidenceTemplate
