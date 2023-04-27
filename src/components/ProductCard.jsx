import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({
    product,
    product:{ id, image, title, price }
}){
    const navigate = useNavigate();
    return (
        <li
        onClick={()=>{navigate(`/products/${id}`,{state:{product}})}} 
        className='mt-4 mx-2 shadow-md overflow-hidden cursor-pointer transition-all hover:scale-105'>
            <img className='w-full rounded-lg' src={image} alt={title}/>
            <div className='mt-2 px-2 text-lg flex justify-between items-center'>
                <h3 className='truncate'>{title}</h3>
                <p>{`￦${price}`}</p>
            </div>
        </li>
    );
}