/* Central place to boot all demos on page load */
import { startBouncing } from './bouncingBall.js';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('bouncingBall')) {
    startBouncing('bouncingBall');
  }
  // Add more demo boot-straps here as you create them.
});
