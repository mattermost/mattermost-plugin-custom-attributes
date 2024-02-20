import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import manifest from '../../manifest';
import {getAttributes} from '../../actions';

import UserAttribute from './user_attribute.jsx';

const REDUCER = `plugins-${manifest.id}`;

function mapStateToProps(state, ownProps) {
    const id = ownProps.user ? ownProps.user.id : '';
    const data = state[REDUCER].attributes[id];
    let attributes;
    if (data) {
        attributes = data.attributes;
    }

    return {
        id,
        attributes,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getAttributes,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAttribute);
