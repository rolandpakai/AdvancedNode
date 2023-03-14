import React, { Component } from 'react';
import { useParams  } from 'react-router';
import { connect } from 'react-redux';
import { fetchBlog } from '../../actions';


function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}
class BlogShow extends Component {
  constructor(props) {
    super(props);

    this.blog = this.props.blogs[this.props.params._id];
  }

  render() {
    if (!this.blog) {
      return '';
    }

    const { title, content } = this.blog;

    return (
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { blogs: state.blogs }
}

export default connect(mapStateToProps)(withParams(BlogShow));
