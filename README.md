# Disclaimer

**This repository is community supported and not maintained by Mattermost. Mattermost disclaims liability for integrations, including Third Party Integrations and Mattermost Integrations. Integrations may be modified or discontinued at any time.**

# Mattermost Custom Attributes Plugin 

[![Build Status](https://img.shields.io/circleci/project/github/mattermost/mattermost-plugin-custom-attributes/master)](https://circleci.com/gh/mattermost/mattermost-plugin-custom-attributes)
[![Code Coverage](https://img.shields.io/codecov/c/github/mattermost/mattermost-plugin-custom-attributes/master)](https://codecov.io/gh/mattermost/mattermost-plugin-custom-attributes)
[![Release](https://img.shields.io/github/v/release/mattermost/mattermost-plugin-custom-attributes)](https://github.com/mattermost/mattermost-plugin-custom-attributes/releases/latest)
[![HW](https://img.shields.io/github/issues/mattermost/mattermost-plugin-custom-attributes/Up%20For%20Grabs?color=dark%20green&label=Help%20Wanted)](https://github.com/mattermost/mattermost-plugin-custom-attributes/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22Up+For+Grabs%22+label%3A%22Help+Wanted%22)

This plugin adds custom attributes to users in your Mattermost instance.  You can specify an Attribute, and then specify specific users, teams or groups which will display that attribute on their public profile - so other users can identify them easily.  This can be useful when there are Team Leads, Timezones, etc. and makes it easy to show who is on a particular team or Project.  

Currently the plugin only exposes the specified attributes in the user profile popover, but this plugin could be extended to allow displaying attributes elsewhere in the user interface, such as badges next to usernames. To use the "Group" features in this plugin requires a [Mattermost E20 License](https://mattermost.com/pricing/) to enable the AD/LDAP Groups Feature.

We use this plugin on https://community.mattermost.com to distinguish Mattermost core committers and staff.

![image](https://user-images.githubusercontent.com/13119842/58710612-b5c7b380-838a-11e9-9974-4487daf82da5.png)

## Installation

Install via Plugin Marketplace (Recommended)
 - Go to Main Menu > Plugin Marketplace in Mattermost
 - Search for "Custom Attributes" or manually find the plugin from the list and click **Install**
 - After the plugin has downloaded and been installed, click the **Configure** button
 - Set **Enable Plugin** to **True**, then click "Save" at the bottom of the screen
 - Proceed to Configure your Attribute rules
 
 ## Configuration
 
Before you start, Identify the attributes you want to display on a user's profile popover.  These can contain emojis. Some examples could be "Timezone:PST", "Development Team", "Executive Team Member", "Mentor", etc. then Identify the groups, teams or particular usernames that should display those atrributes.  A spreadsheet can help to organize things.

1. Click "Add Custom Attribute" button, a text box will appear.  Add the text that would appear in the user's profile popover. The text supports markdown and could include emojis and/or links, i.e. "[Integrations Team](https://developers.mattermost.com/internal/rd-teams/#integrations-team)"
![2020-04-14_12-12-46](https://user-images.githubusercontent.com/915956/79266979-3e3d2e80-7e4d-11ea-8a4d-80f78bd81d79.png)
2. Specify which users should have that attribute displayed on their profile.  You can specify individual users, a Mattermost team name, or a Mattermost group ID (this ID needs to be copy/pasted from the group).  The Mattermost group could be synched with an LDAP group to dynamically display attributes to user profiles, based on which LDAP group they currently belong to (this requires an E20 licence to enable AD/LDAP Groups). 
![2020-06-21_22-51-13](https://user-images.githubusercontent.com/45119518/85234976-a726c100-b411-11ea-9477-7133c6a6d45b.png)


3. Click "Save"

## Example

Here are some example rules for two users:

![2020-04-14_12-18-50](https://user-images.githubusercontent.com/915956/79267023-4eeda480-7e4d-11ea-9279-e77c97d737be.png)

Their respective profile popovers display their information:

![2020-04-14_12-19-24](https://user-images.githubusercontent.com/915956/79267480-169a9600-7e4e-11ea-8c04-4775a395ff5b.png)

## Usage

To add a custom attribute, edit your `config.json` file and add a "CustomAttributes" field. This field contains an array of the attributes you want to add.

An attribute should have a `Name` field for what is displayed in the user interface as the attribute and an array of `UserIDs` for the users this attribute should apply to. The `Name` field can include Markdown, emojis and links.

You can fill an array of Mattermost team ID's to the `TeamIDs` parameter, and the `Name` will then be displayed
for all members of these teams.

You can also add an array of Mattermost group ID's to the `GroupIDs` parameter. The `Name` will then be displayed
for all members who are apart of that group.

Below is an example:


```
"PluginSettings": {
    ...
    "Plugins": {
        "com.mattermost.custom-attributes": {
            "CustomAttributes": [
                {
                    "Name": ":mattermost: [Core Committer](https://developers.mattermost.com/contribute/getting-started/core-committers/)",
                    "UserIDs": ["someuserID1", "someuserID2"],
                    "TeamIDs": ["someteamID1", "someteamID2"],
                    "GroupIDs":["somegroupID1","somegroupID2"]
                },
                {
                    "Name": ":mattermost: Staff",
                    "UserIDs": ["someuserID3", "someuserID4"],
                    "TeamIDs": ["someteamID3", "someteamID4"],
                    "GroupIDs":["somegroupID3","somegroupID4"]
                }
            ]
        }
    }
    ...
    "PluginStates": {
        ...
        "com.mattermost.custom-attributes": {
            "Enable": true
        },
        ...
    }
},
```

## Development

This plugin contains both a server and web app portion. Read our documentation about the [Developer Workflow](https://developers.mattermost.com/integrate/plugins/developer-workflow/) and [Developer Setup](https://developers.mattermost.com/integrate/plugins/developer-setup/) for more information about developing and extending plugins.

### Releasing new versions

The version of a plugin is determined at compile time, automatically populating a `version` field in the [plugin manifest](plugin.json):
* If the current commit matches a tag, the version will match after stripping any leading `v`, e.g. `1.3.1`.
* Otherwise, the version will combine the nearest tag with `git rev-parse --short HEAD`, e.g. `1.3.1+d06e53e1`.
* If there is no version tag, an empty version will be combined with the short hash, e.g. `0.0.0+76081421`.

To disable this behaviour, manually populate and maintain the `version` field.
