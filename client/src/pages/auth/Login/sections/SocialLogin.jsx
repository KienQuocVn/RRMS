import { Grid } from '@mui/material'
import { GoogleLogin } from '@react-oauth/google'
import { LoginSocialFacebook } from 'reactjs-social-login'
import { FacebookLoginButton } from 'react-social-login-buttons'
import { env } from '~/configs/environment'

// Facebook button style override — chỉ cần 1 rule nhỏ không có trong MUI
import './SocialLogin.css'

const SocialLogin = ({ loginWithGoogle, loginWithFacebook }) => {
  return (
    <Grid container spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
      <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={loginWithGoogle}
          onError={() => console.log('Google Login Failed')}
        />
      </Grid>

      <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
        <LoginSocialFacebook
          appId={env.FACEBOOK_APP_ID}
          onResolve={loginWithFacebook}
          onReject={(error) => console.log(error)}
        >
          <FacebookLoginButton className="facebook-login-btn" />
        </LoginSocialFacebook>
      </Grid>
    </Grid>
  )
}

export default SocialLogin
