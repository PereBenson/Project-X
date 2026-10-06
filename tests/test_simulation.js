/**
 * Automated Simulation Tests for VERVE Platform Data Layer & LocalStorage Sync
 */

const fs = require('fs');
const path = require('path');

// 1. Mock LocalStorage in Node environment
const store = new Map();
global.localStorage = {
  getItem: (key) => store.get(key) || null,
  setItem: (key, val) => store.set(key, String(val)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear()
};
global.window = {};

// 2. Load js/data.js
const dataCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf-8');
eval(dataCode);

const StorageManager = global.window.StorageManager;

console.log('======================================================');
console.log('🧪 VERVE Creator Platform - Storage & Workflow Test Suite');
console.log('======================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// Test 1: Initialization
console.log('--- Test Group 1: Storage Initialization ---');
StorageManager.init();
const creators = StorageManager.getCreators();
assert(creators.length === 5, `Initializes 5 top creators (found ${creators.length})`);
assert(creators[0].name === 'Elena Vance', 'Default creator is Elena Vance');

const posts = StorageManager.getPosts();
assert(posts.length >= 4, `Seed posts are loaded (found ${posts.length})`);

const deals = StorageManager.getDeals();
assert(deals.length >= 4, `Seed deals are loaded (found ${deals.length})`);

const txs = StorageManager.getTransactions();
assert(txs.length >= 4, `Seed transactions loaded (found ${txs.length})`);

// Test 2: Role Management & Persistence
console.log('\n--- Test Group 2: Role Switcher & Persistence ---');
assert(StorageManager.getActiveRole() === 'creator', 'Default active role is "creator"');
StorageManager.setActiveRole('brand');
assert(StorageManager.getActiveRole() === 'brand', 'Role switches to "brand"');
assert(localStorage.getItem('verve_active_role_v1') === 'brand', 'Role is persisted to localStorage');
StorageManager.setActiveRole('creator');

// Test 3: Portfolio & Services Management
console.log('\n--- Test Group 3: Creator Portfolio & Services ---');
const newPortItem = StorageManager.addPortfolioItem('creator_1', {
  title: 'Cyberpunk Sneaker 3D Spot',
  client: 'NeoKicks',
  category: '3D/Design',
  image: 'https://example.com/shoe.jpg',
  metrics: { views: '500K', ctr: '7.2%', roas: '5.1x' },
  description: 'High-converting 3D render campaign',
  tags: ['3D', 'Fashion']
});
assert(newPortItem && newPortItem.id.startsWith('port_'), 'Portfolio piece added with unique ID');
const elenaUpdated = StorageManager.getCreatorById('creator_1');
assert(elenaUpdated.portfolio[0].title === 'Cyberpunk Sneaker 3D Spot', 'New project prepended to creator portfolio');

const newService = StorageManager.addService('creator_1', {
  title: 'Express 24h UGC Turnaround',
  price: 550,
  deliveryDays: 1,
  revisions: 1,
  description: 'Urgent ad creative delivered in 24 hours',
  features: ['24-hour delivery', '4K vertical video']
});
assert(newService && newService.price === 550, 'New service tier added to rate card');

// Test 4: Bookmarks / Saved Creators
console.log('\n--- Test Group 4: Bookmark / Save Creators ---');
const initialSaved = StorageManager.getSavedCreatorIds();
const isSaved = StorageManager.toggleSaveCreator('creator_3'); // Aaliyah
assert(isSaved === true, 'Saved creator_3');
assert(StorageManager.getSavedCreatorIds().includes('creator_3'), 'creator_3 found in saved list');
const isUnsaved = StorageManager.toggleSaveCreator('creator_3');
assert(isUnsaved === false, 'Toggled save off for creator_3');

// Test 5: Post Interactions (Like, Tip, Unlock, Comment)
console.log('\n--- Test Group 5: Content Feed, Tipping & Paywall Unlocks ---');
const testPost = posts[0];
const initialLikes = testPost.likes;
const likedPost = StorageManager.toggleLikePost(testPost.id);
assert(likedPost.likes === initialLikes + 1 && likedPost.isLiked === true, 'Like counter increments and persists');
const unlikedPost = StorageManager.toggleLikePost(testPost.id);
assert(unlikedPost.likes === initialLikes && unlikedPost.isLiked === false, 'Unlike decrements and persists');

// Tipping
const tipAmount = 25.00;
const tippedPost = StorageManager.tipPost(testPost.id, tipAmount, 'Great pacing on this cut!', 'Acme Corp');
assert(tippedPost.tipsCount >= 1, 'Post tip count increments');
const latestTx = StorageManager.getTransactions()[0];
assert(latestTx.type === 'tip' && latestTx.amount === 25.00 && latestTx.direction === 'credit', 'Tip is recorded in transactions ledger as credit');

// Unlock paywalled post
const lockedPost = StorageManager.getPosts().find(p => p.isLocked && !p.isUnlocked);
if (lockedPost) {
  const unlocked = StorageManager.unlockPost(lockedPost.id);
  assert(unlocked.isUnlocked === true, 'Paywalled post is unlocked');
  const unlockTx = StorageManager.getTransactions()[0];
  assert(unlockTx.type === 'content_unlock' && unlockTx.direction === 'credit', 'Unlock fee recorded in ledger');
}

// Add comment
const newComment = StorageManager.addComment(testPost.id, 'Super insightful breakdown!', 'TechBrand_Sam');
assert(newComment && newComment.text === 'Super insightful breakdown!', 'Comment added to post');

// Test 6: Complete Brand Deal & Escrow Lifecycle
console.log('\n--- Test Group 6: Brand Deals & Escrow Lifecycle ---');
// Step 1: Brand sends proposal
const newDeal = StorageManager.addDeal({
  brandName: 'Velo Energy',
  creatorId: 'creator_1',
  creatorName: 'Elena Vance',
  title: 'Summer Hydration Campaign 3x Shorts',
  deliverables: '3x 30s high-energy gym videos',
  budget: 1200,
  deadline: '2026-10-25'
});
assert(newDeal.status === 'pending_approval', 'New deal created with "pending_approval"');
assert(newDeal.escrowStatus === 'held_in_escrow', 'Escrow funds secured upon proposal');

// Step 2: Creator accepts deal
const acceptedDeal = StorageManager.updateDealStatus(newDeal.id, 'in_progress');
assert(acceptedDeal.status === 'in_progress', 'Deal status transitioned to "in_progress"');

// Step 3: Creator submits deliverable
const submittedDeal = StorageManager.updateDealStatus(newDeal.id, 'under_review', {
  deliverableUrl: 'https://vimeo.com/preview/mock_velo_energy'
});
assert(submittedDeal.status === 'under_review', 'Deal status transitioned to "under_review"');
assert(submittedDeal.deliverableUrl.includes('vimeo.com'), 'Deliverable URL recorded');

// Step 4: Brand approves & releases escrow
const initialBalance = StorageManager.getWalletSummary('creator_1').availableBalance;
const completedDeal = StorageManager.updateDealStatus(newDeal.id, 'completed');
assert(completedDeal.status === 'completed', 'Deal marked as completed');
assert(completedDeal.escrowStatus === 'released', 'Escrow status marked as released');

const updatedBalance = StorageManager.getWalletSummary('creator_1').availableBalance;
assert(updatedBalance === initialBalance + 1200, `Creator balance credited +$1,200 (was ${initialBalance}, now ${updatedBalance})`);

// Test 7: Wallet Summary & Payout Flow
console.log('\n--- Test Group 7: Wallet Analytics & Withdrawal Flow ---');
const summary = StorageManager.getWalletSummary('creator_1');
assert(summary.availableBalance > 0, `Available balance is positive: $${summary.availableBalance.toFixed(2)}`);
assert(summary.totalEarned >= summary.availableBalance, 'Total earned is greater than or equal to available balance');

// Overdraft rejection
const invalidWithdrawal = StorageManager.requestPayout(999999, { method: 'PayPal' });
assert(invalidWithdrawal.success === false, 'Overdraft payout correctly rejected');

// Valid withdrawal
const validWithdrawal = StorageManager.requestPayout(500, { method: 'Stripe Direct' });
assert(validWithdrawal.success === true, 'Valid withdrawal of $500 processed');
const afterWithdrawSummary = StorageManager.getWalletSummary('creator_1');
assert(afterWithdrawSummary.availableBalance === summary.availableBalance - 500, 'Balance deducted by withdrawal amount');

console.log('\n======================================================');
console.log(`🎉 TEST SUMMARY: ${passedTests} / ${totalTests} tests passed successfully!`);
console.log('======================================================\n');
