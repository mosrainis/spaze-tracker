import {Icon, Point} from 'leaflet';
import marker from '@/app/icons/iss-icon.png';

const trackerMarker = new Icon({
    iconUrl: marker.src,
    iconRetinaUrl: marker.src,
    iconAnchor: undefined,
    popupAnchor: undefined,
    shadowUrl: undefined,
    shadowSize: undefined,
    shadowAnchor: undefined,
    iconSize: new Point(50, 50)
});

export { trackerMarker };