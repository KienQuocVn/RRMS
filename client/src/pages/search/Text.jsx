import { articleSections } from './search.data'
import SearchArticleSection from './sections/SearchArticleSection'

function Text({ keyword, totalRooms }) {
  return <SearchArticleSection keyword={keyword} totalRooms={totalRooms} articleSections={articleSections} />
}

export default Text
