/* eslint-disable @next/next/no-img-element */
import { formatDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from '@/sanity/lib/quires';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import markdownit from 'markdown-it';
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';
import StartupCard, { StartupCardType } from '@/components/StartupCard';
export const experimental_ppr = true;

const md = markdownit();
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const [post, { select: editorPosts }] = await Promise.all([
    await client.fetch(STARTUP_BY_ID_QUERY, { id }),
    await client.fetch(PLAYLIST_BY_SLUG_QUERY, {
      slug: 'editor-picks-new',
    }),
  ]);

  if (!post) return notFound();
  const parsedContent = md.render(post?.pitch || '');
  console.log('process.env.SAITY_WRITE_TOKEN;', process.env.SAITY_WRITE_TOKEN);

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
                src={post.author?.image}
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
            <article
              className='prose max-w-4xl break-all font-work-sans'
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className='no-result'>No Details Povided</p>
          )}
        </div>
        <hr className='divider' />
        {/* TODO: EDITOR SELECTED STARTUPS */}
        {editorPosts?.length > 0 && (
          <div className='mx-auto max-w-4xl'>
            <p className='text-30-semibold'>Editor Picks</p>
            <ul className='card_grid-sm mt-7'>
              {editorPosts.map((posts: StartupCardType, index: number) => (
                <StartupCard key={index} posts={posts} />
              ))}
            </ul>
          </div>
        )}
        <Suspense fallback={<Skeleton className='view_skeleton' />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default page;
