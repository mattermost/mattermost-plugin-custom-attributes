import manifest from './manifest';

import UserAttribute from './components/user_attribute';
import CustomAttributesSettings from './components/admin_settings/custom_attribute_settings.jsx';
import Reducer from './reducers';

export default class Plugin {
    initialize(registry) {
        registry.registerReducer(Reducer);
        registry.registerPopoverUserAttributesComponent(UserAttribute);

        registry.registerAdminConsoleCustomSetting('CustomAttributes', CustomAttributesSettings);
    }
}

window.registerPlugin(manifest.id, new Plugin());
