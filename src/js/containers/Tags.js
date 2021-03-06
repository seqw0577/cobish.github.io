import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchIssuesIfNeeded } from '../actions/index.js';
import NProgress from 'nprogress';
import CellView from '../components/CellView.js';

class Tags extends Component {
  constructor(props) {
    super(props);
    this.spliceJson = this.spliceJson.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchIssuesIfNeeded('created', 10000));

    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
  }

  routerWillLeave(nextLocation) {
      NProgress.start();
  }

   // 拼接 json
  spliceJson(items) {
    let list = items,
        articles = {};

    for (let i = 0, listLen = list.length; i < listLen; i++) {
      let labels = list[i]['labels'];

      for (let j = 0, labelsLen = labels.length; j < labelsLen; j++) {
        let name = labels[j]['name'];
        if ( !articles.hasOwnProperty(name) ) {
          articles[name] = [];
        }
        articles[name].push(list[i]);

      }
    }

    return articles;
  }

  render() {
    let showTemplate = () => {
      if (this.props.isFetching) {
        return null;
      }

      NProgress.done();

      let articles = this.spliceJson(this.props.items),
          view = [];

      for (let label in articles) {
        view.push(<CellView key={label} title={label} items={articles[label]} />);
      }    

      return view;
    };

    return (
      <div className="list">
        {showTemplate()}
      </div>
    );
  }
};

function mapStateToProps(state) {
  const {
    isFetching,
    items
  } = state || {
    isFetching: true,
    items: []
  };

  return {
    isFetching,
    items
  }
}

export default connect(mapStateToProps)(withRouter(Tags));


