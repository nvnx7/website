import { BlogPosts } from 'app/components/posts';
import Link from 'next/link';

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">Naveen Sahu</h1>
      <p className="mb-4">I'm a ( researcher | hacker ).</p>
      <div className="my-8">
        <BlogPosts />
      </div>

      <div className="my-8">
        <h2 className="mb-4 text-xl font-semibold tracking-tighter">Publications</h2>
        <Link
          key="sede"
          className="flex flex-col space-y-1 mb-4"
          href="https://arxiv.org/abs/2311.08167v4"
          target="_blank"
        >
          SeDe: Balancing Blockchain Privacy and Regulatory Compliance by Selective De-Anonymization
        </Link>

        <Link
          key="zkfi"
          className="flex flex-col space-y-1 mb-4"
          href="https://arxiv.org/abs/2307.00521v4"
          target="_blank"
        >
          zkFi: Privacy-Preserving and Regulation Compliant Transactions using Zero Knowledge Proofs
        </Link>
      </div>
    </section>
  );
}
