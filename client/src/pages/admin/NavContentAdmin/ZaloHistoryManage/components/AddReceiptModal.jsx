import TransactionFormModal from './TransactionFormModal'

const AddReceiptModal = ({ open, onClose, onSubmit, historyItem }) => {
  return (
    <TransactionFormModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      historyItem={historyItem}
      title="Thêm phiếu thu"
      submitLabel="Thêm phiếu thu"
      defaultCategory="Thu tiền hóa đơn qua Zalo"
    />
  )
}

export default AddReceiptModal
