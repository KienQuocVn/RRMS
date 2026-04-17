import { popularAreaColumns, postingSteps, searchStats } from './search.data'
import SearchInsightsSection from './sections/SearchInsightsSection'

function ItemSearch() {
  return (
    <SearchInsightsSection popularAreaColumns={popularAreaColumns} postingSteps={postingSteps} searchStats={searchStats} />
  )
}

export default ItemSearch
