import PropTypes from 'prop-types';
import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

const MapTracker = ({ position, path, hospital }) => (
  <div className="glass-panel h-full overflow-hidden rounded-2xl sm:rounded-3xl">
    <MapContainer center={[position.lat, position.lng]} zoom={7} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      <Marker position={[position.lat, position.lng]} icon={icon}>
        <Tooltip direction="top" offset={[0, -30]}>
          Courier · ETA {hospital.eta}
        </Tooltip>
      </Marker>
      {hospital?.coordinates ? (
        <Marker position={[hospital.coordinates.lat, hospital.coordinates.lng]} icon={icon}>
          <Tooltip direction="top" offset={[0, -30]}>
            {hospital.name}
          </Tooltip>
        </Marker>
      ) : null}
      {path?.length ? (
        <Polyline
          positions={path.map((p) => [p.lat, p.lng])}
          pathOptions={{ color: '#60a5fa', weight: 4, opacity: 0.7 }}
        />
      ) : null}
    </MapContainer>
  </div>
);

MapTracker.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired
    })
  ),
  hospital: PropTypes.shape({
    name: PropTypes.string,
    eta: PropTypes.string,
    coordinates: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number
    })
  })
};

MapTracker.defaultProps = {
  path: [],
  hospital: {
    name: 'Recipient Hospital',
    eta: '45 mins',
    coordinates: null
  }
};

export default MapTracker;
