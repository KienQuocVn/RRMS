import TransactionFormModal from './TransactionFormModal'

const AddExpenseModal = ({ open, onClose, onSubmit, payments }) => {
  return (
    <TransactionFormModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      payments={payments}
      title="Thêm phiếu chi"
      submitLabel="Thêm phiếu chi"
    />
  )
}

export default AddExpenseModal
