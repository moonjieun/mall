import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import useCart from '../hooks/useCart';
import Alert from '../components/ui/Alert';

export default function ProductDetail() {
  const { addOrUpdateItem } = useCart();
  const {
    state:{
      product: { id, image, title, description, price }
    }
  } = useLocation();
  const [success, setSuccess] = useState();
  const handleClick = () => {
    const product = { id, image, title, price, quantity:1 };
    addOrUpdateItem.mutate(product, {
      onSuccess: () => {
        setSuccess(<Alert/>)
        setTimeout(()=> setSuccess(null),3000);
      }
    }); 
  };

  return (
    <>
      <section className='flex flex-col md:flex-row p-4'>
      <img className='px-8 basis-7/12' src={image} alt={title}/>
      <div className='w-full basis-2/5 flex flex-col p-4'>
        <h2 className='text-3xl font-bold py-2'>{title}</h2>
        <p className='text-2xl py-2 border-b border-gray-300'>￦{price}</p>
        <p className='py-4 text-lg'>{description}</p>
        {success && success}
        <Button className='text-sub mt-4 py-2 px-4 rounded-sm hover:brightness-110 border-2 border-[#594839]' text="장바구니 추가" onClick={handleClick} />
      </div>
      </section>
    </>
  )
}
