Issues
------

If you've found a bug or have a great idea for a new feature, let us know by adding your suggestion
to the issue tracker.


Pull Requests
-------------

* Create a new [topic branch](https://github.com/dchelimsky/rspec/wiki/Topic-Branches) for every separate change you make.
* Execute `npm run build && npm run lint && npm test` to make sure the tests pass and the code is consistent with the project coding style.

Manual release steps
--------------------

* Bump version in `package.json`
* Create commit with the message "Release version x.x.x"
* Create Github tag and release
* Publish on npm: `git fetch && npm publish ./`
