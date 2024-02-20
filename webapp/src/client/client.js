import {Client4} from 'mattermost-redux/client';
import {ClientError} from 'mattermost-redux/client/client4';

import manifest from '../manifest';

export default class Client {
    constructor() {
        this.url = `/plugins/${manifest.id}/api/v1`;
    }

    getAttributes = async (userID = '') => {
        return this.doGet(`${this.url}/attributes?user_id=` + userID);
    };

    doGet = async (url, body, headers = {}) => {
        const options = {
            method: 'get',
            headers,
        };

        const response = await fetch(url, Client4.getOptions(options));

        if (response.ok) {
            return response.json();
        }

        const text = await response.text();

        throw new ClientError(Client4.url, {
            message: text || '',
            status_code: response.status,
            url,
        });
    };
}
