# Design Document

## Overview

This design addresses eight key improvement areas for the plant diagnosis application: environment configuration simplification, loading state optimization, multiple file selection, settings reorganization, Google account integration, guest mode implementation, local storage data management, and comprehensive codebase cleanup. The solution focuses on creating a more streamlined user experience while maintaining code quality and performance.

## Architecture

### Environment Configuration Architecture
- **Single Source Pattern**: Eliminate the sync-env.js mechanism and use Next.js built-in environment variable handling
- **Direct Environment Access**: Frontend will read environment variables directly from process.env at build time
- **Configuration Validation**: Implement runtime validation for required environment variables

### Authentication & Data Storage Architecture
- **Hybrid Authentication**: Support both authenticated (Supabase) and guest (localStorage) modes
- **Data Abstraction Layer**: Create a unified data service that handles both Supabase and localStorage seamlessly
- **Profile Management**: Enhanced profile handling with Google account information extraction

### UI/UX Architecture
- **Optimized Loading States**: Implement debounced loading with minimum display thresholds
- **Enhanced File Selection**: Multi-file selection with drag-and-drop support
- **Centralized Settings**: Consolidated settings dialog with organized sections

## Components and Interfaces

### 1. Environment Configuration

```typescript
// Remove sync-env.js entirely
// Update package.json scripts to remove sync-env calls
// Use Next.js native environment variable handling

interface EnvironmentConfig {
  supabaseUrl: string
  supabaseAnonKey: string
  // Other required env vars
}
```

### 2. Data Storage Abstraction

```typescript
interface DataStorageService {
  // Unified interface for both Supabase and localStorage
  saveDiagnosis(diagnosis: Diagnosis): Promise<void>
  getDiagnoses(): Promise<Diagnosis[]>
  saveUserPreferences(preferences: UserPreferences): Promise<void>
  getUserPreferences(): Promise<UserPreferences>
}

interface UserPreferences {
  language: Language
  theme?: 'light' | 'dark'
  // Other user settings
}

class SupabaseDataService implements DataStorageService {
  // Supabase implementation
}

class LocalStorageDataService implements DataStorageService {
  // localStorage implementation with proper error handling
}
```

### 3. Enhanced Authentication

```typescript
interface AuthState {
  user: User | null
  profile: Profile | null
  isGuest: boolean
  loading: boolean
}

interface GoogleProfile {
  name: string
  email: string
  picture?: string
}

// Enhanced AuthProvider with guest mode support
```

### 4. Loading State Management

```typescript
interface LoadingManager {
  showLoading(operation: string, minDuration?: number): void
  hideLoading(operation: string): void
  isLoading(operation?: string): boolean
}

// Debounced loading with operation tracking
class LoadingStateManager implements LoadingManager {
  private loadingStates: Map<string, boolean>
  private timers: Map<string, NodeJS.Timeout>
  private readonly MIN_LOADING_DURATION = 200
}
```

### 5. Multi-File Selection

```typescript
interface FileSelectionProps {
  multiple?: boolean
  accept?: string
  maxFiles?: number
  onFilesSelected: (files: File[]) => void
}

// Enhanced file input component with drag-and-drop
```

### 6. Settings Management

```typescript
interface SettingsSection {
  id: string
  title: string
  icon: React.ComponentType
  component: React.ComponentType
}

// Reorganized settings dialog with sections:
// - Profile (name, email)
// - Language & Localization
// - Data & Privacy
// - About
```

## Data Models

### Enhanced User Profile
```typescript
interface EnhancedProfile {
  id: string
  email: string
  full_name: string | null
  google_name?: string // From Google OAuth
  google_picture?: string // From Google OAuth
  avatar_url?: string
  language_preference: Language
  created_at: string
  updated_at: string
}
```

### Local Storage Schema
```typescript
interface LocalStorageSchema {
  diagnoses: Diagnosis[]
  userPreferences: UserPreferences
  sessionId: string // For guest sessions
  lastSync?: string
}
```

### Diagnosis Model Enhancement
```typescript
interface Diagnosis {
  id: string
  image_url: string
  result: DiagnosisResult
  confidence: number
  created_at: string
  user_id?: string // Optional for guest mode
  session_id?: string // For guest sessions
}
```

## Error Handling

### Comprehensive Error Management
- **Environment Validation**: Startup checks for required environment variables
- **Storage Fallbacks**: Graceful degradation when localStorage is unavailable
- **Network Error Handling**: Retry mechanisms for API calls
- **User-Friendly Messages**: Clear error messages with actionable suggestions

### Error Boundaries
```typescript
// Global error boundary for React components
// API error interceptors
// Storage operation error handling
```

## Testing Strategy

### Unit Testing
- Data storage service implementations
- Loading state management
- File selection utilities
- Environment configuration validation

### Integration Testing
- Authentication flow (both modes)
- Data persistence across sessions
- Settings synchronization
- Multi-file upload workflow

### User Experience Testing
- Loading state behavior
- Guest mode functionality
- Settings organization
- File selection usability

## Implementation Phases

### Phase 1: Environment & Infrastructure
- Remove sync-env.js mechanism
- Update build scripts
- Implement environment validation
- Clean up package.json

### Phase 2: Data Storage Abstraction
- Create unified data service interface
- Implement localStorage service
- Enhance Supabase service
- Add data migration utilities

### Phase 3: Authentication Enhancement
- Add guest mode support
- Enhance Google profile extraction
- Update AuthProvider
- Implement session management

### Phase 4: UI/UX Improvements
- Optimize loading states
- Implement multi-file selection
- Reorganize settings dialog
- Add language settings integration

### Phase 5: Code Quality & Cleanup
- Remove unused code
- Standardize error handling
- Improve TypeScript types
- Add comprehensive documentation

## Security Considerations

### Guest Mode Security
- No sensitive data in localStorage
- Session isolation
- Clear data cleanup options

### Environment Variables
- Proper validation of public vs private variables
- Runtime checks for required configuration

### Data Privacy
- Clear indication of data storage location
- Easy data export/deletion options
- Transparent privacy controls

## Performance Optimizations

### Loading States
- Debounced loading indicators
- Minimum display duration to prevent flicker
- Operation-specific loading management

### File Handling
- Efficient multi-file processing
- Progress indicators for large uploads
- Memory management for file previews

### Local Storage
- Efficient data serialization
- Storage quota management
- Background cleanup processes

## Migration Strategy

### Existing Users
- Seamless transition from current auth system
- Data preservation during updates
- Backward compatibility during transition

### Environment Configuration
- Gradual removal of sync-env dependency
- Validation of new environment setup
- Rollback procedures if needed