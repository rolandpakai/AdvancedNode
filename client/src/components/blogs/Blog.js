import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBlog } from '../../actions';
class Blog extends Component {

  componentDidMount() {
    this.props.fetchBlog(this.props.id);
  }

  renderImage() {
    if (this.props.blog.imageUrl) {
      return (
        <img 
          src={`"https://s3.eu-central-1.amazonaws.com/rolandpakai-blog-bucket/${this.props.blog.imageUrl}`} />
      )
    }
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
        {this.renderImage()}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return { blog: state.blogs[ownProps.id] }
}

export default connect(mapStateToProps, { fetchBlog })(Blog);
