import React, { ReactHTMLElement, useState } from 'react';
import './ArrivalItem.css';
import { ArrivalInfo } from './transitdata';
export interface ArrivalItemProps {
    color: string;
    data: ArrivalInfo;
};

const ArrivalItem: React.FC<ArrivalItemProps> = (props: ArrivalItemProps): React.JSX.Element => {
    return (
        <div className="AI">
            <div style={{ backgroundColor: props.color }} className='route-id'><b>{props.data.routeId}</b></div>
            <div className='route-name'>{props.data.name}</div>
            <div className='route-status'>{(props.data.timeToArrival > 0) ? <b>{props.data.timeToArrival} min</b> : <b>Now</b> }</div>
        </div>
    );
}

export default ArrivalItem;