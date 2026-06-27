import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'

const VIETNAM_CENTER = [16.0, 107.0]
const DEFAULT_ZOOM = 6
const DETAIL_ZOOM = 16

let leafletLoadPromise = null

const loadLeafletAssets = () => {
  if (leafletLoadPromise) return leafletLoadPromise

  leafletLoadPromise = new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L)
      return
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const existingScript = document.getElementById('leaflet-js')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.L))
      existingScript.addEventListener('error', reject)
      return
    }

    const script = document.createElement('script')
    script.id = 'leaflet-js'
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => {
      const L = window.L
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
      })
      resolve(L)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })

  return leafletLoadPromise
}

const AddressMapPicker = ({ lat, lng, onPositionChange, allowMapClick, active }) => {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const onPositionChangeRef = useRef(onPositionChange)
  const allowMapClickRef = useRef(allowMapClick)

  useEffect(() => {
    onPositionChangeRef.current = onPositionChange
  }, [onPositionChange])

  useEffect(() => {
    allowMapClickRef.current = allowMapClick
  }, [allowMapClick])

  useEffect(() => {
    if (!active) return undefined

    let cancelled = false

    loadLeafletAssets()
      .then((L) => {
        if (cancelled || !containerRef.current || mapRef.current) return

        const map = L.map(containerRef.current, {
          center: VIETNAM_CENTER,
          zoom: DEFAULT_ZOOM
        })

        L.tileLayer('https://maps.vietmap.vn/api/tm/{z}/{x}/{y}@2x.png?apikey=e1517a70fd7e461dc706f512c0e763b1b13ef7587998ff43', {
          attribution: '&copy; <a href="https://vietmap.vn">VietMap</a>',
          maxZoom: 22
        }).addTo(map)

        map.on('click', (e) => {
          if (!allowMapClickRef.current) return

          const { lat: clickLat, lng: clickLng } = e.latlng

          if (markerRef.current) {
            markerRef.current.setLatLng([clickLat, clickLng])
          } else {
            markerRef.current = L.marker([clickLat, clickLng], { draggable: true }).addTo(map)
            markerRef.current.on('dragend', () => {
              const pos = markerRef.current.getLatLng()
              onPositionChangeRef.current?.({ lat: pos.lat, lng: pos.lng })
            })
          }

          onPositionChangeRef.current?.({ lat: clickLat, lng: clickLng })
        })

        mapRef.current = map
        setTimeout(() => map.invalidateSize(), 350)
      })
      .catch(console.error)

    return () => {
      cancelled = true
    }
  }, [active])

  useEffect(() => {
    if (!active) return undefined

    const timer = setTimeout(() => {
      mapRef.current?.invalidateSize()
    }, 350)

    return () => clearTimeout(timer)
  }, [active])

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !window.L) return

    const L = window.L
    const map = mapRef.current

    if (lat == null || lng == null) {
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
        markerRef.current = null
      }
      map.setView(VIETNAM_CENTER, DEFAULT_ZOOM)
      return
    }

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
    } else {
      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map)
      markerRef.current.on('dragend', () => {
        const pos = markerRef.current.getLatLng()
        onPositionChangeRef.current?.({ lat: pos.lat, lng: pos.lng })
      })
      map.flyTo([lat, lng], DETAIL_ZOOM)
    }
  }, [lat, lng])

  return (
    <Box
      ref={containerRef}
      sx={{
        height: 280,
        width: '100%',
        borderRadius: 1,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: '#f5f5f5',
        zIndex: 0
      }}
    />
  )
}

export default AddressMapPicker
