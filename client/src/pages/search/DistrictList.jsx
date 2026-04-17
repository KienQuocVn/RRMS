import { useTranslation } from 'react-i18next'
import { districtLinks } from './search.data'
import SearchSidebarLinksSection from './sections/SearchSidebarLinksSection'

function DistrictLinks() {
  const { t } = useTranslation()

  return (
    <SearchSidebarLinksSection
      title={t('searchPage.insights.districtTitle')}
      description={t('searchPage.insights.districtDescription')}
      items={districtLinks}
      variant="grid"
    />
  )
}

export default DistrictLinks
