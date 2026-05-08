import publicHttpClient from './publicHttpClient'

export const searchByName = async (keyword) => {
  return publicHttpClient.get('/api/v1/search', {
    params: {
      query: keyword
    }
  })
}

export const roomASC = async (sortOrder = 'ASC') => {
  const response = await publicHttpClient.get('/api/v1/search/sort', {
    params: {
      sortOrder
    }
  })

  return response.data
}

export const getSearchRooms = async (params = {}) => {
  const response = await publicHttpClient.get('/api/v1/search', { params })
  return response.data
}

export const getLatestSearchRooms = async () => {
  const response = await publicHttpClient.get('/api/v1/search/latest')
  return response.data
}
