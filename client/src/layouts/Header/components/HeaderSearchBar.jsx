const SearchTypeDropdown = ({ isOpen, onToggle, themeMode, t }) => {
  return (
    <div className="drop-down aw__d1x4wh9a" style={{ '--d1x4wh9a-0': '#f4f4f4' }} onClick={onToggle}>
      <div className="drop-down--text" style={{ color: themeMode === 'light' ? '#212121' : '#E8E8E8' }}>
        {t('muon-thue')}
      </div>
      <span className="drop-down--icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16">
          <g fill="none" fillRule="evenodd">
            <path fill="#000" d="M6 6L11 11.5 1 11.5z" opacity=".8" transform="matrix(1 0 0 -1 0 17.5)"></path>
            <path stroke="#FFF" strokeWidth=".1" d="M0 0H12V16H0z" opacity=".01"></path>
          </g>
        </svg>
      </span>
      <span className="aw__d1ohzzqu"></span>
      {isOpen ? (
        <div>
          <div className="aw__d66o4xd" style={{ '--d66o4xd-0': 'flex' }}>
            <div className="aw__d1es5zbd">
              Muốn thuê
              <svg data-type="monochrome" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12" width="1em" height="1em" fill="none">
                <path fill="currentColor" d="M6.096 12L0 6.154l2.104-2.04 3.935 3.773L13.839 0 16 1.986z"></path>
              </svg>
            </div>
            <div className="aw__d1es5zbd">Cho thuê</div>
            <div className="aw__d1es5zbd">Dự án</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

const DesktopSearchBar = ({ isOpen, onSearch, onSearchChange, onToggle, themeMode, t }) => {
  return (
    <div className="aw__slq94yq" style={{ '--slq94yq-4': themeMode === 'light' ? '#f4f4f4' : '#1f1f1f' }}>
      <SearchTypeDropdown isOpen={isOpen} onToggle={onToggle} themeMode={themeMode} t={t} />
      <div id="autoComplete">
        <div className="aw__d1g2y39b">
          <div className="aw__s7k33ul">
            <div value="" className="aw__ah4jb82" style={{ '--ah4jb82-2': 'undefined', '--ah4jb82-6': '35px' }}>
              <button onClick={onSearch} aria-label="Search Button Desktop" className="aw__p1vnrcrb aw__cm4yjvg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  data-type="monochrome"
                  viewBox="0 0 16 16"
                  width="1em"
                  height="1em"
                  fill="none"
                  className="mb-1">
                  <path
                    fill="currentColor"
                    d="M6.4 0a6.369 6.369 0 00-4.525 1.873A6.425 6.425 0 00.502 3.906v.002A6.383 6.383 0 000 6.398a6.372 6.372 0 001.875 4.524 6.385 6.385 0 008.428.537l-.006.006 4.295 4.293a.827.827 0 001.166-1.166l-4.295-4.295a6.368 6.368 0 00-.537-8.424A6.372 6.372 0 006.4 0zm0 1.615a4.75 4.75 0 013.383 1.4c.44.44.785.95 1.028 1.522h-.002c.249.59.377 1.214.377 1.861 0 .648-.128 1.27-.377 1.862h.002a4.783 4.783 0 01-2.55 2.545c-.59.25-1.213.377-1.86.377a4.761 4.761 0 01-1.864-.377A4.749 4.749 0 013.016 9.78c-.44-.44-.783-.95-1.024-1.521a4.735 4.735 0 01-.377-1.862c0-.647.127-1.272.377-1.863a4.75 4.75 0 011.024-1.52 4.754 4.754 0 013.384-1.4z"></path>
                </svg>
              </button>
            </div>
            <input
              onChange={onSearchChange}
              autoComplete="off"
              placeholder={t('nhap-thong-tin')}
              id="__inputItemProps"
              type="text"
              className="aw__t16o28i7"
              style={{
                '--t16o28i7-3': '36px',
                '--t16o28i7-5': themeMode === 'light' ? '#f4f4f4' : '#1f1f1f',
                '--t16o28i7-6': '35px',
                '--t16o28i7-8': '35px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const MobileSearchBar = ({ isOpen, onSearchChange, onToggle, t }) => {
  return (
    <div className="aw__slq94yq" style={{ '--slq94yq-4': '#f4f4f4', '--s575q7c-1': '52px' }}>
      <div id="autoComplete">
        <div className="aw__d1g2y39b">
          <div className="aw__s7k33ul">
            <div aria-label="Search Button" role="button" className="aw__s1idqica">
              <SearchTypeDropdown isOpen={isOpen} onToggle={onToggle} themeMode="light" t={t} />
              <div className="btn-search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" data-type="monochrome" viewBox="0 0 16 16" width="1em" height="1em" fill="none">
                  <path
                    fill="currentColor"
                    d="M6.4 0a6.369 6.369 0 00-4.525 1.873A6.425 6.425 0 00.502 3.906v.002A6.383 6.383 0 000 6.398a6.372 6.372 0 001.875 4.524 6.385 6.385 0 008.428.537l-.006.006 4.295 4.293a.827.827 0 001.166-1.166l-4.295-4.295a6.368 6.368 0 00-.537-8.424A6.372 6.372 0 006.4 0zm0 1.615a4.75 4.75 0 013.383 1.4c.44.44.785.95 1.028 1.522h-.002c.249.59.377 1.214.377 1.861 0 .648-.128 1.27-.377 1.862h.002a4.783 4.783 0 01-2.55 2.545c-.59.25-1.213.377-1.86.377a4.761 4.761 0 01-1.864-.377A4.749 4.749 0 013.016 9.78c-.44-.44-.783-.95-1.024-1.521a4.735 4.735 0 01-.377-1.862c0-.647.127-1.272.377-1.863a4.75 4.75 0 011.024-1.52 4.754 4.754 0 013.384-1.4z"></path>
                </svg>
              </div>
            </div>
            <div value="" className="aw__ah4jb82" style={{ '--ah4jb82-2': 'undefined', '--ah4jb82-6': '35px' }}></div>
            <input
              type="text"
              autoComplete="off"
              placeholder={t('nhap-thong-tin')}
              id="__inputItemProps"
              onChange={onSearchChange}
              className="aw__t16o28i7"
              style={{
                '--t16o28i7-3': '36px',
                '--t16o28i7-5': '#f4f4f4',
                '--t16o28i7-6': '124px',
                '--t16o28i7-8': '144px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const HeaderSearchBar = (props) => {
  if (props.mobile) {
    return <MobileSearchBar {...props} />
  }

  return <DesktopSearchBar {...props} />
}

export default HeaderSearchBar
