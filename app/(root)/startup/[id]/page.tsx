import { formatDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { STARTUP_BY_ID_QUERY } from '@/sanity/lib/quires';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import markdownit from 'markdown-it';
export const experimental_ppr = true;

const md = markdownit();
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });
  console.log('post?.author?.username', post?.author);

  if (!post) return notFound();
  const parsedContent = md.render(post?.pitch || '');
  return (
    <>
      <section className='pink_container !min-h-[230px]'>
        <p className='tag'>{formatDate(post?._createdAt)}</p>
        <h1 className='heading'>{post?.title}</h1>
        <p className='sub-heading !max-w-5xl'>{post?.description}</p>
      </section>
      <section className='section_container'>
        <img
          src={post.image}
          alt='thumbnail'
          className='h-auto w-full rounded-xl'
        />
        <div className='mx-auto mt-10 max-w-4xl space-y-5'>
          <div className='flex-between gap-5'>
            <Link
              href={`/user/${post?.author?._id}`}
              className='mb-3 flex items-center gap-2'
            >
              <Image
                src={post.author.image}
                alt='avatar'
                width={64}
                height={64}
                className='rounded-full drop-shadow-lg'
              />
              <div>
                <p className='text-20-medium'>{post?.author?.name}</p>
                <p className='text-16-medium !text-black-300'>
                  @{post?.author?.username}
                </p>
              </div>
            </Link>
            <p className='category-tag'>{post.category}</p>
          </div>
          <h3 className='text-30-bold'>Pitch Details</h3>
          {parsedContent ? (
            <article dangerouslySetInnerHTML={{ __html: parsedContent }} />
          ) : (
            <p className='no-result'>No Result Povided</p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;