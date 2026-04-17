import { Pagination } from '@mui/material'
import { useTranslation } from 'react-i18next'
import LoadingPage from '~/components/LoadingPage/LoadingPage'
import { NowRoomCard } from './RoomCard'

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

const NowRoomsSection = ({ items, totalCount, itemsPerPage, currentPage, onPageChange }) => {
  const { t } = useTranslation()

  return (
    <section>
      <div className="container available-posts">
        <div style={{ borderRadius: 10, background: 'linear-gradient(#eef7ff 40%, rgb(238 247 255 / 35%) 50%)', padding: '5px 14px 0px 14px' }}>
          <div className="header-item">
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 0 }}>
              <SectionIcon />
              <h2 className="title-section">
                {t('rrms.now.title')}
                <div className="description">{t('rrms.now.description')}</div>
              </h2>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 26 }}>
          {items.length > 0 ? items.map((item, i) => <NowRoomCard key={i} item={item} />) : <LoadingPage />}
        </div>
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

export default NowRoomsSection
