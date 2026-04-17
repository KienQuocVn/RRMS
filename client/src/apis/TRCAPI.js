import httpClient from './httpClient'

export const CreateTRC = async (TRC) => {
  return await httpClient.post('/TemRC/insert-TemRC', TRC)
}

export const getTRCByusername = async (username) => {
  if (!username) {
    throw new Error('username không hợp lệ')
  }
  return await httpClient.get(`/TemRC/get-TemRC-account?username=${username}`)
}

export const updateTRCById = async (id, TRC) => {
  if (!TRC && !id) {
    throw new Error('id va TRC không hợp lệ')
  }
  return await httpClient.put(`/TemRC/update-TemRC/${id}`, TRC)
}
