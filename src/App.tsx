import React, { FC, useState, useEffect, ChangeEventHandler } from 'react';

import data from './data.json';
import { useDebounce } from './hooks';
import { TrackTypeColor, renderBubbleContent, getTrackData, getMapInstance } from './utils';

import { TrackListItem } from './components'

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

      (window as any)['mapInstance'] = moscowMap;

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
                balloonContentBody: renderBubbleContent(track),
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
      setSearchResult(trackLines);

      trackLines.forEach(lines => {
        lines.forEach(line => {
          moscowMap.geoObjects.add(line);
        });
      });
    });
  }, []);

  const [trackLines, setTrackLines] = useState<ymaps.GeoObject[][]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [searchResult, setSearchResult] = useState<ymaps.GeoObject[][]>([]);

  const handleSearchTermChange: ChangeEventHandler<HTMLInputElement> = ({ target: { value } } ) => {
    setSearchTerm(value);
  };

  useEffect(
    () => {
      const result = trackLines.filter(lines => {
        const reg = new RegExp(searchTerm, 'i');
        const trackName = getTrackData(lines[0]).Name;

        return reg.test(trackName);
      });

      setSearchResult(result);
    },
    [debouncedSearchTerm],
  );

  useEffect(
    () => {
      const map = getMapInstance();

      if (map) {
        map.geoObjects.removeAll();
  
        searchResult.forEach(lines => {
          lines.forEach(line => {
            map.geoObjects.add(line);
          });
        });
      }
    },
    [searchResult],
  );

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
        {
          searchResult.length === 0 && (
            <div className={styles.searchResultsEmpty}>
              По вашему запросу ничего не найдено <span>☹️</span>
            </div>
          )
        }

        {
          searchResult.map(lines => {
            const trackData = getTrackData(lines[0]);

            return (
              <TrackListItem
                key={trackData.global_id}
                data={trackData}
                onClick={createTrackLineClickHandler(lines[0])}
              />
            );
          })
        }
      </div>
    </div>
  );
};

export default App;
