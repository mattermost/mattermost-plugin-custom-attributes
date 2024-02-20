import React from 'react';
import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';
import AsyncSelect from 'react-select/async';

// TeamsInput searches and selects teams displayed by display_name.
// Teams prop can handle the team object or strings directly if the team object is not available.
// Returns the selected team ids in the `OnChange` value parameter.
export default class TeamsInput extends React.PureComponent {
    static propTypes = {
        placeholder: PropTypes.string,
        teams: PropTypes.array,
        onChange: PropTypes.func,
        actions: PropTypes.shape({
            searchTeams: PropTypes.func.isRequired,
        }).isRequired,
    };

    onChange = (value) => {
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    };

    getOptionValue = (team) => {
        if (team.id) {
            return team.id;
        }

        return team;
    };

    formatOptionLabel = (option) => {
        if (option.display_name) {
            return (
                <React.Fragment>
                    { `${option.display_name}`}
                </React.Fragment>
            );
        }

        return option;
    };

    searchTeams = debounce((term, callback) => {
        this.props.actions.searchTeams(term).then(({data, error}) => {
            if (error) {
                // eslint-disable-next-line no-console
                console.error('Error searching team in custom attribute settings dropdown. ' + error.message);
                callback([]);
                return;
            }

            callback(data);
        });
    }, 150);

    render() {
        return (
            <AsyncSelect
                isMulti={true}
                cacheOptions={true}
                defaultOptions={false}
                loadOptions={this.searchTeams}
                onChange={this.onChange}
                getOptionValue={this.getOptionValue}
                formatOptionLabel={this.formatOptionLabel}
                defaultMenuIsOpen={false}
                openMenuOnClick={false}
                isClearable={false}
                placeholder={this.props.placeholder}
                value={this.props.teams}
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
