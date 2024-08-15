"use client";

import { Task } from "@/types";
import { MapContainer } from "react-leaflet/MapContainer";

import { Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

export default function Map({ selectedData }: { selectedData: Task | null }) {
	if (window === undefined) {
		return null;
	}

	return (
		<MapContainer
			center={[
				selectedData?.centerDefault?.latitude || 0,
				selectedData?.centerDefault?.longitude || 0,
			]}
			zoom={selectedData?.zoomDefault || 13}
			// center={[51.505, -0.09]}
			// calculated center
			// zoom={13}
			// calculated zoom
			scrollWheelZoom={false}
			style={{ height: "100%", width: "100%" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{/* <Marker position={[51.505, -0.09]}>
														<Popup>
															A pretty CSS3 popup. <br /> Easily customizable.
														</Popup>
													</Marker> */}
			{selectedData?.locations.map((location) => (
				<Marker
					key={location.id}
					position={[location.latitude, location.longitude]}
				>
					<Popup>{location.placeName}</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}
