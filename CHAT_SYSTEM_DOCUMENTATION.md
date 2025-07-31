# Real-Time Chat System Documentation

## Overview
A comprehensive real-time chat system enabling bidirectional communication between doctors and users (patients) with modern UI, image sharing capabilities, and database persistence.

## Architecture

### Backend (Flask)
- **Framework**: Flask with SQLAlchemy ORM
- **Database**: SQLite with enhanced Message model
- **File Upload**: Secure image upload with file validation
- **API Endpoints**: RESTful design with CORS support

### Frontend (React.js)
- **Framework**: React with hooks and context
- **Styling**: Modern CSS with animations and responsive design
- **Components**: Modular chat components with reusable UI elements
- **Real-time Updates**: Polling mechanism for live message updates

## Database Schema

### Enhanced Message Model
```python
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, nullable=False)
    receiver_id = db.Column(db.Integer, nullable=False)
    sender_type = db.Column(db.String(20), nullable=False)  # 'user' or 'doctor'
    receiver_type = db.Column(db.String(20), nullable=False)  # 'user' or 'doctor'
    content = db.Column(db.Text, nullable=True)  # Text content (nullable for image-only messages)
    image_url = db.Column(db.String(255), nullable=True)  # Image attachment URL
    message_type = db.Column(db.String(20), default='text')  # 'text', 'image', 'mixed'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
```

## API Endpoints

### Chat Conversations
- **GET** `/chat/conversations/<user_type>/<user_id>`
  - Fetches all conversations for a user or doctor
  - Returns conversation partners with metadata
  - Includes last message preview and timestamps

### Chat Messages
- **GET** `/chat/messages`
  - Query params: `sender_id`, `receiver_id`, `sender_type`, `receiver_type`
  - Fetches messages between two participants
  - Returns chronological message list with metadata

### Send Message
- **POST** `/chat/send`
  - Form data support for text + image uploads
  - Validates file types (jpg, jpeg, png, gif)
  - Stores images in `/uploads/chat_images/` directory
  - Returns created message with metadata

### Doctor List for Chat
- **GET** `/chat/doctors`
  - Returns all available doctors for user chat selection
  - Includes doctor profiles and specialties

## Frontend Components

### Chat.jsx
Modern chat interface with:
- **Conversation List**: Displays all chat partners with avatars and last messages
- **Message Display**: Bubble-style messages with timestamps and status indicators
- **Image Upload**: Drag-and-drop image sharing with preview
- **Real-time Updates**: 2-second polling for new messages
- **Responsive Design**: Mobile-friendly layout with adaptive UI

### ChatModal.jsx
Modal overlay system:
- **Backdrop Blur**: Modern glass-morphism effect
- **Responsive Positioning**: Centered modal with responsive sizing
- **Animation Support**: Smooth open/close transitions
- **Close Handlers**: Click-outside and ESC key support

### Integration Points
- **User Dashboard**: Chat button in sidebar opens modal interface
- **Doctor Dashboard**: Dedicated chat section with patient selection
- **Authentication**: User/doctor session management

## Features

### Core Functionality
1. **Bidirectional Messaging**: Users and doctors can send/receive messages
2. **Image Sharing**: Upload and share images in conversations
3. **Real-time Updates**: Messages appear instantly with polling
4. **Message History**: Complete conversation history persistence
5. **User Authentication**: Secure access based on login status

### UI/UX Features
1. **Modern Design**: Clean, medical-professional interface
2. **Responsive Layout**: Works on desktop, tablet, and mobile
3. **Image Preview**: Inline image display with full-size modal
4. **Typing Indicators**: Visual feedback during message composition
5. **Timestamp Display**: Relative time formatting (e.g., "2 minutes ago")
6. **Online Status**: Visual indicators for user availability

### Technical Features
1. **File Upload Security**: Type validation and secure filename handling
2. **Error Handling**: Comprehensive error states and user feedback
3. **Performance**: Efficient message fetching with pagination support
4. **Cross-Origin Support**: CORS configuration for API access
5. **Database Optimization**: Indexed queries for message retrieval

## File Structure

```
src/
├── components/
│   ├── Chat/
│   │   ├── Chat.jsx           # Main chat interface
│   │   ├── Chat.css           # Chat styling
│   │   ├── ChatModal.jsx      # Modal wrapper
│   │   └── ChatModal.css      # Modal styling
│   └── ...
├── pages/
│   ├── pregnancydashboard.jsx # User dashboard with chat integration
│   ├── doctordashboard.jsx    # Doctor dashboard with chat section
│   └── ...
└── ...

backend/
├── uploads/
│   ├── chat_images/           # Chat image storage
│   └── doctor_photos/         # Doctor profile photos
├── app.py                     # Main Flask application with chat APIs
├── model.py                   # Database models including enhanced Message
└── ...
```

## Usage Examples

### For Users (Patients)
1. Navigate to pregnancy dashboard
2. Click "Chat with Doctors" in sidebar
3. Select doctor from available list
4. Send text messages or upload images
5. Receive real-time responses from doctors

### For Doctors
1. Access doctor dashboard
2. Navigate to "Chat" section
3. Select patient from patient list
4. View conversation history
5. Send responses with text or images

## Security Considerations

1. **File Upload Validation**: Only allowed image formats (jpg, jpeg, png, gif)
2. **Secure Filenames**: Using secure_filename() to prevent path traversal
3. **Authentication**: Session-based user/doctor verification
4. **CORS Protection**: Configured for specific origins
5. **SQL Injection Prevention**: SQLAlchemy ORM with parameterized queries

## Performance Optimizations

1. **Efficient Queries**: Optimized database queries with joins
2. **Image Compression**: Client-side image optimization before upload
3. **Pagination Support**: Message pagination for large conversations
4. **Caching Strategy**: Static file serving with proper headers
5. **Polling Optimization**: Intelligent polling with backoff strategies

## Future Enhancements

1. **WebSocket Integration**: Real-time updates without polling
2. **Message Encryption**: End-to-end encryption for sensitive data
3. **File Types**: Support for documents, audio, and video
4. **Group Chat**: Multi-participant conversations
5. **Message Search**: Full-text search across conversation history
6. **Push Notifications**: Browser notifications for new messages
7. **Message Status**: Read receipts and delivery confirmations
8. **Emoji Reactions**: Message reactions and emoji support

## Testing

### Backend Testing
- Unit tests for API endpoints
- Database model validation
- File upload security testing
- Error handling verification

### Frontend Testing
- Component rendering tests
- User interaction testing
- Responsive design validation
- Image upload functionality

## Deployment Notes

1. **Environment Variables**: Configure file upload paths and database URLs
2. **Static File Serving**: Set up proper static file serving for images
3. **Database Migration**: Run migrations for Message model updates
4. **CORS Configuration**: Update CORS settings for production domains
5. **File Storage**: Consider cloud storage for production image uploads

This chat system provides a complete, production-ready communication solution for the healthcare platform, enabling secure and efficient doctor-patient interactions with modern UI and robust technical architecture.
