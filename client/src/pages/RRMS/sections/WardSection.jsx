import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { wards_list } from '~/utils/wards_list'

const WardSection = () => {
  const { t } = useTranslation()

  return (
    <section className="ward-section">
      <div className="container">
        <div className="header-item">
          <h2 className="title-section">{t('rrms.ward.title')}</h2>
          <div className="text-right" style={{ flex: 1, textAlign: 'right' }}>
            <button className="view-all" href="#get-filter-data-user" data-toggle="modal" data-target="#get-filter-data-user">
              <span>{t('rrms.ward.viewAll')}</span>
            </button>
          </div>
        </div>
        <div className="wards-list">
          {wards_list.map((ward, i) => (
            <Link key={i} className="wards-item" to={`/search?query=${ward.name}`}>
              {ward.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WardSection
