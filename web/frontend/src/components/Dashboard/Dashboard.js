import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { fetchMemories } from "../../actions/dashboardActions"; 

export class Dashboard extends Component {
    render() {
        return (
            <Fragment>
                <h1>Memory Dashboard</h1>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    memories: state.dashboard.memories
});

const mapDispatchToProps = {
    fetchMemories
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
