/* eslint-disable react/no-multi-comp, react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Tether from 'tether';

class TetheredChildrenComponent extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    position: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.position();
  }

  componentDidUpdate() {
    this.props.position();
  }

  render() {
    return this.props.children;
  }
}

export default class TetherComponent extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    options: PropTypes.object.isRequired,
    target: PropTypes.any.isRequired,
    matchWidth: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    this.tetherContainer = document.createElement('div');
    document.body.appendChild(this.tetherContainer);
    this.renderTetheredContent();
  }

  componentDidUpdate() {
    this.renderTetheredContent();
  }

  componentWillUnmount() {
    this.destroyTetheredContent();
  }

  position = () => {
    if (!this.tether) {
      this.tether = new Tether({
        ...this.props.options,
        element: this.tetherContainer,
        target: this.props.target,
      });
    }
    if (this.props.matchWidth) {
      this.tetherContainer.style.width = `${this.props.target.clientWidth}px`;
    }
    this.tether.position();
  };

  destroyTetheredContent() {
    ReactDOM.unmountComponentAtNode(this.tetherContainer);
    if (this.tether) {
      this.tether.destroy();
    }
    document.body.removeChild(this.tetherContainer);
  }

  renderTetheredContent() {
    ReactDOM.render(
      <TetheredChildrenComponent
        target={this.props.target}
        position={this.position}
      >
        {this.props.children}
      </TetheredChildrenComponent>,
      this.tetherContainer,
    );
  }

  render() {
    return null;
  }
}
