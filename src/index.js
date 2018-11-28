import React from 'react';

export default (props) => {
  const { nextProxy, ...rest } = props;
  const { value: NextProxy, next } = nextProxy;
  if (!props.fixture.controllers) {
    // Carry on
    return <NextProxy {...rest} nextProxy={next()} />;
  }

  // Wrap the component
  return (
    <Wrapper {...props.fixture.controllers} Child={state => <NextProxy {...addInnerProps(rest, state)} nextProxy={next()} />} />
  )
};

function addInnerProps(props, add) {
  return {
    ...props,
    fixture: {
      ...props.fixture,
      props: {
        ...props.fixture.props,
        ...add
      }
    }
  }
}

class Wrapper extends React.Component {
  static hoc = true;
  constructor(props) {
    super(props);
    const { Child, ...controllers } = props;
    this.state = Object.keys(controllers).map(key => (
      { [key]: (...args) => this.setState(controllers[key](...args))}
    )).reduce((acc, cur) => ({...acc, ...cur }), {});
  }

  render() {
    const { Child, ...rest} = this.props;
    let props = {...rest, ...this.state};
    return <Child {...props}/>
  }
}

// import type { ProxyProps } from 'react-cosmos-flow/proxy';

// const defaults = {
//   // Add option defaults here...
// };

// export default (options) => {
//   const {
//     /* Expand options here... */
//   } = { ...defaults, ...options };

//   console.log(defaults, options);

//   const NoopProxy = (props) => {
//     const { nextProxy, ...rest } = props;
//     const { value: NextProxy, next } = nextProxy;
//     if (!props.fixture.controllers) {
//       // Carry on
//       return <NextProxy {...rest} nextProxy={next()} />;
//     }

//     // Wrap the component
//     return (
//       <Wrapper {...props.fixture.controllers} Child={state => <NextProxy {...addInnerProps(rest, state)} nextProxy={next()} />} />
//     )
//   };

//   return NoopProxy;
// };