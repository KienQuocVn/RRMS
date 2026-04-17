import { Link } from 'react-router-dom'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

const HomeIcon = ({ active }) => (
  <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.7343 2.5C14.9171 2.5 15.0938 2.56527 15.2327 2.68405L25.966 11.884C26.1359 12.0297 26.2343 12.2429 26.2343 12.4667V23.2C26.2343 23.81 25.992 24.395 25.5607 24.8263C25.1293 25.2577 24.5443 25.5 23.9343 25.5H17.801C17.5977 25.5 17.4027 25.4192 17.2589 25.2754C17.1151 25.1317 17.0343 24.9367 17.0343 24.7333V20.1333C17.0343 19.5233 16.792 18.9383 16.3607 18.507C15.9294 18.0757 15.3443 17.8333 14.7343 17.8333C14.1244 17.8333 13.5393 18.0757 13.108 18.507C12.6767 18.9383 12.4344 19.5233 12.4344 20.1333V24.7333C12.4344 24.9367 12.3536 25.1317 12.2098 25.2754C12.066 25.4192 11.871 25.5 11.6677 25.5H5.53437C4.92437 25.5 4.33936 25.2577 3.90803 24.8263C3.4767 24.395 3.23438 23.81 3.23438 23.2V12.4667C3.23438 12.2429 3.33276 12.0297 3.50271 11.884L14.236 2.68405C14.3749 2.56527 14.5516 2.5 14.7343 2.5Z" fill={active ? '#4bcffa' : '#8C8C8C'} />
  </svg>
)

const ListIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.28571 2C5.14907 2 4.05898 2.45153 3.25526 3.25526C2.45153 4.05898 2 5.14907 2 6.28571V17.7143C2 18.8509 2.45153 19.941 3.25526 20.7447C4.05898 21.5485 5.14907 22 6.28571 22H17.7143C18.8509 22 19.941 21.5485 20.7447 20.7447C21.5485 19.941 22 18.8509 22 17.7143V6.28571C22 5.14907 21.5485 4.05898 20.7447 3.25526C19.941 2.45153 18.8509 2 17.7143 2H6.28571Z" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <rect x="6" y="7" width="3" height="3" rx="1.5" fill="currentColor" />
    <path d="M12 8.5C12 8.08579 12.3358 7.75 12.75 7.75H17.25C17.6642 7.75 18 8.08579 18 8.5C18 8.91421 17.6642 9.25 17.25 9.25H12.75C12.3358 9.25 12 8.91421 12 8.5Z" fill="currentColor" />
    <rect x="6" y="14" width="3" height="3" rx="1.5" fill="currentColor" />
    <path d="M12 15.5C12 15.0858 12.3358 14.75 12.75 14.75H17.25C17.6642 14.75 18 15.0858 18 15.5C18 15.9142 17.6642 16.25 17.25 16.25H12.75C12.3358 16.25 12 15.9142 12 15.5Z" fill="currentColor" />
  </svg>
)

const PostIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.228 23.227" width="1em" height="1em" fill="none">
    <path d="M13.288 0a.759.759 0 110 1.518H3.396a1.88 1.88 0 00-1.877 1.877v16.438a1.88 1.88 0 001.877 1.877h16.437a1.88 1.88 0 001.877-1.877V9.488a.76.76 0 011.518 0v10.344a3.399 3.399 0 01-3.395 3.395H3.396A3.4 3.4 0 010 19.832V3.395A3.4 3.4 0 013.396 0zm6.022.21c.273-.1.564-.078.835-.038.276.042.57.205.83.461l.54.54 1.117 1.117c.24.24.394.497.46.766a1.68 1.68 0 01-.4 1.545l-.058.062c-.344.352-.7.707-1.048 1.05l-.631.63-6.33 6.328-.488.493-.038.04c-.307.31-.621.628-.939.932-.153.148-.339.219-.619.236l-3.014.184h-.03a.719.719 0 01-.484-.218c-.158-.156-.249-.358-.24-.543l.135-3.097c.016-.253.095-.443.248-.598l.157-.16.003-.002.082-.081 5.416-5.415a719.16 719.16 0 011.747-1.745l1.68-1.682c.144-.146.27-.275.397-.396a1.8 1.8 0 01.672-.408zm.493 1.428l-.221.219c-.153.151-.306.305-.457.456l-.536.537-8.151 8.152-.086 1.957 1.906-.115.312-.312.226-.224.05-.049.385-.38 8.401-8.403-1.211-1.209a8.233 8.233 0 01-.172-.175l-.027-.029c-.065-.068-.13-.137-.2-.206l-.22-.219z" fill="currentColor" />
  </svg>
)

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.4045 18.7012H4.58447C3.33447 18.6812 3.14269 17.0001 3.33447 16.5312C4.25656 14.6713 4.68036 12.6039 4.56447 10.5312V9.75119C4.56208 8.76941 4.75587 7.79705 5.13447 6.89119C5.50399 5.9826 6.05527 5.15909 6.75447 4.47119C7.44834 3.77705 8.27473 3.22952 9.18447 2.86119C10.0896 2.48125 11.0629 2.29067 12.0445 2.30119C14.0179 2.33276 15.8994 3.14096 17.2809 4.55055C18.6624 5.96015 19.4326 7.8575 19.4245 9.83119V10.5012C19.3053 12.5742 19.7293 14.6423 20.6545 16.5012C20.8442 17.4801 20.5307 18.359 19.4045 18.6812V18.7012Z" fill="currentColor" />
    <path d="M11.9945 22.4508C9.37453 22.4508 8.29453 20.6741 8.29453 18.7508V18.0008C8.29453 17.3008 9.69452 17.3008 9.69452 18.0008V18.7508C9.69584 19.9461 10.8081 21.0192 11.9945 21.0192C13.181 21.0192 14.2932 19.9461 14.2945 18.7508V18.0008C14.2945 17.3008 15.6945 17.3008 15.6945 18.0008V18.7508C15.6945 20.6741 14.6169 22.4508 11.9945 22.4508Z" fill="currentColor" />
  </svg>
)

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M11.9998 4.20078C7.41584 4.20078 3.6998 7.91682 3.6998 12.5008C3.6998 17.0847 7.41584 20.8008 11.9998 20.8008C16.5838 20.8008 20.2998 17.0847 20.2998 12.5008C20.2998 7.91682 16.5838 4.20078 11.9998 4.20078ZM2.2998 12.5008C2.2998 7.14362 6.64264 2.80078 11.9998 2.80078C17.357 2.80078 21.6998 7.14362 21.6998 12.5008C21.6998 17.8579 17.357 22.2008 11.9998 22.2008C6.64264 22.2008 2.2998 17.8579 2.2998 12.5008Z" fill="currentColor" />
    <path fillRule="evenodd" d="M11.9998 8.70078C10.3153 8.70078 8.9498 10.0663 8.9498 11.7508C8.9498 13.4352 10.3153 14.8008 11.9998 14.8008C13.6843 14.8008 15.0498 13.4352 15.0498 11.7508C15.0498 10.0663 13.6843 8.70078 11.9998 8.70078Z" fill="currentColor" />
    <path fillRule="evenodd" d="M12.0001 16.2008C8.10291 16.2008 5.35723 18.8782 5.35723 18.8782C5.18222 19.2229 5.3198 19.6443 5.66452 19.8193C6.00923 19.9943 6.43056 19.8567 6.60557 19.512C7.11134 18.5158 8.83528 17.0946 12.0001 16.2008C15.165 17.0946 16.889 18.5158 17.3947 19.512C17.5697 19.8567 17.9911 19.9943 18.3358 19.8193C18.6805 19.6443 18.8181 19.2229 18.6431 18.8782C18.0203 17.6515 15.8974 16.2008 12.0001 16.2008Z" fill="currentColor" />
  </svg>
)

const navItems = (t) => [
  { id: 'home', label: t('header.mobileNav.home'), to: '/' },
  { id: 'manage', label: t('header.mobileNav.manage'), to: '#' },
  { id: 'post', label: t('header.mobileNav.post'), to: '#', special: true },
  { id: 'notify', label: t('header.mobileNav.notify'), to: '#' },
  { id: 'account', label: t('header.mobileNav.account'), to: '#' }
]

export default function MobileNav({ isNotifyOpen, setIsNotifyOpen, isMobileAccountOpen, setIsMobileAccountOpen }) {
  const { t } = useTranslation()
  const items = navItems(t)

  return (
    <>
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          p: '0 8px 8px',
          bgcolor: '#fff'
        }}
      >
        <Box sx={{ width: '100%', display: 'flex' }}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              bgcolor: '#f4f4f4',
              borderRadius: '4px',
              position: 'relative',
              height: 36
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, width: 110, cursor: 'pointer', flexShrink: 0 }}>
              <Box sx={{ flex: 1, textAlign: 'center', fontSize: '0.875rem', color: '#222' }}>{t('header.mobileNav.wantRent')}</Box>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16">
                <path fill="#000" d="M6 6L11 11.5 1 11.5z" opacity=".8" transform="matrix(1 0 0 -1 0 17.5)" />
              </svg>
              <Box sx={{ width: 1, height: 28, borderRight: '1px solid #E8E8E8', ml: 0.5 }} />
            </Box>
            <Box
              component="input"
              type="text"
              autoComplete="off"
              placeholder={t('header.mobileNav.searchPlaceholder')}
              sx={{
                flex: 1,
                border: 'none',
                outline: 'none',
                bgcolor: 'transparent',
                fontSize: '0.9375rem',
                pl: 1.5,
                color: '#222222'
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box
        component="ul"
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 50,
          bgcolor: '#fff',
          m: 0,
          p: 0,
          listStyle: 'none',
          boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.25)',
          zIndex: 3
        }}
      >
        {items.map((item) => (
          <Box
            key={item.id}
            component="li"
            sx={{ flex: '1 1 auto', textAlign: 'center', position: 'relative' }}
          >
            {item.special ? (
              <>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 'calc(50% - 35px)',
                    top: -10,
                    width: 70,
                    height: 70,
                    bgcolor: '#4bcffa',
                    borderRadius: '50%'
                  }}
                />
                <Box
                  component={Link}
                  to={item.to}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    pt: '4px',
                    height: '100%',
                    textDecoration: 'none',
                    color: '#fff',
                    fontSize: '28px',
                    position: 'relative'
                  }}
                >
                  <PostIcon />
                  <Box component="span" sx={{ fontSize: '0.625rem', position: 'absolute', bottom: 0, color: '#fff' }}>
                    {item.label}
                  </Box>
                </Box>
              </>
            ) : item.id === 'home' ? (
              <Box
                component={Link}
                to={item.to}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  pt: '4px',
                  height: '100%',
                  textDecoration: 'none',
                  position: 'relative'
                }}
              >
                <HomeIcon active />
                <Box component="span" sx={{ fontSize: '0.625rem', position: 'absolute', bottom: 0, color: '#4bcffa' }}>
                  {item.label}
                </Box>
              </Box>
            ) : item.id === 'notify' ? (
              <Box
                onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  pt: '4px',
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  color: '#8C8C8C'
                }}
              >
                <BellIcon />
                <Box component="span" sx={{ fontSize: '0.625rem', position: 'absolute', bottom: 0, color: '#8c8c8c' }}>
                  {item.label}
                </Box>
              </Box>
            ) : item.id === 'account' ? (
              <Box
                onClick={() => setIsMobileAccountOpen(!isMobileAccountOpen)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  pt: '4px',
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  color: '#8C8C8C'
                }}
              >
                <UserIcon />
                <Box component="span" sx={{ fontSize: '0.625rem', position: 'absolute', bottom: 0, color: '#8c8c8c' }}>
                  {item.label}
                </Box>
              </Box>
            ) : (
              <Box
                component={Link}
                to={item.to}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  pt: '4px',
                  height: '100%',
                  textDecoration: 'none',
                  color: '#8C8C8C',
                  position: 'relative'
                }}
              >
                <ListIcon />
                <Box component="span" sx={{ fontSize: '0.625rem', position: 'absolute', bottom: 0, color: '#8c8c8c' }}>
                  {item.label}
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </>
  )
}
