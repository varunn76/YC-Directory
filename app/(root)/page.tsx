import { auth } from '@/auth';
import SeachForm from '@/components/SeachForm';
import StartupCard, { StartupCardType } from '@/components/StartupCard';
import { sanityFetch, SanityLive } from '@/sanity/lib/live';
import { STARTUP_QUERY } from '@/sanity/lib/quires';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const session = await auth();
  console.log(session?.id);

  const { data: posts } = await sanityFetch({ query: STARTUP_QUERY, params });

  return (
    <>
      <section className='pink_container'>
        <h1 className='heading'>
          Pitch Your Startup, <br /> Connect with Entrepreneur
        </h1>
        <p className='sub-heading !max-w-3xl'>
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual
          Compititions.
        </p>
        <SeachForm query={query} />
      </section>
      <section className='section_container'>
        <p className='text-30-semibold'>
          {query ? `Search results for ${query}` : 'All Results'}
        </p>
        <ul className='card_grid mt-7'>
          {posts.length > 0 ? (
            posts.map((posts: StartupCardType) => (
              <StartupCard key={posts?._id} posts={posts} />
            ))
          ) : (
            <p className='no-results'>No startups found</p>
          )}
        </ul>
      </section>
      <SanityLive />
    </>
  );
}
