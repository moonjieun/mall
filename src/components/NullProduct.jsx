import React from 'react';
import Button from './ui/Button';
import { Link } from 'react-router-dom';

export default function NullProduct(){
    return(
        <div className='pt-8 flex-col'>
        <p className='bg-[#eae5dd] font-[outfit] text-textsub p-28 flex justify-center'>The shopping basket is empty.</p>
        <Link to='/products'>
        <Button className='text-sub mt-4 py-2 px-4 rounded-sm hover:brightness-110 border-2 border-[#594839]' text='쇼핑계속하기' />
        </Link>
        </div>
    )
}