import { Link } from 'react-router-dom'
import HeaderSearchBar from './HeaderSearchBar'

const HeaderMobileSearch = ({ isSearchTypeOpen, onSearchChange, onToggleSearchType, t }) => {
  return (
    <div className="aw__s575q7c" style={{ '--s575q7c-0': '#fff', '--s575q7c-1': '52px' }}>
      <div className="aw__lx9c9yk">
        <div className="aw__sylyxqn">
          <div className="aw__sm0onfn">
            <div className="aw__s1wdsl35">
              <div>
                <HeaderSearchBar mobile isOpen={isSearchTypeOpen} onSearchChange={onSearchChange} onToggle={onToggleSearchType} t={t} />
              </div>
            </div>
            <Link className="aw__n1u3b0ub" to="#" rel="nofollow" aria-label="chat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="aw__ih32wb2">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.7499 4.34844C3.71012 4.34844 3.67197 4.36424 3.64384 4.39237C3.61571 4.4205 3.5999 4.45866 3.5999 4.49844V15.2422L6.33529 13.0318C6.44205 12.9455 6.57515 12.8984 6.7124 12.8984H15.7499C15.7897 12.8984 15.8278 12.8826 15.856 12.8545C15.8841 12.8264 15.8999 12.7882 15.8999 12.7484V4.49844C15.8999 4.45865 15.8841 4.4205 15.856 4.39237C15.8278 4.36424 15.7897 4.34844 15.7499 4.34844H3.7499ZM2.79531 3.54384C3.04848 3.29067 3.39186 3.14844 3.7499 3.14844H15.7499C16.1079 3.14844 16.4513 3.29067 16.7045 3.54384C16.9577 3.79702 17.0999 4.1404 17.0999 4.49844V12.7484C17.0999 13.1065 16.9577 13.4499 16.7045 13.703C16.4513 13.9562 16.1079 14.0984 15.7499 14.0984H6.92453L3.37701 16.9651C3.19721 17.1104 2.94992 17.1395 2.74132 17.0399C2.53271 16.9402 2.3999 16.7296 2.3999 16.4984V4.49844C2.3999 4.14039 2.54213 3.79702 2.79531 3.54384Z"
                  fill="#222222"></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.8999 8.24844C15.8999 7.91707 16.1685 7.64844 16.4999 7.64844H20.2499C20.6079 7.64844 20.9513 7.79067 21.2045 8.04384C21.4577 8.29702 21.5999 8.6404 21.5999 8.99844V20.9984C21.5999 21.2296 21.4671 21.4402 21.2585 21.5399C21.0499 21.6395 20.8026 21.6104 20.6228 21.4651L17.0753 18.5984H8.2499C7.89186 18.5984 7.54848 18.4562 7.29531 18.203C7.04213 17.9499 6.8999 17.6065 6.8999 17.2484V13.4984C6.8999 13.1671 7.16853 12.8984 7.4999 12.8984C7.83127 12.8984 8.0999 13.1671 8.0999 13.4984V17.2484C8.0999 17.2882 8.11571 17.3264 8.14384 17.3545C8.17197 17.3826 8.21012 17.3984 8.2499 17.3984H17.2874C17.4247 17.3984 17.5578 17.4455 17.6645 17.5318L20.3999 19.7422V8.99844C20.3999 8.95865 20.3841 8.9205 20.356 8.89237C20.3278 8.86424 20.2897 8.84844 20.2499 8.84844H16.4999C16.1685 8.84844 15.8999 8.57981 15.8999 8.24844Z"
                  fill="#222222"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M6.7998 7.23047C6.7998 6.95433 6.99168 6.73047 7.22838 6.73047H12.3712C12.6079 6.73047 12.7998 6.95433 12.7998 7.23047C12.7998 7.50661 12.6079 7.73047 12.3712 7.73047H7.22838C6.99168 7.73047 6.7998 7.50661 6.7998 7.23047Z" fill="#222222"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M6.7998 10.2305C6.7998 9.95433 6.99168 9.73047 7.22838 9.73047H12.3712C12.6079 9.73047 12.7998 9.95433 12.7998 10.2305C12.7998 10.5066 12.6079 10.7305 12.3712 10.7305H7.22838C6.99168 10.7305 6.7998 10.5066 6.7998 10.2305Z" fill="#222222"></path>
              </svg>
              <div className="aw__bhbktvj">
                <span className="aw__bxyv27i" id="chat-unread-count" style={{ display: 'none' }}>
                  0
                </span>
              </div>
            </Link>
            <span>
              <Link className="aw__n9c3wjq" to="#" aria-label="Discover Chotot Verticals" rel="nofollow" data-bs-toggle="offcanvas" data-bs-target="#ButtonApp">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="aw__ieb68nh">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.5 4H4V11.5H11.5V4ZM4 2.75C3.30964 2.75 2.75 3.30964 2.75 4V11.5C2.75 12.1904 3.30964 12.75 4 12.75H11.5C12.1904 12.75 12.75 12.1904 12.75 11.5V4C12.75 3.30964 12.1904 2.75 11.5 2.75H4Z" fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.5 15.5H4V23H11.5V15.5ZM4 14.25C3.30964 14.25 2.75 14.8096 2.75 15.5V23C2.75 23.6904 3.30964 24.25 4 24.25H11.5C12.1904 24.25 12.75 23.6904 12.75 23V15.5C12.75 14.8096 12.1904 14.25 11.5 14.25H4Z" fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M23 4H15.5V11.5H23V4ZM15.5 2.75C14.8096 2.75 14.25 3.30964 14.25 4V11.5C14.25 12.1904 14.8096 12.75 15.5 12.75H23C23.6904 12.75 24.25 12.1904 24.25 11.5V4C24.25 3.30964 23.6904 2.75 23 2.75H15.5Z" fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M23 15.5H15.5V23H23V15.5ZM15.5 14.25C14.8096 14.25 14.25 14.8096 14.25 15.5V23C14.25 23.6904 14.8096 24.25 15.5 24.25H23C23.6904 24.25 24.25 23.6904 24.25 23V15.5C24.25 14.8096 23.6904 14.25 23 14.25H15.5Z" fill="currentColor"></path>
                </svg>
              </Link>
            </span>

            <div className="offcanvas offcanvas-bottom" id="ButtonApp">
              <div className="offcanvas-header">
                <h1 className="offcanvas-title">Heading</h1>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
              </div>
              <div className="offcanvas-body">
                <p>Some text lorem ipsum.</p>
                <button className="btn btn-secondary" type="button">
                  A Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderMobileSearch
