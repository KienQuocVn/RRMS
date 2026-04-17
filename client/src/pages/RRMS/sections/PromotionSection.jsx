import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const BANNER_SRC = 'https://lozido.com/images/promotion/banner-1-desktop.webp'

const PromotionSection = () => {
  const { t } = useTranslation()
  const bannerAlt = t('rrms.promotion.bannerAlt')

  return (
    <section className="promotion-section">
      <div className="container">
        <div className="header-item">
          <h2 className="title-section">{t('rrms.promotion.title')}</h2>
        </div>
        <div className="row">
          {[...Array(4)].map((_, i) => (
            <div className="col-md-3" key={i}>
              <Link className="item-promotion" target="_blank" to="/" rel="noopener" tabIndex="-1">
                <img width="100%" src={BANNER_SRC} alt={bannerAlt} />
                <div className="title-promotion cut-text-2">{bannerAlt}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PromotionSection
