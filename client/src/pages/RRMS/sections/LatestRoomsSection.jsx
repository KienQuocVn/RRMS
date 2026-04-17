import { Pagination } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import LoadingPage from '~/components/LoadingPage/LoadingPage'
import { LatestRoomCard } from './RoomCard'

const SectionIcon = () => (
  <div
    style={{
      width: 45,
      height: 45,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffebd5',
      borderRadius: '100%',
      marginRight: 10
    }}
  >
    <img src="/feature_icon.webp" alt="icon lịch" style={{ width: 30, height: 30 }} />
  </div>
)

const LatestRoomsSection = ({ items, totalCount, itemsPerPage, currentPage, onPageChange }) => {
  const { t } = useTranslation()

  return (
    <section>
      <div className="container section-posts">
        <div className="header-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: -5 }}>
              <SectionIcon />
              <h2 className="title-section">
                {t('rrms.latest.title')}
                <div className="description">{t('rrms.latest.description')}</div>
              </h2>
            </div>
            <div className="text-right" style={{ flex: 1, textAlign: 'right' }}>
              <Link to="/thue-phong-tro-quan-1-id-760/ho-chi-minh-id-79">
                <span>{t('rrms.latest.moreAtDistrict', { district: 'Quận 1' })}</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="list-6 row">{items.length > 0 ? items.map((room, i) => <LatestRoomCard key={i} room={room} />) : <LoadingPage />}</div>
      </div>
      <Pagination
        count={Math.ceil(totalCount / itemsPerPage)}
        page={currentPage}
        onChange={onPageChange}
        variant="outlined"
        color="primary"
        sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
      />
    </section>
  )
}

export default LatestRoomsSection
