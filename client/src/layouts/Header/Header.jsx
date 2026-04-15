import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import { env } from '~/configs/environment'
import WarningEmailNotExits from './WarningEmailNotExits'
import './Header.css'
import HeaderCategoryMenu from './components/HeaderCategoryMenu'
import HeaderDesktopAccountMenu from './components/HeaderDesktopAccountMenu'
import HeaderDesktopActions from './components/HeaderDesktopActions'
import HeaderDesktopBrand from './components/HeaderDesktopBrand'
import HeaderManageButton from './components/HeaderManageButton'
import HeaderMobileAccountMenu from './components/HeaderMobileAccountMenu'
import HeaderMobileBottomNav from './components/HeaderMobileBottomNav'
import HeaderMobileSearch from './components/HeaderMobileSearch'
import HeaderNotificationPanel from './components/HeaderNotificationPanel'
import HeaderSearchBar from './components/HeaderSearchBar'
import HeaderTopStrip from './components/HeaderTopStrip'

const Header = ({ username, avatar, setUsername, setAvatar, setToken, toggleLanguage, currentLanguage, motelId, account }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isSearchTypeOpen, setIsSearchTypeOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState()
  const navigate = useNavigate()
  const theme = useTheme()
  const { t } = useTranslation()
  const themeMode = theme.palette.mode
  const tokenExists = sessionStorage.getItem('user') !== null

  const closeMenus = () => {
    setIsAccountOpen(false)
    setIsMobileAccountOpen(false)
  }

  const handleLogout = async () => {
    closeMenus()
    const token = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).token : null

    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Thông báo',
        text: 'Không tìm thấy token, vui lòng đăng nhập lại.'
      })
      return
    }

    try {
      const response = await fetch(`${env.API_URL}/authen/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ token })
      })

      if (response.ok) {
        sessionStorage.removeItem('user')
        setToken(null)
        setUsername('')
        setAvatar('')
        navigate('/login')
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đăng xuất thành công!'
        })
        return
      }

      const errorData = await response.json()
      Swal.fire({
        icon: 'error',
        title: 'Đăng xuất thất bại',
        text: `Lỗi: ${errorData.message}`
      })
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng xuất:', error)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Đã xảy ra lỗi khi thực hiện đăng xuất.'
      })
    }
  }

  const handleSearch = () => {
    navigate('/search', { state: { searchKeyWord: searchKeyword } })
  }

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value)
  }

  return (
    <header>
      <HeaderTopStrip t={t} themeMode={themeMode} />

      <header
        className="ct-appwrapper aw__h5101fz"
        style={{
          '--h5101fz-0': '#fff',
          '--h5101fz-2': 'calc(40px + var(--app-wrapper-extra-height,   0px))',
          '--h5101fz-5': '100'
        }}>
        <div className="aw__co22znp">
          <HeaderDesktopBrand onToggleCategory={() => setIsCategoryOpen((prev) => !prev)} themeMode={themeMode} t={t} />

          <div className="aw__c1fkdta0">
            <div className="aw__s1wdsl35">
              <div>
                <HeaderSearchBar
                  isOpen={isSearchTypeOpen}
                  onToggle={() => setIsSearchTypeOpen((prev) => !prev)}
                  onSearch={handleSearch}
                  onSearchChange={handleSearchChange}
                  themeMode={themeMode}
                  t={t}
                />
              </div>
            </div>
          </div>

          <HeaderDesktopActions
            currentLanguage={currentLanguage}
            onToggleAccount={() => setIsAccountOpen((prev) => !prev)}
            themeMode={themeMode}
            toggleLanguage={toggleLanguage}
            username={username}
            t={t}>
            {isAccountOpen ? (
              <HeaderDesktopAccountMenu
                avatar={avatar}
                onClose={closeMenus}
                onLogout={handleLogout}
                tokenExists={tokenExists}
                username={username}
              />
            ) : null}
          </HeaderDesktopActions>

          {tokenExists ? <HeaderManageButton motelId={motelId} /> : null}
        </div>

        {account?.email || !account ? null : <WarningEmailNotExits />}

        <HeaderMobileBottomNav
          onToggleAccount={() => setIsMobileAccountOpen((prev) => !prev)}
          onToggleNotification={() => setIsNotificationOpen((prev) => !prev)}
          t={t}
        />

        {isNotificationOpen ? <HeaderNotificationPanel /> : null}

        {isMobileAccountOpen ? (
          <HeaderMobileAccountMenu
            avatar={avatar}
            onClose={closeMenus}
            onLogout={handleLogout}
            tokenExists={tokenExists}
            username={username}
          />
        ) : null}
      </header>

      <HeaderMobileSearch
        isSearchTypeOpen={isSearchTypeOpen}
        onSearchChange={handleSearchChange}
        onToggleSearchType={() => setIsSearchTypeOpen((prev) => !prev)}
        t={t}
      />

      {isCategoryOpen ? <HeaderCategoryMenu /> : null}
    </header>
  )
}

export default Header
