/* eslint-disable react-hooks/exhaustive-deps */
import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Typography, IconButton, Box, FormControlLabel, Checkbox } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'

import Swal from 'sweetalert2'
import { createContractTemplate, getContractTemplateById, updateContractTemplate } from '~/apis/contractTemplateAPI'

import { env } from '~/configs/environment'
import { getNonNegativeNumberFieldProps, isNegativeNumberValue } from '~/utils/numberInputUtils'

const ModelDeposit = ({ motel, username, templatecontractRouteId, fetchDataTemlateContract, onClose }) => {
  const editorRef = useRef()
  const [templatecontracts, setTemplatecontracts] = useState({
    contractTemplateId: '',
    motelId: '',
    namecontract: '',
    templatename: '',
    sortOrder: '',
    content: ''
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (templatecontractRouteId !== 'Create') {
      fetchDataWhenEdit(templatecontractRouteId)
    } else {
      setTemplatecontracts({
        contractTemplateId: '',
        motelId: '',
        namecontract: '',
        templatename: '',
        sortOrder: '',
        content: ''
      })
    }
  }, [templatecontractRouteId])

  const fetchDataWhenEdit = async (id) => {
    if (username) {
      try {
        const response = await getContractTemplateById(id)
        if (response) {
          setTemplatecontracts(response)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    if (type === 'number' && isNegativeNumberValue(value)) return
    setTemplatecontracts((prev) => ({
      ...prev,
      [name]: value
    }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: false }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!templatecontracts.templatename) errors.templatename = true
    if (!templatecontracts.namecontract) errors.namecontract = true
    if (!templatecontracts.sortOrder) errors.sortOrder = true
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSaveTemplate = (event) => {
    if (!validateForm()) {
      return
    }

    if (username) {
      if (editorRef.current) {
        const content = editorRef.current.getContent()

        const contractTemplate = {
          motelId: motel?.motelId,
          namecontract: templatecontracts.namecontract,
          templatename: templatecontracts.templatename,
          sortOrder: parseInt(templatecontracts.sortOrder, 10),
          content: content
        }

        if (templatecontractRouteId === 'Create') {
          createContractTemplate(contractTemplate)
            .then((response) => {
              Swal.fire({
                icon: 'success',
                title: 'Thông báo',
                text: 'Tạo mẫu hợp đồng thành công!'
              })
              fetchDataTemlateContract()
              onClose()
            })
            .catch((error) => {
              Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Lỗi tạo mẫu hợp đồng.'
              })
            })
        } else {
          updateContractTemplate(templatecontractRouteId, contractTemplate)
            .then((response) => {
              Swal.fire({
                icon: 'success',
                title: 'Thông báo',
                text: 'Cập nhật mẫu hợp đồng thành công!'
              })
              fetchDataTemlateContract()
              onClose()
            })
            .catch((error) => {
              Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Lỗi cập nhật mẫu hợp đồng.'
              })
            })
        }
      }
    }
  }

  return (
    <Dialog 
      open={true} 
      onClose={onClose} 
      fullWidth 
      maxWidth="lg" 
      scroll="paper"
      PaperProps={{
        sx: { minHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2, borderBottom: '1px solid #eee' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ bgcolor: 'primary.light', color: 'primary.main', p: 1, borderRadius: '50%', display: 'flex' }}>
            <DescriptionOutlinedIcon />
          </Box>
          <Typography variant="h6" fontWeight="bold">
            {templatecontractRouteId === 'Create' ? 'Tạo mẫu hợp đồng mới' : 'Chỉnh sửa mẫu hợp đồng'}
          </Typography>
        </Box>
        <IconButton onClick={() => onClose && onClose()} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {templatecontractRouteId === 'Create' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Chọn nhà trọ</Typography>
            <FormControlLabel
              control={<Checkbox checked={true} disabled color="primary" />}
              label={motel ? motel.motelName : 'Đang tải...'}
              sx={{ '& .MuiFormControlLabel-label': { fontWeight: 'bold' } }}
            />
          </Box>
        )}

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Tên mẫu hợp đồng"
              name="templatename"
              value={templatecontracts.templatename || ''}
              onChange={handleInputChange}
              placeholder="vd: Mẫu 1, Mẫu 2..."
              required
              error={formErrors.templatename}
              helperText={formErrors.templatename ? "Vui lòng nhập tên mẫu hợp đồng" : ""}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Số thứ tự ưu tiên"
              name="sortOrder"
              value={templatecontracts.sortOrder || ''}
              onChange={handleInputChange}
              placeholder="vd:1,2,3..."
              required
              error={formErrors.sortOrder}
              helperText={formErrors.sortOrder ? "Vui lòng nhập số thứ tự" : ""}
              {...getNonNegativeNumberFieldProps()}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Tên hợp đồng"
              name="namecontract"
              value={templatecontracts.namecontract || ''}
              onChange={handleInputChange}
              placeholder="HỢP ĐỒNG CHO THUÊ PHÒNG TRỌ ..."
              required
              error={formErrors.namecontract}
              helperText={formErrors.namecontract ? "Vui lòng nhập tên hợp đồng" : ""}
            />
          </Grid>
        </Grid>

        <Editor
          apiKey={env.TINY_API_KEY}
          onEditorChange={(evt, editor) => {
            editorRef.current = editor
          }}
          init={{
            plugins: [
              'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 
              'searchreplace', 'table', 'visualblocks', 'wordcount', 'checklist', 'mediaembed', 'casechange', 
              'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 
              'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 
              'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown'
            ],
            toolbar:
              'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            tinycomments_mode: 'embedded',
            tinycomments_author: 'Author name',
            mergetags_list: [
              { value: 'First.Name', title: 'First Name' },
              { value: 'Email', title: 'Email' }
            ],
            height: '600px',
            ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant'))
          }}
          initialValue={templatecontracts.content || ''}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Button onClick={() => onClose && onClose()} variant="outlined" color="inherit" sx={{ mr: 1 }}>
          Đóng
        </Button>
        <Button onClick={onSaveTemplate} variant="contained" color="primary">
          {templatecontractRouteId === 'Create' ? 'Tạo mẫu' : 'Lưu cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModelDeposit
