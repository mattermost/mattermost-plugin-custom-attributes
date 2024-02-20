import {getCustomEmojisInText} from 'mattermost-redux/actions/emojis';

import Client from '../client';
import ActionTypes from '../action_types';
import manifest from '../manifest';

const ATTRIBUTES_GET_TIMEOUT_MILLISECONDS = 1000 * 60 * 60; // 1 hour

export function getAttributes(userID = '') {
    return async (dispatch, getState) => {
        const attributes = getState()[`plugins-${manifest.id}`].attributes[userID];
        if (attributes && attributes.last_try && Date.now() - attributes.last_try < ATTRIBUTES_GET_TIMEOUT_MILLISECONDS) {
            return {};
        }

        let data = [];
        try {
            data = await Client.getAttributes(userID);
        } catch (error) {
            if (error.status === 404) {
                dispatch({
                    type: ActionTypes.RECEIVED_ATTRIBUTES,
                    userID,
                    data: {
                        last_try: Date.now(),
                    },
                });
            }
            return {error};
        }

        data.forEach((attribute) => dispatch(getCustomEmojisInText(attribute)));

        dispatch({
            type: ActionTypes.RECEIVED_ATTRIBUTES,
            userID,
            data: {
                attributes: data,
            },
        });

        return {data};
    };
}
