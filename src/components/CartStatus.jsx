import React from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import useCart from '../hooks/useCart';

export default function CartStatus() {

  const { cartQuery: { data: products }, } = useCart();

  return (
    <div className='relative'>
      <AiOutlineShoppingCart size='32' color='#594839'/>
      {products && <p className='w-6 h-6 text-center font-[outfit] bg-sub2 text-main rounded-full absolute -top-2 -right-3'>{products.length}</p>}
    </div>
  );
}
