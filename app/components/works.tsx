import Link from "next/link";

const works = [
  {
    name: "winnr",
    description:
      "a performant prediction market app-chain with a CLOB, native privacy and gasless transactions",
    href: "https://github.com/nvnx7/winnr-rollup",
  },
  {
    name: "nexus",
    description:
      "zk-based private multisig wallet using FROST threshold signature scheme",
    href: "https://github.com/nvnx7/nexus-multisig",
  },
  {
    name: "frost-babyjubjub",
    description:
      "frost threshold signature scheme over babyjubjub curve for private multisig wallets",
    href: "https://github.com/nvnx7/frost-babyjubjub",
  },
  {
    name: "noble-poseidon",
    description:
      "poseidon and poseidon2 hash function implementation in typescript",
    href: "https://github.com/nvnx7/noble-poseidon",
  },
  {
    name: "sede",
    description:
      "compliance framework for tracing utxo based private transactions",
    href: "https://github.com/nvnx7/sede-framework/tree/main/packages/core",
  },
  {
    name: "zkfi",
    description: "modular ethereum privacy protocol with defi integrations",
    href: "https://github.com/nvnx7/zkfi-protocol",
  },
  {
    name: "evm-rs",
    description: "ethereum virtual machine written from scratch in rust",
    href: "https://github.com/nvnx7/evm-rs",
  },
  {
    name: "tsunami",
    description: "private token streaming protocol on ethereum",
    href: "https://github.com/nvnx7/tsunami-monorepo",
  },
  {
    name: "lux wallet",
    description: "a crypto wallet browser extension",
    href: "https://github.com/nvnx7/lux-wallet",
  },
  {
    name: "hardhat-test-utils",
    description: "a collection of utilities to make testing hardhat projects",
    href: "https://github.com/nvnx7/hardhat-test-utils",
  },
  {
    name: "artista",
    description:
      "deep learning style-transfer at the edge — native android app written in kotlin",
    href: "https://github.com/nvnx7/Artista",
  },
  {
    name: "eye-gaze-pointer",
    description:
      "computer vision model to control mouse pointer with eye gaze — powered by open-cv",
    href: "https://github.com/nvnx7/eye-gaze-pointer-controller",
  },
];

export function Works() {
  return (
    <div>
      {works.map((work) => (
        <Link
          key={work.name}
          className="flex flex-col space-y-1 mb-4"
          href={work.href}
          target="_blank"
        >
          <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
            <p className="text-neutral-100 w-[140px] md:basis-3/10">
              {work.name}
            </p>
            <p className="text-neutral-400 tracking-tight md:basis-7/10">
              {work.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
