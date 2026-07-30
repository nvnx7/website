import { BlogPosts } from 'app/components/posts';
import { Research } from 'app/components/research';
import { Works } from 'app/components/works';

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-bold tracking-tighter">naveen sahu</h1>
      <p className="mb-4">Independent (hacker | researcher).</p>
      <div className="my-8">
        <BlogPosts />
      </div>

      <div className="my-8">
        <h2 className="mb-4 text-xl font-bold tracking-tighter">works</h2>
        <Works />
      </div>

      <div className="my-8">
        <h2 className="mb-4 text-xl font-bold tracking-tighter">research</h2>
        <Research />
      </div>
    </section>
  );
}
