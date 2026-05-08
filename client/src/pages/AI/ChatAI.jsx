import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { env } from '~/configs/environment'

const CHAT_SCRIPT_SELECTOR = 'script[src*="fptai-livechat.js"]'
const CHAT_STYLESHEET_SELECTOR = 'link[href*="fptai-livechat.css"]'

function ChatAI() {
  useEffect(() => {
    const liveChatBaseUrl = `${document.location.protocol}//livechat.fpt.ai/v36/src`
    const liveChatSocketUrl = 'livechat.fpt.ai:443'
    const fptAppCode = env.FPT_APP_CODE
    const fptAppName = 'rrms3'

    const customStyles = {
      headerBackground: 'linear-gradient(86.7deg, #3353a2ff 0.85%, #31b7b7ff 98.94%)',
      headerLogoLink: 'https://your-logo-url.com/logo.png',
      headerTextColor: '#fff',
      headerLogoEnable: false,
      headerText: 'Hệ thống hỗ trợ nhà trọ RRMS',
      avatarBot:
        '/iconAI.png',
      sendMessagePlaceholder: 'Nhập tin nhắn của bạn...',
      floatButtonLogo:
        '/iconAI.png',
      floatButtonTooltip: 'Hỗ trợ trực tuyến nhà trọ RRMS',
      customerWelcomeText: 'Vui lòng nhập tên của bạn',
      customerButtonText: 'Bắt đầu trò chuyện',
      prefixEnable: false,
      prefixOptions: ['Anh', 'Chi'],
      floatButtonTooltipEnable: true,
      prefixPlaceholder: 'Danh xưng'
    }

    const fptLiveChatConfigs = {
      appName: fptAppName,
      appCode: fptAppCode,
      themes: '',
      styles: customStyles
    }

    const adjustLiveChatButtonMargin = () => {
      const button = document.getElementById('fpt_ai_livechat_button')
      const tooltip = document.getElementById('fpt_ai_livechat_button_tooltip')

      if (!button || !tooltip || window.innerWidth > 800) return

      tooltip.style.setProperty('bottom', '80px', 'important')
      button.style.setProperty('bottom', '80px', 'important')
    }

    const initializeChat = () => {
      if (typeof window.fpt_ai_render_chatbox !== 'function') return

      window.fpt_ai_render_chatbox(fptLiveChatConfigs, liveChatBaseUrl, liveChatSocketUrl)
      window.fpt_ai_chatbox_rendered = true
      adjustLiveChatButtonMargin()
    }

    if (!window.fpt_ai_chatbox_rendered) {
      const existingScript = document.querySelector(CHAT_SCRIPT_SELECTOR)
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = `${liveChatBaseUrl}/static/fptai-livechat.js`
        script.async = true
        script.onload = initializeChat
        document.body.appendChild(script)
      } else {
        initializeChat()
      }

      const existingStylesheet = document.querySelector(CHAT_STYLESHEET_SELECTOR)
      if (!existingStylesheet) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = `${liveChatBaseUrl}/static/fptai-livechat.css`
        document.body.appendChild(link)
      }

      adjustLiveChatButtonMargin()
      window.addEventListener('resize', adjustLiveChatButtonMargin)

      return () => {
        window.removeEventListener('resize', adjustLiveChatButtonMargin)

        if (window.fpt_ai_chatbox_rendered) {
          document.getElementById('fpt-chat-container')?.replaceChildren()
          window.fpt_ai_chatbox_rendered = false
        }
      }
    }
  }, [])

  return createPortal(<div id="fpt-chat-container"></div>, document.body)
}

export default ChatAI
