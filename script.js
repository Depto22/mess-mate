// Get Started button functionality
document.addEventListener('DOMContentLoaded', () => {
  const getStartedBtn = document.getElementById('get-started-btn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      const dashboardSection = document.getElementById('dashboard');
      if (dashboardSection) {
        dashboardSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Initialize all modules
  initExpenseTracker();
  initMemberManagement();
  initTaskManagement();
  initDebtTracker();
  initNoticeBoard();
  initMealPlanner();
  initMealBudgetCalculator();
});

// Generic button handler for other buttons
document.querySelectorAll('button').forEach(btn => {
  if (!btn.closest('#debt-form') && !btn.closest('#notice') && !btn.hasAttribute('onclick') && 
      btn.id !== 'get-started-btn' && btn.id !== 'calculate-budget') {
    btn.addEventListener('click', () => {
      alert(`${btn.innerText} feature coming soon!`);
    });
  }
});

// Meal Budget Calculator
function initMealBudgetCalculator() {
  const calculateBtn = document.getElementById('calculate-budget');
  if (!calculateBtn) return;
  
  calculateBtn.addEventListener('click', () => {
    const monthlyBudget = parseFloat(document.getElementById('monthly-budget').value) || 3000;
    const daysCount = parseInt(document.getElementById('days-count').value) || 30;
    const mealsPerDay = parseInt(document.getElementById('meals-per-day').value) || 3;
    
    // Get already spent amount from expense tracker
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const alreadySpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate remaining budget
    const remainingBudget = Math.max(0, monthlyBudget - alreadySpent);
    
    // Calculate budgets
    const dailyBudget = remainingBudget / daysCount;
    const perMealBudget = dailyBudget / mealsPerDay;
    
    // Format for display
    const formattedMonthly = monthlyBudget.toLocaleString();
    const formattedSpent = alreadySpent.toLocaleString();
    const formattedRemaining = remainingBudget.toLocaleString();
    const formattedDaily = dailyBudget.toFixed(2);
    const formattedPerMeal = perMealBudget.toFixed(2);
    
    // Update display
    document.getElementById('display-monthly').textContent = `৳${formattedMonthly}`;
    document.getElementById('display-daily').textContent = `৳${formattedDaily}`;
    document.getElementById('display-per-meal').textContent = `৳${formattedPerMeal}`;
    
    // Add spent amount to the budget result
    let budgetResultHTML = document.getElementById('budget-result').innerHTML;
    
    // Check if spent amount is already displayed
    if (!budgetResultHTML.includes('Already Spent')) {
      // Insert after monthly budget
      const monthlyBudgetElement = document.querySelector('#budget-result p:first-of-type');
      const spentElement = document.createElement('p');
      spentElement.innerHTML = `Already Spent: <span id="display-spent">৳${formattedSpent}</span>`;
      const remainingElement = document.createElement('p');
      remainingElement.innerHTML = `Remaining Budget: <span id="display-remaining">৳${formattedRemaining}</span>`;
      
      if (monthlyBudgetElement) {
        monthlyBudgetElement.insertAdjacentElement('afterend', spentElement);
        spentElement.insertAdjacentElement('afterend', remainingElement);
      }
    } else {
      // Update existing elements
      document.getElementById('display-spent').textContent = `৳${formattedSpent}`;
      document.getElementById('display-remaining').textContent = `৳${formattedRemaining}`;
    }
    
    // Determine budget range and recommended plan
    let recommendedPlan = '';
    let budgetRange = '';
    
    if (perMealBudget < 41) {
      recommendedPlan = 'Below Basic Survival Plan - Consider increasing your budget';
      budgetRange = 'below ৳41';
    } else if (perMealBudget >= 41 && perMealBudget <= 50) {
      recommendedPlan = 'Basic Survival Plan';
      budgetRange = '৳41-50';
    } else if (perMealBudget > 50 && perMealBudget <= 60) {
      recommendedPlan = 'Balanced Low-Cost Plan';
      budgetRange = '৳51-60';
    } else if (perMealBudget > 60 && perMealBudget <= 70) {
      recommendedPlan = 'Standard Student Plan';
      budgetRange = '৳61-70';
    } else if (perMealBudget > 70 && perMealBudget <= 80) {
      recommendedPlan = 'Better Nutrition Plan';
      budgetRange = '৳71-80';
    } else if (perMealBudget > 80 && perMealBudget <= 90) {
      recommendedPlan = 'Comfort Student Plan';
      budgetRange = '৳81-90';
    } else {
      recommendedPlan = 'Premium Plan - You can afford better than our suggestions';
      budgetRange = 'above ৳90';
    }
    
    document.getElementById('display-budget-range').textContent = budgetRange;
    document.getElementById('recommended-plan').textContent = recommendedPlan;
    
    // Show the result section
    document.getElementById('budget-result').style.display = 'block';
    
    // Highlight the recommended meal plan
    highlightRecommendedPlan(recommendedPlan);
  });
}

function highlightRecommendedPlan(planName) {
  // Remove any existing highlights
  document.querySelectorAll('.meal-plan').forEach(plan => {
    plan.classList.remove('highlighted-plan');
  });
  
  // Find and highlight the matching plan
  document.querySelectorAll('.meal-plan h3').forEach(heading => {
    if (heading.textContent.includes(planName)) {
      heading.closest('.meal-plan').classList.add('highlighted-plan');
      // Scroll to the plan
      heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// Member Management Functionality
function initMemberManagement() {
  // Check if we're on the members page
  const memberContainer = document.querySelector('.member-container');
  if (!memberContainer) return;
  
  console.log('Member management initialized');
  
  // Initialize data storage if not exists
  if (!localStorage.getItem('members')) {
    localStorage.setItem('members', JSON.stringify([]));
  }
  
  // Add member form submission
  const memberForm = document.getElementById('member-form');
  if (memberForm) {
    memberForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('member-name').value;
      const email = document.getElementById('member-email').value;
      const phone = document.getElementById('member-phone').value;
      const notes = document.getElementById('member-notes').value;
      
      if (!name || !email) {
        alert('Please fill all required fields');
        return;
      }
      
      const member = {
        id: Date.now(),
        name,
        email,
        phone,
        notes,
        joinDate: new Date().toISOString().split('T')[0]
      };
      
      // Save member
      const members = JSON.parse(localStorage.getItem('members'));
      members.push(member);
      localStorage.setItem('members', JSON.stringify(members));
      
      // Update UI
      updateMembersList();
      
      // Reset form
      memberForm.reset();
    });
  }
  
  // Initialize UI
  updateMembersList();
}

// Update members list in the UI
function updateMembersList() {
  const membersContainer = document.getElementById('members-container');
  if (!membersContainer) return;
  
  const members = JSON.parse(localStorage.getItem('members'));
  membersContainer.innerHTML = '';
  
  if (members.length === 0) {
    membersContainer.innerHTML = '<p>No members added yet.</p>';
    return;
  }
  
  members.forEach(member => {
    const initials = member.name.split(' ').map(n => n[0]).join('');
    const memberItem = document.createElement('div');
    memberItem.className = 'member-item';
    memberItem.innerHTML = `
      <div class="member-info">
        <div class="member-avatar">${initials}</div>
        <div>
          <h3>${member.name}</h3>
          <p>${member.email}</p>
        </div>
      </div>
      <div class="member-actions">
        <button class="edit-btn" data-id="${member.id}">Edit</button>
        <button class="delete-btn" data-id="${member.id}">Delete</button>
      </div>
    `;
    membersContainer.appendChild(memberItem);
  });
  
  // Add delete functionality
  document.querySelectorAll('#members-container .delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      deleteMember(id);
    });
  });
}

// Delete a member
function deleteMember(id) {
  const members = JSON.parse(localStorage.getItem('members'));
  const updatedMembers = members.filter(member => member.id != id);
  localStorage.setItem('members', JSON.stringify(updatedMembers));
  
  updateMembersList();
}

// Task Management Functionality
function initTaskManagement() {
  // Check if we're on the tasks page
  const taskContainer = document.querySelector('.task-container');
  if (!taskContainer) return;
  
  console.log('Task management initialized');
  
  // Initialize data storage if not exists
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify([]));
  }
  
  // Add task form submission
  const taskForm = document.getElementById('task-form');
  if (taskForm) {
    taskForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('task-name').value;
      const assignedTo = document.getElementById('assigned-to').value;
      const dueDate = document.getElementById('due-date').value;
      const description = document.getElementById('task-description').value;
      
      if (!name || !assignedTo || !dueDate) {
        alert('Please fill all required fields');
        return;
      }
      
      const task = {
        id: Date.now(),
        name,
        assignedTo,
        dueDate,
        description,
        status: 'pending',
        createdDate: new Date().toISOString().split('T')[0]
      };
      
      // Save task
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      
      // Update UI
      updateTasksList();
      
      // Reset form
      taskForm.reset();
    });
  }
  
  // Populate the assigned-to dropdown with members
  populateAssignedToDropdown();
  
  // Initialize UI
  updateTasksList();
}

// Populate the assigned-to dropdown with members from localStorage
function populateAssignedToDropdown() {
  const assignedToSelect = document.getElementById('assigned-to');
  if (!assignedToSelect) return;
  
  // Clear existing options except the first one
  while (assignedToSelect.options.length > 1) {
    assignedToSelect.remove(1);
  }
  
  // Get members from localStorage
  const members = JSON.parse(localStorage.getItem('members') || '[]');
  
  // Add members to dropdown
   members.forEach(member => {
     const option = document.createElement('option');
     option.value = member.name;
     option.textContent = member.name;
     assignedToSelect.appendChild(option);
   });
}

// Update tasks list in the UI
function updateTasksList() {
  const tasksContainer = document.getElementById('tasks-container');
  if (!tasksContainer) return;
  
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  tasksContainer.innerHTML = '';
  
  if (tasks.length === 0) {
    tasksContainer.innerHTML = '<p>No tasks added yet.</p>';
    return;
  }
  
  tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
      <div>
        <h3>${task.name}</h3>
        <p>Assigned to: ${task.assignedTo}</p>
        <p>Due: ${task.dueDate}</p>
        ${task.description ? `<p>${task.description}</p>` : ''}
      </div>
      <div class="task-actions">
        <button class="complete-btn" data-id="${task.id}">${task.status === 'completed' ? 'Reopen' : 'Complete'}</button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;
    tasksContainer.appendChild(taskItem);
  });
  
  // Add complete and delete functionality
  document.querySelectorAll('#tasks-container .complete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      toggleTaskStatus(id);
    });
  });
  
  document.querySelectorAll('#tasks-container .delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      deleteTask(id);
    });
  });
}

// Toggle task status
function toggleTaskStatus(id) {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const taskIndex = tasks.findIndex(task => task.id == id);
  
  if (taskIndex !== -1) {
    tasks[taskIndex].status = tasks[taskIndex].status === 'completed' ? 'pending' : 'completed';
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTasksList();
  }
}

// Delete a task
function deleteTask(id) {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const updatedTasks = tasks.filter(task => task.id != id);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
  updateTasksList();
}

// Debt Tracker Functionality
function initDebtTracker() {
  // Check if we're on the index page with debt form
  const debtForm = document.getElementById('debt-form');
  if (!debtForm) return;
  
  console.log('Debt tracker initialized');
  
  // Initialize data storage if not exists
  if (!localStorage.getItem('debts')) {
    localStorage.setItem('debts', JSON.stringify([]));
  }
  
  // Add debt form submission
  debtForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = e.target.querySelector('input[type="text"]').value.trim();
    const amount = e.target.querySelector('input[type="number"]').value.trim();
    
    if (name && amount) {
      const debt = {
        id: Date.now(),
        name,
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0]
      };
      
      // Save debt
      const debts = JSON.parse(localStorage.getItem('debts'));
      debts.push(debt);
      localStorage.setItem('debts', JSON.stringify(debts));
      
      // Update UI
      updateDebtsList();
      
      // Reset form
      e.target.reset();
    }
  });
  
  // Initialize UI
  updateDebtsList();
}

// Notice Board Functionality
function initNoticeBoard() {
  const noticeSection = document.getElementById('notice');
  if (!noticeSection) return;
  
  console.log('Notice board initialized');
  
  // Initialize data storage if not exists
  if (!localStorage.getItem('notices')) {
    localStorage.setItem('notices', JSON.stringify([]));
  }
  
  // Get notice elements
  const noticeTextarea = noticeSection.querySelector('textarea');
  const postButton = noticeSection.querySelector('button');
  
  // Create notices container if it doesn't exist
  let noticesContainer = noticeSection.querySelector('.notices-container');
  if (!noticesContainer) {
    noticesContainer = document.createElement('div');
    noticesContainer.className = 'notices-container';
    noticeSection.appendChild(noticesContainer);
  }
  
  // Add post button functionality
  postButton.addEventListener('click', function() {
    const noticeText = noticeTextarea.value.trim();
    
    if (!noticeText) {
      alert('Please enter a notice before posting');
      return;
    }
    
    const notice = {
      id: Date.now(),
      text: noticeText,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString()
    };
    
    // Save notice
    const notices = JSON.parse(localStorage.getItem('notices'));
    notices.push(notice);
    localStorage.setItem('notices', JSON.stringify(notices));
    
    // Update UI
    updateNoticesDisplay();
    
    // Reset textarea
    noticeTextarea.value = '';
  });
  
  // Initialize UI
  updateNoticesDisplay();
}

// Update notices display
function updateNoticesDisplay() {
  const noticeSection = document.getElementById('notice');
  if (!noticeSection) return;
  
  const noticesContainer = noticeSection.querySelector('.notices-container');
  if (!noticesContainer) return;
  
  const notices = JSON.parse(localStorage.getItem('notices'));
  noticesContainer.innerHTML = '';
  
  if (notices.length === 0) {
    noticesContainer.innerHTML = '<p class="no-notices">No notices posted yet.</p>';
    return;
  }
  
  // Sort notices by date (newest first)
  notices.sort((a, b) => b.id - a.id);
  
  notices.forEach(notice => {
    const noticeItem = document.createElement('div');
    noticeItem.className = 'notice-item';
    noticeItem.innerHTML = `
      <div class="notice-content">
        <p>${notice.text}</p>
        <div class="notice-meta">
          <span class="notice-date">${notice.date} at ${notice.time}</span>
        </div>
      </div>
      <button class="delete-notice-btn" data-id="${notice.id}">
        <i class="fas fa-trash"></i>
      </button>
    `;
    noticesContainer.appendChild(noticeItem);
  });
  
  // Add delete functionality
  document.querySelectorAll('.delete-notice-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      deleteNotice(id);
    });
  });
}

// Delete a notice
function deleteNotice(id) {
  const notices = JSON.parse(localStorage.getItem('notices'));
  const updatedNotices = notices.filter(notice => notice.id != id);
  localStorage.setItem('notices', JSON.stringify(updatedNotices));
  
  updateNoticesDisplay();
}

// Update debts list in the UI
function updateDebtsList() {
  const debtTable = document.querySelector('#debt-table tbody');
  if (!debtTable) return;
  
  const debts = JSON.parse(localStorage.getItem('debts'));
  debtTable.innerHTML = '';
  
  debts.forEach(debt => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${debt.name}</td>
      <td>${debt.amount} BDT</td>
      <td>
        <button class="delete-btn" data-id="${debt.id}">Delete</button>
      </td>
    `;
    debtTable.appendChild(row);
  });
  
  // Add delete functionality
  document.querySelectorAll('#debt-table .delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      deleteDebt(id);
    });
  });
}

// Delete a debt
function deleteDebt(id) {
  const debts = JSON.parse(localStorage.getItem('debts'));
  const updatedDebts = debts.filter(debt => debt.id != id);
  localStorage.setItem('debts', JSON.stringify(updatedDebts));
  
  updateDebtsList();
}
// Expense Tracker Functionality
function initExpenseTracker() {
  // Check if we're on the expenses page
  const expenseContainer = document.querySelector('.expense-container');
  if (!expenseContainer) return;
  
  console.log('Expense tracker initialized');
  
  // Initialize data storage if not exists
  if (!localStorage.getItem('expenses')) {
    localStorage.setItem('expenses', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('mealCounts')) {
    localStorage.setItem('mealCounts', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('members')) {
    localStorage.setItem('members', JSON.stringify([]));
  }
  
  // Populate member select dropdown
  const memberSelect = document.getElementById('member-select');
  if (memberSelect) {
    // Clear existing options
    memberSelect.innerHTML = '<option value="">Select Member</option>';
    
    const members = JSON.parse(localStorage.getItem('members'));
    if (members.length === 0) {
      const option = document.createElement('option');
      option.value = "";
      option.textContent = "No members added yet";
      option.disabled = true;
      memberSelect.appendChild(option);
    } else {
      members.forEach(member => {
         const option = document.createElement('option');
         option.value = member.name;
         option.textContent = member.name;
         memberSelect.appendChild(option);
       });
    }
  }
  
  // Add expense form submission
  const expenseForm = document.getElementById('expense-form');
  if (expenseForm) {
    expenseForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const date = document.getElementById('expense-date').value;
      const amount = parseFloat(document.getElementById('expense-amount').value);
      const description = document.getElementById('expense-description').value;
      const category = document.getElementById('expense-category').value;
      
      if (!date || !amount || !description) {
        alert('Please fill all required fields');
        return;
      }
      
      const expense = {
        id: Date.now(),
        date,
        amount,
        description,
        category
      };
      
      // Save expense
      const expenses = JSON.parse(localStorage.getItem('expenses'));
      expenses.push(expense);
      localStorage.setItem('expenses', JSON.stringify(expenses));
      
      // Update UI
      updateExpenseList();
      updateExpenseSummary();
      updateMealPlannerSpentAmount(); // Update meal planner spent amount
      
      // Reset form
      expenseForm.reset();
    });
  }
  
  // Add meal count form submission
  const mealCountForm = document.getElementById('meal-count-form');
  if (mealCountForm) {
    mealCountForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const date = document.getElementById('meal-date').value;
      const memberName = document.getElementById('member-select').value;
      const breakfast = parseInt(document.getElementById('breakfast').value);
      const lunch = parseInt(document.getElementById('lunch').value);
      const dinner = parseInt(document.getElementById('dinner').value);
      
      if (!date || !memberName) {
        alert('Please select date and member');
        return;
      }
      
      const members = JSON.parse(localStorage.getItem('members'));
      const member = members.find(m => m.name === memberName);
      
      const mealCount = {
        id: Date.now(),
        date,
        memberId: member ? member.id : null,
        memberName: memberName,
        breakfast,
        lunch,
        dinner,
        total: breakfast + lunch + dinner
      };
      
      // Save meal count
      const mealCounts = JSON.parse(localStorage.getItem('mealCounts'));
      mealCounts.push(mealCount);
      localStorage.setItem('mealCounts', JSON.stringify(mealCounts));
      
      // Update UI
      updateMealCountList();
      updateExpenseSummary();
      updateMealPlannerSpentAmount(); // Update meal planner spent amount
      
      // Reset form
      mealCountForm.reset();
    });
  }
  
  // Calculate button functionality
  const calculateBtn = document.getElementById('calculate-btn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', function() {
      const startDate = document.getElementById('start-date').value;
      const endDate = document.getElementById('end-date').value;
      
      if (!startDate || !endDate) {
        alert('Please select start and end dates');
        return;
      }
      
      calculateMealRate(startDate, endDate);
    });
  }
  
  // Initialize UI
  updateExpenseList();
  updateMealCountList();
  updateExpenseSummary();
  updateMemberSummary();
}

// Update expense list in the UI
function updateExpenseList() {
  const expenseList = document.getElementById('expense-list');
  if (!expenseList) return;
  
  const expenses = JSON.parse(localStorage.getItem('expenses'));
  expenseList.innerHTML = '';
  
  expenses.forEach(expense => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatDate(expense.date)}</td>
      <td>${expense.description}</td>
      <td>${expense.category}</td>
      <td>${expense.amount} BDT</td>
      <td>
        <button class="delete-btn" data-id="${expense.id}">Delete</button>
      </td>
    `;
    expenseList.appendChild(row);
  });
  
  // Add delete functionality
  document.querySelectorAll('#expense-list .delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      deleteExpense(id);
    });
  });
}

// Update meal count list in the UI
function updateMealCountList() {
  const mealCountList = document.getElementById('meal-count-list');
  if (!mealCountList) return;
  
  const mealCounts = JSON.parse(localStorage.getItem('mealCounts'));
  mealCountList.innerHTML = '';
  
  mealCounts.forEach(mealCount => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatDate(mealCount.date)}</td>
      <td>${mealCount.memberName}</td>
      <td>${mealCount.breakfast}</td>
      <td>${mealCount.lunch}</td>
      <td>${mealCount.dinner}</td>
      <td>${mealCount.total}</td>
      <td>
        <button class="delete-btn" data-id="${mealCount.id}">Delete</button>
      </td>
    `;
    mealCountList.appendChild(row);
  });
  
  // Add delete functionality
  document.querySelectorAll('#meal-count-list .delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      deleteMealCount(id);
    });
  });
}

// Update expense summary in the UI
function updateExpenseSummary() {
  const totalExpensesEl = document.getElementById('total-expenses');
  const totalMealsEl = document.getElementById('total-meals');
  const mealRateEl = document.getElementById('meal-rate');
  
  if (!totalExpensesEl || !totalMealsEl || !mealRateEl) return;
  
  const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
  const mealCounts = JSON.parse(localStorage.getItem('mealCounts') || '[]');
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalMeals = mealCounts.reduce((sum, mealCount) => sum + mealCount.total, 0);
  
  let mealRate = 0;
  if (totalMeals > 0) {
    mealRate = totalExpenses / totalMeals;
  }
  
  totalExpensesEl.textContent = `${totalExpenses.toFixed(2)} BDT`;
  totalMealsEl.textContent = totalMeals;
  mealRateEl.textContent = `${mealRate.toFixed(2)} BDT`;
  
  // Budget meter update
  const budgetProgress = document.getElementById('budget-progress');
  if (budgetProgress) {
    const budget = 1000;
    const spent = totalExpenses;
    const percentage = (spent / budget) * 100;
    budgetProgress.style.width = `${percentage}%`;
    
    // Change color based on percentage
    if (percentage < 50) {
      budgetProgress.style.backgroundColor = '#4caf50';
    } else if (percentage < 80) {
      budgetProgress.style.backgroundColor = '#ff9800';
    } else {
      budgetProgress.style.backgroundColor = '#f44336';
    }
  }
}

// Calculate meal rate for a specific date range
function calculateMealRate(startDate, endDate) {
  const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
  const mealCounts = JSON.parse(localStorage.getItem('mealCounts') || '[]');
  
  // Filter expenses and meal counts within the date range
  const filteredExpenses = expenses.filter(expense => {
    return expense.date >= startDate && expense.date <= endDate;
  });
  
  const filteredMealCounts = mealCounts.filter(mealCount => {
    return mealCount.date >= startDate && mealCount.date <= endDate;
  });
  
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalMeals = filteredMealCounts.reduce((sum, mealCount) => sum + mealCount.total, 0);
  
  let mealRate = 0;
  if (totalMeals > 0) {
    mealRate = totalExpenses / totalMeals;
  }
  
  // Update calculation results
  document.getElementById('calc-total-expenses').textContent = `${totalExpenses.toFixed(2)} BDT`;
  document.getElementById('calc-total-meals').textContent = totalMeals;
  document.getElementById('calc-meal-rate').textContent = `${mealRate.toFixed(2)} BDT`;
  
  // Update member summary for this date range
  updateMemberSummary(startDate, endDate);
  
  // Update meal planner spent amount
  updateMealPlannerSpentAmount();
}

// Update member-wise summary
function updateMemberSummary(startDate = null, endDate = null) {
  const memberSummaryList = document.getElementById('member-summary-list');
  if (!memberSummaryList) return;
  
  const members = JSON.parse(localStorage.getItem('members'));
  const mealCounts = JSON.parse(localStorage.getItem('mealCounts'));
  const expenses = JSON.parse(localStorage.getItem('expenses'));
  
  // Filter by date range if provided
  let filteredMealCounts = mealCounts;
  let filteredExpenses = expenses;
  
  if (startDate && endDate) {
    filteredMealCounts = mealCounts.filter(mealCount => {
      return mealCount.date >= startDate && mealCount.date <= endDate;
    });
    
    filteredExpenses = expenses.filter(expense => {
      return expense.date >= startDate && expense.date <= endDate;
    });
  }
  
  // Calculate total expenses and meals
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalMeals = filteredMealCounts.reduce((sum, mealCount) => sum + mealCount.total, 0);
  
  // Calculate meal rate
  let mealRate = 0;
  if (totalMeals > 0) {
    mealRate = totalExpenses / totalMeals;
  }
  
  // Clear previous summary
  memberSummaryList.innerHTML = '';
  
  // Generate summary for each member
  members.forEach(member => {
    const memberMealCounts = filteredMealCounts.filter(mealCount => mealCount.memberId == member.id);
    const memberTotalMeals = memberMealCounts.reduce((sum, mealCount) => sum + mealCount.total, 0);
    const memberTotalCost = memberTotalMeals * mealRate;
    
    // For simplicity, assume no payments yet
    const paid = 0;
    const balance = memberTotalCost - paid;
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${member.name}</td>
      <td>${memberTotalMeals}</td>
      <td>${memberTotalCost.toFixed(2)} BDT</td>
      <td>${paid.toFixed(2)} BDT</td>
      <td>${balance.toFixed(2)} BDT</td>
    `;
    memberSummaryList.appendChild(row);
  });
}

// Delete an expense
function deleteExpense(id) {
  const expenses = JSON.parse(localStorage.getItem('expenses'));
  const updatedExpenses = expenses.filter(expense => expense.id != id);
  localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  
  updateExpenseList();
  updateExpenseSummary();
  updateMemberSummary();
  updateMealPlannerSpentAmount(); // Update meal planner spent amount
}

// Delete a meal count
function deleteMealCount(id) {
  const mealCounts = JSON.parse(localStorage.getItem('mealCounts'));
  const updatedMealCounts = mealCounts.filter(mealCount => mealCount.id != id);
  localStorage.setItem('mealCounts', JSON.stringify(updatedMealCounts));
  
  updateMealCountList();
  updateExpenseSummary();
  updateMemberSummary();
  updateMealPlannerSpentAmount(); // Update meal planner spent amount
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Meal Planner Functionality
function initMealPlanner() {
  // Check if we're on the meals page
  const mealContainer = document.querySelector('.meal-container');
  if (!mealContainer) return;
  
  console.log('Meal planner initialized');
  
  // Create meal plan section if it doesn't exist
  createMealPlanSection();
  
  // Update spent amount from expense tracker
  updateMealPlannerSpentAmount();
  
  // Set budget button functionality
  const setBudgetBtn = document.getElementById('set-budget-btn');
  if (setBudgetBtn) {
    setBudgetBtn.addEventListener('click', function() {
      const budgetInput = document.getElementById('budget-input');
      const budgetAmount = document.getElementById('budget-amount');
      
      if (budgetInput && budgetAmount) {
        const budget = parseFloat(budgetInput.value);
        if (!isNaN(budget) && budget > 0) {
          budgetAmount.textContent = `${budget.toFixed(2)} BDT`;
          localStorage.setItem('mealBudget', budget);
          updateBudgetMeter();
          calculatePerMealBudget();
        } else {
          alert('Please enter a valid budget amount');
        }
      }
    });
  }
}

// Create meal plan section
function createMealPlanSection() {
  const mealContainer = document.querySelector('.meal-container');
  if (!mealContainer) return;
  
  // Check if meal plan section already exists
  if (document.getElementById('meal-plan-section')) return;
  
  // Create meal plan section
  const mealPlanSection = document.createElement('div');
  mealPlanSection.id = 'meal-plan-section';
  mealPlanSection.className = 'meal-plan-section';
  mealPlanSection.innerHTML = `
    <h2>Meal Plan Based on Your Budget</h2>
    <div class="meal-budget-info">
      <p>Per Meal Budget: <strong id="per-meal-budget">0 BDT</strong></p>
      <p>Days Remaining: <strong id="days-remaining">0</strong></p>
    </div>
    <div id="meal-plan-content" class="meal-plan-content">
      <p>Set your budget to see meal plan suggestions.</p>
    </div>
  `;
  
  // Insert after budget section
  const budgetSection = document.querySelector('.budget-section');
  if (budgetSection) {
    budgetSection.after(mealPlanSection);
  } else {
    mealContainer.appendChild(mealPlanSection);
  }
}

// Update spent amount in meal planner from expense tracker
function updateMealPlannerSpentAmount() {
  const spentAmount = document.getElementById('spent-amount');
  if (!spentAmount) return;
  
  // Get total expenses from localStorage
  const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Update spent amount
  spentAmount.textContent = `${totalExpenses.toFixed(2)} BDT`;
  
  // Calculate per meal budget and update meal plan
  calculatePerMealBudget();
  
  // Update budget meter
  updateBudgetMeter();
}

// Calculate per meal budget and display appropriate meal plan
function calculatePerMealBudget() {
  // Get budget and spent amount
  const budgetAmount = document.getElementById('budget-amount');
  const spentAmount = document.getElementById('spent-amount');
  const perMealBudgetEl = document.getElementById('per-meal-budget');
  const daysRemainingEl = document.getElementById('days-remaining');
  const mealPlanContent = document.getElementById('meal-plan-content');
  
  if (!budgetAmount || !spentAmount || !perMealBudgetEl || !daysRemainingEl || !mealPlanContent) return;
  
  // Parse budget and spent amount
  const budget = parseFloat(budgetAmount.textContent);
  const spent = parseFloat(spentAmount.textContent);
  
  // Get members count
  const members = JSON.parse(localStorage.getItem('members') || '[]');
  const membersCount = members.length > 0 ? members.length : 1; // Default to 1 if no members
  
  // Calculate days remaining in the month
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysRemaining = lastDayOfMonth - today.getDate() + 1; // +1 to include today
  
  // Update days remaining
  daysRemainingEl.textContent = daysRemaining;
  
  // Calculate per meal budget: (total budget - spent money) / (days remaining * members * 3 meals)
  const remainingBudget = budget - spent;
  const totalMealsRemaining = daysRemaining * membersCount * 3; // 3 meals per day
  let perMealBudget = 0;
  
  if (totalMealsRemaining > 0 && remainingBudget > 0) {
    perMealBudget = remainingBudget / totalMealsRemaining;
  }
  
  // Update per meal budget display
  perMealBudgetEl.textContent = `${perMealBudget.toFixed(2)} BDT`;
  
  // Display appropriate meal plan based on per meal budget
  let mealPlanHTML = '';
  
  if (perMealBudget <= 0) {
    mealPlanHTML = `
      <div class="meal-plan-warning">
        <h3>Budget Exceeded!</h3>
        <p>You have spent more than your budget. Consider adjusting your budget or reducing expenses.</p>
      </div>
    `;
  } else if (perMealBudget <= 40) {
    mealPlanHTML = `
      <div class="meal-plan-category">
        <h3>Emergency Budget Plan (Below 40 Tk)</h3>
        <p>Your budget is extremely tight. Consider adding more funds or reducing meal counts.</p>
        <p>Suggested meals: Simple dal, rice, and eggs.</p>
      </div>
    `;
  } else if (perMealBudget <= 50) {
    mealPlanHTML = `
      <div class="meal-plan-category">
        <h3>🔹 Budget: 41–50 Tk (Basic Survival Plan)</h3>
        <p>👉 Cheap, filling, but still nutritious.</p>
        <ul>
          <li><strong>Breakfast:</strong> 2 parathas/3 rotis + fried egg or potato curry + tea</li>
          <li><strong>Lunch:</strong> Rice + dal + vegetable curry + fried egg / small fish (pangasius/tilapia)</li>
          <li><strong>Dinner:</strong> Khichuri + fried egg / vegetable bhuna</li>
        </ul>
      </div>
    `;
  } else if (perMealBudget <= 60) {
    mealPlanHTML = `
      <div class="meal-plan-category">
        <h3>🔹 Budget: 51–60 Tk (Balanced Low-Cost Plan)</h3>
        <p>👉 Slightly more protein, better variety.</p>
        <ul>
          <li><strong>Breakfast:</strong> 2 parathas + egg curry + tea</li>
          <li><strong>Lunch:</strong> Rice + dal + leafy vegetables + small fish fry / egg curry</li>
          <li><strong>Dinner:</strong> Rice + chicken curry (1 small piece) + vegetable</li>
        </ul>
      </div>
    `;
  } else if (perMealBudget <= 70) {
    mealPlanHTML = `
      <div class="meal-plan-category">
        <h3>🔹 Budget: 61–70 Tk (Standard Student Plan)</h3>
        <p>👉 Good mix of chicken, fish, egg, vegetables.</p>
        <ul>
          <li><strong>Breakfast:</strong> 3 chapatis + fried egg + vegetable curry + tea</li>
          <li><strong>Lunch:</strong> Rice + dal + small fish curry + vegetable fry</li>
          <li><strong>Dinner:</strong> Rice + chicken curry (1 medium piece) + leafy vegetables</li>
        </ul>
      </div>
    `;
  } else if (perMealBudget <= 80) {
    mealPlanHTML = `
      <div class="meal-plan-category">
        <h3>🔹 Budget: 71–80 Tk (Better Nutrition Plan)</h3>
        <p>👉 Can add beef/mutton sometimes, more variety.</p>
        <ul>
          <li><strong>Breakfast:</strong> Paratha + egg curry + milk tea + small fruit (banana/guava)</li>
          <li><strong>Lunch:</strong> Rice + dal + vegetable fry + chicken curry (1–2 pieces) / fish curry</li>
          <li><strong>Dinner:</strong> Khichuri with chicken + salad (cucumber, onion, tomato)</li>
        </ul>
      </div>
    `;
  } else if (perMealBudget <= 90) {
    mealPlanHTML = `
      <div class="meal-plan-category">
        <h3>🔹 Budget: 81–90 Tk (Comfort Student Plan)</h3>
        <p>👉 Nutritious, tasty, close to "home-style" meals.</p>
        <ul>
          <li><strong>Breakfast:</strong> 2 parathas + egg curry + vegetables + milk/tea</li>
          <li><strong>Lunch:</strong> Rice + dal + vegetable curry + beef/mutton/chicken (medium piece) + salad</li>
          <li><strong>Dinner:</strong> Rice/khichuri + fish curry or chicken roast + salad + small fruit</li>
        </ul>
      </div>
    `;
  } else {
    mealPlanHTML = `
      <div class="meal-plan-category">
        <h3>🔹 Budget: 90+ Tk (Premium Plan)</h3>
        <p>👉 Excellent variety and nutrition with premium ingredients.</p>
        <ul>
          <li><strong>Breakfast:</strong> Paratha/roti + omelette + vegetables + fruit + milk/coffee</li>
          <li><strong>Lunch:</strong> Rice + dal + premium fish/meat + multiple vegetable dishes + salad</li>
          <li><strong>Dinner:</strong> Rice/special rice (pulao/biryani) + premium meat + vegetables + dessert</li>
        </ul>
      </div>
    `;
  }
  
  // Update meal plan content
  mealPlanContent.innerHTML = mealPlanHTML;
  
  // Update budget meter
  updateBudgetMeter();
}

// Update budget meter based on spent amount and budget
function updateBudgetMeter() {
  const budgetProgress = document.getElementById('budget-progress');
  const spentAmount = document.getElementById('spent-amount');
  const budgetAmount = document.getElementById('budget-amount');
  
  if (!budgetProgress || !spentAmount || !budgetAmount) return;
  
  const spent = parseFloat(spentAmount.textContent);
  const budgetText = budgetAmount.textContent;
  const budget = parseFloat(budgetText.replace(' BDT', ''));
  
  if (isNaN(spent) || isNaN(budget) || budget <= 0) return;
  
  const percentage = (spent / budget) * 100;
  
  // Update budget meter width
  budgetProgress.style.width = `${Math.min(percentage, 100)}%`;
  
  // Change color based on percentage
  if (percentage < 50) {
    budgetProgress.style.backgroundColor = '#4caf50'; // Green
  } else if (percentage < 80) {
    budgetProgress.style.backgroundColor = '#ff9800'; // Orange
  } else {
    budgetProgress.style.backgroundColor = '#f44336'; // Red
  }
}
