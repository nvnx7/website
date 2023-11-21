---
title: 'Ethereum Yellow Paper Mathematics Deciphered | Part 3: Block'
publishDate: "10 Aug 2022"
description: "This post is part of series of articles that try to decipher mathematics in ethereum yellow paper, so that it makes sense to the reader and convey their meaning"
tags: ["ethereum", "yellow-paper"]
math: true
---

This part of the series dives into section 4.3 of the [Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf), that elaborates the structure of blocks.

If you haven't yet, go through [Part 0](https://blog.nvn.fyi/19/07/2022/ethereum-yellow-paper-mathematics-deciphered-part-0/), to get conventions right.

## Block
Each block of the chain comprises three pieces of relevant information:
- Block Header, $H$
- List of transactions, $\mathbf{T}$
- Set of other block headers, $\mathbf{U}$

Hence, a block $B$ can be represented as:
$$
B \equiv (B_H, B_{\mathbf{T}}, B_{\mathbf{U}}) \tag{21}
$$

The header contains several pieces of information:
- $\mathbf{parentHash}$ ($H_{\mathrm{p}}$): Hash of parent block's header.
- $\mathbf{ommersHash}$ ($H_{\mathrm{o}}$):
- $\mathbf{beneficiary}$ ($H_{\mathrm{c}}$): Address of miner of block to which all the fees went to.
- $\mathbf{stateRoot}$ ($H_{\mathrm{r}}$): Hash of root of state trie after all transaction in block are finalized.
- $\mathbf{transactionRoot}$ ($H_{\mathrm{t}}$): Hash of root of trie containing all transactions in this block.
- $\mathbf{receiptsRoot}$ ($H_{\mathrm{e}}$): Hash of root of trie containing all receipts corresponding to each transaction in this block.
- $\mathbf{logsBloom}$ ($H_{\mathrm{b}}$):
- $\mathbf{difficulty}$ ($H_{\mathrm{d}}$): A scalar value representing difficulty of this block.
- $\mathbf{number}$ ($H_{\mathrm{i}}$): A scalar value equal to number of all ancestor blocks of this block.
- $\mathbf{gasLimit}$ ($H_{\mathrm{l}}$): A scalar value equal to the current limit of gas expenditure per block.
- $\mathbf{gasUsed}$ ($H_{\mathrm{g}}$): A scalar value equal to the total gas used in transactions in this block.
- $\mathbf{timestamp}$ ($H_{\mathrm{s}}$): A scalar value equal to the reasonable output of Unix’s time() at this block’s inception.
- $\mathbf{extraData}$ ($H_{\mathrm{x}}$): An arbitrary byte array containing data
relevant to this block. This must be 32 bytes or fewer.
- $\mathbf{mixHash}$ ($H_{\mathrm{m}}$): A 256-bit hash which, combined with the
nonce, proves that a sufficient amount of computation has been carried out on this block.
- $\mathbf{nonce}$ ($H_{\mathrm{n}}$): A 64-bit value which, combined with the mixhash, proves that a sufficient amount of computation has been carried out on this block

### Transaction Receipts
The transaction receipts correspond to each transaction in a block and contains information related to execution of the transaction. Given a block $B$ having a list of receipts $\mathbf{R}$, the $i$th receipt is indexed/denoted by $B_\mathbf{R}[i]$.
A single receipt $R$ is tuple of five items:
- $R_\mathrm{x}$ - Type of transaction.
- $R_\mathrm{z}$ - Status code of transaction.
- $R_\mathrm{u}$ - Cumulative gas used in the block immediately after this transaction happened.
- $R_\mathbf{l}$ - Set of logs created (aka events emitted) through execution of this transaction.
- $R_\mathrm{b}$ - The bloom-filter composed of the logs.

Hence it can be denoted as:
$$
R \equiv (R_\mathrm{x}, R_\mathrm{z}, R_\mathrm{u}, R_\mathrm{b}, R_\mathbf{l}) \tag{22}
$$

And, like other entities, corresponding collapse function for a receipt, $R$ is defined as:
$$
L_R(R) \equiv (R_\mathrm{z}, R_\mathrm{u}, R_\mathrm{b}, R_\mathbf{l}) \tag{23}
$$

The values are restricted/belong to their respective sets:
$$
R_{\mathrm{z}} \in \mathbb{N} \land R_{\mathrm{u}} \in \mathbb{N} \land R_{\mathrm{b}} \in \mathbb{B}_{256}
$$

Notice that $R_{\mathbf{l}}$ is list/series of log entries - $(O_0, O_1, O_2, ...)$ where each log entry $O$ is tuple comprising:
- $O_\mathrm{a}$ - Logger's address (transaction sender)
- $O_{\mathbf{t}}$ - Series of log 32-byte topics, $(O_{\mathbf{t}0}, O_{\mathbf{t}1}, ... )$. You might know these as indexed parameters in an event. This could possibly be empty.
- $O_{\mathbf{d}}$ - Some number of bytes of data. The un-indexed parameters of an event go into these.

This is saying same as:
$$
O \equiv (O_\mathrm{a}, (O_{\mathbf{t}0}, O_{\mathbf{t}1}, ... ), O_{\mathbf{d}}) \tag{26}
$$

where $O_\mathrm{a}$ is 20-bytes (an address), each entry in $O_\mathbf{t}$ list is 32-byte and $O_{\mathbf{d}}$ is arbitrary length bytes. In mathematical words it is same as conveying:
$$
O_\mathrm{a} \in \mathbb{B}_{20} \ \land \forall x \in O_\mathbf{t}:x \in \mathbb{B}_{32} \ \land O_{\mathbf{d}} \in \mathbb{B} \tag{27}
$$

##### Bloom Filter
The $\mathbf{logsBloom}$ bloom filter is derived from a Bloom filter function, $M$. A bloom filter is a probabilistic data structure that allows to ascertain whether an element in a set efficiently & rapidly.

I highly recommend you to read up more about Bloom filters [here](https://llimllib.github.io/bloomfilter-tutorial/) before proceeding this section.

$M$ operates on logger's address $O_\mathrm{a}$ and all each of the indexed log entries, $O_{\mathbf{t}} = (O_{\mathbf{t}0}, O_{\mathbf{t}1}, ...)$ and produces a bloom filter which is 256 byte (2048 bits) hash.

_Notice that only event logs marked "indexed" (in Solidity) are included in bloom filter. This is why you can only filter events data by these "indexed" event parameters._

The paper formally defines the Bloom filter function, $M$ as,

$$
M(O) \equiv {\bigvee}_{x \in \{O_{\mathrm{a}}\} \cup O_{\mathbf{t}}} \big( M_{3:2048}(x) \big) \tag{28}
$$

Let's decode it.

$M_{3:2048}$ is a specialized bloom filter that takes an arbitrary byte sequence $\mathbf{x}$ and outputs a 2048 bits (256-bytes) filter. This has 3 bits set out of 2048 bits.

The $\bigvee$ symbol above represents the bitwise $\mathtt{OR}$ operation over a series of byte sequences i.e. multiple 2048-bits sequences. In this context, to be precise, the equivalence $(28)$ can be written as:
$$
M(O) \equiv M_{3:2048}(O_{\mathrm{a}})  | M_{3:2048}(O_{\mathbf{t}0}) | M_{3:2048}(O_{\mathbf{t}1}) | ...
$$

where $|$ is the bitwise $\mathtt{OR}$ operation.

Now onto the working of $M_{3:2048}$ function.

$M_{3:2048}$ takes an arbitrary length byte sequence, $\mathbf{x}$, and outputs a 2048-bits or 256-bytes length sequence $\mathbf{y}$, i.e.

$$
M_{3:2048}(\mathbf{x}: \mathbf{x} \in \mathbb{B}) \equiv \mathbf{y}: \mathbf{y} \in \mathbb{B}_{256} \tag{29}
$$

This 2048 bits length output $\mathbf{y}$ has all bits set to 0, except 3 bits.

$$
\mathbf{y} = (0, 0, 0, ..., 0) \quad (\text{except 3 bits}) \tag{30}
$$

Which of the 3 bits to set is defined by $M_{3:2048}$ function's algorithm:
- First it keccak-256 hashes the byte sequence $\mathbf{x}$ i.e. $\mathtt{KECC}(\mathbf{x})$.
- Then takes the first three pairs of bytes (byte pairs at indices $(0, 1), (2, 3), (4, 5)$) from the hash, $\mathtt{KECC}(\mathbf{x})$.
- And then from each pair of bytes at indices $(i, i+1)$ ($\forall i \in {0, 2, 3}$), it takes the low-order 11 bits out of 16 bits (each byte pair is 16 bits).
- Each of these 11-bit value (corresponding to each of 3 byte pairs) is subtracted from 2047 (highest 11-bit value in decimal) to output a set of 3 indices ranging from 0 to 2047.
- These are the obtained indices at which bit is set to 1 in $\mathbf{y}$ byte sequence from $(30)$.

Mathematically, the paper defines a helper function $m$ which extracts the required 11-bits:
$$
m(\mathbf{x}, i) \equiv \mathtt{KEC}(\mathbf{x})[i, i+1] \bmod 2048 \tag{32}
$$

As described earlier, it extracts 11 bits from two bytes ($i$ & $i+1$) of hash of $\mathbf{x}$. The sequence formed by bytes at $i$ and $i+1$ are 16-bits and by taking its $\bmod$ with 2048 reduces it to 11 bits. This is because 2048 is base for 11 bit i.e. $2048 = 2^{11}$ (11 bits).

Paper also defined a rather simple $\mathcal{B}_j$, bit-reference function which simply references bit at index $j$ in a given byte sequence.

$\mathcal{B}$ is utilized to set bits at calculated indices to 1 in $\mathbf{y}$ as:
$$
\forall i \in \{0, 2, 4\} \quad \colon \quad \mathcal{B}_{2047 - m(\mathbf{x, i})}(\mathbf{y}) = 1 \tag{31}
$$

And this is how bloom-filters are calculated for logs.

### Block Validity
A block's validity is satisfied if and only if certain conditions are met:

- The new root of state trie, must be equal to root of the trie derived from new state after transactions of this block, $B$ are finalized at state, $\boldsymbol{\sigma}$.
$$
H_{\mathrm{r}} \equiv \mathtt{TRIE}(L_S(\Pi(\boldsymbol{\sigma}, B)))
$$
where $L_S$ is state collapse function.

_Recall from $(2)$ that if $\boldsymbol{\sigma}$ is current world state then $\Pi(\boldsymbol{\sigma}, B)$ defined the next state._

- $\mathbf{ommersHash}$, $H_\mathrm{o}$ is the keccak hash of RLP encoded ommer block headers.
$$
H_{\mathrm{o}} \equiv \mathtt{KECC}(\mathtt{RLP}(L^*_{\mathrm{H}}(B_\mathbf{U})))
$$

- The block header $\mathbf{transactionRoot}$, $H_{\mathrm{t}}$  must be equal to root of trie which is derived from RLP-encoding of all transactions, $B_\mathbf{T}$ in the block. The transaction, at index $i$, $B_{\mathbf{T}[i]}$ (= $T$) is RLP-encoded based on transaction its type, $T_\mathrm{x}$.
$$
H_{\mathrm{t}} \equiv \mathtt{TRIE}( \{ \forall i \lt \lVert B_{\mathbf{T}} \rVert, i \in \mathbb{N} : p_{\mathrm{T}}(i, B_{\mathbf{T}[i]}) \})
$$

where function $p_{\mathrm{T}}$ RLP-encodes a transaction, $T$ depending on type:
$$
p_{\mathrm{T}}(k, T) \equiv \left( \mathtt{RLP}(k), \begin{cases}
\mathtt{RLP}({L_{\mathrm{T}}}(T)) & \text{if} \quad T_{\mathrm{x}} = 0 \\
(T_{\mathrm{x}}) \cdot \mathtt{RLP}(L_{\mathrm{T}}(T)) & \text{otherwise}
\end{cases}
\right) \tag{34}
$$

Note that index $i$ ($k$ in above) of transaction in block is also encoded.

- Likewise the $\mathbf{receiptRoot}$, $H_{\mathrm{e}}$ is derived from RLP-encoding of receipts which depends of receipt transaction type, $R_{\mathrm{x}}$:
$$
H_{\mathrm{e}} \equiv \mathtt{TRIE}( \{ \forall i \lt \lVert B_{\mathbf{R}} \rVert, i \in \mathbb{N} : p_{\mathrm{R}}(i, B_{\mathbf{T}[i]}) \})
$$

where function $p_{\mathrm{R}}$ RLP-encodes a transaction, $R$ depending on type:
$$
p_{\mathrm{R}}(k, R) \equiv \left( \mathtt{RLP}(k), \begin{cases}
\mathtt{RLP}({L_{\mathrm{R}}}(R)) & \text{if} \quad R_{\mathrm{x}} = 0 \\
(R_{\mathrm{x}}) \cdot \mathtt{RLP}(L_{\mathrm{R}}(R)) & \text{otherwise}
\end{cases}
\right) \tag{35}
$$

- $\mathbf{logsBloom}$ must bitwise $\mathtt{OR}$ of all bloom filters, $\mathbf{r}_{\mathrm{b}}$ derived from each receipt.
$$
H_{\mathrm{b}} \equiv \bigvee_{\mathbf{r} \in B_{\mathbf{R}}}(\mathbf{r}_{\mathrm{b}})
$$

Combining all of the above, a block's validity is constrained by:
$$
H_{\mathrm{r}} \equiv \mathtt{TRIE}(L_S(\Pi(\boldsymbol{\sigma}, B))) \land \\\\
H_{\mathrm{o}} \equiv \mathtt{KECC}(\mathtt{RLP}(L^*_{\mathrm{H}}(B_\mathbf{U}))) \land \\\\
H_{\mathrm{t}} \equiv \mathtt{TRIE}( \{ \forall i \lt \lVert B_{\mathbf{T}} \rVert, i \in \mathbb{N} : p_{\mathrm{T}}(i, B_{\mathbf{T}[i]}) \}) \land \\\\
H_{\mathrm{e}} \equiv \mathtt{TRIE}( \{ \forall i \lt \lVert B_{\mathbf{R}} \rVert, i \in \mathbb{N} : p_{\mathrm{R}}(i, B_{\mathbf{T}[i]}) \}) \land \\\\
H_{\mathrm{b}} \equiv \bigvee_{\mathbf{r} \in B_{\mathbf{R}}}(\mathbf{r}_{\mathrm{b}}) \tag{33}
$$

Futhermore, paper defines the equation,
$$
\mathtt{TRIE}(L_\mathrm{S}(\boldsymbol{\sigma})) = P(B_H)_{H_{\mathrm{r}}} \tag{36}
$$

If $B$ is current block then its parent block is $P(B_H)$. Then, this parent's header's state trie root component is denoted as $P(B_H)_{H_{\mathrm{r}}}$. The equation above says that $P(B_H)_{H_{\mathrm{r}}}$ is equal to the state trie root at world state $\boldsymbol{\sigma}$ which is when the block, $P(B_H)$ was finalized.

### Serialization
The paper lays out functions $L_\mathrm{H}$ and $L_\mathrm{B}$ for defining serialization and types for block header and block.

$$
L_\mathrm{H}(H) \equiv (H_{\mathrm{p}}, H_{\mathrm{o}}, H_{\mathrm{c}}, H_{\mathrm{r}}, H_{\mathrm{t}}, H_{\mathrm{e}}, H_{\mathrm{b}}, H_{\mathrm{d}},\\ H_{\mathrm{i}}, H_{\mathrm{l}}, H_{\mathrm{g}}, H_{\mathrm{s}}, H_{\mathrm{x}}, H_{\mathrm{m}}, H_{\mathrm{n}}) \tag{37}
$$

$$
L_\mathrm{B}(B) \equiv (L_{\mathrm{H}}(B_{\mathrm{H}}), \widetilde{L}_{\mathrm{T}}^*(B_{\mathbf{T}}), L_{\mathrm{H}}^*(B_{\mathbf{U}})) \tag{38}
$$

where $\widetilde{L}_{\mathrm{T}}$ takes a special care of EIP-2718 transactions:

$$
\widetilde{L}_{\mathrm{T}}(T) = \begin{cases}
L_{\mathrm{T}}(T) & \text{if} \quad T_{\mathrm{x}} = 0 \\
(T_{\mathrm{x}}) \cdot \mathtt{RLP}(L_{\mathrm{T}}(T)) & \text{otherwise}
\end{cases} \tag{39}
$$

with $\widetilde{L}_{\mathrm{T}}^*(B_{\mathbf{T}})$ and $L_{\mathrm{H}}^*(B_{\mathbf{U}})$ are element-wise version of respective functions.

The types of header components are:
$$
H_{\mathrm{p}} \in \mathbb{B}_{32}  \land  H_{\mathrm{o}} \in \mathbb{B}_{32}  \land H_{\mathrm{c}} \in \mathbb{B}_{20} \land \\\\
H_{\mathrm{r}} \in \mathbb{B}_{32} \land H_{\mathrm{t}} \in \mathbb{B}_{32} \land H_{\mathrm{e}} \in \mathbb{B}_{32} \land \\\\
H_{\mathrm{b}} \in \mathbb{B}_{256} \land H_{\mathrm{d}} \in \mathbb{N} \land H_{\mathrm{i}} \in \mathbb{N} \land \\\\
H_{\mathrm{l}} \in \mathbb{N} \land H_{\mathrm{g}} \in \mathbb{N} \land H_{\mathrm{s}} \in \mathbb{N}_{256} \land \\\\
H_{\mathrm{x}} \in \mathbb{B} \land H_{\mathrm{m}} \in \mathbb{B}_{32} \land H_{\mathrm{n}} \in \mathbb{B}_{8}
\tag{41}
$$

where, as already defined in convention, $B_{\mathrm{n}}$ is a bytes sequence and exactly equal to $\mathrm{n}$ bytes in size. Saying same as:
$$
\mathbb{B}_{\mathrm{n}} = \{ B: B \in \mathbb{B} \land \lVert B \rVert = n \} \tag{42}
$$

### Block Header Validity
The parent block of block, $B$ is denoted as $P(B_{\mathrm{H}})$ ($\equiv P(H)$) which is formally defined as:
$$
P(H) \equiv B': \mathtt{KEC}(\mathtt{RLP}(B'_{\mathrm{H}})) = {H_{\mathrm{p}}} \tag{43}
$$

i.e. the parent of $B$ is $B'$ such that $\mathbf{parentHash}$, $H_\mathrm{p}$ of of $B$'s header is equal to keccak hash of (RLP encoded) header of $B'$. That is basically definition of $H_\mathrm{p}$ holding true.

The block number, $H_\mathrm{i}$ is simply parent's block number, $P(H)_{H_\mathrm{i}}$ incremented by 1:
$$
H_{\mathrm{i}} \equiv {{P(H)_{\mathrm{H}}}_{\mathrm{i}}} + 1 \tag{44}
$$

The canonical difficulty of block with header, $H$ is defined as $D(H)$:
$$
D(H) \equiv \begin{dcases}
2^{34} & \text{if} \quad H_{\mathrm{i}} = 0\\
\text{max}\!\left(D_{\mathrm{min}}, {P(H)_{\mathrm{H}}}_{\mathrm{d}} + x \times \varsigma_2 + \epsilon \right) & \text{otherwise}\\ \tag{45}
\end{dcases}
$$

As evident, difficulty for genesis block is $2^{34}$. For any subsequent block, it depends on multiple parameters given above. Let's make sense of it.

The block difficulty is max of $D_{\mathrm{min}}$ and the quantity ${P(H)_{\mathrm{H}}}_{\mathrm{d}} + x \times \varsigma_2$, where
$$
D_{\mathrm{min}} \equiv 2^{17} \tag{46}
$$

Hence, difficulty can't get any lower than $D_{\mathrm{min}}$.

Keeping aside above fixed cases, the difficulty is determined by expression:
$$
{P(H)_{\mathrm{H}}}_{\mathrm{d}} + x \times \varsigma_2 + \epsilon
$$

which is difficulty of parent block adjusted with quantity $(x \times \varsigma_2 + \epsilon)$.

The main thing to focus is $\varsigma_2$, the _Homestead_ difficulty parameter:
$$
\varsigma_2 \equiv \text{max}\left( y - \left\lfloor\frac{H_{\mathrm{s}} - {P(H)_{\mathrm{H}}}_{\mathrm{s}}}{9}\right\rfloor, -99 \right) \tag{48}
$$

where,
$$
y \equiv \begin{cases}
1 & \text{if} \quad \lVert P(H)_{\mathbf{U}}\rVert = 0 \\
2 & \text{otherwise}
\end{cases} \tag{49}
$$

In words of paper, it maintains a "dynamic homeostasis" of time between blocks - meaning it maintains an equilibrium such that time between two blocks remain roughly same. Let's see how.

$H_\mathrm{s}$, the $\mathbf{timestamp}$ of block with header $H$ must be greater than its parent block's timestamp:
$$
H_\mathrm{s} > P(H)_{H_\mathrm{s}} \tag{54}
$$

Therefore the difference, $H_\mathrm{s} - P(H)_{H_\mathrm{s}}$ must be a positive number which is time (in seconds) between the current block and it's parent. The greater this difference is, the lower $\varsigma_2$ will be. The lower $\varsigma_2$ then causes the difficulty $D(H)$ to be lower.

Hence, it can be inferred that greater time between blocks causes difficulty to become lower and vice-versa. This how this "difficulty equilibrium" is achieved as a function of time between two consecutive blocks.

The $x$ is the adjustment factor that was introduced in [EIP-100](https://eips.ethereum.org/EIPS/eip-100) in order to target mean block time including uncle blocks:
$$
x \equiv \left\lfloor\frac{{P(H)_{\mathrm{H}}}_{\mathrm{d}}}{2048}\right\rfloor \tag{47}
$$

$\epsilon$ is the exponential difficulty symbol, given by:
$$
\epsilon \equiv \left\lfloor 2^{ \left\lfloor H'_{\mathrm{i}} \div 100000 \right\rfloor - 2 } \right\rfloor \tag{50}
$$

$\epsilon$ causes the difficulty to rise exponentially every 100,000 blocks since the exponent in $(50)$ - $\left\lfloor H'_{\mathrm{i}} \div 100000 \right\rfloor - 2$ increases by 1 every 100,000 increase in $H'_i$. $H'_i$ is given as:

$$
H'_{\mathrm{i}} \equiv \max(H_{\mathrm{i}} - \kappa, 0) \tag{51}
$$

$$
\kappa \equiv \begin{cases}
  3000000  & \text{if} \quad F_{\mathrm{Byzantium}} \leqslant H_{\mathrm{i}} < F_{\mathrm{Constantinople}} \\
  5000000  & \text{if} \quad F_{\mathrm{Constantinople}} \leqslant H_{\mathrm{i}} < F_{\mathrm{Muir Glacier}} \\
  9000000  & \text{if} \quad F_{\mathrm{Muir Glacier}} \leqslant H_{\mathrm{i}} < F_{\mathrm{London}} \\
  9700000  & \text{if} \quad F_{\mathrm{London}} \leqslant H_{\mathrm{i}} < F_{\mathrm{Arrow Glacier}} \\
 10700000  & \text{if} \quad F_{\mathrm{Arrow Glacier}} \leqslant H_{\mathrm{i}} < F_{\mathrm{Gray Glacier}} \\
 11400000  & \text{if} \quad H_{\mathrm{i}} \geqslant F_{\mathrm{Gray Glacier}} \\
\end{cases} \tag{52}
$$

Hence, it can also be inferred from $(51)$ that difficulty rises exponentially for every 100,000 increase in block number, $H_{\mathrm{i}}$.

The gas limit $H_{\mathrm{l}}$ of block header $H$ is constrained by relation:
$$
H_{\mathrm{l}} < {P(H)_{\mathrm{H}}}_{\mathrm{l}} + \left\lfloor\frac{{P(H)_{\mathrm{H}}}_{\mathrm{l}}}{1024}\right\rfloor \quad \wedge \\
H_{\mathrm{l}} > {P(H)_{\mathrm{H}}}_{\mathrm{l}} - \left\lfloor\frac{{P(H)_{\mathrm{H}}}_{\mathrm{l}}}{1024}\right\rfloor \quad \wedge \\
H_{\mathrm{l}} \geq 5000
$$

