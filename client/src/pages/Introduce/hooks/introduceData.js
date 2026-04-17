import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded'
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'

export const storyParagraphKeys = ['introduce.story.paragraphs.0', 'introduce.story.paragraphs.1']

export const missionItemKeys = ['introduce.missionVision.missionItems.0', 'introduce.missionVision.missionItems.1']

export const coreValueKeys = [
  'introduce.coreValues.items.0',
  'introduce.coreValues.items.1',
  'introduce.coreValues.items.2',
  'introduce.coreValues.items.3',
  'introduce.coreValues.items.4',
  'introduce.coreValues.items.5'
]

export const capabilityItemKeys = [
  'introduce.capability.items.0',
  'introduce.capability.items.1',
  'introduce.capability.items.2',
  'introduce.capability.items.3'
]

export const promoCards = [
  {
    titleKey: 'introduce.promo.cards.0.title',
    descriptionKey: 'introduce.promo.cards.0.description',
    buttonLabelKey: 'introduce.promo.cards.0.buttonLabel',
    to: '/register',
    image: '/banner1.png',
    background: 'linear-gradient(135deg, #4f7cff 0%, #6ec8ff 100%)'
  },
  {
    titleKey: 'introduce.promo.cards.1.title',
    descriptionKey: 'introduce.promo.cards.1.description',
    buttonLabelKey: 'introduce.promo.cards.1.buttonLabel',
    to: '/support',
    image: '/banner2.png',
    background: 'linear-gradient(135deg, #7c4dff 0%, #8b7cff 100%)'
  }
]

export const postingSteps = [
  {
    step: '1',
    titleKey: 'introduce.postSteps.items.0.title',
    descriptionKey: 'introduce.postSteps.items.0.description',
    color: '#00a76f'
  },
  {
    step: '2',
    titleKey: 'introduce.postSteps.items.1.title',
    descriptionKey: 'introduce.postSteps.items.1.description',
    color: '#2196f3'
  },
  {
    step: '3',
    titleKey: 'introduce.postSteps.items.2.title',
    descriptionKey: 'introduce.postSteps.items.2.description',
    color: '#ff9800'
  }
]

export const stats = [
  {
    labelKey: 'introduce.stats.items.landlords',
    value: '13,177+',
    Icon: ApartmentRoundedIcon
  },
  {
    labelKey: 'introduce.stats.items.rooms',
    value: '197,655',
    Icon: ManageAccountsRoundedIcon
  },
  {
    labelKey: 'introduce.stats.items.tenants',
    value: '592,965+',
    Icon: Groups2RoundedIcon
  },
  {
    labelKey: 'introduce.stats.items.brokers',
    value: '300+',
    Icon: HandshakeRoundedIcon
  }
]
