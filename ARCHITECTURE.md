# 🏗️ TTS Generator Architecture

This document provides a comprehensive overview of the TTS Generator's architecture, design patterns, and implementation details.

## 📁 Project Structure

```
TTS-Generator/
├── src/                          # Source code directory
│   ├── config/                   # Configuration management
│   │   └── app.config.ts        # Centralized app configuration
│   ├── controllers/              # Business logic controllers
│   │   └── tts.controller.ts    # Main TTS processing controller
│   ├── services/                 # Core services layer
│   │   ├── tts-api.service.ts   # TikTok API integration
│   │   └── worker-pool.service.ts # Worker pool management
│   ├── ui/                       # User interface components
│   │   ├── banner.ts            # Banner and visual components
│   │   └── input-handlers.ts    # User input collection
│   └── utils/                    # Utility functions
│       ├── text-processor.ts    # Text processing utilities
│       └── error-handler.ts     # Error handling utilities
├── types.ts                      # TypeScript type definitions
├── index.ts                      # Application entry point
├── worker.ts                     # Web Worker for parallel processing
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── biome.json                    # Code formatting configuration
├── README.md                     # Project documentation
├── ARCHITECTURE.md               # This file
└── .gitignore                    # Git ignore rules
```

## 🎯 Design Principles

### 1. **Separation of Concerns**
- **Controllers**: Handle business logic and orchestration
- **Services**: Manage external integrations and core functionality
- **UI Components**: Handle user interaction and presentation
- **Utils**: Provide reusable utility functions

### 2. **Single Responsibility Principle**
Each class and module has a single, well-defined responsibility:
- `TTSController`: Orchestrates the TTS workflow
- `TTSApiService`: Manages API communication
- `WorkerPoolService`: Handles parallel processing
- `TextProcessor`: Processes and validates text
- `BannerUI`: Manages visual presentation
- `InputHandlers`: Collects user input

### 3. **Dependency Injection**
Services are injected where needed, making the code testable and modular.

### 4. **Configuration Management**
All configuration is centralized in `app.config.ts`, making it easy to modify behavior without changing code.

## 🔧 Core Components

### Application Entry Point (`index.ts`)
```typescript
class TTSGeneratorApp {
  // Main application orchestration
  // Handles lifecycle, error recovery, and user flow
}
```

### TTS Controller (`src/controllers/tts.controller.ts`)
```typescript
class TTSController {
  // Orchestrates the entire TTS workflow
  // Coordinates between services and UI components
  static async process(): Promise<void>
}
```

### TTS API Service (`src/services/tts-api.service.ts`)
```typescript
class TTSApiService {
  // Handles TikTok API integration
  // Implements caching and rate limiting
  static async createAudioFromText(): Promise<string | null>
}
```

### Worker Pool Service (`src/services/worker-pool.service.ts`)
```typescript
class WorkerPoolService {
  // Manages a pool of web workers for parallel processing
  // Handles task queuing and worker lifecycle
  execute(data: WorkerData): Promise<AudioChunk>
}
```

## 🚀 Performance Optimizations

### 1. **Worker Pool Architecture**
- Reuses workers instead of creating new ones for each task
- Optimal worker count based on CPU cores
- Efficient task queuing and distribution

### 2. **Smart Caching**
- Request-level caching to avoid duplicate API calls
- LRU-style cache with size limits
- Cache key generation based on text and voice parameters

### 3. **Streaming I/O**
- Memory-efficient file operations
- Buffer pre-allocation for better performance
- Single-write operations instead of multiple appends

### 4. **Rate Limiting**
- API-friendly request throttling
- Configurable delay between requests
- Prevents overwhelming the external service

### 5. **Optimized Text Processing**
- Efficient chunking algorithm with length tracking
- Minimal string operations
- Smart word boundary detection

## 🛡️ Error Handling Strategy

### 1. **Layered Error Handling**
```
Application Layer → Controller Layer → Service Layer → API Layer
```

### 2. **Error Types**
- **Network Errors**: API communication failures
- **Validation Errors**: Invalid user input
- **Processing Errors**: Text processing failures
- **System Errors**: File system or resource issues

### 3. **Recovery Mechanisms**
- Graceful degradation for partial failures
- User-friendly error messages
- Retry logic for transient failures
- Proper cleanup of resources

## 🎨 UI/UX Design

### 1. **Terminal User Interface (TUI)**
- Beautiful ASCII art banners with gradient colors
- Interactive menus with arrow key navigation
- Real-time progress bars and status indicators
- Consistent visual styling throughout

### 2. **User Experience Flow**
```
Welcome Banner → Main Menu → Input Collection → Processing → Results → Continue/Exit
```

### 3. **Input Validation**
- Real-time validation with helpful error messages
- Multiple input methods (file/manual)
- Secure session ID handling (masked input)

## 📊 Data Flow

### 1. **Text Processing Pipeline**
```
Raw Text → Validation → Cleaning → Chunking → Processing → Audio Generation
```

### 2. **Worker Processing Flow**
```
Text Chunks → Worker Pool → Parallel API Calls → Audio Data → Combination → Output File
```

### 3. **Caching Strategy**
```
Request → Cache Check → API Call (if needed) → Cache Store → Response
```

## 🔧 Configuration System

### Centralized Configuration (`src/config/app.config.ts`)
```typescript
export const AppConfig = {
  files: { /* File paths */ },
  api: { /* API settings */ },
  performance: { /* Performance tuning */ },
  ui: { /* UI configuration */ }
}
```

### Environment-Specific Settings
- Development vs Production configurations
- Performance tuning parameters
- Feature flags and toggles

## 🧪 Testing Strategy

### 1. **Unit Testing**
- Service layer testing with mocked dependencies
- Utility function testing
- Error handling validation

### 2. **Integration Testing**
- End-to-end workflow testing
- API integration testing
- File I/O testing

### 3. **Performance Testing**
- Worker pool efficiency
- Memory usage monitoring
- Processing speed benchmarks

## 🚀 Deployment & Building

### Build Process
```bash
# Development
bun run dev

# Production builds
bun run build          # Current platform
bun run build:all      # All platforms
```

### Binary Distribution
- Self-contained executables
- No runtime dependencies
- Cross-platform compatibility

## 🔮 Future Enhancements

### 1. **Planned Features**
- Multiple voice support
- Batch processing capabilities
- Audio format options (MP3, WAV, etc.)
- Configuration file support

### 2. **Performance Improvements**
- Streaming audio processing
- Advanced caching strategies
- Memory usage optimization
- Network request optimization

### 3. **User Experience**
- GUI version
- Web interface
- Plugin system
- Advanced text preprocessing

## 📈 Monitoring & Observability

### 1. **Performance Metrics**
- Processing time tracking
- Cache hit rates
- Worker utilization
- Memory usage

### 2. **Error Tracking**
- Detailed error logging
- Error categorization
- Recovery success rates

### 3. **Usage Analytics**
- Feature usage statistics
- Performance benchmarks
- User behavior patterns

## 🤝 Contributing Guidelines

### 1. **Code Style**
- TypeScript strict mode
- Biome for formatting
- Consistent naming conventions
- Comprehensive documentation

### 2. **Architecture Principles**
- Maintain separation of concerns
- Follow SOLID principles
- Write testable code
- Document public APIs

### 3. **Performance Considerations**
- Profile before optimizing
- Consider memory usage
- Maintain backward compatibility
- Test on multiple platforms

This architecture provides a solid foundation for a production-ready TTS generator with excellent performance, maintainability, and user experience.