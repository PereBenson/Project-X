/**
 * VERVE Creator Economy Platform - Core Application Logic
 * Handles dynamic UI rendering, state synchronization, role management,
 * modals, and local storage events.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize App
  App.init();
});

const App = {
  activeRole: 'creator', // 'creator' | 'brand'
  activeCreatorId: 'creator_1',
  activeTab: 'marketplace',
  activeSubtab: 'work',
  activeNicheFilter: 'all',
  activeDealsFilter: 'all',
  searchQuery: '',
  sortOrder: 'rating',

  init() {
    this.activeRole = StorageManager.getActiveRole();
    this.activeCreatorId = StorageManager.getActiveCreatorId();

    this.bindEvents();
    this.syncRoleUI();
    this.handleRoute();
    this.renderAll();
  },

  // --------------------------------------------------------------------------
  // Event Listeners & Router
  // --------------------------------------------------------------------------
  bindEvents() {
    // Navigation Tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Hash change routing
    window.addEventListener('hashchange', () => {
      this.handleRoute();
    });

    // Role Switcher
    const btnCreator = document.getElementById('btnRoleCreator');
    const btnBrand = document.getElementById('btnRoleBrand');
    if (btnCreator) {
      btnCreator.addEventListener('click', () => this.switchRole('creator'));
    }
    if (btnBrand) {
      btnBrand.addEventListener('click', () => this.switchRole('brand'));
    }

    // Quick Wallet Pill Click -> Switch to Wallet tab
    const walletPill = document.getElementById('quickWalletPill');
    if (walletPill) {
      walletPill.addEventListener('click', () => this.switchTab('wallet'));
    }

    // Marketplace Search & Filters
    const searchInput = document.getElementById('marketplaceSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderMarketplace();
      });
    }

    const nicheRow = document.getElementById('nicheFiltersRow');
    if (nicheRow) {
      nicheRow.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-chip')) {
          nicheRow.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
          e.target.classList.add('active');
          this.activeNicheFilter = e.target.getAttribute('data-niche');
          this.renderMarketplace();
        }
      });
    }

    const sortSelect = document.getElementById('marketplaceSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortOrder = e.target.value;
        this.renderMarketplace();
      });
    }

    // Feed Composer
    const btnPublish = document.getElementById('btnPublishPost');
    if (btnPublish) {
      btnPublish.addEventListener('click', () => this.handlePublishPost());
    }

    const paywallCheck = document.getElementById('composerPaywallCheck');
    const unlockPriceInput = document.getElementById('composerUnlockPrice');
    if (paywallCheck && unlockPriceInput) {
      paywallCheck.addEventListener('change', (e) => {
        unlockPriceInput.style.display = e.target.checked ? 'block' : 'none';
      });
    }

    // Studio Sub-Tabs
    const subtabNav = document.querySelector('.portfolio-subtabs-nav');
    if (subtabNav) {
      subtabNav.addEventListener('click', (e) => {
        if (e.target.classList.contains('subtab-btn')) {
          subtabNav.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          this.switchStudioSubtab(e.target.getAttribute('data-subtab'));
        }
      });
    }

    // Studio Action Buttons
    const btnAddProject = document.getElementById('btnStudioAddProject');
    if (btnAddProject) {
      btnAddProject.addEventListener('click', () => this.openModal('portfolioModal'));
    }

    const btnAddService = document.getElementById('btnStudioAddService');
    if (btnAddService) {
      btnAddService.addEventListener('click', () => this.openModal('serviceModal'));
    }

    const btnDirectHire = document.getElementById('btnStudioDirectHire');
    if (btnDirectHire) {
      btnDirectHire.addEventListener('click', () => {
        this.openHireModalForCreator(this.activeCreatorId);
      });
    }

    // Deals Status Filter Nav
    const dealsFilterNav = document.getElementById('dealsFilterNav');
    if (dealsFilterNav) {
      dealsFilterNav.addEventListener('click', (e) => {
        if (e.target.classList.contains('deal-filter-btn')) {
          dealsFilterNav.querySelectorAll('.deal-filter-btn').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          this.activeDealsFilter = e.target.getAttribute('data-deal-filter');
          this.renderDeals();
        }
      });
    }

    const btnNewProposal = document.getElementById('btnCreateNewProposal');
    if (btnNewProposal) {
      btnNewProposal.addEventListener('click', () => this.openHireModalForCreator());
    }

    // Wallet Withdraw Button
    const btnWithdraw = document.getElementById('btnRequestWithdrawal');
    if (btnWithdraw) {
      btnWithdraw.addEventListener('click', () => {
        const summary = StorageManager.getWalletSummary(this.activeCreatorId);
        document.getElementById('payoutModalAvailableBal').textContent = `$${summary.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        document.getElementById('payoutAmountInput').max = summary.availableBalance;
        this.openModal('payoutModal');
      });
    }

    // Reset Demo Data
    const btnReset = document.getElementById('btnResetDemoData');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Reset platform data to default demo state? All custom posts, deals and earnings will be restored to default.')) {
          StorageManager.resetToDefaults();
          this.activeCreatorId = 'creator_1';
          this.renderAll();
          this.showToast('Platform reset to default demonstration state.', 'info');
        }
      });
    }

    // Modal forms submission
    this.bindForms();
    this.bindModalCloseEvents();
  },

  handleRoute() {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['marketplace', 'feed', 'portfolio', 'deals', 'wallet'];
    if (validTabs.includes(hash)) {
      this.switchTab(hash, false);
    }
  },

  switchTab(tabName, updateHash = true) {
    this.activeTab = tabName;
    if (updateHash) {
      window.location.hash = tabName;
    }

    // Update active nav button
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    // Update pane visibility
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `pane-${tabName}`);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh specific tab state if needed
    if (tabName === 'deals') this.renderDeals();
    if (tabName === 'wallet') this.renderWallet();
    if (tabName === 'portfolio') this.renderStudio();
    if (tabName === 'feed') this.renderFeed();
    if (tabName === 'marketplace') this.renderMarketplace();
  },

  switchRole(newRole) {
    this.activeRole = newRole;
    StorageManager.setActiveRole(newRole);
    this.syncRoleUI();
    this.renderAll();

    const roleName = newRole === 'creator' ? 'Creator Mode (Elena Vance)' : 'Brand / Business Mode (Apex Brands)';
    this.showToast(`Switched to ${roleName}`, 'info');
  },

  syncRoleUI() {
    const btnCreator = document.getElementById('btnRoleCreator');
    const btnBrand = document.getElementById('btnRoleBrand');
    const userAvatar = document.getElementById('headerUserAvatar');
    const userName = document.getElementById('headerUserName');
    const userRole = document.getElementById('headerUserRole');
    const walletLabel = document.getElementById('walletPillLabel');
    const composerCard = document.getElementById('feedComposerCard');
    const studioAddProject = document.getElementById('btnStudioAddProject');
    const studioAddService = document.getElementById('btnStudioAddService');

    if (this.activeRole === 'creator') {
      btnCreator?.classList.add('active');
      btnBrand?.classList.remove('active');

      const creator = StorageManager.getCreatorById(this.activeCreatorId);
      if (userAvatar) userAvatar.src = creator.avatar;
      if (userName) userName.textContent = creator.name;
      if (userRole) userRole.textContent = 'Top Creator';
      if (walletLabel) walletLabel.textContent = 'Available';

      if (composerCard) composerCard.style.display = 'block';
      if (studioAddProject) studioAddProject.style.display = 'inline-flex';
      if (studioAddService) studioAddService.style.display = 'inline-flex';
    } else {
      btnCreator?.classList.remove('active');
      btnBrand?.classList.add('active');

      if (userAvatar) userAvatar.src = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80';
      if (userName) userName.textContent = 'Apex Brands';
      if (userRole) userRole.textContent = 'Brand Partner';
      if (walletLabel) walletLabel.textContent = 'Escrow Pool';

      if (composerCard) composerCard.style.display = 'none';
      if (studioAddProject) studioAddProject.style.display = 'none';
      if (studioAddService) studioAddService.style.display = 'none';
    }

    this.updateHeaderWalletPill();
  },

  updateHeaderWalletPill() {
    const summary = StorageManager.getWalletSummary(this.activeCreatorId);
    const balanceElem = document.getElementById('quickWalletBalance');
    if (balanceElem) {
      if (this.activeRole === 'creator') {
        balanceElem.textContent = `$${summary.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      } else {
        balanceElem.textContent = `$${(12500 - summary.inEscrow).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      }
    }

    const activeDealsPill = document.getElementById('activeDealsCountPill');
    if (activeDealsPill) {
      activeDealsPill.textContent = summary.activeDealsCount;
    }
  },

  renderAll() {
    this.renderMarketplace();
    this.renderFeed();
    this.renderStudio();
    this.renderDeals();
    this.renderWallet();
    this.updateHeaderWalletPill();
  },

  // --------------------------------------------------------------------------
  // 1. Marketplace View
  // --------------------------------------------------------------------------
  renderMarketplace() {
    const container = document.getElementById('creatorsGridContainer');
    if (!container) return;

    let creators = StorageManager.getCreators();
    const savedIds = StorageManager.getSavedCreatorIds();

    // Niche filter
    if (this.activeNicheFilter !== 'all') {
      creators = creators.filter(c => c.niches && c.niches.includes(this.activeNicheFilter));
    }

    // Search query
    if (this.searchQuery) {
      creators = creators.filter(c => 
        c.name.toLowerCase().includes(this.searchQuery) ||
        c.handle.toLowerCase().includes(this.searchQuery) ||
        c.tagline.toLowerCase().includes(this.searchQuery) ||
        (c.niches && c.niches.some(n => n.toLowerCase().includes(this.searchQuery)))
      );
    }

    // Sorting
    if (this.sortOrder === 'rating') {
      creators.sort((a, b) => b.rating - a.rating);
    } else if (this.sortOrder === 'price-low') {
      creators.sort((a, b) => a.startingRate - b.startingRate);
    } else if (this.sortOrder === 'price-high') {
      creators.sort((a, b) => b.startingRate - a.startingRate);
    }

    if (creators.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">No Creators Match Your Filters</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Try adjusting your keywords or clearing the active category filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = creators.map(creator => {
      const isSaved = savedIds.includes(creator.id);
      const nicheBadges = (creator.niches || []).map(n => `<span class="badge badge-primary">${n}</span>`).join('');
      
      return `
        <article class="creator-card" data-creator-id="${creator.id}">
          <div style="position: relative;">
            <img src="${creator.coverImage}" alt="${creator.name} Cover" class="creator-card-cover" loading="lazy">
            <button class="creator-card-bookmark-btn ${isSaved ? 'saved' : ''}" 
                    title="${isSaved ? 'Remove from Saved' : 'Save Creator'}" 
                    onclick="App.handleToggleSaveCreator('${creator.id}', event)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>

          <div class="creator-card-body">
            <div class="creator-card-avatar-wrap">
              <img src="${creator.avatar}" alt="${creator.name}" class="creator-card-avatar" loading="lazy">
              <div class="creator-verified-icon">✓</div>
            </div>

            <div class="creator-card-header">
              <div>
                <a href="#portfolio" class="creator-card-name" onclick="App.viewCreatorProfile('${creator.id}')">${creator.name}</a>
                <span class="creator-card-handle">${creator.handle}</span>
              </div>
              <div class="creator-rating-pill">
                <span>★</span>
                <span>${creator.rating}</span>
                <span style="font-weight: 400; color: var(--text-dim);">(${creator.reviewCount})</span>
              </div>
            </div>

            <p class="creator-card-tagline">${creator.tagline}</p>

            <div class="creator-card-metrics">
              <div class="metric-col">
                <div class="metric-col-val">${creator.stats.followers}</div>
                <div class="metric-col-label">Audience</div>
              </div>
              <div class="metric-col">
                <div class="metric-col-val">${creator.stats.avgEngagement}</div>
                <div class="metric-col-label">Engage Rate</div>
              </div>
              <div class="metric-col">
                <div class="metric-col-val">${creator.stats.completedDeals}</div>
                <div class="metric-col-label">Hires</div>
              </div>
            </div>

            <div class="creator-card-niches">
              ${nicheBadges}
            </div>

            <div class="creator-card-footer">
              <div class="creator-starting-rate">
                <span class="rate-label">Starting From</span>
                <span class="rate-amount">$${creator.startingRate} <span>/ deal</span></span>
              </div>

              <div class="creator-card-actions">
                <button class="btn btn-secondary btn-sm" onclick="App.viewCreatorProfile('${creator.id}')">Portfolio</button>
                <button class="btn btn-primary btn-sm" onclick="App.openHireModalForCreator('${creator.id}')">Hire</button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  },

  handleToggleSaveCreator(creatorId, event) {
    event.stopPropagation();
    const isSaved = StorageManager.toggleSaveCreator(creatorId);
    this.renderMarketplace();
    this.showToast(isSaved ? 'Creator saved to your talent bench!' : 'Creator removed from saved list.', 'info');
  },

  viewCreatorProfile(creatorId) {
    this.activeCreatorId = creatorId;
    StorageManager.setActiveCreatorId(creatorId);
    this.renderStudio();
    this.switchTab('portfolio');
  },

  // --------------------------------------------------------------------------
  // 2. Feed & Drops View
  // --------------------------------------------------------------------------
  renderFeed() {
    const container = document.getElementById('postsStreamContainer');
    if (!container) return;

    const posts = StorageManager.getPosts();

    container.innerHTML = posts.map(post => {
      const isLocked = post.isLocked && !post.isUnlocked;

      const commentsHTML = (post.comments || []).map(c => `
        <div class="comment-item">
          <img src="${c.avatar}" alt="${c.user}" class="comment-avatar">
          <div class="comment-bubble">
            <div class="comment-user">${c.user} <span style="font-weight:400; color:var(--text-dim); margin-left:0.35rem;">${c.time}</span></div>
            <div class="comment-text">${c.text}</div>
          </div>
        </div>
      `).join('');

      return `
        <article class="post-card" id="card-${post.id}">
          <header class="post-card-header">
            <div class="post-author-block">
              <img src="${post.creatorAvatar}" alt="${post.creatorName}" class="post-author-avatar">
              <div class="post-author-info">
                <span class="post-author-name">${post.creatorName}</span>
                <span class="post-author-handle">${post.creatorHandle}</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="badge ${post.isLocked ? 'badge-amber' : 'badge-primary'}">${post.badge || 'Drop'}</span>
              <span class="post-timestamp">${post.timestamp}</span>
            </div>
          </header>

          <div class="post-card-content">
            <h3 class="post-card-title">${post.title}</h3>
            <p class="post-card-text">${post.content}</p>
            <div class="post-tags-row">
              ${(post.tags || []).map(t => `<span class="post-tag">#${t}</span>`).join('')}
            </div>
          </div>

          <!-- Media container with paywall support -->
          <div class="post-media-container">
            <img src="${post.mediaUrl}" alt="Media Drop" class="post-media-img" loading="lazy">
            
            ${isLocked ? `
              <div class="post-locked-overlay">
                <div class="lock-shield-icon">🔒</div>
                <h4 class="lock-title">Supporters & Backers Exclusive</h4>
                <p class="lock-desc">This premium creator drop contains project source files, presets, and commercial templates.</p>
                <button class="btn btn-emerald" onclick="App.handleUnlockPost('${post.id}', ${post.unlockPrice})">
                  Unlock Asset for $${post.unlockPrice || 10}.00
                </button>
              </div>
            ` : ''}
          </div>

          <!-- Action Bar -->
          <footer class="post-card-actions">
            <div class="post-action-group">
              <!-- Like button -->
              <button class="post-action-btn ${post.isLiked ? 'liked' : ''}" onclick="App.handleLikePost('${post.id}')">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="${post.isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>${post.likes || 0}</span>
              </button>

              <!-- Tip button -->
              <button class="post-action-btn tipped" onclick="App.openTipModal('${post.id}', '${post.creatorId}', '${post.creatorName}')">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v12M15 9.5H10.5a2 2 0 0 0 0 4h3a2 2 0 0 1 0 4H9"></path>
                </svg>
                <span>Tip $${post.tipsAmount || 0} (${post.tipsCount || 0})</span>
              </button>

              <!-- Comments count toggle -->
              <button class="post-action-btn" onclick="App.toggleCommentsBox('${post.id}')">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span>${(post.comments || []).length}</span>
              </button>
            </div>

            <div>
              <button class="btn btn-secondary btn-sm" onclick="App.openHireModalForCreator('${post.creatorId}')">
                Employ ${post.creatorName.split(' ')[0]}
              </button>
            </div>
          </footer>

          <!-- Comments Section -->
          <div class="post-comments-container" id="comments-${post.id}">
            <div class="comment-input-row">
              <input type="text" class="comment-input" id="input-comment-${post.id}" placeholder="Write a comment or congratulations...">
              <button class="btn btn-primary btn-sm" onclick="App.handleAddComment('${post.id}')">Reply</button>
            </div>
            <div class="comments-list">
              ${commentsHTML}
            </div>
          </div>
        </article>
      `;
    }).join('');

    this.renderSidebarTrending();
  },

  renderSidebarTrending() {
    const list = document.getElementById('sidebarTrendingCreatorsList');
    if (!list) return;

    const creators = StorageManager.getCreators().slice(0, 4);
    list.innerHTML = creators.map(c => `
      <div class="top-creator-item">
        <div class="top-creator-info">
          <img src="${c.avatar}" alt="${c.name}" class="top-creator-avatar">
          <div>
            <div style="font-size:0.85rem; font-weight:700; cursor:pointer;" onclick="App.viewCreatorProfile('${c.id}')">${c.name}</div>
            <div style="font-size:0.75rem; color:var(--text-dim);">${c.stats.followers} • ${c.rating}★</div>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="App.openHireModalForCreator('${c.id}')">Hire</button>
      </div>
    `).join('');
  },

  handlePublishPost() {
    const titleInput = document.getElementById('composerPostTitle');
    const contentInput = document.getElementById('composerPostContent');
    const paywallCheck = document.getElementById('composerPaywallCheck');
    const priceInput = document.getElementById('composerUnlockPrice');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
      this.showToast('Please provide a title and description for your drop.', 'error');
      return;
    }

    const isLocked = paywallCheck.checked;
    const unlockPrice = isLocked ? Number(priceInput.value) || 10 : 0;

    StorageManager.addPost({
      title,
      content,
      isLocked,
      unlockPrice,
      badge: isLocked ? 'Exclusive Drop' : 'Behind The Scenes',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      tags: ['CreatorEconomy', 'VerveExclusive', 'UGCPro']
    });

    titleInput.value = '';
    contentInput.value = '';
    paywallCheck.checked = false;
    priceInput.style.display = 'none';

    this.renderFeed();
    this.showToast('🎉 Your new creative drop was published to the feed!', 'success');
  },

  handleLikePost(postId) {
    const updated = StorageManager.toggleLikePost(postId);
    if (updated) {
      this.renderFeed();
    }
  },

  handleUnlockPost(postId, price) {
    StorageManager.unlockPost(postId);
    this.renderFeed();
    this.updateHeaderWalletPill();
    this.showToast(`✨ Content unlocked! $${price || 10} credited to creator wallet.`, 'success');
  },

  openTipModal(postId, creatorId, creatorName) {
    document.getElementById('tipPostId').value = postId;
    document.getElementById('tipCreatorId').value = creatorId;
    document.getElementById('tipModalTitle').textContent = `Tip ${creatorName}`;
    this.openModal('tipModal');
  },

  handleAddComment(postId) {
    const input = document.getElementById(`input-comment-${postId}`);
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const userName = this.activeRole === 'creator' ? 'Elena Vance' : 'Apex Brands Partner';
    StorageManager.addComment(postId, text, userName);
    input.value = '';
    this.renderFeed();
  },

  toggleCommentsBox(postId) {
    const box = document.getElementById(`comments-${postId}`);
    if (box) {
      box.style.display = box.style.display === 'none' ? 'block' : 'none';
    }
  },

  // --------------------------------------------------------------------------
  // 3. Creator Studio & Portfolio View
  // --------------------------------------------------------------------------
  renderStudio() {
    const creator = StorageManager.getCreatorById(this.activeCreatorId);
    if (!creator) return;

    // Cover & Profile Header
    document.getElementById('studioCoverImage').src = creator.coverImage;
    document.getElementById('studioAvatarImage').src = creator.avatar;
    document.getElementById('studioDisplayName').textContent = creator.name;
    document.getElementById('studioLocationBadge').textContent = creator.location;
    document.getElementById('studioRatingPill').textContent = `★ ${creator.rating} (${creator.reviewCount} brand reviews)`;
    document.getElementById('studioBioText').textContent = creator.bio;

    // Badges
    const badgesRow = document.getElementById('studioBadgesRow');
    if (badgesRow) {
      badgesRow.innerHTML = (creator.badges || []).map(b => `<span class="badge badge-primary">${b}</span>`).join('') +
        (creator.niches || []).map(n => `<span class="badge badge-emerald">${n}</span>`).join('');
    }

    // Stats Bar
    document.getElementById('studioFollowersCount').textContent = creator.stats.followers;
    document.getElementById('studioImpressionsCount').textContent = creator.stats.totalImpressions;
    document.getElementById('studioAvgEngagement').textContent = creator.stats.avgEngagement;
    document.getElementById('studioCompletedDeals').textContent = creator.stats.completedDeals;

    // Render Subtabs
    this.renderStudioProjects(creator);
    this.renderStudioServices(creator);
    this.renderStudioReviews(creator);
  },

  switchStudioSubtab(subtabName) {
    this.activeSubtab = subtabName;
    document.querySelectorAll('.subtab-pane').forEach(p => p.style.display = 'none');
    const target = document.getElementById(`subtab-${subtabName}`);
    if (target) target.style.display = 'block';
  },

  renderStudioProjects(creator) {
    const grid = document.getElementById('portfolioProjectsGrid');
    if (!grid) return;

    const portfolio = creator.portfolio || [];
    if (portfolio.length === 0) {
      grid.innerHTML = `<p style="color:var(--text-muted); padding:2rem;">No portfolio pieces uploaded yet.</p>`;
      return;
    }

    grid.innerHTML = portfolio.map(item => `
      <div class="portfolio-item-card" onclick="App.openProjectInspection('${creator.id}', '${item.id}')">
        <img src="${item.image}" alt="${item.title}" class="portfolio-item-thumbnail" loading="lazy">
        <div class="portfolio-item-body">
          <span class="portfolio-client-tag">${item.client} • ${item.category}</span>
          <h4 class="portfolio-item-title">${item.title}</h4>
          
          <div class="portfolio-metrics-pill-row">
            ${item.metrics.views ? `<span class="metric-pill">Views: <strong>${item.metrics.views}</strong></span>` : ''}
            ${item.metrics.ctr ? `<span class="metric-pill">CTR: <strong>${item.metrics.ctr}</strong></span>` : ''}
            ${item.metrics.roas ? `<span class="metric-pill">ROAS: <strong>${item.metrics.roas}</strong></span>` : ''}
          </div>

          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.75rem;">
            ${item.description}
          </p>

          <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
            ${(item.tags || []).map(t => `<span class="badge badge-primary" style="font-size:0.7rem;">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  },

  renderStudioServices(creator) {
    const grid = document.getElementById('servicesPackagesGrid');
    if (!grid) return;

    const services = creator.services || [];
    grid.innerHTML = services.map(srv => `
      <div class="service-card ${srv.popular ? 'popular' : ''}">
        ${srv.popular ? `<div class="popular-ribbon">Most Requested</div>` : ''}
        <h3 class="service-title">${srv.title}</h3>
        <div class="service-price-block">
          <span class="service-price">$${srv.price}</span>
          <div class="service-duration">⚡ ${srv.deliveryDays} Days Turnaround • ${srv.revisions} Revisions</div>
        </div>

        <p class="service-desc">${srv.description}</p>

        <ul class="service-features-list">
          ${(srv.features || []).map(f => `
            <li class="service-feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>

        <button class="btn btn-primary" onclick="App.bookServicePackage('${creator.id}', '${srv.id}')">
          Book Package ($${srv.price})
        </button>
      </div>
    `).join('');
  },

  renderStudioReviews(creator) {
    const grid = document.getElementById('studioReviewsGrid');
    if (!grid) return;

    const reviews = creator.reviews || [];
    grid.innerHTML = reviews.map(r => `
      <div class="review-card">
        <div class="review-card-header">
          <span class="review-brand-name">${r.brand}</span>
          <span class="review-stars">★★★★★</span>
        </div>
        <p class="review-quote">"${r.comment}"</p>
        <div class="review-author">— ${r.author} • ${r.date}</div>
      </div>
    `).join('');
  },

  openProjectInspection(creatorId, projectId) {
    const creator = StorageManager.getCreatorById(creatorId);
    const item = (creator.portfolio || []).find(p => p.id === projectId);
    if (!item) return;

    document.getElementById('detailProjectClient').textContent = `${item.client} • ${item.category}`;
    document.getElementById('detailProjectTitle').textContent = item.title;
    document.getElementById('detailProjectImage').src = item.image;
    document.getElementById('detailProjectDescription').textContent = item.description;

    const metricsRow = document.getElementById('detailProjectMetricsRow');
    metricsRow.innerHTML = `
      ${item.metrics.views ? `<div class="badge badge-cyan">Impressions: ${item.metrics.views}</div>` : ''}
      ${item.metrics.ctr ? `<div class="badge badge-emerald">Click-Through: ${item.metrics.ctr}</div>` : ''}
      ${item.metrics.roas ? `<div class="badge badge-amber">Attributed ROAS: ${item.metrics.roas}</div>` : ''}
    `;

    document.getElementById('btnDetailBookSimilar').onclick = () => {
      this.closeModal('projectDetailModal');
      this.openHireModalForCreator(creatorId, `Similar Campaign to: ${item.title}`);
    };

    this.openModal('projectDetailModal');
  },

  bookServicePackage(creatorId, serviceId) {
    const creator = StorageManager.getCreatorById(creatorId);
    const srv = (creator.services || []).find(s => s.id === serviceId);
    if (!srv) return;

    this.openHireModalForCreator(creatorId, srv.title, srv.description, srv.price);
  },

  // --------------------------------------------------------------------------
  // 4. Brand Deals & Escrow Workflow View
  // --------------------------------------------------------------------------
  renderDeals() {
    const container = document.getElementById('dealsStackContainer');
    if (!container) return;

    let deals = StorageManager.getDeals();

    // Filter deals
    if (this.activeDealsFilter !== 'all') {
      deals = deals.filter(d => d.status === this.activeDealsFilter);
    }

    if (deals.length === 0) {
      container.innerHTML = `
        <div style="padding: 3.5rem; text-align: center; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🤝</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">No Deals in this Status</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">You can hire creators directly or send custom campaign proposals anytime.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = deals.map(deal => {
      const isCreator = this.activeRole === 'creator';

      // Stepper progress calculation
      const timelineNodes = (deal.timeline || []).map((step, idx) => {
        let nodeClass = '';
        if (step.done) nodeClass = 'done';
        else if (idx === deal.timeline.findIndex(s => !s.done)) nodeClass = 'current';

        return `
          <div class="stepper-node ${nodeClass}">
            <div class="stepper-dot">${step.done ? '✓' : idx + 1}</div>
            <span class="stepper-step-title">${step.step}</span>
            <span class="stepper-step-date">${step.date}</span>
          </div>
        `;
      }).join('');

      // Status Badge
      let statusBadge = `<span class="badge badge-amber">Pending Acceptance</span>`;
      if (deal.status === 'in_progress') statusBadge = `<span class="badge badge-primary">In Progress</span>`;
      if (deal.status === 'under_review') statusBadge = `<span class="badge badge-cyan">Under Brand Review</span>`;
      if (deal.status === 'completed') statusBadge = `<span class="badge badge-emerald">✓ Completed & Paid</span>`;

      // Role Action Buttons
      let actionButtons = '';
      if (deal.status === 'pending_approval') {
        if (isCreator) {
          actionButtons = `
            <button class="btn btn-secondary btn-sm" onclick="App.handleUpdateDealStatus('${deal.id}', 'declined')">Decline</button>
            <button class="btn btn-emerald btn-sm" onclick="App.handleUpdateDealStatus('${deal.id}', 'in_progress')">Accept Deal & Start Work</button>
          `;
        } else {
          actionButtons = `<span style="font-size:0.85rem; color:var(--text-muted);">⏳ Waiting for creator acceptance. Escrow is safely secured.</span>`;
        }
      } else if (deal.status === 'in_progress') {
        if (isCreator) {
          actionButtons = `
            <button class="btn btn-primary btn-sm" onclick="App.openDeliverableModal('${deal.id}')">Submit Deliverables & Request Payment</button>
          `;
        } else {
          actionButtons = `<span style="font-size:0.85rem; color:var(--text-muted);">⚡ Creator is producing campaign deliverables. Target: ${deal.deadline}</span>`;
        }
      } else if (deal.status === 'under_review') {
        if (!isCreator) {
          actionButtons = `
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <a href="${deal.deliverableUrl || '#'}" target="_blank" class="btn btn-secondary btn-sm">Inspect Assets ↗</a>
              <button class="btn btn-emerald btn-sm" onclick="App.handleApproveAndReleaseEscrow('${deal.id}')">
                Approve & Release $${deal.budget.toFixed(2)} Escrow
              </button>
            </div>
          `;
        } else {
          actionButtons = `<span style="font-size:0.85rem; color:var(--brand-cyan);">Draft submitted for review. Brand will release payment upon sign-off.</span>`;
        }
      } else if (deal.status === 'completed') {
        actionButtons = `
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:0.85rem; color:var(--brand-emerald);">Escrow released on completion.</span>
            ${deal.deliverableUrl ? `<a href="${deal.deliverableUrl}" target="_blank" class="btn btn-secondary btn-sm">View Assets ↗</a>` : ''}
          </div>
        `;
      }

      return `
        <div class="deal-card">
          <div class="deal-card-top">
            <div class="deal-partner-info">
              <img src="${deal.brandLogo}" alt="${deal.brandName}" class="deal-brand-logo">
              <div class="deal-meta-header">
                <span class="deal-title">${deal.title}</span>
                <span class="deal-brand-subtitle">Partner: <strong>${deal.brandName}</strong> • Talent: <strong>${deal.creatorName}</strong></span>
              </div>
            </div>

            <div class="deal-financials-block">
              <div class="deal-budget-amount">$${deal.budget.toFixed(2)}</div>
              <div class="deal-escrow-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span>${deal.escrowStatus === 'released' ? 'Funds Released' : 'Held in Escrow'}</span>
              </div>
            </div>
          </div>

          <div class="deal-deliverables-text">
            <strong>Scope & Deliverables:</strong> ${deal.deliverables}
            <div style="font-size:0.75rem; color:var(--text-dim); margin-top:0.35rem;">Deadline: ${deal.deadline} • Initiated: ${deal.createdAt}</div>
          </div>

          <!-- Stepper -->
          <div class="deal-timeline-stepper">
            ${timelineNodes}
          </div>

          <!-- Action bar -->
          <div class="deal-card-actions">
            <div>${statusBadge}</div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">${actionButtons}</div>
          </div>
        </div>
      `;
    }).join('');
  },

  handleUpdateDealStatus(dealId, status) {
    StorageManager.updateDealStatus(dealId, status);
    this.renderDeals();
    this.updateHeaderWalletPill();

    if (status === 'in_progress') {
      this.showToast('Deal accepted! Escrow funds locked and ready for delivery.', 'success');
    } else {
      this.showToast(`Deal updated to ${status}.`, 'info');
    }
  },

  handleApproveAndReleaseEscrow(dealId) {
    StorageManager.updateDealStatus(dealId, 'completed');
    this.renderDeals();
    this.renderWallet();
    this.updateHeaderWalletPill();
    this.showToast('🎉 Deliverables approved! Escrow payment released to creator.', 'success');
  },

  openDeliverableModal(dealId) {
    document.getElementById('deliverableDealId').value = dealId;
    this.openModal('deliverableModal');
  },

  // --------------------------------------------------------------------------
  // 5. Monetization & Wallet View
  // --------------------------------------------------------------------------
  renderWallet() {
    const summary = StorageManager.getWalletSummary(this.activeCreatorId);

    document.getElementById('kpiAvailableBalance').textContent = `$${summary.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    document.getElementById('kpiInEscrow').textContent = `$${summary.inEscrow.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    document.getElementById('kpiTotalEarned').textContent = `$${summary.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    document.getElementById('kpiCompletedDeals').textContent = summary.dealsCompletedCount;

    // Transactions Table
    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;

    const txs = StorageManager.getTransactions();
    tbody.innerHTML = txs.map(t => {
      const isCredit = t.direction === 'credit';
      const sign = isCredit ? '+' : '-';
      const typeBadge = isCredit ? '<span class="badge badge-emerald">Income</span>' : '<span class="badge badge-primary">Withdrawal</span>';

      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--text-main);">${t.title}</div>
            <div style="font-size: 0.75rem; color: var(--text-dim);">${t.type.replace('_', ' ').toUpperCase()}</div>
          </td>
          <td>${typeBadge}</td>
          <td>${t.date}</td>
          <td>
            <span class="tx-amount ${isCredit ? 'credit' : 'debit'}">
              ${sign}$${Number(t.amount).toFixed(2)}
            </span>
          </td>
          <td><span class="badge badge-cyan">${t.status}</span></td>
        </tr>
      `;
    }).join('');
  },

  // --------------------------------------------------------------------------
  // Modals & Form Submission Handling
  // --------------------------------------------------------------------------
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && typeof modal.close === 'function') {
      modal.close();
    }
  },

  bindModalCloseEvents() {
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.getAttribute('data-close-modal');
        this.closeModal(modalId);
      });
    });

    // Close when clicking on backdrop
    document.querySelectorAll('.modal-dialog').forEach(modal => {
      modal.addEventListener('click', (e) => {
        const rect = modal.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
          && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        if (!isInDialog) {
          modal.close();
        }
      });
    });
  },

  openHireModalForCreator(creatorId = '', prefillTitle = '', prefillDeliverables = '', prefillBudget = '') {
    const select = document.getElementById('hireCreatorSelect');
    const creators = StorageManager.getCreators();

    select.innerHTML = creators.map(c => `
      <option value="${c.id}" ${c.id === (creatorId || this.activeCreatorId) ? 'selected' : ''}>
        ${c.name} (${c.handle}) — Starting $${c.startingRate}
      </option>
    `).join('');

    if (prefillTitle) document.getElementById('hireCampaignTitle').value = prefillTitle;
    if (prefillDeliverables) document.getElementById('hireDeliverablesText').value = prefillDeliverables;
    if (prefillBudget) document.getElementById('hireBudgetAmount').value = prefillBudget;

    // Set default target date to 14 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);
    document.getElementById('hireTargetDeadline').value = targetDate.toISOString().split('T')[0];

    this.openModal('hireModal');
  },

  bindForms() {
    // 1. Hire Form
    const hireForm = document.getElementById('hireCreatorForm');
    if (hireForm) {
      hireForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const creatorId = document.getElementById('hireCreatorSelect').value;
        const creator = StorageManager.getCreatorById(creatorId);

        const dealData = {
          brandName: this.activeRole === 'brand' ? 'Apex Brands Group' : 'Direct Brand Partner',
          creatorId: creator.id,
          creatorName: creator.name,
          title: document.getElementById('hireCampaignTitle').value.trim(),
          deliverables: document.getElementById('hireDeliverablesText').value.trim(),
          budget: document.getElementById('hireBudgetAmount').value,
          deadline: document.getElementById('hireTargetDeadline').value
        };

        StorageManager.addDeal(dealData);
        hireForm.reset();
        this.closeModal('hireModal');
        this.renderDeals();
        this.updateHeaderWalletPill();
        this.showToast(`🚀 Proposal sent to ${creator.name}! Escrow secured.`, 'success');
      });
    }

    // 2. Tip Form
    const tipForm = document.getElementById('tipForm');
    if (tipForm) {
      // Tip chip selection
      document.querySelectorAll('.tip-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          document.querySelectorAll('.tip-chip').forEach(c => c.classList.remove('active'));
          e.currentTarget.classList.add('active');
          const amount = e.currentTarget.getAttribute('data-amount');
          document.getElementById('tipCustomAmount').value = amount;
        });
      });

      tipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const postId = document.getElementById('tipPostId').value;
        const amount = document.getElementById('tipCustomAmount').value;
        const note = document.getElementById('tipNoteText').value.trim();

        const sender = this.activeRole === 'creator' ? 'Elena Vance' : 'Apex Brands Supporter';
        StorageManager.tipPost(postId, amount, note, sender);

        this.closeModal('tipModal');
        tipForm.reset();
        this.renderFeed();
        this.renderWallet();
        this.updateHeaderWalletPill();
        this.showToast(`💖 Sent $${Number(amount).toFixed(2)} tip!`, 'success');
      });
    }

    // 3. Add Portfolio Item Form
    const portForm = document.getElementById('portfolioItemForm');
    if (portForm) {
      portForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const item = {
          title: document.getElementById('portTitle').value.trim(),
          client: document.getElementById('portClient').value.trim(),
          category: document.getElementById('portCategory').value,
          image: document.getElementById('portImage').value.trim() || 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
          description: document.getElementById('portDescription').value.trim(),
          metrics: {
            views: document.getElementById('portViews').value.trim() || '850K',
            ctr: document.getElementById('portCtr').value.trim() || '5.4%',
            roas: document.getElementById('portRoas').value.trim() || '4.1x'
          },
          tags: ['Commercial', 'HighImpact', 'CaseStudy']
        };

        StorageManager.addPortfolioItem(this.activeCreatorId, item);
        portForm.reset();
        this.closeModal('portfolioModal');
        this.renderStudio();
        this.showToast('✨ New case study added to your portfolio!', 'success');
      });
    }

    // 4. Add Service Form
    const srvForm = document.getElementById('serviceItemForm');
    if (srvForm) {
      srvForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const featuresText = document.getElementById('srvFeatures').value.trim();
        const features = featuresText.split('\n').map(f => f.trim()).filter(Boolean);

        const service = {
          title: document.getElementById('srvTitle').value.trim(),
          price: Number(document.getElementById('srvPrice').value),
          deliveryDays: Number(document.getElementById('srvDays').value),
          revisions: 2,
          description: document.getElementById('srvDesc').value.trim(),
          features: features.length > 0 ? features : ['Commercial license included', 'Raw B-roll', 'High resolution']
        };

        StorageManager.addService(this.activeCreatorId, service);
        srvForm.reset();
        this.closeModal('serviceModal');
        this.renderStudio();
        this.showToast('📦 New service package created and live on your profile!', 'success');
      });
    }

    // 5. Submit Deliverable Link Form
    const delivForm = document.getElementById('deliverableForm');
    if (delivForm) {
      delivForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const dealId = document.getElementById('deliverableDealId').value;
        const url = document.getElementById('deliverableUrlInput').value.trim();

        StorageManager.updateDealStatus(dealId, 'under_review', { deliverableUrl: url });
        delivForm.reset();
        this.closeModal('deliverableModal');
        this.renderDeals();
        this.showToast('🚀 Assets submitted for client review! Awaiting fund release.', 'success');
      });
    }

    // 6. Withdraw Payout Form
    const payoutForm = document.getElementById('payoutForm');
    if (payoutForm) {
      payoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = Number(document.getElementById('payoutAmountInput').value);
        const method = document.getElementById('payoutMethodSelect').value;

        const result = StorageManager.requestPayout(amount, { method });
        if (result.success) {
          payoutForm.reset();
          this.closeModal('payoutModal');
          this.renderWallet();
          this.updateHeaderWalletPill();
          this.showToast(`💸 Transfer of $${amount.toFixed(2)} to ${method} initiated!`, 'success');
        } else {
          this.showToast(result.message, 'error');
        }
      });
    }
  },

  // --------------------------------------------------------------------------
  // Floating Toast Notifications
  // --------------------------------------------------------------------------
  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = '✓';
    if (type === 'error') icon = '⚠';
    if (type === 'info') icon = 'ℹ';

    toast.innerHTML = `
      <div style="font-weight: 800; font-size: 1.1rem;">${icon}</div>
      <div style="font-size: 0.885rem; color: var(--text-main); font-weight: 500;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

window.App = App;
