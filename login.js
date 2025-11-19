// login.js
// Handles signup/login and mess create/join flow

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const showSignupBtn = document.getElementById('show-signup');
  const showLoginBtn = document.getElementById('show-login');
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const signupError = document.getElementById('signup-error');
  const loginError = document.getElementById('login-error');

  const postAuthSection = document.getElementById('post-auth-section');
  const chooseCreateBtn = document.getElementById('choose-create');
  const chooseJoinBtn = document.getElementById('choose-join');
  const proceedDashboardBtn = document.getElementById('proceed-dashboard');

  const createMessForm = document.getElementById('create-mess-form');
  const joinMessForm = document.getElementById('join-mess-form');
  const createMessError = document.getElementById('create-mess-error');
  const joinMessError = document.getElementById('join-mess-error');

  // Storage helpers
  const getUsers = () => { try { return JSON.parse(localStorage.getItem('users') || '[]'); } catch { return []; } };
  const setUsers = (users) => localStorage.setItem('users', JSON.stringify(users));
  const getMesses = () => { try { return JSON.parse(localStorage.getItem('messes') || '{}'); } catch { return {}; } };
  const setMesses = (m) => localStorage.setItem('messes', JSON.stringify(m));
  const storageKey = (base, messId) => messId ? `${base}:${messId}` : base;

  function addSelfToMembers(messId) {
    try {
      const cu = JSON.parse(localStorage.getItem('currentUser'));
      if (!cu) return;
      const key = storageKey('members', messId);
      const members = JSON.parse(localStorage.getItem(key) || '[]');
      if (!members.some(m => m.email === cu.email)) {
        members.push({ id: Date.now(), name: cu.name, email: cu.email, joinDate: new Date().toISOString().split('T')[0] });
        localStorage.setItem(key, JSON.stringify(members));
      }
    } catch {}
  }

  function show(el) { if (el) el.style.display = ''; }
  function hide(el) { if (el) el.style.display = 'none'; }

  function resetErrors() {
    if (signupError) signupError.textContent = '';
    if (loginError) loginError.textContent = '';
    if (createMessError) createMessError.textContent = '';
    if (joinMessError) joinMessError.textContent = '';
  }

  // Initial state
  const currentUser = (() => { try { return JSON.parse(localStorage.getItem('currentUser')); } catch { return null; } })();
  const currentMess = (() => { try { return JSON.parse(localStorage.getItem('currentMess')); } catch { return null; } })();

  if (currentUser && currentMess) {
    // Already in a mess, go to dashboard
    window.location.href = 'index.html';
    return;
  }

  if (currentUser && !currentMess) {
    // Logged in but no mess selected -> show post-auth options
    const authSection = document.getElementById('auth-section');
    hide(authSection);
    show(postAuthSection);
    hide(createMessForm);
    hide(joinMessForm);
    show(chooseCreateBtn);
    show(chooseJoinBtn);
    hide(proceedDashboardBtn);
  } else {
    // No user yet -> show auth forms, default to login view
    const authSection = document.getElementById('auth-section');
    show(authSection);
    hide(postAuthSection);
    showLogin();
  }

  // Toggle helpers
  function showSignup() {
    resetErrors();
    show(signupForm);
    hide(loginForm);
  }
  function showLogin() {
    resetErrors();
    hide(signupForm);
    show(loginForm);
  }

  if (showSignupBtn) showSignupBtn.addEventListener('click', showSignup);
  if (showLoginBtn) showLoginBtn.addEventListener('click', showLogin);

  // Signup
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      resetErrors();
      const name = document.getElementById('signup-name').value.trim();
      const id = document.getElementById('signup-id').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;

      if (!name || !id || !email || !password || password.length < 6) {
        if (signupError) signupError.textContent = 'Please fill all fields. Password must be at least 6 characters.';
        return;
      }
      const users = getUsers();
      if (users.some(u => u.id === id)) {
        if (signupError) signupError.textContent = 'This Unique ID is already taken.';
        return;
      }
      if (users.some(u => u.email === email)) {
        if (signupError) signupError.textContent = 'This email is already registered.';
        return;
      }
      users.push({ id, name, email, password });
      setUsers(users);
      localStorage.setItem('currentUser', JSON.stringify({ id, name, email }));

      // Show mess selection
      const authSection = document.getElementById('auth-section');
      hide(authSection);
      show(postAuthSection);
      hide(createMessForm);
      hide(joinMessForm);
      show(chooseCreateBtn);
      show(chooseJoinBtn);
      hide(proceedDashboardBtn);
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      resetErrors();
      const loginIdOrEmail = document.getElementById('login-id').value.trim();
      const password = document.getElementById('login-password').value;
      const users = getUsers();
      const user = users.find(u => u.id === loginIdOrEmail || u.email === loginIdOrEmail);
      if (!user || user.password !== password) {
        if (loginError) loginError.textContent = 'Invalid credentials.';
        return;
      }
      localStorage.setItem('currentUser', JSON.stringify({ id: user.id, name: user.name, email: user.email }));

      const cm = (() => { try { return JSON.parse(localStorage.getItem('currentMess')); } catch { return null; } })();
      if (cm && cm.messId) {
        window.location.href = 'index.html';
        return;
      }

      // NEW: Detect if user already belongs to a mess via members:<messId>
      try {
        const cu2 = (() => { try { return JSON.parse(localStorage.getItem('currentUser')); } catch { return null; } })();
        let foundMessId = null;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('members:')) {
            const messIdCandidate = key.split(':')[1];
            const members = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } })();
            if (cu2 && members.some(m => m.email === cu2.email)) {
              foundMessId = messIdCandidate;
              break;
            }
          }
        }
        if (foundMessId) {
          const messesObj = getMesses();
          const role = messesObj[foundMessId] && messesObj[foundMessId].createdBy === (cu2 ? cu2.id : null) ? 'manager' : 'member';
          localStorage.setItem('currentMess', JSON.stringify({ messId: foundMessId, role }));
          window.location.href = 'index.html';
          return;
        }
      } catch {}

      // No mess yet -> show post-auth options
      const authSection = document.getElementById('auth-section');
      hide(authSection);
      show(postAuthSection);
      hide(createMessForm);
      hide(joinMessForm);
      show(chooseCreateBtn);
      show(chooseJoinBtn);
      hide(proceedDashboardBtn);
    });
  }

  // Choose create/join
  if (chooseCreateBtn) chooseCreateBtn.addEventListener('click', () => {
    resetErrors();
    show(createMessForm);
    hide(joinMessForm);
  });
  if (chooseJoinBtn) chooseJoinBtn.addEventListener('click', () => {
    resetErrors();
    show(joinMessForm);
    hide(createMessForm);
  });

  // Create mess (manager)
  if (createMessForm) {
    createMessForm.addEventListener('submit', (e) => {
      e.preventDefault();
      resetErrors();
      const messId = document.getElementById('create-mess-id').value.trim();
      const messPassword = document.getElementById('create-mess-password').value;
      if (!messId || !messPassword) {
        if (createMessError) createMessError.textContent = 'Please provide Mess ID and password.';
        return;
      }
      const messes = getMesses();
      if (messes[messId]) {
        if (createMessError) createMessError.textContent = 'Mess ID already exists.';
        return;
      }
      // Create mess
      const cu = (() => { try { return JSON.parse(localStorage.getItem('currentUser')); } catch { return null; } })();
      messes[messId] = { password: messPassword, createdBy: cu ? cu.id : null, createdAt: Date.now() };
      setMesses(messes);
      localStorage.setItem('currentMess', JSON.stringify({ messId, role: 'manager' }));
      addSelfToMembers(messId);
      window.location.href = 'index.html';
    });
  }

  // Join mess (member)
  if (joinMessForm) {
    joinMessForm.addEventListener('submit', (e) => {
      e.preventDefault();
      resetErrors();
      const messId = document.getElementById('join-mess-id').value.trim();
      const messPassword = document.getElementById('join-mess-password').value;
      const messes = getMesses();
      const mess = messes[messId];
      if (!mess) {
        if (joinMessError) joinMessError.textContent = 'Mess not found.';
        return;
      }
      if (mess.password !== messPassword) {
        if (joinMessError) joinMessError.textContent = 'Incorrect mess password.';
        return;
      }
      // Join mess as member: set role to 'member', add current user to mess-scoped members, then redirect
      localStorage.setItem('currentMess', JSON.stringify({ messId, role: 'member' }));
      const cuJoin = JSON.parse(localStorage.getItem('currentUser'));
      const membersKey = `members:${messId}`;
      const members = JSON.parse(localStorage.getItem(membersKey) || '[]');
      if (cuJoin && !members.some(m => m.email === cuJoin.email)) {
        members.push({ id: Date.now(), name: cuJoin.name, email: cuJoin.email, joinDate: new Date().toISOString().split('T')[0] });
        localStorage.setItem(membersKey, JSON.stringify(members));
      }
      window.location.href = 'index.html';
    });
  }

  if (proceedDashboardBtn) {
    proceedDashboardBtn.addEventListener('click', () => {
      const cm = (() => { try { return JSON.parse(localStorage.getItem('currentMess')); } catch { return null; } })();
      if (cm && cm.messId) {
        window.location.href = 'index.html';
      }
    });
  }
  // Clear Local Data on login page navbar
  const clearLink = document.getElementById('clear-local-data');
  if (clearLink) {
    clearLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('This will delete all mess info stored locally on this device. Continue?')) {
        try {
          const keysToRemove = [
            'users',
            'messes',
            'currentUser',
            'currentMess',
            'tasks',
            'debts',
            'notices',
            'expenses',
            'mealCounts',
            'mealBudget',
            'reviews'
          ];
          const prefixRemovals = ['members:'];
          const allKeys = [];
          for (let i = 0; i < localStorage.length; i++) {
            allKeys.push(localStorage.key(i));
          }
          allKeys.forEach((key) => {
            if (keysToRemove.includes(key) || prefixRemovals.some(p => key.startsWith(p))) {
              localStorage.removeItem(key);
            }
          });
          alert('All local mess data has been cleared.');
        } catch (err) {
          console.error('Failed clearing local data', err);
        } finally {
          window.location.href = 'login.html';
        }
      }
    });
  }
});

// Client-side auth, mess creation/join, and gating logic using localStorage.

document.addEventListener('DOMContentLoaded', () => {
  const showSignupBtn = document.getElementById('show-signup');
  const showLoginBtn = document.getElementById('show-login');
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const postAuthSection = document.getElementById('post-auth-section');
  const chooseCreateBtn = document.getElementById('choose-create');
  const chooseJoinBtn = document.getElementById('choose-join');
  const proceedDashboardBtn = document.getElementById('proceed-dashboard');
  const createMessForm = document.getElementById('create-mess-form');
  const joinMessForm = document.getElementById('join-mess-form');

  // If already in a mess, redirect to dashboard
  try {
    const cm = JSON.parse(localStorage.getItem('currentMess'));
    if (cm && cm.messId) {
      window.location.href = 'index.html';
      return;
    }
  } catch {}

  // Toggle forms
  showSignupBtn.addEventListener('click', () => {
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
  });
  showLoginBtn.addEventListener('click', () => {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
  });

  // Signup
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const uid = document.getElementById('signup-id').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    const errorEl = document.getElementById('signup-error');
    errorEl.textContent = '';

    if (!name || !uid || !email || !password) {
      errorEl.textContent = 'All fields are required.';
      return;
    }
    if (!/^[^@\s]+@gmail\.com$/.test(email)) {
      errorEl.textContent = 'Please provide a valid Gmail address.';
      return;
    }
    if (password.length < 6) {
      errorEl.textContent = 'Password must be at least 6 characters.';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.uid === uid)) {
      errorEl.textContent = 'Unique ID is already taken.';
      return;
    }
    if (users.some(u => u.email === email)) {
      errorEl.textContent = 'Email is already registered.';
      return;
    }

    users.push({ uid, email, name, password });
    localStorage.setItem('users', JSON.stringify(users));

    localStorage.setItem('currentUser', JSON.stringify({ uid, email, name }));
    postAuthSection.style.display = 'block';
  });

  // Login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const idOrEmail = document.getElementById('login-id').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = '';

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => (u.uid === idOrEmail || u.email === idOrEmail) && u.password === password);
    if (!user) {
      errorEl.textContent = 'Invalid credentials.';
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify({ uid: user.uid, email: user.email, name: user.name }));

    // NEW: If the user already belongs to a mess, set it and redirect immediately
    const messes = JSON.parse(localStorage.getItem('messes') || '[]');
    const existingMess = messes.find(m => m.managerUid === user.uid || (Array.isArray(m.members) && m.members.includes(user.uid)));
    if (existingMess) {
      const role = existingMess.managerUid === user.uid ? 'manager' : 'member';
      localStorage.setItem('currentMess', JSON.stringify({ messId: existingMess.messId, role }));
      window.location.href = 'index.html';
      return;
    }

    // Otherwise, show create/join options
    postAuthSection.style.display = 'block';
  });

  // Choose create/join actions
  chooseCreateBtn.addEventListener('click', () => {
    createMessForm.style.display = 'block';
    joinMessForm.style.display = 'none';
    proceedDashboardBtn.style.display = 'none';
  });
  chooseJoinBtn.addEventListener('click', () => {
    createMessForm.style.display = 'none';
    joinMessForm.style.display = 'block';
    proceedDashboardBtn.style.display = 'none';
  });

  // Create mess
  createMessForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const messId = document.getElementById('create-mess-id').value.trim();
    const messPass = document.getElementById('create-mess-password').value;
    const errorEl = document.getElementById('create-mess-error');
    errorEl.textContent = '';

    if (!messId || !messPass) {
      errorEl.textContent = 'Mess ID and password are required.';
      return;
    }

    const messes = JSON.parse(localStorage.getItem('messes') || '[]');
    if (messes.some(m => m.messId === messId)) {
      errorEl.textContent = 'Mess ID already exists.';
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    messes.push({ messId, messPass, managerUid: currentUser.uid, members: [currentUser.uid] });
    localStorage.setItem('messes', JSON.stringify(messes));

    // Assign user as manager of this mess
    localStorage.setItem('currentMess', JSON.stringify({ messId, role: 'manager' }));
    proceedDashboardBtn.style.display = 'inline-block';
  });

  // Join mess
  joinMessForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const messId = document.getElementById('join-mess-id').value.trim();
    const messPass = document.getElementById('join-mess-password').value;
    const errorEl = document.getElementById('join-mess-error');
    errorEl.textContent = '';

    const messes = JSON.parse(localStorage.getItem('messes') || '[]');
    const mess = messes.find(m => m.messId === messId && m.messPass === messPass);
    if (!mess) {
      errorEl.textContent = 'Invalid mess credentials.';
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!mess.members.includes(currentUser.uid)) {
      mess.members.push(currentUser.uid);
      localStorage.setItem('messes', JSON.stringify(messes));
    }

    localStorage.setItem('currentMess', JSON.stringify({ messId, role: 'member' }));
    proceedDashboardBtn.style.display = 'inline-block';
  });

  // Proceed to dashboard
  proceedDashboardBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});