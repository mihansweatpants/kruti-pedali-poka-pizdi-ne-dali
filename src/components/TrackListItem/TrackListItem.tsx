import React, { FC } from 'react';

import { TrackData } from '../../types';
import { TrackTypeColor } from '../../utils';

import styles from './TrackListItem.module.css';

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

export default TrackListItem;
