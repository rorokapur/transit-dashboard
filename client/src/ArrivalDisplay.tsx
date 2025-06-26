import React, { ComponentProps, ReactHTMLElement, useState } from 'react';
import './ArrivalDisplay.css';
import ArrivalItem, { ArrivalItemProps } from "./ArrivalItem";
import { ArrivalData, ArrivalInfo } from './transitdata';

export interface ArrivalDisplayProps {
    arrivalData: ArrivalData;
};

const ArrivalDisplay: React.FC<ArrivalDisplayProps> = (props: ArrivalDisplayProps): React.JSX.Element => {
    const items: React.JSX.Element[] = [];
    for(const item of props.arrivalData) {
        items.push(<ArrivalItem data={item} color="green"></ArrivalItem>);
        items.push(<hr></hr>);
    }
    return (
        <div className='AD'>
            {items}
        </div>
    );
}

export default ArrivalDisplay;