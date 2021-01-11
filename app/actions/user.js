export function setLogin(user) {
  return {
    type: 'SET_LOGIN',
    user: user
  }
}

export function setLogOut() {
  return {
    type: 'SET_LOGOUT',
    user: null
  }
}

export function setPreferences(preferences) {
  return {
    type: 'SET_PREFERENCES',
    preferences: preferences
  }
}
