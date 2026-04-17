import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const HOT_BADGE = {
  animationName: 'pulse_zalo',
  animationDuration: '1s',
  animationFillMode: 'both',
  animationIterationCount: 'infinite',
  backgroundColor: 'red',
  borderRadius: '5px',
  color: '#fff',
  position: 'absolute',
  top: '-5px',
  right: '-20px',
  fontSize: '12px',
  padding: '0px 5px'
}

const MenuHomeSection = ({ getLocation }) => {
  const { t } = useTranslation()

  return (
    <section id="menu-home">
      <div className="contaienr">
        <div className="container-menu-home">
          <div className="row">
            <div className="col">
              <Link to="#" onClick={getLocation} className="item">
                <picture className="webpimg-container">
                  <img src="/pin2.png" width="85%" alt={t('rrms.menu.nearMeTitle')} />
                </picture>
                <strong>{t('rrms.menu.nearMeTitle')}</strong>
                <div>{t('rrms.menu.nearMeDescription')}</div>
              </Link>
            </div>
            <div className="col">
              <Link to="/support" className="item">
                <picture className="webpimg-container">
                  <img src="/hot.png" width="100%" alt={t('rrms.menu.supportTitle')} />
                </picture>
                <strong>{t('rrms.menu.supportTitle')}</strong>
                <div>{t('rrms.menu.supportDescription')}</div>
              </Link>
            </div>
            <div className="col">
              <Link to="/tra-cuu-hoa-don.html" className="item">
                <picture className="webpimg-container">
                  <img src="/bill.png" width="85%" alt={t('rrms.menu.billTitle')} />
                </picture>
                <strong>{t('rrms.menu.billTitle')}</strong>
                <div>{t('rrms.menu.billDescription')}</div>
              </Link>
            </div>
            <div className="col">
              <Link to="/doi-gas-uu-dai.html" className="item">
                <picture className="webpimg-container">
                  <img src="/icons8-gas-100.png" width="100%" alt={t('rrms.menu.gasTitle')} />
                </picture>
                <strong>{t('rrms.menu.gasTitle')}</strong>
                <div>{t('rrms.menu.gasDescription')}</div>
              </Link>
            </div>
            <div className="col">
              <Link to="/tro-thanh-moi-gioi-RRMS.html" className="item">
                <picture className="webpimg-container">
                  <img src="/sale-house.png" width="100%" alt={t('rrms.menu.brokerTitle')} />
                  <span style={HOT_BADGE}>{t('rrms.menu.hot')}</span>
                </picture>
                <strong>{t('rrms.menu.brokerTitle')}</strong>
                <div>{t('rrms.menu.brokerDescription')}</div>
              </Link>
            </div>
            <div className="col">
              <Link to="https://quanlytro.me/ung-dung-quan-ly-phong-tro.html" target="_blank" className="item col-sx-3">
                <picture className="webpimg-container">
                  <img src="/owner.png" width="85%" alt={t('rrms.menu.ownerTitle')} />
                  <span style={HOT_BADGE}>{t('rrms.menu.pro')}</span>
                </picture>
                <strong>{t('rrms.menu.ownerTitle')}</strong>
                <div>{t('rrms.menu.ownerDescription')}</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MenuHomeSection
