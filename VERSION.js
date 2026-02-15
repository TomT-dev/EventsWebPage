/**
 * Version History for EventsWebPage
 * 
 * This file tracks all deployments of the EventsWebPage Google Apps Script project.
 * Each entry records the version number, deployment date, machine used, and changes made.
 */

const VERSION_HISTORY = [
  {
    version: 1,
    date: '2026-01-18 17:02',
    machine: 'tom-HP-Pavilion-Laptop-16-af0xxx',
    changes: 'Initial VERSION.js tracking setup'
  },
,
  {
    version: 20,
    date: '2026-01-18 17:03',
    machine: 'tom-HP-Pavilion-Laptop-16-af0xxx',
    changes: 'Add VERSION.js tracking for deployments'
  }
  ,
  {
    version: 21,
    date: '2026-02-15 18:45',
    machine: 'tom-HP-Pavilion-Laptop-16-af0xxx',
    changes: 'return zoom link'
  }
    // Add new entries above this line
];

/**
 * Gets the current version number
 * @return {number} Current version number
 */
function getCurrentVersion() {
  return VERSION_HISTORY[0].version;
}

/**
 * Gets the full version history
 * @return {Array} Array of version objects
 */
function getVersionHistory() {
  return VERSION_HISTORY;
}
