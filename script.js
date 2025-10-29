document.addEventListener('DOMContentLoaded', () => {
    const coursesContainer = document.getElementById('courses-container');
    const addMoreCoursesBtn = document.getElementById('add-more-courses');
    const calculateGpaBtn = document.getElementById('calculate-gpa');
    const clearCoursesBtn = document.getElementById('clear-courses');
    const gpaOutput = document.getElementById('gpa-output');
    const storageKey = 'gpaCalculatorData'; // Key to store data in localStorage

    // Function to create a new course row (same as before)
    function createCourseRow(courseName = '', credits = '', grade = '4.0') {
        const courseRow = document.createElement('div');
        courseRow.classList.add('course-row');
        courseRow.innerHTML = `
            <input type="text" class="course-name" value="${courseName}" placeholder="Course Name">
            <input type="number" class="credits" value="${credits}" min="1" placeholder="Credits">
            <select class="grade">
                <option value="4.0">A</option>
                <option value="3.7">A-</option>
                <option value="3.3">B+</option>
                <option value="3.0">B</option>
                <option value="2.7">B-</option>
                <option value="2.3">C+</option>
                <option value="2.0">C</option>
                <option value="1.7">C-</option>
                <option value="1.3">D+</option>
                <option value="1.0">D</option>
                <option value="0.0">F</option>
            </select>
        `;
        // Set selected grade
        const selectElement = courseRow.querySelector('.grade');
        selectElement.value = grade;
        return courseRow;
    }

    // --- NEW: Function to save all courses to localStorage ---
    function saveCourses() {
        const courses = [];
        document.querySelectorAll('.course-row').forEach(row => {
            const name = row.querySelector('.course-name').value;
            const credits = row.querySelector('.credits').value;
            const grade = row.querySelector('.grade').value;
            courses.push({ name, credits, grade });
        });
        localStorage.setItem(storageKey, JSON.stringify(courses));
    }

    // --- NEW: Function to load the default rows from your image ---
    function loadDefaultRows() {
        // These values match your image
        coursesContainer.appendChild(createCourseRow('Differential Eqn', '2', '4.0'));
        coursesContainer.appendChild(createCourseRow('DSA', '2', '3.3'));
        coursesContainer.appendChild(createCourseRow('Com', '5', '3.3'));
        coursesContainer.appendChild(createCourseRow('Linear Alge', '3', '3.3'));
        coursesContainer.appendChild(createCourseRow('Discrete', '3', '3.7'));
        coursesContainer.appendChild(createCourseRow('Elec', '3', '3.0'));
    }

    // --- NEW: Function to load courses from localStorage or show defaults ---
    function loadCourses() {
        const savedData = localStorage.getItem(storageKey);
        
        // Clear any rows hard-coded in the HTML
        coursesContainer.innerHTML = ''; 

        if (savedData) {
            const courses = JSON.parse(savedData);
            if (courses.length > 0) {
                // If we have saved data, build rows from it
                courses.forEach(course => {
                    coursesContainer.appendChild(createCourseRow(course.name, course.credits, course.grade));
                });
            } else {
                // User cleared all courses and reloaded
                coursesContainer.appendChild(createCourseRow());
            }
        } else {
            // First time visiting, load the defaults
            loadDefaultRows();
        }
    }

    // --- UPDATED Event Listeners ---

    // Event listener for "Add More Courses" button
    addMoreCoursesBtn.addEventListener('click', () => {
        coursesContainer.appendChild(createCourseRow());
        saveCourses(); // Save after adding a new row
    });

    // Event listener for "Calculate GPA" button
    calculateGpaBtn.addEventListener('click', () => {
        let totalGradePoints = 0;
        let totalCredits = 0;
        let hasValidInput = false;

        document.querySelectorAll('.course-row').forEach(row => {
            const creditsInput = row.querySelector('.credits');
            const gradeSelect = row.querySelector('.grade');

            const credits = parseFloat(creditsInput.value);
            const gradePoint = parseFloat(gradeSelect.value);

            if (!isNaN(credits) && credits > 0 && !isNaN(gradePoint)) {
                totalGradePoints += credits * gradePoint;
                totalCredits += credits;
                hasValidInput = true;
            }
        });

        if (hasValidInput && totalCredits > 0) {
            // Using toFixed(3) as in your provided code
            const gpa = (totalGradePoints / totalCredits).toFixed(3);
            gpaOutput.textContent = `Your GPA: ${gpa}`;
        } else {
            gpaOutput.textContent = 'Enter course details to calculate GPA.';
        }
        
        saveCourses(); // Save when user calculates
    });

    // Event listener for "Clear" button
    clearCoursesBtn.addEventListener('click', () => {
        coursesContainer.innerHTML = ''; // Clears all existing rows
        coursesContainer.appendChild(createCourseRow()); // Add one fresh row
        gpaOutput.textContent = ''; // Clear GPA output
        saveCourses(); // Save the new "empty" state
    });

    // --- NEW: Auto-save on any change ---
    // These listeners will save data whenever you type or select a new grade
    coursesContainer.addEventListener('input', saveCourses);
    coursesContainer.addEventListener('change', saveCourses);

    // --- INITIALIZATION ---
    // Load courses from storage (or defaults) when the page loads
    loadCourses();
});