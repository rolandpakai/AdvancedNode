import React, { Component } from 'react';
import { useParams  } from 'react-router';
import Blog from './Blog';


function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}
class BlogWrapper extends Component {
  constructor(props) {
    super(props);

    this._id = this.props.params._id;
  }

  render() {
    return (
      <Blog id={this._id} />
    );
  }
}

export default (withParams(BlogWrapper));
