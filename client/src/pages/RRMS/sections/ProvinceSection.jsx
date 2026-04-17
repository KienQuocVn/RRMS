import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

const PROVINCES = [
  { query: 'hcm', label: 'Hồ Chí Minh', bg: './tphcm.jpg' },
  { query: 'hn', label: 'Hà Nội', bg: './ha-noi.jpg' },
  { query: 'bd', label: 'Bình Dương', bg: './bd.jpg' },
  { query: 'ct', label: 'Cần Thơ', bg: './caudibo-cantho.jpg' },
  { query: 'dn', label: 'Đà Nẵng', bg: './da-nang.jpg' },
  { query: 'đn', label: 'Đồng Nai', bg: './dong-nai.jpg' }
]

const ProvinceSection = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <section className="province-search">
      <div className="container">
        <div className="header-item">
          <h2 className="title-section">
            {t('rrms.province.title').split(' / ')[0]} <strong style={{ color: '#4bcffa' }}>/ {t('rrms.province.title').split(' / ')[1]}</strong>
          </h2>
        </div>
        <div className="province-link row">
          {PROVINCES.map(({ query, label, bg }) => (
            <div className="col-md-2 mb-2" key={query} onClick={() => navigate(`/search?query=${query}`)}>
              <Link to="#">
                <div className="item-province ho-chi-minh" style={{ background: `url(${bg})` }}>
                  <div className="info">
                    <span style={{ fontSize: '13px' }}>{t('rrms.province.roomLabel')}</span> <strong>{label}</strong>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProvinceSection
