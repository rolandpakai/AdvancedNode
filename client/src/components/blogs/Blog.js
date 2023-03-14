import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBlog } from '../../actions';


class BlogShow extends Component {

  componentDidMount() {
    this.props.fetchBlog(this.props.id);
  }

  render() {
    if (!this.props.blog) {
      return '';
    }

    const { title, content } = this.props.blog;

    return (
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return { blog: state.blogs[ownProps.id] }
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);
