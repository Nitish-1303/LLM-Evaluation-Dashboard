# Demo Scenarios & Test Cases

## Scenario 1: Happy Path - Complete Review Flow

### Steps:
1. **Login**
   - Enter name: "Alice Johnson"
   - Click Continue
   - ✅ Should see dashboard with header showing "👤 Alice Johnson"

2. **View Dashboard**
   - Click "Dashboard" tab
   - ✅ Should see 5 total tasks, 5 pending, 0 reviewed
   - ✅ Average rating should be 0 (no feedback yet)

3. **Review First Task**
   - Click "Review Tasks" tab
   - Click "Review" on "Explain quantum computing..."
   - ✅ Modal opens with full prompt and output

4. **Submit Feedback**
   - Rating: 4 stars
   - Comments: "Clear explanation but could use more examples"
   - Corrected Output: (leave empty)
   - Click "Submit Feedback"
   - ✅ Modal closes
   - ✅ Task removed from list (now 4 pending tasks)

5. **Check Dashboard**
   - Click "Dashboard" tab
   - ✅ Should show 5 total, 4 pending, 1 reviewed
   - ✅ Average rating: 4.00
   - ✅ Rating distribution shows 1 task with 4 stars

6. **View Feedback**
   - Click "All Feedback" tab
   - ✅ Should see 1 feedback entry
   - ✅ Shows 4 stars, Alice Johnson, today's date
   - ✅ Shows the comment

---

## Scenario 2: Regenerate Output

### Steps:
1. Click "Review Tasks" tab
2. Click "Review" on any task
3. Note the current output
4. Click "Regenerate Output"
5. ✅ Output should update with "[Regenerated]" prefix and timestamp
6. ✅ Form data (rating, comments) should remain intact
7. Fill out feedback and submit
8. ✅ Should work normally

---

## Scenario 3: Multiple Reviews

### Steps:
1. Review 3 different tasks with different ratings:
   - Task 1: 5 stars - "Excellent, very clear"
   - Task 2: 2 stars - "Too vague, needs improvement"
   - Task 3: 4 stars - "Good but could be better"

2. Go to Dashboard
   - ✅ Should show 5 total, 2 pending, 3 reviewed
   - ✅ Average rating: (5+2+4)/3 = 3.67
   - ✅ Rating distribution:
     - 5 stars: 1
     - 4 stars: 1
     - 3 stars: 0
     - 2 stars: 1
     - 1 star: 0

---

## Scenario 4: Filtering Feedback

### Setup:
- Have at least 3 feedback entries with different ratings

### Steps:
1. **Filter by High Ratings**
   - Go to "All Feedback" tab
   - Min Rating: 4
   - Max Rating: 5
   - Click "Apply Filters"
   - ✅ Should only show 4-5 star feedback

2. **Filter by Low Ratings**
   - Min Rating: 1
   - Max Rating: 2
   - Click "Apply Filters"
   - ✅ Should only show 1-2 star feedback

3. **Filter by Reviewer**
   - Clear rating filters
   - Enter reviewer name: "Alice"
   - Click "Apply Filters"
   - ✅ Should only show Alice's feedback

4. **Clear Filters**
   - Clear all filter fields
   - Click "Apply Filters"
   - ✅ Should show all feedback

---

## Scenario 5: Export Functionality

### Steps:
1. Submit at least 2 feedback entries
2. Go to "All Feedback" tab
3. Click "Export JSON"
4. ✅ Should download "feedback-export.json"
5. Open the file
6. ✅ Should contain valid JSON with all feedback
7. ✅ Should include taskId, rating, comments, reviewer, createdAt

---

## Scenario 6: Validation Testing

### Test 1: Empty Comments
1. Open review modal
2. Select rating: 3
3. Leave comments empty
4. Try to submit
5. ✅ Browser should show "Please fill out this field"

### Test 2: Rating Required
1. Open review modal
2. Enter comments but don't select rating
3. Try to submit
4. ✅ Should submit with default rating (3)

### Test 3: Corrected Output (Optional)
1. Open review modal
2. Fill rating and comments
3. Leave corrected output empty
4. Submit
5. ✅ Should work fine (optional field)

---

## Scenario 7: Logout and Re-login

### Steps:
1. Login as "Bob Smith"
2. Review 1 task
3. Click "Logout" button
4. ✅ Should return to login screen
5. Login as "Carol White"
6. ✅ Should see dashboard with "👤 Carol White"
7. Review another task
8. Go to "All Feedback"
9. ✅ Should see feedback from both Bob and Carol

---

## Scenario 8: Persistent Login

### Steps:
1. Login as "David Lee"
2. Review 1 task
3. Close browser tab
4. Open new tab to `http://localhost:3000`
5. ✅ Should automatically be logged in as David Lee
6. ✅ Should not see login screen

---

## Scenario 9: API Testing (Postman/Browser)

### Test 1: Get Pending Tasks
```
GET http://localhost:5000/api/tasks
```
✅ Should return array of pending tasks
✅ Each task should have: _id, prompt, output, status, createdAt

### Test 2: Submit Feedback
```
POST http://localhost:5000/api/tasks/{taskId}/feedback
Content-Type: application/json

{
  "rating": 4,
  "comments": "Test feedback",
  "reviewer": "API Tester"
}
```
✅ Should return success: true
✅ Task status should change to "reviewed"

### Test 3: Get Statistics
```
GET http://localhost:5000/api/stats
```
✅ Should return totalTasks, pendingTasks, reviewedTasks, avgRating, ratingDistribution

### Test 4: Get Filtered Feedback
```
GET http://localhost:5000/api/feedback?minRating=4&maxRating=5
```
✅ Should return only 4-5 star feedback

### Test 5: Regenerate Output
```
POST http://localhost:5000/api/tasks/{taskId}/regenerate
```
✅ Should return updated output with [Regenerated] prefix

---

## Scenario 10: Error Handling

### Test 1: Invalid Rating
```
POST http://localhost:5000/api/tasks/{taskId}/feedback
{
  "rating": 6,
  "comments": "Test",
  "reviewer": "Tester"
}
```
✅ Should return 400 error: "Rating must be between 1 and 5"

### Test 2: Missing Comments
```
POST http://localhost:5000/api/tasks/{taskId}/feedback
{
  "rating": 4,
  "comments": "",
  "reviewer": "Tester"
}
```
✅ Should return 400 error: "Comments are required"

### Test 3: Invalid Task ID
```
POST http://localhost:5000/api/tasks/invalid-id/feedback
{
  "rating": 4,
  "comments": "Test",
  "reviewer": "Tester"
}
```
✅ Should return 404 error: "Task not found"

---

## Scenario 11: Responsive Design

### Steps:
1. Open browser DevTools
2. Toggle device toolbar (mobile view)
3. Test on different screen sizes:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)

### Check:
- ✅ Login screen looks good on mobile
- ✅ Dashboard stats stack vertically on mobile
- ✅ Task list is readable on small screens
- ✅ Review modal is scrollable on mobile
- ✅ Navigation tabs work on mobile
- ✅ Filters stack vertically on mobile

---

## Scenario 12: Complete All Tasks

### Steps:
1. Review all 5 tasks
2. Go to "Review Tasks" tab
3. ✅ Should show "No pending tasks" message
4. Go to Dashboard
5. ✅ Should show 5 total, 0 pending, 5 reviewed
6. ✅ Average rating should reflect all 5 reviews

---

## Performance Checklist

- ✅ Page loads in < 2 seconds
- ✅ API responses in < 500ms
- ✅ No console errors
- ✅ Smooth animations and transitions
- ✅ No memory leaks (check DevTools)
- ✅ Images/assets load properly

---

## Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## Demo Day Checklist

Before presenting:
- [ ] Backend server running
- [ ] Frontend dev server running
- [ ] Database seeded with 5 tasks
- [ ] Browser open to localhost:3000
- [ ] DevTools closed (unless showing)
- [ ] Clear localStorage (fresh start)
- [ ] Close unnecessary tabs
- [ ] Zoom level at 100%
- [ ] Full screen browser
- [ ] Notifications disabled

---

**Ready to impress! 🚀**
