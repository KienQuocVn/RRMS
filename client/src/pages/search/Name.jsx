import { useTranslation } from 'react-i18next'
import { nearbyCampuses } from './search.data'
import SearchSidebarLinksSection from './sections/SearchSidebarLinksSection'

function Name() {
  const { t } = useTranslation()

  return (
    <SearchSidebarLinksSection
      title={t('searchPage.insights.nearbyTitle')}
      description={t('searchPage.insights.nearbyDescription')}
      items={nearbyCampuses}
      variant="chip"
    />
  )
}

export default Name
