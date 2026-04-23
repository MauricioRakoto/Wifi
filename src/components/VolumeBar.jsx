import React from 'react';
import { Bar, LabelList as RechartsLabelList } from 'recharts';

// On change le nom pour éviter le conflit avec Recharts
const VolumeBar = () => {
    return (
        <Bar dataKey="volume" fill="#0dcaf0" radius={[4, 4, 0, 0]} barSize={30}>
            {/* On utilise RechartsLabelList car on l'a renommé à l'import */}
            <RechartsLabelList
                dataKey="volume"
                position="top"
                offset={10}
                style={{
                    fill: '#adb5bd',
                    fontSize: '10px',
                    fontWeight: '600',
                    fontFamily: 'inherit'
                }}
                formatter={(value) => value > 0 ? `${value} Go` : ''}
            />
        </Bar>
    );
};

export default VolumeBar;