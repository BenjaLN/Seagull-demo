"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"
import L from "leaflet"
import { SpotWithAvailability } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

interface HarborMapProps {
  spots: SpotWithAvailability[]
  onSpotClick?: (spot: SpotWithAvailability) => void
}

export function HarborMap({ spots, onSpotClick }: HarborMapProps) {
  const mapRef = useRef<L.Map | null>(null)

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'ledig':
        return '#22c55e' // green
      case 'reserveret':
        return '#f59e0b' // yellow
      case 'optaget':
        return '#ef4444' // red
      default:
        return '#6b7280' // gray
    }
  }

  const createCustomIcon = (color: string) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet')
    return L.icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0zm0 17c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z" fill="${color}"/>
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Kort (live)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[420px] w-full rounded-md border">
          <MapContainer
            center={[55.8833, 12.5167]} // Rungsted Havn coordinates
            zoom={16}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {spots.map((spot) => {
              const color = getMarkerColor(spot.current_status)
              const icon = createCustomIcon(color)
              
              return (
                <Marker
                  key={spot.id}
                  position={[spot.latitude, spot.longitude]}
                  icon={icon}
                  eventHandlers={{
                    click: () => onSpotClick?.(spot),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{spot.code}</h3>
                      {spot.name && <p className="text-sm text-gray-600">{spot.name}</p>}
                      <p className="text-sm">
                        Status: <span className="font-medium">{spot.current_status}</span>
                      </p>
                      {spot.expected_return_at && (
                        <p className="text-sm text-gray-600">
                          Forventet hjemkomst: {new Date(spot.expected_return_at).toLocaleString('da-DK')}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
