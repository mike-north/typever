# Types Version Utils

[![Build Status](https://travis-ci.org/mike-north/types-version.svg?branch=master)](https://travis-ci.org/mike-north/types-version)
[![Version](https://img.shields.io/github/tag/mike-north/types-version.svg)](https://www.npmjs.com/package/types-version)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Utilities for managing versions of TypeScript ambient types

> - [About The Problem](#About-The-Problem)
>   - [An Example](#An-Example)
> - [A Solution](#A-Solution)
>   - [The Versioning Strategy](#The-Versioning-Strategy)
> - [Using This Library](#Using-This-Library)

## About The Problem

Picking version numbers for TypeScript [ambient types](http://definitelytyped.org/) is quite tricky. Versioning philosophies like [SemVer](https://semver.org/) don't quite get the job done when it comes to types. Let's look at a simple example

### An Example

Let's say we have a vanilla JavaScript library called `table-component` whose version is currently `4.5.6`. If they follow SemVer, we know some things about this version

- It may not work at all with code designed to consume `table-component@3.0.0`
- It may have some additional features that were not present in `table-component@4.4.2`
- It may have some fixes that were not present in `table-component@4.5.3`

In essence, for this code, consumers know whether it includes

- 🤕 Big changes that may require modification of their app's code
- 🎁 New features that shouldn't interfere with what already works
- 🛠 Small improvements and fixes that don't introduce any API changes of significance

However, let's say we have a library like `@types/table-component` that provides some type information to describe `table-component`'s code. There's some more information we need to capture

#### 🔢 +Info: Which version of `table-component` the types describe

This is a piece of information our consumers will certainly want to know, and there's no easy way to adhere to [SemVer](https://semver.org/) while also providing an answer to this question.

#### 💔 +Info: Extra breaking changes

In addition to reflecting the breaking changes in `table-component`, `@types/table-component` may have its own breaking changes that are strictly related to the types themselves.

For example:

- Dropping support for old TypeScript versions
- Starting to require a generic parameter that was previously optional
- Making types more specific

Think about the previous point about "which version does this describe?". Maybe now you can see why the SemVer, **and** "match the `table-component` version number" (sometimes referred to as "Lockstep") strategies both break down for types.

If we currently have a `package.json` like this

```
"table-component": "4.5.6",
"@types/table-component": "4.5.6"
```

You might guess that these types describe exactly the library version we're working with. However, what happens when drop support for TypeScript 2.4 (a breaking change). Semver would tell us to do this:

```
"table-component": "4.5.6",
"@types/table-component": "5.0.0" # SemVer?
```

and now it looks like our library and types don't match. If `table-component@5.0.0` is released we'd have to release a `@types/table-component@6.0.0`. How can our consumers tell the difference between a breaking change in the types, and type-alignment with breaking changes in the code our types describe?

If we try the "Lockstep" strategy, and match the library version number, we'd have to use something like pre-release versions

```
"table-component": "4.5.6",
"@types/table-component": "4.5.7-beta.1" # Lockstep?
```

but now we've deprived our users of the ability to protect themselves against breaking changes within the types

#### 🎛 -Info: Features

The job of ambient types is simply to describe some other piece of code, the concept of a "non-breaking feature" within the types themselves is extremely rare. If a change is made to improve the way the types describe their corresponding `table-component` code, **that's a bug fix**. All that's left to think about is whether it's breaking or non-breaking

#### 🏗 -Info: Minor Releases

If the library our types describe follows SemVer, the types that work for `table-component@4.5.x` should be a superset of the types that describe `table-component@4.1.0`. Because of this, consumers should be able to use the **latest** `@types/table-component@4.*` with **any** `table-component@4.*` and not encounter any type errors. We're relying on [this aspect of SemVer](https://semver.org/spec/v2.0.0.html#spec-item-7)

> Minor version Y (x.Y.z | x > 0) MUST be incremented if new, backwards compatible functionality is introduced to the public API.

which guarantees the backwards compatibility we need to mix newer types with older libraries (within the same major release)

## A Solution

Before getting into a specific solution, let's lay out some goals

- Make it clear to consumers, which major version of a library the types are designed to work with
- Use `npm` and `yarn` commands the standard way to take in _safe and non-breaking_ changes
- Allow consumers to protect themselves from breaking changes
- Compatibility with tools like [dependabot](https://dependabot.com/) and [greenkeeper](https://greenkeeper.io/)
- Some flexibility within type versions to allow for breaking changes **even between patch releases of the library they describe** (i.e., if a breaking TypeScript change forces dropping old TS versions)

### The Versioning Strategy

If we treat versions as `X.Y.Z`

- **`X`** - Indicates the major release of a library that the types describe. As long as **`X`** follows the SemVer convention, this is all we need to track in order to maintain compatability.
- **`Y`** - Indicates a breaking change in types, within the same **`X`**
- **`Z`** - Indicates a non-breaking change in types, within the same **`Y`**

###### A concrete example: `@types/ember` and `ember`

```js
// @types/ember v2.1.2

2  // Tracking the ember@2 release series
.
1  // Breaking change since @types/ember@2.0.x
.
2  // Non-breaking change since @types/ember@2.1.0
```

## Using This Library

This library provides a collection of utilities for managing versioned types that follow this style of versioning

---

© 2018 Mike North
