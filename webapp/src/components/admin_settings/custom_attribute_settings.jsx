// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import ConfirmModal from '../widgets/confirmation_modal.tsx';

import AddAttribute from './add_attribute.jsx';
import CustomAttribute from './custom_attribute';

export default class CustomAttributesSettings extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        helpText: PropTypes.node,
        value: PropTypes.any,
        disabled: PropTypes.bool.isRequired,
        config: PropTypes.object.isRequired,
        currentState: PropTypes.object.isRequired,
        license: PropTypes.object.isRequired,
        setByEnv: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        registerSaveAction: PropTypes.func.isRequired,
        setSaveNeeded: PropTypes.func.isRequired,
        unRegisterSaveAction: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            attributes: this.initAttributes(props.value),
            showDeleteModal: false,
            deleteModalData: {},
        };
    }

    initAttributes(attributes) {
        if (!attributes) {
            return new Map();
        }

        // Store the attributes in a map indexed by position
        return new Map(attributes.map((a, index) => [index, a]));
    }

    getAttributesList() {
        if (this.state.attributes.size === 0) {
            return (
                <div style={styles.alertDiv}>
                    <div style={styles.alertText}>{'You have no custom attributes yet.'}</div>
                </div>
            );
        }

        return Array.from(this.state.attributes, ([key, value]) => {
            return (
                <CustomAttribute
                    key={key}
                    id={key}
                    name={value.Name}
                    users={value.UserIDs}
                    teams={value.TeamIDs}
                    groups={value.GroupIDs ? value.GroupIDs.join(' ') : ''}
                    markdownPreview={true}
                    onChange={this.handleChange}
                    onDelete={this.triggerDeleteModal}
                />
            );
        });
    }

    triggerDeleteModal = (id) => {
        this.setState({showDeleteModal: true, deleteModalData: {id, Name: Array.from(this.state.attributes.values())[id].Name}});
    };

    handleDelete = (id) => {
        this.state.attributes.delete(id);
        this.props.onChange(this.props.id, Array.from(this.state.attributes.values()));
        this.props.setSaveNeeded();
        this.setState({showDeleteModal: false});
    };

    handleChange = ({id, name, users, teams, groups}) => {
        let userIds = [];
        if (users) {
            userIds = users.map((v) => {
                if (v.id) {
                    return v.id;
                }

                return v;
            });
        }

        let teamIds = [];
        if (teams) {
            teamIds = teams.map((team) => {
                if (team.id) {
                    return team.id;
                }
                return team;
            });
        }

        this.state.attributes.set(id, {
            Name: name,
            UserIDs: userIds,
            TeamIDs: teamIds,
            GroupIDs: groups ? groups.split(' ') : [],
        });

        this.props.onChange(this.props.id, Array.from(this.state.attributes.values()));
        this.props.setSaveNeeded();
    };

    render() {
        return (
            <div>
                <strong>{'Custom Attributes'}</strong>
                <div>
                    {this.getAttributesList()}
                    <AddAttribute
                        onChange={this.handleChange}
                        id={this.state.attributes.size}
                    />
                </div>
                <ConfirmModal
                    show={this.state.showDeleteModal}
                    title={'Delete Attribute'}
                    message={
                        'Are you sure you want to remove the attribute: "' +
                        this.state.deleteModalData.Name + '" ?'
                    }
                    confirmButtonText={'Remove Attribute'}
                    onConfirm={() => {
                        this.handleDelete(this.state.deleteModalData.id);
                    }}
                    onCancel={() => this.setState({showDeleteModal: false})}
                />
            </div>
        );
    }
}

const styles = {
    alertDiv: {
        borderRadius: '4px',
        backgroundColor: 'rgba(0, 0, 0, .04)',
        padding: '12px',
        margin: '8px 0',
    },
    alertText: {
        opacity: '0.6',
    },
};
