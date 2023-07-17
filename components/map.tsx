import { useRouter } from "next/router";
import { MapContainer, TileLayer, useMap, Marker, Popup, Circle } from 'react-leaflet';
import styles from "../styles/map.module.scss";
import TRACKER_CONSTSNTS from "../constants/trackerConstants";
import 'leaflet/dist/leaflet.css';
import { trackerMarker } from "./mapElements";
import { SatelliteCoord } from "../models/satellite.model";

const MAP_URL = `https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=${TRACKER_CONSTSNTS.MAP_TOKEN}`;

interface MapInput {
    target: SatelliteCoord;
}

export default function Map({target}: MapInput) {
    const router = useRouter();
    const position: [number, number] = [ target.lat, target.long ];

    return (
        <div className={styles.mapContainer}>
            <MapContainer className={styles.mapElement} center={position} zoom={3} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; By <a target="_blank" href="https://github.com/mosrainis">Mosrainis</a>'
                    url={MAP_URL}
                />
                <Marker
                    position={position}
                    icon={ trackerMarker }
                />
                <Circle
                    center={position}
                    radius={1000000}
                />
            </MapContainer>
        </div>
    );
}