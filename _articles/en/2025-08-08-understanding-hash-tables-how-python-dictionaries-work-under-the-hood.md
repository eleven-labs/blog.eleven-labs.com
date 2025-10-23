---
contentType: article
lang: en
date: 2025-08-08
slug: understanding-hash-tables-how-python-dictionaries-work-under-the-hood
title: "Understanding Hash Tables: How Python Dictionaries Work Under the Hood"
excerpt: Description of the article (Visible on the list pages)
cover:
    alt: Alt image
    path: /imgs/articles/2025-08-08-comprendre-les-tables-de-hachage-comment-fonctionnent-les-dictionnaires-python-en-coulisses/cover.jpg
authors:
    - quaxzse
---

Understanding the internal workings of Python’s core data structures can significantly improve how we write and optimize code. Today, we dive deep into hash tables — specifically, how Python dictionaries are implemented and why they’re so efficient.

## What Are Hash Tables?
These potent data structures allow the access, insert, and removal of elements in constant time O(1).

A hash map (dictionary in Python) is a type of abstract data structure that stores a collection of key-value pairs, where each key maps to a specific value. For example, in Python, you might create a dictionary like this:

```python
fruits = {‘apple’: 5, ‘banana’: 6}
```
Here, the keys ‘apple’ and ‘banana’ map to the values 5 and 6, respectively.

## How Hash Tables Work
Let us break down the fundamental components that make hash tables so efficient:

### The Hash Function
A hash function converts the key into an integer to be used as an index in an array. Hash maps are typically implemented as arrays under the hood.

Python uses a sophisticated hash function, but the concept is similar to these common approaches:

**Division Method (Modulo Hashing)**: One of the simplest hash functions, where the key is divided by a prime number, and the remainder is used as the index in the array. The formula is h(k) = k mod m, where k is the key and m is the table size (often a prime number).
**Multiplicative Method**: In this approach, the hash function multiplies the key by a constant A, then takes the fractional part and multiplies it by the table size. The formula is h(k) = ⌊m(kA mod 1)⌋, where A is a non-integer real-valued constant (often the golden ratio as suggested by Donald Knuth) and m is the table size.

In Python, the hash function is implementation-specific and varies by object type:

```python
# See how Python calculates hash values
print(hash(‘apple’)) # String hash
print(hash(42)) # Integer hash
print(hash((1, 2))) # Tuple hash

# Note that mutable objects like lists and dictionaries are not hashable
try:
  print(hash([1, 2, 3]))
except TypeError as e:
  print(f”Error: {e}”)
```

### Dealing With Collisions
A collision occurs when two different keys hash to the same index. This scenario is inevitable in hash tables, and how we handle them greatly affects performance.

Python’s dictionaries use a collision resolution strategy called open addressing with a variant of linear probing. In open addressing, the algorithm looks for another empty slot within the table according to some probing scheme when a collision occurs.

## Python’s Dictionary Implementation
Python implements dictionaries as hash tables. Hash tables must allow for hash collisions, i.e. even if two distinct keys have the same hash value, the table’s implementation must have a strategy to insert and retrieve the key and value pairs unambiguously.

The Python implementation has evolved, with significant changes in Python 3.6:

Python 3.6 introduced an improved dictionary implementation that uses 20% to 25% less memory than Python 3.5 or earlier. This implementation also makes dictionaries more compact and provides faster iteration.

## Memory Layout
Before Python 3.6, dictionaries were implemented with a sparse table structure:

The memory layout of dictionaries in earlier versions was unnecessarily inefficient. It is comprised of a sparse table of 24-byte entries that store the hash value, the key pointer, and the value pointer.

The new implementation in Python 3.6+ is more efficient:

In the new dict() implementation, the data is now organized in a dense table referenced by a sparse table of indices.

For example, consider a dictionary:

```python
d = {'banana':'yellow', 'grapes':'green', 'apple':'red'}
```
Pre-Python 3.6, it might be stored as:

```python
entries = [['--', '--', '--'],
          [-5850766811922200084, 'grapes', 'green'],
          ['--', '--', '--'],
          ['--', '--', '--'],
          ['--', '--', '--'],
          [2247849978273412954, 'banana', 'yellow'],
          ['--', '--', '--'],
          [-2069363430498323624, 'apple', 'red']]
```
In Python 3.6+, it’s stored as:

```python
indices = [None, 1, None, None, None, 0, None, 2]
entries = [[2247849978273412954, 'banana', 'yellow'],
          [-5850766811922200084, 'grapes', 'green'],
          [-2069363430498323624, 'apple', 'red']]
```

This more compact layout saves memory and improves performance.

## Collision Resolution
Python uses open addressing to handle hash collisions:

Python implements hash tables under the hood, an implementation that is entirely invisible to us as a developer. Python’s hash function takes a hashable object and hashes it into 32/64 bits (depending on the system architecture).

When collisions occur, Python uses a variant of linear probing to find the next available slot.

## Implementing a Simple Hash Table in Python
Let us implement a simplified version of a hash map to understand better how they work:

```python
class SimpleHashMap:
    def __init__(self, size=8):
        self.size = size  # Initial size of the hash table
        self.table = [None] * self.size  # Initialize the table with None values
        self.count = 0  # Number of elements in the table
        # Load factor threshold for resizing (same as Python's 2/3)
        self.load_factor_threshold = 2/3

    def _hash(self, key):
        """Generate hash value for the key."""
        # Use Python's built-in hash function and modulo to get index
        return hash(key) % self.size

    def _probe(self, index):
        """Handle linear probing when collisions occur."""
        # Simple linear probing - move to the next index
        return (index + 1) % self.size

    def _resize(self):
        """Resize the hash table when it gets too full."""
        old_table = self.table
        # Double the size of the table
        self.size = self.size * 2
        self.table = [None] * self.size
        self.count = 0

        # Rehash all existing entries
        for entry in old_table:
            if entry is not None and entry != "DELETED":
                self.put(entry[0], entry[1])

    def put(self, key, value):
        """Insert a key-value pair into the hashmap."""
        # Check if resize is needed
        if self.count >= self.size * self.load_factor_threshold:
            self._resize()

        index = self._hash(key)

        # Linear probing: if the index is occupied, move to the next index
        while self.table[index] is not None and self.table[index] != "DELETED" and self.table[index][0] != key:
            index = self._probe(index)

        # If this is a new entry, increase the count
        if self.table[index] is None or self.table[index] == "DELETED":
            self.count += 1

        # Insert key-value pair at the found index
        self.table[index] = (key, value)

    def get(self, key):
        """Retrieve the value associated with the key."""
        index = self._hash(key)

        # Linear probing: search for the key
        while self.table[index] is not None:
            if self.table[index] != "DELETED" and self.table[index][0] == key:
                return self.table[index][1]
            index = self._probe(index)

            # If we've checked the entire table, the key doesn't exist
            if index == self._hash(key):
                break

        return None  # Return None if key is not found

    def delete(self, key):
        """Remove a key-value pair from the hashmap."""
        index = self._hash(key)

        # Linear probing: search for the key and mark it as deleted
        while self.table[index] is not None:
            if self.table[index] != "DELETED" and self.table[index][0] == key:
                self.table[index] = "DELETED"  # Mark as deleted
                self.count -= 1
                return
            index = self._probe(index)

            # If we've checked the entire table, the key doesn't exist
            if index == self._hash(key):
                break

        raise KeyError(f"Key '{key}' not found in hashmap.")
```

This implementation demonstrates the core concepts of hash tables, including:

- Hash function to convert keys to array indices
- Collision resolution using linear probing
- Dynamic resizing when the table becomes too full
- Handling deletions properly (with tombstone markers)

## How Python Optimizes Dictionaries

Python’s actual implementation includes many more optimizations:

- Memory-Efficient Layout: In Python 3.6+, dictionaries preserve the insertion order of keys due to a reimplementation that made them more memory efficient.
- Sophisticated Hash Functions: Python uses well-tested hash functions that minimize collisions.
- Cache-Friendly Design: The memory layout is designed to be cache-friendly for better performance.
- Load Factor Management: Python initializes a Dict with an 8-element array, which is efficient for most common dictionary use cases.

## Performance Characteristics

Python dictionaries provide excellent performance:

Python dictionaries are highly optimized and underlie many parts of the language. They provide O(1) time complexity for lookup, insert, update, and delete operations in the average case.

When to Use Dictionaries in Python
Dictionaries are ideal for the following scenarios:

- Fast Lookups: When one needs to retrieve values based on keys quickly
- Unique Mappings: When each key maps to exactly one value
- Counting Occurrences: Such as counting the frequency of items
- Caching Results: Storing computed results for later retrieval
- JSON-like Data: Representing structured data

## Limitations of Dictionaries

While highly efficient, dictionaries do have some limitations:

- Hashable Keys: Keys must be hashable (immutable) types
- Memory Overhead: They can use more memory than lists for small datasets
- No Inherent Ordering (before Python 3.6)

## Conclusion

Hash tables are at the core of Python dictionaries, providing the fast, efficient key-value storage that makes Python dictionaries so powerful. The implementation has been refined over multiple Python versions, with significant improvements in Python 3.6, making dictionaries more memory-efficient and preserving insertion order.

Understanding how hash tables work can help us make better decisions about data structures in our Python code and appreciate the engineering that went into making Python dictionaries so performant.

We may remember dictionaries as sophisticated hash table implementations that have been optimized over years of development to provide excellent performance for the most common use cases.
