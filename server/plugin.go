package main

import (
	"encoding/json"
	"net/http"
	"sync"

	"github.com/mattermost/mattermost/server/public/model"
	"github.com/mattermost/mattermost/server/public/plugin"
)

type Plugin struct {
	plugin.MattermostPlugin

	// configuration is the active plugin configuration. Consult getConfiguration and
	// setConfiguration for usage.
	configuration *configuration

	// configurationLock synchronizes access to the configuration.
	configurationLock sync.RWMutex
}

func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("Mattermost-User-ID")
	if userID == "" {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	switch path := r.URL.Path; path {
	case "/api/v1/attributes":
		p.handleGetAttributes(w, r)
		return
	default:
		http.NotFound(w, r)
	}
}

func (p *Plugin) handleGetAttributes(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.NotFound(w, r)
		return
	}

	config := p.getConfiguration()
	if !config.IsValid() {
		http.Error(w, "Not configured", http.StatusNotImplemented)
		return
	}

	userID := r.URL.Query().Get("user_id")

	if userID == "" {
		http.Error(w, "Missing user_id", http.StatusBadRequest)
		return
	}

	attributes := []string{}
	usersTeams, _ := p.API.GetTeamsForUser(userID)
	usersGroups, _ := p.API.GetGroupsForUser(userID)
	for _, ca := range config.CustomAttributes {
		if ca.UserIDs == nil && ca.TeamIDs == nil && ca.GroupIDs == nil {
			continue
		}
		if sliceContainsString(ca.UserIDs, userID) || sliceContainsUserTeam(ca.TeamIDs, usersTeams) || sliceContainsUserGroup(ca.GroupIDs, usersGroups) {
			attributes = append(attributes, ca.Name)
		}
	}

	b, jsonErr := json.Marshal(attributes)
	if jsonErr != nil {
		http.Error(w, "Error encoding json", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err := w.Write(b)
	if err != nil {
		p.API.LogError("failed to write http response", err.Error())
	}
}

func sliceContainsString(arr []string, str string) bool {
	for _, a := range arr {
		if a == str {
			return true
		}
	}
	return false
}

func sliceContainsUserTeam(arr []string, userTeams []*model.Team) bool {
	for _, a := range arr {
		for _, userTeam := range userTeams {
			if a == userTeam.Id {
				return true
			}
		}
	}
	return false
}

func sliceContainsUserGroup(arr []string, userGroups []*model.Group) bool {
	for _, a := range arr {
		for _, userGroup := range userGroups {
			if a == userGroup.Id {
				return true
			}
		}
	}
	return false
}
