
# YouTube video controller

### Client (React)

* Dashboard displays an unlisted video that is from my YouTube account.
* Edit title/description
* Add comment, reply, delete comment.
* View comments
* Notes section (CRUD)
* Fetch event logs

### Server (Express)

  - Routes for video info + update
  - Routes for comments CRUD
  - Routes for notes CRUD
  - Route for events
  - Auto logging after each action
  - Handles OAuth token refresh

##### API endpoints

| Route                             | Purpose                        |
| --------------------------------- | ------------------------------ |
| `GET /video/details/:id`          | Fetch video details with notes |
| `PATCH /video/update/:id`         | Update title/description       |
| `POST /comments/:videoId`         | Add a comment                  |
| `POST /comments/reply/:commentId` | Reply to a comment             |
| `DELETE /comments/:commentId`     | Delete a comment               |
| `GET /comments/:videoId`          | Fetch all comments             |
| `GET /events`                     | Fetches all events             |
| `POST /notes/:videoId`            | Add Note to video              |
| `PATCH /notes/:noteId`            | Update Note                    |
| `DELETE /notes/:noteId`           | Delete Note                    |


##### Database schema (MongoDB collections)

**Event Collection**

| Field       | Type     | Required | Description                        |
| ----------- | -------- | -------- | ---------------------------------- |
| `_id`       | ObjectId | Yes      | Primary identifier (Mongo default) |
| `videoId`   | String   | Yes      | ID of the YouTube video            |
| `event`     | String   | Yes      | Event message/log data             |
| `createdAt` | Date     | Yes      | Timestamp when event occurred      |

**Note Collection**

| Field       | Type     | Required | Description                        |
| ----------- | -------- | -------- | ---------------------------------- |
| `_id`       | ObjectId | Yes      | Primary identifier (Mongo default) |
| `videoId`   | String   | Yes      | ID of the YouTube video            |
| `note`      | String   | Yes      | Note added by user                 |
| `createdAt` | Date     | Yes      | Timestamp when event occurred      |
