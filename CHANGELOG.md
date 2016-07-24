# Changelog

# 0.5.0

- Switched to webpack, build size was reduced from 6.5kb to 4.5kb
- New constructor `extend`

# 0.4.0

- Included method `alias`
- allows `extend` to override `toString`
- method `alias”` without arguments returns the alias mapping (issue #2)
- `attributes` returns a copy of internal attributes to avoid side effects

# 0.3.0

- Included array last item through `-1` index

# 0.2.0

- Included alias `is` for the `has` method
- Included example.js
- Accepts `toArray` without arguments

# 0.1.1

- First official version. Included methods: create, attributes, get, set, fetch, has, inc, dec, toggle, isBlank, isPresent, toArray, reset, update, extend
