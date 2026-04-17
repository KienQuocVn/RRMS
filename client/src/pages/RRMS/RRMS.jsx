import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { env } from '~/configs/environment'

import HeaderSection from './sections/HeaderSection'
import MenuHomeSection from './sections/MenuHomeSection'
import PromotionSection from './sections/PromotionSection'
import ProvinceSection from './sections/ProvinceSection'
import NowRoomsSection from './sections/NowRoomsSection'
import DistrictSection from './sections/DistrictSection'
import WardSection from './sections/WardSection'
import LatestRoomsSection from './sections/LatestRoomsSection'
import FooterSection from './sections/FooterSection'

const ITEMS_PER_PAGE = 8
const ITEMS_PER_PAGE_NEW = 4

const RRMS = ({ setIsAdmin }) => {
  const navigate = useNavigate()
  const [nowRooms, setNowRooms] = useState([])    // phòng dọn vào ở ngay (roomNews)
  const [latestRooms, setLatestRooms] = useState([]) // phòng mới nhất (roomVieux)
  const [currentPage, setCurrentPage] = useState(1)

  // Visible slices
  const nowVisible = nowRooms.slice(0, ITEMS_PER_PAGE_NEW)

  const latestStart = (currentPage - 1) * ITEMS_PER_PAGE
  const latestVisible = latestRooms.slice(latestStart, latestStart + ITEMS_PER_PAGE)

  useEffect(() => {
    setIsAdmin(false)
  }, [setIsAdmin])

  useEffect(() => {
    fetchNowRooms()
    fetchLatestRooms()
  }, [])

  const fetchNowRooms = async () => {
    try {
      const { status, data } = await axios.get(`${env.API_URL}/searchs/roomNews`, {
        headers: { 'ngrok-skip-browser-warning': '69420' },
      })
      if (status === 200 && Array.isArray(data.result)) setNowRooms(data.result)
    } catch (err) {
      console.error('Error fetching now rooms:', err)
    }
  }

  const fetchLatestRooms = async () => {
    try {
      const { status, data } = await axios.get(`${env.API_URL}/searchs/roomVieux`, {
        headers: { 'ngrok-skip-browser-warning': '69420' },
      })
      if (status === 200 && Array.isArray(data.result)) setLatestRooms(data.result)
    } catch (err) {
      console.error('Error fetching latest rooms:', err)
    }
  }

  const getLocation = () => {
    if (!navigator.geolocation) return console.error('Geolocation not supported')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => navigate(`/search?lat=${coords.latitude}&lon=${coords.longitude}`),
      (err) => console.error('Error getting location:', err)
    )
  }

  return (
    <div>
      <HeaderSection />
      <MenuHomeSection getLocation={getLocation} />
      <PromotionSection />
      <ProvinceSection />
      <NowRoomsSection
        items={nowVisible}
        totalCount={nowRooms.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={(_, val) => setCurrentPage(val)}
      />
      <DistrictSection />
      <WardSection />
      <LatestRoomsSection
        items={latestVisible}
        totalCount={latestRooms.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={(_, val) => setCurrentPage(val)}
      />
      <FooterSection />
    </div>
  )
}

export default RRMS
