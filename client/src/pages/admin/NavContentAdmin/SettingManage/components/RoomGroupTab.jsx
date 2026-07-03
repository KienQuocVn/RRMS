import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const initialItems = [{ id: '1', name: 'Tầng trệt' }];

const RoomGroupTab = () => {
  const [items, setItems] = useState(initialItems);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setItems(reorderedItems);
  };

  const addItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      { id: Date.now().toString(), name: `Nhóm mới ${prevItems.length + 1}` }
    ]);
  };

  const handleDelete = (event, id) => {
    event.stopPropagation();
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 4,
              height: 50,
              borderRadius: 999,
              bgcolor: '#20a9e7',
              mt: 0.5
            }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 28, md: 34 },
                lineHeight: 1.2,
                fontWeight: 700,
                color: '#101828'
              }}
            >
              Gom nhóm phòng để dễ quản lý
            </Typography>
            <Typography sx={{ mt: 0.75, color: '#475467', fontSize: 16 }}>
              Bạn có thể nhóm danh sách phòng theo nhóm để phân biệt Khu/Tầng/Dãy
            </Typography>
            <Typography sx={{ mt: 0.5, color: '#ef4444', fontSize: 14, fontStyle: 'italic' }}>
              * Nhấp và kéo để xếp vị trí của nhóm
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={addItem}
          aria-label="Thêm nhóm phòng"
          sx={{
            width: 62,
            height: 62,
            borderRadius: '50%',
            bgcolor: '#20a9e7',
            color: '#fff',
            '&:hover': {
              bgcolor: '#2b7ed7'
            }
          }}
        >
          <AddIcon sx={{ fontSize: 34 }} />
        </IconButton>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          overflow: 'hidden',
          borderRadius: 1.5,
          borderColor: '#d9e2ec',
          boxShadow: 'none'
        }}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="room-group-list">
            {(provided) => (
              <Table {...provided.droppableProps} ref={provided.innerRef}>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ width: 52, borderColor: '#d9e2ec' }} />
                    <TableCell
                      align="center"
                      sx={{
                        borderColor: '#d9e2ec',
                        color: '#101828',
                        fontSize: 16,
                        fontWeight: 600
                      }}
                    >
                      Tên nhóm
                    </TableCell>
                    <TableCell sx={{ width: 74, bgcolor: '#edf4ff', borderColor: '#d9e2ec' }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(dragProvided) => (
                        <TableRow
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          sx={{
                            '& td': {
                              borderColor: '#d9e2ec',
                              py: 2.25
                            }
                          }}
                          style={dragProvided.draggableProps.style}
                        >
                          <TableCell
                            {...dragProvided.dragHandleProps}
                            align="center"
                            sx={{ cursor: 'grab' }}
                          >
                            <DragHandleIcon sx={{ color: '#667085', fontSize: 34 }} />
                          </TableCell>
                          <TableCell sx={{ color: '#344054', fontSize: 18 }}>
                            {item.name}
                          </TableCell>
                          <TableCell align="center" sx={{ bgcolor: '#edf4ff' }}>
                            <IconButton
                              onClick={(event) => handleDelete(event, item.id)}
                              aria-label={`Xóa ${item.name}`}
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                bgcolor: '#ef4444',
                                color: '#fff',
                                '&:hover': {
                                  bgcolor: '#dc2626'
                                }
                              }}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </Paper>
    </Box>
  );
};

export default RoomGroupTab;
