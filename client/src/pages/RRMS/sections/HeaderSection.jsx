import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import FilterSearch from '../../search/FilterSearch'

const SCHOOL_LINKS = [
  { label: 'Trường Cao đẳng Đại Việt Sài Gòn', to: '/thue-phong-tro-gan-truong-cao-dang-dai-viet-sai-gon-id-1569' },
  { label: 'Trường Cao đẳng Du lịch Sài Gòn', to: '/thue-phong-tro-gan-truong-cao-dang-du-lich-sai-gon-id-1568' },
  { label: 'Trường Cao đẳng Công thương TP.HCM', to: '/thue-phong-tro-gan-truong-cao-dang-cong-thuong-tphcm-id-1567' },
  { label: 'Trường Cao đẳng Công nghệ Sài Gòn', to: '/thue-phong-tro-gan-truong-cao-dang-cong-nghe-sai-gon-id-1546' },
  { label: 'Trường Cao đẳng Bình Minh Sài Gòn', to: '/thue-phong-tro-gan-truong-cao-dang-binh-minh-sai-gon-id-1527' },
  { label: 'Trường Cao đẳng Bách khoa Nam Sài Gòn', to: '/thue-phong-tro-gan-truong-cao-dang-bach-khoa-nam-sai-gon-id-1487' },
  { label: 'Trường Cao đẳng bán công Công nghệ và Quản trị doanh nghiệp', to: '/thue-phong-tro-gan-truong-cao-dang-ban-cong-cong-nghe-va-quan-tri-doanh-nghiep-id-1484' },
  { label: 'Trường Đại học Greenwich Việt Nam', to: '/thue-phong-tro-gan-truong-dai-hoc-greenwich-viet-nam-id-1482' },
  { label: 'Trường Kinh doanh Sài Gòn', to: '/thue-phong-tro-gan-truong-kinh-doanh-sai-gon-id-1355' },
  { label: 'Trường Đại học Hoa Sen (HSU)', to: '/thue-phong-tro-gan-truong-dai-hoc-hoa-sen-hsu-id-1311' }
]

const HeaderSection = () => {
  const { t } = useTranslation()
  const typewrites = t('rrms.header.typewrites', { returnObjects: true })

  return (
    <section className="header-home">
      <div className="container">
        <figure id="logo">
          <h1>
            {t('rrms.header.titlePrefix')}{' '}
            <span className="feature" style={{ color: '#FFC107', borderBottom: '3px solid #FFC107' }}>
              {t('rrms.header.titleHighlight')}
            </span>{' '}
            {t('rrms.header.titleSuffix')}
            <br />
            <span className="typewrite" data-period="5000" data-type={JSON.stringify(typewrites)}>
              <span className="wrap">{typewrites[0]}</span>
            </span>
          </h1>
        </figure>
        <section id="search-home">
          <FilterSearch />
          <div id="sugget-special">
            <div className="inner-sugget">
              <p className="text-left">{t('rrms.header.nearbyTitle')}</p>
              <div className="list-special-home">
                <ul className="clearfix">
                  {SCHOOL_LINKS.map(({ label, to }) => (
                    <li key={to}>
                      <Link title={t('rrms.header.schoolLinkTitle', { label })} to={to} className="arena">
                        #{label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

export default HeaderSection
