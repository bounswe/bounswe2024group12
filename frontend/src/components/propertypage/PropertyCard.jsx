import { useEffect, useState } from 'react';

export default function PropertyCard({data}){
    const [propertyData, setPropertyData] = useState({...data});

    useEffect(() => {
        setPropertyData(data);
    }, [data]);

    return (
        <div>
            <div>
                <h1>{propertyData.property_name}</h1>
                <h3>{propertyData.property_type}</h3>
                <img src={propertyData.property_image} alt={propertyData.property_name} />
                <p>{propertyData.property_description}</p>
            </div>
        </div>
    );
}