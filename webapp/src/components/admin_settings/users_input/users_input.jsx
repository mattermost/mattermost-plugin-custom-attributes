import React from 'react';
import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';
import AsyncSelect from 'react-select/async';

// UsersInput searches and selects user profiles displayed by username.
// Users prop can handle the user profile object or strings directly if the user object is not available.
// Returns the selected users ids in the `OnChange` value parameter.
export default class UsersInput extends React.Component {
    static propTypes = {
        placeholder: PropTypes.string,
        users: PropTypes.array,
        onChange: PropTypes.func,
        actions: PropTypes.shape({
            searchProfiles: PropTypes.func.isRequired,
        }).isRequired,
    };

    onChange = (value) => {
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    };

    getOptionValue = (user) => {
        if (user.id) {
            return user.id;
        }

        return user;
    };

    formatOptionLabel = (option) => {
        if (option.username) {
            return (
                <React.Fragment>
                    { `@${option.username}`}
                </React.Fragment>
            );
        }

        return option;
    };

    debouncedSearchProfiles = debounce((term, callback) => {
        this.props.actions.searchProfiles(term).then(({data}) => {
            callback(data);
        }).catch(() => {
            // eslint-disable-next-line no-console
            console.error('Error searching user profiles in custom attribute settings dropdown.');
            callback([]);
        });
    }, 150);

    usersLoader = (term, callback) => {
        try {
            this.debouncedSearchProfiles(term, callback);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            callback([]);
        }
    };

    render() {
        return (
            <AsyncSelect
                isMulti={true}
                cacheOptions={true}
                defaultOptions={false}
                loadOptions={this.usersLoader}
                onChange={this.onChange}
                getOptionValue={this.getOptionValue}
                formatOptionLabel={this.formatOptionLabel}
                defaultMenuIsOpen={false}
                openMenuOnClick={false}
                isClearable={false}
                placeholder={this.props.placeholder}
                value={this.props.users}
                components={{DropdownIndicator: () => null, IndicatorSeparator: () => null}}
                styles={customStyles}
            />
        );
    }
}

const customStyles = {
    control: (provided) => ({
        ...provided,
        minHeight: 34,
    }),
};
