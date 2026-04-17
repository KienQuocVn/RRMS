import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { formatterAmount } from '~/utils/formatterAmount'

const BookmarkIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export const NowRoomCard = ({ item }) => {
  const { t } = useTranslation()

  return (
    <div className="grid-item" style={{ maxWidth: '280px' }}>
      <article className="i-column" style={{ marginBottom: '14px' }}>
        <Link to={`/detail/${item.bulletinBoardId}`} className="inner-item" style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '150px', borderRadius: '8px' }}>
            <img
              alt={item.address}
              src={item.bulletinBoardImages?.[0]?.imageLink || 'default_image_url.jpg'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              className="lazy"
            />
            <div className="images-count">4</div>
            <div className="bookmark-item bookmark">
              <BookmarkIcon />
            </div>
          </div>
          <div className="read">
            <div className="title cut-text-2" style={{ fontSize: '14px', marginTop: 10 }}>
              <span className="lable-now">{t('rrms.card.now')}</span> {item?.address}
            </div>
            <div className="address cut-text">
              <span className="icon-user-small">
                <UserIcon />
              </span>
              <strong style={{ textTransform: 'capitalize', paddingLeft: '5px' }}>{item.account.username}</strong>
              <span className="zone" style={{ fontSize: '11px' }}>
                {' '}
                {item?.title}
              </span>
            </div>
          </div>
          <div className="info" style={{ flexDirection: 'row', justifyContent: 'space-between', display: 'flex', padding: '5px' }}>
            <b className="text-danger">
              {formatterAmount(item.rentPrice)} /{t('rrms.card.month')}
            </b>
            <div className="i area" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <b>{item?.area}</b> m²
            </div>
          </div>
        </Link>
      </article>
    </div>
  )
}

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

export const LatestRoomCard = ({ room }) => {
  const { t } = useTranslation()

  return (
    <article className="item col-xs-12 col-md-12 col-lg-6">
      <div className="inner-item flex">
        <section className="list-img" style={{ width: '36%' }}>
          <div style={{ position: 'relative', height: '100%' }}>
            <Link
              style={{ display: 'block', width: '100%', maxHeight: '205px', overflow: 'hidden', height: '100%' }}
              title={room.title}
              to={`/detail/${room.bulletinBoardId}`}
              className="is-adss"
            >
              <img alt={room.title} src={room.bulletinBoardImages?.[0]?.imageLink || 'default_image_url.jpg'} className="lazy" />
            </Link>
            <div className="images-count">3</div>
            <div className="bookmark-item bookmark">
              <BookmarkIcon />
            </div>
          </div>
        </section>
        <section className="list-info" style={{ width: '64%' }}>
          <div>
            <div className="title">
              <Link title={room.title} to={`/detail/${room.bulletinBoardId}`} className="cut-text-2" style={{ textDecoration: 'none', color: 'black' }}>
                <span>{room.title}</span>
              </Link>
            </div>
            <div className="adress cut-text">
              <PinIcon /> {room.address}
            </div>
            <div className="mf">
              <div className="i price">
                <b className="text-danger">{formatterAmount(room.rentPrice)}</b>
              </div>
              <div className="i are">
                <b> {room.area} m²</b>
              </div>
            </div>
          </div>
          <div className="author">
            <div className="i info-author">
              <img width="30px" src="/default-user.webp" alt="icon user" />
              <div style={{ color: '#666', fontSize: '12px' }}>
                <strong className="author-name" style={{ textTransform: 'capitalize' }}>
                  {room.account.username}
                </strong>
                <div style={{ fontSize: '11px' }}>{t('rrms.card.dayAgo')}</div>
              </div>
            </div>
            <div className="i info-author">
              <Link rel="nofollow, noindex" to={`/detail/${room.bulletinBoardId}`} className="btn-quick-zalo" style={{ textDecoration: 'none' }}>
                Zalo
              </Link>
              <span className="btn-quick-call">
                <PhoneIcon />
                <span>{t('rrms.card.viewPhone')}</span>
              </span>
            </div>
          </div>
        </section>
      </div>
    </article>
  )
}
