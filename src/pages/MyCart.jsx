import React from 'react';
import CartItem from '../components/CartItem';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { FaEquals } from 'react-icons/fa';
import PriceCard from '../components/PriceCard';
import Button from '../components/ui/Button';
import useCart from '../hooks/useCart';
import NullProduct from '../components/NullProduct';
import { Link } from 'react-router-dom';

const SHIPPING = 3000;

export default function MyCart() {

  const { 
    cartQuery : { isLoading, data: products },
   } = useCart();
  
  if(isLoading) return <p>Loading...</p>;

  const hasProducts = products && products.length > 0;

  const totalPrice = hasProducts && products.reduce(
    (prev,current) => prev + parseInt(current.price) * current.quantity, 
    0 
    );
    
  return (

  <section className='p-8 flex flex-col'>
    <p className='font-bold font-[outfit]'>My Cart</p>
    {!hasProducts && <NullProduct/>}
    {hasProducts && ( 
    <>
    <ul className='border-b border-gray-300 mb-10 p-4 px-8'>
      {products && 
      products.map((product)=> (
      <CartItem key={product.id} product={product}/>
      ))}
    </ul>
    <div className='flex justify-between items-center mb-4 px-2 md:px-8 lg:px-16'>
      <PriceCard text='상품 총액' price={totalPrice}/>
      <BsFillPlusCircleFill color='#594839'/>
      <PriceCard text='배송비' price={SHIPPING}/>
      <FaEquals color='#594839' className='shirnk-0'/>
      <PriceCard text='총가격' price={totalPrice + SHIPPING}/>
    </div>
    <div className='flex justify-between mt-6'>
      <Link to='/products'>
      <Button className='text-sub py-2 px-4 rounded-sm hover:brightness-110 border-2 border-[#594839]' text='쇼핑계속하기' />
      </Link>
      <Button className='text-white py-2 px-4 rounded-sm hover:brightness-110 bg-[#594839]' text='주문하기' />
      </div>
    </>
    )}
    </section>
  
  );
}
