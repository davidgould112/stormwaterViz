import { LatLng } from "leaflet";

export default interface LocationEvent {
  latlng:	LatLng,
  bounds:	LatLng,
  accuracy:	number,
  altitude:	number,	
  altitudeAccuracy:	number,
  heading:	number,
  speed:	number,
  timestamp:	number, 
  type:	string,
  target:	object,
  sourceTarget: object,
  propagatedFrom:	object,
  layer:	object
}