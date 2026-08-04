export const settingsConfig = {
  root: {
    type: "settings",
    getParams() {
      return {
        sections: [
          {
            title: "Appearance",
            items: [
              {
                id: "darkMode",
                icon: "🌙",
                title: "Dark mode",
                description: "Use a darker color theme",
                type: "toggle",
              },
              {
                id: "language",
                icon: "🌍",
                title: "Language",
                description: "Choose your app language",
                type: "select",
                options: [
                  "English",
                  "German",
                  "French"
                ],
              }
            ]
          },

          {
            title: "Notifications",
            items: [
              {
                id: "pushNotifications",
                icon: "🔔",
                title: "Push notifications",
                description: "Receive updates from the app",
                type: "toggle",
              }
            ]
          },

          {
            title: "Account",
            items: [
              {
                id: "profile",
                icon: "👤",
                title: "Profile",
                description: "Manage your profile",
                type: "link",
                action() {
                  console.log("Open profile");
                }
              }
            ]
          }
        ]
      }
    }
  },
};