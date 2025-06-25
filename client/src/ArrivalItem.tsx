import React, { ReactHTMLElement, useState } from 'react';
import './ArrivalItem.css';
export interface ArrivalItemProps {
    color: string;
    routeId: string;
    name: string;
    status: string;
};

const ArrivalItem: React.FC<ArrivalItemProps> = (props: ArrivalItemProps): React.JSX.Element => {
    return (
        <div className="AI">
            <div style={{ backgroundColor: props.color }} className='route-id'><p>{props.routeId}</p></div>
            <div className='route-name'>{props.name}</div>
            <div className='route-status'>{props.status}</div>

        </div>
    );
}

export default ArrivalItem;