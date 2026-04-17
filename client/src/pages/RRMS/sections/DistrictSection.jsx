import 'swiper/css'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { sliderSettings } from '~/utils/common.js'
import { data } from '~/utils/slider'

const SliderButtons = () => {
  const swiper = useSwiper()
  return (
    <div className="r-buttons d-none d-md-block" style={{ position: 'absolute', top: 16, right: 205 }}>
      <button onClick={() => swiper.slidePrev()}>&lt;</button>
      <button onClick={() => swiper.slideNext()}>&gt;</button>
    </div>
  )
}

const DistrictCard = ({ card, onClick }) => (
  <div className="col-md-3 mb-2" onClick={onClick}>
    <Link className="item-district small" style={{ backgroundImage: `url(${card.image})`, backgroundSize: 'cover' }} to="#">
      <div className="info">
        <span>{card.name}</span>
        <span>
          <strong style={{ paddingLeft: 7 }}>{card.district}</strong>
        </span>
        <div style={{ fontSize: 13 }}>{card.detail}</div>
      </div>
    </Link>
  </div>
)

const DistrictSection = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const renderCards = (cards, start, end) =>
    cards.slice(start, end).filter(Boolean).map((card, i) => (
      <DistrictCard key={i} card={card} onClick={() => navigate(`/search?query=${card.district}`)} />
    ))

  return (
    <section className="district-search" style={{ position: 'relative' }}>
      <div className="container">
        <div className="header-item">
          <h2 className="title-section">{t('rrms.district.title')}</h2>
          <div className="text-right" style={{ flex: 1, textAlign: 'right' }} />
        </div>
        <div className="district-link">
          <Swiper {...sliderSettings} style={{ position: 'unset' }}>
            <SliderButtons />
            {data.map((districtItem, i) => (
              <SwiperSlide key={i}>
                <div className="item" style={{ marginRight: 10 }}>
                  <div className="row">
                    <div className="col-md-3 mb-2">
                      {districtItem.cards[0] && (
                        <div onClick={() => navigate(`/search?query=${districtItem.cards[0].district}`)}>
                          <Link
                            className="item-district large bg-danger"
                            style={{ backgroundImage: `url(${districtItem.cards[0].image})`, backgroundSize: 'cover' }}
                            title={t('rrms.district.cardTitle', { district: districtItem.cards[0].district })}
                          >
                            <div className="info">
                              <span>{districtItem.cards[0].name}</span>
                              <span>
                                <strong style={{ paddingLeft: 7 }}>{districtItem.cards[0].district}</strong>
                              </span>
                              <div style={{ fontSize: 13 }}>{districtItem.cards[0].detail}</div>
                            </div>
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="col-md-8">
                      <div className="row">{renderCards(districtItem.cards, 1, 4)}</div>
                      <div className="row" style={{ marginTop: 14 }}>
                        {renderCards(districtItem.cards, 4, 7)}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}

export default DistrictSection
