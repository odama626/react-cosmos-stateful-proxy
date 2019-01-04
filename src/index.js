import React from 'react';
const deepMerge = require('deepmerge'); // TODO: find a package that is bundled with modern standards

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
        // Extract controller props and react-cosmos update function
        const { Child, update, ...controllers } = props;
        this.state = this.extractControllersFunctionsObject(controllers, update, (...args) => this.deepMergeState(...args));
    }

    // To prevent overwriting nested props we set in a fixture
    deepMergeState = (nextState) => {
        this.setState(s => deepMerge(s, nextState))
    }

    // For recursively transforming controllers prop to state setting functions
    extractControllersFunctionsObject(controllers, update, setState) {
        const transformedControllerObject = Object.entries(controllers).map(([key, value]) => {
            if (typeof value === 'object') {
                return {
                    [key]: this.extractControllersFunctionsObject(value, update, setState)
                };
            }
            else if (typeof value === 'function') {
                return {
                    [key]: (...args) => {
                        // Pass in controller function args
                        const nextState = value(...args) || {}
                        // Update editor
                        update(nextState);
                        // Update state
                        setState(nextState);
                    }
                };
            }
            else {
                return {
                    [key]: () => { console.warn(`Did you provide an object to 'controllers' proxy that doesn't strictly have functions as object tree leaves?`) }
                };
            }
        });

        // Reduce to turn our mapped array into a flat object again
        return transformedControllerObject.reduce((acc, cur) => ({ ...acc, ...cur }), {});
    }

    render() {
        const { Child, update, ...rest } = this.props;
        const props = { ...rest, ...this.state };
        return <Child {...props} />
    }
}
