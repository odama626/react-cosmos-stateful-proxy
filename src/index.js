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
    <Wrapper
      {...props.fixture.controllers}
      update={props.onFixtureUpdate}
      Child={state => <NextProxy {...addInnerProps(rest, state)} nextProxy={next()} />}
    />
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
    const { Child, update, ...controllers } = props;
    this.state = Object.keys(controllers).map(key => (
      { [key]: (...args) => {
        // update editor
        let nextState = controllers[key](...args)
        props.update(nextState);
        // update state
        this.setState(nextState);
      }}
    )).reduce((acc, cur) => ({...acc, ...cur }), {});
  }

  render() {
    const { Child, update, ...rest} = this.props;
    let props = {...rest, ...this.state};
    return <Child {...props}/>
  }
}