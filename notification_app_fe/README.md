# Priority Inbox Frontend - React/Next.js

A modern, responsive React/Next.js application for displaying and managing notifications with smart priority-based sorting.

## Features

- 📱 **Fully Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ⭐ **Priority Inbox**: View top 10 most important notifications
- 📭 **All Notifications**: Browse complete notification history
- 🔍 **Advanced Search**: Search notifications by title or message
- 🏷️ **Type Filtering**: Filter by notification type (Placement, Result, Event)
- ✓ **Read/Unread Status**: Distinguish between read and unread notifications
- 📊 **Real-time Statistics**: Track notification counts and metrics
- 🎨 **Beautiful UI**: Modern design with smooth animations
- ⚡ **Fast Performance**: Optimized rendering and caching

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
cd notification_app_fe
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
notification_app_fe/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── page.module.css     # Home styles
│   ├── globals.css         # Global styles
│   ├── priority-inbox/     # Priority Inbox page
│   │   ├── page.tsx
│   │   └── page.module.css
│   └── all-notifications/  # All Notifications page
│       ├── page.tsx
│       └── page.module.css
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Pages

### Home Page (/)

Landing page featuring:
- Overview of the application
- Links to Priority Inbox and All Notifications
- Feature highlights
- Priority scoring explanation

**URL**: http://localhost:3000/

### Priority Inbox Page (/priority-inbox)

Displays top-N most important unread notifications:
- Configurable top-N selection (5, 10, 15, 20)
- Priority score display for each notification
- Type and priority badges
- Unread notification indicator (blinking dot)
- Recency information (e.g., "2h ago")
- Auto-refresh button

**URL**: http://localhost:3000/priority-inbox

**Features**:
- Sort by priority score (highest first)
- View detailed notification information
- Quick stats
- Information about priority calculation

### All Notifications Page (/all-notifications)

Browse complete notification history with advanced filtering:
- Search by title/message
- Filter by notification type
- Filter by read/unread status
- View statistics (Total, Unread, Placement, Results)
- Quick access to Priority Inbox

**URL**: http://localhost:3000/all-notifications

**Filters**:
- **Type**: All Types, Placement, Result, Event
- **Status**: All, Unread, Read
- **Search**: Full-text search across titles and messages

## API Integration

The application connects to:
```
http://4.224.186.213/evaluation-service/notifications
```

### Response Format

```json
{
  "id": "notif_123",
  "recipient_id": "student_456",
  "type": "info",
  "priority": "urgent",
  "title": "Placement Opportunity",
  "message": "...",
  "notification_type": "Placement",
  "status": "delivered",
  "is_read": false,
  "created_at": "2024-01-15T10:30:00Z"
}
```

## UI/UX Highlights

### Color Scheme

- **Background**: Purple gradient (#667eea → #764ba2)
- **Primary**: Blue (#667eea)
- **Secondary**: Purple (#764ba2)
- **Accent Colors**:
  - Placement: Blue (#1976d2)
  - Result: Purple (#7b1fa2)
  - Event: Green (#388e3c)

### Icons

- Placement: 💼
- Result: 📊
- Event: 📅
- Unread: 🔴
- Priority Inbox: ⭐
- All Notifications: 📭

### Responsive Breakpoints

- **Desktop**: Full layout (>768px)
- **Tablet**: Adjusted grid (481px - 768px)
- **Mobile**: Single column (<480px)

## Performance Optimizations

1. **Lazy Loading**: Images and components loaded on-demand
2. **Memoization**: React memo for preventing unnecessary re-renders
3. **CSS Modules**: Scoped styling to prevent conflicts
4. **Image Optimization**: Next.js Image component used where applicable
5. **Code Splitting**: Automatic route-based code splitting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Styling

- **CSS Framework**: Native CSS with CSS Modules
- **No External UI Libraries**: Custom-built components (as per requirements)
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth fade-in and slide-in effects

## API Endpoints Used

### Get All Notifications

```
GET /notifications
```

Returns array of notifications for display.

## Troubleshooting

### Issue: Can't connect to API

**Solution**: Ensure the API server is running at `http://4.224.186.213:8080` or update the API endpoint in the code.

### Issue: Styling issues on mobile

**Solution**: Clear browser cache (Ctrl+Shift+Delete) and reload.

### Issue: Notifications not loading

**Solution**: 
1. Check browser console for errors (F12)
2. Verify API is accessible
3. Check CORS settings if needed

## Development Tips

1. **Hot Reload**: Changes automatically reload (no need to restart)
2. **Debug Mode**: Open DevTools (F12) to inspect elements
3. **Performance**: Use Next.js built-in profiling tools
4. **Testing**: Test responsive design using device emulation in DevTools

## Deployment

### To Netlify

```bash
npm run build
npm run export  # if needed
```

### To Vercel

```bash
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## License

ISC

## Support

For issues or questions, please refer to the main project documentation or open an issue on GitHub.

---

**Built with ❤️ using Next.js and React**
