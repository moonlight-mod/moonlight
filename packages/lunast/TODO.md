# LunAST TODO

- [ ] Experiment more! We need to know what's bad with this
- [ ] Write utility functions for imports, exports, etc.
- [ ] Map Z/ZP to default
- [x] Steal Webpack require and use it in our LunAST instance
- [ ] Map `import` statements to LunAST
- [ ] Support patching in the AST
  - Let user modify the AST, have a function to flag it as modified, if it's modified we serialize it back into a string and put it back into Webpack
  - We already have a `priority` system for this
- [ ] Run in parallel with service workers
  - This is gonna require making Webpack entrypoint async and us doing kickoff ourselves
- [ ] Support lazy loaded chunks
- [ ] Split into a new repo on GitHub, publish to NPM maybe
- [ ] Implement caching based off of the client build and LunAST commit
  - Means you only have to have a long client start once per client build
- [ ] Process in CI to use if available on startup
  - Should mean, if you're lucky, client starts only take the extra time to make the request