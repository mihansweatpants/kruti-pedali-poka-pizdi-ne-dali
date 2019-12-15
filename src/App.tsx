import React, { FC, useState, useEffect, ChangeEventHandler } from 'react';

import data from './data.json';
import { TrackData } from './types';

import styles from './App.module.css';

const { ymaps } = window;

const App: FC = () => {
  useEffect(() => {
    ymaps.ready().then(() => {
      const moscowMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 10,
        controls: ['smallMapDefaultSet'],
      });

      (window as any)['moscowMap'] = moscowMap;

      const trackLines = data.map(track => {
        const {
          Name,
          Type,
          geoData: { coordinates },
        } = track;

        const lines = coordinates.map(coordinatesArr => {
          return new ymaps.GeoObject(
            {
              geometry: {
                type: 'LineString',
                coordinates: coordinatesArr,
              } as any,
              properties: {
                balloonContentHeader: Name,
                balloonContentBody: '<b>test</b>',
                trackData: track,
              },
            },
            {
              strokeWidth: 3,
              strokeColor: TrackTypeColor[Type[0]],
            }
          );
        });

        return lines;
      });

      setTrackLines(trackLines);

      trackLines.forEach(lines => {
        lines.forEach(line => {
          moscowMap.geoObjects.add(line);
        });
      });
    });
  }, []);

  const [trackLines, setTrackLines] = useState<ymaps.GeoObject[][]>([]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchTermChange: ChangeEventHandler<HTMLInputElement> = ({ target: { value } } ) => {
    setSearchTerm(value);
  };

  const createTrackLineClickHandler = (trackLine: ymaps.GeoObject) => () => {
    if (trackLine.balloon.isOpen()) {
      trackLine.balloon.close();
    }
    else {
      trackLine.balloon.open();
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Можно поискать"
          value={searchTerm}
          onChange={handleSearchTermChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.searchResults}>
        {trackLines
          .filter(lines => {
            const reg = new RegExp(searchTerm, 'i');
            const trackName = getTrackData(lines[0]).Name;

            return reg.test(trackName);
          })
          .map(lines => {
            const trackData = getTrackData(lines[0]);

            return (
              <TrackListItem
                key={trackData.global_id}
                data={trackData}
                onClick={createTrackLineClickHandler(lines[0])}
              />
            );
          })}
      </div>
    </div>
  );
};

interface Props {
  data: TrackData;
  onClick: () => void;
}

const TrackListItem: FC<Props> = ({ data, onClick }) => {
  const { Name, global_id, Type } = data;

  return (
    <div onClick={onClick} key={global_id} className={styles.trackItem}>
      <div className={styles.trackName}>
        {Name}
      </div>

      <div className={styles.trackType}>
        {
          Type.map(trackType => (
            <div key={trackType} className={styles.trackTypeName}>
              <div className={styles.trackTypeNameBullet} style={{ backgroundColor: TrackTypeColor[trackType] }} />
              <div className={styles.trackTypeNameText}>
                {trackType}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

const TrackTypes = [
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

const TrackTypeColor = {
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

function getTrackData(geoObject: ymaps.GeoObject): TrackData {
  return (geoObject.properties as any)._data.trackData;
}

export default App;
