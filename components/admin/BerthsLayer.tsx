"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { useBerthsStore } from "@/store/berths"
import { BerthStatus } from "@/lib/berths"

// Dynamically import CircleMarker to avoid SSR issues
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
)

const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
)

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

interface BerthsLayerProps {
  onBerthClick?: (berthId: string) => void
  selectedBerthId?: string | null
}

export function BerthsLayer({ onBerthClick, selectedBerthId }: BerthsLayerProps) {
  const { getVisibleBerths, setBerthStatus } = useBerthsStore()
  const visibleBerths = getVisibleBerths()

  const getBerthColor = (status: BerthStatus) => {
    if (status === "available") return "#22C55E" // Green
    return "#EF4444" // Red for booked
  }

  const handleBerthClick = (berthId: string) => {
    onBerthClick?.(berthId)
  }

  const handleStatusToggle = (berthId: string, currentStatus: BerthStatus) => {
    let newStatus: BerthStatus
    if (currentStatus === "available") {
      newStatus = "booked"
    } else {
      newStatus = "available"
    }
    setBerthStatus(berthId, newStatus)
  }

  return (
    <>
      {visibleBerths.map((berth) => {
        const isSelected = selectedBerthId === berth.id
        return (
          <CircleMarker
            key={berth.id}
            center={[berth.lat, berth.lng]}
            radius={isSelected ? 8 : 6}
            pathOptions={{
              fillColor: getBerthColor(berth.status),
              color: isSelected ? "#3b82f6" : "#ffffff",
              weight: isSelected ? 3 : 2,
              opacity: 1,
              fillOpacity: 0.8,
            }}
            eventHandlers={{
              click: () => handleBerthClick(berth.id),
            }}
          >
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            <div className="text-center">
              <div className="font-semibold">{berth.id}</div>
              <div className="text-sm text-gray-600">{berth.pier}</div>
            <div className={`text-sm font-medium ${
              berth.status === "available" ? "text-green-600" :
              "text-red-600"
            }`}>
              {berth.status === "available" ? "Ledig" : "Optaget"}
            </div>
            </div>
          </Tooltip>
          
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-lg">{berth.id}</h3>
              <p className="text-sm text-gray-600 mb-2">{berth.pier}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                berth.status === "available"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {berth.status === "available" ? "Ledig" : "Optaget"}
              </span>
                </div>
                <button
                  onClick={() => handleStatusToggle(berth.id, berth.status)}
                  className="w-full px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Skift til {berth.status === "available" ? "Optaget" : "Ledig"}
                </button>
              </div>
            </div>
          </Popup>
        </CircleMarker>
        )
      })}
    </>
  )
}






