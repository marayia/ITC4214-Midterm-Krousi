// inputed tasks will be stored in this array
let tasks = [];

// runs when Add Task button is clicked in the form tasks.html
document.getElementById('addTaskBtn').addEventListener('click', function() {

    // grab all the form values and trim whitespace
    let name = document.getElementById('taskName').value.trim();
    let desc = document.getElementById('taskDesc').value.trim();
    let date = document.getElementById('taskDate').value;
    let priority = document.getElementById('taskPriority').value;

    // validation: name and priority are required fields, date input is optional but validated
    if (name === '') {
        alert('Please enter a task name!');
        return;
    }
    if (priority === '') {
        alert('Please select a priority!');
        return;
    }

    // new task object with a unique id, status defaults to 'Pending'
    let newTask = {
        id: Date.now(), // id based on date for simplicity
        name: name,
        desc: desc,
        date: date,
        priority: priority,
        status: 'Pending'
    };
    tasks.push(newTask);

    // clear the form inputs after adding the task
    document.getElementById('taskName').value = '';
    document.getElementById('taskDesc').value = '';
    document.getElementById('taskDate').value = '';
    document.getElementById('taskPriority').value = '';

    // show the new task in the table
    renderTasks();
});

// mark a task as completed or pending by toggling its status
function completeTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            if (tasks[i].status === 'Pending') {
                tasks[i].status = 'Completed';
            } else {
                tasks[i].status = 'Pending';
            }
        }
    }
    // re-render the table to show the updated status
    renderTasks();
}

// removes a task from the array and updates the display
function deleteTask(id) {
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });
    renderTasks();
}

// Fills the form with the task data so the user can edit it
function editTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            document.getElementById('taskName').value = tasks[i].name;
            document.getElementById('taskDesc').value = tasks[i].desc;
            document.getElementById('taskDate').value = tasks[i].date;
            document.getElementById('taskPriority').value = tasks[i].priority;

            // Delete the old task so when the user clicks Add it creates a fresh one
            deleteTask(id);

            // Scroll back up to the form
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
    }
}

// renders the tasks in the table based on current filters and sorting
function renderTasks() {
    // Get current filter and sort values from the dropdowns
    let filter = document.getElementById('filterStatus').value;
    let priorityFilter = document.getElementById('filterPriority').value;
    let sortBy = document.getElementById('sortBy').value;

    // creates a copy of the tasks array to apply filters and sorting without touching original
    let filtered = tasks.slice();

    // status filter
    if (filter === 'pending') {
        filtered = filtered.filter(function(task) { return task.status === 'Pending'; });
    }
    if (filter === 'completed') {
        filtered = filtered.filter(function(task) { return task.status === 'Completed'; });
    }

    // priority filter
    if (priorityFilter !== 'all') {
        filtered = filtered.filter(function(task) { return task.priority === priorityFilter; });
    }

    // sorting
    if (sortBy === 'name') {
        filtered.sort(function(a, b) { return a.name.localeCompare(b.name); });
    }
    if (sortBy === 'date') {
        filtered.sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
    }

    // build the table rows based on the filtered and sorted tasks
    let tbody = document.getElementById('taskTableBody');
    tbody.innerHTML = '';   // clear existing rows

    // if no tasks match the filters, shows message
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No tasks found.</td></tr>';
        updateSummary();
        updateCharts();
        return;
    }
    // loop through the filtered tasks and create a row for each
    for (let i = 0; i < filtered.length; i++) {
        let task = filtered[i];

        // priority badge color
        let badgeColor = 'secondary';
        if (task.priority === 'High') badgeColor = 'danger';
        if (task.priority === 'Medium') badgeColor = 'warning';
        if (task.priority === 'Low') badgeColor = 'success';

        // strikethrough style for completed tasks
        let strikethrough = task.status === 'Completed' ? 'text-decoration-line-through text-muted' : '';

        // status badge color
        let statusColor = task.status === 'Completed' ? 'success' : 'secondary';

        // create a table row with the task data and action buttons
        let row = document.createElement('tr');
        row.innerHTML =
            '<td class="' + strikethrough + '">' + task.name + '</td>' +
            '<td class="' + strikethrough + '">' + task.desc + '</td>' +
            '<td>' + (task.date || '—') + '</td>' +
            '<td><span class="badge bg-' + badgeColor + '">' + task.priority + '</span></td>' +
            '<td><span class="badge bg-' + statusColor + '">' + task.status + '</span></td>' +
            '<td>' +
                '<button class="btn btn-sm btn-success me-1" onclick="completeTask(' + task.id + ')">✓</button>' +
                '<button class="btn btn-sm btn-warning me-1" onclick="editTask(' + task.id + ')">✎</button>' +
                '<button class="btn btn-sm btn-danger" onclick="deleteTask(' + task.id + ')">✕</button>' +
            '</td>';
        // append the row to the table body
        tbody.appendChild(row);
    }
    // update the summary numbers and charts after rendering the tasks
    updateSummary();
    updateCharts();
}

// updates the summary section with total, completed, and pending task counts
function updateSummary() {
    let total     = tasks.length;
    let completed = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status === 'Completed') completed++;
    }
    let pending = total - completed;

    document.getElementById('totalTasks').textContent     = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent   = pending;
}

// Chart logic

// null until the charts are created, then used for updating
let barChart = null;
let pieChart = null;

// updates the bar and pie charts based on the current tasks data
function updateCharts() {
    let completed = 0;
    let high = 0, medium = 0, low = 0;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status === 'Completed') completed++;
        if (tasks[i].priority === 'High') high++;
        if (tasks[i].priority === 'Medium') medium++;
        if (tasks[i].priority === 'Low') low++;
    }
    let pending = tasks.length - completed;

    // bar chart for completed vs pending tasks
    if (barChart) {
        barChart.data.datasets[0].data = [completed, pending];
        barChart.update();
    } else {
        barChart = new Chart(document.getElementById('barChart'), {
            type: 'bar',
            data: {
                labels: ['Completed', 'Pending'],
                datasets: [{
                    label: 'Tasks',
                    data: [completed, pending],
                    backgroundColor: ['#198754', '#6c757d']
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });
    }

    // Pie chart for priority
    if (pieChart) {
        pieChart.data.datasets[0].data = [high, medium, low];
        pieChart.update();
    } else {
        pieChart = new Chart(document.getElementById('pieChart'), {
            type: 'pie',
            data: {
                labels: ['High', 'Medium', 'Low'],
                datasets: [{
                    data: [high, medium, low],
                    backgroundColor: ['#dc3545', '#ffc107', '#198754']
                }]
            },
            options: { responsive: true }
        });
    }
}

// initial render to show any existing tasks
renderTasks();