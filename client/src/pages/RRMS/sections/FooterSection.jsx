import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Pkeyw } from '~/utils/PoKey'

const FooterSection = () => {
  const { t } = useTranslation()

  return (
    <>
      <div className="container bot">
        <div className="flex row" style={{ marginBlock: 15 }}>
          <div className="col-md-6">
            <Link to="#">
              <img src="/banner1.png" alt={t('contactPage.banners.brokerAlt')} width="100%" style={{ borderRadius: 5 }} />
            </Link>
          </div>
          <div className="col-md-6">
            <Link to="#">
              <img src="/banner2.png" alt={t('contactPage.banners.promotionAlt')} width="100%" style={{ borderRadius: 5 }} />
            </Link>
          </div>
        </div>
        <h3 className="title-section">{t('rrms.footer.popularKeywords')}</h3>
        <div
          className="header-footer"
          style={{ marginBottom: 50, border: '0.5px solid #dbdbdb', backgroundColor: '#fff', borderRadius: 5, padding: 15 }}
        >
          <ul
            className="list-link"
            style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}
          >
            {Pkeyw.map((key, i) => (
              <li key={i}>
                <Link to="#" target="_blank" style={{ textDecoration: 'none', color: '#3d3d3d' }}>
                  {key.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center HTPost">
        <h3>{t('rrms.footer.postTitle')}</h3>
        <p className="text-center description">{t('rrms.footer.postDescription')}</p>
      </div>

      <div className="container mb-4">
        <div className="row feature card-benefit">
          {[
            { step: 1, color: 'green', titleKey: 'dang-nhap-dang-ky', descKey: 'dang-ky-sau-do-dang-nhap' },
            { step: 2, color: 'blue', titleKey: 'dang-tin', descKey: 'dang-tin-trong-tai-khoan-ca-nhan' },
            { step: 3, color: 'yellow', titleKey: 'xet-duyet', descKey: 'chuyen-vien-san-sang-tu-van' }
          ].map(({ step, color, titleKey, descKey }) => (
            <div className={`col-md-4 item ${color}`} key={step}>
              <div className="innerRRMS">
                <div className="icon-itemRRMS">
                  <span>{step}</span>
                </div>
                <div className="content-item">
                  <b>{t(titleKey)}</b>
                  <div>{t(descKey)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default FooterSection
