import { useState } from 'react';
import { FilterTab, Room } from '@/types/deposit.types';

const MOCK_ROOMS: Room[] = [
  { id: '1', title: 'Phòng 1', price: '3.000.000', status: 'empty' },
  { id: '2', title: 'Phòng 2', price: '3.000.000', status: 'empty' },
  { id: '3', title: 'Phòng 3', price: '3.000.000', status: 'empty' },
];

export function useDeposit() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchText, setSearchText] = useState('');
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);

  // Lọc phòng theo search text
  const filteredRooms = rooms.filter(room => 
    room.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return {
    activeFilter,
    setActiveFilter,
    searchText,
    setSearchText,
    rooms: filteredRooms,
  };
}
