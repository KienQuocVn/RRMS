import TransactionFormModal from './TransactionFormModal'

const AddExpenseModal = ({ open, onClose, onSubmit, historyItem }) => {
  return (
    <TransactionFormModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      historyItem={historyItem}
      title="Thêm phiếu chi"
      submitLabel="Thêm phiếu chi"
      defaultCategory="Chi phí xử lý gửi Zalo"
    />
  )
}

export default AddExpenseModal
