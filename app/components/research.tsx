import Link from 'next/link';

const papers = [
  {
    key: 'sede',
    href: 'https://arxiv.org/pdf/2311.08167v4',
    title:
      'SeDe: Balancing Blockchain Privacy and Regulatory Compliance by Selective De-Anonymization',
  },
  {
    key: 'zkfi',
    href: 'https://arxiv.org/pdf/2307.00521v4',
    title:
      'zkFi: Privacy-Preserving and Regulation Compliant Transactions using Zero Knowledge Proofs',
  },
];

export function Research() {
  return (
    <div>
      {papers.map((paper) => (
        <Link
          key={paper.key}
          className="flex flex-col space-y-1 mb-4"
          href={paper.href}
          target="_blank"
        >
          {paper.title}
        </Link>
      ))}
    </div>
  );
}
