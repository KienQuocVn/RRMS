import { Link } from 'react-router-dom'

const HeaderNotificationPanel = () => {
  return (
    <div className="aw__n1dpqln2" style={{ '--n1dpqln2-5': '52px', '--n1dpqln2-10': '0px' }}>
      <div className="aw__c1k14z0n" style={{ '--c1k14z0n-0': 'block' }}>
        <div className="aw__c4xob3k">
          <div className="nav-tabs" role="tablist">
            <ul className="aw__tx9tvdd" aria-label="notification" role="tablist">
              <li className="aw__t1if84jm active">
                <Link className="aw__ix37719" tabIndex="-1" data-bs-toggle="tab" to="#hoatdong">
                  HOẠT ĐỘNG
                </Link>
              </li>
              <li className="aw__t1if84jm">
                <Link className="aw__ix37719" tabIndex="-1" data-bs-toggle="tab" to="#tinmoi">
                  TIN MỚI
                </Link>
              </li>
            </ul>

            <div className="tab-content">
              <div className="tab-pane" id="hoatdong">
                <div className="aw__t1ockekz">
                  <div>Vui lòng đăng nhập để xem danh sách hoạt động.</div>
                  <Link className="aw__b1lvk31j button r-normal medium w-bold" to="/login" color="accent" rel="nofollow">
                    Đăng ký / Đăng nhập
                  </Link>
                </div>
              </div>
              <div className="tab-pane" id="tinmoi">
                <div className="aw__t1ockekz">
                  <div id="nonenews" className="aw__t8lgh8j">
                    Chúng tôi không có cập nhật nào. Vui lòng kiểm tra lại sau
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderNotificationPanel
