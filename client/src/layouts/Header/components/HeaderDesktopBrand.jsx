import { Link } from 'react-router-dom'

const HeaderDesktopBrand = ({ onToggleCategory, themeMode, t }) => {
  return (
    <div className="leftWrapperContainerCss aw__l8p27ky" style={{ '--l8p27ky-0': '20%', '--l8p27ky-2': 'unset' }}>
      <div className="aw__l152mft9">
        <Link className="aw__l1l4rfje leftWrapperCss" to="/RRMS" style={{ justifyContent: 'unset' }}>
          <picture>
            <img
              height="35"
              width="188"
              className="aw__ldrazpr"
              src="https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Flogo.png?alt=media&token=719c4675-1dc4-42d2-af36-ec52626519e4"
              alt="Nhà trọ"
            />
          </picture>
        </Link>
      </div>

      <div
        className="aw__cexsh2j"
        onClick={onToggleCategory}
        style={{
          '--cexsh2j-0': 'flex',
          '--cexsh2j-3': 'undefined',
          '--cexsh2j-4': '24px 12px',
          '--cexsh2j-5': 'undefined'
        }}>
        <div className="aw__i8z877t" style={{ '--i8z877t-0': '#8C8C8C', '--i8z877t-6': '#222222' }}>
          <svg
            style={{ color: themeMode === 'light' ? '#212121' : '#E8E8E8' }}
            width="24"
            height="25"
            viewBox="0 0 24 25"
            data-toggle="dropdown"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#header-menu-clip)">
              <path
                d="M4 18.5H20C20.55 18.5 21 18.05 21 17.5C21 16.95 20.55 16.5 20 16.5H4C3.45 16.5 3 16.95 3 17.5C3 18.05 3.45 18.5 4 18.5ZM4 13.5H20C20.55 13.5 21 13.05 21 12.5C21 11.95 20.55 11.5 20 11.5H4C3.45 11.5 3 11.95 3 12.5C3 13.05 3.45 13.5 4 13.5ZM3 7.5C3 8.05 3.45 8.5 4 8.5H20C20.55 8.5 21 8.05 21 7.5C21 6.95 20.55 6.5 20 6.5H4C3.45 6.5 3 6.95 3 7.5Z"
                fill="#222222"></path>
            </g>
            <defs>
              <clipPath id="header-menu-clip">
                <rect width="24" height="24" fill="white" transform="translate(0 0.5)"></rect>
              </clipPath>
            </defs>
          </svg>
          <span className="aw__i1utyhlb" style={{ color: themeMode === 'light' ? '#212121' : '#E8E8E8' }}>
            <span
              className="aw__c19wws31 show-desktop aw__szp9uz0"
              color={themeMode === 'light' ? '#8C8C8C' : '#E8E8E8'}
              style={{
                '--szp9uz0-1': 'inherit',
                '--szp9uz0-9': themeMode === 'light' ? '#8C8C8C' : '#e8e8e8'
              }}>
              {t('danh-muc')}
            </span>
            <svg
              style={{ color: themeMode === 'light' ? '#212121' : '#E8E8E8' }}
              width="1rem"
              height="1rem"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="aw__dtt35j3">
              <path
                d="M4.67154 5.99959C4.9323 5.74067 5.35336 5.74141 5.6132 6.00125L8.19653 8.58458L10.7863 6.00048C11.0461 5.74125 11.4668 5.74148 11.7263 6.00099C11.986 6.26071 11.986 6.68179 11.7263 6.94151L8.90364 9.76414C8.51312 10.1547 7.87995 10.1547 7.48943 9.76414L4.66987 6.94459C4.40872 6.68344 4.40947 6.25981 4.67154 5.99959Z"
                fill="currentColor"></path>
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

export default HeaderDesktopBrand
