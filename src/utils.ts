import { TrackData } from './types';

export const TrackTypes = [
  'Велопешеходная дорожка с совмещенным движением',
  'велосипедная полоса попутного движения',
  'Двустороняя велополоса',
  'велосипедная дорожка двухстороннего движения',
  'велосипедная дорожка одностороннего движения',
  'велосипедная полоса встречного движения',
  'Велопешеходная дорожка с раздельным движением',
  'Велопешеходная зона',
  'велосипедная полоса совмещенного движения с моторизированным транспортом',
  'Улица с приоритетным движением велосипедистов',
];

export const TrackTypeColor = {
  [TrackTypes[0]]: '#ff6ea8',
  [TrackTypes[1]]: '#926eff',
  [TrackTypes[2]]: '#ff0000',
  [TrackTypes[3]]: '#1cfffb',
  [TrackTypes[4]]: '#395c20',
  [TrackTypes[5]]: '#205c4d',
  [TrackTypes[6]]: '#a89800',
  [TrackTypes[7]]: '#00ff1e',
  [TrackTypes[8]]: '#6b596e',
  [TrackTypes[9]]: '#000000',
}

export function getTrackData(geoObject: ymaps.GeoObject): TrackData {
  return (geoObject.properties as any)._data.trackData;
}

export function getMapInstance(): ymaps.Map {
  return (window as any).mapInstance;
}

export function renderBubbleContent(trackData: TrackData): string {
  return `
    <div>
      <div>
        <div>Тип велодорожки:</div>
        <div style="padding-left: 5px;">
          ${
            trackData.Type.map(type => (
              `<div style="display: flex; align-items: baseline;">
                <div style="background-color: ${TrackTypeColor[type]}; border-radius: 50%; height: 5px; width: 5px; margin-right: 5px;"></div>
                <div>${type}</div>
              </div>
              `)
            ).join('')
          }
        </div>
      </div>

      <div style="margin: 10px 0px; width: 100%; height: 1px; background: #d9d9d9;"></div>

      <div>
        Расположение: ${trackData.Location}
      </div>
    </div>
  `;
}