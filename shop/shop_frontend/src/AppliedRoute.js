import React from "react";
import { Route } from "react-router-dom";

const fun = ({ component: C, props: cProps, ...rest }) =>
    <Route {...rest} render={props => <C {...props} {...cProps}
       key={props.match.url} />} />;

export default fun;