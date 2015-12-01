import React, {Component, PropTypes} from 'react';
import Selector from 'selector';

export default class extends Component {
  static propTypes = {
    optionRenderer: PropTypes.func.isRequired,
    options: PropTypes.oneOfType([
      PropTypes.array.isRequired,
      PropTypes.shape({length: PropTypes.number.isRequired}).isRequired
    ]).isRequired,
    onSelect: PropTypes.func.isRequired,
    onQuery: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    query: PropTypes.string,
    value: PropTypes.any,
    valueRenderer: PropTypes.func.isRequired
  }

  static defaultProps = {
    optionRenderer: ({props, value, isActive, isSelected}) =>
      <div
        {...props}
        className={['oss-option'].concat(
          isActive ? 'oss-option-active' : [],
          isSelected ? 'oss-option-selected' : []
        ).join(' ')}
      >
        {value}
      </div>,
    valueRenderer: ({props, value, clear}) =>
      <div className='oss-value'>
        <div {...props} className='oss-value-label'>{value}</div>
        <div className='oss-value-clear' onClick={clear}>X</div>
      </div>
  }

  state = {
    hasFocus: false,
    query: ''
  }

  blur() {
    this.setState({hasFocus: false});
  }

  focus() {
    this.setState({hasFocus: true});
  }

  clear() {
    this.props.onSelect();
  }

  handleSelect(index) {
    const {onQuery, onSelect, options} = this.props;
    this.blur();
    onSelect(options[index]);
    onQuery();
  }

  renderValue() {
    const {valueRenderer, value} = this.props;
    const clear = ::this.clear;
    return valueRenderer({
      value,
      clear,
      props: {
        onClick: ::this.focus,
        onFocus: ::this.focus,
        tabIndex: '0'
      }
    });
  }

  renderOption({props, index, isActive}) {
    const {optionRenderer, options, value: existingValue} = this.props;
    const value = options[index];
    const isSelected = value === existingValue;
    return optionRenderer({index, value, isActive, isSelected, props});
  }

  renderSelector() {
    const {options, value} = this.props;
    return (
      <Selector
        {...this.props}
        autoFocus={value != null}
        initialActiveIndex={value == null ? undefined : options.indexOf(value)}
        length={options.length}
        onBlur={::this.blur}
        onFocus={::this.focus}
        onSelect={::this.handleSelect}
        optionRenderer={::this.renderOption}
      />
    );
  }

  render() {
    const {value} = this.props;
    const {hasFocus} = this.state;
    return value == null || hasFocus ?
      this.renderSelector() :
      this.renderValue();
  }
}