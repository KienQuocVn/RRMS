import httpClient from './httpClient'

export const postBulletinBoardReview = async (data) => {
  const response = await httpClient.post('/bulletin-board-reviews', data)
  return response.data
}

export const getBulletinBoardReviewByBulletinBoardIdAndUsername = async (bulletinBoardId, username) => {
  const response = await httpClient.get(
    `/bulletin-board-reviews?bulletinBoardId=${bulletinBoardId}&username=${username}`
  )
  return response.data
}

export const getRatingHistory = async (username) => {
  const response = await httpClient.get(`/bulletin-board-reviews/rating-history?username=${username}`)
  return response.data
}

export const deleteBulletinBoardReview = async (id) => {
  const response = await httpClient.delete(`/bulletin-board-reviews/${id}`)
  return response.data
}
