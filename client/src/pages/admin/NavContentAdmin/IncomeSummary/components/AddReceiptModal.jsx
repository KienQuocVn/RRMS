import TransactionFormModal from './TransactionFormModal'

const AddReceiptModal = ({ open, onClose, onSubmit, payments }) => {
  return (
    <TransactionFormModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      payments={payments}
      title="Thêm phiếu thu"
      submitLabel="Thêm phiếu thu"
    />
  )
}

export default AddReceiptModal
