import React, { ReactHTMLElement, useState } from 'react';
import './ArrivalDisplay.css';
import ArrivalItem from "./ArrivalItem";

export interface ArrivalDisplayProps {

};

const ArrivalDisplay: React.FC = (props: ArrivalDisplayProps): React.JSX.Element => {
    return (
        <div className='AD'>
            <ArrivalItem name="2" color="grey"></ArrivalItem>
            <hr></hr>
            <ArrivalItem name="3" color="grey"></ArrivalItem>
            <hr></hr>
            <ArrivalItem name="4" color="grey"></ArrivalItem>
        </div>
    );
}

export default ArrivalDisplay;