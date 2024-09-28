# LunAST

LunAST is an experimental in-development [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree)-based remapper and patcher for Webpack modules.

## Introduction

Modern Webpack patching functions off of matching existing minified code (using a string or regular expression) and then replacing it. While this is an easy to use and powerful way of patching Webpack modules, there are many downsides:

- Even the smallest change can break patches, which can require lots of maintenance, especially on large Discord bundler changes.
- Fetching exports from a Webpack module will sometimes result in minified export names. These exports must be manually remapped to human readable names by a library extension.
- Making complicated patches is extremely difficult and means your patch has more points of failure.

To solve this, LunAST generates [the ESTree format](https://github.com/estree/estree) with a handful of libraries ([meriyah](https://github.com/meriyah/meriyah), [estree-toolkit](https://github.com/sarsamurmu/estree-toolkit), [astring](https://github.com/davidbonnet/astring)) on each Webpack module. This makes large-scale manipulation and mapping feasible, by allowing you to write code to detect what modules you want to find.

## Usage

### Embedding into your own code

LunAST is not ready to be used in other projects just yet. In the future, LunAST will be a standalone library.

### Registering a processor

LunAST functions off of "processors". Processors have a unique ID, an optional filter (string or regex) on what to parse, and a process function which receives the AST.

The process function returns a boolean, which when true will unregister the processor. Once you have found what you're looking for, you can return true to skip parsing any other subsequent module, speeding up load times.

LunAST includes some core processors, and extensions can register their own processors (citation needed).

```ts
register({
  name: "UniqueIDForTheProcessorSystem",
  find: "some string or regex to search for", // optional
  priority: 0, // optional
  process({ id, ast, lunast }) {
    // do some stuff with the ast
    return false; // return true to unregister
  }
});
```

### Mapping with LunAST

LunAST can use proxies to remap minified export names to more human readable ones. Let's say that you determined the module ID and export name of a component you want in a module.

First, you must define the type. A type contains a unique name and a list of fields. These fields contain the minified name and the human-readable name that can be used in code.

Then, register the module, with the ID passed to you in the process function. Specify its type so the remapper knows what fields to remap. It is suggested to name the module and type with the same name.

```ts
process({ id, ast, lunast }) {
  let exportName: string | null = null;

  // some code to discover the export name...

  if (exportName != null) {
    lunast.addType({
      name: "SomeModule",
      fields: [
        {
          name: "SomeComponent",
          unmapped: exportName
        }
      ]
    });
    lunast.addModule({
      name: "SomeModule",
      id,
      type: "SomeModule"
    });
    return true;
  }

  return false;
}
```

Then, you need to specify the type of the module in `types.ts`. Using the `import` statement in Webpack modules is not supported yet. Hopefully this step is automated in the future.

After all this, fetch the remapped module and its remapped field:

```ts
moonlight.lunast.remap("SomeModule").SomeComponent
```

### Patching with LunAST

LunAST also enables you to modify the AST and then rebuild a module string from the modified AST. It is suggested you read the [estree-toolkit](https://estree-toolkit.netlify.app/welcome) documentation.

You can use the `magicAST` function to turn some JavaScript code into another AST node, and then merge/replace the original AST.

**After you modify the AST, call the markDirty function.** LunAST will not know to replace the module otherwise.

```ts
process({ ast, markDirty }) {
  const node = /* do something with the AST */;
  if (node != null) {
    const replacement = magicAST("return 1 + 1");
    node.replaceWith(replacement);
    markDirty();
    return true;
  }

  return false;
}
```

## FAQ

### How do you fetch the scripts to parse?

Fetching the content of the `<script>` tags is impossible, and making a `fetch` request would result in different headers to what the client would normally send. We use `Function.prototype.toString()` and wrap the function in parentheses to ensure the anonymous function is valid JavaScript.

### Isn't this slow?

Not really. LunAST runs in roughly ~10ms on [my](https://github.com/NotNite) machine, with filtering for what modules to parse. Parsing every module takes only a second. There are future plans to cache and parallelize the process, so that load times are only slow once.

You can measure how long LunAST took to process with the `moonlight.lunast.elapsed` variable

### Does this mean patches are dead?

No. Patches will continue to serve their purpose and be supported in moonlight, no matter what. LunAST should also work with patches, but patches may conflict or not match.

[astring](https://github.com/davidbonnet/astring) may need to be forked in the future to output code without whitespace, in the event patches fail to match on AST-patched code.

### This API surface seems kind of bad

This is still in heavy development and all suggestions on how to improve it are welcome. :3

### Can I help?

Discussion takes place in the [moonlight Discord server](https://discord.gg/FdZBTFCP6F) and its `#lunast-devel` channel.
