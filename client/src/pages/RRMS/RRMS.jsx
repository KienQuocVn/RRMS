import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { Pkeyw } from '~/utils/PoKey'
import FilterSearch from '../search/FilterSearch'
import { data } from '~/utils/slider'
import { sliderSettings } from '~/utils/common.js'
import { wards_list } from '~/utils/wards_list'
import { useEffect, useState } from 'react'
import 'swiper/css'
import axios from 'axios'
import LoadingPage from '~/components/LoadingPage/LoadingPage'
import { formatterAmount } from '~/utils/formatterAmount'
import { Pagination } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { env } from '~/configs/environment'
const RRMS = ({ setIsAdmin }) => {
  const [searchData, setSearchData] = useState([])
  const navigate = useNavigate()
  const [dataNew, setDataNew] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8 // Số lượng item hiển thị mỗi trang

  const [currentPageNew] = useState(1)
  const itemsPerPageNew = 4 // Số lượng item hiển thị mỗi trang

  const indexOfLastItemNew = currentPageNew * itemsPerPageNew
  const indexOfFirstItemNew = indexOfLastItemNew - itemsPerPageNew
  let currentItemsNew = []
  if (Array.isArray(searchData)) {
    currentItemsNew = searchData.slice(indexOfFirstItemNew, indexOfLastItemNew)
  } else {
    currentItemsNew = []
  }


  const indexOfLastItem = currentPage * itemsPerPage // Vị trí item cuối trên trang hiện tại
  const indexOfFirstItem = indexOfLastItem - itemsPerPage // Vị trí item đầu trên trang hiện tại
  let currentItems = []
  if (Array.isArray(dataNew)) {
    currentItems = dataNew.slice(indexOfFirstItem, indexOfLastItem)
  } else {
    currentItems = []
  }

  const handlePageChangeNumber = (event, value) => {
    setCurrentPage(value)
  }
  useEffect(() => {
    setIsAdmin(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadDataNew()
    loadData()
  }, [])

  // Phần lấy dữ liệu cho currentItems
  const loadDataNew = async () => {
    try {
      const result = await axios.get(`${env.API_URL}/searchs/roomNews`, {
        headers: {
          'ngrok-skip-browser-warning': '69420'
        }
      })

      if (result.status === 200) {
        const fetchedData = result.data.result
        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setSearchData(fetchedData) // set dữ liệu cho currentItems
        } else {
          setSearchData([])
        }
      } else {
        console.log('Error: Status', result.status)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Phần lấy dữ liệu cho currentItemsNew
  const loadData = async () => {
    try {
      const result = await axios.get(`${env.API_URL}/searchs/roomVieux`, {
        headers: {
          'ngrok-skip-browser-warning': '69420'
        }
      })

      if (result.status === 200) {
        const fetchedData = result.data.result
        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setDataNew(fetchedData) // set dữ liệu cho currentItemsNew
        } else {
          setDataNew([])
        }
      } else {
        console.log('Error: Status', result.status)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const renderList = (card, start, end) => {
  const listItems = [];
  for (let i = start; i < end; i++) {
    if (card[i]) {
      listItems.push(
        <div
          className="col-md-3 mb-2"
          key={i} // Thêm key dựa trên chỉ số
          onClick={() => {
            navigate(`/search?query=${card[i].district}`);
          }}>
          <Link
            className="item-district small"
            style={{
              backgroundImage: `url(${card[i].image})`,
              backgroundSize: 'cover',
            }}
            to="#">
            <div className="info">
              <span>{card[i].name}</span>
              <span>
                <strong style={{ paddingLeft: '7px' }}>{card[i].district}</strong>
              </span>
              <div style={{ fontSize: '13px' }}>{card[i].detail}</div>
            </div>
          </Link>
        </div>
      );
    }
  }
  return listItems;
};
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => navigate(`/search?lat=${position.coords.latitude}&lon=${position.coords.longitude}`),
      (error) => console.error("Error getting location:", error)
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};
  return (
    <div>
      <section className="header-home">
        <div className="container">
          <figure id="logo">
            <h1>
              Kênh tìm phòng trọ, căn hộ, ký túc xá cho thuê{' '}
              <span className="feature" style={{ color: '#FFC107', borderBottom: '3px solid #FFC107' }}>
                TOP
              </span>{' '}
              Việt Nam
              <br />
              <span
                className="typewrite"
                data-period="5000"
                data-type='["An toàn - Hỗ trợ tìm phòng - Kết nối chủ nhà.", "Chất lượng - Giá tốt - Nhanh chóng.", "Tìm trọ - căn hộ - nhà ở hãy nghĩ đến RRMS!"]'>
                <span className="wrap">An toàn - Hỗ trợ tìm phòng - Kết nối chủ nhà.</span>
              </span>
            </h1>
          </figure>
          <section id="search-home">
            <FilterSearch />
            <div id="sugget-special">
              <div className="inner-sugget">
                <p className="text-left">
                  Tìm phòng <span>gần</span>khu vực Quận 1, Hồ Chí Minh
                </p>
                <div className="list-special-home">
                  <ul className="clearfix">
                    <li>
                      <Link
                        title="phòng trọ gần Trường Cao đẳng Đại Việt Sài Gòn"
                        to="/thue-phong-tro-gan-truong-cao-dang-dai-viet-sai-gon-id-1569"
                        className="arena">
                        #Trường Cao đẳng Đại Việt Sài Gòn
                      </Link>
                    </li>
                    <li>
                      <Link
                        title="phòng trọ gần Trường Cao đẳng Du lịch Sài Gòn"
                        to="/thue-phong-tro-gan-truong-cao-dang-du-lich-sai-gon-id-1568"
                        className="arena">
                        #Trường Cao đẳng Du lịch Sài Gòn
                      </Link>
                    </li>
                    <li>
                      <Link
                        title="phòng trọ gần Trường Cao đẳng Công thương TP.HCM"
                        to="/thue-phong-tro-gan-truong-cao-dang-cong-thuong-tphcm-id-1567"
                        className="arena">
                        #Trường Cao đẳng Công thương TP.HCM
                      </Link>
                    </li>
                    <li>
                      <Link
                        title="phòng trọ gần Trường Cao đẳng Công nghệ Sài Gòn"
                        to="/thue-phong-tro-gan-truong-cao-dang-cong-nghe-sai-gon-id-1546"
                        className="arena">
                        #Trường Cao đẳng Công nghệ Sài Gòn
                      </Link>
                    </li>
                    <li>
                      <Link
                        title="phòng trọ gần Trường Cao đẳng Bình Minh Sài Gòn"
                        to="/thue-phong-tro-gan-truong-cao-dang-binh-minh-sai-gon-id-1527"
                        className="arena">
                        #Trường Cao đẳng Bình Minh Sài Gòn
                      </Link>
                    </li>
                    <li>
                      <Link
                        title="phòng trọ gần Trường Cao đẳng Bách khoa Nam Sài Gòn"
                        to="/thue-phong-tro-gan-truong-cao-dang-bach-khoa-nam-sai-gon-id-1487"
                        className="arena">
                        #Trường Cao đẳng Bách khoa Nam Sài Gòn
                      </Link>
                    </li>
                    <li>
                      <Link
                        title="phòng trọ gần Trường Cao đẳng bán công Công nghệ và Quản trị doanh nghiệp"
                        to="/thue-phong-tro-gan-truong-cao-dang-ban-cong-cong-nghe-va-quan-tri-doanh-nghiep-id-1484"
                        className="arena">
                        #Trường Cao đẳng bán công Công nghệ và Quản trị doanh nghiệp
                      </Link>
                    </li>
                    <li>
                      <Link
                        title="phòng trọ gần Trường Đại học Greenwich Việt Nam"
                        to="/thue-phong-tro-gan-truong-dai-hoc-greenwich-viet-nam-id-1482"
                        className="arena">
                        #Trường Đại học Greenwich Việt Nam
                      </Link>
                    </li>
                    <li>
                      <Link
                        title="phòng trọ gần Trường Kinh doanh Sài Gòn"
                        to="/thue-phong-tro-gan-truong-kinh-doanh-sai-gon-id-1355"
                        className="arena">
                        #Trường Kinh doanh Sài Gòn
                      </Link>
                    </li>
                    <li>
                      <Link
                        title="phòng trọ gần Trường Đại học Hoa Sen (HSU)"
                        to="/thue-phong-tro-gan-truong-dai-hoc-hoa-sen-hsu-id-1311"
                        className="arena">
                        #Trường Đại học Hoa Sen (HSU)
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section id="menu-home">
        <div className="contaienr">
          <div className="container-menu-home ">
            <div className="row">
              <div className="col">
                <Link to="#" onClick={getLocation} className="item">
                  <picture className="webpimg-container">
                    <img src="/pin2.png" width="85%" alt="Tìm phòng gần tôi" />
                  </picture>
                  <strong>Tìm trọ gần tôi</strong>
                  <div>Tìm gần vị trí hiện tại của bạn</div>
                </Link>
              </div>
              <div className="col">
                <Link to="/support" className="item">
                  <picture className="webpimg-container">
                    <img src="/hot.png" width="100%" alt="Hỗ trợ tìm kiếm phòng" />
                  </picture>
                  <strong>Hỗ trợ tìm phòng</strong>
                  <div>RRMS hỗ trợ bạn tìm phòng</div>
                </Link>
              </div>
              <div className="col">
                <Link to="/tra-cuu-hoa-don.html" className="item">
                  <picture className="webpimg-container">
                    <img src="/bill.png" width="85%" alt="Tra cứu hóa đơn" />
                  </picture>
                  <strong>Tra cứu hóa đơn</strong>
                  <div>Xem hóa đơn nhà đang ở</div>
                </Link>
              </div>
              <div className="col">
                <Link to="/doi-gas-uu-dai.html" className="item">
                  <picture className="webpimg-container">
                    <img src="/icons8-gas-100.png" width="100%" alt="Đổi gas nhận ưu đãi" />
                  </picture>
                  <strong>Đổi gas ưu đãi</strong>
                  <div>Đổi gas tại RRMS nhận ưu đãi</div>
                </Link>
              </div>
              <div className="col">
                <Link to="/tro-thanh-moi-gioi-RRMS.html" className="item">
                  <picture className="webpimg-container ">
                    <img src="/sale-house.png" width="100%" alt="Trở thành môi giới RRMS" />
                    <span
                      style={{
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
                      }}>
                      HOT
                    </span>
                  </picture>
                  <strong>Tuyển môi giới</strong>
                  <div>Tuyển, đào tạo môi giới tại RRMS</div>
                </Link>
              </div>
              <div className="col">
                <Link
                  to="https://quanlytro.me/ung-dung-quan-ly-phong-tro.html"
                  target="_bank"
                  className="item col-sx-3">
                  <picture className="webpimg-container">
                    <img src="/owner.png" width="85%" alt="Chủ nhà cho thuê phòng" />
                    <span
                      style={{
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
                      }}>
                      PRO
                    </span>
                  </picture>
                  <strong>Tôi là chủ nhà</strong>
                  <div>Phần mềm quản lý, đăng tin</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="promotion-section">
        <div className="container">
          <div className="header-item">
            <h2 className="title-section">
              Chương trình - <strong style={{ color: '#4bcffa' }}>RRMS</strong>
            </h2>
          </div>
          <div className="row">
            <div className="col-md-3">
              <Link className="item-promotion" target="_blank" to="/" rel="noopener" tabIndex="-1">
                <img
                  width="100%"
                  src="https://lozido.com/images/promotion/banner-1-desktop.webp"
                  alt="   Hỗ trợ tân sinh viên tìm nhà. Hòa nhập môi trường mới"
                />
                <div className="title-promotion cut-text-2">Hỗ trợ tân sinh viên tìm nhà. Hòa nhập môi trường mới</div>
              </Link>
            </div>
            <div className="col-md-3">
              <Link className="item-promotion" target="_blank" to="/" rel="noopener" tabIndex="-1">
                <img
                  width="100%"
                  src="https://lozido.com/images/promotion/banner-1-desktop.webp"
                  alt="   Hỗ trợ tân sinh viên tìm nhà. Hòa nhập môi trường mới"
                />
                <div className="title-promotion cut-text-2">Hỗ trợ tân sinh viên tìm nhà. Hòa nhập môi trường mới</div>
              </Link>
            </div>
            <div className="col-md-3">
              <Link className="item-promotion" target="_blank" to="/" rel="noopener" tabIndex="-1">
                <img
                  width="100%"
                  src="https://lozido.com/images/promotion/banner-1-desktop.webp"
                  alt="   Hỗ trợ tân sinh viên tìm nhà. Hòa nhập môi trường mới"
                />
                <div className="title-promotion cut-text-2">Hỗ trợ tân sinh viên tìm nhà. Hòa nhập môi trường mới</div>
              </Link>
            </div>
            <div className="col-md-3">
              <Link className="item-promotion" target="_blank" to="/" rel="noopener" tabIndex="-1">
                <img
                  width="100%"
                  src="https://lozido.com/images/promotion/banner-1-desktop.webp"
                  alt="   Hỗ trợ tân sinh viên tìm nhà. Hòa nhập môi trường mới"
                />
                <div className="title-promotion cut-text-2">Hỗ trợ tân sinh viên tìm nhà. Hòa nhập môi trường mới</div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="province-search">
        <div className="container">
          <div className="header-item">
            <h2 className="title-section">
              Tìm phòng trọ theo <strong style={{ color: '#4bcffa' }}>tỉnh / thành phố</strong>
            </h2>
          </div>
          <div className="province-link row">
            <div className="col-md-2 mb-2" onClick={() => navigate(`/search?query=hcm`)}>
              <div className="item-province ho-chi-minh" style={{ background: 'url(./tphcm.jpg)' }}>
                <div className="info">
                  <span style={{ fontSize: '13px' }}>Phòng trọ</span> <strong>Hồ Chí Minh</strong>
                </div>
              </div>
            </div>
            <div className="col-md-2 mb-2" onClick={() => navigate(`/search?query=hn`)}>
              <Link to="#">
                <div className="item-province ho-chi-minh" style={{ background: 'url(./ha-noi.jpg)' }}>
                  <div className="info">
                    <span style={{ fontSize: '13px' }}>Phòng trọ</span> <strong>Hà Nội</strong>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-2 mb-2" onClick={() => navigate(`/search?query=bd`)}>
              <Link to="#">
                <div className="item-province ho-chi-minh" style={{ background: 'url(./bd.jpg)' }}>
                  <div className="info">
                    <span style={{ fontSize: '13px' }}>Phòng trọ</span> <strong>Bình Dương</strong>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-2 mb-2" onClick={() => navigate(`/search?query=ct`)}>
              <Link to="#">
                <div className="item-province ho-chi-minh" style={{ background: 'url(./caudibo-cantho.jpg)' }}>
                  <div className="info">
                    <span style={{ fontSize: '13px' }}>Phòng trọ</span> <strong>Cần Thơ</strong>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-2 mb-2" onClick={() => navigate(`/search?query=dn`)}>
              <Link to="#">
                <div className="item-province ho-chi-minh" style={{ background: 'url(./da-nang.jpg)' }}>
                  <div className="info">
                    <span style={{ fontSize: '13px' }}>Phòng trọ</span> <strong>Đà Nẵng</strong>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-2 mb-2" onClick={() => navigate(`/search?query=đn`)}>
              <Link to="#">
                <div className="item-province ho-chi-minh" style={{ background: 'url(./dong-nai.jpg)' }}>
                  <div className="info">
                    <span style={{ fontSize: '13px' }}>Phòng trọ</span> <strong>Đồng Nai</strong>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container available-posts">
          <div
            style={{
              borderRadius: '10px',
              background: 'linear-gradient(#eef7ff 40%, rgb(238 247 255 / 35%) 50%)',
              padding: '5px 14px 0px 14px'
            }}>
            <div className="header-item">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '0px'
                }}>
                <div
                  style={{
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ffebd5',
                    borderRadius: '100%',
                    marginRight: '10px'
                  }}>
                  <img src="/feature_icon.webp" alt="icon lịch" style={{ width: '30px', height: '30px' }} />
                </div>
                <h2 className="title-section">
                  🏡🏡🏡 Phòng dọn vào ở ngay - <strong style={{ color: 'rgb(75, 207, 250)' }}>NOW ️️️️</strong>
                  <div className="description">Bạn có thể thuê &amp; vào ở ngay hôm nay</div>
                </h2>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 26 }}>
            {currentItemsNew.length > 0 ? (
              currentItemsNew.map((item, i) => (
                <div className="grid-item" key={i} style={{ maxWidth: '280px' }}>
                  {' '}
                  <article className="i-column" style={{ marginBottom: '14px' }}>
                    <Link
                      title="Cho thuê phòng trọ full nội thất, giá sinh viên Tam Đảo, Quận 10"
                      to={`/detail/${item.bulletinBoardId}`}
                      className="inner-item"
                      style={{ textDecoration: 'none', color: 'black' }}>
                      <div
                        className="img"
                        style={{
                          position: 'relative',
                          overflow: 'hidden',
                          width: '100%',
                          height: '150px',
                          borderRadius: '8px'
                        }}>
                        <img
                          alt="Cho thuê phòng trọ full nội thất, giá sinh viên Tam Đảo, Quận 10"
                          src={item.bulletinBoardImages?.[0]?.imageLink || 'default_image_url.jpg'}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center'
                          }}
                          className="lazy"
                        />
                        <div className="images-count">4</div>
                        <div className="bookmark-item bookmark" data-post="712" id="post_712">
                          <svg
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </div>
                      </div>

                      <div className="read">
                        <div className="title cut-text-2" style={{ fontSize: '14px', marginTop: 10 }}>
                          <span className="lable-now">NOW</span> {item?.address}
                        </div>
                        <div className="address cut-text">
                          <span className="icon-user-small">
                            <svg
                              viewBox="0 0 24 24"
                              width="12"
                              height="12"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </span>
                          <strong style={{ textTransform: 'capitalize', paddingLeft: '5px' }}>
                            {item.account.username}
                          </strong>
                          <span className="zone" style={{ fontSize: '11px' }}>
                            {' '}
                            {item?.title}
                          </span>
                        </div>
                      </div>
                      <div
                        className="info"
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          display: 'flex',
                          padding: '5px'
                        }}>
                        <b className="text-danger"> {formatterAmount(item.rentPrice)} /Tháng</b>
                        <div
                          className="i area"
                          style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                          <b> {item?.area}</b> m²
                        </div>
                      </div>
                    </Link>
                  </article>
                </div>
              ))
            ) : (
              <LoadingPage />
            )}
          </div>
        </div>
        <Pagination
          count={Math.ceil(searchData.length / itemsPerPage)} // Tổng số trang
          page={currentPage} // Sửa từ currentItems thành currentPage
          onChange={handlePageChangeNumber} // Hàm xử lý khi thay đổi trang
          variant="outlined"
          color="primary"
          sx={{ mt: 4, display: 'flex', justifyContent: 'center' }} // Đặt margin-top và căn giữa
        />
      </section>
      <section className="district-search" style={{ position: 'relative' }}>
        <div className="container">
          <div className="header-item">
            <h2 className="title-section">
              Tìm phòng trọ theo <strong style={{ color: 'rgb(75, 207, 250)' }}>quận / huyện</strong>
            </h2>
            <div className="text-right" style={{ flex: '1', textAlign: 'right' }}></div>
          </div>
          <div className="district-link">
            <Swiper {...sliderSettings} style={{ position: 'unset' }}>
              <SliderButtons />
              {data.map((distric, i) => (
                <SwiperSlide key={i}>
                  <div className="item" style={{ marginRight: '10px' }}>
                    <div className="row">
                      <div className="col-md-3 mb-2">
                        {distric.cards.map((card, f) => (
                          <div
                            key={f}
                            onClick={() => {
                              navigate(`/search?query=${card.district}`)
                            }}>
                            {f == 0 ? (
                              <Link
                                className="item-district large bg-danger"
                                style={{
                                  backgroundImage: `url(${card.image})`,
                                  backgroundSize: 'cover'
                                }}
                                // to={`/search?query=${card.district}`}
                                title="Tìm phòng trọ Quận 1">
                                <div className="info">
                                  <span>{card.name}</span>
                                  <span>
                                    <strong style={{ paddingLeft: '7px' }}>{card.district}</strong>
                                  </span>
                                  <div
                                    style={{
                                      fontSize: '13px'
                                    }}>
                                    {card.detail}
                                  </div>
                                </div>
                              </Link>
                            ) : (
                              ''
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="col-md-8">
                        <div className="row" style={{ marginTop: '0px' }}>
                          {renderList(distric.cards, 1, 4)}
                        </div>
                        <div className="row" style={{ marginTop: '14px' }}>
                          {renderList(distric.cards, 4, 7)}
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
      <section className="ward-section">
        <div className="container">
          <div className="header-item">
            <h2 className="title-section">
              Tìm phòng trọ theo <strong style={{ color: 'rgb(75, 207, 250)' }}>phường / xã</strong>
            </h2>
            <div className="text-right" style={{ flex: '1', textAlign: 'right' }}>
              <button
                className="view-all"
                href="#get-filter-data-user"
                data-toggle="modal"
                data-target="#get-filter-data-user">
                <span>Xem tất cả</span>
              </button>
            </div>
          </div>
          <div className="wards-list">
            {wards_list.map((ward, i) => (
              <Link
                key={i}
                className="wards-item"
                to={`/search?query=${ward.name}`} // Điều hướng qua Link
              >
                {ward.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section>
  <div className="container section-posts">
    <div className="header-item">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '-5px'
          }}>
          <div
            style={{
              width: '45px',
              height: '45px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ffebd5',
              borderRadius: '100%',
              marginRight: '10px'
            }}>
            <img src="/feature_icon.webp" alt="icon lịch" style={{ width: '30px', height: '30px' }} />
          </div>
          <h2 className="title-section">
            Phòng trọ - <strong style={{ color: 'rgb(75, 207, 250)' }}>mới nhất</strong>
            <div className="description">Phòng vừa được phê duyệt</div>
          </h2>
        </div>
        <div className="text-right" style={{ flex: '1', textAlign: 'right' }}>
          <Link to="/thue-phong-tro-quan-1-id-760/ho-chi-minh-id-79">
            <span>
              Xem thêm phòng trọ tại <b>Quận 1</b>
            </span>
          </Link>
        </div>
      </div>
    </div>
    <div className="list-6 row">
      {currentItems.length > 0 ? (
        currentItems.map((room, i) => (
          <article className="item col-xs-12 col-md-12 col-lg-6" key={i}>
            <div className="inner-item flex">
              <section className="list-img" style={{ width: '36%' }}>
                <div style={{ position: 'relative', height: '100%' }}>
                  <Link
                    style={{
                      display: 'block',
                      width: '100%',
                      maxHeight: '205px',
                      overflow: 'hidden',
                      height: '100%'
                    }}
                    title={room.title}
                    to={`/detail/${room.bulletinBoardId}`}
                    className="is-adss">
                    <img
                      alt={room.title}
                      src={room.bulletinBoardImages?.[0]?.imageLink || 'default_image_url.jpg'}
                      className="lazy"
                    />
                  </Link>
                  <div className="images-count">3</div>
                  <div className="bookmark-item bookmark" data-post="290" id="post_290">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="css-i6dzq1">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                </div>
              </section>
              <section className="list-info" style={{ width: '64%' }}>
                <div>
                  <div className="title">
                    <Link
                      title={room.title}
                      to={`/detail/${room.bulletinBoardId}`}
                      className="cut-text-2"
                      style={{ textDecoration: 'none', color: 'black' }}>
                      <span>{room.title}</span>
                    </Link>
                  </div>
                  <div className="adress cut-text">
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="css-i6dzq1">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {room.address}
                  </div>
                  <div className="mf">
                    <div className="i price">
                      <b className="text-danger">{formatterAmount(room.rentPrice)}</b>
                    </div>
                    <div className="i are">
                      <i className="fa fa-area-chart hidden" aria-hidden="true"></i>
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
                      <div style={{ fontSize: '11px' }} data-time="1 ngày trước">
                        1 ngày trước
                      </div>
                    </div>
                  </div>
                  <div className="i info-author">
                    <Link
                      rel="nofollow, noindex"
                      to={`/detail/${room.bulletinBoardId}`}
                      className="btn-quick-zalo"
                      style={{ textDecoration: 'none' }}>
                      Zalo
                    </Link>
                    <span className="btn-quick-call">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="css-i6dzq1">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span className="show-phone-item-290">Xem SĐT</span>
                      <span className="phone-item-290" style={{ display: 'none' }}>
                        0937072468
                      </span>
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </article>
        ))
      ) : (
        <LoadingPage />
      )}
    </div>
  </div>
  <Pagination
    count={Math.ceil(searchData.length / itemsPerPage)} // Tổng số trang
    page={currentPage} // Sửa thành currentPage
    onChange={handlePageChangeNumber} // Hàm xử lý khi thay đổi trang
    variant="outlined"
    color="primary"
    sx={{ mt: 4, display: 'flex', justifyContent: 'center' }} // Đặt margin-top và căn giữa
  />
</section>

      <div className="container bot">
        <div className="flex row" style={{ marginBlock: '15px' }}>
          <div className="col-md-6">
            <Link to="#">
              <img
                src="/banner1.png"
                className="w-full lg:rounded-md"
                alt="banner moi gioi lozido"
                width="100%"
                style={{ borderRadius: '5px' }}
              />
            </Link>
          </div>
          <div className="col-md-6">
            <Link to="#">
              <img
                src="/banner2.png"
                className="lg:rounded-md cursor-pointer"
                alt="banner-pc"
                width="100%"
                style={{ borderRadius: '5px' }}
              />
            </Link>
          </div>
        </div>
        <h3 className="title-section">Các từ khóa phổ biến trên RRMS</h3>
        <div
          className="header-footer"
          style={{
            marginBottom: '50px',
            border: '0.5px solid #dbdbdb',
            backgroundColor: '#fff',
            borderRadius: '5px',
            padding: '15px'
          }}>
          <ul
            className="list-link"
            style={{
              listStyleType: 'none',
              padding: '0px',
              margin: '0px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)'
            }}>
            {Pkeyw.map((key, i) => (
              <li key={i}>
                <Link
                  to="#"
                  target="_blank"
                  style={{
                    textDecoration: 'none',
                    color: '#3d3d3d'
                  }}>
                  {key.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="text-center HTPost">
        <h3>Các bước đăng tin bài RRMS</h3>
        <p className="text-center description">Tiếp cận khách thuê dễ dàng với tính năng đăng tin</p>
      </div>
      <div className="container mb-4">
        <div className="row feature card-benefit">
          <div className="col-md-4 item green">
            <div className="innerRRMS">
              <div className="icon-itemRRMS">
                <span>1</span>
              </div>
              <div className="content-item">
                <b>Đăng nhập/Đăng ký</b>
                <div>đăng ký sau đó đăng nhập</div>
              </div>
            </div>
          </div>
          <div className="col-md-4 item blue">
            <div className="innerRRMS">
              <div className="icon-itemRRMS">
                <span>2</span>
              </div>
              <div className="content-item">
                <b>Đăng tin</b>
                <div>Đăng tin trong tài khoản cá nhân</div>
              </div>
            </div>
          </div>
          <div className="col-md-4 item yellow">
            <div className="innerRRMS">
              <div className="icon-itemRRMS">
                <span>3</span>
              </div>
              <div className="content-item">
                <b>Xét duyệt &amp; tiếp cận khách thuê</b>
                <div>Chuyên viên sẵn sàng xét duyệt 24/7</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RRMS

const SliderButtons = () => {
  const swiper = useSwiper()

  return (
    <div className="r-buttons d-none d-md-block" style={{ position: 'absolute', top: '16px', right: '205px' }}>
      <button onClick={() => swiper.slidePrev()}>&lt;</button>
      <button onClick={() => swiper.slideNext()}>&gt;</button>
    </div>
  )
}
