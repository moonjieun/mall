import React from 'react';

export default function Banner(){
    return (
    <section className='h-96 bg-yellow-900 relative'>
       <div className='w-full h-full bg-cover bg-banner opacity-80'></div>
       <div className='absolute w-full top-32 text-center text-gray-50 drop-shadow-2xl'>
          <h2 className='text-4xl'>에슬레저 1위의<br></br>이유있는 베스트셀러</h2>
          <p className='p-4 text-2xl'>기능성과 핏에 대한 집념으로 탄생한 최고의 인기브랜드</p>
       </div>
        </section>
    );
}