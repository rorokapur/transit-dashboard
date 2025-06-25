import React, { ComponentProps, ReactHTMLElement, useState } from 'react';
import './ArrivalDisplay.css';
import ArrivalItem from "./ArrivalItem";

export interface ArrivalDisplayProps {

};

const ArrivalDisplay: React.FC = (props: ArrivalDisplayProps): React.JSX.Element => {
    return (
        <div className='AD'>
            <ArrivalItem name="Express: UW Bothell - UW Seattle" routeId="372" color="green" status='3 min'></ArrivalItem>
            <hr></hr>
            <ArrivalItem name="Sand Point - East Green Lake" routeId="62" color="lime" status='1 min'></ArrivalItem>
            <hr></hr>
            <ArrivalItem name="Angle Lake - Lynnwood City Center" routeId="1" color="blue" status="0 min"></ArrivalItem>
        </div>
    );
}

export default ArrivalDisplay;