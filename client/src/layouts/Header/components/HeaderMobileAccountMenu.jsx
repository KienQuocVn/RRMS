import HeaderUserMenuContent from './HeaderUserMenuContent'

const HeaderMobileAccountMenu = (props) => {
  return (
    <div className="aw__mos124i" style={{ '--mos124i-6': 'calc(100px + var(--app-wrapper-extra-height,   0px))' }}>
      <div className="more-content">
        <HeaderUserMenuContent {...props} mobile />
      </div>
    </div>
  )
}

export default HeaderMobileAccountMenu
