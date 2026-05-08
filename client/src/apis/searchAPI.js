import publicHttpClient from './publicHttpClient'

export const searchByName = async (keyword) => {
  return publicHttpClient.get('/api/v1/search/by-address', {
    params: {
      address: keyword
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

export const getSearchRooms = async () => {
  const response = await publicHttpClient.get('/api/v1/search')
  return response.data
}

export const getLatestSearchRooms = async () => {
  const response = await publicHttpClient.get('/api/v1/search/latest')
  return response.data
}
