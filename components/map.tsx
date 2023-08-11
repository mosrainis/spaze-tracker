import { useRouter } from "next/router";
import { MapContainer, TileLayer, useMap, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import styles from "../styles/map.module.scss";
import TRACKER_CONSTSNTS from "../constants/trackerConstants";
import 'leaflet/dist/leaflet.css';
import { trackerMarker } from "./mapElements";
import { SatelliteCoord } from "../models/satellite.model";

const MAP_URL = `https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=${TRACKER_CONSTSNTS.MAP_TOKEN}`;

interface MapInput {
    target: SatelliteCoord;
    incomingGroundTracks: any;
    pastGroundTracks: any;
}

export default function Map({target, incomingGroundTracks, pastGroundTracks}: MapInput) {
    const router = useRouter();
    const position: [number, number] = [ target.lat, target.long ];
    
    return (
        <div className={styles.mapContainer}>
            <MapContainer className={styles.mapElement} center={position} zoom={3} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; By <a target="_blank" href="https://github.com/mosrainis">Mosrainis</a>'
                    url={MAP_URL}
                    // noWrap={true}
                />
                <Marker
                    position={position}
                    icon={ trackerMarker }
                />
                <Circle
                    center={position}
                    radius={1000000}
                />

                <Polyline positions={incomingGroundTracks.type1} />
                <Polyline positions={incomingGroundTracks.type2} />

                <Polyline positions={pastGroundTracks.type1} color="red"/>
                <Polyline positions={pastGroundTracks.type2} color="red"/>

            </MapContainer>
        </div>
    );
}