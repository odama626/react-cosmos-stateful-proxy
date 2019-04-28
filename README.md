# react-cosmos-stateful-proxy
A stateful container for stateless react components

npm package https://www.npmjs.com/package/react-cosmos-stateful-proxy

Stateless react components are pretty common but they can be kind of hard to test by themselves when you don't have a wrapper component to hold the state.

That is where this stateful proxy comes in.

to use:

```bash
npm install react-cosmos-stateful-proxy
```

### Configuration
```javascript
// cosmos.proxies.js
import StatefulProxy from 'react-cosmos-stateful-proxy';

export default [
  StatefulProxy,
  // ...other proxies
]
```

### Activation
```javascript
// __fixtures__/example.js
export default {
  component: MyComponent,
  // Any function property you want controlled should be passed into controllers
  // the controllers use React's State internally and the return values will work like setState

  // for example: the onChange of this component will change the prop 'value'
  controllers: {
    onChange: value => ({ value })
  }
}

