import React, { ReactHTMLElement, useState } from 'react';
import './ArrivalItem.css';
export interface ArrivalItemProps {
    color: string;
    name: string;
};

const ArrivalItem: React.FC<ArrivalItemProps> = (props: ArrivalItemProps): React.JSX.Element => {
    return (
        <div className="AI">
            <p>fd</p>Route {props.name}
        </div>
    );
}

export default ArrivalItem;