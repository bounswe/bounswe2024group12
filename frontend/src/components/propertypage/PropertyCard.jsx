import { useEffect, useState } from 'react';
import style from './PropertyCard.module.css';

export default function PropertyCard({data}){
    const [propertyData, setPropertyData] = useState({...data});

    useEffect(() => {
        setPropertyData(data);
    }, [data]);

    return (
        <div>
            <div className={style.PropertyBlock}>
                <img src={propertyData.property_image} alt={propertyData.property_name} />
                <div className={style.PropertyInfo}>
                    <h1>{propertyData.property_name}</h1>
                    <h3>{propertyData.property_type}</h3>
                    <p>{propertyData.property_description}</p>
                </div>
            </div>
        </div>
    );
}