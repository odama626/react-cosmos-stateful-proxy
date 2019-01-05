import React from 'react';
import { recursive as mergeRecursive } from 'merge';


export default (props) => {
  const { nextProxy, ...rest } = props;
  const { value: NextProxy, next } = nextProxy;

  // Perfomance gainz when this proxy is loaded but no controllers fixture is present
  if (!props.fixture.controllers) {
    // Carry on
    return <NextProxy {...rest} nextProxy={next()} />;
  }

  // Extract controllers fixture props
  const controllers = rest.fixture.controllers;
  // Remove them from the "normal" props
  rest.fixture.controllers = undefined;

  // Wrap the component
  return (
    <Wrapper
      {...rest.fixture.props}
      controllers={controllers}
      update={props.onFixtureUpdate}
      Child={enrichedProps => {
        // Inject enriched props in fixture.props
        const newProps = {
          ...rest,
          fixture: {
            ...rest.fixture,
            props: mergeRecursive(true, rest.fixture.props, enrichedProps),
          },
        };
        return (
          <NextProxy {...newProps} nextProxy={next()} />
        )
      }}
    />
  )
};

class Wrapper extends React.Component {
  static hoc = true;
  constructor(props) {
    super(props);
    // Extract controller props and react-cosmos update function
    const { update, controllers } = props;
    this.state = {
      ...this.extractControllersFunctionsObject(controllers, update, (...args) => this.recursivelyMergeState(...args))
    };
  }

  // To prevent overwriting nested controllers the user sets in a fixture
  recursivelyMergeState = (nextState) => {
    this.setState(s => {
      // Handle setState function arg like React.setState would
      if (typeof nextState === 'function') {
        nextState = nextState(s);
      }
      return mergeRecursive(true, s, nextState);
    })
  }

  // For recursively transforming controllers prop to state setting functions
  extractControllersFunctionsObject(controllers, injectedUpdate, injectedSetState) {
    const transformedControllerObject = Object.entries(controllers).map(([key, value]) => {
      // type == object: branch
      if (typeof value === 'object') {
        return {
          [key]: this.extractControllersFunctionsObject(value, injectedUpdate, injectedSetState)
        };
      }
      // type == function: leaf
      else if (typeof value === 'function') {
        return {
          [key]: (...args) => {
            // Pass in controller function args
            // Set empty object as fallback when there is no return value provided by the user
            const nextState = value(...args) || {};
            // Update editor
            injectedUpdate(nextState);
            // Update state
            injectedSetState(nextState);
          }
        };
      }
      // type == something else: user isn't making sense
      else {
        return {
          [key]: () => { console.warn(`Did you provide an object to 'controllers' proxy that doesn't strictly have functions as object tree leaves?`) }
        };
      }
    });

    // Reduce mapped array to get a flat object again
    return transformedControllerObject.reduce((acc, cur) => ({ ...acc, ...cur }), {});
  }

  render() {
    // Get all props without Child, update and controllers
    const { Child, update, controllers, ...rest } = this.props;
    // Prevent nested props from being overwritten when being merged with our generated state
    const props = mergeRecursive(true, rest, this.state);
    return <Child {...props} />;
  }
}
