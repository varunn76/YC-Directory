import React from 'react';

import { client } from '@/sanity/lib/client';
import Ping from './Ping';
import { STARTUP_VIEWS_QUERY } from '@/sanity/lib/quires';

const View = async ({ id }: { id: string }) => {
  const { views: totalView } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });
  return (
    <div className='view-container'>
      <div className='absolute -right-2 -top-2'>
        <Ping />
      </div>
      <p className='view-text'>
        <span className='font-black'>{totalView} Views</span>
      </p>
    </div>
  );
};

export default View;
