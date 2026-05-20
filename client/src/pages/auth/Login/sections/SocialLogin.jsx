import { Box, Grid } from '@mui/material'
import { LoginSocialFacebook } from 'reactjs-social-login'
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons'
import { env } from '~/configs/environment'
import './SocialLogin.css'

const SocialLogin = ({ loginWithGoogle, loginWithFacebook }) => {
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="stretch" sx={{ mb: 1, mt: 1 }}>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box className="social-login-slot">
          <GoogleLoginButton className="social-login-control social-login-control--google" onClick={loginWithGoogle} />
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box className="social-login-slot">
          <LoginSocialFacebook
            appId={env.FACEBOOK_APP_ID}
            fields="id,name,email,picture"
            scope="email,public_profile"
            onResolve={loginWithFacebook}
            onReject={(error) => console.log(error)}
          >
            <FacebookLoginButton className="social-login-control social-login-control--facebook" />
          </LoginSocialFacebook>
        </Box>
      </Grid>
    </Grid>
  )
}

export default SocialLogin
