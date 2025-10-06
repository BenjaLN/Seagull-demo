"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"
import L from "leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { MockSpot } from "@/lib/mock"
import { FixSize } from "./FixSize"
import { BerthsLayer } from "./BerthsLayer"

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

interface AdminMapProps {
  spots: MockSpot[]
  onSpotClick?: (spot: MockSpot) => void
  selectedSpotId?: string
  onBerthClick?: (berthId: string) => void
  selectedBerthId?: string | null
  id?: string
}

export function AdminMap({ spots, onSpotClick, selectedSpotId, onBerthClick, selectedBerthId, id }: AdminMapProps) {
  const mapRef = useRef<L.Map | null>(null)

  // Rungsted Havn coordinates
  const harborCenter: [number, number] = [55.88509, 12.54563]

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

  const createCustomIcon = (color: string, isSelected: boolean = false) => {
    const size = isSelected ? 30 : 25
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet')
    
    return L.icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="${size}" height="${size * 1.64}" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0zm0 17c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z" fill="${color}" stroke="${isSelected ? '#3b82f6' : 'white'}" stroke-width="${isSelected ? '3' : '2'}"/>
        </svg>
      `)}`,
      iconSize: [size, size * 1.64],
      iconAnchor: [size / 2, size * 1.64],
      popupAnchor: [1, -34],
    })
  }

  const createHarborIcon = () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet')
    
    // Create SVG without emoji to avoid btoa encoding issues
    const svgString = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="white" stroke-width="4"/>
        <path d="M20 8 L16 16 L20 20 L24 16 Z" fill="white"/>
        <line x1="20" y1="20" x2="20" y2="32" stroke="white" stroke-width="2"/>
        <circle cx="20" cy="32" r="3" fill="white"/>
      </svg>
    `
    
    return L.icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svgString)}`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    })
  }

  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Kort (live)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[420px] rounded-md border">
          <MapContainer
            center={harborCenter}
            zoom={16}
            className="w-full h-full"
            ref={mapRef}
          >
            <FixSize />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Harbor center marker */}
            <Marker
              position={harborCenter}
              icon={createHarborIcon()}
            >
              <Popup>
                <div className="p-2 text-center">
                  <h3 className="font-semibold text-lg">Rungsted Havn</h3>
                  <p className="text-sm text-gray-600">Havnplads administration</p>
                </div>
              </Popup>
            </Marker>

            {/* Spot markers */}
            {spots.map((spot) => {
              const color = getMarkerColor(spot.current_status)
              const isSelected = selectedSpotId === spot.id
              const icon = createCustomIcon(color, isSelected)
              
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
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-semibold text-lg">{spot.code}</h3>
                      {spot.name && <p className="text-sm text-gray-600 mb-2">{spot.name}</p>}
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Status:</span> {spot.current_status}
                        </p>
                        {spot.expected_return_at && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Forventet hjemkomst:</span><br />
                            {new Date(spot.expected_return_at).toLocaleString('da-DK')}
                          </p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
            
            {/* Berths Layer */}
            <BerthsLayer onBerthClick={onBerthClick} selectedBerthId={selectedBerthId} />
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
