/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { Typography, Button, Box, Grid, Container, Paper, Tab, Tabs, CardContent, Card, useTheme } from '@mui/material'
import './Home.css'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'

// Define the tab components with unique content
const Tab1 = () => {
  return (
    <div className="row d-flex">
      <Container>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <img
              className="custom-logo home-logo2"
              style={{ width: '100%', height: 'auto', maxWidth: '526px' }}
              src="https://quanlytro.me/images/quan-ly-tro-smart-7-2022.png?version=244342"
              alt="Phần mềm quản lý nhà trọ trên điện thoại - RRMS"
              title="Phần mềm quản lý nhà trọ điện thoại"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="inner-slider align-self-center align-baseline">
              <article>
                <Typography variant="h4" className="fw-bold fs-2">
                  <span className="wrap">Hệ thống quản lý vận hành thông minh</span>
                </Typography>
                <Typography variant="h4" className="fs-5 mt-2">
                  Smartos OMS dành cho dịch vụ cho thuê phòng trọ, giúp chủ đầu tư GIẢM 72% PHÍ TỔN - TĂNG 85% HIỆU SUẤT
                  QUẢN LÝ.
                </Typography>
              </article>

              <div>
                <Typography variant="h5" className="fs-2 mt-4 mb-3">
                  <i className="bi bi-graph-up p-1 rounded" style={{ color: '#5eb7ff' }}></i>
                  <span className="wrap"> Nền tảng thông minh</span>
                </Typography>
                <Typography className="fs-5 ms-5">
                  Tích hợp quy trình quản lý tòa nhà đa chi nhánh trên một hệ thống duy nhất.
                </Typography>
              </div>
              <div>
                <Typography variant="h5" className="fs-2 mt-3 mb-3">
                  <i className="bi bi-clock p-1 rounded" style={{ color: '#5eb7ff' }}></i>
                  <span className="wrap mt-5"> Tiết kiệm thời gian</span>
                </Typography>
                <Typography className="fs-5 ms-5">Hệ thống tự động hóa & loại bỏ các tác vụ thủ công.</Typography>
              </div>
              <div>
                <Typography variant="h5" className="fs-2 mt-3 mb-3">
                  <i className="bi bi-check-circle p-1 rounded" style={{ color: '#5eb7ff' }}></i>
                  <span className="wrap"> Dễ dàng sử dụng</span>
                </Typography>
                <Typography className="fs-5 ms-5">
                  Nhanh chóng xử lý các công việc hằng ngày chỉ với một màn hình.
                </Typography>
              </div>
              <div>
                <Typography variant="h5" className="fs-2 mt-3 mb-3">
                  <Button variant="contained" className="fs-5 rounded-2">
                    Xem thêm<i className="bi bi-arrow-right-short ms-2"></i>
                  </Button>
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

const Tab2 = () => {
  return (
    <div className="row d-flex">
      <Container>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <img
              className="custom-logo home-logo2"
              style={{ width: '100%', height: 'auto', maxWidth: '526px' }}
              src="https://quanlytro.me/images/quan-ly-tro-smart-7-2022.png?version=244342"
              alt="Phần mềm quản lý nhà trọ trên điện thoại - RRMS"
              title="Phần mềm quản lý nhà trọ điện thoại"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="inner-slider align-self-center align-baseline">
              <article>
                <Typography variant="h4" className="fw-bold fs-2">
                  <span className="wrap">Giải pháp Thương hiệu – Bespoke Solution</span>
                </Typography>
                <Typography variant="h4" className="fs-5 mt-2">
                  Giải pháp tích hợp với Smartos OMS (nền tảng Web & App) giúp Doanh nghiệp kết nối trực tiếp đến khách
                  hàng.
                </Typography>
              </article>

              <div>
                <Typography variant="h5" className="fs-2 mt-4 mb-3">
                  <i className="bi bi-clock-fill p-1 rounded" style={{ color: '#5eb7ff' }}></i>
                  <span className="wrap"> Tiết kiệm thời gian & chi phí</span>
                </Typography>
                <Typography className="fs-5 ms-5">
                  Tiết kiệm 2/3 thời gian & giảm 70% chi phí so với xây dựng một ứng dụng/ trang web hoàn toàn mới.
                </Typography>
              </div>
              <div>
                <Typography variant="h5" className="fs-2 mt-3 mb-3">
                  <i className="bi bi-bar-chart-fill p-1 rounded" style={{ color: '#5eb7ff' }}></i>
                  <span className="wrap mt-5"> Tăng nhận diện thương hiệu</span>
                </Typography>
                <Typography className="fs-5 ms-5">
                  Xây dựng một ứng dụng/ trang web mang nhận diện riêng theo mô hình tòa nhà cho thuê của bạn.
                </Typography>
              </div>
              <div>
                <Typography variant="h5" className="fs-2 mt-3 mb-3">
                  <i className="bi bi-currency-exchange p-1 rounded" style={{ color: '#5eb7ff' }}></i>
                  <span className="wrap"> Nuôi dưỡng khách hàng thân thiết</span>
                </Typography>
                <Typography className="fs-5 ms-5">
                  Kết nối & chăm sóc khách hàng trực tiếp trên trang web/ ứng dụng riêng của tòa nhà.
                </Typography>
              </div>
              <div>
                <Typography variant="h5" className="fs-2 mt-3 mb-3">
                  <Button variant="contained" className="fs-5 rounded-2">
                    Xem thêm<i className="bi bi-arrow-right-short ms-2"></i>
                  </Button>
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

const Tab3 = () => {
  return (
    <div className="row d-flex">
      <Container>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <img
              className="custom-logo home-logo2"
              style={{ width: '100%', height: 'auto', maxWidth: '526px' }}
              src="https://quanlytro.me/images/quan-ly-tro-smart-7-2022.png?version=244342"
              alt="Phần mềm quản lý nhà trọ trên điện thoại - RRMS"
              title="Phần mềm quản lý nhà trọ điện thoại"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="inner-slider align-self-center align-baseline">
              <article>
                <Typography variant="h4" className="fw-bold fs-2">
                  <span className="wrap">Giải pháp Thị trường – Smartos On-Demand Booking</span>
                </Typography>
                <Typography variant="h4" className="fs-5 mt-2">
                  Ứng dụng đặt chỗ và quản lý, kết nối Nhà cung cấp và người thuê toà nhà.
                </Typography>
              </article>

              <div>
                <Typography variant="h5" className="fs-2 mt-4 mb-3">
                  <i className="bi bi-flag-fill p-1 rounded" style={{ color: '#5eb7ff' }}></i>
                  <span className="wrap"> Mở rộng thị trường</span>
                </Typography>
                <Typography className="fs-5 ms-5">Kênh tiếp cận khách hàng tiềm năng hoàn toàn MIỄN PHÍ.</Typography>
              </div>
              <div>
                <Typography variant="h5" className="fs-2 mt-3 mb-3">
                  <i className="bi bi-person-fill p-1 rounded" style={{ color: '#5eb7ff' }}></i>
                  <span className="wrap mt-5"> Kênh giao tiếp chuyên nghiệp</span>
                </Typography>
                <Typography className="fs-5 ms-5">Dễ dàng liên hệ và giao tiếp với khách hàng tiềm năng.</Typography>
              </div>
              <div>
                <Typography variant="h5" className="fs-2 mt-3 mb-3">
                  <i className="bi bi-box-fill p-1 rounded" style={{ color: '#5eb7ff' }}></i>
                  <span className="wrap"> Tối ưu hóa vận hành</span>
                </Typography>
                <Typography className="fs-5 ms-5">
                  Cùng với Smartos PMS, thông tin booking được quản lý chính xác.
                </Typography>
              </div>
              <div>
                <Typography variant="h5" className="fs-2 mt-3 mb-3">
                  <Button variant="contained" className="fs-5 rounded-2">
                    Xem thêm<i className="bi bi-arrow-right-short ms-2"></i>
                  </Button>
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
export default function HomePage({ setIsAdmin }) {
  const { t } = useTranslation()
  const [value, setValue] = React.useState(0)
  const theme = useTheme()

  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      },
      { threshold: 0.5 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    setIsAdmin(false)
  }, [])

  return (
    <div>
      <section
        className="banner"
        style={{
          background: theme.palette.mode === 'light' ? '#eef8ff' : '#1f1f1f'
        }}>
        <Container>
          <div className="inner-banner mt-5">
            <Grid container spacing={2}>
              <Grid item xl={7} md={12} className="d-flex align-content-center text-center">
                <div className="inner-slider align-self-center align-baseline">
                  <Typography variant="h3" className="title" fontWeight="bold" style={{width:'690px'}}>
                    {t('phan-mem-quan-ly-nha-cho-thue')}
                  </Typography>
                  <Typography variant="h3" className="title" fontWeight="bold">
                    <span className="text-gradient">{t('dt-mt')}</span> 🎉
                  </Typography>
                  <article>
                    <Typography variant="h4" className="title-descrip">
                      <span className="wrap">{t('quan-ly-nhe-nhang')}</span>
                    </Typography>
                    <Typography>{t('su-dung-don-gian')}</Typography>
                  </article>
                  <div className="d-flex justify-content-center mt-3 button1">
                    <div className=" mt-2">
                      <Button
                        variant="contained"
                        className="btn-media shadow"
                        data-toggle="modal"
                        data-target="#modalVideoIntroduce">
                        {t('dung-thu')}
                      </Button>
                    </div>
                    <div className="text-start mt-2 ms-5">
                      <Button
                        variant="contained"
                        className="btn-registry shadow"
                        data-toggle="modal"
                        data-target="#registerModal">
                        <span className="icon-btn-media me-3">
                          <img
                            width={50}
                            src="https://quanlytro.me/images/icons/button_media.svg?version=244342"
                            alt="play video"
                          />
                        </span>
                        {t('tu-van')}
                      </Button>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xl={5} md={12} className="image-slider text-center">
                <img
                  className="custom-logo home-logo2"
                  style={{ width: '100%', height: 'auto', maxWidth: '526px' }}
                  src="https://quanlytro.me/images/quan-ly-tro-smart-7-2022.png?version=244342"
                  alt="Phần mềm quản lý nhà trọ trên điện thoại - RRMS"
                  title="Phần mềm quản lý nhà trọ điện thoại"
                />
              </Grid>
            </Grid>
          </div>
        </Container>
      </section>

      {/* Highlights */}
      <section
        className="feature-home"
        style={{ backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#1f1f1f' }}>
        <div className="container1">
          <div className="text-center">
            <Typography className="header-title" sx={{ fontSize: '40px', fontWeight: 'bold' }}>
              Điểm nổi bật
            </Typography>
            <Typography variant="body1">
              Một số điểm nổi bật của phần mềm bạn có thể tham khảo ngoài ra còn có nhiều tính năng đang chờ bạn khám
              phá!
            </Typography>
          </div>

          <Grid container spacing={2} mt={4}>
            {features.map((feature, index) => (
              <Grid item xs={6} sm={6} md={4} lg={2} key={index}>
                {' '}
                {/* Chỉnh sửa cột cho lg = 2 để có 6 cột  */}
                <Box textAlign="center">
                  <img src={feature.img} alt={feature.title} className="img-fluid" />
                  <Typography variant="subtitle1" mt={1} className="subtitle-strong">
                    <strong>{feature.title}</strong>
                  </Typography>
                </Box>
              </Grid>
            ))}
            <Grid item xs={6} sm={6} md={4} lg={2}>
              <Box className="custom-box">
                <Box display="flex" alignItems="center">
                  <Link component="a" to="#all-function" className="link">
                    Xem thêm
                  </Link>
                  <svg
                    className="svg-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginLeft: '8px' }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 16 16 12 12 8"></polyline>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </Box>
              </Box>
              <Typography variant="subtitle1" mt={1} className="subtitle-strong">
                <strong>Nhiều tính năng khác đang chờ khám phá</strong>
              </Typography>
            </Grid>
          </Grid>
        </div>
      </section>

      <section className="platform-app has-bg-white">
        <Container>
          <div className="item-inner inner-platform-app">
            <div className="text-center">
              <Typography sx={{ fontSize: '40px', fontWeight: 'bold' }}>Quản lý trên đa nền tảng</Typography>
              <Typography color="#5eb7ff" sx={{ fontSize: '40px', fontWeight: 'bold' }}>
                Điện thoại - iPad - Máy tính - Website
              </Typography>
              <Typography variant="body1">
                Với sự đa dạng về nền tảng sẽ giúp bạn quản lý nhà trọ linh động hơn, thay vì mẫu excel phức tạp hay sổ
                sách rờm rà. Thật tuyệt vời khi nay bạn đã có thể quản lý nhà trọ của mình trên mọi thiết bị bạn có.
              </Typography>
            </div>

            <Grid container spacing={2} mt={4}>
              {features1.map((feature, index) => (
                <Grid item xs={12} md={4} key={index} data-aos-disable="zoom-in-up">
                  <Box className="inner">
                    <Box className="image">
                      <img
                        src={feature.img}
                        width="383"
                        height="282"
                        className="img-fluid"
                        title={feature.title}
                        alt={feature.title}
                      />
                    </Box>
                    <Box textAlign="center" mt={3} mb={2}>
                      <Button
                        variant="contained"
                        className={`btn btn-platform ${index === 0 ? 'mobile' : index === 1 ? 'ipad' : 'desktop'}`}
                        href={feature.link}>
                        {feature.buttonLabel}
                      </Button>
                    </Box>
                    <Box className="des text-align-justify">
                      <Typography variant="body1">{feature.description}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </div>
        </Container>
      </section>

      <section className="platform-app has-bg-white">
        <div className="item-inner inner-platform-app">
          <div className="text-center">
            <Typography color="#5eb7ff" sx={{ fontSize: '40px', fontWeight: 'bold' }}>
              Giải pháp toàn diện – Hỗ trợ xuyên suốt
            </Typography>
          </div>

          <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab style={{ marginRight: '290px' }} label={<span style={{ fontSize: '20px' }}>Thông minh</span>} />
              <Tab
                style={{ marginRight: '290px' }}
                label={<span style={{ fontSize: '20px' }}>Giải pháp theo yêu cầu</span>}
              />
              <Tab label={<span style={{ fontSize: '20px' }}>Đặt chỗ theo yêu cầu</span>} />
            </Tabs>
            <Box p={3}>
              {value === 0 && <Tab1 />}
              {value === 1 && <Tab2 />}
              {value === 2 && <Tab3 />}
            </Box>
          </Box>
        </div>
      </section>

      <section className="testimonial has-bg-white">
        <Container>
          <div className="item-inner inner-testimonial">
            <article className="text-center">
              <Typography color="#5eb7ff" sx={{ fontSize: '40px', fontWeight: 'bold' }}>
                Giải pháp chuyển đổi số tích hợp
              </Typography>
              <Typography className="section-description mt-3">
                Chúng tôi đang trên đà hiện thực hóa tầm nhìn của mình với những giải pháp hỗ trợ cho sự phát triển
                <br />
                tương lai của ngành Bất động sản cho thuê. Giải pháp của RRMS giúp doanh nghiệp thúc đẩy doanh số,
                <br />
                giảm rủi ro và phí tổn, tăng hiệu quả vận hành với mức phí thấp hơn trong khi khả năng tùy chỉnh cao
                hơn.
              </Typography>
            </article>
            <div className="grid-row mt-4">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card className="imagebox-card" sx={{ height: '420px' }}>
                    <a className="perlink">
                      <div className="image">
                        <img
                          decoding="async"
                          src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="Đội ngũ tận tâm"
                          className="image"
                        />
                      </div>
                      <CardContent>
                        <Typography variant="h5">Đội ngũ tận tâm</Typography>
                        <Typography className="description mt-3">
                          Đội ngũ tư vấn của Smartos không chỉ am hiểu về công nghệ mà còn có khả năng thấu hiểu nhu cầu
                          của khách hàng, từ đó đưa ra những tư vấn phù hợp.
                        </Typography>
                      </CardContent>
                    </a>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card className="imagebox-card" sx={{ height: '420px' }}>
                    <div className="image">
                      <img
                        decoding="async"
                        src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Kinh nghiệm thực tiễn"
                        className="image"
                      />
                    </div>
                    <CardContent>
                      <Typography variant="h5">Kinh nghiệm thực tiễn</Typography>
                      <Typography className="description mt-3">
                        Chúng tôi tư vấn cho khách hàng bằng kinh nghiệm vận hành thực tiễn tại{' '}
                        <strong>
                          <Link to="#" target="_blank" rel="noopener noreferrer">
                            FPT SOFTWARE
                          </Link>
                        </strong>{' '}
                        và công nghệ từ đội ngũ phát triển
                        <Link to="#" target="_blank" rel="noopener noreferrer">
                          <strong>RRMS GROUP</strong>
                        </Link>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card className="imagebox-card" sx={{ height: '420px' }}>
                    <a className="perlink">
                      <div className="image">
                        <img
                          decoding="async"
                          src="https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="Quy trình chuyên nghiệp"
                          className="image"
                        />
                      </div>
                      <CardContent>
                        <Typography variant="h5">Quy trình chuyên nghiệp</Typography>
                        <Typography className="description mt-3">
                          Với quy trình CSKH 1-1, chủ tòa nhà cùng nhân viên vận hành sẽ được đội ngũ Smartos hướng dẫn
                          tiếp nhận và sử dụng phần mềm Smartos một cách dễ hiểu và hiệu quả nhất.
                        </Typography>
                      </CardContent>
                    </a>
                  </Card>
                </Grid>
              </Grid>
            </div>
          </div>
        </Container>
      </section>

      <section className="testimonial has-bg-white">
        <Container>
          <div className="item-inner inner-testimonial">
            <article className="text-center">
              <Typography sx={{ fontSize: '40px', fontWeight: 'bold' }}>Lý do chủ nhà chọn chúng tôi</Typography>
              <Typography color="#5eb7ff" sx={{ fontSize: '40px', fontWeight: 'bold' }}>
                Cảm nhận từ khách hàng
              </Typography>
              <Typography className="section-description" sx={{ mb: 3 }}>
                Sự hài lòng của khách hàng là động lực giúp chúng tôi hoàn thiện ứng dụng, đồng thời mở ra cơ hội có
                thêm nhiều khách hàng mới trong tương lai.
                <br />
                Chúng tôi chân thành cảm ơn khách hàng đã tin dùng cũng như đóng góp giúp phần mềm ngày càng hoàn thiện
                hơn!
              </Typography>
            </article>

            <div
              className={`testimonial-wrapper testimonial-1 text-center fade-up ${isVisible ? 'visible' : ''}`}
              ref={elementRef}>
              <Grid container spacing={3}>
                {testimonials.map((testimonial, index) => (
                  <Grid item xs={12} md={6} lg={3} key={index}>
                    <Paper variant="outlined" className="testimonial-inner rounded">
                      <div className="testimonial-abs-part">
                        <div className="testimonial-thumb">
                          <img width={75} src={testimonial.image} className="rounded-circle" alt={testimonial.name} />
                          <div className="testimonial-title">{testimonial.name}</div>
                          <b>{testimonial.rooms}</b>
                          <p>{testimonial.role}</p>
                        </div>
                      </div>
                      <article className="testimonial-info-wrap">
                        <p
                          style={{
                            whiteSpace: 'pre-wrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: 'vertical'
                          }}>
                          {testimonial.feedback}
                        </p>
                      </article>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="item-inner">
            <div className="text-center">
              <Typography sx={{ fontSize: '40px', fontWeight: 'bold' }}>Đồng hành cùng chúng tôi</Typography>
              <Typography>
                Cùng hướng đến sự phát triển bền vững, mang lại giá trị thực cho cộng đồng.
                <br className="d-none d-md-block" />
                Chúng tôi đã kết nối với nhiều đối tác và khách hàng.
              </Typography>
            </div>

            <div className="logo-customer mt-5">
              <div className="marquee marquee--8">
                {logos.map((logo, index) => (
                  <img key={index} className="marquee__item" src={logo} height={100} width={100} alt="" />
                ))}
              </div>
            </div>

            <section className="about-us mt-3">
              <Grid container spacing={3}>
                <Grid item sm={12} md={6}>
                  <article className="card-feature" style={{ height: '340px' }}>
                    <FormatQuoteIcon sx={{ fontSize: '50px', display: 'inline-block', mr: 0.5, color: '#5eb7ff' }} />
                    <span
                      // className="item-wraptext"
                      style={{ borderBottom: '3px solid #5eb7ff', fontSize: '30px', fontWeight: 'bold' }}>
                      Sự ra đời của RRMS
                    </span>
                    <span style={{ fontSize: '30px', fontWeight: 'bold' }}>{' -'} Hệ thống quản lý trọ</span>
                    <Typography style={{ textAlign: 'justify' }}>
                      Với số lượng phòng trọ ngày càng tăng theo nhu cầu, các chủ nhà sẽ gặp khó khăn trong việc quản lý
                      theo cách truyền thống. Sử dụng các cuốn sổ dày cộm rồi ghi chép tất cả các thông tin hay các file
                      excel phức tạp, đến các khoản tiền dịch vụ khách sử dụng, đến phiếu thu tiền, hóa đơn, thống kê
                      các khoản chi thu. Nhận thấy được vấn đề đó, đội ngũ <b>RRMS - Quản lý trọ</b> chúng tôi được ra
                      đời nhằm chia sẻ phần
                      <b> RRMS - Quản lý trọ</b> chúng tôi được ra đời nhằm chia sẻ phần nào những khó khăn của các chủ
                      nhà trọ đang gặp phải.
                    </Typography>
                  </article>
                </Grid>
                <Grid item sm={12} md={6}>
                  <article className="card-feature" style={{ height: '340px' }}>
                    <FormatQuoteIcon sx={{ fontSize: '50px', display: 'inline-block', mr: 0.5, color: '#5eb7ff' }} />
                    <span
                      // className="item-wraptext"
                      style={{ borderBottom: '3px solid #5eb7ff', fontSize: '30px', fontWeight: 'bold' }}>
                      Giá trị cốt lõi của RRMS
                    </span>
                    <span style={{ fontSize: '30px', fontWeight: 'bold' }}>{' -'} Hệ thống quản lý trọ</span>
                    <Typography paragraph style={{ textAlign: 'justify' }}>
                      Hiểu được nỗi khó khăn trong việc quản lý nhà cho thuê, mục tiêu của đội ngủ RRMS là phải mang sản
                      phẩm chất lượng, tiện ích tới khách hàng. Phần mềm phải được cập nhật, gia cố thường xuyên để đáp
                      ứng kịp thời nghiệp vụ quản lý trong hoạt động kinh doanh nhà trọ sớm và tốt nhất có thể. Chúng
                      tôi luôn coi sự hài lòng của khách hàng là thành công và đặt lợi ích khách hàng lên hàng đầu. Phục
                      vụ tận tình, chu đáo.
                    </Typography>
                  </article>
                </Grid>
              </Grid>
            </section>
          </div>
        </Container>
      </section>
    </div>
  )
}

const features = [
  {
    img: 'https://quanlytro.me/images/home_feature/feature-1-app-danh-rieng-cho-khac-thue-doc.jpg',
    title: 'App dành riêng cho khách thuê'
  },
  {
    img: 'https://quanlytro.me/images/home_feature/feature-2-gui-hoa-don-tu-dong-doc.jpg',
    title: 'Gửi hóa đơn tự động tới khách thuê ZALO/APP'
  },
  {
    img: 'https://quanlytro.me/images/home_feature/feature-3-thanh-toan-online-doc.jpg',
    title: 'Thanh toán hóa đơn online, gạch nợ tự động'
  },
  {
    img: 'https://quanlytro.me/images/home_feature/feature-4-giao-dien-de-su-dung-doc.jpg',
    title: 'Giao diện cực kỳ dễ sử dụng'
  },
  {
    img: 'https://quanlytro.me/images/home_feature/feature-5-lap-day-phong-trong-doc.jpg',
    title: 'Lấp phòng trống nhanh chóng'
  }
]

const features1 = [
  {
    img: 'https://quanlytro.me/images/banner_mobile_flatform.webp',
    title: 'Quản lý nhà tọ trên điện thoại',
    buttonLabel: 'Quản lý trên điện thoại',
    description:
      'Quản lý ngay trên chiếc điện thoại. Nhẹ nhàng, thuận tiện, linh hoạt với đầy đủ tính năng và được đồng bộ với các nền tảng khác.'
  },
  {
    img: 'https://quanlytro.me/images/banner_ipad_flatform.webp',
    title: 'Quản lý nhà tọ trên iPad',
    buttonLabel: 'Quản lý trên máy tính bảng',
    description:
      'Nếu bạn đang có chiếc máy tính bảng là một lợi thế. Bạn có thể kết hợp được sự linh hoạt giữa điện thoại và máy tính.'
  },
  {
    img: 'https://quanlytro.me/images/banner_desktop_flatform.webp',
    title: 'Quản lý nhà tọ trên máy tính',
    buttonLabel: 'Quản lý trên máy tính',
    description:
      'Quản lý ngay trên website mà không cần cài đặt app. Tất cả các tính năng sẽ rất chi tiết, sẽ giúp bạn quản lý thuận tiện đầy đủ.'
  }
]

const testimonials = [
  {
    name: 'Dương Trí Dũng',
    rooms: '69 phòng',
    role: 'Hacker Lỏd',
    feedback:
      'Sau khi đọc xong 300 bài code thiếu nhi, tôi đã trở thành "thần đồng lập trình", ít nhất là trong mắt mình. Bây giờ, tôi có thể giải quyết bài toán cộng trừ nhân chia trong code như ăn kẹo!',
    image: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/b4df1c0fa5e24e16da5a9c9541bf50b95bc98fca9bba71.jpg'
  },
  {
    name: 'Chị Lê Thị Huyên',
    rooms: '8 phòng',
    role: 'Chủ nhà',
    feedback:
      'Tôi rất thích ứng dụng vì rất tiện lợi, phòng của tôi không nhiều nhưng trước khi biết đến ứng dụng tôi phải quản lý sổ sách rất cực. Giờ thì khoẻ hơn nhiều. Cảm ơn RRMS!',
    image: 'https://quanlytro.me/images/owner_avatars/chu-tro-02-80x80.webp?version=29842'
  },
  {
    name: 'Anh Lê Văn Tân',
    rooms: '30 phòng',
    role: 'Chủ nhà',
    feedback:
      'Phòng trọ của mình tương đối nhiều. Trước đây mình thường rất mất nhiều thời gian trong công việc quản lý. Mình tốn thời gian ghi nhớ, tính toán sổ sách hàng tháng. Từ khi được bạn giới thiệu ứng dụng mọi việc tốt hơn.',
    image: 'https://quanlytro.me/images/owner_avatars/chu-tro-03-80x80.webp?version=29842'
  },
  {
    name: 'Chị Đoàn Thị Hòa',
    rooms: '20 phòng',
    role: 'Chủ nhà',
    feedback:
      'Tôi có nhiều thời gian cho bản thân hơn từ khi biết đến ứng dụng quản lý nhà trọ của RRMS. Thật sự cảm ơn các bạn đã giới thiệu và hỗ trợ tôi!',
    image: 'https://quanlytro.me/images/owner_avatars/chu-tro-04-80x80.webp?version=29842'
  }
]

const logos = [
  'https://quanlytro.me/images/logo-customer/logo-1.png',
  'https://quanlytro.me/images/logo-customer/logo-4.png',
  'https://quanlytro.me/images/logo-customer/logo-2.png',
  'https://quanlytro.me/images/logo-customer/logo-3.png',
  'https://quanlytro.me/images/logo-customer/logo-5.png',
  'https://quanlytro.me/images/logo-customer/logo-6.png',
  'https://quanlytro.me/images/logo-customer/logo-7.png'
]
