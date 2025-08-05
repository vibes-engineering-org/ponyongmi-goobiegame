/**
 * Firebase configuration and utility functions for GoobieMan game
 * This file handles Firebase initialization and database operations for the global leaderboard
 */

// Firebase configuration object - replace with your own Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};;

// Connection status tracking
let isFirebaseInitialized = false;
let isFirebaseConnected = false;

/**
 * Initialize Firebase and set up connection monitoring
 * @returns {Promise<boolean>} Promise resolving to connection status
 */
function initializeFirebase() {
  return new Promise((resolve, reject) => {
    try {
      // Initialize Firebase only once
      if (!isFirebaseInitialized) {
        firebase.initializeApp(firebaseConfig);
        isFirebaseInitialized = true;
        console.log('Firebase initialized successfully');
      }

      // Set up connection status monitoring
      const connectedRef = firebase.database().ref('.info/connected');
      
      // Track if we've resolved the promise yet
      let hasResolved = false;
      
      connectedRef.on('value', (snap) => {
        const isConnected = snap.val() === true;
        isFirebaseConnected = isConnected;
        console.log('Firebase connection status:', isConnected ? 'connected' : 'disconnected');
        
        // Only resolve the promise when we first get a connection, or after a reasonable timeout
        if (isConnected && !hasResolved) {
          hasResolved = true;
          resolve(true);
        }
      });
      
      // Timeout after 10 seconds if no connection is established
      setTimeout(() => {
        if (!hasResolved) {
          hasResolved = true;
          console.warn('Firebase connection timeout - proceeding with localStorage fallback');
          resolve(false);
        }
      }, 10000);
      
    } catch (error) {
      console.error('Firebase initialization error:', error);
      isFirebaseConnected = false;
      resolve(false);
    }
  });
}

/**
 * Get high scores from Firebase Realtime Database
 * @param {number} limit - Maximum number of scores to retrieve
 * @returns {Promise<Array>} Promise resolving to an array of high scores
 */
async function getFirebaseHighScores(limit = 100) {
  try {
    if (!isFirebaseConnected) {
      console.warn('Firebase not connected, using localStorage fallback');
      return null; // Return null to signal that Firebase is not available
    }

    // Get scores from Firebase, ordered by score descending and limited to specified number
    const snapshot = await firebase.database()
      .ref('highscores')
      .orderByChild('score')
      .limitToLast(limit)
      .once('value');

    if (!snapshot.exists()) {
      return [];
    }

    // Convert snapshot to array and reverse to get descending order
    const highScores = [];
    snapshot.forEach(childSnapshot => {
      highScores.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    // Sort by score in descending order
    return highScores.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error getting Firebase high scores:', error);
    return null; // Return null to signal that an error occurred
  }
}

/**
 * Add a new high score to Firebase
 * @param {string} name - Player name
 * @param {number} score - Player score
 * @param {string} date - Score date in YYYY-MM-DD format
 * @returns {Promise<boolean>} Promise resolving to success status
 */
async function addFirebaseHighScore(name, score, date) {
  try {
    if (!isFirebaseConnected) {
      console.warn('Firebase not connected, using localStorage fallback');
      return false;
    }

    // Generate a new score entry
    const newScoreRef = firebase.database().ref('highscores').push();
    
    await newScoreRef.set({
      name: name,
      score: score,
      date: date
    });
    
    console.log('Score added to Firebase successfully');
    return true;
  } catch (error) {
    console.error('Error adding score to Firebase:', error);
    return false;
  }
}

/**
 * Check if the current score qualifies for the high score list
 * @param {number} score - Current score
 * @param {number} limit - Maximum number of scores to consider
 * @returns {Promise<boolean>} Promise resolving to true if score is a high score
 */
async function isFirebaseHighScore(score, limit = 100) {
  try {
    if (!isFirebaseConnected) {
      console.warn('Firebase not connected, using localStorage fallback');
      return null;
    }

    // Get the current high scores
    const highScores = await getFirebaseHighScores(limit);
    
    // If we have fewer than the limit, it's automatically a high score
    if (highScores.length < limit) {
      return true;
    }
    
    // Find the lowest score
    const lowestScore = Math.min(...highScores.map(entry => entry.score));
    
    // It's a high score if it's higher than the lowest score
    return score > lowestScore;
  } catch (error) {
    console.error('Error checking Firebase high score:', error);
    return null; // Return null to signal an error
  }
}

/**
 * Check if Firebase is connected
 * @returns {boolean} Connection status
 */
function isConnected() {
  return isFirebaseConnected;
}

// Export Firebase utility functions
window.firebaseDB = {
  init: initializeFirebase,
  getHighScores: getFirebaseHighScores,
  addHighScore: addFirebaseHighScore,
  isHighScore: isFirebaseHighScore,
  isConnected: isConnected
}; 