let bookmarkChangeListeners = [];

export const bookmarkService = {
  addBookmarkChangeListener(listener) {
    bookmarkChangeListeners.push(listener);
  },

  removeBookmarkChangeListener(listener) {
    bookmarkChangeListeners = bookmarkChangeListeners.filter(l => l !== listener);
  },

  notifyBookmarkChange() {
    bookmarkChangeListeners.forEach(listener => listener());
  }
};