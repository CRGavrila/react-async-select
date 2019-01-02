'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp, _initialiseProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactBootstrap = require('react-bootstrap');

var _reactTable = require('react-table');

var _reactTable2 = _interopRequireDefault(_reactTable);

require('./SearchModal.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var REACT_TABLE_PROPS = {
  showPagination: true,
  showPaginationTop: false,
  showPaginationBottom: true,
  showPageSizeOptions: true,
  pageSizeOptions: [3, 10, 20, 50, 100],
  defaultPageSize: 10,
  manual: true,
  sortable: false
};

var DEFAULT_TEXTS = {
  previous: 'Previous',
  next: 'Next',
  loading: 'Loading...',
  noData: 'No rows found',
  page: 'Page',
  of: 'of',
  rows: 'rows',
  pageJump: 'jump to page',
  rowsSelector: 'rows per page'
};

var SearchModal = (_temp = _class = function (_Component) {
  _inherits(SearchModal, _Component);

  function SearchModal(props) {
    _classCallCheck(this, SearchModal);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _initialiseProps.call(_this);

    var searchFields = Object.assign.apply(Object, [{}].concat(props.fields.map(function (field) {
      var _ref;

      return _ref = {}, _ref[field] = '', _ref;
    })));
    _this.state = {
      searchFields: searchFields,
      searchResults: [],
      page: 0,
      pageSize: REACT_TABLE_PROPS.defaultPageSize,
      pages: 1,
      selectedRow: undefined,
      loading: true
    };
    return _this;
  }

  SearchModal.prototype.componentWillMount = function componentWillMount() {
    this.fetchData();
  };

  SearchModal.prototype.render = function render() {
    var _this2 = this;

    var _state = this.state,
        searchResults = _state.searchResults,
        searchFields = _state.searchFields,
        loading = _state.loading,
        selectedRow = _state.selectedRow,
        pages = _state.pages,
        page = _state.page,
        pageSize = _state.pageSize;
    var _props = this.props,
        localizationTexts = _props.localizationTexts,
        filters = _props.filters,
        renderers = _props.renderers;

    var fieldObjects = Object.entries(searchFields).map(function (_ref2) {
      var name = _ref2[0],
          value = _ref2[1];
      return { name: name, value: value };
    });
    var columns = fieldObjects.map(function (_ref3) {
      var name = _ref3.name;

      return {
        Header: localizationTexts['column.' + name],
        accessor: name,
        Cell: function Cell(props) {
          var AdditionalComponent = renderers && renderers[props.column.id] || null;
          return _react2.default.createElement(
            'div',
            { className: 'cell-value cell-value-' + (props.original.disabled ? 'disabled' : '') },
            AdditionalComponent ? _react2.default.createElement(AdditionalComponent, props.original) : _react2.default.createElement(
              'span',
              null,
              props.value
            )
          );
        }
      };
    });
    var firstField = fieldObjects[0],
        otherFields = fieldObjects.slice(1);


    var texts = {
      previousText: localizationTexts.previous || DEFAULT_TEXTS.previous,
      nextText: localizationTexts.next || DEFAULT_TEXTS.next,
      loadingText: localizationTexts.loading || DEFAULT_TEXTS.loading,
      noDataText: localizationTexts.noData || DEFAULT_TEXTS.noData,
      pageText: localizationTexts.page || DEFAULT_TEXTS.page,
      ofText: localizationTexts.of || DEFAULT_TEXTS.of,
      rowsText: localizationTexts.rows || DEFAULT_TEXTS.rows,
      pageJumpText: localizationTexts.pageJump || DEFAULT_TEXTS.pageJump,
      rowsSelectorText: localizationTexts.rowsSelector || DEFAULT_TEXTS.rowsSelector
    };

    return _react2.default.createElement(
      _reactBootstrap.Modal,
      { className: 'combobox-with-search__modal', show: true, onHide: this.handleClose },
      _react2.default.createElement(
        _reactBootstrap.Modal.Header,
        { closeButton: true },
        _react2.default.createElement(
          'h4',
          null,
          this.props.title
        )
      ),
      _react2.default.createElement(
        _reactBootstrap.Modal.Body,
        null,
        _react2.default.createElement(
          'div',
          { className: 'combobox-with-search__modal-search-filters' },
          firstField && this.renderSearchField(firstField, 'searchBy', '00-' + firstField.name, localizationTexts, filters),
          otherFields.map(function (field, i) {
            return _this2.renderSearchField(field, 'by', i + '-' + field.name, localizationTexts, filters);
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'combobox-with-search__modal-search-results' },
          _react2.default.createElement(_reactTable2.default, _extends({}, REACT_TABLE_PROPS, texts, {
            data: searchResults,
            columns: columns,
            pageSize: Math.min(pageSize, searchResults.length),
            loadingText: localizationTexts.loading,
            noDataText: loading ? '' : localizationTexts.noData,
            loading: loading,
            pages: pages,
            page: page,
            onPageChange: this.handlePageChange,
            onPageSizeChange: this.handlePageSizeChange,
            getTrProps: function getTrProps(state, row) {
              return {
                onClick: function onClick() {
                  return _this2.handleSelectRow(row);
                },
                className: selectedRow && row && selectedRow.index === row.index ? "selected" : ""
              };
            }
          }))
        )
      ),
      _react2.default.createElement(
        _reactBootstrap.Modal.Footer,
        null,
        _react2.default.createElement(
          _reactBootstrap.Button,
          {
            bsStyle: 'primary',
            onClick: this.handleSelect,
            disabled: !selectedRow || selectedRow.original.disabled
          },
          localizationTexts.select
        ),
        _react2.default.createElement(
          _reactBootstrap.Button,
          { bsStyle: 'default', onClick: this.handleClose },
          localizationTexts.close
        )
      )
    );
  };

  return SearchModal;
}(_react.Component), _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.setSearchValue = function (fieldName, value) {
    var _extends2;

    var searchFields = _this3.state.searchFields;

    _this3.fetchData({
      page: 0,
      searchFields: _extends({}, searchFields, (_extends2 = {}, _extends2[fieldName] = value, _extends2))
    });
  };

  this.handleSelectRow = function (row) {
    return _this3.setState({ selectedRow: row });
  };

  this.handlePageChange = function (page) {
    _this3.fetchData({ page: page });
  };

  this.handlePageSizeChange = function (pageSize, page) {
    return _this3.fetchData({ pageSize: pageSize, page: page });
  };

  this.handleSelect = function () {
    var selectedRow = _this3.state.selectedRow;

    _this3.props.onSelect(selectedRow && selectedRow.original);
    _this3.handleClose();
  };

  this.handleClose = function () {
    return _this3.props.onClose();
  };

  this.fetchToken = 0;

  this.fetchData = function (state) {
    var resolvedState = _extends({}, _this3.state, state);
    var page = resolvedState.page,
        pageSize = resolvedState.pageSize,
        searchFields = resolvedState.searchFields;


    _this3.setState(_extends({}, resolvedState, { loading: true }), function () {
      _this3.fetchToken = _this3.fetchToken + 1;
      var fetchToken = _this3.fetchToken;
      _this3.props.loadOptions({
        searchFields: searchFields,
        offset: page * pageSize,
        limit: pageSize
      }).then(function (_ref4) {
        var data = _ref4.data,
            totalCount = _ref4.totalCount;

        if (fetchToken === _this3.fetchToken) {
          _this3.setState({
            searchResults: data.slice(0, pageSize),
            pages: Math.ceil(totalCount / pageSize),
            loading: false
          });
        }
      });
    });
  };

  this.renderSearchField = function (_ref5, labelPrefix, key, localizationTexts, filters) {
    var fieldName = _ref5.name,
        value = _ref5.value;

    if (filters && filters[fieldName]) {
      var Filter = filters[fieldName];
      return _react2.default.createElement(
        'div',
        { className: 'combobox-with-custom-search__modal-search-filter', key: 'search-field-' + key },
        _react2.default.createElement(Filter, { value: value, onChange: function onChange(value) {
            return _this3.setSearchValue(fieldName, value);
          } })
      );
    }
    var translatedPrefix = localizationTexts[labelPrefix];
    var translatedFieldName = localizationTexts['field.' + fieldName];
    return _react2.default.createElement(
      'div',
      { className: 'combobox-with-search__modal-search-filter', key: 'search-field-' + key },
      _react2.default.createElement(
        'label',
        { className: 'combobox-with-search__modal-search-label', htmlFor: 'search-field-' + fieldName },
        translatedPrefix + ' ' + translatedFieldName
      ),
      _react2.default.createElement('input', {
        type: 'text',
        id: 'search-field-' + fieldName,
        value: value,
        onInput: function onInput(e) {
          return _this3.setSearchValue(fieldName, e.target.value);
        }
      })
    );
  };
}, _temp);


SearchModal.defaultProps = {
  title: '',
  fields: [],
  loadOptions: function loadOptions() {
    return Promise.resolve({ data: [], totalCount: 0 });
  },
  onClose: function onClose() {},
  onSelect: function onSelect() {}
};

exports.default = SearchModal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TZWFyY2hNb2RhbC9TZWFyY2hNb2RhbC5qcyJdLCJuYW1lcyI6WyJSRUFDVF9UQUJMRV9QUk9QUyIsInNob3dQYWdpbmF0aW9uIiwic2hvd1BhZ2luYXRpb25Ub3AiLCJzaG93UGFnaW5hdGlvbkJvdHRvbSIsInNob3dQYWdlU2l6ZU9wdGlvbnMiLCJwYWdlU2l6ZU9wdGlvbnMiLCJkZWZhdWx0UGFnZVNpemUiLCJtYW51YWwiLCJzb3J0YWJsZSIsIkRFRkFVTFRfVEVYVFMiLCJwcmV2aW91cyIsIm5leHQiLCJsb2FkaW5nIiwibm9EYXRhIiwicGFnZSIsIm9mIiwicm93cyIsInBhZ2VKdW1wIiwicm93c1NlbGVjdG9yIiwiU2VhcmNoTW9kYWwiLCJwcm9wcyIsInNlYXJjaEZpZWxkcyIsIk9iamVjdCIsImFzc2lnbiIsImZpZWxkcyIsIm1hcCIsImZpZWxkIiwic3RhdGUiLCJzZWFyY2hSZXN1bHRzIiwicGFnZVNpemUiLCJwYWdlcyIsInNlbGVjdGVkUm93IiwidW5kZWZpbmVkIiwiY29tcG9uZW50V2lsbE1vdW50IiwiZmV0Y2hEYXRhIiwicmVuZGVyIiwibG9jYWxpemF0aW9uVGV4dHMiLCJmaWx0ZXJzIiwicmVuZGVyZXJzIiwiZmllbGRPYmplY3RzIiwiZW50cmllcyIsIm5hbWUiLCJ2YWx1ZSIsImNvbHVtbnMiLCJIZWFkZXIiLCJhY2Nlc3NvciIsIkNlbGwiLCJBZGRpdGlvbmFsQ29tcG9uZW50IiwiY29sdW1uIiwiaWQiLCJvcmlnaW5hbCIsImRpc2FibGVkIiwiZmlyc3RGaWVsZCIsIm90aGVyRmllbGRzIiwidGV4dHMiLCJwcmV2aW91c1RleHQiLCJuZXh0VGV4dCIsImxvYWRpbmdUZXh0Iiwibm9EYXRhVGV4dCIsInBhZ2VUZXh0Iiwib2ZUZXh0Iiwicm93c1RleHQiLCJwYWdlSnVtcFRleHQiLCJyb3dzU2VsZWN0b3JUZXh0IiwiaGFuZGxlQ2xvc2UiLCJ0aXRsZSIsInJlbmRlclNlYXJjaEZpZWxkIiwiaSIsIk1hdGgiLCJtaW4iLCJsZW5ndGgiLCJoYW5kbGVQYWdlQ2hhbmdlIiwiaGFuZGxlUGFnZVNpemVDaGFuZ2UiLCJyb3ciLCJvbkNsaWNrIiwiaGFuZGxlU2VsZWN0Um93IiwiY2xhc3NOYW1lIiwiaW5kZXgiLCJoYW5kbGVTZWxlY3QiLCJzZWxlY3QiLCJjbG9zZSIsIkNvbXBvbmVudCIsInNldFNlYXJjaFZhbHVlIiwiZmllbGROYW1lIiwic2V0U3RhdGUiLCJvblNlbGVjdCIsIm9uQ2xvc2UiLCJmZXRjaFRva2VuIiwicmVzb2x2ZWRTdGF0ZSIsImxvYWRPcHRpb25zIiwib2Zmc2V0IiwibGltaXQiLCJ0aGVuIiwiZGF0YSIsInRvdGFsQ291bnQiLCJzbGljZSIsImNlaWwiLCJsYWJlbFByZWZpeCIsImtleSIsIkZpbHRlciIsInRyYW5zbGF0ZWRQcmVmaXgiLCJ0cmFuc2xhdGVkRmllbGROYW1lIiwiZSIsInRhcmdldCIsImRlZmF1bHRQcm9wcyIsIlByb21pc2UiLCJyZXNvbHZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUVBOzs7Ozs7Ozs7O0FBR0EsSUFBTUEsb0JBQW9CO0FBQ3hCQyxrQkFBZ0IsSUFEUTtBQUV4QkMscUJBQW1CLEtBRks7QUFHeEJDLHdCQUFzQixJQUhFO0FBSXhCQyx1QkFBcUIsSUFKRztBQUt4QkMsbUJBQWlCLENBQUMsQ0FBRCxFQUFJLEVBQUosRUFBUSxFQUFSLEVBQVksRUFBWixFQUFnQixHQUFoQixDQUxPO0FBTXhCQyxtQkFBaUIsRUFOTztBQU94QkMsVUFBUSxJQVBnQjtBQVF4QkMsWUFBVTtBQVJjLENBQTFCOztBQVlBLElBQU1DLGdCQUFnQjtBQUNwQkMsWUFBVSxVQURVO0FBRXBCQyxRQUFNLE1BRmM7QUFHcEJDLFdBQVMsWUFIVztBQUlwQkMsVUFBUSxlQUpZO0FBS3BCQyxRQUFNLE1BTGM7QUFNcEJDLE1BQUksSUFOZ0I7QUFPcEJDLFFBQU0sTUFQYztBQVFwQkMsWUFBVSxjQVJVO0FBU3BCQyxnQkFBYztB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QUFMLENBQW9CQyxTQUFwQixFQUErQm1CLEVBQUVDLE1BQUYsQ0FBUzdELEtBQXhDLENBQUw7QUFBQTtBQUpYO0FBSkYsS0FERjtBQWFELEc7Ozs7QUFzSUh2QixZQUFZcUYsWUFBWixHQUEyQjtBQUN6QnZDLFNBQU8sRUFEa0I7QUFFekJ6QyxVQUFRLEVBRmlCO0FBR3pCaUUsZUFBYTtBQUFBLFdBQU1nQixRQUFRQyxPQUFSLENBQWdCLEVBQUViLE1BQU0sRUFBUixFQUFZQyxZQUFZLENBQXhCLEVBQWhCLENBQU47QUFBQSxHQUhZO0FBSXpCUixXQUFTLG1CQUFNLENBQ2QsQ0FMd0I7QUFNekJELFlBQVUsb0JBQU0sQ0FDZjtBQVB3QixDQUEzQjs7a0JBV2VsRSxXIiwiZmlsZSI6IlNlYXJjaE1vZGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBNb2RhbCwgQnV0dG9uIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJztcbmltcG9ydCBSZWFjdFRhYmxlIGZyb20gJ3JlYWN0LXRhYmxlJztcblxuaW1wb3J0ICcuL1NlYXJjaE1vZGFsLnNjc3MnO1xuXG5cbmNvbnN0IFJFQUNUX1RBQkxFX1BST1BTID0ge1xuICBzaG93UGFnaW5hdGlvbjogdHJ1ZSxcbiAgc2hvd1BhZ2luYXRpb25Ub3A6IGZhbHNlLFxuICBzaG93UGFnaW5hdGlvbkJvdHRvbTogdHJ1ZSxcbiAgc2hvd1BhZ2VTaXplT3B0aW9uczogdHJ1ZSxcbiAgcGFnZVNpemVPcHRpb25zOiBbMywgMTAsIDIwLCA1MCwgMTAwXSxcbiAgZGVmYXVsdFBhZ2VTaXplOiAxMCxcbiAgbWFudWFsOiB0cnVlLFxuICBzb3J0YWJsZTogZmFsc2UsXG59O1xuXG5cbmNvbnN0IERFRkFVTFRfVEVYVFMgPSB7XG4gIHByZXZpb3VzOiAnUHJldmlvdXMnLFxuICBuZXh0OiAnTmV4dCcsXG4gIGxvYWRpbmc6ICdMb2FkaW5nLi4uJyxcbiAgbm9EYXRhOiAnTm8gcm93cyBmb3VuZCcsXG4gIHBhZ2U6ICdQYWdlJyxcbiAgb2Y6ICdvZicsXG4gIHJvd3M6ICdyb3dzJyxcbiAgcGFnZUp1bXA6ICdqdW1wIHRvIHBhZ2UnLFxuICByb3dzU2VsZWN0b3I6ICdyb3dzIHBlciBwYWdlJyxcbn07XG5cblxuY2xhc3MgU2VhcmNoTW9kYWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBjb25zdCBzZWFyY2hGaWVsZHMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICAuLi5wcm9wcy5maWVsZHMubWFwKGZpZWxkID0+ICh7XG4gICAgICAgIFtmaWVsZF06ICcnLFxuICAgICAgfSkpLFxuICAgICk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNlYXJjaEZpZWxkcyxcbiAgICAgIHNlYXJjaFJlc3VsdHM6IFtdLFxuICAgICAgcGFnZTogMCxcbiAgICAgIHBhZ2VTaXplOiBSRUFDVF9UQUJMRV9QUk9QUy5kZWZhdWx0UGFnZVNpemUsXG4gICAgICBwYWdlczogMSxcbiAgICAgIHNlbGVjdGVkUm93OiB1bmRlZmluZWQsXG4gICAgICBsb2FkaW5nOiB0cnVlLFxuICAgIH07XG4gIH1cblxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLmZldGNoRGF0YSgpO1xuICB9XG5cblxuICBzZXRTZWFyY2hWYWx1ZSA9IChmaWVsZE5hbWUsIHZhbHVlKSA9PiB7XG4gICAgY29uc3QgeyBzZWFyY2hGaWVsZHMgfSA9IHRoaXMuc3RhdGU7XG4gICAgdGhpcy5mZXRjaERhdGEoe1xuICAgICAgcGFnZTogMCxcbiAgICAgIHNlYXJjaEZpZWxkczogeyAuLi5zZWFyY2hGaWVsZHMsIFtmaWVsZE5hbWVdOiB2YWx1ZSB9XG4gICAgfSk7XG4gIH07XG5cblxuICBoYW5kbGVTZWxlY3RSb3cgPSByb3cgPT4gdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkUm93OiByb3cgfSk7XG5cblxuICBoYW5kbGVQYWdlQ2hhbmdlID0gcGFnZSA9PiB7XG4gICAgdGhpcy5mZXRjaERhdGEoeyBwYWdlIH0pO1xuICB9O1xuXG5cbiAgaGFuZGxlUGFnZVNpemVDaGFuZ2UgPSAocGFnZVNpemUsIHBhZ2UpID0+IHRoaXMuZmV0Y2hEYXRhKHsgcGFnZVNpemUsIHBhZ2UgfSk7XG5cblxuICBoYW5kbGVTZWxlY3QgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBzZWxlY3RlZFJvdyB9ID0gdGhpcy5zdGF0ZTtcbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0KHNlbGVjdGVkUm93ICYmIHNlbGVjdGVkUm93Lm9yaWdpbmFsKTtcbiAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gIH07XG5cblxuICBoYW5kbGVDbG9zZSA9ICgpID0+IHRoaXMucHJvcHMub25DbG9zZSgpO1xuXG5cbiAgZmV0Y2hUb2tlbiA9IDA7XG5cbiAgZmV0Y2hEYXRhID0gc3RhdGUgPT4ge1xuICAgIGNvbnN0IHJlc29sdmVkU3RhdGUgPSB7IC4uLnRoaXMuc3RhdGUsIC4uLnN0YXRlIH07XG4gICAgY29uc3QgeyBwYWdlLCBwYWdlU2l6ZSwgc2VhcmNoRmllbGRzIH0gPSByZXNvbHZlZFN0YXRlO1xuXG4gICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgIHsgLi4ucmVzb2x2ZWRTdGF0ZSwgbG9hZGluZzogdHJ1ZSB9LFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLmZldGNoVG9rZW4gPSB0aGlzLmZldGNoVG9rZW4gKyAxO1xuICAgICAgICBjb25zdCBmZXRjaFRva2VuID0gdGhpcy5mZXRjaFRva2VuO1xuICAgICAgICB0aGlzLnByb3BzLmxvYWRPcHRpb25zKHtcbiAgICAgICAgICBzZWFyY2hGaWVsZHMsXG4gICAgICAgICAgb2Zmc2V0OiBwYWdlICogcGFnZVNpemUsXG4gICAgICAgICAgbGltaXQ6IHBhZ2VTaXplLFxuICAgICAgICB9KS50aGVuKCh7IGRhdGEsIHRvdGFsQ291bnQsIH0pID0+IHtcbiAgICAgICAgICBpZiAoZmV0Y2hUb2tlbiA9PT0gdGhpcy5mZXRjaFRva2VuKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgc2VhcmNoUmVzdWx0czogZGF0YS5zbGljZSgwLCBwYWdlU2l6ZSksXG4gICAgICAgICAgICAgIHBhZ2VzOiBNYXRoLmNlaWwodG90YWxDb3VudCAvIHBhZ2VTaXplKSxcbiAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICApO1xuICB9O1xuXG5cbiAgcmVuZGVyU2VhcmNoRmllbGQgPSAoeyBuYW1lOiBmaWVsZE5hbWUsIHZhbHVlIH0sIGxhYmVsUHJlZml4LCBrZXksIGxvY2FsaXphdGlvblRleHRzLCBmaWx0ZXJzKSA9PiB7XG4gICAgaWYgKGZpbHRlcnMgJiYgZmlsdGVyc1tmaWVsZE5hbWVdKSB7XG4gICAgICBjb25zdCBGaWx0ZXIgPSBmaWx0ZXJzW2ZpZWxkTmFtZV07XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29tYm9ib3gtd2l0aC1jdXN0b20tc2VhcmNoX19tb2RhbC1zZWFyY2gtZmlsdGVyJyBrZXk9e2BzZWFyY2gtZmllbGQtJHtrZXl9YH0+XG4gICAgICAgICAgPEZpbHRlciB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXt2YWx1ZSA9PiB0aGlzLnNldFNlYXJjaFZhbHVlKGZpZWxkTmFtZSwgdmFsdWUpfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gICAgY29uc3QgdHJhbnNsYXRlZFByZWZpeCA9IGxvY2FsaXphdGlvblRleHRzW2xhYmVsUHJlZml4XTtcbiAgICBjb25zdCB0cmFuc2xhdGVkRmllbGROYW1lID0gbG9jYWxpemF0aW9uVGV4dHNbYGZpZWxkLiR7ZmllbGROYW1lfWBdO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YGNvbWJvYm94LXdpdGgtc2VhcmNoX19tb2RhbC1zZWFyY2gtZmlsdGVyYH0ga2V5PXtgc2VhcmNoLWZpZWxkLSR7a2V5fWB9PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29tYm9ib3gtd2l0aC1zZWFyY2hfX21vZGFsLXNlYXJjaC1sYWJlbFwiIGh0bWxGb3I9e2BzZWFyY2gtZmllbGQtJHtmaWVsZE5hbWV9YH0+XG4gICAgICAgICAge2Ake3RyYW5zbGF0ZWRQcmVmaXh9ICR7dHJhbnNsYXRlZEZpZWxkTmFtZX1gfVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgaWQ9e2BzZWFyY2gtZmllbGQtJHtmaWVsZE5hbWV9YH1cbiAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgb25JbnB1dD17ZSA9PiB0aGlzLnNldFNlYXJjaFZhbHVlKGZpZWxkTmFtZSwgZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfTtcblxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBzZWFyY2hSZXN1bHRzLFxuICAgICAgc2VhcmNoRmllbGRzLFxuICAgICAgbG9hZGluZyxcbiAgICAgIHNlbGVjdGVkUm93LFxuICAgICAgcGFnZXMsXG4gICAgICBwYWdlLFxuICAgICAgcGFnZVNpemUsXG4gICAgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qge1xuICAgICAgbG9jYWxpemF0aW9uVGV4dHMsXG4gICAgICBmaWx0ZXJzLFxuICAgICAgcmVuZGVyZXJzXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZmllbGRPYmplY3RzID0gT2JqZWN0LmVudHJpZXMoc2VhcmNoRmllbGRzKS5tYXAoKFtuYW1lLCB2YWx1ZV0pID0+ICh7IG5hbWUsIHZhbHVlIH0pKTtcbiAgICBjb25zdCBjb2x1bW5zID0gZmllbGRPYmplY3RzLm1hcCgoeyBuYW1lIH0pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIEhlYWRlcjogbG9jYWxpemF0aW9uVGV4dHNbYGNvbHVtbi4ke25hbWV9YF0sXG4gICAgICAgIGFjY2Vzc29yOiBuYW1lLFxuICAgICAgICBDZWxsOiBwcm9wcyA9PiB7XG4gICAgICAgICAgY29uc3QgQWRkaXRpb25hbENvbXBvbmVudCA9IHJlbmRlcmVycyAmJiByZW5kZXJlcnNbcHJvcHMuY29sdW1uLmlkXSB8fCBudWxsO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGNlbGwtdmFsdWUgY2VsbC12YWx1ZS0ke3Byb3BzLm9yaWdpbmFsLmRpc2FibGVkID8gJ2Rpc2FibGVkJyA6ICcnfWB9PlxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQWRkaXRpb25hbENvbXBvbmVudCA/XG4gICAgICAgICAgICAgICAgICA8QWRkaXRpb25hbENvbXBvbmVudCB7Li4ucHJvcHMub3JpZ2luYWx9Lz4gOlxuICAgICAgICAgICAgICAgICAgPHNwYW4+e3Byb3BzLnZhbHVlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgICBjb25zdCBbZmlyc3RGaWVsZCwgLi4ub3RoZXJGaWVsZHNdID0gZmllbGRPYmplY3RzO1xuXG4gICAgY29uc3QgdGV4dHMgPSB7XG4gICAgICBwcmV2aW91c1RleHQ6IGxvY2FsaXphdGlvblRleHRzLnByZXZpb3VzIHx8IERFRkFVTFRfVEVYVFMucHJldmlvdXMsXG4gICAgICBuZXh0VGV4dDogbG9jYWxpemF0aW9uVGV4dHMubmV4dCB8fCBERUZBVUxUX1RFWFRTLm5leHQsXG4gICAgICBsb2FkaW5nVGV4dDogbG9jYWxpemF0aW9uVGV4dHMubG9hZGluZyB8fCBERUZBVUxUX1RFWFRTLmxvYWRpbmcsXG4gICAgICBub0RhdGFUZXh0OiBsb2NhbGl6YXRpb25UZXh0cy5ub0RhdGEgfHwgREVGQVVMVF9URVhUUy5ub0RhdGEsXG4gICAgICBwYWdlVGV4dDogbG9jYWxpemF0aW9uVGV4dHMucGFnZSB8fCBERUZBVUxUX1RFWFRTLnBhZ2UsXG4gICAgICBvZlRleHQ6IGxvY2FsaXphdGlvblRleHRzLm9mIHx8IERFRkFVTFRfVEVYVFMub2YsXG4gICAgICByb3dzVGV4dDogbG9jYWxpemF0aW9uVGV4dHMucm93cyB8fCBERUZBVUxUX1RFWFRTLnJvd3MsXG4gICAgICBwYWdlSnVtcFRleHQ6IGxvY2FsaXphdGlvblRleHRzLnBhZ2VKdW1wIHx8IERFRkFVTFRfVEVYVFMucGFnZUp1bXAsXG4gICAgICByb3dzU2VsZWN0b3JUZXh0OiBsb2NhbGl6YXRpb25UZXh0cy5yb3dzU2VsZWN0b3IgfHwgREVGQVVMVF9URVhUUy5yb3dzU2VsZWN0b3IsXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8TW9kYWwgY2xhc3NOYW1lPVwiY29tYm9ib3gtd2l0aC1zZWFyY2hfX21vZGFsXCIgc2hvdz17dHJ1ZX0gb25IaWRlPXt0aGlzLmhhbmRsZUNsb3NlfT5cbiAgICAgICAgPE1vZGFsLkhlYWRlciBjbG9zZUJ1dHRvbj17dHJ1ZX0+XG4gICAgICAgICAgPGg0PlxuICAgICAgICAgICAge3RoaXMucHJvcHMudGl0bGV9XG4gICAgICAgICAgPC9oND5cbiAgICAgICAgPC9Nb2RhbC5IZWFkZXI+XG4gICAgICAgIDxNb2RhbC5Cb2R5PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29tYm9ib3gtd2l0aC1zZWFyY2hfX21vZGFsLXNlYXJjaC1maWx0ZXJzXCI+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpcnN0RmllbGQgJiYgdGhpcy5yZW5kZXJTZWFyY2hGaWVsZChcbiAgICAgICAgICAgICAgICBmaXJzdEZpZWxkLFxuICAgICAgICAgICAgICAgICdzZWFyY2hCeScsXG4gICAgICAgICAgICAgICAgYDAwLSR7Zmlyc3RGaWVsZC5uYW1lfWAsXG4gICAgICAgICAgICAgICAgbG9jYWxpemF0aW9uVGV4dHMsXG4gICAgICAgICAgICAgICAgZmlsdGVyc1xuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG90aGVyRmllbGRzLm1hcChcbiAgICAgICAgICAgICAgICAoZmllbGQsIGkpID0+IHRoaXMucmVuZGVyU2VhcmNoRmllbGQoXG4gICAgICAgICAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICAgICAgICAgICdieScsXG4gICAgICAgICAgICAgICAgICBgJHtpfS0ke2ZpZWxkLm5hbWV9YCxcbiAgICAgICAgICAgICAgICAgIGxvY2FsaXphdGlvblRleHRzLFxuICAgICAgICAgICAgICAgICAgZmlsdGVyc1xuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29tYm9ib3gtd2l0aC1zZWFyY2hfX21vZGFsLXNlYXJjaC1yZXN1bHRzXCI+XG4gICAgICAgICAgICA8UmVhY3RUYWJsZVxuICAgICAgICAgICAgICB7Li4uUkVBQ1RfVEFCTEVfUFJPUFN9XG4gICAgICAgICAgICAgIHsuLi50ZXh0c31cbiAgICAgICAgICAgICAgZGF0YT17c2VhcmNoUmVzdWx0c31cbiAgICAgICAgICAgICAgY29sdW1ucz17Y29sdW1uc31cbiAgICAgICAgICAgICAgcGFnZVNpemU9e01hdGgubWluKHBhZ2VTaXplLCBzZWFyY2hSZXN1bHRzLmxlbmd0aCl9XG4gICAgICAgICAgICAgIGxvYWRpbmdUZXh0PXtsb2NhbGl6YXRpb25UZXh0cy5sb2FkaW5nfVxuICAgICAgICAgICAgICBub0RhdGFUZXh0PXtsb2FkaW5nID8gJycgOiBsb2NhbGl6YXRpb25UZXh0cy5ub0RhdGF9XG4gICAgICAgICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgICAgICAgIHBhZ2VzPXtwYWdlc31cbiAgICAgICAgICAgICAgcGFnZT17cGFnZX1cbiAgICAgICAgICAgICAgb25QYWdlQ2hhbmdlPXt0aGlzLmhhbmRsZVBhZ2VDaGFuZ2V9XG4gICAgICAgICAgICAgIG9uUGFnZVNpemVDaGFuZ2U9e3RoaXMuaGFuZGxlUGFnZVNpemVDaGFuZ2V9XG4gICAgICAgICAgICAgIGdldFRyUHJvcHM9e1xuICAgICAgICAgICAgICAgIChzdGF0ZSwgcm93KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gdGhpcy5oYW5kbGVTZWxlY3RSb3cocm93KSxcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogc2VsZWN0ZWRSb3cgJiYgcm93ICYmIHNlbGVjdGVkUm93LmluZGV4ID09PSByb3cuaW5kZXggPyBcInNlbGVjdGVkXCIgOiBcIlwiXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbC5Cb2R5PlxuICAgICAgICA8TW9kYWwuRm9vdGVyPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGJzU3R5bGU9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU2VsZWN0fVxuICAgICAgICAgICAgZGlzYWJsZWQ9eyFzZWxlY3RlZFJvdyB8fCBzZWxlY3RlZFJvdy5vcmlnaW5hbC5kaXNhYmxlZH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7bG9jYWxpemF0aW9uVGV4dHMuc2VsZWN0fVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b24gYnNTdHlsZT1cImRlZmF1bHRcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsb3NlfT5cbiAgICAgICAgICAgIHtsb2NhbGl6YXRpb25UZXh0cy5jbG9zZX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Nb2RhbC5Gb290ZXI+XG4gICAgICA8L01vZGFsPlxuICAgICk7XG4gIH1cbn1cblxuXG5TZWFyY2hNb2RhbC5wcm9wVHlwZXMgPSB7XG4gIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBmaWVsZHM6IFByb3BUeXBlcy5hcnJheSxcbiAgZmlsdGVyczogUHJvcFR5cGVzLm9iamVjdCxcbiAgcmVuZGVyZXJzOiBQcm9wVHlwZXMub2JqZWN0LFxuICBsb2FkT3B0aW9uczogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblNlbGVjdDogUHJvcFR5cGVzLmZ1bmMsXG4gIGxvY2FsaXphdGlvblRleHRzOiBQcm9wVHlwZXMub2JqZWN0LFxufTtcblxuXG5TZWFyY2hNb2RhbC5kZWZhdWx0UHJvcHMgPSB7XG4gIHRpdGxlOiAnJyxcbiAgZmllbGRzOiBbXSxcbiAgbG9hZE9wdGlvbnM6ICgpID0+IFByb21pc2UucmVzb2x2ZSh7IGRhdGE6IFtdLCB0b3RhbENvdW50OiAwIH0pLFxuICBvbkNsb3NlOiAoKSA9PiB7XG4gIH0sXG4gIG9uU2VsZWN0OiAoKSA9PiB7XG4gIH0sXG59O1xuXG5cbmV4cG9ydCBkZWZhdWx0IFNlYXJjaE1vZGFsO1xuIl19