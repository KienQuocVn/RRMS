import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Alert,
  AlertTitle
} from '@mui/material';
import Swal from 'sweetalert2';
import { getRoomById } from '~/apis/roomAPI';
import { getContractByIdRoom2, endContractByRoomId } from '~/apis/contractTemplateAPI';
import { Colors } from '~/theme';

const BASE_TASKS = [
  {
    id: 1,
    title: 'Lập hóa đơn tháng cuối',
    description:
      'Hệ thống phát hiện bạn chưa tạo hóa đơn tháng cuối. Vui lòng tạo và thu hóa đơn tháng cuối trước khi kết thúc hợp đồng',
  },
  {
    id: 2,
    title: 'Kiểm tra tài sản',
    description: 'Kiểm tra lại tài sản, thiết bị trong trước khi kết thúc hợp đồng',
  },
];

const startOfDay = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

const formatDisplayDate = (value) => {
  const date = startOfDay(value);
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getMonthsBetween = (fromDate, toDate) => {
  const start = startOfDay(fromDate);
  const end = startOfDay(toDate);
  if (!start || !end) return 0;
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months -= 1;
  return Math.max(0, months);
};

const getContractMoveInDate = (contract) => contract?.moveinDate || contract?.moveInDate || null;

const getContractEndDate = (contract) => {
  if (!contract) return null;

  if (contract.closeContract) {
    return startOfDay(contract.closeContract);
  }

  const moveInDate = getContractMoveInDate(contract);
  const leaseTermMonths = Number(contract.leaseTerm);
  if (!moveInDate || !leaseTermMonths || Number.isNaN(leaseTermMonths)) {
    return null;
  }

  const endDate = new Date(moveInDate);
  endDate.setMonth(endDate.getMonth() + leaseTermMonths);
  return startOfDay(endDate);
};

const getContractTermMonths = (contract) => {
  const leaseTermMonths = Number(contract?.leaseTerm);
  if (leaseTermMonths && !Number.isNaN(leaseTermMonths)) {
    return leaseTermMonths;
  }

  const moveInDate = getContractMoveInDate(contract);
  const endDate = getContractEndDate(contract);
  if (moveInDate && endDate) {
    return getMonthsBetween(moveInDate, endDate);
  }

  return 0;
};

/** Kết thúc trước ngày hết hạn hợp đồng → cần xác nhận đền hợp đồng */
const isEarlyContractTermination = (contract, terminateDateStr) => {
  const endDate = getContractEndDate(contract);
  const terminateDate = startOfDay(terminateDateStr);
  if (!endDate || !terminateDate) return false;
  return terminateDate < endDate;
};

const buildEarlyTerminationTask = (contract, terminateDateStr) => {
  const moveInDate = getContractMoveInDate(contract);
  const endDate = getContractEndDate(contract);
  const totalMonths = getContractTermMonths(contract);
  const stayedMonths = moveInDate ? getMonthsBetween(moveInDate, terminateDateStr) : 0;
  const remainingMonths = Math.max(0, totalMonths - stayedMonths);

  const termLabel = totalMonths > 0 ? `${totalMonths} tháng` : 'theo thỏa thuận';
  const stayedLabel = stayedMonths > 0 ? `${stayedMonths} tháng` : 'chưa đủ 1 tháng';
  const remainingLabel =
    remainingMonths > 0 ? `${remainingMonths} tháng` : 'dưới 1 tháng';

  return {
    id: 3,
    title: 'Xác nhận thời hạn còn lại của hợp đồng',
    description: [
      `Hợp đồng có thời hạn ${termLabel}${endDate ? ` (đến ${formatDisplayDate(endDate)})` : ''}.`,
      `Khách đã ở khoảng ${stayedLabel}, còn khoảng ${remainingLabel} chưa hết hạn.`,
      'Việc kết thúc trước hạn có thể phát sinh nghĩa vụ đền hợp đồng hoặc bồi thường theo thỏa thuận giữa khách thuê và chủ trọ.',
      'Vui lòng thông báo, thống nhất và xác nhận đã lưu ý nội dung này trước khi kết thúc hợp đồng.',
    ].join(' '),
    isEarlyTermination: true,
  };
};

function ModalEndContract({ toggleModal, modalOpen, roomId, onSuccess }) {
  const [room, setRoom] = useState({});
  const [contract, setContract] = useState({});
  const [dateTerminate, setDateTerminate] = useState('');
  const [completedTaskIds, setCompletedTaskIds] = useState(() => new Set());

  const showEarlyTerminationTask = useMemo(
    () => isEarlyContractTermination(contract, dateTerminate),
    [contract, dateTerminate]
  );

  const earlyTerminationInfo = useMemo(() => {
    if (!showEarlyTerminationTask) return null;
    const moveInDate = getContractMoveInDate(contract);
    const endDate = getContractEndDate(contract);
    const totalMonths = getContractTermMonths(contract);
    const stayedMonths = moveInDate ? getMonthsBetween(moveInDate, dateTerminate) : 0;
    const remainingMonths = Math.max(0, totalMonths - stayedMonths);
    return { totalMonths, stayedMonths, remainingMonths, endDate, moveInDate };
  }, [contract, dateTerminate, showEarlyTerminationTask]);

  const tasks = useMemo(() => {
    const taskList = BASE_TASKS.map((task) => ({
      ...task,
      completed: completedTaskIds.has(task.id),
    }));

    if (showEarlyTerminationTask) {
      taskList.push({
        ...buildEarlyTerminationTask(contract, dateTerminate),
        completed: completedTaskIds.has(3),
      });
    }

    return taskList;
  }, [contract, dateTerminate, completedTaskIds, showEarlyTerminationTask]);

  const completedTasks = tasks.filter((task) => task.completed).length;

  const handleTaskComplete = useCallback((id) => {
    setCompletedTaskIds((prev) => new Set(prev).add(id));
  }, []);

  useEffect(() => {
    if (modalOpen) {
      setCompletedTaskIds(new Set());
    }
  }, [modalOpen]);

  const fetchDataRoom = async (roomId) => {
    if (roomId) {
      try {
        const response = await getRoomById(roomId);
        if (response) {
          setRoom(response);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchDataContract = async (roomId) => {
    if (roomId) {
      try {
        const response = await getContractByIdRoom2(roomId);
        if (response) {
          setContract(response);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Change to YYYY-MM-DD for input type="date"
  };

  useEffect(() => {
    const handlFristData = () => {
      if (roomId) {
        fetchDataRoom(roomId);
        fetchDataContract(roomId);
      }
    };
    handlFristData();
  }, [roomId]);

  useEffect(() => {
    const today = new Date();
    setDateTerminate(formatDate(today));
  }, []);

  const handleDateChange = (e) => {
    setDateTerminate(e.target.value);
  };

  const handleSubmit = async () => {
    const allTasksCompleted = tasks.every((task) => task.completed);
    if (!allTasksCompleted) {
      Swal.fire({
        icon: 'warning',
        title: 'Công việc chưa hoàn thành!',
        text: 'Vui lòng hoàn thành tất cả các công việc trước khi kết thúc hợp đồng.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#20a9e7'
      });
      return;
    }

    if (roomId) {
      try {
        await endContractByRoomId(roomId, dateTerminate);

        Swal.fire({
          icon: 'success',
          title: 'Kết thúc thành công!',
          text: 'Hợp đồng đã được kết thúc thành công.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#20a9e7'
        });

        if (typeof onSuccess === 'function') await onSuccess();
        toggleModal();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Kết thúc thất bại!',
          text: error.message || 'Có lỗi xảy ra khi kết thúc hợp đồng.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#20a9e7'
        });
      }
    }
  };

  if (!room || !contract) return null;

  return (
    <Dialog open={modalOpen} onClose={toggleModal} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee', color: '#333' }}>
        Kết thúc hợp đồng - {room.name || 'Không có thông tin'}
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ mb: 3, mt: 1 }}>
          <TextField
            fullWidth
            label="Ngày kết thúc hợp đồng"
            type="date"
            value={dateTerminate}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: '#20a9e7' },
              },
              '& label.Mui-focused': { color: '#20a9e7' }
            }}
          />
        </Box>

        <Alert severity="info" sx={{ mb: 4, '& .MuiAlert-icon': { color: '#20a9e7' } }}>
          <AlertTitle sx={{ fontWeight: 'bold' }}>Thông tin:</AlertTitle>
          <Box component="ul" sx={{ m: 0, pl: 2, '& li': { mb: 0.5 } }}>
            <li>Kết thúc hợp đồng là hành động kết thúc khi khách muốn chuyển đi. Sau khi kết thúc bạn có thể Lập hợp đồng cho khách mới</li>
            <li>Các thông tin như <b>Khách thuê, hợp đồng cũ</b> sẽ xóa bỏ để sẵn sàng cho hợp đồng mới.</li>
          </Box>
        </Alert>

        {showEarlyTerminationTask && earlyTerminationInfo && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle sx={{ fontWeight: 'bold' }}>Lưu ý đền hợp đồng</AlertTitle>
            Hợp đồng còn khoảng{' '}
            <b>
              {earlyTerminationInfo.remainingMonths > 0
                ? `${earlyTerminationInfo.remainingMonths} tháng`
                : 'dưới 1 tháng'}
            </b>{' '}
            chưa hết hạn
            {earlyTerminationInfo.endDate
              ? ` (ngày kết thúc dự kiến: ${formatDisplayDate(earlyTerminationInfo.endDate)})`
              : ''}
            . Kết thúc trước hạn có thể phát sinh nghĩa vụ đền hợp đồng — vui lòng thông báo và thống nhất với khách thuê/chủ trọ
            trước khi tiếp tục.
          </Alert>
        )}

        <Box>
          <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold', color: '#444', fontSize: '1.1rem' }}>
            Công việc cần làm trước khi kết thúc hợp đồng ({completedTasks}/{tasks.length})
          </Typography>
          {tasks.map((task) => (
            <Box
              key={task.id}
              sx={{
                display: 'flex',
                mb: 2,
                p: 2,
                border: `1px solid ${task.isEarlyTermination ? '#ffcc80' : '#eee'}`,
                borderRadius: '8px',
                bgcolor: task.completed ? '#f9f9f9' : task.isEarlyTermination ? '#fff8e1' : '#fff',
              }}
            >
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: task.completed ? '#e8f5e9' : task.isEarlyTermination ? '#ffe0b2' : '#fff3e0',
                    color: task.completed ? Colors.success : task.isEarlyTermination ? '#e65100' : '#ff9800',
                  }}
                >
                  {task.completed ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  )}
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>{task.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{task.description}</Typography>
                <Button
                  fullWidth
                  variant={task.completed ? "outlined" : "contained"}
                  disabled={task.completed}
                  onClick={() => handleTaskComplete(task.id)}
                  sx={{
                    bgcolor: task.completed ? 'transparent' : '#20a9e7',
                    color: task.completed ? '#aaa' : '#fff',
                    borderColor: task.completed ? '#ddd' : 'transparent',
                    '&:hover': {
                      bgcolor: task.completed ? 'transparent' : '#1988bd'
                    },
                    textTransform: 'none'
                  }}
                >
                  {task.completed ? 'Đã hoàn thành' : task.isEarlyTermination ? 'Đã xác nhận và lưu ý' : 'Hoàn thành công việc'}
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Button onClick={toggleModal} sx={{ color: '#666', textTransform: 'none' }}>
          Đóng
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ bgcolor: '#20a9e7', '&:hover': { bgcolor: '#1988bd' }, textTransform: 'none' }}
        >
          Kết thúc
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalEndContract;
